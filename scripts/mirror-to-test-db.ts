#!/usr/bin/env bun
/**
 * Mirror Database to Test Database
 *
 * This script copies all tables and data from the production database
 * to a test database. It's useful for testing with real data without
 * affecting the production environment.
 *
 * Usage:
 *   bun run mirror-to-test-db
 *
 * Requires .env file with DATABASE_URL and TEST_DATABASE_URL
 */

import Pg from 'pg';
import fs from 'fs';
import path from 'path';

// Type alias for Pool instance
type PoolInstance = InstanceType<typeof Pg.Pool>;

// Load .env file manually
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            const value = valueParts.join('=');
            if (key && value && !process.env[key]) {
                process.env[key] = value;
            }
        }
    }
}

const { Pool } = Pg;

// Validate environment variables
const SOURCE_DATABASE_URL = process.env.DATABASE_URL;
const TARGET_DATABASE_URL = process.env.TEST_DATABASE_URL;

if (!SOURCE_DATABASE_URL) {
    console.error(
        '❌ DATABASE_URL environment variable is required (source database)'
    );
    process.exit(1);
}

if (!TARGET_DATABASE_URL) {
    console.error(
        '❌ TEST_DATABASE_URL environment variable is required (target test database)'
    );
    process.exit(1);
}

// Safety check: don't allow mirroring to the same database
if (SOURCE_DATABASE_URL === TARGET_DATABASE_URL) {
    console.error('❌ SOURCE and TARGET database URLs cannot be the same!');
    process.exit(1);
}

const sourcePool = new Pool({ connectionString: SOURCE_DATABASE_URL });
const targetPool = new Pool({ connectionString: TARGET_DATABASE_URL });

// Tables in dependency order (tables with foreign keys come after their dependencies)
const TABLES_IN_ORDER = [
    'contacts',
    'events',
    'news',
    'archive',
    'gallery_images',
    'portraits',
    'shared_gallery_submissions',
    'shared_gallery_reports',
    'permissions',
    'roles',
    'role_permissions',
    'admin_users',
    'admin_logs',
    'push_subscriptions',
    'settings',
    'verein_roles',
];

async function getExistingTables(pool: PoolInstance): Promise<string[]> {
    const result = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    `);
    return result.rows.map((row: { table_name: string }) => row.table_name);
}

async function getTableSchema(
    pool: PoolInstance,
    tableName: string
): Promise<string> {
    // Get column definitions
    const columnsResult = await pool.query(
        `
        SELECT 
            column_name,
            data_type,
            character_maximum_length,
            column_default,
            is_nullable,
            udt_name
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1
        ORDER BY ordinal_position
    `,
        [tableName]
    );

    // Get primary key
    const pkResult = await pool.query(
        `
        SELECT a.attname
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = $1::regclass
        AND i.indisprimary
    `,
        [tableName]
    );

    const primaryKeys = pkResult.rows.map(
        (row: { attname: string }) => row.attname
    );

    // Build CREATE TABLE statement
    const columns = columnsResult.rows.map(
        (col: {
            column_name: string;
            data_type: string;
            character_maximum_length: number | null;
            column_default: string | null;
            is_nullable: string;
            udt_name: string;
        }) => {
            let typeDef = col.udt_name.toUpperCase();

            // Handle special types
            if (col.udt_name === 'int4') typeDef = 'INTEGER';
            if (col.udt_name === 'int8') typeDef = 'BIGINT';
            if (col.udt_name === 'bool') typeDef = 'BOOLEAN';
            if (col.udt_name === 'varchar' && col.character_maximum_length) {
                typeDef = `VARCHAR(${col.character_maximum_length})`;
            }
            if (col.udt_name === 'timestamptz')
                typeDef = 'TIMESTAMP WITH TIME ZONE';
            if (col.udt_name === 'timestamp') typeDef = 'TIMESTAMP';

            let columnDef = `"${col.column_name}" ${typeDef}`;

            // Handle serial types by checking default
            if (col.column_default?.includes('nextval')) {
                if (typeDef === 'INTEGER')
                    columnDef = `"${col.column_name}" SERIAL`;
                else if (typeDef === 'BIGINT')
                    columnDef = `"${col.column_name}" BIGSERIAL`;
            } else if (
                col.column_default &&
                !col.column_default.includes('nextval')
            ) {
                columnDef += ` DEFAULT ${col.column_default}`;
            }

            if (
                col.is_nullable === 'NO' &&
                !col.column_default?.includes('nextval')
            ) {
                columnDef += ' NOT NULL';
            }

            return columnDef;
        }
    );

    if (primaryKeys.length > 0) {
        columns.push(
            `PRIMARY KEY (${primaryKeys
                .map((k: string) => `"${k}"`)
                .join(', ')})`
        );
    }

    return `CREATE TABLE IF NOT EXISTS "${tableName}" (\n  ${columns.join(
        ',\n  '
    )}\n)`;
}

async function getTableIndexes(
    pool: PoolInstance,
    tableName: string
): Promise<string[]> {
    const result = await pool.query(
        `
        SELECT indexdef 
        FROM pg_indexes 
        WHERE schemaname = 'public' 
        AND tablename = $1
        AND indexname NOT LIKE '%_pkey'
    `,
        [tableName]
    );

    return result.rows.map((row: { indexdef: string }) =>
        row.indexdef.replace('CREATE INDEX', 'CREATE INDEX IF NOT EXISTS')
    );
}

async function copyTableData(
    sourcePool: PoolInstance,
    targetPool: PoolInstance,
    tableName: string
): Promise<number> {
    // Get column types to handle JSONB properly
    const columnTypesResult = await sourcePool.query(
        `
        SELECT column_name, udt_name
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1
    `,
        [tableName]
    );

    const jsonColumns = new Set(
        columnTypesResult.rows
            .filter(
                (col: { column_name: string; udt_name: string }) =>
                    col.udt_name === 'jsonb' || col.udt_name === 'json'
            )
            .map(
                (col: { column_name: string; udt_name: string }) =>
                    col.column_name
            )
    );

    // Get all data from source
    const sourceData = await sourcePool.query(`SELECT * FROM "${tableName}"`);

    if (sourceData.rows.length === 0) {
        return 0;
    }

    const columns = Object.keys(sourceData.rows[0]);
    const columnNames = columns.map((c) => `"${c}"`).join(', ');

    // Clear existing data in target
    await targetPool.query(`DELETE FROM "${tableName}"`);

    // Insert data in batches
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < sourceData.rows.length; i += batchSize) {
        const batch = sourceData.rows.slice(i, i + batchSize);

        for (const row of batch) {
            const values = columns.map((_col, idx) => `$${idx + 1}`).join(', ');
            const params = columns.map((col) => {
                const value = row[col];
                // Serialize JSON/JSONB columns properly
                if (
                    jsonColumns.has(col) &&
                    value !== null &&
                    typeof value === 'object'
                ) {
                    return JSON.stringify(value);
                }
                return value;
            });

            try {
                await targetPool.query(
                    `INSERT INTO "${tableName}" (${columnNames}) VALUES (${values})`,
                    params
                );
                inserted++;
            } catch (error) {
                // Handle duplicate key errors gracefully
                if ((error as Error).message?.includes('duplicate key')) {
                    console.warn(
                        `  ⚠️  Skipping duplicate row in ${tableName}`
                    );
                } else {
                    throw error;
                }
            }
        }
    }

    return inserted;
}

async function resetSequences(
    pool: PoolInstance,
    tableName: string
): Promise<void> {
    // Get sequence info for the table
    const result = await pool.query(
        `
        SELECT 
            column_name,
            column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1
        AND column_default LIKE 'nextval%'
    `,
        [tableName]
    );

    for (const row of result.rows) {
        const seqMatch = row.column_default.match(
            /nextval\('([^']+)'::regclass\)/
        );
        if (seqMatch) {
            const seqName = seqMatch[1];
            try {
                await pool.query(`
                    SELECT setval('${seqName}', COALESCE((SELECT MAX("${row.column_name}") FROM "${tableName}"), 1), true)
                `);
            } catch (error) {
                console.warn(
                    `  ⚠️  Could not reset sequence ${seqName}: ${(error as Error).message
                    }`
                );
            }
        }
    }
}

async function mirrorDatabase() {
    console.log('🔄 Starting database mirror to test database...\n');

    try {
        // Get existing tables from source
        const sourceTables = await getExistingTables(sourcePool);
        console.log(
            `📊 Found ${sourceTables.length} tables in source database:`
        );
        console.log(`   ${sourceTables.join(', ')}\n`);

        // Order tables properly (existing tables that are in our order list, plus any extras)
        const orderedTables = [
            ...TABLES_IN_ORDER.filter((t) => sourceTables.includes(t)),
            ...sourceTables.filter((t) => !TABLES_IN_ORDER.includes(t)),
        ];

        // Step 1: Drop existing tables in target (reverse order for foreign keys)
        console.log('🗑️  Dropping existing tables in test database...');
        for (const tableName of [...orderedTables].reverse()) {
            try {
                await targetPool.query(
                    `DROP TABLE IF EXISTS "${tableName}" CASCADE`
                );
                console.log(`   ✓ Dropped ${tableName}`);
            } catch (error) {
                console.warn(
                    `   ⚠️  Could not drop ${tableName}: ${(error as Error).message
                    }`
                );
            }
        }
        console.log('');

        // Step 2: Create tables in target
        console.log('📝 Creating tables in test database...');
        for (const tableName of orderedTables) {
            try {
                const schema = await getTableSchema(sourcePool, tableName);
                await targetPool.query(schema);
                console.log(`   ✓ Created ${tableName}`);
            } catch (error) {
                console.error(
                    `   ❌ Failed to create ${tableName}: ${(error as Error).message
                    }`
                );
            }
        }
        console.log('');

        // Step 3: Copy data
        console.log('📦 Copying data to test database...');
        for (const tableName of orderedTables) {
            try {
                const count = await copyTableData(
                    sourcePool,
                    targetPool,
                    tableName
                );
                console.log(`   ✓ Copied ${count} rows to ${tableName}`);
            } catch (error) {
                console.error(
                    `   ❌ Failed to copy data to ${tableName}: ${(error as Error).message
                    }`
                );
            }
        }
        console.log('');

        // Step 4: Create indexes
        console.log('🔑 Creating indexes...');
        for (const tableName of orderedTables) {
            try {
                const indexes = await getTableIndexes(sourcePool, tableName);
                for (const indexDef of indexes) {
                    try {
                        await targetPool.query(indexDef);
                    } catch (error) {
                        // Index might already exist
                        if (
                            !(error as Error).message?.includes(
                                'already exists'
                            )
                        ) {
                            console.warn(
                                `   ⚠️  Index creation warning: ${(error as Error).message
                                }`
                            );
                        }
                    }
                }
                if (indexes.length > 0) {
                    console.log(
                        `   ✓ Created ${indexes.length} index(es) for ${tableName}`
                    );
                }
            } catch (error) {
                console.warn(
                    `   ⚠️  Could not create indexes for ${tableName}: ${(error as Error).message
                    }`
                );
            }
        }
        console.log('');

        // Step 5: Reset sequences
        console.log('🔢 Resetting sequences...');
        for (const tableName of orderedTables) {
            await resetSequences(targetPool, tableName);
        }
        console.log('   ✓ Sequences reset\n');

        // Verify the migration
        console.log('✅ Verifying migration...');
        for (const tableName of orderedTables) {
            const sourceCount = await sourcePool.query(
                `SELECT COUNT(*) as count FROM "${tableName}"`
            );
            const targetCount = await targetPool.query(
                `SELECT COUNT(*) as count FROM "${tableName}"`
            );
            const sourceNum = parseInt(sourceCount.rows[0].count);
            const targetNum = parseInt(targetCount.rows[0].count);

            if (sourceNum === targetNum) {
                console.log(`   ✓ ${tableName}: ${targetNum} rows`);
            } else {
                console.log(
                    `   ⚠️  ${tableName}: source=${sourceNum}, target=${targetNum}`
                );
            }
        }

        console.log('\n🎉 Database mirror completed successfully!');
    } catch (error) {
        console.error('\n❌ Error during database mirror:', error);
        process.exit(1);
    } finally {
        await sourcePool.end();
        await targetPool.end();
    }
}

mirrorDatabase();
