import { cacheLife, cacheTag } from 'next/cache';

/**
 * The register shows "today" in the margin. A page that reads the clock cannot
 * be prerendered, so the current date is a short-lived cache entry instead: it
 * is rendered at build time and refreshed every minute at runtime. A page never
 * blocks on request data, and the date never sticks at build time.
 */
export async function pageToday(): Promise<Date> {
    'use cache';
    cacheTag('register-today');
    cacheLife({ stale: 60, revalidate: 60, expire: 3600 });
    return new Date();
}
