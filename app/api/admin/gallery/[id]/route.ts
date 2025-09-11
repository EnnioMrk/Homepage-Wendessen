import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../../../../../lib/auth';
import { del } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// PUT - Update image (rename)
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
        const { displayName } = await request.json();

        if (!displayName?.trim()) {
            return NextResponse.json(
                { error: 'Display name is required' },
                { status: 400 }
            );
        }

        // Update the display name in database
        const result = await sql`
            UPDATE gallery_images 
            SET display_name = ${displayName.trim()}
            WHERE id = ${id}
            RETURNING id, filename, original_name as "originalName", display_name as "displayName", 
                     url, size, mime_type as "mimeType", uploaded_at as "uploadedAt"
        `;

        if (result.length === 0) {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        const updatedImage = {
            ...result[0],
            uploadedAt: result[0].uploadedAt.toISOString(),
        };

        return NextResponse.json({ image: updatedImage });
    } catch (error) {
        console.error('Error updating image:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Delete image
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

        // Get image info before deleting
        const imageResult = await sql`
            SELECT url FROM gallery_images WHERE id = ${id}
        `;

        if (imageResult.length === 0) {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        const imageUrl = imageResult[0].url;

        try {
            // Delete from Vercel Blob
            await del(imageUrl);
        } catch (blobError) {
            console.warn('Could not delete from blob storage:', blobError);
            // Continue anyway, just remove from database
        }

        // Remove from database
        await sql`DELETE FROM gallery_images WHERE id = ${id}`;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
