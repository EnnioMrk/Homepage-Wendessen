import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkEvents() {
    console.log('🔍 Checking events in database...\n');

    try {
        const events = await sql`
            SELECT id, title, start_date, end_date, category 
            FROM events 
            ORDER BY start_date
        `;

        console.log(`✅ Found ${events.length} events in database:\n`);

        events.forEach((event: any) => {
            console.log(`- ${event.title}`);
            console.log(`  Date: ${event.start_date}`);
            console.log(`  Category: ${event.category || 'none'}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error checking events:', error);
    }
}

checkEvents();
