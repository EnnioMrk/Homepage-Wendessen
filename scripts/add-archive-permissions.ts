import { sql } from '../lib/sql';

async function addArchivePermissions() {
    console.log('🔐 Adding archive permissions to database...\n');

    try {
        // Check and add archive.view permission
        const viewExists = await sql`
            SELECT id FROM permissions WHERE name = 'archive.view' LIMIT 1;
        `;

        if (viewExists.length === 0) {
            await sql`
                INSERT INTO permissions (name, display_name, description, category)
                VALUES ('archive.view', 'Archiv anzeigen', 'Berechtigung zum Anzeigen von Archiveinträgen', 'archive');
            `;
            console.log('✓ Created permission: archive.view');
        } else {
            console.log('  Permission archive.view already exists');
        }

        // Check and add archive.create permission
        const createExists = await sql`
            SELECT id FROM permissions WHERE name = 'archive.create' LIMIT 1;
        `;

        if (createExists.length === 0) {
            await sql`
                INSERT INTO permissions (name, display_name, description, category)
                VALUES ('archive.create', 'Archiv erstellen', 'Berechtigung zum Erstellen neuer Archiveinträge', 'archive');
            `;
            console.log('✓ Created permission: archive.create');
        } else {
            console.log('  Permission archive.create already exists');
        }

        // Check and add archive.edit permission
        const editExists = await sql`
            SELECT id FROM permissions WHERE name = 'archive.edit' LIMIT 1;
        `;

        if (editExists.length === 0) {
            await sql`
                INSERT INTO permissions (name, display_name, description, category)
                VALUES ('archive.edit', 'Archiv bearbeiten', 'Berechtigung zum Bearbeiten von Archiveinträgen', 'archive');
            `;
            console.log('✓ Created permission: archive.edit');
        } else {
            console.log('  Permission archive.edit already exists');
        }

        // Check and add archive.delete permission
        const deleteExists = await sql`
            SELECT id FROM permissions WHERE name = 'archive.delete' LIMIT 1;
        `;

        if (deleteExists.length === 0) {
            await sql`
                INSERT INTO permissions (name, display_name, description, category)
                VALUES ('archive.delete', 'Archiv löschen', 'Berechtigung zum Löschen von Archiveinträgen', 'archive');
            `;
            console.log('✓ Created permission: archive.delete');
        } else {
            console.log('  Permission archive.delete already exists');
        }

        console.log('\n✅ Archive permissions setup complete!');
        console.log('\nPermissions added:');
        console.log('  - archive.view: View archive entries');
        console.log('  - archive.create: Create new archive entries');
        console.log('  - archive.edit: Edit archive entries');
        console.log('  - archive.delete: Delete archive entries');
        console.log('\nNote: These permissions can now be assigned to users through the admin user settings interface.');
        
    } catch (error) {
        console.error('❌ Error adding archive permissions:', error);
        throw error;
    }
}

addArchivePermissions()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
