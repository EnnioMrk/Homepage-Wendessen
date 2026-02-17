import { sql } from '@/lib/sql';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import revalidate from '@/lib/revalidate';
import { hasPermission } from '@/lib/permissions';

export async function GET() {
    // Auth check
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await getCurrentAdminUser();
    if (!hasPermission(currentUser, 'wendessen.view')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const layouts = await sql`
            SELECT * FROM wendessen_layouts 
            ORDER BY created_at DESC
        `;

        return NextResponse.json({ layouts });
    } catch (error) {
        console.error('Error fetching wendessen layouts:', error);
        return NextResponse.json(
            { error: 'Fehler beim Laden der Layouts' },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    // Auth check
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await getCurrentAdminUser();
    if (
        !hasPermission(currentUser, 'wendessen.create') &&
        !hasPermission(currentUser, 'wendessen.manage')
    ) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name, card_1, card_2, card_3 } = body;

        if (!name || !card_1 || !card_2 || !card_3) {
            return NextResponse.json(
                { error: 'Fehlende Daten' },
                { status: 400 },
            );
        }

        // Create new layout
        // Default to not active unless it's the first one (which logic handled in setup, but here we can be safe)
        const newLayout = await sql`
            INSERT INTO wendessen_layouts (name, is_active, card_1, card_2, card_3)
            VALUES (${name}, false, ${card_1}, ${card_2}, ${card_3})
            RETURNING *
        `;

        // Revalidate homepage and related tag so changes (including custom themes) appear
        try {
            revalidate.revalidatePathSafe('/');
            revalidate.revalidateTagSafe('wendessen');
        } catch {
            // swallow - helper already logs if needed
        }

        return NextResponse.json({ layout: newLayout[0] });
    } catch (error) {
        console.error('Error creating wendessen layout:', error);
        return NextResponse.json(
            { error: 'Fehler beim Erstellen des Layouts' },
            { status: 500 },
        );
    }
}
