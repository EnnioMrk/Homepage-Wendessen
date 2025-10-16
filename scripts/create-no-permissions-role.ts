import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function createNoPermissionsRole() {
    console.log('Creating role with no permissions for testing...\n');

    try {
        // Check if role already exists
        const existingRole = await sql`
            SELECT id FROM roles WHERE name = 'no_permissions' LIMIT 1;
        `;

        if (existingRole.length === 0) {
            await sql`
                INSERT INTO roles (name, display_name, description)
                VALUES (
                    'no_permissions',
                    'Keine Berechtigungen (Test)',
                    'Test-Rolle ohne jegliche Berechtigungen'
                );
            `;
            console.log('✓ Created role: Keine Berechtigungen (Test)');
        } else {
            console.log('  Skipped (exists): Keine Berechtigungen (Test)');
        }

        console.log('\n✅ Test role created!');
        console.log('\n💡 This role has NO permissions and can be used to test permission restrictions.');
        console.log('   Assign this role to a user to verify they cannot access any admin modules.');
        
    } catch (error) {
        console.error('❌ Error creating test role:', error);
        throw error;
    }
}

createNoPermissionsRole()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
