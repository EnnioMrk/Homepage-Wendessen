#!/usr/bin/env bunx
import path from 'path';
import { spawnSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';
import { pool } from '../../lib/sql';

function question(prompt: string): Promise<string> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

function parseDatabaseName(conn: string): { host?: string; port?: string; database?: string } {
    try {
        // Support postgres/postgresql URIs
        let uri = conn;
        if (uri.startsWith('postgres://')) uri = uri.replace('postgres://', 'postgresql://');
        const u = new URL(uri);
        const pathname = u.pathname || '';
        const db = pathname.startsWith('/') ? pathname.slice(1) : pathname;
        return { host: u.hostname, port: u.port, database: db };
    } catch (err) {
        return {};
    }
}

async function main(): Promise<void> {
    if (!process.env.DATABASE_URL) {
        console.error('DATABASE_URL not found in environment; aborting.');
        process.exit(1);
    }

    const parsed = parseDatabaseName(process.env.DATABASE_URL);
    const dryRun = process.argv.includes('--dry-run');
    console.log('WARNING: This will IRREVERSIBLY destroy ALL data in the target database.');
    console.log(`Target database: ${parsed.database || '<unknown>'} on ${parsed.host || '<unknown>'}:${parsed.port || '<default>'}`);

    const confirmDb = await question('Type the database name to confirm you want to destroy it: ');
    if (!parsed.database || confirmDb !== parsed.database) {
        console.error('Database name did not match. Aborting.');
        process.exit(2);
    }

    const confirmNuke = await question("Type 'NUKE' (all caps) to confirm destructive action: ");
    if (confirmNuke !== 'NUKE') {
        console.error("You didn't type 'NUKE'. Aborting.");
        process.exit(3);
    }

    const final = await question('Type the current git branch name to confirm (or type CANCEL to abort): ');
    if (final.toLowerCase() === 'cancel') {
        console.error('Aborted by user.');
        process.exit(4);
    }

    console.log('Proceeding to drop and recreate public schema...');

    // Prepare backups directory for dumps
    const backupsDir = path.resolve(process.cwd(), 'scripts', 'database', 'backups');
    if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir, { recursive: true });
    }

    // Create a timestamped dump file before destructive actions
    const now = new Date();
    const stamp = now.toISOString().replace(/[:.]/g, '-');
    const dumpFile = path.join(backupsDir, `${parsed.database || 'db'}-backup-${stamp}.dump`);

    console.log(`Creating DB dump to ${dumpFile} before proceeding...`);
    const dumpRes = spawnSync('pg_dump', ['--dbname', process.env.DATABASE_URL!, '-F', 'c', '-f', dumpFile], { stdio: 'inherit', env: process.env });
    if (dumpRes.status !== 0) {
        console.error('pg_dump failed or is not available. Attempting JSON fallback export per table...');
        // Fallback: export each public table as JSON file (one file per table)
        try {
            const client = await pool.connect();
            try {
                const tablesRes = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'");
                const tables = Array.isArray((tablesRes as any).rows)
                    ? (tablesRes as any).rows
                    : [];
                for (const row of tables) {
                    const tableName = String((row as any).table_name);
                    try {
                        const dataRes = await client.query(
                            `SELECT COALESCE(json_agg(row_to_json(t)), '[]'::json) as data FROM (SELECT * FROM "${tableName}") t`
                        );
                        const data = (dataRes as any).rows && (dataRes as any).rows[0] && (dataRes as any).rows[0].data
                            ? (dataRes as any).rows[0].data
                            : [];
                        const tableDumpFile = path.join(backupsDir, `${parsed.database || 'db'}-backup-${stamp}-${tableName}.json`);
                        fs.writeFileSync(tableDumpFile, JSON.stringify(data, null, 2), 'utf8');
                        console.log(`Wrote fallback JSON for table ${tableName} -> ${tableDumpFile}`);
                    } catch (err) {
                        console.error(`Failed to export table ${tableName}:`, err);
                    }
                }
            } finally {
                client.release();
            }
            console.log('Fallback JSON export completed.');
        } catch (err) {
            console.error('Fallback JSON export failed:', err);
        }

        const continueWithoutDump = (await question('Continue without a pg_dump archive? (yes/no): ')).toLowerCase() === 'yes';
        if (!continueWithoutDump) {
            console.error('Aborting due to failed dump. No changes made.');
            process.exit(7);
        }
        console.warn('Proceeding WITHOUT a pg_dump archive as requested (JSON fallback may be available).');
    } else {
        console.log('Database dump completed successfully.');
    }

    if (dryRun) {
        console.log('\n--dry-run specified: the following destructive actions will NOT be executed:');
        console.log(' - DROP SCHEMA public CASCADE');
        console.log(' - CREATE SCHEMA public');
        console.log('\nA dump was created at: ' + dumpFile);
        console.log('If you want to proceed for real, re-run without --dry-run.');
        process.exit(0);
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        // Drop and recreate public schema; this removes everything (tables, types, functions, data)
        await client.query('DROP SCHEMA public CASCADE');
        await client.query('CREATE SCHEMA public');
        // Optionally restore privileges
        await client.query("GRANT ALL ON SCHEMA public TO public");
        await client.query('COMMIT');
        console.log('Database reset complete: public schema dropped and recreated.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Failed to reset database:', err);
        process.exit(5);
    } finally {
        client.release();
    }

    // Offer to run full setup (seed) after nuking
    const runSeed = process.argv.includes('--seed') || (await question('Run full setup now? (yes/no): ')).toLowerCase() === 'yes';
    if (runSeed) {
        console.log('Running full setup scripts (this will create tables and seed data)...');
        const script = path.resolve(process.cwd(), 'scripts/database/run-full-setup.ts');
        const res = spawnSync('bun', [ script ], { stdio: 'inherit', env: process.env });
        if (res.status !== 0) {
            console.error('Full setup script failed. Check output above.');
            process.exit(6);
        }
        console.log('Full setup completed.');
    } else {
        console.log('Skipping full setup. You can run `bun scripts/database/run-full-setup.ts` manually.');
    }

    console.log('Nuke operation finished.');
    process.exit(0);
}

main().catch((err) => {
    console.error('Unexpected error during nuke:', err);
    process.exit(99);
});
