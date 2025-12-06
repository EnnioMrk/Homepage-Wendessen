import { sql } from '../lib/sql';
import { uploadToBlob } from '../lib/blob-utils';

function dataUrlToBuffer(dataUrl: string): Buffer {
    const base64Index = dataUrl.indexOf(',');
    if (base64Index === -1) {
        throw new Error('Invalid data URL');
    }
    const base64Data = dataUrl.substring(base64Index + 1);
    return Buffer.from(base64Data, 'base64');
}

async function migrateSharedGalleryImages() {
    console.log('Fetching shared gallery submissions without MinIO URLs...');

    const rows = await sql`
        SELECT id, submission_group_id, image_data, image_filename, image_mime_type
        FROM shared_gallery_submissions
        WHERE (image_url IS NULL OR image_url = '')
        AND image_data IS NOT NULL
    `;

    if (rows.length === 0) {
        console.log('No submissions require migration.');
        return;
    }

    console.log(`Migrating ${rows.length} submissions to MinIO...`);

    let migrated = 0;
    for (const row of rows) {
        try {
            const buffer = dataUrlToBuffer(String(row.image_data));
            const safeFilename = (
                row.image_filename || `shared-gallery-${row.id}.jpg`
            ).replace(/[^a-zA-Z0-9._-]/g, '_');
            const objectKey = `shared-gallery/${
                row.submission_group_id
            }/${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}-${safeFilename}`;

            const blob = await uploadToBlob(objectKey, buffer, {
                contentType: String(
                    row.image_mime_type || 'application/octet-stream'
                ),
                bucket: 'impressions',
            });

            await sql`
                UPDATE shared_gallery_submissions
                SET image_url = ${blob.url},
                    image_storage_path = ${blob.pathname},
                    image_data = NULL,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ${row.id}
            `;

            migrated += 1;
            console.log(`✓ Migrated submission ${row.id} to ${blob.pathname}`);
        } catch (error) {
            console.error(`Failed to migrate submission ${row.id}:`, error);
        }
    }

    console.log(
        `Migration complete. ${migrated} of ${rows.length} submissions updated.`
    );
}

migrateSharedGalleryImages().catch((error) => {
    console.error('Shared gallery migration failed:', error);
    process.exit(1);
});
