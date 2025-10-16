import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function removeHasArticle() {
    console.log('🗑️  Removing has_article column from news table...');
    
    try {
        // Remove the has_article column
        await sql`
            ALTER TABLE news
            DROP COLUMN IF EXISTS has_article
        `;
        
        console.log('✓ Successfully removed has_article column');
        console.log('\n✅ Migration complete!');
        
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

removeHasArticle();
