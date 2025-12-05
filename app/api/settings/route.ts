import { NextResponse } from 'next/server';
import { sql } from '@/lib/sql';
import { unstable_cache } from 'next/cache';

// Cache settings for 5 minutes
const getCachedSettings = unstable_cache(
    async () => {
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

// GET - Get public settings (no auth required)
export async function GET() {
    try {
        const settings = await getCachedSettings();
        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Error fetching public settings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
