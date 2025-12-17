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
                default_permissions JSONB DEFAULT '[]'::jsonb,
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
            // Insert default roles with reasonable default permissions
            await sql`
                INSERT INTO roles (name, display_name, description, default_permissions) VALUES
                ('super_admin', 'Super Admin', 'Vollständiger Zugriff auf alle Funktionen und Einstellungen', '["*"]'::jsonb),
                ('admin', 'Administrator', 'Verwaltung von Inhalten und Benutzern', '["users.view","users.create","users.edit","users.delete","events.view","events.create","events.edit","events.delete","news.view","news.create","news.edit","news.delete","gallery.view","gallery.upload","gallery.edit","gallery.delete","shared_gallery.view","shared_gallery.edit","shared_gallery.delete","portraits.view","portraits.edit","portraits.delete","settings.view","settings.edit","logs.view","wendessen.view","wendessen.manage","archive.view","archive.create","archive.edit","archive.delete"]'::jsonb),
                ('editor', 'Redakteur', 'Bearbeitung von Inhalten (Events, News, Galerie)', '["events.view","events.create","events.edit","news.view","news.create","news.edit","gallery.view","gallery.upload","portraits.view","portraits.edit","archive.view","archive.create","archive.edit"]'::jsonb),
                ('moderator', 'Moderator', 'Überprüfung und Genehmigung von Einreichungen', '["shared_gallery.view","shared_gallery.edit","portraits.view","portraits.edit","news.view","events.view"]'::jsonb);
            `;
            console.log('✓ Created default roles with permissions');
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

                -- Verein Events Management
                ('verein.events.view', 'Vereins-Termine anzeigen', 'Kann Termine des eigenen Vereins einsehen', 'verein'),
                ('verein.events.create', 'Vereins-Termine erstellen', 'Kann Termine für den eigenen Verein erstellen', 'verein'),
                ('verein.events.edit', 'Vereins-Termine bearbeiten', 'Kann Termine des eigenen Vereins bearbeiten', 'verein'),
                ('verein.events.delete', 'Vereins-Termine löschen', 'Kann Termine des eigenen Vereins löschen', 'verein'),
                ('verein.events.cancel', 'Vereins-Termine absagen', 'Kann Termine des eigenen Vereins absagen', 'verein'),
                
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
                ('shared_gallery.edit', 'Einreichungen verwalten', 'Kann Einreichungen genehmigen, ablehnen und zurücksetzen', 'shared_gallery'),
                ('shared_gallery.delete', 'Einreichungen löschen', 'Kann Einreichungen dauerhaft löschen', 'shared_gallery'),
                
                -- Portraits Management
                ('portraits.view', 'Portraits anzeigen', 'Kann Portrait-Einreichungen einsehen', 'portraits'),
                ('portraits.edit', 'Portraits bearbeiten', 'Kann Portraits bearbeiten und genehmigen/ablehnen', 'portraits'),
                ('portraits.delete', 'Portraits löschen', 'Kann Portraits löschen', 'portraits'),
                
                -- Settings & Configuration
                ('settings.view', 'Einstellungen anzeigen', 'Kann Einstellungen einsehen', 'settings'),
                ('settings.edit', 'Einstellungen bearbeiten', 'Kann Einstellungen ändern', 'settings'),

                -- Archiv
                ('archive.view', 'Archiv anzeigen', 'Kann Archiv einsehen', 'archive'),
                ('archive.create', 'Archiv Einträge erstellen', 'Kann neue Einträge im Archiv erstellen', 'archive'),
                ('archive.edit', 'Archiv Einträge bearbeiten', 'Kann Einträge im Archiv bearbeiten', 'archive'),
                ('archive.delete', 'Archiv Einträge löschen', 'Kann Einträge im Archiv löschen', 'archive'),

                -- Das ist Wendessen
                ('wendessen.view', 'Wendessen Layouts anzeigen', 'Kann Wendessen Layouts einsehen', 'wendessen'),
                ('wendessen.manage', 'Wendessen Layouts verwalten', 'Kann Wendessen Layouts erstellen, bearbeiten, aktivieren und löschen', 'wendessen'),


                -- Admin Logs
                ('logs.view', 'Aktivitätslog ansehen', 'Kann das Aktivitätsprotokoll einsehen', 'logs');
            `;
            console.log('✓ Created default permissions');
        } else {
            console.log(`✓ Found ${permCount} existing permission(s)`);
        }

        // Ensure roles that have Verein-specific event permissions also include the base "events.view" permission
        await sql`
            UPDATE roles
            SET default_permissions = default_permissions || '["events.view"]'::jsonb
            WHERE NOT EXISTS (
                SELECT 1 FROM jsonb_array_elements_text(default_permissions) AS perm WHERE perm = 'events.view'
            )
            AND EXISTS (
                SELECT 1 FROM jsonb_array_elements_text(default_permissions) AS perm WHERE perm LIKE 'verein.events.%'
            );
        `;
        console.log('✓ Ensured roles with verein permissions include events.view');

        // Normalize missing defaults and ensure super_admin has wildcard default_permissions
        await sql`
            UPDATE roles
            SET default_permissions = '[]'::jsonb
            WHERE default_permissions IS NULL;
        `;

        await sql`
            UPDATE roles
            SET default_permissions = '["*"]'::jsonb
            WHERE name = 'super_admin' AND (default_permissions IS NULL OR default_permissions = '[]'::jsonb);
        `;

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
