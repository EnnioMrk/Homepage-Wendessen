import { sql } from '../lib/sql';

async function addNewsArticleFields() {
    try {
        console.log('Adding article fields to news table...');

        // Add slug column (unique identifier for URL)
        await sql`
            ALTER TABLE news
            ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE
        `;
        console.log('✓ Added slug column');

        // Add content_json column for Slate.js content
        await sql`
            ALTER TABLE news
            ADD COLUMN IF NOT EXISTS content_json JSONB
        `;
        console.log('✓ Added content_json column');

        // Add has_article boolean flag
        await sql`
            ALTER TABLE news
            ADD COLUMN IF NOT EXISTS has_article BOOLEAN DEFAULT FALSE
        `;
        console.log('✓ Added has_article column');

        // Generate slugs for existing news items
        const existingNews = await sql`
            SELECT id, title FROM news WHERE slug IS NULL
        `;

        for (const news of existingNews) {
            const slug = String(news.title)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                .replace(/ä/g, 'ae')
                .replace(/ö/g, 'oe')
                .replace(/ü/g, 'ue')
                .replace(/ß/g, 'ss')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .substring(0, 255);

            // Ensure uniqueness
            let finalSlug = slug;
            let counter = 1;
            while (true) {
                const existing = await sql`
                    SELECT id FROM news WHERE slug = ${finalSlug} AND id != ${news.id}
                `;
                if (existing.length === 0) break;
                finalSlug = `${slug}-${counter}`;
                counter++;
            }

            await sql`
                UPDATE news
                SET slug = ${finalSlug}
                WHERE id = ${news.id}
            `;
        }
        console.log(`✓ Generated slugs for ${existingNews.length} existing news items`);

        console.log('\n✅ News article fields added successfully!');
    } catch (error) {
        console.error('❌ Error adding news article fields:', error);
        throw error;
    }
}

addNewsArticleFields();
