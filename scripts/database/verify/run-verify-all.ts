#!/usr/bin/env bunx
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const SCRIPTS = [
    'verify-admin_users.ts',
    'verify-roles.ts',
    'verify-permissions.ts',
    'verify-contacts.ts',
    'verify-push_subscriptions.ts',
    'verify-notification_events.ts',
    'verify-shared_gallery_submissions.ts',
    'verify-shared_gallery_reports.ts',
    'verify-portraits.ts',
    'verify-events.ts',
    'verify-news.ts',
    'verify-site_settings.ts',
    'verify-archive.ts',
    'verify-admin_logs.ts',
];

export async function runVerifyAll(): Promise<void> {
    const dir = path.resolve(process.cwd(), 'scripts/database/verify');
    if (!fs.existsSync(dir)) {
        console.warn(
            'run-verify-all: verify directory not found, skipping verifications'
        );
        return;
    }

    console.log('run-verify-all: starting verification suite');
    let failed = false;

    for (const s of SCRIPTS) {
        const scriptPath = path.join(dir, s);
        if (!fs.existsSync(scriptPath)) {
            console.warn(`run-verify-all: script not found ${s} — skipping`);
            continue;
        }

        console.log(`
    === verify: START ${s} ===`);
        // Run the TypeScript verification script with `bun` directly.
        // Bun can execute .ts files without tsx; this avoids bunx's temporary
        // preload loader issues on some Windows setups.
        const res = spawnSync('bun', [scriptPath], {
            env: process.env,
            encoding: 'utf8',
            maxBuffer: 10 * 1024 * 1024,
        });

        if (res.stdout) {
            console.log(`--- ${s} stdout ---\n${res.stdout.trim()}`);
        }
        if (res.stderr) {
            console.error(`--- ${s} stderr ---\n${res.stderr.trim()}`);
        }

        if (res.status !== 0) {
            console.error(`=== verify: FAIL ${s} (exit=${res.status}) ===`);
            failed = true;
        } else {
            console.log(`=== verify: OK ${s} ===`);
        }
    }

    if (failed) {
        throw new Error('run-verify-all: one or more verifications failed');
    }

    console.log('run-verify-all: all verifications passed');
}

export default runVerifyAll;
