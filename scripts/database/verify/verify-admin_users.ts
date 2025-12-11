#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function verify() {
    const expected = [
        'id',
        'username',
        'password_hash',
        'verein_id',
        'must_change_password',
        'created_at',
        'updated_at',
        'last_login',
        'role_id',
        'custom_permissions',
    ];
    const rows = await sql`
        SELECT column_name FROM information_schema.columns WHERE table_name = 'admin_users'
    `;
    const cols = rows.map((r: any) => String(r.column_name));
    const missing = expected.filter((c) => !cols.includes(c));
    if (missing.length === 0) {
        console.log('admin_users: OK');
        process.exit(0);
    } else {
        console.error('admin_users: MISSING COLUMNS', missing);
        process.exit(2);
    }
}

verify().catch((e) => {
    console.error(e);
    process.exit(1);
});
