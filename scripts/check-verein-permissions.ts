import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkVereinPermissions() {
    console.log('Checking verein permissions in database...\n');

    try {
        const permissions = await sql`
            SELECT name, display_name, description, category 
            FROM permissions 
            WHERE category = 'verein'
            ORDER BY name;
        `;

        if (permissions.length > 0) {
            console.log('Found verein permissions:');
            console.log('========================\n');
            
            for (const perm of permissions) {
                console.log(`Name: ${perm.name}`);
                console.log(`Display Name: ${perm.display_name}`);
                console.log(`Description: ${perm.description}`);
                console.log('---');
            }
            console.log(`\nTotal: ${permissions.length} verein permissions`);
        } else {
            console.log('❌ No verein permissions found in database.');
            console.log('\n💡 Run setup-verein-roles.ts to create them.');
        }
        
    } catch (error) {
        console.error('❌ Error checking permissions:', error);
        throw error;
    }
}

checkVereinPermissions()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
