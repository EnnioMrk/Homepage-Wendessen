import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/database/settings';

// GET - Get public settings (no auth required)
export async function GET() {
    try {
        const settings = await getSiteSettings();
        return NextResponse.json({ settings });
    } catch (error) {
        console.error('Error fetching public settings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
