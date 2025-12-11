#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function verify() {
    const expected = [
        'id',
        'name',
        'description',
        'email',
        'image_url',
        'image_storage_path',
        'image_mime_type',
        'image_filename',
        'status',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'created_at',
        'updated_at',
    ];
    const rows =
        await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'portraits'`;
    const cols = rows.map((r: any) => String(r.column_name));
    const missing = expected.filter((c) => !cols.includes(c));
    if (!missing.length) {
        console.log('portraits: OK');
        process.exit(0);
    }
    console.error('portraits: MISSING COLUMNS', missing);
    process.exit(2);
}
verify().catch((e) => {
    console.error(e);
    process.exit(1);
});
