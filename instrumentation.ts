/**
 * Next.js Instrumentation
 *
 * This file is automatically loaded by Next.js on server startup.
 * It's used to initialize background tasks like the scheduler and MinIO buckets.
 *
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
    // Only run on the server (Node.js runtime)
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Run DB verification suite only in production by default. You can
        // override with VERIFY_DB_ON_STARTUP=true when needed.
        const verifyEnabled =
            process.env.VERIFY_DB_ON_STARTUP === 'true' ||
            process.env.NODE_ENV === 'production';

        if (verifyEnabled) {
            try {
                const { runVerifyAll } = await import(
                    './scripts/database/verify/run-verify-all'
                );
                // runVerifyAll may throw if verifications fail
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                await runVerifyAll();
            } catch (err) {
                console.error(
                    'instrumentation: database verification failed',
                    err
                );
                // Do not throw — allow startup to continue, but surface failure in logs
            }
        } else {
            console.log(
                'instrumentation: DB verification skipped (not production)'
            );
        }

        // Initialize MinIO buckets
        const { initializeMinIOBuckets } = await import(
            './lib/utils/blob-utils'
        );
        await initializeMinIOBuckets();

        // Ensure default admin exists — run while startup logs are visible
        try {
            const mod = await import('./lib/ensure-admin');
            const ensureAdmin = (mod &&
                (mod.ensureAdmin || mod.default)) as () => Promise<void>;
            if (ensureAdmin) {
                await ensureAdmin();
            } else {
                console.warn(
                    'instrumentation: ensure-admin module found but no callable export'
                );
            }
        } catch (err) {
            console.error('instrumentation: ensure-admin failed', err);
        }

        // Start the scheduler
        const { startScheduler } = await import('./lib/scheduler');
        startScheduler();
    }
}
