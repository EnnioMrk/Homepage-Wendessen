import { sql } from '../lib/sql';

async function setupOrganizationsTable() {
    console.log('Setting up organizations table...');

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS organizations (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('Organizations table created successfully.');

        // Add some initial data if empty
        const count = await sql`SELECT count(*) FROM organizations`;
        if (Number(count[0].count) === 0) {
            console.log('Seeding initial organizations...');
            await sql`
                INSERT INTO organizations (name) VALUES
                ('Freiwillige Feuerwehr Wendessen'),
                ('Seniorenkreis'),
                ('Spritzenhaus'),
                ('Kirchbauverein'),
                ('Hospizverein Wolfenbüttel'),
                ('Kleingärtner'),
                ('Jugendfeuerwehr'),
                ('Schützenverein'),
                ('Frauenhilfe'),
                ('SV Wendessen');
            `;
            console.log('Seed data inserted.');
        }

    } catch (error) {
        console.error('Error setting up organizations table:', error);
    } finally {
        process.exit();
    }
}

setupOrganizationsTable();
