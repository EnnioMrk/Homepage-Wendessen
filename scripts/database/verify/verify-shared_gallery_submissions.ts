#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function verify() {
    const expected = [
        'id',
        'submission_group_id',
        'title',
        'description',
        'submitter_name',
        'submitter_email',
        'image_url',
        'image_storage_path',
        'image_mime_type',
        'image_filename',
        'date_taken',
        'location',
        'status',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'rejection_reason',
        'updated_at',
    ];
    const rows =
        await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'shared_gallery_submissions'`;
    const cols = rows.map((r: any) => String(r.column_name));
    const missing = expected.filter((c) => !cols.includes(c));
    if (!missing.length) {
        console.log('shared_gallery_submissions: OK');
        process.exit(0);
    }
    console.error('shared_gallery_submissions: MISSING COLUMNS', missing);
    process.exit(2);
}
verify().catch((e) => {
    console.error(e);
    process.exit(1);
});
