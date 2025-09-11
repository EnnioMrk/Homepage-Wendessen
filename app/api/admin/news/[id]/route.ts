import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../../../../../lib/auth';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// PUT - Update news
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = params;
        const { title, content, category } = await request.json();

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
                content = ${content?.trim() || null}, 
                category = ${category.trim()},
                updated_at = ${new Date().toISOString()}
            WHERE id = ${id}
            RETURNING id, title, content, category, published_date as "publishedDate"
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
    { params }: { params: { id: string } }
) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = params;

        // Check if news exists
        const existingNews = await sql`
            SELECT id FROM news WHERE id = ${id}
        `;

        if (existingNews.length === 0) {
            return NextResponse.json(
                { error: 'News not found' },
                { status: 404 }
            );
        }

        // Delete from database
        await sql`DELETE FROM news WHERE id = ${id}`;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting news:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
