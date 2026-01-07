#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function setupNews() {
    console.log('Setting up news table and columns...');

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS news (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL UNIQUE,
                content TEXT,
                category VARCHAR(50) NOT NULL,
                published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        console.log('✓ news table ensured');

        // Ensure columns used by application exist
        await sql`
            ALTER TABLE news
            ADD COLUMN IF NOT EXISTS article_id VARCHAR(32) UNIQUE,
            ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMP WITH TIME ZONE NULL,
            ADD COLUMN IF NOT EXISTS pinned_order INT DEFAULT 0;
        `;
        console.log('✓ news columns ensured');

        await sql`CREATE INDEX IF NOT EXISTS idx_news_article_id ON news(article_id);`;
        await sql`CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date);`;
        await sql`CREATE INDEX IF NOT EXISTS idx_news_pinned_at ON news(pinned_at);`;

        console.log('✅ News setup complete');
    } catch (err) {
        console.error('Error setting up news:', err);
        throw err;
    }
}

setupNews()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
