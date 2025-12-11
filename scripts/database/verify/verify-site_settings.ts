#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function verify() {
    const expected = [
        'id',
        'key',
        'value',
        'display_name',
        'description',
        'type',
        'category',
        'created_at',
        'updated_at',
    ];
    const rows =
        await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'site_settings'`;
    const cols = rows.map((r: any) => String(r.column_name));
    const missing = expected.filter((c) => !cols.includes(c));
    if (!missing.length) {
        console.log('site_settings: OK');
        process.exit(0);
    }
    console.error('site_settings: MISSING COLUMNS', missing);
    process.exit(2);
}
verify().catch((e) => {
    console.error(e);
    process.exit(1);
});
