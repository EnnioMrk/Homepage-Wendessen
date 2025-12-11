#!/usr/bin/env bunx
import { sql } from '../../lib/sql';

async function addNewsColumns() {
    console.log(
        'Adding missing columns to news table (article_id, is_pinned, pinned_at)...'
    );
    try {
        await sql`
            ALTER TABLE news
            ADD COLUMN IF NOT EXISTS article_id VARCHAR(32) UNIQUE,
            ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false,
            ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMP WITH TIME ZONE NULL;
        `;

        await sql`CREATE INDEX IF NOT EXISTS idx_news_article_id ON news(article_id);`;
        await sql`CREATE INDEX IF NOT EXISTS idx_news_pinned_at ON news(pinned_at);`;

        console.log('✅ News columns ensured');
    } catch (err) {
        console.error('Failed to add news columns:', err);
        process.exit(1);
    }
}

addNewsColumns()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
