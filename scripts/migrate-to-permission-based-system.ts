import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Role default permissions (must match lib/permissions.ts)
const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
    super_admin: ['*'],
    admin: [
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'events.view', 'events.create', 'events.edit', 'events.delete', 'events.cancel',
        'news.view', 'news.create', 'news.edit', 'news.delete',
        'gallery.view', 'gallery.upload', 'gallery.edit', 'gallery.delete',
        'shared_gallery.view', 'shared_gallery.approve', 'shared_gallery.reject',
        'portraits.view', 'portraits.edit', 'portraits.delete',
        'settings.view', 'settings.edit',
    ],
    editor: [
        'events.view', 'events.create', 'events.edit', 'events.cancel',
        'news.view', 'news.create', 'news.edit',
        'gallery.view', 'gallery.upload', 'gallery.edit',
    ],
    moderator: [
        'events.view', 'news.view', 'gallery.view',
        'shared_gallery.view', 'shared_gallery.approve', 'shared_gallery.reject',
        'portraits.view', 'portraits.edit',
    ],
    vereinsverwalter: [
        'verein.events.create', 'verein.events.edit', 'verein.events.cancel',
        'gallery.view', 'gallery.upload', 'gallery.edit',
    ],
    no_permissions: [],
};

async function migrateToPermissionBasedSystem() {
    console.log('🔄 Migrating to permission-based system...\n');

    try {
        // Get all users with their roles
        const users = await sql`
            SELECT 
                u.id, 
                u.username, 
                u.custom_permissions,
                r.name as role_name
            FROM admin_users u
            LEFT JOIN roles r ON u.role_id = r.id
            ORDER BY u.id
        `;

        console.log(`Found ${users.length} users to migrate\n`);

        for (const user of users) {
            const userId = user.id;
            const username = user.username;
            const roleName = user.role_name || 'no_permissions';
            const currentCustomPerms = user.custom_permissions || [];

            console.log(`\n👤 Processing user: ${username} (Role: ${roleName})`);

            // Get role default permissions
            const roleDefaults = ROLE_DEFAULT_PERMISSIONS[roleName] || [];
            console.log(`  📋 Role defaults: ${roleDefaults.length} permissions`);

            // Combine role defaults with existing custom permissions
            const allPermissions = new Set([...roleDefaults, ...currentCustomPerms]);
            const finalPermissions = Array.from(allPermissions);

            console.log(`  ✅ Current custom: ${currentCustomPerms.length} permissions`);
            console.log(`  ➕ Combined total: ${finalPermissions.length} permissions`);
            console.log(`  🆕 Extra permissions: ${finalPermissions.length - roleDefaults.length}`);

            // Update user with combined permissions
            await sql`
                UPDATE admin_users
                SET custom_permissions = ${JSON.stringify(finalPermissions)}
                WHERE id = ${userId}
            `;

            console.log(`  ✓ Updated ${username}`);
        }

        console.log('\n\n✅ Migration complete!');
        console.log('\n📊 Summary:');
        console.log(`  - Migrated ${users.length} users`);
        console.log('  - All users now have role default permissions assigned');
        console.log('  - Existing custom permissions have been preserved');
        console.log('  - System is now fully permission-based');
        console.log('\n💡 Note: Roles now serve as templates for default permissions at user creation.');

    } catch (error) {
        console.error('❌ Error during migration:', error);
        throw error;
    }
}

migrateToPermissionBasedSystem();
