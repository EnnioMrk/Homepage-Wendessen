#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function verify() {
    const expected = [
        'id',
        'submission_id',
        'reason',
        'reporter_info',
        'status',
        'reviewed_at',
        'reviewed_by',
        'created_at',
        'updated_at',
    ];
    const rows =
        await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'shared_gallery_reports'`;
    const cols = rows.map((r: any) => String(r.column_name));
    const missing = expected.filter((c) => !cols.includes(c));
    if (!missing.length) {
        console.log('shared_gallery_reports: OK');
        process.exit(0);
    }
    console.error('shared_gallery_reports: MISSING COLUMNS', missing);
    process.exit(2);
}
verify().catch((e) => {
    console.error(e);
    process.exit(1);
});
