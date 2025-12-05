import { sql } from '../lib/sql';
import {
    convertToWebP,
    convertDataUrlToWebP,
} from '../lib/image-utils';
import {
    downloadFromBlob,
    uploadToBlob,
    deleteFromBlob,
} from '../lib/blob-utils';

interface GalleryRow {
    id: number;
    filename: string;
    original_name?: string;
    mime_type?: string;
    url?: string;
}

interface SharedGalleryRow {
    id: number;
    submission_group_id: string;
    image_storage_path?: string | null;
    image_url?: string | null;
    image_mime_type?: string | null;
    image_filename?: string | null;
    image_data?: string | null;
}

interface DownloadSource {
    buffer: Buffer;
    contentType?: string;
}

async function fetchFromUrl(url: string): Promise<DownloadSource> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || undefined;
    return { buffer, contentType };
}

async function loadImageSource(options: {
    blobPath?: string | null;
    url?: string | null;
    label: string;
}): Promise<DownloadSource> {
    const { blobPath, url, label } = options;

    if (blobPath) {
        try {
            return await downloadFromBlob(blobPath);
        } catch (error) {
            console.warn(
                `- ${label}: unable to read ${blobPath} from MinIO (${(error as Error).message}).`
            );
        }
    }

    if (url) {
        try {
            return await fetchFromUrl(url);
        } catch (error) {
            console.warn(
                `- ${label}: HTTP fetch failed for ${url} (${(error as Error).message}).`
            );
        }
    }

    throw new Error(`No available source for ${label}`);
}

interface PortraitRow {
    id: number;
    image_data: string;
    image_mime_type: string;
    image_filename?: string | null;
}

function sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function migrateGalleryImages() {
    console.log('\n=== Migrating admin gallery images ===');

    const rows: GalleryRow[] = await sql`
        SELECT id, filename, original_name, mime_type, url
        FROM gallery_images
        WHERE mime_type <> 'image/webp'
           OR filename NOT ILIKE '%.webp'
    `;

    if (rows.length === 0) {
        console.log('No admin gallery images require migration.');
        return;
    }

    for (const row of rows) {
        if (!row.filename) {
            console.warn(`- Gallery image ${row.id} has no filename; skipping.`);
            continue;
        }

        const displayName = row.original_name?.trim().length
            ? row.original_name!
            : row.filename;
        const originalMime = row.mime_type?.trim().length
            ? row.mime_type!
            : 'application/octet-stream';

        try {
            const source = await loadImageSource({
                blobPath: row.filename,
                url: row.url,
                label: `Gallery image ${row.id}`,
            });
            const converted = await convertToWebP(
                source.buffer,
                displayName,
                originalMime
            );

            if (converted.mimeType !== 'image/webp') {
                console.log(
                    `- Gallery image ${row.id}: skipped (type ${converted.mimeType})`
                );
                continue;
            }

            const existingKey = row.filename;
            const targetKey = existingKey?.toLowerCase().endsWith('.webp')
                ? existingKey
                : existingKey?.replace(/\.[^.]+$/, '.webp') || `${existingKey}.webp`;

            const blob = await uploadToBlob(targetKey, converted.buffer, {
                contentType: converted.mimeType,
            });

            await sql`
                UPDATE gallery_images
                SET filename = ${targetKey},
                    mime_type = ${converted.mimeType},
                    size = ${converted.buffer.length},
                    url = ${blob.url}
                WHERE id = ${row.id}
            `;

            if (existingKey && existingKey !== targetKey) {
                try {
                    await deleteFromBlob(existingKey);
                } catch (err) {
                    console.warn(
                        `- Gallery image ${row.id}: unable to delete old key ${existingKey} (${(err as Error).message}).`
                    );
                }
            }

            console.log(`✓ Gallery image ${row.id} converted to WebP`);
        } catch (error) {
            console.error(
                `✗ Failed to migrate gallery image ${row.id}:`,
                error
            );
        }
    }
}

async function migrateSharedGalleryImages() {
    console.log('\n=== Migrating shared gallery submissions ===');

    const rows: SharedGalleryRow[] = await sql`
        SELECT id, submission_group_id, image_storage_path, image_url, image_mime_type, image_filename, image_data
        FROM shared_gallery_submissions
        WHERE image_data IS NOT NULL
           OR COALESCE(image_mime_type, '') <> 'image/webp'
           OR (image_storage_path IS NOT NULL AND image_storage_path NOT ILIKE '%.webp')
           OR (image_url IS NOT NULL AND image_url NOT ILIKE '%.webp')
    `;

    if (rows.length === 0) {
        console.log('No shared gallery submissions require migration.');
        return;
    }

    for (const row of rows) {
        const fallbackFilename = row.image_filename?.trim().length
            ? row.image_filename!
            : `shared-gallery-${row.id}.jpg`;

        try {
            if (row.image_storage_path || row.image_url) {
                const source = await loadImageSource({
                    blobPath: row.image_storage_path || undefined,
                    url: row.image_url || undefined,
                    label: `Shared gallery submission ${row.id}`,
                });
                const mimeType = row.image_mime_type?.trim().length
                    ? row.image_mime_type!
                    : source.contentType || 'application/octet-stream';
                const converted = await convertToWebP(
                    source.buffer,
                    fallbackFilename,
                    mimeType
                );

                if (converted.mimeType !== 'image/webp') {
                    console.log(
                        `- Shared gallery submission ${row.id}: skipped (type ${converted.mimeType})`
                    );
                    continue;
                }

                const existingKey = row.image_storage_path || undefined;
                const targetKey = existingKey
                    ? existingKey.toLowerCase().endsWith('.webp')
                        ? existingKey
                        : existingKey.replace(/\.[^.]+$/, '.webp')
                    : `shared-gallery/${row.submission_group_id || 'ungrouped'}/${Date.now()}-${Math.random()
                          .toString(36)
                          .slice(2, 8)}-${sanitizeFilename(converted.filename)}`;

                const blob = await uploadToBlob(targetKey, converted.buffer, {
                    contentType: converted.mimeType,
                });

                await sql`
                    UPDATE shared_gallery_submissions
                    SET image_mime_type = ${converted.mimeType},
                        image_filename = ${converted.filename},
                        image_url = ${blob.url},
                        image_storage_path = ${targetKey},
                        image_data = NULL,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ${row.id}
                `;

                if (existingKey && existingKey !== targetKey) {
                    try {
                        await deleteFromBlob(existingKey);
                    } catch (err) {
                        console.warn(
                            `- Shared gallery submission ${row.id}: unable to delete old key ${existingKey} (${(err as Error).message}).`
                        );
                    }
                }

                console.log(`✓ Shared gallery submission ${row.id} converted to WebP`);
                continue;
            }

            if (row.image_data) {
                const dataString = row.image_data;
                const converted = dataString.startsWith('data:')
                    ? await convertDataUrlToWebP(dataString, fallbackFilename)
                    : await convertToWebP(
                          Buffer.from(dataString, 'base64'),
                          fallbackFilename,
                          row.image_mime_type || 'application/octet-stream'
                      );

                if (converted.mimeType !== 'image/webp') {
                    console.log(
                        `- Shared gallery submission ${row.id}: skipped (type ${converted.mimeType})`
                    );
                    continue;
                }

                const sanitizedFilename = sanitizeFilename(converted.filename);
                const objectKey = `shared-gallery/${row.submission_group_id || 'ungrouped'}/${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 8)}-${sanitizedFilename}`;

                const blob = await uploadToBlob(objectKey, converted.buffer, {
                    contentType: converted.mimeType,
                });

                await sql`
                    UPDATE shared_gallery_submissions
                    SET image_data = NULL,
                        image_mime_type = ${converted.mimeType},
                        image_filename = ${converted.filename},
                        image_url = ${blob.url},
                        image_storage_path = ${blob.pathname},
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ${row.id}
                `;

                console.log(`✓ Shared gallery submission ${row.id} moved to MinIO & converted`);
                continue;
            }

            console.warn(
                `- Shared gallery submission ${row.id}: no storage path or inline data; skipping.`
            );
        } catch (error) {
            console.error(
                `✗ Failed to migrate shared gallery submission ${row.id}:`,
                error
            );
        }
    }
}

async function migratePortraitImages() {
    console.log('\n=== Migrating portrait submissions ===');

    const rows: PortraitRow[] = await sql`
        SELECT id, image_data, image_mime_type, image_filename
        FROM portraits
        WHERE image_mime_type <> 'image/webp'
    `;

    if (rows.length === 0) {
        console.log('No portraits require migration.');
        return;
    }

    for (const row of rows) {
        try {
            let buffer: Buffer;
            let mimeType = row.image_mime_type || 'application/octet-stream';
            const dataString = row.image_data;

            if (dataString.startsWith('data:')) {
                const matches = dataString.match(/^data:([^;]+);base64,(.+)$/);
                if (!matches) {
                    console.warn(`- Portrait ${row.id}: invalid data URL; skipping.`);
                    continue;
                }
                mimeType = matches[1];
                buffer = Buffer.from(matches[2], 'base64');
            } else {
                buffer = Buffer.from(dataString, 'base64');
            }

            const filename = row.image_filename?.trim().length
                ? row.image_filename!
                : `portrait-${row.id}.jpg`;

            const converted = await convertToWebP(buffer, filename, mimeType);

            if (converted.mimeType !== 'image/webp') {
                console.log(
                    `- Portrait ${row.id}: skipped (type ${converted.mimeType})`
                );
                continue;
            }

            await sql`
                UPDATE portraits
                SET image_data = ${converted.buffer.toString('base64')},
                    image_mime_type = ${converted.mimeType},
                    image_filename = ${converted.filename},
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${row.id}
            `;

            console.log(`✓ Portrait ${row.id} converted to WebP`);
        } catch (error) {
            console.error(`✗ Failed to migrate portrait ${row.id}:`, error);
        }
    }
}

async function main() {
    console.log('Starting image migration to WebP...');
    await migrateGalleryImages();
    await migrateSharedGalleryImages();
    await migratePortraitImages();
    console.log('\n✅ Image migration complete');
}

main().catch((error) => {
    console.error('❌ Image migration failed:', error);
    process.exit(1);
});
