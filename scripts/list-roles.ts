import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function listRoles() {
    console.log('Checking roles in database...\n');

    try {
        const roles = await sql`
            SELECT id, name, display_name, description 
            FROM roles 
            ORDER BY name;
        `;

        console.log('Current roles:');
        console.log('==============\n');
        
        for (const role of roles) {
            console.log(`ID: ${role.id}`);
            console.log(`Name: ${role.name}`);
            console.log(`Display Name: ${role.display_name}`);
            console.log(`Description: ${role.description}`);
            console.log('---');
        }

        console.log(`\nTotal: ${roles.length} roles`);

        // Check for verein_ prefixed roles
        const vereinRoles = roles.filter((r: any) => String(r.name).startsWith('verein_'));
        if (vereinRoles.length > 0) {
            console.log(`\n⚠️  Found ${vereinRoles.length} Verein-specific roles that should be removed:`);
            for (const role of vereinRoles) {
                console.log(`   - ${role.name} (${role.display_name})`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error checking roles:', error);
        throw error;
    }
}

listRoles()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
