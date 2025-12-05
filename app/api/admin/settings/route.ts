import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { sql } from '@/lib/sql';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

export interface SiteSetting {
    id: number;
    key: string;
    value: string | null;
    displayName: string;
    description: string | null;
    type: string;
    category: string;
}

// GET - Get all settings
export async function GET() {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const currentUser = await getCurrentAdminUser();
        if (!hasPermission(currentUser, 'settings.view')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const result = await sql`
            SELECT 
                id, 
                key, 
                value, 
                display_name as "displayName", 
                description, 
                type, 
                category
            FROM site_settings
            ORDER BY category, display_name
        `;

        return NextResponse.json({ settings: result });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const currentUser = await getCurrentAdminUser();
        if (!hasPermission(currentUser, 'settings.edit')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { settings } = await request.json();

        if (!Array.isArray(settings)) {
            return NextResponse.json(
                { error: 'Invalid settings format' },
                { status: 400 }
            );
        }

        // Update each setting
        const changedKeys: string[] = [];
        for (const setting of settings) {
            if (!setting.key) continue;
            changedKeys.push(setting.key);

            await sql`
                UPDATE site_settings
                SET value = ${setting.value || ''},
                    updated_at = CURRENT_TIMESTAMP
                WHERE key = ${setting.key}
            `;
        }

        // Log the action (fire-and-forget)
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'settings.update',
            resourceType: 'settings',
            details: { changedKeys },
            ...requestInfo,
        });

        // Revalidate all pages since settings can affect any page
        revalidatePath('/', 'layout');
        revalidateTag('settings');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
