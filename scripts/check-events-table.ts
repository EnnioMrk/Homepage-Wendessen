import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkEventsTable() {
    console.log('Checking events table structure...\n');

    try {
        // Get table columns
        const columns = await sql`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'events'
            ORDER BY ordinal_position;
        `;

        console.log('Events table columns:');
        console.table(columns);

        // Try to get a sample event
        console.log('\nSample event:');
        const sampleEvent = await sql`
            SELECT * FROM events LIMIT 1;
        `;
        
        if (sampleEvent.length > 0) {
            console.log('Sample event columns:', Object.keys(sampleEvent[0]));
            console.log('Sample event data:', sampleEvent[0]);
        } else {
            console.log('No events in database');
        }

    } catch (error) {
        console.error('Error checking table:', error);
    }
}

checkEventsTable()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
