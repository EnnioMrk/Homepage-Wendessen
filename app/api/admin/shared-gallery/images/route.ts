import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { sql } from '@/lib/sql';

export async function POST(request: NextRequest) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { imageIds } = body;

        if (!Array.isArray(imageIds) || imageIds.length === 0) {
            return NextResponse.json(
                { error: 'imageIds array is required' },
                { status: 400 }
            );
        }

        // Limit batch size to prevent abuse
        const limitedIds = imageIds.slice(0, 100);

        const result = await sql`
            SELECT id, image_url, image_data, image_mime_type 
            FROM shared_gallery_submissions 
            WHERE id = ANY(${limitedIds})
        `;

        const images: Record<string, { imageUrl: string; imageMimeType?: string }> = {};

        for (const row of result) {
            const imageUrl = row.image_url || row.image_data;
            if (imageUrl) {
                images[String(row.id)] = {
                    imageUrl,
                    imageMimeType: row.image_mime_type || undefined,
                };
            }
        }

        return NextResponse.json({ images });
    } catch (error) {
        console.error('Error fetching batch image data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch image data' },
            { status: 500 }
        );
    }
}
