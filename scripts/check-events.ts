import { sql } from '../lib/sql';

async function checkEvents() {
    console.log('🔍 Checking events in database...\n');

    try {
        const events = await sql`
            SELECT id, title, start_date, end_date, category 
            FROM events 
            ORDER BY start_date
        `;

        console.log(`✅ Found ${events.length} events in database:\n`);

        events.forEach((event: Record<string, unknown>) => {
            console.log(`- ${String(event.title ?? '')}`);
            console.log(`  Date: ${String(event.start_date ?? '')}`);
            console.log(`  Category: ${String(event.category ?? 'none')}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error checking events:', error);
    }
}

checkEvents();
