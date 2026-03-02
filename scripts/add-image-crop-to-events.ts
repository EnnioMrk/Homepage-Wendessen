import { sql } from '../lib/sql';

async function setupImageCropColumn() {
    console.log('Adding image_crop_data column to events table...');

    try {
        // Check if column exists
        const columnExists = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'events' AND column_name = 'image_crop_data'
    `;

        if (columnExists.length === 0) {
            await sql`
        ALTER TABLE events 
        ADD COLUMN image_crop_data JSONB DEFAULT NULL
      `;
            console.log('✅ image_crop_data column added successfully');
        } else {
            console.log('ℹ️ image_crop_data column already exists');
        }

        console.log('Database schema update complete');
    } catch (error) {
        console.error('❌ Error updating database schema:', error);
        process.exit(1);
    }
}

setupImageCropColumn()
    .then(() => process.exit(0))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
