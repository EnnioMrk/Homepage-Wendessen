import { sql } from '../lib/sql';

/**
 * Add the default_permissions column to the roles table
 */
async function addDefaultPermissionsColumn() {
    console.log('Adding default_permissions column to roles table...\n');

    try {
        await sql`
            ALTER TABLE roles 
            ADD COLUMN IF NOT EXISTS default_permissions JSONB DEFAULT '[]'::jsonb;
        `;

        console.log(
            '✅ Successfully added default_permissions column to roles table'
        );
        console.log('\nYou can now run the migration script:');
        console.log('  bun run scripts/migrate-default-permissions-to-db.ts');
    } catch (error) {
        console.error('❌ Error adding column:', error);
        throw error;
    }
}

addDefaultPermissionsColumn()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
