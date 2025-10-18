import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { sql } from '@/lib/sql';

export async function GET() {
    try {
        const items = await sql`
            SELECT * FROM archive 
            ORDER BY created_date DESC NULLS LAST, created_at DESC
        `;
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching archive items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch archive items' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await requirePermission('archive.create');

        const body = await request.json();
        const { title, author, category, created_date, content } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const result = await sql`
            INSERT INTO archive (title, author, category, created_date, content)
            VALUES (${title}, ${author || null}, ${category || null}, ${created_date || null}, ${content})
            RETURNING *
        `;

        return NextResponse.json(result[0], { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating archive item:', error);
        
        const errorMessage = (error as Error).message || 'Unknown error';
        
        if (errorMessage.includes('Forbidden') || errorMessage.includes('Unauthorized')) {
            return NextResponse.json(
                { error: errorMessage },
                { status: errorMessage.includes('Unauthorized') ? 401 : 403 }
            );
        }
        
        return NextResponse.json(
            { error: 'Failed to create archive item' },
            { status: 500 }
        );
    }
}
