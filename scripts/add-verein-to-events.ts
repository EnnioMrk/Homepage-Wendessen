import { sql } from '../lib/sql';

async function addVereinToEvents() {
    try {
        console.log('🔄 Adding verein_id column to events table...');

        // Add verein_id column
        await sql`
            ALTER TABLE events 
            ADD COLUMN IF NOT EXISTS verein_id VARCHAR(50);
        `;
        console.log('✓ Added verein_id column to events table');

        // Add index for better performance
        await sql`
            CREATE INDEX IF NOT EXISTS idx_events_verein_id ON events(verein_id);
        `;
        console.log('✓ Created index on verein_id column');

        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Error adding verein_id to events:', error);
        throw error;
    }
}

addVereinToEvents();
