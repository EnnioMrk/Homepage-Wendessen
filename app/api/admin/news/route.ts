import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '../../../../lib/auth';
import { sql } from '../../../../lib/sql';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

interface NewsRow {
    id: number;
    title: string;
    content?: unknown;
    category: string;
    publishedDate: Date;
    articleId: string;
}

// GET - List all news
export async function GET() {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get news from database
        const result = await sql`
            SELECT id, title, content, category, published_date as "publishedDate",
                   article_id as "articleId", is_pinned as "isPinned", pinned_at as "pinnedAt"
            FROM news 
            ORDER BY published_date DESC
        `;

        const news = (result as NewsRow[]).map((row) => ({
            ...row,
            publishedDate: row.publishedDate.toISOString(),
            isPinned: row.isPinned || false,
            pinnedAt: row.pinnedAt ? row.pinnedAt.toISOString() : null,
        }));

        return NextResponse.json({ news });
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Create new news
export async function POST(request: NextRequest) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

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

        // Generate a unique 32-bit article ID (8 hex characters)
        const crypto = await import('crypto');
        let articleId = crypto.randomBytes(4).toString('hex');

        // Ensure uniqueness
        let exists = true;
        while (exists) {
            const check =
                await sql`SELECT id FROM news WHERE article_id = ${articleId}`;
            if (check.length === 0) {
                exists = false;
            } else {
                articleId = crypto.randomBytes(4).toString('hex');
            }
        }

        // Insert into database
        const result = await sql`
            INSERT INTO news (title, content, category, article_id)
            VALUES (
                ${title.trim()}, 
                ${contentJson || null}, 
                ${category.trim()},
                ${articleId}
            )
            RETURNING id, title, content, category, published_date as "publishedDate", article_id
        `;

        const newNews = {
            ...result[0],
            publishedDate: result[0].publishedDate.toISOString(),
        };

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'news.create',
            resourceType: 'news',
            resourceId: String(result[0].id),
            resourceTitle: title.trim(),
            details: { category: category.trim() },
            ...requestInfo,
        });

        // Revalidate pages that show news
        revalidatePath('/');
        revalidateTag('news');

        return NextResponse.json({ news: newNews });
    } catch (error) {
        console.error('Error creating news:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
