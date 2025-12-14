#!/usr/bin/env bunx
import { sql } from '../../lib/sql';

function daysFromNow(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
}

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function sample<T>(arr: T[], n: number) {
    const out: T[] = [];
    const copy = arr.slice();
    while (out.length < n && copy.length) {
        const i = randInt(0, copy.length - 1);
        out.push(copy.splice(i, 1)[0]);
    }
    return out;
}

function dateWithOffsetAndMinutes(days: number, minutesOfDay: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(0, 0, 0, 0);
    const hours = Math.floor(minutesOfDay / 60);
    const minutes = minutesOfDay % 60;
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
}

function determineCategoryAndOrganizer(name: string, categories: string[], organizers: string[]) {
    const n = name.toLowerCase();
    if (/feuerwehr|notfall/.test(n)) return { category: 'notfall', organizer: 'Feuerwehr' };
    if (/sitzung|jahres|bürg|versammlung|vorstand|empfang/.test(n)) return { category: 'sitzung', organizer: 'Ortsrat' };
    if (/konzert|musik|chor|band|open-air|openair|musiknacht|blaskapelle/.test(n)) return { category: 'kultur', organizer: 'Kulturverein' };
    if (/theater|kino|lesung|poetry|autoren|film/.test(n)) return { category: 'kultur', organizer: 'Kulturverein' };
    if (/markt|flohmarkt|basar|bauernmarkt|second-hand|secondhand|marktfrühstück|modeflohmarkt/.test(n)) return { category: 'veranstaltung', organizer: 'Verein Wendessen' };
    if (/sport|lauf|fußball|tischtennis|schach|rad|fahrrad|schwimm|turnier/.test(n)) return { category: 'sport', organizer: 'SV Wendessen' };
    if (/kinder|jugend|kindergarten|schule|kinderkino|kinderfest|jugendtreff/.test(n)) return { category: 'sonstiges', organizer: 'Kindergarten' };
    if (/workshop|kurs|vortrag|seminar|schnupperkurs|töpfer|töpferkurs|näh|koch|back|imker|fotoworkshop/.test(n)) return { category: 'kultur', organizer: 'Verein Wendessen' };
    if (/aktion|pflanz|naturschutz|gewässer|saubere|gewässerpflege|repair|upcycling|kleidertausch|spendenlauf|blutspende|spenden/.test(n)) return { category: 'sonstiges', organizer: 'Verein Wendessen' };

    // Default deterministic mapping using a simple hash of the name
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    const category = categories[h % categories.length];
    const organizer = organizers[h % organizers.length];
    return { category, organizer };
}

async function addSampleContent() {
    console.log('Adding randomized sample events and baseline news (idempotent)...');

    // Number of events to create (default 50). Can be overridden by env var AMOUNT or first CLI arg.
    const arg = process.argv[2];
    const amount = Number(arg ?? process.env.AMOUNT ?? 50);

    // Library of 100+ event types (German names to fit project locale)
    const eventTypes = [
        'Dorffest', 'Jahresmarkt', 'Erntedankfest', 'Weihnachtsmarkt', 'Sommerkonzert', 'Adventsfeier', 'Laternenfest',
        'Kinderfest', 'Seniorennachmittag', 'Bürgerversammlung', 'Feuerwehrübung', 'Flohmarkt', 'Schützenfest', 'Theaterabend',
        'Kino im Park', 'Musiknacht', 'Kunsthandwerkermarkt', 'Kirchweih', 'Tanzabend', 'Sportfest', 'Lauf-Event', 'Radwanderung',
        'Brennerei-Führung', 'Stammtisch', 'Historischer Rundgang', 'Fahrradprüfung', 'Kochkurs', 'Weinprobe', 'Lesung',
        'Vortragsreihe', 'Workshop Fotografie', 'Yoga im Park', 'Meditationsabend', 'Pflanzentauschbörse', 'Upcycling-Workshop',
        'Ehrenamtsmesse', 'Nachbarschaftsbrunch', 'Spieleabend', 'Karaoke-Nacht', 'Konzert der Blaskapelle', 'Chorkonzert',
        'Open-Air-Kino', 'Marktfrühstück', 'Bauernmarkt', 'Schwimmkurs', 'Töpferkurs', 'Nähkurs', 'Filmvorführung',
        'Poetry Slam', 'Straßenmusikfestival', 'Saisoneröffnung', 'Saisonabschluss', 'Fahrradtour', 'Bootstour', 'Grillabend',
        'Kräuterexkursion', 'Bastelstunde', 'Drachensteigen', 'Halloween-Party', 'Silvesterfeier', 'Neujahrsempfang',
        'Osterfeuer', 'Osterbasteln', 'Weihnachtsbasteln', 'Bürgerempfang', 'Aktion Saubere Landschaft', 'Pflanzaktion',
        'Kinderkino', 'Jugendtreff', 'Vorlesetag', 'Bildungsforum', 'Impulsabend', 'Diskussionsrunde', 'Debattierclub',
        'Thementag Mobilität', 'Tag der offenen Tür', 'Besichtigungsrunde', 'Musikworkshop', 'Tanzworkshop', 'Schnupperkurs',
        'Hobbykoch-Show', 'Backkurs', 'Imkerkurs', 'Naturschutzaktion', 'Gewässerpflege', 'Fotoworkshop', 'Gartenfest',
        'Kunstaktion', 'Graffiti-Workshop', 'Jugendbandauftritt', 'Tischtennisturnier', 'Fußballturnier', 'Schachturnier',
        'Modeflohmarkt', 'Second-Hand-Basar', 'Autorenlesung', 'Vortragsabend Gesundheit', 'Blutspendeaktion', 'Spendenlauf',
        'Nachbarschaftsfest', 'Community-Meetup', 'Kleidertauschparty', 'Upcycling-Markt', 'Repair-Café', 'Bücherflohmarkt'
    ];

    const locations = ['Dorfplatz', 'Gemeindehaus', 'Kirchplatz', 'Schulhof', 'Sportplatz', 'Kulturhalle', 'Bürgerhaus', 'Park', 'Feuerwehrhaus', 'Jugendzentrum', 'Waldpark', 'Alte Mühle'];
    const categories = ['veranstaltung', 'sitzung', 'kultur', 'sport', 'notfall', 'sonstiges'];
    const organizers = ['Ortsrat', 'SV Wendessen', 'Kirchengemeinde', 'Kindergarten', 'Elterninitiative', 'Verein Wendessen', 'Kulturverein', 'Feuerwehr'];

    // Prepare selection of types (sample without replacement up to available types)
    const chosenTypes = amount <= eventTypes.length ? sample(eventTypes, amount) : (() => {
        // If amount > library, repeat with random picks
        const out: string[] = [];
        for (let i = 0; i < amount; i++) out.push(choice(eventTypes));
        return out;
    })();

    const events = chosenTypes.map((t) => {
        // random day offset between -30 and +180
        const days = randInt(-30, 180);

        // Determine if event is multi-day. Make multi-day events very rare:
        // probability ≈ 1 / (2 * amount), capped at 2%.
        const multiDayProb = Math.min(0.02, 1 / Math.max(1, amount * 2));
        const isMulti = Math.random() < multiDayProb;
        let durationDays = 0;
        if (isMulti) {
            // Most multi-day events are 1 day (i.e., spanning to next day), occasionally 2 days.
            const maxMulti = Math.min(2, Math.max(1, Math.floor(amount / 50)));
            durationDays = randInt(1, maxMulti);
        }

        // randomize start time in 30-minute steps between 08:00 and 20:00
        const startStep = randInt(16, 40); // 16*30=480min=08:00, 40*30=1200min=20:00
        const start = dateWithOffsetAndMinutes(days, startStep * 30);

        let end: string;
        if (isMulti) {
            const endStep = randInt(16, 40);
            end = dateWithOffsetAndMinutes(days + durationDays, endStep * 30);
        } else {
            // single-day: short duration, usually 30min-3h (1-6 steps of 30min)
            const durationSteps = randInt(1, 6);
            const endStep = Math.min(47, startStep + durationSteps);
            end = dateWithOffsetAndMinutes(days, endStep * 30);
        }

        const location = choice(locations);
        // Determine category and organizer deterministically from the event type
        const mapping = determineCategoryAndOrganizer(t, categories, organizers);
        const category = mapping.category;
        const organizer = mapping.organizer;
        const description = `${t} organisiert von ${organizer} am ${new Date(start).toLocaleDateString('de-DE')} um ${new Date(start).toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'})}. Ort: ${location}.`;
        // Title is just the event type to keep idempotency predictable
        return {
            title: t,
            description,
            start_date: start,
            end_date: end,
            location,
            category,
            organizer,
        };
    });

    const news = [
        {
            title: 'Neues Gemeinschaftsprojekt gestartet',
            content: 'Die Dorfgemeinschaft startet ein neues Projekt zur Verschönerung des Dorfplatzes.',
            category: 'community',
            published_date: new Date().toISOString(),
        },
        {
            title: 'Spielplatz modernisiert',
            content: 'Der Kinderspielplatz am Kirchplatz wurde mit neuen Geräten ausgestattet.',
            category: 'community',
            published_date: daysFromNow(-40),
        },
        {
            title: 'Straßenbau abgeschlossen',
            content: 'Die Sanierungsarbeiten an der Hauptstraße sind beendet.',
            category: 'infrastruktur',
            published_date: daysFromNow(-20),
        },
        {
            title: 'Jugendband gewinnt Wettbewerb',
            content: 'Unsere lokale Jugendband hat den regionalen Musikwettbewerb gewonnen.',
            category: 'kultur',
            published_date: daysFromNow(-10),
        },
        {
            title: 'Erfolgreiche Müllsammelaktion',
            content: 'Viele Helferinnen und Helfer beteiligten sich an der Aktion "Sauberes Wendessen".',
            category: 'community',
            published_date: daysFromNow(-7),
        },
        {
            title: 'Neue Ehrenamtliche im Verein',
            content: 'Der Verein Wendessen begrüßt mehrere neue ehrenamtliche Helfer.',
            category: 'verein',
            published_date: daysFromNow(-3),
        },
        {
            title: 'Bauernmarkt startet nächste Woche',
            content: 'Frische Produkte von lokalen Erzeugern beim Bauernmarkt am Sonntag.',
            category: 'veranstaltung',
            published_date: daysFromNow(2),
        },
        {
            title: 'Fotowettbewerb: Gewinnerbilder ausgestellt',
            content: 'Die besten Einsendungen des Fotowettbewerbs sind ab sofort in der Kulturhalle zu sehen.',
            category: 'kultur',
            published_date: daysFromNow(7),
        },
        {
            title: 'Ausbildungsplatzbörse im Gemeindehaus',
            content: 'Informationstag rund um Ausbildungs- und Jobangebote für Jugendliche.',
            category: 'bildung',
            published_date: daysFromNow(14),
        },
        {
            title: 'Sommerfest mit großem Programm',
            content: 'Live-Musik, Kinderprogramm und Marktstände beim diesjährigen Sommerfest.',
            category: 'veranstaltung',
            published_date: daysFromNow(30),
        },
        {
            title: 'Wasserqualität überprüft',
            content: 'Regelmäßige Proben bestätigen gute Wasserqualität in den öffentlichen Brunnen.',
            category: 'infrastruktur',
            published_date: daysFromNow(-1),
        },
        {
            title: 'Neues Angebot im Jugendzentrum',
            content: 'Das Jugendzentrum bietet jetzt regelmäßige Medienworkshops an.',
            category: 'jugend',
            published_date: daysFromNow(3),
        },
        {
            title: 'Blutspendeaktion erfolgreich',
            content: 'Große Beteiligung bei der Blutspendeaktion – vielen Dank an alle Spender.',
            category: 'gesundheit',
            published_date: daysFromNow(-15),
        },
        {
            title: 'Öffentliche Lesung mit regionaler Autorin',
            content: 'Lesung und Gespräch in der Bibliothek mit anschließender Signierstunde.',
            category: 'kultur',
            published_date: daysFromNow(10),
        },
        {
            title: 'Neue Fahrradstellplätze am Bahnhof',
            content: 'Erweiterung der Abstellmöglichkeiten für Pendlerinnen und Pendler.',
            category: 'infrastruktur',
            published_date: daysFromNow(60),
        }
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

        // Insert baseline news idempotently by title
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

        console.log(`Inserted/updated ${events.length} events and ${news.length} news items`);
    } catch (err) {
        console.error('Failed to insert sample content:', err);
        process.exit(1);
    }
}

addSampleContent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
