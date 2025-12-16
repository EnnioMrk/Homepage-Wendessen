import { sql, pool } from '@/lib/sql';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import revalidate from '@/lib/revalidate';

export const dynamic = 'force-dynamic';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Auth check
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await getCurrentAdminUser();
    if (!hasPermission(currentUser, 'wendessen.manage')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await request.json();
        /*
         * Supported operations:
         * 1. Update content (name, cards)
         * 2. Set active (is_active = true)
         */

        const { name, card_1, card_2, card_3, is_active } = body;

        // If setting active, we need to deactivate others first/transactionally
        if (is_active === true) {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                // Deactivate all
                await client.query('UPDATE wendessen_layouts SET is_active = false');

                // Update target and set active
                let updateQuery = 'UPDATE wendessen_layouts SET is_active = true';
                const values = [id];
                let paramIndex = 2;

                if (name) {
                    updateQuery += `, name = $${paramIndex}`;
                    values.push(name);
                    paramIndex++;
                }
                if (card_1) {
                    updateQuery += `, card_1 = $${paramIndex}`;
                    values.push(card_1);
                    paramIndex++;
                }
                if (card_2) {
                    updateQuery += `, card_2 = $${paramIndex}`;
                    values.push(card_2);
                    paramIndex++;
                }
                if (card_3) {
                    updateQuery += `, card_3 = $${paramIndex}`;
                    values.push(card_3);
                    paramIndex++;
                }

                updateQuery += ` WHERE id = $1`;

                await client.query(updateQuery, values);
                await client.query('COMMIT');
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        } else {
            // Normal update without changing active state
            await sql`
                UPDATE wendessen_layouts 
                SET name = COALESCE(${name}, name),
                    card_1 = COALESCE(${card_1}, card_1),
                    card_2 = COALESCE(${card_2}, card_2),
                    card_3 = COALESCE(${card_3}, card_3),
                    is_active = COALESCE(${is_active}, is_active)
                WHERE id = ${id}
            `;
        }

        const updatedLayout = await sql`SELECT * FROM wendessen_layouts WHERE id = ${id}`;

        if (updatedLayout.length === 0) {
            return NextResponse.json({ error: 'Layout not found' }, { status: 404 });
        }

        // Revalidate homepage so custom theme updates are visible immediately
        try {
            revalidate.revalidatePathSafe('/');
            revalidate.revalidateTagSafe('wendessen');
        } catch (e) {
            // no-op
        }

        return NextResponse.json({ layout: updatedLayout[0] });

    } catch (error) {
        console.error('Error updating wendessen layout:', error);
        return NextResponse.json(
            { error: 'Fehler beim Aktualisieren des Layouts' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Auth check
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = await getCurrentAdminUser();
    if (!hasPermission(currentUser, 'wendessen.manage')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        // Prevent deleting the active layout?
        const layout = await sql`SELECT is_active FROM wendessen_layouts WHERE id = ${id}`;
        if (layout.length > 0 && layout[0].is_active) {
            return NextResponse.json(
                { error: 'Das aktive Layout kann nicht gelöscht werden. Bitte aktivieren Sie zuerst ein anderes.' },
                { status: 400 }
            );
        }

        await sql`DELETE FROM wendessen_layouts WHERE id = ${id}`;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting wendessen layout:', error);
        return NextResponse.json(
            { error: 'Fehler beim Löschen des Layouts' },
            { status: 500 }
        );
    }
}
