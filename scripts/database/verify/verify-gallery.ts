#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function verify() {
    const expected = [
        'id',
        'filename',
        'original_name',
        'display_name',
        'url',
        'size',
        'mime_type',
        'uploaded_at',
        'created_at',
        'updated_at',
    ];

    const rows = await sql`
        SELECT column_name FROM information_schema.columns WHERE table_name = 'gallery_images'
    `;
    const cols = rows.map((r: any) => String(r.column_name));
    const missing = expected.filter((c) => !cols.includes(c));
    if (!missing.length) {
        console.log('gallery_images: OK');
        process.exit(0);
    }
    console.error('gallery_images: MISSING COLUMNS', missing);
    process.exit(2);
}

verify().catch((e) => {
    console.error(e);
    process.exit(1);
});
