import { sql } from '../lib/sql';

async function createVereinsverwalterRole() {
    console.log('Creating general Vereinsverwalter role...\n');

    try {
        // Check if role already exists
        const existingRole = await sql`
            SELECT id FROM roles WHERE name = 'vereinsverwalter' LIMIT 1;
        `;

        if (existingRole.length === 0) {
            await sql`
                INSERT INTO roles (name, display_name, description)
                VALUES (
                    'vereinsverwalter',
                    'Vereinsverwalter',
                    'Verwaltung von Inhalten für alle Vereine (Termine, Neuigkeiten, Bilder)'
                );
            `;
            console.log('✓ Created role: Vereinsverwalter');
        } else {
            console.log('  Skipped (exists): Vereinsverwalter');
        }

        console.log('\n✅ Vereinsverwalter role setup complete!');
        
        console.log('\n💡 Default Permissions for Vereinsverwalter Role:');
        console.log('  ✓ Events (view, create, edit, cancel)');
        console.log('  ✓ News (view, create, edit, delete)');
        console.log('  ✓ Gallery (view, upload, edit, delete)');
        
    } catch (error) {
        console.error('❌ Error creating Vereinsverwalter role:', error);
        throw error;
    }
}

createVereinsverwalterRole()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
