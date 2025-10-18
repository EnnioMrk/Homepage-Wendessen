import { sql } from '../lib/sql';
import { readFile } from 'fs/promises';
import path from 'path';

async function setupContacts() {
    console.log('Setting up contacts table and seeding data...');

    // 1) Create contacts table with JSONB fields for flexible data
    await sql`
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            emails JSONB DEFAULT '[]'::jsonb,
            phones JSONB DEFAULT '[]'::jsonb,
            addresses JSONB DEFAULT '[]'::jsonb,
            affiliations JSONB DEFAULT '[]'::jsonb,
            sources JSONB DEFAULT '[]'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `;

    // Helpful indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts (name);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contacts_affiliations ON contacts USING GIN (affiliations);`;

    // 2) Load combined contacts from JSON
    const projectRoot = process.cwd();
    const contactsPath = path.join(
        projectRoot,
        'app',
        'lib',
        'combined-contacts.json'
    );
    const raw = await readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(raw) as Array<{
        name: string;
        emails?: string[];
        phones?: Array<{ type: string; value: string }>;
        addresses?: string[];
        affiliations?: Array<{ org: string; role: string }>;
        sources?: string[];
    }>;

    // 3) Upsert contacts by (name + first email/phone as weak key)
    //    For simplicity, clear and re-seed to reflect current JSON state.
    await sql`TRUNCATE TABLE contacts RESTART IDENTITY;`;

    for (const c of contacts) {
        await sql`
            INSERT INTO contacts (name, emails, phones, addresses, affiliations, sources)
            VALUES (
                ${c.name},
                ${JSON.stringify(c.emails ?? [])}::jsonb,
                ${JSON.stringify(c.phones ?? [])}::jsonb,
                ${JSON.stringify(c.addresses ?? [])}::jsonb,
                ${JSON.stringify(c.affiliations ?? [])}::jsonb,
                ${JSON.stringify(c.sources ?? [])}::jsonb
            )
        `;
    }

    const count = await sql`SELECT COUNT(*)::int AS count FROM contacts;`;
    console.log(`✅ Seeded ${count[0].count} contacts.`);
}

setupContacts()
    .then(() => {
        console.log('🎉 Contacts setup completed successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Contacts setup failed:', err);
        process.exit(1);
    });
