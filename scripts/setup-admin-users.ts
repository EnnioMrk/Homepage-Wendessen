import * as bcrypt from 'bcryptjs';
import { sql } from '../lib/sql';

async function setupAdminUsers() {
    console.log('Setting up admin_users table...');

    try {
        // Create admin_users table
        await sql`
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                must_change_password BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP WITH TIME ZONE
            );
        `;

        console.log('✓ admin_users table created');

        // Create an index on username for faster lookups
        await sql`
            CREATE INDEX IF NOT EXISTS idx_admin_users_username 
            ON admin_users(username);
        `;

        console.log('✓ Created index on username');

        // Check if there are any existing admin users
        const existingAdmins = await sql`
            SELECT COUNT(*) as count FROM admin_users;
        `;

        const adminCount = Number(existingAdmins[0].count);

        if (adminCount === 0) {
            // Create a default admin user if none exist
            const defaultUsername = 'admin';
            const defaultPassword = 'admin123'; // Should be changed immediately
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);

            await sql`
                INSERT INTO admin_users (username, password_hash, must_change_password)
                VALUES (${defaultUsername}, ${hashedPassword}, true);
            `;

            console.log('✓ Created default admin user');
            console.log('  Username: admin');
            console.log('  Password: admin123');
            console.log('  IMPORTANT: Change this password immediately!');
        } else {
            console.log(`✓ Found ${adminCount} existing admin user(s)`);
        }

        console.log('\n✅ Admin users setup complete!');
    } catch (error) {
        console.error('Error setting up admin users:', error);
        throw error;
    }
}

setupAdminUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
