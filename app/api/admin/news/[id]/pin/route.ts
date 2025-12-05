import { NextRequest, NextResponse } from 'next/server';
import {
    isAuthenticated,
    getCurrentAdminUser,
} from '../../../../../../lib/auth';
import {
    pinNews,
    unpinNews,
    getPinnedNewsCount,
} from '../../../../../../lib/database';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

// POST - Pin a news item
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const news = await pinNews(id);

        // Revalidate pages that show news
        revalidatePath('/');
        revalidateTag('news');

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'news.pin',
            resourceType: 'news',
            resourceId: id,
            resourceTitle: news.title,
            details: {
                category: news.category || undefined,
            },
            ...requestInfo,
        });

        return NextResponse.json({ news });
    } catch (error) {
        console.error('Error pinning news:', error);
        const message =
            error instanceof Error ? error.message : 'Failed to pin news';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}

// DELETE - Unpin a news item
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const news = await unpinNews(id);

        // Revalidate pages that show news
        revalidatePath('/');
        revalidateTag('news');

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'news.unpin',
            resourceType: 'news',
            resourceId: id,
            resourceTitle: news.title,
            details: {
                category: news.category || undefined,
            },
            ...requestInfo,
        });

        return NextResponse.json({ news });
    } catch (error) {
        console.error('Error unpinning news:', error);
        return NextResponse.json(
            { error: 'Failed to unpin news' },
            { status: 500 }
        );
    }
}

// GET - Get pinned news count
export async function GET() {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const count = await getPinnedNewsCount();

        return NextResponse.json({ count });
    } catch (error) {
        console.error('Error fetching pinned news count:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pinned news count' },
            { status: 500 }
        );
    }
}
