/*
Best-effort migration script: Neon -> Target Postgres

Usage (from project root):
  # ensure .env and old.env.local exist or set env vars
  # SOURCE_DATABASE_URL can be set or will be read from old.env.local DATABASE_URL
  # TARGET_DATABASE_URL can be set or will be read from .env DATABASE_URL or process.env.DATABASE_URL

  bun run --bun node scripts/migrate-neon-to-target.js

What it does:
  - Copies schemas (non-system) from source to target (CREATE SCHEMA IF NOT EXISTS)
  - For each table: creates a CREATE TABLE on target (columns, types, defaults, not null)
  - Adds primary keys, unique constraints, foreign keys (best-effort)
  - Recreates indexes from pg_indexes
  - Copies data in batches (configurable batch size)
  - Attempts to recreate sequences and set their values to max(column) in the target

Limitations / Warnings:
  - This is NOT a full pg_dump replacement: it won't copy roles, owners, grants, extensions, functions, triggers, views or complex DDL (permissions) reliably.
  - Large databases may be slow and could time out. Consider using pg_dump/pg_restore locally for production migrations.
  - Always test on a staging DB first.

*/

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

function loadEnvFileIfExists(filePath) {
  try {
    const txt = fs.readFileSync(filePath, 'utf8');
    const lines = txt.split(/\r?\n/);
    const map = {};
    for (let l of lines) {
      l = l.trim();
      if (!l || l.startsWith('#')) continue;
      const eq = l.indexOf('=');
      if (eq === -1) continue;
      const k = l.slice(0, eq).trim();
      let v = l.slice(eq + 1).trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
      map[k] = v;
    }
    return map;
  } catch (e) {
    return {};
  }
}

const oldEnv = loadEnvFileIfExists(path.resolve(__dirname, '..', 'old.env.local'));
const dotEnv = loadEnvFileIfExists(path.resolve(__dirname, '..', '.env'));

const SOURCE_DATABASE_URL = process.env.SOURCE_DATABASE_URL || oldEnv.DATABASE_URL || process.env.SOURCE_DB_URL;
const TARGET_DATABASE_URL = process.env.TARGET_DATABASE_URL || dotEnv.DATABASE_URL || process.env.DATABASE_URL;

if (!SOURCE_DATABASE_URL) {
  console.error('Source database URL not found. Set SOURCE_DATABASE_URL env or ensure old.env.local contains DATABASE_URL');
  process.exit(1);
}
if (!TARGET_DATABASE_URL) {
  console.error('Target database URL not found. Set TARGET_DATABASE_URL or ensure .env contains DATABASE_URL');
  process.exit(1);
}

console.log('Source:', SOURCE_DATABASE_URL.split('@')[1]);
console.log('Target:', TARGET_DATABASE_URL.split('@')[1]);

const sourcePool = new Pool({ connectionString: SOURCE_DATABASE_URL });
const targetPool = new Pool({ connectionString: TARGET_DATABASE_URL });

const BATCH_SIZE = parseInt(process.env.MIGRATE_BATCH_SIZE || '1000', 10);

async function listSchemas(pool) {
  const res = await pool.query("SELECT nspname FROM pg_namespace WHERE nspname NOT IN ('pg_catalog','information_schema','pg_toast') AND nspname NOT LIKE 'pg_temp_%' ORDER BY nspname");
  return res.rows.map(r => r.nspname);
}

async function listTables(pool, schema) {
  const res = await pool.query('SELECT tablename FROM pg_tables WHERE schemaname = $1 ORDER BY tablename', [schema]);
  return res.rows.map(r => r.tablename);
}

async function getColumns(pool, schema, table) {
  const q = `SELECT column_name, data_type, is_nullable, column_default, character_maximum_length, numeric_precision, numeric_scale, udt_name
    FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position`;
  const res = await pool.query(q, [schema, table]);
  return res.rows;
}

async function getPrimaryKey(pool, schema, table) {
  const q = `SELECT kc.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kc
      ON kc.constraint_name = tc.constraint_name AND kc.table_name = tc.table_name
    WHERE tc.table_schema=$1 AND tc.table_name=$2 AND tc.constraint_type='PRIMARY KEY'
    ORDER BY kc.ordinal_position`;
  const res = await pool.query(q, [schema, table]);
  return res.rows.map(r => r.column_name);
}

async function getForeignKeys(pool, schema, table) {
  const q = `SELECT tc.constraint_name, kcu.column_name, ccu.table_schema AS foreign_table_schema, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name AND tc.table_name = kcu.table_name
    JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema=$1 AND tc.table_name=$2`;
  const res = await pool.query(q, [schema, table]);
  // group by constraint
  const map = {};
  for (const r of res.rows) {
    if (!map[r.constraint_name]) map[r.constraint_name] = { cols: [], foreign_table_schema: r.foreign_table_schema, foreign_table_name: r.foreign_table_name, foreign_cols: [] };
    map[r.constraint_name].cols.push(r.column_name);
    map[r.constraint_name].foreign_cols.push(r.foreign_column_name);
  }
  return Object.entries(map).map(([name, val]) => ({ name, ...val }));
}

async function getIndexes(pool, schema, table) {
  const res = await pool.query('SELECT indexname, indexdef FROM pg_indexes WHERE schemaname=$1 AND tablename=$2', [schema, table]);
  return res.rows;
}

function pgType(column) {
  // Best-effort type mapper based on udt_name and data_type
  let type = column.udt_name;
  if (column.data_type === 'character varying' && column.character_maximum_length) {
    type = `varchar(${column.character_maximum_length})`;
  } else if (column.data_type === 'numeric' && column.numeric_precision) {
    if (column.numeric_scale) type = `numeric(${column.numeric_precision},${column.numeric_scale})`;
    else type = `numeric(${column.numeric_precision})`;
  } else if (column.data_type === 'timestamp with time zone') {
    type = 'timestamptz';
  } else if (column.data_type === 'timestamp without time zone') {
    type = 'timestamp';
  }
  return type;
}

function formatDefault(def) {
  if (!def) return null;
  // leave as-is (it should be valid SQL fragment)
  return def;
}

async function createSchemaIfNotExists(schema) {
  const sql = `CREATE SCHEMA IF NOT EXISTS "${schema}"`;
  await targetPool.query(sql);
}

async function dropAndCreateTable(schema, table, columns, pkCols) {
  // We will not DROP existing tables; we will create IF NOT EXISTS to avoid data loss.
  const colDefs = columns.map(c => {
    const t = pgType(c);
    const nullable = c.is_nullable === 'NO' ? 'NOT NULL' : '';
    const def = formatDefault(c.column_default);
    const defSql = def ? `DEFAULT ${def}` : '';
    return `"${c.column_name}" ${t} ${defSql} ${nullable}`.trim();
  });
  let createSql = `CREATE TABLE IF NOT EXISTS "${schema}"."${table}" (\n  ${colDefs.join(',\n  ')}`;
  if (pkCols && pkCols.length) {
    createSql += `,\n  PRIMARY KEY (${pkCols.map(c => `"${c}"`).join(', ')})`;
  }
  createSql += '\n)';
  await targetPool.query(createSql);
}

async function createConstraintsAndIndexes(schema, table, fkDefs, indexes) {
  // Foreign keys
  for (const fk of fkDefs) {
    const name = fk.name;
    const cols = fk.cols.map(c => `"${c}"`).join(', ');
    const fcols = fk.foreign_cols.map(c => `"${c}"`).join(', ');
    const sql = `ALTER TABLE "${schema}"."${table}" ADD CONSTRAINT "${name}" FOREIGN KEY (${cols}) REFERENCES "${fk.foreign_table_schema}"."${fk.foreign_table_name}"(${fcols})`;
    try {
      await targetPool.query(sql);
    } catch (e) {
      console.warn('Could not create FK', name, e.message);
    }
  }
  // Indexes
  for (const idx of indexes) {
    try {
      // indexdef contains the full CREATE INDEX ... statement, but may reference schema.table. We need to adjust schema qualification
      let def = idx.indexdef;
      // if indexdef uses tablename without schema, prefix it
      // safer approach: run the indexdef as-is on target
      await targetPool.query(def);
    } catch (e) {
      console.warn('Could not create index', idx.indexname, e.message);
    }
  }
}

async function copyData(schema, table) {
  // fetch from source in batches and insert into target
  const clientSrc = await sourcePool.connect();
  try {
    const countRes = await clientSrc.query(`SELECT COUNT(*)::int as c FROM "${schema}"."${table}"`);
    const total = countRes.rows[0].c;
    console.log(`  copying data for ${schema}.${table} (${total} rows)`);
    if (total === 0) return;
    const columnsRes = await clientSrc.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position`, [schema, table]);
  const cols = columnsRes.rows.map(r => ({ name: r.column_name, data_type: r.data_type }));
  const colList = cols.map(c => `"${c.name}"`).join(', ');

    for (let offset = 0; offset < total; offset += BATCH_SIZE) {
      const q = `SELECT * FROM "${schema}"."${table}" ORDER BY 1 OFFSET ${offset} LIMIT ${BATCH_SIZE}`;
      const rows = (await clientSrc.query(q)).rows;
      if (rows.length === 0) break;

      // build multi-row insert
      const values = [];
      const placeholders = rows.map((r, i) => {
        const start = i * cols.length + 1;
        for (const c of cols) {
          let val = r[c.name];
          // stringify JSON/JSONB objects to avoid invalid input syntax
          if (val !== null && (c.data_type === 'json' || c.data_type === 'jsonb')) {
            try {
              val = typeof val === 'string' ? val : JSON.stringify(val);
            } catch (e) {
              val = String(val);
            }
          }
          values.push(val);
        }
        const ph = cols.map((_, j) => `$${start + j}`).join(', ');
        return `(${ph})`;
      }).join(', ');
      const insertSql = `INSERT INTO "${schema}"."${table}" (${colList}) VALUES ${placeholders} ON CONFLICT DO NOTHING`;
      try {
        await targetPool.query(insertSql, values);
      } catch (e) {
        console.error('Error inserting batch into', `${schema}.${table}`, e.message);
        // attempt single-row inserts to find bad row
        for (const r of rows) {
          const vals = [];
          for (const c of cols) {
            let v = r[c.name];
            if (v !== null && (c.data_type === 'json' || c.data_type === 'jsonb')) {
              try { v = typeof v === 'string' ? v : JSON.stringify(v); } catch (ee) { v = String(v); }
            }
            vals.push(v);
          }
          const phs = cols.map((_, i) => `$${i + 1}`).join(', ');
          try {
            await targetPool.query(`INSERT INTO "${schema}"."${table}" (${colList}) VALUES (${phs}) ON CONFLICT DO NOTHING`, vals);
          } catch (ee) {
            console.error('Failed single row insert:', ee.message);
          }
        }
      }
    }
  } finally {
    clientSrc.release();
  }
}


async function syncSequences(schema, table) {
  // find columns that use sequences in source and set them in target to max(value)
  const q = `SELECT column_name, column_default FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 AND column_default LIKE 'nextval(%'`;
  const res = await sourcePool.query(q, [schema, table]);
  for (const r of res.rows) {
    const col = r.column_name;
    // find sequence name
    const seqRes = await sourcePool.query(`SELECT pg_get_serial_sequence($1, $2) as seq`, [`"${schema}"."${table}"`, col]);
    const seqName = seqRes.rows[0].seq; // might be schema.seq
    if (!seqName) continue;
    // get max value from source
    const maxRes = await sourcePool.query(`SELECT MAX("${col}") as m FROM "${schema}"."${table}"`);
    const maxVal = maxRes.rows[0].m || 0;
    // attempt to set sequence in target: if sequence exists, setval, otherwise create sequence and set
    try {
      // try setting sequence directly
      await targetPool.query(`SELECT setval($1, $2, true)`, [seqName, maxVal]);
    } catch (e) {
      console.warn('Could not set sequence', seqName, e.message);
      // try to create a sequence and set owner
      const parts = seqName.split('.');
      const seqOnly = parts.length === 2 ? parts[1].replace('"','').replace('"','') : seqName.replace('"','').replace('"','');
      try {
        await targetPool.query(`CREATE SEQUENCE IF NOT EXISTS "${schema}"."${seqOnly}"`);
        await targetPool.query(`SELECT setval('"${schema}"."${seqOnly}"', $1, true)`, [maxVal]);
      } catch (e2) {
        console.warn('Failed creating/setting sequence', seqOnly, e2.message);
      }
    }
  }
}

async function listSequences(pool, schema) {
  const q = `SELECT sequence_schema, sequence_name FROM information_schema.sequences WHERE sequence_schema = $1`;
  const res = await pool.query(q, [schema]);
  return res.rows.map(r => ({ schema: r.sequence_schema, name: r.sequence_name }));
}

async function createSequencesFromSource(schemas) {
  for (const schema of schemas) {
    try {
      const seqs = await listSequences(sourcePool, schema);
      for (const s of seqs) {
        try {
          await targetPool.query(`CREATE SEQUENCE IF NOT EXISTS "${s.schema}"."${s.name}"`);
        } catch (e) {
          console.warn('Could not create sequence', s.schema + '.' + s.name, e.message);
        }
      }
    } catch (e) {
      console.warn('Could not list/create sequences for schema', schema, e.message);
    }
  }
}

async function migrate() {
  try {
    const schemas = await listSchemas(sourcePool);
    console.log('Schemas to migrate:', schemas.join(', '));
    // Optionally clear the target database first if MIGRATE_DROP_TARGET=true
    if (process.env.MIGRATE_DROP_TARGET === 'true') {
      console.warn('MIGRATE_DROP_TARGET=true: Dropping public schema on target (this will remove ALL data on the target public schema)');
      try {
        await targetPool.query('DROP SCHEMA public CASCADE');
        await targetPool.query('CREATE SCHEMA public');
        console.log('Target public schema dropped and recreated');
      } catch (e) {
        console.error('Failed to drop/create public schema on target:', e.message);
        throw e;
      }
    }
    // Pre-create sequences found in the source to avoid setval errors later
    await createSequencesFromSource(schemas);
    // Phase 1: create schemas and tables (no constraints/indexes yet)
    const tasks = [];
    for (const schema of schemas) {
      console.log('Processing schema:', schema);
      await createSchemaIfNotExists(schema);
      const tables = await listTables(sourcePool, schema);
      for (const table of tables) {
        console.log(' Creating table structure for:', `${schema}.${table}`);
        const cols = await getColumns(sourcePool, schema, table);
        const pk = await getPrimaryKey(sourcePool, schema, table);
        await dropAndCreateTable(schema, table, cols, pk);
        const fks = await getForeignKeys(sourcePool, schema, table);
        const idxs = await getIndexes(sourcePool, schema, table);
        tasks.push({ schema, table, cols, pk, fks, idxs });
      }
    }

    // Phase 2: drop existing foreign keys on target (so data copy won't fail), then copy data for all tables
    for (const t of tasks) {
      // drop any existing foreign key constraints that would block inserts
      for (const fk of t.fks) {
        try {
          await targetPool.query(`ALTER TABLE "${t.schema}"."${t.table}" DROP CONSTRAINT IF EXISTS "${fk.name}"`);
        } catch (e) {
          console.warn('Could not drop existing FK', fk.name, e.message);
        }
      }
    }

    for (const t of tasks) {
      console.log(' Copying data for:', `${t.schema}.${t.table}`);
      await copyData(t.schema, t.table);
    }

    // Phase 3: create constraints/indexes and sync sequences
    for (const t of tasks) {
      console.log(' Creating constraints/indexes for:', `${t.schema}.${t.table}`);
      await createConstraintsAndIndexes(t.schema, t.table, t.fks, t.idxs);
      await syncSequences(t.schema, t.table);
    }
    console.log('Migration complete');
  } catch (e) {
    console.error('Migration failed', e);
  } finally {
    await sourcePool.end();
    await targetPool.end();
  }
}

migrate();
