import { unstable_cache } from 'next/cache';
import { sql } from '../sql';

export interface SiteSetting {
    key: string;
    value: string;
}

export const getSiteSettings = unstable_cache(
    async (): Promise<Record<string, string>> => {
        const result = await sql`
            SELECT key, value
            FROM site_settings
        `;

        const settings: Record<string, string> = {};
        for (const row of result) {
            settings[row.key as string] = (row.value as string) || '';
        }
        return settings;
    },
    ['site-settings'],
    { revalidate: 300, tags: ['settings'] }
);

export async function getSiteSetting(key: string): Promise<string | null> {
    const settings = await getSiteSettings();
    return settings[key] || null;
}
