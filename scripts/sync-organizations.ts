
import { sql } from '../lib/sql';

async function syncOrganizations() {
    console.log('Syncing organizations...');

    try {
        // 1. Update existing organizations to match the names found in contacts
        const updates = [
            { old: 'Spritzenhaus', new: 'Initiative Wendesser Spritzenhaus e.V.' },
            { old: 'Jugendfeuerwehr', new: 'Jugendfeuerwehr Wendessen' },
            { old: 'Kleingärtner', new: 'Kleingärtnerverein Wendessen' },
            { old: 'Schützenverein', new: 'Schützenverein Wendessen e.V.' },
        ];

        for (const update of updates) {
            console.log(`Updating "${update.old}" to "${update.new}"...`);
            // We use ON CONFLICT DO NOTHING in case the new name implies a duplicate (unlikely here but good practice)
            // But standard UPDATE doesn't have ON CONFLICT.
            // Check if target exists first to avoid violation if I messed up
            const existing = await sql`SELECT id FROM organizations WHERE name = ${update.new}`;
            if (existing.length === 0) {
                await sql`
                    UPDATE organizations 
                    SET name = ${update.new} 
                    WHERE name = ${update.old}
                `;
            } else {
                console.log(`organization "${update.new}" already exists, deleting old "${update.old}"...`);
                await sql`DELETE FROM organizations WHERE name = ${update.old}`;
            }
        }

        // 2. Fetch all unique organizations from contacts
        const contactOrgsResult = await sql`
            SELECT DISTINCT affiliation->>'org' as org_name
            FROM contacts,
            jsonb_array_elements(affiliations) as affiliation
            WHERE affiliation->>'org' IS NOT NULL
        `;

        const contactOrgs = contactOrgsResult.map((r: any) => r.org_name as string);

        // 3. Insert any that are missing from the organizations table
        for (const orgName of contactOrgs) {
            // Trim and skip empty
            if (!orgName || !orgName.trim()) continue;

            const trimmedName = orgName.trim();

            const existing = await sql`SELECT id FROM organizations WHERE name = ${trimmedName}`;
            if (existing.length === 0) {
                console.log(`Adding missing organization from contacts: "${trimmedName}"`);
                await sql`INSERT INTO organizations (name) VALUES (${trimmedName})`;
            }
        }

        console.log('Sync completed.');

    } catch (error) {
        console.error('Error syncing organizations:', error);
    } finally {
        process.exit();
    }
}

syncOrganizations();
