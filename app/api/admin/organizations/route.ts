import { NextRequest, NextResponse } from 'next/server';
import { ensureAdmin } from '@/lib/ensure-admin';
import {
    createOrganization,
    getOrganizations,
} from '@/lib/database/organizations';
import { revalidateTagSafe } from '@/lib/revalidate';

export async function GET() {
    try {
        await ensureAdmin();
        const organizations = await getOrganizations();
        return NextResponse.json({ organizations });
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to fetch organizations' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await ensureAdmin();
        const body = await request.json();

        if (!body.title || !body.id) {
            return NextResponse.json(
                { error: 'ID and Title are required' },
                { status: 400 }
            );
        }

        const newOrg = await createOrganization({
            id: body.id,
            title: body.title,
            alt_title: body.alt_title || null,
            description: body.description || null,
        });

        revalidateTagSafe('organizations');
        return NextResponse.json({ organization: newOrg });
    } catch (error) {
        if ((error as Error).message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        if ((error as Error).message.includes('unique constraint')) {
            return NextResponse.json(
                { error: 'Organization already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create organization' },
            { status: 500 }
        );
    }
}
