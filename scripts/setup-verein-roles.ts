import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function setupVereinsverwalterRole() {
    console.log('Setting up general Vereinsverwalter role...\n');

    try {
        // Create a single general Vereinsverwalter role
        const roleName = 'vereinsverwalter';
        const roleDisplayName = 'Vereinsverwalter';
        const description = 'Verwaltung von Inhalten für alle Vereine (Termine, Neuigkeiten, Bilder)';

        // Check if role already exists
        const existingRole = await sql`
            SELECT id FROM roles WHERE name = ${roleName} LIMIT 1;
        `;

        if (existingRole.length === 0) {
            await sql`
                INSERT INTO roles (name, display_name, description)
                VALUES (${roleName}, ${roleDisplayName}, ${description});
            `;
            console.log(`✓ Created role: ${roleDisplayName}`);
        } else {
            console.log(`  Skipped (exists): ${roleDisplayName}`);
        }

        console.log('\n✅ Vereinsverwalter role setup complete!');
        
        console.log('\n💡 Default Permissions for Vereinsverwalter Role:');
        console.log('  ✓ Events (view, create, edit, cancel)');
        console.log('  ✓ News (view, create, edit, delete)');
        console.log('  ✓ Gallery (view, upload, edit, delete)');
        console.log('\n  Note: This is a general role for all Verein administrators.');
        
    } catch (error) {
        console.error('❌ Error setting up Vereinsverwalter role:', error);
        throw error;
    }
}

setupVereinsverwalterRole()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
