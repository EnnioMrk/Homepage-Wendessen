#!/usr/bin/env bunx
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';

function run(command: string, args: string[] = []) {
    console.log('\n> ' + [command, ...args].join(' '));
    const res = spawnSync(command, args, {
        stdio: 'inherit',
        shell: true,
        env: process.env,
    });
    if (res.status !== 0) {
        throw new Error(`Command failed: ${command} ${args.join(' ')}`);
    }
}

async function main() {
    // Load .env if present
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        console.log('Loading environment from .env');
        // shell out to source the .env for child processes by prefixing commands with 'set -a && source .env && set +a && '
    } else {
        console.warn(
            '.env not found in project root — ensure DATABASE_URL is set'
        );
    }

    // Define the setup steps (explicitly reference canonical scripts in scripts/database)
    const steps = [
        {
            name: 'Admin users',
            cmd: 'bun scripts/database/setup/admin-users.ts',
        },
        {
            name: 'Roles & permissions',
            cmd: 'bun scripts/database/setup/roles-permissions.ts',
        },
        {
            name: 'Admin logs',
            cmd: 'bun scripts/database/setup/admin-logs.ts',
        },
        {
            name: 'Push subscriptions',
            cmd: 'bun scripts/database/setup/push-subscriptions.ts',
        },
        {
            name: 'Contacts (seed)',
            cmd: 'bun scripts/database/setup/contacts.ts',
        },
        {
            name: 'Portraits table',
            cmd: 'bun scripts/database/setup/portraits-table.ts',
        },
        {
            name: 'Events table',
            cmd: 'bun scripts/database/setup/events.ts',
        },
        {
            name: 'Gallery images table',
            cmd: 'bun scripts/database/setup/admin-gallery.ts',
        },
        {
            name: 'News table',
            cmd: 'bun scripts/database/setup/news.ts',
        },
        {
            name: 'Shared gallery',
            cmd: 'bun scripts/database/setup/shared-gallery.ts',
        },
        {
            name: 'Gallery reports',
            cmd: 'bun scripts/database/setup/gallery-reports.ts',
        },
        {
            name: 'MinIO buckets',
            cmd: 'bun scripts/database/setup/minio-buckets.ts',
        },
        {
            name: 'Vereinsverwalter role',
            cmd: 'bun scripts/database/setup/verein-roles.ts',
        },
        {
            name: 'Site settings',
            cmd: 'bun scripts/database/setup/settings.ts',
        },
        {
            name: 'Archive table',
            cmd: 'bun scripts/database/setup/archive-table.ts',
        },
        {
            name: 'Wendessen section',
            cmd: 'bun scripts/database/setup/wendessen-section.ts',
        },
        {
            name: 'Organizations table',
            cmd: 'bun scripts/database/setup/organizations.ts',
        },
        {
            name: 'Contact permissions',
            cmd: 'bun scripts/database/setup/add-contact-permissions.ts',
        },
    ];

    for (const step of steps) {
        console.log(`\n=== Running: ${step.name} ===`);
        try {
            run(step.cmd);
            console.log(`✅ ${step.name} completed`);
        } catch (err) {
            console.error(
                `❌ ${step.name} failed:`,
                err instanceof Error ? err.message : err
            );
            process.exit(1);
        }
    }

    console.log('\n=== Running: Final Verification ===');
    try {
        run('bun scripts/database/verify/run-verify-all.ts');
        console.log('✅ Final Verification completed');
    } catch (err) {
        console.error(
            '❌ Final Verification failed:',
            err instanceof Error ? err.message : err
        );
        process.exit(1);
    }

    console.log('\n🎉 Full setup finished successfully!');
}

main().catch((err) => {
    console.error('Fatal error during setup:', err);
    process.exit(1);
});
