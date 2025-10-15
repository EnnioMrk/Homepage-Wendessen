import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Vereine data
const vereine = [
    { id: 'sv-wendessen', name: 'SV Wendessen', displayName: 'SV Wendessen' },
    { id: 'feuerwehr', name: 'Freiwillige Feuerwehr', displayName: 'Freiwillige Feuerwehr' },
    { id: 'jugendfeuerwehr', name: 'Jugendfeuerwehr', displayName: 'Jugendfeuerwehr' },
    { id: 'kleingaertner', name: 'Kleingärtner-Verein', displayName: 'Kleingärtner-Verein' },
    { id: 'kirchbauverein', name: 'Kirchbauverein', displayName: 'Kirchbauverein' },
    { id: 'initiative-spritzenhaus', name: 'Initiative Spritzenhaus', displayName: 'Initiative Spritzenhaus' },
    { id: 'schuetzenverein', name: 'Schützenverein', displayName: 'Schützenverein' },
];

async function setupVereinRoles() {
    console.log('Setting up Verein-specific roles...\n');

    try {
        // First, create permissions for Verein-specific content management if they don't exist
        const vereinPermissions = [
            { name: 'verein.events.create', displayName: 'Vereinstermine erstellen', description: 'Kann Termine für eigenen Verein erstellen', category: 'verein' },
            { name: 'verein.events.edit', displayName: 'Vereinstermine bearbeiten', description: 'Kann Termine für eigenen Verein bearbeiten', category: 'verein' },
            { name: 'verein.events.delete', displayName: 'Vereinstermine löschen', description: 'Kann Termine für eigenen Verein löschen', category: 'verein' },
            { name: 'verein.news.create', displayName: 'Vereinsnews erstellen', description: 'Kann Neuigkeiten für eigenen Verein erstellen', category: 'verein' },
            { name: 'verein.news.edit', displayName: 'Vereinsnews bearbeiten', description: 'Kann Neuigkeiten für eigenen Verein bearbeiten', category: 'verein' },
            { name: 'verein.news.delete', displayName: 'Vereinsnews löschen', description: 'Kann Neuigkeiten für eigenen Verein löschen', category: 'verein' },
            { name: 'verein.gallery.upload', displayName: 'Vereinsbilder hochladen', description: 'Kann Bilder für eigenen Verein hochladen', category: 'verein' },
            { name: 'verein.gallery.edit', displayName: 'Vereinsbilder bearbeiten', description: 'Kann Bilder für eigenen Verein bearbeiten', category: 'verein' },
            { name: 'verein.gallery.delete', displayName: 'Vereinsbilder löschen', description: 'Kann Bilder für eigenen Verein löschen', category: 'verein' },
        ];

        for (const perm of vereinPermissions) {
            const existing = await sql`
                SELECT id FROM permissions WHERE name = ${perm.name} LIMIT 1;
            `;

            if (existing.length === 0) {
                await sql`
                    INSERT INTO permissions (name, display_name, description, category)
                    VALUES (${perm.name}, ${perm.displayName}, ${perm.description}, ${perm.category});
                `;
                console.log(`✓ Created permission: ${perm.displayName}`);
            }
        }

        console.log('\n✓ Verein permissions setup complete\n');

        // Now create a role for each Verein
        let newRolesCount = 0;
        let existingRolesCount = 0;

        for (const verein of vereine) {
            const roleName = `verein_${verein.id}`;
            const roleDisplayName = `${verein.displayName} - Vereinsverwalter`;
            const description = `Verwaltung von Inhalten für ${verein.name} (Termine, Neuigkeiten, Bilder)`;

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
                newRolesCount++;
            } else {
                console.log(`  Skipped (exists): ${roleDisplayName}`);
                existingRolesCount++;
            }
        }

        console.log('\n✅ Verein roles setup complete!');
        console.log(`\nSummary:`);
        console.log(`  - New roles created: ${newRolesCount}`);
        console.log(`  - Existing roles found: ${existingRolesCount}`);
        console.log(`  - Total Verein roles: ${vereine.length}`);
        
        console.log('\n📋 Created Verein Roles:');
        for (const verein of vereine) {
            console.log(`  - ${verein.displayName} (verein_${verein.id})`);
        }

        console.log('\n💡 Default Permissions for Verein Roles:');
        console.log('  Each Verein can manage their own:');
        console.log('  ✓ Events (create, edit, delete)');
        console.log('  ✓ News (create, edit, delete)');
        console.log('  ✓ Gallery images (upload, edit, delete)');
        console.log('\n  Note: Permissions must be assigned to each role or as custom permissions to users.');
        
    } catch (error) {
        console.error('❌ Error setting up Verein roles:', error);
        throw error;
    }
}

setupVereinRoles()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
