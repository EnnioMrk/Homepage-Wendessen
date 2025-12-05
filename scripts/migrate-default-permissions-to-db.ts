import { sql } from '../lib/sql';

// Import the default permissions that were previously hardcoded in lib/permissions.ts
// This is only needed for this one-time migration script
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

/**
 * This script migrates hardcoded role default permissions to the database.
 * It updates the default_permissions column in the roles table for all existing roles.
 */
async function migrateDefaultPermissions() {
    console.log('Migrating default permissions to database...\n');

    try {
        // Get all roles from the database
        const roles = await sql`SELECT id, name FROM roles ORDER BY name;`;

        console.log(`Found ${roles.length} roles to update\n`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const role of roles as Array<Record<string, unknown>>) {
            const roleName = String(role.name);
            const roleId = Number(role.id);

            // Get default permissions from hardcoded values
            const defaultPermissions = ROLE_DEFAULT_PERMISSIONS[roleName];

            if (defaultPermissions) {
                // Update the role with default permissions
                await sql`
                    UPDATE roles
                    SET default_permissions = ${JSON.stringify(
                        defaultPermissions
                    )},
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ${roleId};
                `;

                console.log(
                    `✓ Updated '${roleName}' with ${defaultPermissions.length} permissions`
                );
                updatedCount++;
            } else {
                console.log(
                    `⚠️  Skipped '${roleName}' - no default permissions defined in code`
                );
                skippedCount++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`✅ Migration complete!`);
        console.log(`   Updated: ${updatedCount} roles`);
        console.log(`   Skipped: ${skippedCount} roles`);
        console.log('='.repeat(50));

        // Display current state
        console.log('\nCurrent role permissions in database:');
        console.log('='.repeat(50));

        const updatedRoles = await sql`
            SELECT name, display_name, default_permissions 
            FROM roles 
            ORDER BY name;
        `;

        for (const role of updatedRoles as Array<Record<string, unknown>>) {
            const roleName = String(role.name);
            const displayName = String(role.display_name);
            const permissions = role.default_permissions;

            let permCount = 0;
            if (Array.isArray(permissions)) {
                permCount = permissions.length;
            } else if (typeof permissions === 'string') {
                permCount = JSON.parse(permissions).length;
            }

            console.log(
                `\n${displayName} (${roleName}): ${permCount} permissions`
            );

            // Show first few permissions as preview
            let permArray: string[] = [];
            if (Array.isArray(permissions)) {
                permArray = permissions;
            } else if (typeof permissions === 'string') {
                permArray = JSON.parse(permissions);
            }

            if (permArray.length > 0) {
                const preview = permArray.slice(0, 5).join(', ');
                const more =
                    permArray.length > 5
                        ? `, ... (+${permArray.length - 5} more)`
                        : '';
                console.log(`  ${preview}${more}`);
            }
        }

        console.log(
            '\n✅ All default permissions are now stored in the database!'
        );
        console.log(
            '   The hardcoded ROLE_DEFAULT_PERMISSIONS can now be removed from code.'
        );
    } catch (error) {
        console.error('❌ Error migrating permissions:', error);
        throw error;
    }
}

migrateDefaultPermissions()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
