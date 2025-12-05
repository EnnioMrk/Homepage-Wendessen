import { sql } from '../lib/sql';

// Legacy script - this has been superseded by migrate-default-permissions-to-db.ts
// Kept for historical reference, but uses inline permissions definition
const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
    super_admin: ['*'],
    admin: [
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
        'events.view',
        'events.create',
        'events.edit',
        'events.delete',
        'events.cancel',
        'news.view',
        'news.create',
        'news.edit',
        'news.delete',
        'gallery.view',
        'gallery.upload',
        'gallery.edit',
        'gallery.delete',
        'shared_gallery.view',
        'shared_gallery.approve',
        'shared_gallery.reject',
        'portraits.view',
        'portraits.edit',
        'portraits.delete',
        'archive.view',
        'archive.create',
        'archive.edit',
        'archive.delete',
        'settings.view',
        'settings.edit',
    ],
    editor: [
        'events.view',
        'events.create',
        'events.edit',
        'events.cancel',
        'news.view',
        'news.create',
        'news.edit',
        'gallery.view',
        'gallery.upload',
        'gallery.edit',
        'archive.view',
        'archive.create',
        'archive.edit',
    ],
    moderator: [
        'events.view',
        'news.view',
        'gallery.view',
        'shared_gallery.view',
        'shared_gallery.approve',
        'shared_gallery.reject',
        'portraits.view',
        'portraits.edit',
    ],
    vereinsverwalter: [
        'verein.events.create',
        'verein.events.edit',
        'verein.events.cancel',
        'gallery.view',
        'gallery.upload',
        'gallery.edit',
    ],
    no_permissions: [],
};

async function migrateRolePermissions() {
    console.log('Migrating role default permissions to database...');

    try {
        // Add default_permissions column to roles table
        await sql`
            ALTER TABLE roles 
            ADD COLUMN IF NOT EXISTS default_permissions JSONB DEFAULT '[]'::jsonb;
        `;
        console.log('✓ Added default_permissions column to roles table');

        // Update each role with its default permissions
        for (const [roleName, permissions] of Object.entries(
            ROLE_DEFAULT_PERMISSIONS
        )) {
            const result = await sql`
                UPDATE roles
                SET default_permissions = ${JSON.stringify(permissions)}::jsonb
                WHERE name = ${roleName}
                RETURNING name, display_name;
            `;

            if (result.length > 0) {
                console.log(
                    `✓ Updated ${result[0].display_name} (${result[0].name}) with ${permissions.length} default permissions`
                );
            } else {
                // Role doesn't exist, create it
                console.log(
                    `⚠ Role '${roleName}' not found in database, skipping...`
                );
            }
        }

        // Verify the migration
        console.log('\nVerifying migration:');
        const roles = await sql`
            SELECT name, display_name, default_permissions 
            FROM roles 
            ORDER BY name;
        `;

        for (const role of roles) {
            const perms = role.default_permissions as string[];
            console.log(
                `  ${role.display_name}: ${perms.length} permission(s)`
            );
        }

        console.log('\n✅ Migration complete!');
        console.log(
            'Note: Update lib/permissions.ts to read from database instead of hardcoded values'
        );
    } catch (error) {
        console.error('Error migrating role permissions:', error);
        throw error;
    }
}

migrateRolePermissions()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
