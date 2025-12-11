import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '../../../../lib/permissions';
import { uploadToBlob } from '../../../../lib/utils/blob-utils';
import { convertFileToWebP } from '../../../../lib/utils/image-utils';
import { sql } from '@/lib/sql';
import { getCurrentAdminUser } from '@/lib/auth';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

interface GalleryImageRow {
    id: number;
    filename: string;
    originalName: string;
    displayName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
}

export const runtime = 'nodejs';

// const sql is provided by the shared helper import above

// GET - List all images
export async function GET() {
    try {
        await requirePermission('gallery.view');

        // Get images from database
        const result = await sql`
            SELECT id, filename, original_name as "originalName", display_name as "displayName", 
                   url, size, mime_type as "mimeType", uploaded_at as "uploadedAt"
            FROM gallery_images 
            ORDER BY uploaded_at DESC
        `;

        const images = (result as GalleryImageRow[]).map((row) => ({
            ...row,
            uploadedAt: row.uploadedAt.toISOString(),
        }));

        return NextResponse.json({ images });
    } catch (error) {
        console.error('Error fetching images:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Upload new image
export async function POST(request: NextRequest) {
    try {
        await requirePermission('gallery.upload');

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const displayName = formData.get('displayName') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        if (!displayName?.trim()) {
            return NextResponse.json(
                { error: 'Display name is required' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Only image files are allowed' },
                { status: 400 }
            );
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size too large. Maximum: 5MB' },
                { status: 400 }
            );
        }

        // Convert image to WebP format
        const converted = await convertFileToWebP(file);

        // Upload to MinIO (gallery bucket)
        const blob = await uploadToBlob(converted.filename, converted.buffer, {
            addRandomSuffix: true,
            contentType: converted.mimeType,
            bucket: 'gallery',
        });

        // Save to database
        const result = await sql`
            INSERT INTO gallery_images (filename, original_name, display_name, url, size, mime_type)
            VALUES (${blob.pathname}, ${file.name}, ${displayName.trim()}, ${
            blob.url
        }, ${converted.buffer.length}, ${converted.mimeType})
            RETURNING id, filename, original_name as "originalName", display_name as "displayName", 
                     url, size, mime_type as "mimeType", uploaded_at as "uploadedAt"
        `;

        const newImage = {
            ...result[0],
            uploadedAt: result[0].uploadedAt.toISOString(),
        };

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'gallery.upload',
            resourceType: 'gallery',
            resourceId: String(newImage.id),
            resourceTitle: displayName.trim(),
            details: {
                originalName: file.name,
                size: converted.buffer.length,
            },
            ...requestInfo,
        });

        return NextResponse.json({ image: newImage });
    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
