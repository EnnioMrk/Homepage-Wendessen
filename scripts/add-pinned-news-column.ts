import { sql } from '../lib/sql';

async function addPinnedNewsColumn() {
    console.log('Adding is_pinned column to news table...');

    try {
        // Add is_pinned column
        await sql`
            ALTER TABLE news
            ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE;
        `;

        console.log('✅ Added is_pinned column');

        // Add pinned_at column to track when it was pinned (for ordering)
        await sql`
            ALTER TABLE news
            ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMP WITH TIME ZONE;
        `;

        console.log('✅ Added pinned_at column');

        // Create index for better performance when querying pinned news
        await sql`
            CREATE INDEX IF NOT EXISTS idx_news_is_pinned ON news(is_pinned);
        `;

        console.log('✅ Created index on is_pinned');

        // Verify the columns were added
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'news' 
            AND column_name IN ('is_pinned', 'pinned_at');
        `;

        console.log('📊 Column verification:', result);
    } catch (error) {
        console.error('❌ Error adding pinned news column:', error);
        process.exit(1);
    }
}

addPinnedNewsColumn()
    .then(() => {
        console.log('🎉 Pinned news column migration completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    });
