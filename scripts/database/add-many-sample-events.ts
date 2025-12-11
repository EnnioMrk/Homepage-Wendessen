#!/usr/bin/env bunx
import { sql } from '../../lib/sql';

function daysFromNow(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(18, 0, 0, 0);
    return d.toISOString();
}

async function addManyEvents() {
    console.log('Inserting many sample events (idempotent)...');

    const base = [
        'Dorffest',
        'Musikabend',
        'Flohmarkt',
        'Sitzung Ortsrat',
        'Sportturnier',
        'Sommerfest',
        'Weihnachtsmarkt',
        'Kirchenkonzert',
        'Theateraufführung',
        'Lichterfest',
        'Kinderfest',
        'Kochkurs',
        'Bürgerinformation',
        'Bücherflohmarkt',
        'Gartenpflege-Tag',
        'Kino im Park',
        'Kunsthandwerkermarkt',
        'Seniorenkaffee',
        'Jugendtreff',
        'Fahrradtour',
        'Weinprobe',
        'Tanzkurs',
        'Nachbarschaftsgrillen',
        'Umweltaktion',
        'Laternenbau',
    ];

    const categories = [
        'veranstaltung',
        'kultur',
        'sonstiges',
        'sitzung',
        'sport',
        'kultur',
    ];

    try {
        for (let i = 0; i < base.length; i++) {
            const title = `${base[i]} ${new Date().getFullYear()}`;
            const days = 3 + i * 3; // spaced out every ~3 days
            const ev = {
                title,
                description: `${base[i]} - Veranstaltungsbeschreibung für ${title}.`,
                start_date: daysFromNow(days),
                end_date: daysFromNow(days),
                location: i % 2 === 0 ? 'Dorfplatz' : 'Gemeindehaus',
                category: categories[i % categories.length],
                organizer: i % 2 === 0 ? 'Ortsrat' : 'Verein',
            };

            await sql`
                INSERT INTO events (title, description, start_date, end_date, location, category, organizer, created_at, updated_at)
                VALUES (${ev.title}, ${ev.description}, ${ev.start_date}, ${ev.end_date}, ${ev.location}, ${ev.category}, ${ev.organizer}, now(), now())
                ON CONFLICT (title) DO UPDATE SET
                    description = EXCLUDED.description,
                    start_date = EXCLUDED.start_date,
                    end_date = EXCLUDED.end_date,
                    location = EXCLUDED.location,
                    category = EXCLUDED.category,
                    organizer = EXCLUDED.organizer,
                    updated_at = now();
            `;
        }

        const cnt = await sql`SELECT COUNT(*)::int AS count FROM events;`;
        const count = cnt?.[0]?.count ?? 0;
        console.log(
            `Inserted/updated ${base.length} sample events. Total events in DB: ${count}`
        );

        // Show next 5 upcoming events
        const upcoming = await sql`
            SELECT id, title, start_date FROM events
            WHERE start_date >= now()
            ORDER BY start_date ASC
            LIMIT 5
        `;
        console.log('Next 5 upcoming events:');
        for (const r of upcoming) {
            console.log(` - ${r.title} @ ${r.start_date}`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Failed to insert many sample events:', err);
        process.exit(1);
    }
}

addManyEvents();
