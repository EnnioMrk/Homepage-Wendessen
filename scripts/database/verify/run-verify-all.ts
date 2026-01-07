const SCRIPTS = [
    'verify-gallery.ts',
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

/**
 * Execute a command asynchronously with a timeout
 */
async function runScript(scriptPath: string, timeout = 30000): Promise<{ stdout: string; stderr: string; status: number | null }> {
    const { spawn } = await import('child_process');
    return new Promise((resolve) => {
        const child = spawn('bun', [scriptPath], {
            env: process.env,
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => { stdout += data.toString(); });
        child.stderr.on('data', (data) => { stderr += data.toString(); });

        const timer = setTimeout(() => {
            child.kill();
            resolve({ stdout, stderr: stderr + '\nError: Execution timed out', status: -1 });
        }, timeout);

        child.on('close', (code) => {
            clearTimeout(timer);
            resolve({ stdout, stderr, status: code });
        });

        child.on('error', (err) => {
            clearTimeout(timer);
            resolve({ stdout, stderr: stderr + `\nError: ${err.message} `, status: 1 });
        });
    });
}

export async function runVerifyAll(): Promise<void> {
    const path = await import('path');
    const fs = await import('fs');

    const dir = path.resolve(process.cwd(), 'scripts/database/verify');
    if (!fs.existsSync(dir)) {
        console.warn(
            'run-verify-all: verify directory not found, skipping verifications'
        );
        return;
    }

    console.log('run-verify-all: starting verification suite');
    let failed = false;

    // Mapping from verify script -> repair/setup script (if available)
    const REPAIR_MAP: Record<string, string | undefined> = {
        'verify-gallery.ts': '../setup/admin-gallery.ts',
        'verify-admin_users.ts': '../setup/admin-users.ts',
        'verify-roles.ts': '../setup/roles-permissions.ts',
        'verify-permissions.ts': '../setup/roles-permissions.ts',
        'verify-contacts.ts': '../setup/contacts.ts',
        'verify-push_subscriptions.ts': '../setup/push-subscriptions.ts',
        'verify-shared_gallery_submissions.ts': '../setup/shared-gallery.ts',
        'verify-shared_gallery_reports.ts': '../setup/gallery-reports.ts',
        'verify-portraits.ts': '../setup/portraits-table.ts',
        'verify-events.ts': '../setup/events.ts',
        'verify-news.ts': '../setup/news.ts',
        'verify-site_settings.ts': '../setup/settings.ts',
        'verify-archive.ts': '../setup/archive-table.ts',
        'verify-admin_logs.ts': '../setup/admin-logs.ts',
    };

    for (const s of SCRIPTS) {
        const scriptPath = path.join(dir, s);
        if (!fs.existsSync(scriptPath)) {
            console.warn(`run - verify - all: script not found ${s} — skipping`);
            continue;
        }

        console.log(`\n === verify: START ${s} === `);

        const res = await runScript(scriptPath);

        if (res.stdout) {
            console.log(`-- - ${s} stdout-- -\n${res.stdout.trim()} `);
        }
        if (res.stderr) {
            console.error(`-- - ${s} stderr-- -\n${res.stderr.trim()} `);
        }

        if (res.status !== 0) {
            console.error(`=== verify: FAIL ${s} (exit = ${res.status}) === `);

            const repairRel = REPAIR_MAP[s];
            if (repairRel) {
                const repairPath = path.resolve(dir, repairRel);
                if (fs.existsSync(repairPath)) {
                    console.log(`Attempting repair for ${s} using ${repairRel}...`);
                    const repairRes = await runScript(repairPath, 60000); // Give repair scripts 60s

                    if (repairRes.stdout) console.log(repairRes.stdout.trim());
                    if (repairRes.stderr) console.error(repairRes.stderr.trim());

                    if (repairRes.status === 0) {
                        console.log(`Repair script ${repairRel} completed, re - running verification ${s}...`);
                        const rerun = await runScript(scriptPath);
                        if (rerun.stdout) console.log(rerun.stdout.trim());
                        if (rerun.stderr) console.error(rerun.stderr.trim());
                        if (rerun.status === 0) {
                            console.log(`=== verify: OK ${s} (after repair) === `);
                            continue;
                        }
                        console.error(`=== verify: STILL FAIL ${s} after repair(exit = ${rerun.status}) === `);
                    } else {
                        console.error(`Repair script ${repairRel} failed(exit = ${repairRes.status})`);
                    }
                } else {
                    console.warn(`Repair script not found: ${repairRel} `);
                }
            } else {
                console.warn(`No repair mapping for ${s}, skipping auto - repair.`);
            }

            failed = true;
        } else {
            console.log(`=== verify: OK ${s} === `);
        }
    }

    if (failed) {
        throw new Error('run-verify-all: one or more verifications failed');
    }

    console.log('run-verify-all: all verifications passed');
}

export default runVerifyAll;
