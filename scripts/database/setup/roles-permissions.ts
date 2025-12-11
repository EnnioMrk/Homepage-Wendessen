import { sql } from '../../../lib/sql';

async function setupRolesAndPermissions() {
    console.log('Setting up roles and permissions tables...');

    try {
        // Create roles table
        await sql`
            CREATE TABLE IF NOT EXISTS roles (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                display_name VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('✓ roles table created');

        // Create permissions table
        await sql`
            CREATE TABLE IF NOT EXISTS permissions (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                display_name VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;
        console.log('✓ permissions table created');

        // Add role_id and permissions columns to admin_users table
        await sql`
            ALTER TABLE admin_users 
            ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id),
            ADD COLUMN IF NOT EXISTS custom_permissions JSONB DEFAULT '[]'::jsonb;
        `;
        console.log(
            '✓ Added role_id and custom_permissions columns to admin_users'
        );

        // Create indexes
        await sql`
            CREATE INDEX IF NOT EXISTS idx_admin_users_role_id 
            ON admin_users(role_id);
        `;
        console.log('✓ Created index on role_id');

        // Check if roles already exist
        const existingRoles = await sql`SELECT COUNT(*) as count FROM roles;`;
        const roleCount = Number(existingRoles[0].count);

        if (roleCount === 0) {
            // Insert default roles
            await sql`
                INSERT INTO roles (name, display_name, description) VALUES
                ('super_admin', 'Super Admin', 'Vollständiger Zugriff auf alle Funktionen und Einstellungen'),
                ('admin', 'Administrator', 'Verwaltung von Inhalten und Benutzern'),
                ('editor', 'Redakteur', 'Bearbeitung von Inhalten (Events, News, Galerie)'),
                ('moderator', 'Moderator', 'Überprüfung und Genehmigung von Einreichungen');
            `;
            console.log('✓ Created default roles');
        } else {
            console.log(`✓ Found ${roleCount} existing role(s)`);
        }

        // Check if permissions already exist
        const existingPerms =
            await sql`SELECT COUNT(*) as count FROM permissions;`;
        const permCount = Number(existingPerms[0].count);

        if (permCount === 0) {
            // Insert default permissions
            await sql`
                INSERT INTO permissions (name, display_name, description, category) VALUES
                -- User Management
                ('users.view', 'Benutzer anzeigen', 'Kann Benutzerliste einsehen', 'users'),
                ('users.create', 'Benutzer erstellen', 'Kann neue Benutzer anlegen', 'users'),
                ('users.edit', 'Benutzer bearbeiten', 'Kann Benutzer bearbeiten', 'users'),
                ('users.delete', 'Benutzer löschen', 'Kann Benutzer löschen', 'users'),
                
                -- Events Management
                ('events.view', 'Termine anzeigen', 'Kann Termine einsehen', 'events'),
                ('events.create', 'Termine erstellen', 'Kann neue Termine erstellen', 'events'),
                ('events.edit', 'Termine bearbeiten', 'Kann Termine bearbeiten', 'events'),
                ('events.delete', 'Termine löschen', 'Kann Termine löschen', 'events'),
                
                -- News Management
                ('news.view', 'Neuigkeiten anzeigen', 'Kann Neuigkeiten einsehen', 'news'),
                ('news.create', 'Neuigkeiten erstellen', 'Kann neue Neuigkeiten erstellen', 'news'),
                ('news.edit', 'Neuigkeiten bearbeiten', 'Kann Neuigkeiten bearbeiten', 'news'),
                ('news.delete', 'Neuigkeiten löschen', 'Kann Neuigkeiten löschen', 'news'),
                
                -- Gallery Management
                ('gallery.view', 'Galerie anzeigen', 'Kann Galerie einsehen', 'gallery'),
                ('gallery.upload', 'Bilder hochladen', 'Kann Bilder hochladen', 'gallery'),
                ('gallery.edit', 'Bilder bearbeiten', 'Kann Bilder bearbeiten', 'gallery'),
                ('gallery.delete', 'Bilder löschen', 'Kann Bilder löschen', 'gallery'),
                
                -- Shared Gallery (Impressionen)
                ('shared_gallery.view', 'Einreichungen anzeigen', 'Kann eingereichte Bilder einsehen', 'shared_gallery'),
                ('shared_gallery.approve', 'Einreichungen genehmigen', 'Kann Bildeinreichungen genehmigen', 'shared_gallery'),
                ('shared_gallery.reject', 'Einreichungen ablehnen', 'Kann Bildeinreichungen ablehnen', 'shared_gallery'),
                ('shared_gallery.reset', 'Einreichungen zurücksetzen', 'Kann Bildeinreichungen auf ausstehend zurücksetzen', 'shared_gallery'),
                
                -- Portraits Management
                ('portraits.view', 'Portraits anzeigen', 'Kann Portrait-Einreichungen einsehen', 'portraits'),
                ('portraits.edit', 'Portraits bearbeiten', 'Kann Portraits bearbeiten und genehmigen/ablehnen', 'portraits'),
                ('portraits.delete', 'Portraits löschen', 'Kann Portraits löschen', 'portraits'),
                
                -- Settings & Configuration
                ('settings.view', 'Einstellungen anzeigen', 'Kann Einstellungen einsehen', 'settings'),
                ('settings.edit', 'Einstellungen bearbeiten', 'Kann Einstellungen ändern', 'settings');
            `;
            console.log('✓ Created default permissions');
        } else {
            console.log(`✓ Found ${permCount} existing permission(s)`);
        }

        // Update existing admin users to have super_admin role
        const superAdminRole = await sql`
            SELECT id FROM roles WHERE name = 'super_admin' LIMIT 1;
        `;

        if (superAdminRole.length > 0) {
            const superAdminRoleId = superAdminRole[0].id;

            const updatedUsers = await sql`
                UPDATE admin_users 
                SET role_id = ${superAdminRoleId}
                WHERE role_id IS NULL
                RETURNING username;
            `;

            if (updatedUsers.length > 0) {
                console.log(
                    `✓ Assigned Super Admin role to ${updatedUsers.length} existing user(s)`
                );
            }
        }

        console.log('\n✅ Roles and permissions setup complete!');
        console.log('\nAvailable Roles:');
        console.log('  - Super Admin: Full access to everything');
        console.log('  - Administrator: Content and user management');
        console.log('  - Redakteur: Content editing');
        console.log('  - Moderator: Review submissions');
    } catch (error) {
        console.error('Error setting up roles and permissions:', error);
        throw error;
    }
}

setupRolesAndPermissions()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
