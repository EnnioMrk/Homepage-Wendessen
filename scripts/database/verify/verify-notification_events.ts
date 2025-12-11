#!/usr/bin/env bunx
import { sql } from '../../../lib/sql';

async function verify() {
    const expected = ['id', 'event_type', 'resource_id', 'created_at'];
    const rows =
        await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'notification_events'`;
    const cols = rows.map((r: any) => String(r.column_name));
    const missing = expected.filter((c) => !cols.includes(c));
    if (!missing.length) {
        console.log('notification_events: OK');
        process.exit(0);
    }
    console.error('notification_events: MISSING COLUMNS', missing);
    process.exit(2);
}
verify().catch((e) => {
    console.error(e);
    process.exit(1);
});
