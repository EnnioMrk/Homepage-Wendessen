#!/usr/bin/env bunx
import { sql } from '../../lib/sql';

async function backfillArticleIds() {
    console.log('Backfilling missing article_id values for news...');
    try {
        const rows =
            await sql`SELECT id FROM news WHERE article_id IS NULL OR article_id = ''`;

        if (!rows || rows.length === 0) {
            console.log('No news rows need article_id backfill');
            process.exit(0);
        }

        const crypto = await import('crypto');

        for (const r of rows) {
            let articleId = crypto.randomBytes(4).toString('hex');
            // ensure uniqueness
            let exists = true;
            while (exists) {
                const check =
                    await sql`SELECT id FROM news WHERE article_id = ${articleId}`;
                if (check.length === 0) exists = false;
                else articleId = crypto.randomBytes(4).toString('hex');
            }

            await sql`UPDATE news SET article_id = ${articleId} WHERE id = ${r.id}`;
            console.log(`- updated news id=${r.id} article_id=${articleId}`);
        }

        console.log('✅ Backfill complete');
    } catch (err) {
        console.error('Backfill failed:', err);
        process.exit(1);
    }
}

backfillArticleIds();
