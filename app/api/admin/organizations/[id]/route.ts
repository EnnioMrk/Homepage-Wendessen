import { NextRequest, NextResponse } from 'next/server';
import { ensureAdmin } from '@/lib/ensure-admin';
import {
    deleteOrganization,
    updateOrganization,
} from '@/lib/database/organizations';
import { revalidateTagSafe, revalidatePathSafe } from '@/lib/revalidate';

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await ensureAdmin();
        const { id } = await context.params;
        const body = await request.json();

        if (!body.title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const updatedOrg = await updateOrganization(id, {
            id: body.id, // Usually id shouldn't change, but passing it for interface compliance
            title: body.title,
            alt_title: body.alt_title || null,
            description: body.description || null,
        });

        revalidateTagSafe('organizations');
        revalidatePathSafe('/');
        return NextResponse.json({ organization: updatedOrg });
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to update organization' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await ensureAdmin();
        const { id } = await context.params;

        await deleteOrganization(id);

        revalidateTagSafe('organizations');
        revalidatePathSafe('/');
        return NextResponse.json({ success: true });
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to delete organization' },
            { status: 500 }
        );
    }
}
