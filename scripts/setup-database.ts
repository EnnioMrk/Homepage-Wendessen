import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function setupDatabase() {
    console.log('Setting up database tables...');

    try {
        import { neon } from '@neondatabase/serverless';

        const sql = neon(process.env.DATABASE_URL!);

        async function createGalleryTable() {
            try {
                console.log('Creating gallery_images table...');

                await sql`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        size INTEGER NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

                console.log('Gallery table created successfully!');

                // Create an index for better performance
                await sql`
      CREATE INDEX IF NOT EXISTS idx_gallery_images_uploaded_at 
      ON gallery_images(uploaded_at);
    `;

                console.log('Index created successfully!');
            } catch (error) {
                console.error('Error creating gallery table:', error);
                throw error;
            }
        }

        createGalleryTable().catch(console.error);
        await sql`DROP TABLE IF EXISTS events CASCADE;`;

        // Create events table
        await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        start_date TIMESTAMP WITH TIME ZONE NOT NULL,
        end_date TIMESTAMP WITH TIME ZONE NOT NULL,
        location VARCHAR(255),
        category VARCHAR(50) DEFAULT 'sonstiges',
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

        // Create news table
        await sql`
      CREATE TABLE IF NOT EXISTS news (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL UNIQUE,
        content TEXT,
        category VARCHAR(50) NOT NULL,
        published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

        // Create index for better performance
        await sql`
      CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date);
    `;

        await sql`
      CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
    `;

        console.log('✅ News table created successfully');

        // Insert sample events
        const sampleEvents = [
            {
                title: 'Ortsratssitzung',
                description: 'Öffentliche Sitzung des Ortsrats Wendessen',
                start_date: '2025-09-15 19:00:00+02',
                end_date: '2025-09-15 21:00:00+02',
                location: 'Dorfgemeinschaftshaus',
                category: 'sitzung',
                organizer: 'Ortsrat Wendessen',
            },
            {
                title: 'Herbstfest',
                description:
                    'Traditionelles Herbstfest mit Musik und lokalen Spezialitäten',
                start_date: '2025-09-21 14:00:00+02',
                end_date: '2025-09-21 22:00:00+02',
                location: 'Dorfplatz',
                category: 'veranstaltung',
                organizer: 'Dorfgemeinschaft',
            },
            {
                title: 'Fußballtraining',
                description: 'Wöchentliches Training der Herrenmannschaft',
                start_date: '2025-09-03 18:30:00+02',
                end_date: '2025-09-03 20:00:00+02',
                location: 'Sportplatz Wendessen',
                category: 'sport',
                organizer: 'SV Wendessen',
            },
            {
                title: 'Bücherbusbesuch',
                description: 'Der Bücherbus macht Station in Wendessen',
                start_date: '2025-09-12 15:00:00+02',
                end_date: '2025-09-12 16:30:00+02',
                location: 'Bushaltestelle Dorfmitte',
                category: 'kultur',
                organizer: 'Stadtbibliothek Wolfenbüttel',
            },
            {
                title: 'Gemeindearbeit',
                description: 'Freiwillige Pflegearbeiten im Dorf',
                start_date: '2025-09-28 09:00:00+02',
                end_date: '2025-09-28 12:00:00+02',
                location: 'Treffpunkt Dorfplatz',
                category: 'sonstiges',
                organizer: 'Dorfgemeinschaft',
            },
            {
                title: 'Gitarrenkonzert',
                description: 'Konzert mit regionalen Künstlern',
                start_date: '2025-10-05 19:30:00+02',
                end_date: '2025-10-05 21:30:00+02',
                location: 'Kirche Wendessen',
                category: 'kultur',
                organizer: 'Kulturverein',
            },
        ];

        for (const event of sampleEvents) {
            await sql`
        INSERT INTO events (title, description, start_date, end_date, location, category, organizer)
        VALUES (${event.title}, ${event.description}, ${event.start_date}, ${event.end_date}, ${event.location}, ${event.category}, ${event.organizer})
        ON CONFLICT (title) DO NOTHING;
      `;
        }

        console.log('✅ Sample events inserted successfully');

        // Insert sample news
        const sampleNews = [
            {
                title: 'Bücherbus hält wieder im Ort',
                content:
                    'Der beliebte Bücherbus der Stadtbibliothek Wolfenbüttel macht wieder regelmäßig Station in Wendessen.',
                category: 'Bildung',
            },
            {
                title: 'Bücherzelle für Jung und Alt',
                content:
                    'Eine neue Bücherzelle wurde am Dorfplatz aufgestellt, wo Bürger kostenlos Bücher tauschen können.',
                category: 'Gemeinschaft',
            },
            {
                title: 'Feuerwehr für Kinder gründet sich',
                content:
                    'Eine neue Kinderfeuerwehr wurde gegründet, um schon die Kleinsten für den Brandschutz zu begeistern.',
                category: 'Feuerwehr',
            },
            {
                title: 'Neue Webseite ist online',
                content:
                    'Die neue Webseite von Wendessen ist jetzt online und bietet umfassende Informationen über unser Dorf.',
                category: 'Digital',
            },
        ];

        for (const news of sampleNews) {
            await sql`
        INSERT INTO news (title, content, category)
        VALUES (${news.title}, ${news.content}, ${news.category})
        ON CONFLICT (title) DO NOTHING;
      `;
        }

        console.log('✅ Sample news inserted successfully');

        // Verify the setup
        const eventCount = await sql`SELECT COUNT(*) as count FROM events;`;
        const newsCount = await sql`SELECT COUNT(*) as count FROM news;`;
        console.log(`📊 Total events in database: ${eventCount[0].count}`);
        console.log(`📊 Total news in database: ${newsCount[0].count}`);
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
