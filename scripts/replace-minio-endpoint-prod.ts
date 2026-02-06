import Pg from 'pg';

const { Pool } = Pg;

const OLD_ENDPOINT = 'http://api.minio.wendessen.duckdns.org:80/';
const NEW_ENDPOINT = 'http://146.59.235.98:9000/';

if (!process.env.PROD_DATABASE_URL) {
    console.error('PROD_DATABASE_URL environment variable is not set in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.PROD_DATABASE_URL,
    connectionTimeoutMillis: 5000,
});

function quoteIdent(name: string) {
    return `"${name.replace(/"/g, '""')}"`;
}

async function migrate() {
    const client = await pool.connect();
    try {
        console.log('Scanning all text and JSON columns for old MinIO endpoint...');

        const columnsResult = await client.query(`
                        SELECT table_name, column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
                            AND data_type IN ('text', 'character varying', 'character', 'json', 'jsonb')
            ORDER BY table_name, column_name
        `);

        let totalUpdated = 0;
        for (const row of columnsResult.rows) {
            const tableName = row.table_name as string;
            const columnName = row.column_name as string;
            const dataType = row.data_type as string;
            const tableIdent = quoteIdent(tableName);
            const columnIdent = quoteIdent(columnName);

            let countSql = '';
            if (dataType === 'jsonb' || dataType === 'json') {
                countSql = `SELECT count(*) FROM ${tableIdent} WHERE ${columnIdent}::text LIKE $1`;
            } else {
                countSql = `SELECT count(*) FROM ${tableIdent} WHERE ${columnIdent} LIKE $1`;
            }
            const countResult = await client.query(countSql, [`%${OLD_ENDPOINT}%`]);
            const count = parseInt(countResult.rows[0].count);

            if (count > 0) {
                let updateSql = '';
                if (dataType === 'jsonb') {
                    updateSql = `UPDATE ${tableIdent} SET ${columnIdent} = (REPLACE(${columnIdent}::text, $1, $2))::jsonb WHERE ${columnIdent}::text LIKE $3`;
                } else if (dataType === 'json') {
                    updateSql = `UPDATE ${tableIdent} SET ${columnIdent} = (REPLACE(${columnIdent}::text, $1, $2))::json WHERE ${columnIdent}::text LIKE $3`;
                } else {
                    updateSql = `UPDATE ${tableIdent} SET ${columnIdent} = REPLACE(${columnIdent}, $1, $2) WHERE ${columnIdent} LIKE $3`;
                }

                const updateResult = await client.query(updateSql, [
                    OLD_ENDPOINT,
                    NEW_ENDPOINT,
                    `%${OLD_ENDPOINT}%`,
                ]);
                totalUpdated += updateResult.rowCount;
                console.log(`Updated ${updateResult.rowCount} rows in ${tableName}.${columnName}`);
            }
        }

        console.log(`Done. Total rows updated: ${totalUpdated}`);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
