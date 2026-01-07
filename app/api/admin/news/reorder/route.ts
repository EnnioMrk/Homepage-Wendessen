import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '../../../../../lib/auth';
import { updatePinnedOrder } from '../../../../../lib/database/news';
import { revalidatePathSafe, revalidateTagSafe } from '@/lib/revalidate';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

export async function POST(request: NextRequest) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { orderedIds } = await request.json();

        if (!orderedIds || !Array.isArray(orderedIds)) {
            return NextResponse.json(
                { error: 'orderedIds must be an array' },
                { status: 400 }
            );
        }

        const news = await updatePinnedOrder(orderedIds);

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'news.reorder',
            resourceType: 'news',
            details: { orderedIds },
            ...requestInfo,
        });

        // Revalidate pages that show news
        revalidatePathSafe('/');
        revalidateTagSafe('news');

        return NextResponse.json({ success: true, news });
    } catch (error) {
        console.error('Error reordering news:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
