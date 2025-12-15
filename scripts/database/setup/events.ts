#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function setupEvents() {
    console.log('Setting up events table...');

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                start_date TIMESTAMP WITH TIME ZONE NOT NULL,
                end_date TIMESTAMP WITH TIME ZONE,
                location VARCHAR(255),
                category VARCHAR(50) DEFAULT 'sonstiges',
                organizer VARCHAR(255),
                image_url TEXT,
                -- Optional fields used by application
                verein_id VARCHAR(50),
                is_cancelled BOOLEAN DEFAULT FALSE,
                cancelled_at TIMESTAMP WITH TIME ZONE,
                cancelled_by VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('✓ events table ensured');

        await sql`CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);`;
        console.log('✓ events indexes ensured');

        // Ensure optional columns exist for upgrades from older schemas
        await sql`
            ALTER TABLE events
            ADD COLUMN IF NOT EXISTS verein_id VARCHAR(50),
            ADD COLUMN IF NOT EXISTS is_cancelled BOOLEAN DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
            ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(255);
        `;
        console.log('✓ ensured optional event columns (verein_id, cancellation fields)');

        console.log('✅ Events setup complete');
    } catch (err) {
        console.error('Error setting up events:', err);
        throw err;
    }
}

setupEvents()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
