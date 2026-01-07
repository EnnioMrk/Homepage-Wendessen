import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { sql } from '@/lib/sql';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        const result = await sql`
            SELECT image_url, image_mime_type 
            FROM shared_gallery_submissions 
            WHERE id = ${id}
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        const imageUrl = result[0].image_url;
        if (!imageUrl) {
            return NextResponse.json(
                { error: 'Image data missing' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            imageUrl,
            imageMimeType: result[0].image_mime_type,
        });
    } catch (error) {
        console.error('Error fetching image data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch image data' },
            { status: 500 }
        );
    }
}
