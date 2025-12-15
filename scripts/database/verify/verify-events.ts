#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function verify() {
    const expected = [
        'id',
        'title',
        'description',
        'start_date',
        'end_date',
        'location',
        'category',
        'organizer',
        'image_url',
        'verein_id',
        'is_cancelled',
        'cancelled_at',
        'cancelled_by',
        'created_at',
        'updated_at',
    ];
    const rows =
        await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'events'`;
    const cols = rows.map((r: any) => String(r.column_name));
    const missing = expected.filter((c) => !cols.includes(c));
    if (!missing.length) {
        console.log('events: OK');
        process.exit(0);
    }
    console.error('events: MISSING COLUMNS', missing);
    process.exit(2);
}
verify().catch((e) => {
    console.error(e);
    process.exit(1);
});
