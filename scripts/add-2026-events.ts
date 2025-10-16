import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function updateEvents() {
    console.log('🗑️  Deleting old events...\n');

    try {
        // Delete all existing events
        const deleteResult = await sql`DELETE FROM events`;
        console.log(`✅ Deleted all old events\n`);

        console.log('📅 Adding 2026 events...\n');

        // Ortsratssitzungen (Council meetings)
        const ortsratssitzungen = [
            { date: '2026-02-05', title: 'Ortsratssitzung Februar 2026' },
            { date: '2026-05-07', title: 'Ortsratssitzung Mai 2026' },
            { date: '2026-09-03', title: 'Ortsratssitzung September 2026' },
            { date: '2026-10-29', title: 'Ortsratssitzung Oktober 2026' },
        ];

        for (const meeting of ortsratssitzungen) {
            await sql`
                INSERT INTO events (
                    title, 
                    description, 
                    start_date, 
                    end_date, 
                    location, 
                    category, 
                    organizer,
                    verein_id
                )
                VALUES (
                    ${meeting.title},
                    'Öffentliche Sitzung des Ortsrats Wendessen',
                    ${meeting.date + 'T19:30:00'},
                    ${meeting.date + 'T21:30:00'},
                    'Alte Schule',
                    'sitzung',
                    'Ortsrat Wendessen',
                    NULL
                )
            `;
            console.log(`  ✓ Added: ${meeting.title} on ${meeting.date}`);
        }

        // IDW Mitgliederversammlung
        await sql`
            INSERT INTO events (
                title, 
                description, 
                start_date, 
                end_date, 
                location, 
                category, 
                organizer,
                verein_id
            )
            VALUES (
                'IDW Mitgliederversammlung',
                'Jahreshauptversammlung der Initiative Dorf Wendessen',
                '2026-02-09T19:30:00',
                '2026-02-09T22:00:00',
                'Alte Schule',
                'sitzung',
                'Initiative Dorf Wendessen',
                'idw'
            )
        `;
        console.log(`  ✓ Added: IDW Mitgliederversammlung on 2026-02-09`);

        console.log('\n✅ Successfully added all 2026 events!');
        console.log('\n📝 Note: The following need to be added manually or via import:');
        console.log('  - Bücherbus dates (from wendessen.de)');
        console.log('  - SV Wendessen football matches (from fussball.de)');
        console.log('  - Other Verein annual meetings and events (pending contact)');
        console.log('  - Hospizverein events (waiting for Frau Jürgens)');

    } catch (error) {
        console.error('❌ Error updating events:', error);
        throw error;
    }
}

updateEvents();
