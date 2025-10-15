import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function addEventCancellation() {
    console.log('Adding event cancellation support...\n');

    try {
        // Add is_cancelled column to events table
        await sql`
            ALTER TABLE events 
            ADD COLUMN IF NOT EXISTS is_cancelled BOOLEAN DEFAULT FALSE;
        `;
        console.log('✓ Added is_cancelled column to events table');

        // Add cancelled_at column to track when event was cancelled
        await sql`
            ALTER TABLE events 
            ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;
        `;
        console.log('✓ Added cancelled_at column to events table');

        // Add cancelled_by column to track who cancelled the event
        await sql`
            ALTER TABLE events 
            ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(255);
        `;
        console.log('✓ Added cancelled_by column to events table');

        // Create index for cancelled events for better query performance
        await sql`
            CREATE INDEX IF NOT EXISTS idx_events_cancelled 
            ON events(is_cancelled);
        `;
        console.log('✓ Created index on is_cancelled column');

        console.log('\n✅ Event cancellation support added successfully!');
        console.log('\nNew features:');
        console.log('  - Events can now be marked as cancelled');
        console.log('  - Tracks when and by whom events were cancelled');
        console.log('  - Cancelled events remain visible but marked');
        
    } catch (error) {
        console.error('❌ Error adding event cancellation:', error);
        throw error;
    }
}

addEventCancellation()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
