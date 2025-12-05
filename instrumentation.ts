/**
 * Next.js Instrumentation
 * 
 * This file is automatically loaded by Next.js on server startup.
 * It's used to initialize background tasks like the scheduler.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
    // Only run on the server (Node.js runtime)
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { startScheduler } = await import('./lib/scheduler');
        startScheduler();
    }
}
