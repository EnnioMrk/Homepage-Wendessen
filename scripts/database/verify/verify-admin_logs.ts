#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function verify() {
    const expected = [
        'id',
        'user_id',
        'username',
        'action',
        'resource_type',
        'resource_id',
        'resource_title',
        'details',
        'ip_address',
        'user_agent',
        'created_at',
    ];
    const rows =
        await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'admin_logs'`;
    const cols = rows.map((r: any) => String(r.column_name));
    const missing = expected.filter((c) => !cols.includes(c));
    if (!missing.length) {
        console.log('admin_logs: OK');
        process.exit(0);
    }
    console.error('admin_logs: MISSING COLUMNS', missing);
    process.exit(2);
}
verify().catch((e) => {
    console.error(e);
    process.exit(1);
});
