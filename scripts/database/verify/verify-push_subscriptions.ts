#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function verify() {
    const expected = [
        'id',
        'user_id',
        'endpoint',
        'p256dh',
        'auth',
        'created_at',
        'updated_at',
    ];
    const rows =
        await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'push_subscriptions'`;
    const cols = rows.map((r: any) => String(r.column_name));
    const missing = expected.filter((c) => !cols.includes(c));
    if (!missing.length) {
        console.log('push_subscriptions: OK');
        process.exit(0);
    }
    console.error('push_subscriptions: MISSING COLUMNS', missing);
    process.exit(2);
}
verify().catch((e) => {
    console.error(e);
    process.exit(1);
});
