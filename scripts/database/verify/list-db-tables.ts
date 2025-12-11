#!/usr/bin/env bunx tsx
import { sql } from '../../../lib/sql';

async function run() {
  const rows = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
  const names = (rows || []).map((r: { table_name?: string }) => String(r.table_name));
  console.log(names.join('\n'));
}

run().catch((e) => { console.error(e); process.exit(1); });
