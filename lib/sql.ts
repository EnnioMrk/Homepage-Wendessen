import Pg from 'pg';

const { Pool } = Pg;

/**
 * The pool is created on first query, not at import. A production build must
 * not require the database: the deploy pipeline compiles without secrets, and
 * page-data collection imports every route module before any request exists.
 */
let _pool: InstanceType<typeof Pool> | null = null;

function connectionString(): string {
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error('DATABASE_URL environment variable is required');
    }
    return url;
}

export function getPool(): InstanceType<typeof Pool> {
    if (!_pool) {
        _pool = new Pool({
            connectionString: connectionString(),
            connectionTimeoutMillis: 5000, // Fail fast if DB is unreachable (5s)
        });
    }
    return _pool;
}

/**
 * `pool` keeps the old API for the two call sites that use it directly, but its
 * methods resolve the lazy pool on access.
 */
export const pool = new Proxy({} as InstanceType<typeof Pool>, {
    get(_target, property) {
        const instance = getPool() as unknown as Record<PropertyKey, unknown>;
        const value = instance[property];
        return typeof value === 'function' ? value.bind(instance) : value;
    },
});

// Minimal tagged template helper that returns rows like the current code expects
type SQLFragment = { text: string; values: unknown[] };

function buildQuery(
    strings: TemplateStringsArray,
    values: unknown[]
): SQLFragment {
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
    // A container build has no production database. The build script switches
    // to compile mode there, which prerenders nothing, but Next still evaluates
    // some routes while collecting page data: an empty result is honest. The
    // runtime always has DATABASE_URL and renders the real rows on demand.
    if (
        process.env.NEXT_PHASE === 'phase-production-build' &&
        !process.env.DATABASE_URL
    ) {
        return [] as Record<string, unknown>[];
    }

    const q = buildQuery(strings, values);
    const client = await getPool().connect();
    try {
        const res = await client.query(q.text, q.values);
        return res.rows;
    } finally {
        client.release();
    }
}

export { query as sql };
