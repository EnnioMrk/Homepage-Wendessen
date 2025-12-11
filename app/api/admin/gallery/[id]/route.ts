import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '../../../../../lib/permissions';
import { deleteFromBlob } from '../../../../../lib/utils/blob-utils';
import { sql } from '@/lib/sql';
import { getCurrentAdminUser } from '@/lib/auth';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

export const runtime = 'nodejs';

// using shared `sql` helper imported above

// PUT - Update image (rename)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('gallery.edit');

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

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'gallery.edit',
            resourceType: 'gallery',
            resourceId: id,
            resourceTitle: displayName.trim(),
            details: {
                originalName: updatedImage.originalName || undefined,
            },
            ...requestInfo,
        });

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
        await requirePermission('gallery.delete');

        const { id } = await params;

        // Get image info before deleting
        const imageResult = await sql`
            SELECT url, display_name, original_name FROM gallery_images WHERE id = ${id}
        `;

        if (imageResult.length === 0) {
            return NextResponse.json(
                { error: 'Image not found' },
                { status: 404 }
            );
        }

        const imageUrl = imageResult[0].url;
        const displayName = imageResult[0].display_name;

        try {
            // Delete from MinIO
            await deleteFromBlob(imageUrl);
        } catch (blobError) {
            console.warn('Could not delete from object storage:', blobError);
            // Continue anyway, just remove from database
        }

        // Remove from database
        await sql`DELETE FROM gallery_images WHERE id = ${id}`;

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'gallery.delete',
            resourceType: 'gallery',
            resourceId: id,
            resourceTitle: displayName,
            details: {
                originalName: imageResult[0].original_name || undefined,
            },
            ...requestInfo,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
