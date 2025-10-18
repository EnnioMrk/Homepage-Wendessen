import Pg from 'pg';

const { Pool } = Pg;

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Minimal tagged template helper that returns rows like the current code expects
type SQLFragment = { text: string; values: unknown[] };

function buildQuery(strings: TemplateStringsArray, values: unknown[]): SQLFragment {
    let text = '';
    const vals: unknown[] = [];

    for (let i = 0; i < strings.length; i++) {
        text += strings[i];
        if (i < values.length) {
            vals.push(values[i]);
            text += `$${vals.length}`;
        }
    }

    return { text, values: vals };
}

async function query(strings: TemplateStringsArray, ...values: unknown[]) {
    const q = buildQuery(strings, values);
    const client = await pool.connect();
    try {
        const res = await client.query(q.text, q.values);
        return res.rows;
    } finally {
        client.release();
    }
}

export { query as sql, pool };
