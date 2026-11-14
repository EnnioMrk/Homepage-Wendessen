/**
 * Restore a JSON snapshot written by scripts/db-backup.ts.
 *
 *   bun run scripts/db-restore.ts backups/prod-<stamp>.json --dry-run
 *   bun run scripts/db-restore.ts backups/prod-<stamp>.json --yes
 *
 * The restore runs in one transaction per table, deletes the table's current
 * rows and inserts the snapshot rows with explicit column lists, so a schema
 * with extra nullable columns still restores. It refuses to run unless --yes is
 * passed. Always take a fresh backup before a restore.
 */
import pg from 'pg';
const { Client } = pg;
import { readFileSync } from 'node:fs';

interface Snapshot {
    takenAt: string;
    tables: Record<string, Record<string, unknown>[]>;
}

async function main() {
    const file = process.argv[2];
    const confirmed = process.argv.includes('--yes');
    const dryRun = process.argv.includes('--dry-run') || !confirmed;

    if (!file) {
        throw new Error('Usage: bun run scripts/db-restore.ts <snapshot.json> [--yes]');
    }

    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not set');

    const snapshot = JSON.parse(readFileSync(file, 'utf8')) as Snapshot;
    const client = new Client({ connectionString: url });
    await client.connect();

    try {
        const tables = Object.keys(snapshot.tables);
        console.log(`Snapshot ${snapshot.takenAt}, ${tables.length} tables`);
        if (dryRun) {
            for (const table of tables) {
                console.log(
                    `would restore ${table}: ${snapshot.tables[table].length} rows`,
                );
            }
            console.log('Dry run. Pass --yes to write.');
            return;
        }

        await client.query('BEGIN');
        // Child tables first, so foreign keys never block a delete.
        const order = [...tables].reverse();
        for (const table of order) {
            await client.query(
                `DELETE FROM "${table.replace(/"/g, '""')}"`,
            );
        }

        for (const table of tables) {
            const rows = snapshot.tables[table];
            if (rows.length === 0) continue;
            const columns = Object.keys(rows[0]);
            const columnList = columns
                .map((c) => `"${c.replace(/"/g, '""')}"`)
                .join(', ');
            for (const row of rows) {
                const placeholders = columns
                    .map((_, i) => `$${i + 1}`)
                    .join(', ');
                await client.query(
                    `INSERT INTO "${table.replace(/"/g, '""')}" (${columnList}) VALUES (${placeholders})`,
                    columns.map((c) => row[c]),
                );
            }
            console.log(`restored ${table}: ${rows.length} rows`);
        }

        await client.query('COMMIT');
        console.log('Restore committed.');
    } catch (error) {
        await client.query('ROLLBACK').catch(() => undefined);
        throw error;
    } finally {
        await client.end();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
