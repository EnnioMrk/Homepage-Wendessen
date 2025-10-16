import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function addVereinIdColumn() {
    console.log('Adding verein_id column to admin_users table...\n');

    try {
        // Check if column already exists
        const columnCheck = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'admin_users' 
            AND column_name = 'verein_id';
        `;

        if (columnCheck.length === 0) {
            // Add the verein_id column
            await sql`
                ALTER TABLE admin_users 
                ADD COLUMN verein_id VARCHAR(50);
            `;
            console.log('✓ Added verein_id column to admin_users table');

            // Create an index for faster lookups
            await sql`
                CREATE INDEX IF NOT EXISTS idx_admin_users_verein_id 
                ON admin_users(verein_id);
            `;
            console.log('✓ Created index on verein_id');
        } else {
            console.log('  Skipped: verein_id column already exists');
        }

        console.log('\n✅ Migration complete!');
        console.log('\n💡 The verein_id column stores the Verein identifier for Vereinsverwalter users.');
        console.log('   This allows assignment of admins to specific Vereine while using a single role.');
        
    } catch (error) {
        console.error('❌ Error adding verein_id column:', error);
        throw error;
    }
}

addVereinIdColumn()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
