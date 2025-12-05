import { sql } from '../lib/sql';

async function setupAdminLogs() {
    console.log('Setting up admin_logs table...');

    // Create the admin_logs table
    await sql`
        CREATE TABLE IF NOT EXISTS admin_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
            username VARCHAR(255),
            action VARCHAR(100) NOT NULL,
            resource_type VARCHAR(100),
            resource_id VARCHAR(255),
            resource_title VARCHAR(500),
            details JSONB,
            ip_address VARCHAR(45),
            user_agent TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    console.log('Created admin_logs table');

    // Create indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON admin_logs(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_admin_logs_resource_type ON admin_logs(resource_type);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at DESC);`;

    console.log('Created indexes');

    // Add permissions for viewing logs
    await sql`
        INSERT INTO permissions (name, display_name, description, category)
        VALUES ('logs.view', 'Aktivitätslog ansehen', 'Kann das Aktivitätslog der Admins ansehen', 'system')
        ON CONFLICT (name) DO NOTHING
    `;

    console.log('Added logs.view permission');

    // Verify
    const logs = await sql`SELECT COUNT(*) as count FROM admin_logs`;
    console.log('Current log entries:', logs[0].count);

    process.exit(0);
}

setupAdminLogs().catch((error) => {
    console.error('Error setting up admin logs:', error);
    process.exit(1);
});
