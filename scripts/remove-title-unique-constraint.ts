import { sql } from '../lib/sql';

async function removeUniqueConstraint() {
    console.log('🔧 Removing unique constraint from events.title column...\n');

    try {
        // Drop the unique constraint on the title column
        await sql`
            ALTER TABLE events 
            DROP CONSTRAINT IF EXISTS events_title_key
        `;
        
        console.log('✅ Successfully removed unique constraint from events.title');
        console.log('   Event titles can now be duplicated across different dates.\n');

    } catch (error) {
        console.error('❌ Error removing constraint:', error);
        throw error;
    }
}

removeUniqueConstraint();
