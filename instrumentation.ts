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
                console.time('instrumentation: database verification');
                await runVerifyAll();
                console.timeEnd('instrumentation: database verification');
            } catch (err) {
                console.error(
                    'instrumentation: database verification failed',
                    err
                );
            }
        } else {
            console.log(
                'instrumentation: DB verification skipped (not production)'
            );
        }

        // Initialize MinIO buckets
        console.time('instrumentation: MinIO initialization');
        const { initializeMinIOBuckets } = await import(
            './lib/utils/blob-utils'
        );
        await initializeMinIOBuckets();
        console.timeEnd('instrumentation: MinIO initialization');

        // Ensure default admin exists
        console.time('instrumentation: ensure-admin');
        try {
            const mod = await import('./lib/ensure-admin');
            const ensureAdmin = (mod &&
                (mod.ensureAdmin || mod.default)) as () => Promise<void>;
            if (ensureAdmin) {
                await ensureAdmin();
            }
        } catch (err) {
            console.error('instrumentation: ensure-admin failed', err);
        }
        console.timeEnd('instrumentation: ensure-admin');

        // Start the scheduler
        console.time('instrumentation: scheduler');
        const { startScheduler } = await import('./lib/scheduler');
        startScheduler();
        console.timeEnd('instrumentation: scheduler');
    }
}
