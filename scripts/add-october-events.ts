import { sql } from '../lib/sql';

async function addEvents() {
    console.log('📅 Adding October 2025 - September 2026 events...\n');

    try {
        const events = [
            // October 2025
            {
                title: 'Konzert "Transatlantic Guitar Trio" - AUSVERKAUFT!',
                description: 'Am 26.10.2025 veranstaltet der Kirchbauverein das Konzert "Josho Stefan´s - Transatlantic Guitar Trio"',
                start_date: '2025-10-26T19:30:00',
                end_date: '2025-10-26T21:30:00',
                location: 'Kirche St. Georg',
                category: 'kultur',
                organizer: 'Kirchbauverein',
                verein_id: 'kirchbauverein'
            },
            {
                title: 'Zusatz-Konzert "Josho Stefan´s - Transatlantic Guitar Trio"',
                description: 'Am 26.10.2025 veranstaltet der Kirchbauverein ein Zusatz-Konzert "Josho Stefan´s - Transatlantic Guitar Trio"',
                start_date: '2025-10-26T16:30:00',
                end_date: '2025-10-26T18:30:00',
                location: 'Kirche St. Georg',
                category: 'kultur',
                organizer: 'Kirchbauverein',
                verein_id: 'kirchbauverein'
            },
            {
                title: 'Ortsratssitzung - Termin verschoben',
                description: 'Am 30.10.2025, 19.30 Uhr (Termin verschoben) findet die nächste Sitzung des Ortsrates Wendessen in der Alten Schule statt.',
                start_date: '2025-10-30T19:30:00',
                end_date: '2025-10-30T21:30:00',
                location: 'Alte Schule',
                category: 'sitzung',
                organizer: 'Ortsrat Wendessen',
                verein_id: null
            },
            // November 2025
            {
                title: '„Aus der Suppenschüssel"',
                description: 'Am 04.11.2025 um 11.30 Uhr trifft sich der Seniorenkreis Atzum-Wendessen zum gemeinsamen Essen aus der Suppenschüssel.',
                start_date: '2025-11-04T11:30:00',
                end_date: '2025-11-04T14:00:00',
                location: 'Alte Schule',
                category: 'veranstaltung',
                organizer: 'Seniorenkreis Atzum-Wendessen',
                verein_id: null
            },
            {
                title: 'Laternenumzug',
                description: 'Am 07.11.2025 findet der von der IDW organisierte Laternenumzug in Wendessen statt. Die Laternen sammeln sich um 17.30 Uhr.',
                start_date: '2025-11-07T17:30:00',
                end_date: '2025-11-07T19:00:00',
                location: 'Treffpunkt wird bekannt gegeben',
                category: 'veranstaltung',
                organizer: 'Initiative Dorf Wendessen',
                verein_id: 'idw'
            },
            {
                title: 'Vortrag "Der November"',
                description: 'Am 12.11.2025, 15.00 Uhr bietet die Frauenhilfe Wendessen den Vortrag "Der November" im Hans-Meves-Hof an.',
                start_date: '2025-11-12T15:00:00',
                end_date: '2025-11-12T17:00:00',
                location: 'Hans-Meves-Hof',
                category: 'kultur',
                organizer: 'Frauenhilfe Wendessen',
                verein_id: null
            },
            {
                title: 'Bücherbus',
                description: 'Am 12.11.2025 von 18.30 - 19.00 Uhr hält der Bücherbus des Landkreises wieder in der Dorfstraße in Wendessen.',
                start_date: '2025-11-12T18:30:00',
                end_date: '2025-11-12T19:00:00',
                location: 'Dorfstr.',
                category: 'sonstiges',
                organizer: 'Landkreis Wolfenbüttel',
                verein_id: null
            },
            {
                title: 'Schweine-Preisschießen',
                description: 'Der Schützenverein Wendessen veranstaltet am Freitag 14.11.2025 von 18.00 - 21.00 Uhr den 1. Teil des Schweine-Preisschießens.',
                start_date: '2025-11-14T18:00:00',
                end_date: '2025-11-14T21:00:00',
                location: 'Schützenhaus',
                category: 'sport',
                organizer: 'Schützenverein Wendessen',
                verein_id: 'sv-schuetzen'
            },
            {
                title: 'Schweine-Preisschießen',
                description: 'Am 15.11.2025 von 14.00 - 17.00 Uhr veranstaltet der Schützenverein den letzten Teil des Schweine-Preisschießens.',
                start_date: '2025-11-15T14:00:00',
                end_date: '2025-11-15T17:00:00',
                location: 'Schützenhaus',
                category: 'sport',
                organizer: 'Schützenverein Wendessen',
                verein_id: 'sv-schuetzen'
            },
            // December 2025
            {
                title: 'Weihnachtsfeier Seniorenkreis',
                description: 'Am 02.12.2025 um 15.00 Uhr veranstaltet der Seniorenkreis Atzum-Wendessen seine Weihnachtsfeier in der Alten Schule.',
                start_date: '2025-12-02T15:00:00',
                end_date: '2025-12-02T18:00:00',
                location: 'Alte Schule',
                category: 'veranstaltung',
                organizer: 'Seniorenkreis Atzum-Wendessen',
                verein_id: null
            },
            {
                title: 'Advents-Frühstück',
                description: 'Das Advents-Frühstück der Frauenhilfe Wendessen findet am 05.12.2025 um 9.30 Uhr im Hans-Meves-Hof statt.',
                start_date: '2025-12-05T09:30:00',
                end_date: '2025-12-05T11:30:00',
                location: 'Hans-Meves-Hof',
                category: 'veranstaltung',
                organizer: 'Frauenhilfe Wendessen',
                verein_id: null
            },
            {
                title: 'Märchenabend für Erwachsene',
                description: 'Am Freitag 05.12.2025, 19.30 Uhr veranstaltet der Kirchbauverein den Märchenabend für Erwachsene in der Kirche St. Georg.',
                start_date: '2025-12-05T19:30:00',
                end_date: '2025-12-05T21:30:00',
                location: 'Kirche St. Georg',
                category: 'kultur',
                organizer: 'Kirchbauverein',
                verein_id: 'kirchbauverein'
            },
            {
                title: 'Bücherbus',
                description: 'Am 10.12.2025 von 18.30 - 19.00 Uhr hält der Bücherbus des Landkreises wieder in der Dorfstraße in Wendessen.',
                start_date: '2025-12-10T18:30:00',
                end_date: '2025-12-10T19:00:00',
                location: 'Dorfstr.',
                category: 'sonstiges',
                organizer: 'Landkreis Wolfenbüttel',
                verein_id: null
            },
            {
                title: 'Weihnachtsbaummarkt',
                description: 'Am Samstag 13.12.2025 von 10.00 bis 14.00 Uhr findet wieder der von IWS und KiBauV organisierte Weihnachtsbaummarkt statt.',
                start_date: '2025-12-13T10:00:00',
                end_date: '2025-12-13T14:00:00',
                location: 'Spritzenhaus',
                category: 'veranstaltung',
                organizer: 'IWS & Kirchbauverein',
                verein_id: null
            },
            // 2026 - Bücherbus dates
            {
                title: 'Bücherbus',
                description: 'Am 21.01.2026 von 18.30 - 19.00 Uhr hält der Bücherbus des Landkreises wieder in der Dorfstraße in Wendessen.',
                start_date: '2026-01-21T18:30:00',
                end_date: '2026-01-21T19:00:00',
                location: 'Dorfstr.',
                category: 'sonstiges',
                organizer: 'Landkreis Wolfenbüttel',
                verein_id: null
            },
            {
                title: 'Bücherbus',
                description: 'Am 18.02.2026 von 18.30 - 19.00 Uhr hält der Bücherbus des Landkreises wieder in der Dorfstraße in Wendessen.',
                start_date: '2026-02-18T18:30:00',
                end_date: '2026-02-18T19:00:00',
                location: 'Dorfstr.',
                category: 'sonstiges',
                organizer: 'Landkreis Wolfenbüttel',
                verein_id: null
            },
            {
                title: 'Bücherbus',
                description: 'Am 18.03.2026 von 18.30 - 19.00 Uhr hält der Bücherbus des Landkreises wieder in der Dorfstraße in Wendessen.',
                start_date: '2026-03-18T18:30:00',
                end_date: '2026-03-18T19:00:00',
                location: 'Dorfstr.',
                category: 'sonstiges',
                organizer: 'Landkreis Wolfenbüttel',
                verein_id: null
            },
            {
                title: 'Bücherbus',
                description: 'Am 22.04.2026 von 18.30 - 19.00 Uhr hält der Bücherbus des Landkreises wieder in der Dorfstraße in Wendessen.',
                start_date: '2026-04-22T18:30:00',
                end_date: '2026-04-22T19:00:00',
                location: 'Dorfstr.',
                category: 'sonstiges',
                organizer: 'Landkreis Wolfenbüttel',
                verein_id: null
            },
            {
                title: 'Bücherbus',
                description: 'Am 20.05.2026 von 18.30 - 19.00 Uhr hält der Bücherbus des Landkreises wieder in der Dorfstraße in Wendessen.',
                start_date: '2026-05-20T18:30:00',
                end_date: '2026-05-20T19:00:00',
                location: 'Dorfstr.',
                category: 'sonstiges',
                organizer: 'Landkreis Wolfenbüttel',
                verein_id: null
            },
            {
                title: 'Bücherbus',
                description: 'Am 17.06.2026 von 18.30 - 19.00 Uhr hält der Bücherbus des Landkreises wieder in der Dorfstraße in Wendessen.',
                start_date: '2026-06-17T18:30:00',
                end_date: '2026-06-17T19:00:00',
                location: 'Dorfstr.',
                category: 'sonstiges',
                organizer: 'Landkreis Wolfenbüttel',
                verein_id: null
            },
            // Kommunalwahlen
            {
                title: 'Kommunalwahlen Niedersachsen',
                description: 'Kommunalwahlen in Niedersachsen. Wahllokal geöffnet von 8.00 - 18.00 Uhr.',
                start_date: '2026-09-13T08:00:00',
                end_date: '2026-09-13T18:00:00',
                location: 'Wahllokal Wendessen',
                category: 'sonstiges',
                organizer: 'Gemeinde Cremlingen',
                verein_id: null
            }
        ];

        let successCount = 0;
        for (const event of events) {
            try {
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
                        ${event.title},
                        ${event.description},
                        ${event.start_date},
                        ${event.end_date},
                        ${event.location},
                        ${event.category},
                        ${event.organizer},
                        ${event.verein_id}
                    )
                `;
                console.log(`  ✓ Added: ${event.title} (${event.start_date.substring(0, 10)})`);
                successCount++;
            } catch (error) {
                console.error(`  ✗ Failed to add: ${event.title}`, error);
            }
        }

        console.log(`\n✅ Successfully added ${successCount}/${events.length} events!`);

    } catch (error) {
        console.error('❌ Error adding events:', error);
        throw error;
    }
}

addEvents();
