#!/usr/bin/env bunx
import { sql } from '../../lib/sql';

function daysFromNow(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
}

async function addSampleContent() {
    console.log('Adding sample events and news (idempotent)...');

    const events = [
        {
            title: 'Frühlingsfest im Dorfzentrum',
            description: 'Ein buntes Fest mit Musik, Essen und Kinderprogramm.',
            start_date: daysFromNow(7),
            end_date: daysFromNow(7),
            location: 'Dorfplatz',
            category: 'veranstaltung',
            organizer: 'Ortsrat',
        },
        {
            title: 'Jahreshauptversammlung des SV Wendessen',
            description: 'Mit Berichten des Vorstands und Neuwahlen.',
            start_date: daysFromNow(14),
            end_date: daysFromNow(14),
            location: 'Gemeindehaus',
            category: 'sitzung',
            organizer: 'SV Wendessen',
        },
        {
            title: 'Sommerkonzert der Chöre',
            description: 'Konzertabend mit lokalen Chören und Gästen.',
            start_date: daysFromNow(30),
            end_date: daysFromNow(30),
            location: 'Kirchplatz',
            category: 'kultur',
            organizer: 'Kirchengemeinde',
        },
        {
            title: 'Kinderflohmarkt',
            description:
                'Flohmarkt organisiert von Eltern für Kinderkleidung und Spielzeug.',
            start_date: daysFromNow(4),
            end_date: daysFromNow(4),
            location: 'Schulhof',
            category: 'sonstiges',
            organizer: 'Elterninitiative',
        },
        {
            title: 'Laternenumzug',
            description: 'Traditioneller Umzug mit anschließendem Punsch.',
            start_date: daysFromNow(60),
            end_date: daysFromNow(60),
            location: 'Straße am Park',
            category: 'veranstaltung',
            organizer: 'Kindergarten',
        },
    ];

    const news = [
        {
            title: 'Neues Gemeinschaftsprojekt gestartet',
            content:
                'Die Dorfgemeinschaft startet ein neues Projekt zur Verschönerung des Dorfplatzes.',
            category: 'community',
            published_date: new Date().toISOString(),
        },
        {
            title: 'Erfolgreiche Spendenaktion für Spielplatz',
            content:
                'Dank großzügiger Spenden konnte der Spielplatz repariert werden.',
            category: 'verein',
            published_date: daysFromNow(-3),
        },
        {
            title: 'Verkehrsänderung ab nächster Woche',
            content:
                'Baumaßnahmen führen zu geänderten Verkehrsführungen im Bereich Hauptstraße.',
            category: 'infrastruktur',
            published_date: daysFromNow(-1),
        },
        {
            title: 'Fotowettbewerb gestartet',
            content:
                'Machen Sie mit beim Fotowettbewerb "Mein Wendessen" und gewinnen Sie Preise.',
            category: 'kultur',
            published_date: daysFromNow(-7),
        },
    ];

    try {
        // Insert events idempotently by title
        for (const ev of events) {
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

        // Insert news idempotently by title
        for (const item of news) {
            await sql`
                INSERT INTO news (title, content, category, published_date, created_at, updated_at)
                VALUES (${item.title}, ${item.content}, ${item.category}, ${item.published_date}, now(), now())
                ON CONFLICT (title) DO UPDATE SET
                    content = EXCLUDED.content,
                    category = EXCLUDED.category,
                    published_date = EXCLUDED.published_date,
                    updated_at = now();
            `;
        }

        console.log('Sample content inserted/updated successfully');
    } catch (err) {
        console.error('Failed to insert sample content:', err);
        process.exit(1);
    }
}

addSampleContent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
