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

    // Define the setup steps (use package.json scripts where available)
    const steps = [
        {
            name: 'Database (tables & seed)',
            cmd: 'bunx tsx scripts/setup-database.ts',
        },
        { name: 'Contacts (seed)', cmd: 'bunx tsx scripts/setup-contacts.ts' },
        { name: 'Gallery table', cmd: 'bun run setup-gallery' },
        { name: 'Admin users', cmd: 'bun run setup-admin-users' },
        { name: 'Roles & permissions', cmd: 'bun run setup-roles-permissions' },
    ];

    for (const step of steps) {
        console.log(`\n=== Running: ${step.name} ===`);
        // If .env exists, prefix so the child picks it up in shells without relying on external tooling
        const prefix = fs.existsSync(envPath)
            ? 'set -a && source .env && set +a && '
            : '';
        try {
            run(prefix + step.cmd);
            console.log(`✅ ${step.name} completed`);
        } catch (err) {
            console.error(
                `❌ ${step.name} failed:`,
                err instanceof Error ? err.message : err
            );
            process.exit(1);
        }
    }

    console.log('\n🎉 Full setup finished successfully!');
}

main().catch((err) => {
    console.error('Fatal error during setup:', err);
    process.exit(1);
});
