import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function migrateNewsContent() {
    console.log('🔄 Starting news content migration...\n');

    try {
        // Step 1: Get all news items
        console.log('📋 Finding news items...');
        const allNews = await sql`
            SELECT id, title, content, content_json
            FROM news
        `;
        
        // Filter in JavaScript to avoid SQL type issues
        const newsWithContent = allNews.filter(news => {
            const hasContent = news.content && news.content.trim() !== '';
            const hasNoJson = !news.content_json || 
                             news.content_json === '' || 
                             news.content_json === 'null' ||
                             news.content_json === null;
            return hasContent && hasNoJson;
        });
        
        console.log(`✓ Found ${newsWithContent.length} news item(s) to migrate\n`);

        // Step 2: Migrate content to content_json format
        if (newsWithContent.length > 0) {
            console.log('🔄 Migrating content to JSON format...');
            
            for (const news of newsWithContent) {
                const contentJson = JSON.stringify([
                    {
                        type: 'paragraph',
                        children: [{ text: news.content }]
                    }
                ]);

                await sql`
                    UPDATE news
                    SET content_json = ${contentJson}
                    WHERE id = ${news.id}
                `;
                
                console.log(`  ✓ Migrated: "${news.title}"`);
            }
            console.log('');
        }

        // Step 3: Rename content_json to content and drop old content column
        console.log('🔄 Renaming columns...');
        
        // Step 4: Update has_article for all items with content_json before renaming
        console.log('\n🔄 Updating has_article flags...');
        await sql`
            UPDATE news
            SET has_article = true
            WHERE content_json IS NOT NULL 
            AND content_json::text != 'null'
        `;
        console.log('✓ Updated has_article flags');

        // Drop the old content column
        await sql`ALTER TABLE news DROP COLUMN IF EXISTS content`;
        console.log('✓ Dropped old content column');

        // Rename content_json to content
        await sql`ALTER TABLE news RENAME COLUMN content_json TO content`;
        console.log('✓ Renamed content_json to content');

        console.log('\n✅ Migration completed successfully!');
        console.log('\nSummary:');
        console.log(`  - Migrated ${newsWithContent.length} news item(s)`);
        console.log('  - Dropped old content column');
        console.log('  - Renamed content_json to content');
        console.log('  - Updated has_article flags');

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

migrateNewsContent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
