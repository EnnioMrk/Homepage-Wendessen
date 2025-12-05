import { sql } from '../lib/sql';
import { uploadToBlob } from '../lib/blob-utils';

interface OldPortrait {
    id: number;
    name: string;
    image_data: string;
    image_mime_type: string;
    image_filename: string | null;
}

async function migratePortraitsToMinio() {
    console.log('Starting portrait migration to MinIO...');

    try {
        // Check if old column exists
        const columnCheck = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'portraits' AND column_name = 'image_data'
        `;

        if (columnCheck.length === 0) {
            console.log(
                'No image_data column found. Migration may have already been completed or table uses new schema.'
            );
            return;
        }

        // Get all portraits with base64 data
        const portraits = (await sql`
            SELECT id, name, image_data, image_mime_type, image_filename
            FROM portraits
            WHERE image_data IS NOT NULL AND image_data != ''
        `) as OldPortrait[];

        console.log(`Found ${portraits.length} portraits to migrate`);

        let migrated = 0;
        let failed = 0;

        for (const portrait of portraits) {
            try {
                console.log(
                    `Migrating portrait ${portrait.id} (${portrait.name})...`
                );

                // Convert base64 to buffer
                const buffer = Buffer.from(portrait.image_data, 'base64');

                // Determine filename
                const filename =
                    portrait.image_filename ||
                    `portrait-${portrait.id}.${getExtensionFromMime(
                        portrait.image_mime_type
                    )}`;

                // Upload to MinIO
                const blob = await uploadToBlob(
                    `portraits/${filename}`,
                    buffer,
                    {
                        addRandomSuffix: true,
                        contentType: portrait.image_mime_type,
                    }
                );

                console.log(`  Uploaded to: ${blob.url}`);

                // Update the database record with the new URL
                await sql`
                    UPDATE portraits
                    SET image_url = ${blob.url},
                        image_storage_path = ${blob.pathname}
                    WHERE id = ${portrait.id}
                `;

                migrated++;
                console.log(
                    `  ✓ Portrait ${portrait.id} migrated successfully`
                );
            } catch (error) {
                failed++;
                console.error(
                    `  ✗ Failed to migrate portrait ${portrait.id}:`,
                    error
                );
            }
        }

        console.log('\n=== Migration Summary ===');
        console.log(`Total portraits: ${portraits.length}`);
        console.log(`Successfully migrated: ${migrated}`);
        console.log(`Failed: ${failed}`);

        if (failed === 0 && migrated > 0) {
            console.log(
                '\nAll portraits migrated successfully. You can now remove the image_data column:'
            );
            console.log(
                '  ALTER TABLE portraits DROP COLUMN IF EXISTS image_data;'
            );
        }
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
}

function getExtensionFromMime(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
    };
    return mimeToExt[mimeType] || 'jpg';
}

// Run the migration if this script is executed directly
if (require.main === module) {
    migratePortraitsToMinio()
        .then(() => {
            console.log('Migration completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}

export { migratePortraitsToMinio };
