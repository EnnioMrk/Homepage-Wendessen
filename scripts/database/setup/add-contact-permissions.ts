
import { sql } from '../../../lib/sql';

async function setupContactPermissions() {
    console.log('Setting up contact permissions...');

    try {
        // 1. Insert new permissions (using ON CONFLICT DO NOTHING to avoid errors if run multiple times)
        await sql`
            INSERT INTO permissions (name, display_name, description, category) VALUES
            ('contacts.view', 'Kontakte anzeigen', 'Kann Kontaktliste einsehen', 'contacts'),
            ('contacts.create', 'Kontakte erstellen', 'Kann neue Kontakte anlegen', 'contacts'),
            ('contacts.edit', 'Kontakte bearbeiten', 'Kann Kontakte bearbeiten', 'contacts'),
            ('contacts.delete', 'Kontakte löschen', 'Kann Kontakte löschen', 'contacts')
            ON CONFLICT (name) DO UPDATE SET
                display_name = EXCLUDED.display_name,
                description = EXCLUDED.description,
                category = EXCLUDED.category;
        `;
        console.log('✓ Contact permissions inserted/updated');

        // 2. Update 'admin' role to include these permissions
        // We first fetch the current default_permissions for admin, then append the new ones if not present
        const adminRoleRows = await sql`SELECT id, default_permissions FROM roles WHERE name = 'admin'`;

        if (adminRoleRows.length > 0) {
            const role = adminRoleRows[0];
            let currentPerms = role.default_permissions as string[];
            if (!Array.isArray(currentPerms)) currentPerms = [];

            const newPerms = ['contacts.view', 'contacts.create', 'contacts.edit', 'contacts.delete'];
            let changesMade = false;

            for (const perm of newPerms) {
                if (!currentPerms.includes(perm)) {
                    currentPerms.push(perm);
                    changesMade = true;
                }
            }

            if (changesMade) {
                await sql`
                    UPDATE roles 
                    SET default_permissions = ${JSON.stringify(currentPerms)}::jsonb
                    WHERE id = ${role.id}
                `;
                console.log('✓ Admin role updated with new contact permissions');
            } else {
                console.log('✓ Admin role already has contact permissions');
            }
        } else {
            console.warn('! Admin role not found');
        }

        console.log('\n✅ Contact permissions setup complete!');

    } catch (error) {
        console.error('Error setting up contact permissions:', error);
        throw error;
    }
}

setupContactPermissions()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
