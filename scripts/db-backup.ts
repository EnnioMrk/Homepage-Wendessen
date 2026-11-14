/**
 * Backup every table in the public schema to a JSON file.
 *
 *   bun run scripts/db-backup.ts [outfile]
 *
 * The file is a plain, human-readable snapshot: { takenAt, tables: { name: rows[] } }.
 * Restore with scripts/db-restore.ts. No table is truncated by this script.
 */
import pg from 'pg';
const { Client } = pg;
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

async function main() {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');

    const stamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .slice(0, 19);
    const out =
        process.argv[2] || `backups/prod-${stamp}.json`;

    const client = new Client({ connectionString: url });
    await client.connect();

    try {
        const { rows: tableRows } = await client.query(
            `SELECT table_name FROM information_schema.tables
             WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
             ORDER BY table_name`,
        );

        const tables: Record<string, unknown[]> = {};
        for (const { table_name } of tableRows as { table_name: string }[]) {
            const ident = `"${table_name.replace(/"/g, '""')}"`;
            const { rows } = await client.query(`SELECT * FROM ${ident}`);
            tables[table_name] = rows;
            console.log(`${table_name}: ${rows.length} rows`);
        }

        const payload = {
            takenAt: new Date().toISOString(),
            database: 'public',
            tables,
        };

        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, JSON.stringify(payload, null, 2));
        console.log(`Backup written to ${out}`);
    } finally {
        await client.end();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
