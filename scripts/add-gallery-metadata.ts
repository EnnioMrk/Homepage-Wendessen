import { sql } from '../lib/sql';

async function addMetadataColumns() {
    try {
        console.log('Adding metadata columns to shared_gallery_submissions...');
        
        await sql`
            ALTER TABLE shared_gallery_submissions 
            ADD COLUMN IF NOT EXISTS date_taken TIMESTAMP,
            ADD COLUMN IF NOT EXISTS location VARCHAR(100)
        `;
        
        console.log('✓ Metadata columns added');
        console.log('\n✅ Migration completed successfully!');
        
    } catch (error) {
        console.error('Error adding metadata columns:', error);
        throw error;
    }
}

addMetadataColumns();
