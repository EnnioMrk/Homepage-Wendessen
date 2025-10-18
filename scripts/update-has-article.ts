import { sql } from '../lib/sql';

async function updateHasArticle() {
    console.log('Updating has_article flags...');
    
    await sql`
        UPDATE news
        SET has_article = true
        WHERE content IS NOT NULL 
        AND content::text != 'null'
    `;
    
    console.log('✓ Updated has_article flags');
}

updateHasArticle();
