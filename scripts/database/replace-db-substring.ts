#!/usr/bin/env bun
import Pg from "pg";
import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";

const { Pool } = Pg;

type Options = {
    needle: string;
    replacement: string;
    schema: string;
    databaseUrl: string;
    caseSensitive: boolean;
    assumeYes: boolean;
};

type MatchedColumn = {
    tableName: string;
    columnName: string;
    dataType: string;
    count: number;
};

function printHelp() {
    console.log(`
Database-wide substring replace (text/json/jsonb columns)

Usage:
  bun scripts/database/replace-db-substring.ts --needle "old" --replacement "new" [options]

Options:
  --needle, -n            Substring to search for (required)
  --replacement, -r       Replacement substring (required)
  --database-url, -d      PostgreSQL URL (fallback: DATABASE_URL env)
  --schema, -s            Schema to scan (default: public)
  --case-sensitive, -c    Use case-sensitive matching/replacing
  --yes, -y               Skip interactive confirmation prompt
  --help, -h              Show this help

Examples:
  bun scripts/database/replace-db-substring.ts -n "http://old/" -r "https://new/"
  bun scripts/database/replace-db-substring.ts -n "minio" -r "s3" -d "postgresql://user:pass@localhost:5432/db"
`);
}

function parseArgs(argv: string[]): Options {
    const options: Options = {
        needle: "",
        replacement: "",
        schema: "public",
        databaseUrl: process.env.DATABASE_URL ?? "",
        caseSensitive: false,
        assumeYes: false,
    };

    for (let index = 0; index < argv.length; index++) {
        const arg = argv[index];

        if (arg === "--needle" || arg === "-n") {
            options.needle = argv[index + 1] ?? "";
            index++;
            continue;
        }

        if (arg === "--replacement" || arg === "-r") {
            options.replacement = argv[index + 1] ?? "";
            index++;
            continue;
        }

        if (arg === "--database-url" || arg === "--db-url" || arg === "-d") {
            options.databaseUrl = argv[index + 1] ?? "";
            index++;
            continue;
        }

        if (arg === "--schema" || arg === "-s") {
            options.schema = argv[index + 1] ?? "public";
            index++;
            continue;
        }

        if (arg === "--case-sensitive" || arg === "-c") {
            options.caseSensitive = true;
            continue;
        }

        if (arg === "--yes" || arg === "-y") {
            options.assumeYes = true;
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

    if (!options.replacement) {
        printHelp();
        throw new Error("Missing required argument: --replacement");
    }

    if (!options.databaseUrl) {
        throw new Error(
            "Database URL is required. Use --database-url <url> or set DATABASE_URL.",
        );
    }

    return options;
}

function quoteIdent(name: string) {
    return `"${name.replace(/"/g, '""')}"`;
}

function escapeRegexLiteral(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function confirmReplaceOrExit() {
    const rl = createInterface({ input, output });
    try {
        const answer = await rl.question(
            "Are you REALLY sure? This updates database data. Type REPLACE to continue: ",
        );
        if (answer.trim() !== "REPLACE") {
            console.log("Aborted. No changes were applied.");
            process.exit(0);
        }
    } finally {
        rl.close();
    }
}

async function main() {
    const options = parseArgs(Bun.argv.slice(2));
    const pool = new Pool({
        connectionString: options.databaseUrl,
        connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();

    try {
        const comparator = options.caseSensitive ? "LIKE" : "ILIKE";
        const pattern = `%${options.needle}%`;
        const regexNeedle = escapeRegexLiteral(options.needle);

        console.log(
            `Scanning schema '${options.schema}' for substring: ${options.needle}`,
        );
        console.log(`Replacement: ${options.replacement}`);
        console.log(
            `Mode: ${options.caseSensitive ? "case-sensitive" : "case-insensitive"} matching`,
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

        const matchedColumns: MatchedColumn[] = [];
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
                matchedColumns.push({ tableName, columnName, dataType, count });
                totalMatchedRows += count;
                console.log(
                    `${options.schema}.${tableName}.${columnName} (${dataType}) -> ${count} row(s)`,
                );
            }
        }

        if (matchedColumns.length === 0) {
            console.log("No matches found. Nothing to replace.");
            return;
        }

        console.log("\n--- Replace Plan ---");
        console.log(`Columns with matches: ${matchedColumns.length}`);
        console.log(
            `Total matching rows (summed across columns): ${totalMatchedRows}`,
        );

        if (!options.assumeYes) {
            await confirmReplaceOrExit();
        }

        await client.query("BEGIN");

        let totalUpdatedRows = 0;

        for (const match of matchedColumns) {
            const tableIdent = `${quoteIdent(options.schema)}.${quoteIdent(match.tableName)}`;
            const columnIdent = quoteIdent(match.columnName);
            const expression =
                match.dataType === "json" || match.dataType === "jsonb"
                    ? `${columnIdent}::text`
                    : columnIdent;

            const replaceExpression = options.caseSensitive
                ? `replace(${expression}, $1, $2)`
                : `regexp_replace(${expression}, $1, $2, 'gi')`;

            const castSuffix =
                match.dataType === "jsonb"
                    ? "::jsonb"
                    : match.dataType === "json"
                      ? "::json"
                      : "";

            const updateSql = `
                UPDATE ${tableIdent}
                SET ${columnIdent} = (${replaceExpression})${castSuffix}
                WHERE ${expression} ${comparator} $3
            `;

            const replaceNeedle = options.caseSensitive
                ? options.needle
                : regexNeedle;
            const updateResult = await client.query(updateSql, [
                replaceNeedle,
                options.replacement,
                pattern,
            ]);

            const updated = updateResult.rowCount ?? 0;
            totalUpdatedRows += updated;
            console.log(
                `Updated ${updated} row(s) in ${options.schema}.${match.tableName}.${match.columnName}`,
            );
        }

        await client.query("COMMIT");
        console.log("\nDone.");
        console.log(
            `Total rows updated (summed across columns): ${totalUpdatedRows}`,
        );
    } catch (error) {
        try {
            await client.query("ROLLBACK");
        } catch {
            // Ignore rollback errors and report original failure below.
        }
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

main().catch((error) => {
    console.error(
        "Replace failed:",
        error instanceof Error ? error.message : error,
    );
    process.exit(1);
});
