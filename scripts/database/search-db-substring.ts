#!/usr/bin/env bun
import Pg from "pg";

const { Pool } = Pg;

type Options = {
    needle: string;
    schema: string;
    databaseUrl: string;
    caseSensitive: boolean;
    sampleLength: number;
    showSamples: boolean;
};

function printHelp() {
    console.log(`
Database-wide substring search (text/json/jsonb columns)

Usage:
  bun scripts/database/search-db-substring.ts --needle "search-text" [options]

Options:
  --needle, -n           Substring to search for (required)
    --database-url, -d     PostgreSQL URL (fallback: DATABASE_URL env)
  --schema, -s           Schema to scan (default: public)
  --case-sensitive, -c   Use LIKE instead of ILIKE
  --no-samples           Hide example matched values
  --sample-length        Truncate sample values to N chars (default: 180)
  --help, -h             Show this help

Examples:
  bun scripts/database/search-db-substring.ts -n "http://146.59.235.98:9000/"
    bun scripts/database/search-db-substring.ts -n "minio" -d "postgresql://user:pass@localhost:5432/db"
  bun scripts/database/search-db-substring.ts -n "minio" -s public --case-sensitive
`);
}

function parseArgs(argv: string[]): Options {
    const options: Options = {
        needle: "",
        schema: "public",
        databaseUrl: process.env.DATABASE_URL ?? "",
        caseSensitive: false,
        sampleLength: 180,
        showSamples: true,
    };

    for (let index = 0; index < argv.length; index++) {
        const arg = argv[index];

        if (arg === "--needle" || arg === "-n") {
            options.needle = argv[index + 1] ?? "";
            index++;
            continue;
        }

        if (arg === "--schema" || arg === "-s") {
            options.schema = argv[index + 1] ?? "public";
            index++;
            continue;
        }

        if (arg === "--database-url" || arg === "--db-url" || arg === "-d") {
            options.databaseUrl = argv[index + 1] ?? "";
            index++;
            continue;
        }

        if (arg === "--case-sensitive" || arg === "-c") {
            options.caseSensitive = true;
            continue;
        }

        if (arg === "--sample-length") {
            const value = Number(argv[index + 1]);
            if (!Number.isNaN(value) && value > 0) {
                options.sampleLength = Math.floor(value);
            }
            index++;
            continue;
        }

        if (arg === "--no-samples") {
            options.showSamples = false;
            continue;
        }

        if (arg === "--help" || arg === "-h") {
            printHelp();
            process.exit(0);
        }
    }

    if (!options.needle) {
        printHelp();
        throw new Error("Missing required argument: --needle");
    }

    return options;
}

function quoteIdent(name: string) {
    return `"${name.replace(/"/g, '""')}"`;
}

async function main() {
    const options = parseArgs(Bun.argv.slice(2));

    if (!options.databaseUrl) {
        throw new Error(
            "Database URL is required. Use --database-url <url> or set DATABASE_URL.",
        );
    }

    const pool = new Pool({
        connectionString: options.databaseUrl,
        connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();

    try {
        const comparator = options.caseSensitive ? "LIKE" : "ILIKE";
        const pattern = `%${options.needle}%`;

        console.log(
            `Scanning schema '${options.schema}' for substring: ${options.needle}`,
        );
        console.log(
            `Mode: ${options.caseSensitive ? "case-sensitive (LIKE)" : "case-insensitive (ILIKE)"}`,
        );

        const columnsResult = await client.query(
            `
            SELECT table_name, column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = $1
              AND data_type IN ('text', 'character varying', 'character', 'json', 'jsonb')
            ORDER BY table_name, column_name
            `,
            [options.schema],
        );

        if (columnsResult.rows.length === 0) {
            console.log(
                `No eligible text/json columns found in schema '${options.schema}'.`,
            );
            return;
        }

        let matchedColumns = 0;
        let totalMatchedRows = 0;

        for (const row of columnsResult.rows) {
            const tableName = row.table_name as string;
            const columnName = row.column_name as string;
            const dataType = row.data_type as string;
            const tableIdent = `${quoteIdent(options.schema)}.${quoteIdent(tableName)}`;
            const columnIdent = quoteIdent(columnName);
            const expression =
                dataType === "json" || dataType === "jsonb"
                    ? `${columnIdent}::text`
                    : columnIdent;

            const countSql = `SELECT count(*)::int AS count FROM ${tableIdent} WHERE ${expression} ${comparator} $1`;
            const countResult = await client.query(countSql, [pattern]);
            const count = countResult.rows[0]?.count ?? 0;

            if (count > 0) {
                matchedColumns += 1;
                totalMatchedRows += count;
                console.log(
                    `\n${options.schema}.${tableName}.${columnName} (${dataType}) -> ${count} row(s)`,
                );

                if (options.showSamples) {
                    const sampleSql = `
                        SELECT LEFT(${expression}, $2) AS sample
                        FROM ${tableIdent}
                        WHERE ${expression} ${comparator} $1
                        LIMIT 3
                    `;
                    const sampleResult = await client.query(sampleSql, [
                        pattern,
                        options.sampleLength,
                    ]);

                    for (const [
                        sampleIndex,
                        sampleRow,
                    ] of sampleResult.rows.entries()) {
                        const sample = String(sampleRow.sample ?? "")
                            .replace(/\s+/g, " ")
                            .trim();
                        console.log(`  sample ${sampleIndex + 1}: ${sample}`);
                    }
                }
            }
        }

        console.log("\n--- Summary ---");
        console.log(`Columns with matches: ${matchedColumns}`);
        console.log(
            `Total matching rows (summed across columns): ${totalMatchedRows}`,
        );
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch((error) => {
    console.error(
        "Search failed:",
        error instanceof Error ? error.message : error,
    );
    process.exit(1);
});
