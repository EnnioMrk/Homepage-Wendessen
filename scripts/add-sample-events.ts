import { sql } from '../lib/sql';

async function addSampleEvents() {
    console.log('Adding 10 sample upcoming events...');

    const now = new Date();

    const sampleEvents = [
        {
            title: 'Ortsratssitzung Januar',
            description:
                'Monatliche Sitzung des Ortsrats zur Besprechung aktueller Themen und Anliegen der Gemeinde.',
            start_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 5,
                19,
                0
            ),
            end_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 5,
                21,
                0
            ),
            location: 'Dorfgemeinschaftshaus Wendessen',
            category: 'sitzung',
            organizer: 'Ortsrat Wendessen',
        },
        {
            title: 'Feuerwehrübung',
            description:
                'Regelmäßige Übung der Freiwilligen Feuerwehr Wendessen mit Schwerpunkt auf Brandbekämpfung.',
            start_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 8,
                18,
                30
            ),
            end_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 8,
                21,
                0
            ),
            location: 'Feuerwehrgerätehaus',
            category: 'sonstiges',
            organizer: 'Freiwillige Feuerwehr Wendessen',
        },
        {
            title: 'Winterfest am Dorfplatz',
            description:
                'Gemütliches Beisammensein mit heißen Getränken, Bratwurst und Live-Musik am winterlichen Dorfplatz.',
            start_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 12,
                16,
                0
            ),
            end_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 12,
                22,
                0
            ),
            location: 'Dorfplatz Wendessen',
            category: 'veranstaltung',
            organizer: 'Dorfgemeinschaft Wendessen',
        },
        {
            title: 'Fußballtraining Jugend',
            description:
                'Wöchentliches Training für die Jugendmannschaft des SV Wendessen.',
            start_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 3,
                17,
                0
            ),
            end_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 3,
                18,
                30
            ),
            location: 'Sportplatz Wendessen',
            category: 'sport',
            organizer: 'SV Wendessen',
        },
        {
            title: 'Konzert im Hospiz',
            description:
                'Klassisches Kammermusik-Konzert im wunderschönen Ambiente des Hospiz Wendessen.',
            start_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 15,
                19,
                0
            ),
            end_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 15,
                21,
                30
            ),
            location: 'Hospiz Wendessen',
            category: 'kultur',
            organizer: 'Kulturkreis Wendessen',
        },
        {
            title: 'Gartenpflegetag Kleingärtner',
            description:
                'Gemeinsamer Pflegetag der Kleingartenanlage - Frühjahrsputz und Vorbereitung der Saison.',
            start_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 20,
                9,
                0
            ),
            end_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 20,
                13,
                0
            ),
            location: 'Kleingartenanlage Wendessen',
            category: 'sonstiges',
            organizer: 'Kleingärtner-Verein Wendessen',
        },
        {
            title: 'Bücherbus-Termin',
            description:
                'Der Bücherbus macht Station in Wendessen. Ausleihe und Rückgabe von Büchern möglich.',
            start_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 18,
                14,
                0
            ),
            end_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 18,
                16,
                0
            ),
            location: 'Dorfplatz Wendessen',
            category: 'kultur',
            organizer: 'Stadtbibliothek Schöppenstedt',
        },
        {
            title: 'Heimspiel SV Wendessen',
            description:
                'Spannendes Fußballspiel der ersten Mannschaft gegen SV Nachbarsdorf.',
            start_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 10,
                15,
                0
            ),
            end_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 10,
                17,
                0
            ),
            location: 'Sportplatz Wendessen',
            category: 'sport',
            organizer: 'SV Wendessen',
        },
        {
            title: 'Seniorennachmittag',
            description:
                'Geselliger Nachmittag für alle Seniorinnen und Senioren mit Kaffee, Kuchen und Unterhaltung.',
            start_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 25,
                14,
                30
            ),
            end_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 25,
                17,
                30
            ),
            location: 'Dorfgemeinschaftshaus Wendessen',
            category: 'veranstaltung',
            organizer: 'Dorfgemeinschaft Wendessen',
        },
        {
            title: 'Frühjahrskonzert Musikverein',
            description:
                'Traditionelles Frühjahrskonzert des Musikvereins Wendessen mit klassischen und modernen Stücken.',
            start_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 28,
                18,
                0
            ),
            end_date: new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 28,
                21,
                0
            ),
            location: 'Dorfgemeinschaftshaus Wendessen',
            category: 'kultur',
            organizer: 'Musikverein Wendessen',
        },
    ];

    try {
        for (const event of sampleEvents) {
            await sql`
                INSERT INTO events (
                    title, 
                    description, 
                    start_date, 
                    end_date, 
                    location, 
                    category, 
                    organizer
                )
                VALUES (
                    ${event.title},
                    ${event.description},
                    ${event.start_date.toISOString()},
                    ${event.end_date.toISOString()},
                    ${event.location},
                    ${event.category},
                    ${event.organizer}
                )
            `;
            console.log(
                `✓ Added: ${event.title} (${
                    event.category
                }) on ${event.start_date.toLocaleDateString('de-DE')}`
            );
        }

        console.log('\n✅ Successfully added 10 sample events!');
        console.log('\nEvent categories:');
        console.log('- Sitzung: 1 event');
        console.log('- Veranstaltung: 2 events');
        console.log('- Sport: 2 events');
        console.log('- Kultur: 3 events');
        console.log('- Sonstiges: 2 events');
    } catch (error) {
        console.error('❌ Error adding sample events:', error);
        throw error;
    }
}

addSampleEvents()
    .then(() => {
        console.log('\nDone!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Failed:', error);
        process.exit(1);
    });
