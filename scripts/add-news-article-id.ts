import crypto from 'crypto';
import { sql } from '../lib/sql';

async function generateUniqueId(): Promise<string> {
    // Generate a random 32-bit ID (8 hex characters)
    return crypto.randomBytes(4).toString('hex');
}

async function addArticleIdColumn() {
    try {
        console.log('🔧 Adding article_id column to news table...');

        // Add article_id column (nullable initially)
        await sql`
            ALTER TABLE news 
            ADD COLUMN IF NOT EXISTS article_id VARCHAR(8) UNIQUE;
        `;

        console.log('✅ Column added successfully');

        // Get all existing news items
        const existingNews = await sql`SELECT id FROM news`;

        console.log(`📝 Generating IDs for ${existingNews.length} existing news items...`);

        // Generate unique IDs for existing news
        for (const newsItem of existingNews) {
            let articleId = await generateUniqueId();
            
            // Ensure uniqueness
            let exists = true;
            while (exists) {
                const check = await sql`SELECT id FROM news WHERE article_id = ${articleId}`;
                if (check.length === 0) {
                    exists = false;
                } else {
                    articleId = await generateUniqueId();
                }
            }

            await sql`
                UPDATE news 
                SET article_id = ${articleId}
                WHERE id = ${newsItem.id}
            `;
        }

        console.log('✅ Generated unique IDs for all existing news items');

        // Make article_id NOT NULL after populating
        await sql`
            ALTER TABLE news 
            ALTER COLUMN article_id SET NOT NULL;
        `;

        console.log('✅ Made article_id column required');

        // Create index for better performance
        await sql`
            CREATE INDEX IF NOT EXISTS idx_news_article_id ON news(article_id);
        `;

        console.log('✅ Index created successfully');
        console.log('🎉 Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

addArticleIdColumn();
