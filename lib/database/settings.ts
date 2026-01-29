import { cacheTag } from 'next/cache';
import { sql } from '../sql';

export interface SiteSetting {
    key: string;
    value: string;
}

export async function getSiteSettings(): Promise<Record<string, string>> {
    'use cache';
    cacheTag('settings');
    const result = await sql`
            SELECT key, value
            FROM site_settings
        `;

    const settings: Record<string, string> = {};
    for (const row of result) {
        settings[row.key as string] = (row.value as string) || '';
    }
    return settings;
}

export async function getSiteSetting(key: string): Promise<string | null> {
    const settings = await getSiteSettings();
    return settings[key] || null;
}
