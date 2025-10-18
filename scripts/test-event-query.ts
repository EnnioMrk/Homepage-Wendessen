import { unstable_cache } from 'next/cache';

import { sql } from '../lib/sql';

// Test direct database query
async function testDirectQuery() {
    console.log('🔍 Testing direct database query...\n');

    try {
        const events = await sql`
            SELECT * FROM events 
            ORDER BY start_date ASC
        `;

        console.log(`✅ Direct query found ${events.length} events:\n`);
        events.forEach((event: Record<string, unknown>) => {
            console.log(`- ${String(event.title ?? '')}`);
            console.log(`  start_date: ${String(event.start_date ?? '')}`);
            console.log(`  end_date: ${String(event.end_date ?? '')}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error with direct query:', error);
    }
}

// Test with cache
const getCachedEvents = unstable_cache(
    async () => {
        try {
            const events = await sql`
                SELECT * FROM events 
                ORDER BY start_date ASC
            `;
            return events;
        } catch (error) {
            console.error('Error fetching events:', error);
            throw new Error('Failed to fetch events from database');
        }
    },
    ['all-events'],
    {
        tags: ['events'],
        revalidate: 3600,
    }
);

async function testCachedQuery() {
    console.log('🔍 Testing cached query...\n');

    try {
        const events = await getCachedEvents();

        console.log(`✅ Cached query found ${events.length} events:\n`);
        events.forEach((event: Record<string, unknown>) => {
            console.log(`- ${String(event.title ?? '')}`);
            console.log(`  start_date: ${String(event.start_date ?? '')}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error with cached query:', error);
    }
}

async function runTests() {
    await testDirectQuery();
    console.log('\n' + '='.repeat(60) + '\n');
    await testCachedQuery();
}

runTests();
