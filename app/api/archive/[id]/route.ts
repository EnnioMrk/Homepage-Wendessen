import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { sql } from '@/lib/sql';
import { getCurrentAdminUser } from '@/lib/auth';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const result = await sql`
            SELECT * FROM archive 
            WHERE id = ${id}
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Archive item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error('Error fetching archive item:', error);
        return NextResponse.json(
            { error: 'Failed to fetch archive item' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('archive.edit');

        const { id } = await params;
        const body = await request.json();
        const { title, author, category, created_date, content } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const result = await sql`
            UPDATE archive 
            SET 
                title = ${title},
                author = ${author || null},
                category = ${category || null},
                created_date = ${created_date || null},
                content = ${content},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Archive item not found' },
                { status: 404 }
            );
        }

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'archive.update',
            resourceType: 'archive',
            resourceId: id,
            resourceTitle: title,
            details: {
                category: category || undefined,
                author: author || undefined,
            },
            ...requestInfo,
        });

        return NextResponse.json(result[0]);
    } catch (error: unknown) {
        console.error('Error updating archive item:', error);

        const errorMessage = (error as Error).message || 'Unknown error';

        if (
            errorMessage.includes('Forbidden') ||
            errorMessage.includes('Unauthorized')
        ) {
            return NextResponse.json(
                { error: errorMessage },
                { status: errorMessage.includes('Unauthorized') ? 401 : 403 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update archive item' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('archive.delete');

        const { id } = await params;

        const result = await sql`
            DELETE FROM archive 
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Archive item not found' },
                { status: 404 }
            );
        }

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'archive.delete',
            resourceType: 'archive',
            resourceId: id,
            resourceTitle: result[0].title,
            details: {
                category: result[0].category || undefined,
            },
            ...requestInfo,
        });

        return NextResponse.json({
            message: 'Archive item deleted successfully',
        });
    } catch (error: unknown) {
        console.error('Error deleting archive item:', error);

        const errorMessage = (error as Error).message || 'Unknown error';

        if (
            errorMessage.includes('Forbidden') ||
            errorMessage.includes('Unauthorized')
        ) {
            return NextResponse.json(
                { error: errorMessage },
                { status: errorMessage.includes('Unauthorized') ? 401 : 403 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to delete archive item' },
            { status: 500 }
        );
    }
}
