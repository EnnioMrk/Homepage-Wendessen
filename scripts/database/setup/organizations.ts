
import { sql } from '../../../lib/sql';

const SEED_ORGANIZATIONS = [
    {
        id: "freiwillige-feuerwehr-wendessen",
        title: "Freiwillige Feuerwehr Wendessen",
        alt_title: "Freiwillige Feuerwehr",
        description: null
    },
    {
        id: "schutzenverein-wendessen-ev",
        title: "Schützenverein Wendessen e.V.",
        alt_title: "Schützenverein",
        description: null
    },
    {
        id: "kirchengemeinde-ahlum-atzum-wendessen",
        title: "Kirchengemeinde Ahlum-Atzum-Wendessen",
        alt_title: "Kirchengemeinde",
        description: null
    },
    {
        id: "initiative-wendesser-spritzenhaus-ev",
        title: "Initiative Wendesser Spritzenhaus e.V.",
        alt_title: "Spritzenhaus",
        description: null
    },
    {
        id: "jugendfeuerwehr-wendessen",
        title: "Jugendfeuerwehr Wendessen",
        alt_title: "Jugendfeuerwehr",
        description: null
    },
    {
        id: "sv-wendessen",
        title: "SV Wendessen",
        alt_title: "SV Wendessen",
        description: null
    },
    {
        id: "ortsrat-wendessen",
        title: "Ortsrat Wendessen",
        alt_title: "Ortsrat",
        description: null
    },
    {
        id: "kleingartnerverein-wendessen",
        title: "Kleingärtnerverein Wendessen",
        alt_title: "Kleingärtnerverein",
        description: null
    },
    {
        id: "hospizverein-wolfenbuettel-ev",
        title: "Hospizverein Wolfenbüttel e.V.",
        alt_title: "Hospizverein",
        description: null
    },
    {
        id: "kirchbauverein-wendessen",
        title: "Kirchbauverein Wendessen",
        alt_title: "Kirchbauverein",
        description: null
    },
    {
        id: "seniorenkreis-wendessen",
        title: "Seniorenkreis Wendessen",
        alt_title: "Seniorenkreis",
        description: null
    },
    {
        id: "frauenhilfe-wendessen",
        title: "Frauenhilfe Wendessen",
        alt_title: "Frauenhilfe",
        description: null
    }
];

async function setupOrganizations() {
    console.log('Setting up organizations table...');

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS organizations (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                alt_title TEXT,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ Table "organizations" ensured.');

        for (const org of SEED_ORGANIZATIONS) {
            // Ensure alt_title uses title if null (though we set them above)
            const alt = org.alt_title || org.title;
            
            await sql`
                INSERT INTO organizations (id, title, alt_title, description)
                VALUES (${org.id}, ${org.title}, ${alt}, ${org.description})
                ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    alt_title = EXCLUDED.alt_title,
                    description = EXCLUDED.description,
                    updated_at = CURRENT_TIMESTAMP
            `;
        }
        console.log(`✅ Seeded ${SEED_ORGANIZATIONS.length} organizations.`);

    } catch (error) {
        console.error('❌ Error setting up organizations:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

setupOrganizations();
