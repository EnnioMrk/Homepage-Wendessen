import { cacheTag } from 'next/cache';
import { sql } from '../sql';

export interface RegisterCounts {
    events: number;
    news: number;
    contacts: number;
    clubs: number;
}

/**
 * The register's totals for the margin. Separate from the page slices: a
 * margin that says "Termine 5" while the register holds 60 dates is a lie the
 * design cannot afford.
 */
export async function getRegisterCounts(): Promise<RegisterCounts> {
    'use cache';
    cacheTag('events', 'news', 'contacts', 'register-counts');
    const rows = await sql`
        SELECT
            (SELECT COUNT(*)::int FROM events) AS events,
            (SELECT COUNT(*)::int FROM news) AS news,
            (SELECT COUNT(*)::int FROM contacts) AS contacts
    `;
    const row = (rows[0] ?? {}) as Record<string, unknown>;
    return {
        events: Number(row.events ?? 0),
        news: Number(row.news ?? 0),
        contacts: Number(row.contacts ?? 0),
        clubs: 0,
    };
}
