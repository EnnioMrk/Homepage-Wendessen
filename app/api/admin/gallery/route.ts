import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '../../../../lib/permissions';
import { uploadToBlob } from '../../../../lib/blob-utils';
import { neon } from '@neondatabase/serverless';

export const runtime = 'nodejs';

const sql = neon(process.env.DATABASE_URL!);

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

        const images = result.map((row) => ({
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

        // Upload to Vercel Blob
        const blob = await uploadToBlob(file.name, file, {
            access: 'public',
            addRandomSuffix: true,
        });

        // Save to database
        const result = await sql`
            INSERT INTO gallery_images (filename, original_name, display_name, url, size, mime_type)
            VALUES (${blob.pathname}, ${file.name}, ${displayName.trim()}, ${
            blob.url
        }, ${file.size}, ${file.type})
            RETURNING id, filename, original_name as "originalName", display_name as "displayName", 
                     url, size, mime_type as "mimeType", uploaded_at as "uploadedAt"
        `;

        const newImage = {
            ...result[0],
            uploadedAt: result[0].uploadedAt.toISOString(),
        };

        return NextResponse.json({ image: newImage });
    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
