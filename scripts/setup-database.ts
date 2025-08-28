import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function setupDatabase() {
    console.log('Setting up database tables...');

    try {
        // Create events table
        await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_date TIMESTAMP WITH TIME ZONE NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE NOT NULL,
        location VARCHAR(255),
        category VARCHAR(50) DEFAULT 'other',
        organizer VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

        // Create index for better performance
        await sql`
      CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
    `;

        await sql`
      CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
    `;

        console.log('✅ Events table created successfully');

        // Insert sample events
        const sampleEvents = [
            {
                title: 'Ortsratssitzung',
                description: 'Öffentliche Sitzung des Ortsrats Wendessen',
                start_date: '2025-09-15 19:00:00+02',
                end_date: '2025-09-15 21:00:00+02',
                location: 'Dorfgemeinschaftshaus',
                category: 'meeting',
                organizer: 'Ortsrat Wendessen',
            },
            {
                title: 'Herbstfest',
                description:
                    'Traditionelles Herbstfest mit Musik und lokalen Spezialitäten',
                start_date: '2025-09-21 14:00:00+02',
                end_date: '2025-09-21 22:00:00+02',
                location: 'Dorfplatz',
                category: 'event',
                organizer: 'Dorfgemeinschaft',
            },
            {
                title: 'Fußballtraining',
                description: 'Wöchentliches Training der Herrenmannschaft',
                start_date: '2025-09-03 18:30:00+02',
                end_date: '2025-09-03 20:00:00+02',
                location: 'Sportplatz Wendessen',
                category: 'sports',
                organizer: 'SV Wendessen',
            },
            {
                title: 'Bücherbusbesuch',
                description: 'Der Bücherbus macht Station in Wendessen',
                start_date: '2025-09-12 15:00:00+02',
                end_date: '2025-09-12 16:30:00+02',
                location: 'Bushaltestelle Dorfmitte',
                category: 'culture',
                organizer: 'Stadtbibliothek Wolfenbüttel',
            },
            {
                title: 'Gemeindearbeit',
                description: 'Freiwillige Pflegearbeiten im Dorf',
                start_date: '2025-09-28 09:00:00+02',
                end_date: '2025-09-28 12:00:00+02',
                location: 'Treffpunkt Dorfplatz',
                category: 'other',
                organizer: 'Dorfgemeinschaft',
            },
            {
                title: 'Gitarrenkonzert',
                description: 'Konzert mit regionalen Künstlern',
                start_date: '2025-10-05 19:30:00+02',
                end_date: '2025-10-05 21:30:00+02',
                location: 'Kirche Wendessen',
                category: 'culture',
                organizer: 'Kulturverein',
            },
        ];

        for (const event of sampleEvents) {
            await sql`
        INSERT INTO events (title, description, start_date, end_date, location, category, organizer)
        VALUES (${event.title}, ${event.description}, ${event.start_date}, ${event.end_date}, ${event.location}, ${event.category}, ${event.organizer})
        ON CONFLICT DO NOTHING;
      `;
        }

        console.log('✅ Sample events inserted successfully');

        // Verify the setup
        const eventCount = await sql`SELECT COUNT(*) as count FROM events;`;
        console.log(`📊 Total events in database: ${eventCount[0].count}`);
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase()
    .then(() => {
        console.log('🎉 Database setup completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Database setup failed:', error);
        process.exit(1);
    });
