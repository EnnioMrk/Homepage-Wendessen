import { sql } from '../lib/sql';

async function setupPushSubscriptions() {
    console.log('Setting up push subscriptions table...');

    try {
        // Create push_subscriptions table
        await sql`
            CREATE TABLE IF NOT EXISTS push_subscriptions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
                endpoint TEXT NOT NULL UNIQUE,
                p256dh TEXT NOT NULL,
                auth TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create index for faster lookups by user
        await sql`
            CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id 
            ON push_subscriptions(user_id)
        `;

        // Create notification_events table to track what notifications have been sent
        // This prevents duplicate notifications
        await sql`
            CREATE TABLE IF NOT EXISTS notification_events (
                id SERIAL PRIMARY KEY,
                event_type TEXT NOT NULL,
                resource_id TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(event_type, resource_id)
            )
        `;

        console.log('✅ Push subscriptions tables created successfully!');
    } catch (error) {
        console.error('Error setting up push subscriptions:', error);
        throw error;
    }

    process.exit(0);
}

setupPushSubscriptions();
