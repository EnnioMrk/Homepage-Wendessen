import { sql } from '../lib/sql';

async function removeVereinSpecificRoles() {
    console.log('Removing individual Verein-specific roles...\n');

    try {
        // First, check if any users are assigned to these roles
        const usersWithVereinRoles = await sql`
            SELECT u.id, u.username, r.name as role_name, r.display_name as role_display_name
            FROM admin_users u
            JOIN roles r ON u.role_id = r.id
            WHERE r.name LIKE 'verein_%' AND r.name != 'vereinsverwalter';
        `;

        if (usersWithVereinRoles.length > 0) {
            console.log(`⚠️  Found ${usersWithVereinRoles.length} user(s) with old Verein roles:\n`);
            
            // Get the general vereinsverwalter role
            const vereinsverwalterRole = await sql`
                SELECT id FROM roles WHERE name = 'vereinsverwalter' LIMIT 1;
            `;

            if (vereinsverwalterRole.length === 0) {
                console.error('❌ General "vereinsverwalter" role not found. Please create it first.');
                throw new Error('Vereinsverwalter role missing');
            }

            const vereinsverwalterRoleId = Number(vereinsverwalterRole[0].id);

            // Update users to use the general vereinsverwalter role
            for (const user of usersWithVereinRoles) {
                await sql`
                    UPDATE admin_users 
                    SET role_id = ${vereinsverwalterRoleId}
                    WHERE id = ${user.id};
                `;
                console.log(`   ✓ Updated user "${user.username}" from "${user.role_display_name}" to "Vereinsverwalter"`);
            }
            console.log('');
        }

        // Delete all Verein-specific roles (except vereinsverwalter)
        const result = await sql`
            DELETE FROM roles 
            WHERE name LIKE 'verein_%' AND name != 'vereinsverwalter'
            RETURNING name, display_name;
        `;

        console.log(`✓ Removed ${result.length} Verein-specific roles:\n`);
        for (const role of result) {
            console.log(`   - ${role.name} (${role.display_name})`);
        }

        console.log('\n✅ Cleanup complete!');
        console.log('\n💡 Only the general "Vereinsverwalter" role remains.');
        console.log('   Users can now be assigned to this role and optionally linked to a specific Verein.');
        
    } catch (error) {
        console.error('❌ Error removing Verein roles:', error);
        throw error;
    }
}

removeVereinSpecificRoles()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
