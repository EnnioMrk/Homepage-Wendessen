import { sql } from '../lib/sql';

/**
 * Migration script to add new columns for MinIO storage to the portraits table.
 * This should be run BEFORE migrate-portraits-to-minio.ts
 */
async function addPortraitMinioColumns() {
    console.log('Adding MinIO storage columns to portraits table...');

    try {
        // Check if image_url column already exists
        const columnCheck = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'portraits' AND column_name = 'image_url'
        `;

        if (columnCheck.length > 0) {
            console.log(
                'image_url column already exists. Skipping column creation.'
            );
            return;
        }

        // Add image_url column
        console.log('Adding image_url column...');
        await sql`
            ALTER TABLE portraits 
            ADD COLUMN IF NOT EXISTS image_url TEXT
        `;

        // Add image_storage_path column
        console.log('Adding image_storage_path column...');
        await sql`
            ALTER TABLE portraits 
            ADD COLUMN IF NOT EXISTS image_storage_path TEXT
        `;

        console.log('MinIO storage columns added successfully!');
        console.log('\nNext steps:');
        console.log('1. Run: bun run scripts/migrate-portraits-to-minio.ts');
        console.log('2. After migration completes, run:');
        console.log(
            '   ALTER TABLE portraits DROP COLUMN IF EXISTS image_data;'
        );
        console.log(
            '   ALTER TABLE portraits ALTER COLUMN image_url SET NOT NULL;'
        );
    } catch (error) {
        console.error('Error adding MinIO columns:', error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    addPortraitMinioColumns()
        .then(() => {
            console.log('Migration completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Migration failed:', error);
            process.exit(1);
        });
}

export { addPortraitMinioColumns };
