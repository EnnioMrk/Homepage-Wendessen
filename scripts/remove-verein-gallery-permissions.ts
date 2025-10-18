import { sql } from '../lib/sql';

async function removeVereinGalleryPermissions() {
    console.log('🗑️  Removing verein.gallery permissions...');

    try {
        // First, check which permissions exist
        const existingPerms = await sql`
            SELECT id, name, display_name 
            FROM permissions 
            WHERE name LIKE 'verein.gallery%'
            ORDER BY name
        `;

        if (existingPerms.length === 0) {
            console.log('✅ No verein.gallery permissions found in database');
            return;
        }

        console.log(`\nFound ${existingPerms.length} verein.gallery permissions to remove:`);
        existingPerms.forEach((perm: Record<string, unknown>) => {
            console.log(`  - ${String(perm.name ?? '')} (${String(perm.display_name ?? '')})`);
        });

        // Remove from custom_permissions in admin_users table
        console.log('\n🔄 Removing from user custom permissions...');
        const users = await sql`
            SELECT id, username, custom_permissions 
            FROM admin_users 
            WHERE custom_permissions::text LIKE '%verein.gallery%'
        `;

        if (users.length > 0) {
            console.log(`Found ${users.length} users with verein.gallery permissions`);
            for (const user of users as Array<Record<string, unknown>>) {
                const customPerms = (user.custom_permissions as unknown) || [];
                const filteredPerms = (Array.isArray(customPerms) ? customPerms : [])
                    .filter((p: unknown) => String(p).startsWith('verein.gallery') === false);

                await sql`
                    UPDATE admin_users 
                    SET custom_permissions = ${JSON.stringify(filteredPerms)}
                    WHERE id = ${user.id}
                `;
                console.log(`  ✓ Updated user: ${String(user.username ?? '')}`);
            }
        } else {
            console.log('  No users have verein.gallery in custom permissions');
        }

        // Delete the permissions from the permissions table
        console.log('\n🗑️  Deleting permissions from database...');
        await sql`
            DELETE FROM permissions 
            WHERE name LIKE 'verein.gallery%'
        `;

        console.log(`✅ Successfully removed ${existingPerms.length} verein.gallery permissions`);
        console.log('\n✨ Done! The following permissions have been removed:');
        existingPerms.forEach((perm: Record<string, unknown>) => {
            console.log(`  ✓ ${String(perm.name ?? '')}`);
        });

    } catch (error) {
        console.error('❌ Error removing verein.gallery permissions:', error);
        throw error;
    }
}

removeVereinGalleryPermissions();
