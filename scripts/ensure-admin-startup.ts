#!/usr/bin/env bun
// dotenv's types sometimes don't resolve correctly under the project's resolver.
// use a safe import and call `config()` while silencing the specific TS module-resolution issue.
// @ts-ignore: Fallback for dotenv types/exports resolution
import dotenv from 'dotenv';
dotenv.config();

import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
// `pg` exports can be ESM/has default; import the package and extract `Pool` to satisfy different environments.
import Pg from 'pg';
const { Pool } = Pg as any;

async function ensureAdmin() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.warn('ensure-admin-startup: DATABASE_URL not set — skipping');
        return;
    }

    const pool = new Pool({ connectionString: databaseUrl });
    const client = await pool.connect();
    try {
        const res = await client.query(
            'SELECT COUNT(*)::int AS count FROM admin_users'
        );
        const count = res.rows?.[0]?.count ?? 0;

        if (Number(count) === 0) {
            const password = randomBytes(12).toString('base64url');
            const hash = await bcrypt.hash(password, 10);
            await client.query(
                'INSERT INTO admin_users (username, password_hash, custom_permissions, must_change_password) VALUES ($1, $2, $3, true)',
                ['admin', hash, '["*"]']
            );
            console.log(
                'DEFAULT ADMIN CREATED — username=admin password=' + password
            );
        } else {
            console.log('ensure-admin-startup: admin users exist, skipping');
        }
    } catch (err) {
        console.error('ensure-admin-startup: error ensuring admin', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

ensureAdmin().catch((e) => {
    console.error('ensure-admin-startup: fatal', e);
    process.exit(1);
});
