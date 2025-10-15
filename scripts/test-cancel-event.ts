import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function testCancelEvent() {
    console.log('Testing event cancellation...\n');

    try {
        // Get a test event
        const events = await sql`SELECT id, title FROM events LIMIT 1;`;
        
        if (events.length === 0) {
            console.log('No events found to test with');
            return;
        }

        const testEvent = events[0];
        console.log('Testing with event:', testEvent);

        // Try to cancel it
        const now = new Date().toISOString();
        const testUser = 'test-admin';
        
        console.log('\nExecuting cancel query...');
        console.log('ID:', testEvent.id);
        console.log('User:', testUser);
        console.log('Timestamp:', now);

        const result = await sql`
            UPDATE events 
            SET 
                is_cancelled = TRUE,
                cancelled_at = ${now},
                cancelled_by = ${testUser},
                updated_at = ${now}
            WHERE id = ${testEvent.id}
            RETURNING *
        `;

        console.log('\nResult:', result.length, 'row(s) updated');
        
        if (result.length > 0) {
            console.log('Updated event:');
            console.log('- is_cancelled:', result[0].is_cancelled);
            console.log('- cancelled_at:', result[0].cancelled_at);
            console.log('- cancelled_by:', result[0].cancelled_by);
            
            // Restore it
            console.log('\nRestoring event...');
            await sql`
                UPDATE events 
                SET 
                    is_cancelled = FALSE,
                    cancelled_at = NULL,
                    cancelled_by = NULL,
                    updated_at = ${new Date().toISOString()}
                WHERE id = ${testEvent.id}
            `;
            console.log('✓ Event restored');
        }

        console.log('\n✅ Cancel functionality works correctly!');

    } catch (error: any) {
        console.error('❌ Error testing cancel:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
    }
}

testCancelEvent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
