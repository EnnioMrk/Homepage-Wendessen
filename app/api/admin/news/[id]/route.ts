import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '../../../../../lib/auth';
import { sql } from '../../../../../lib/sql';
import { revalidatePathSafe, revalidateTagSafe } from '@/lib/revalidate';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

// GET - Get single news item
export async function GET(
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

        const result = await sql`
            SELECT id, title, content as "contentJson", category, published_date as "publishedDate", 
                   article_id as "articleId"
            FROM news
            WHERE id = ${id}
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'News not found' },
                { status: 404 }
            );
        }

        const news = {
            ...result[0],
            publishedDate: result[0].publishedDate.toISOString(),
        };

        return NextResponse.json({ news });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Update news
export async function PUT(
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
        const { title, category, contentJson } = await request.json();

        if (!title?.trim()) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        if (!category?.trim()) {
            return NextResponse.json(
                { error: 'Category is required' },
                { status: 400 }
            );
        }

        // Update the news in database
        const result = await sql`
            UPDATE news 
            SET title = ${title.trim()}, 
                content = ${contentJson || null}, 
                category = ${category.trim()},
                updated_at = ${new Date().toISOString()}
            WHERE id = ${id}
            RETURNING id, title, content as "contentJson", category, published_date as "publishedDate", 
                      article_id as "articleId"
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'News not found' },
                { status: 404 }
            );
        }

        const updatedNews = {
            ...result[0],
            publishedDate: result[0].publishedDate.toISOString(),
        };

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'news.update',
            resourceType: 'news',
            resourceId: id,
            resourceTitle: title.trim(),
            details: { category: category.trim() },
            ...requestInfo,
        });

        // Revalidate pages that show news
        revalidatePathSafe('/');
        revalidateTagSafe('news');

        return NextResponse.json({ news: updatedNews });
    } catch (error) {
        console.error('Error updating news:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Delete news
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

        // Check if news exists
        const existingNews = await sql`
            SELECT id, title, category FROM news WHERE id = ${id}
        `;

        if (existingNews.length === 0) {
            return NextResponse.json(
                { error: 'News not found' },
                { status: 404 }
            );
        }

        const newsTitle = existingNews[0].title;

        // Delete from database
        await sql`DELETE FROM news WHERE id = ${id}`;

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'news.delete',
            resourceType: 'news',
            resourceId: id,
            resourceTitle: newsTitle as string,
            details: {
                category: (existingNews[0].category as string) || undefined,
            },
            ...requestInfo,
        });

        // Revalidate pages that show news
        revalidatePathSafe('/');
        revalidateTagSafe('news');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting news:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
