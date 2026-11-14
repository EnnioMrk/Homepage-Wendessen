import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Production build that does not require the database.
 *
 * A deploy pipeline usually builds in a container without runtime secrets. The
 * register's pages read PostgreSQL, so prerendering them there would fail. When
 * DATABASE_URL is absent we compile only: every route is built and served on
 * demand, and data is still cached at runtime by the `use cache` functions.
 * With a database available the normal build runs and prerenders what it can.
 */
/**
 * Next loads `.env` itself, but this script has to decide the build mode before
 * that happens. Read the file the same way Next does, without overriding a real
 * environment variable (a deployed container has no `.env` at all).
 */
function hasDatabaseUrl() {
    if (process.env.DATABASE_URL) return true;
    const envPath = join(process.cwd(), '.env');
    if (!existsSync(envPath)) return false;
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
        const match = line.match(/^\s*DATABASE_URL\s*=\s*(.+)\s*$/);
        if (match && match[1].trim().length > 0) return true;
    }
    return false;
}

const nextBin = join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next');
if (!existsSync(nextBin)) {
    console.error('next is not installed; run bun install first.');
    process.exit(1);
}

const args = [nextBin, 'build'];
if (!hasDatabaseUrl()) {
    // A container build usually has no runtime secrets. Compile mode emits no
    // prerendered HTML, so every route renders on demand against the runtime
    // database; nothing is baked with empty data.
    console.warn(
        '\n[build] DATABASE_URL is not available — building in compile mode.\n' +
            '[build] No page is prerendered; all routes render on demand at runtime.\n' +
            '[build] Set DATABASE_URL for the build to get prerendered pages.\n',
    );
    args.push('--experimental-build-mode', 'compile');
}

const result = spawnSync(process.execPath, args, {
    stdio: 'inherit',
    env: process.env,
});
process.exit(result.status ?? 1);
