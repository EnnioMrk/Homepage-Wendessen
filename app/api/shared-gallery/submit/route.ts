import { NextRequest, NextResponse } from 'next/server';
import { createSharedGallerySubmission } from '@/lib/database';
import { revalidateTag } from 'next/cache';
import { uploadToBlob } from '@/lib/blob-utils';
import { convertDataUrlToWebP } from '@/lib/image-utils';
import { notifyNewSharedGallery } from '@/lib/push-notifications';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const {
            submissionGroupId,
            title,
            description,
            submitterName,
            submitterEmail,
            imageData,
            imageMimeType,
            imageFilename,
            dateTaken,
            location,
        } = body;

        if (!submissionGroupId || !title || !imageData || !imageMimeType) {
            return NextResponse.json(
                {
                    error: 'Submission group ID, title, image data, and MIME type are required',
                },
                { status: 400 }
            );
        }

        // Validate image data (should be base64)
        if (!imageData.startsWith('data:image/')) {
            return NextResponse.json(
                { error: 'Invalid image data format' },
                { status: 400 }
            );
        }

        // Convert image to WebP format
        const converted = await convertDataUrlToWebP(imageData, imageFilename);

        // Keep filenames readable while ensuring uniqueness and safe characters
        const sanitizedFilename = converted.filename.replace(
            /[^a-zA-Z0-9._-]/g,
            '_'
        );
        const uniqueKey = `shared-gallery/${submissionGroupId}/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}-${sanitizedFilename}`;

        const blob = await uploadToBlob(uniqueKey, converted.buffer, {
            contentType: converted.mimeType,
            bucket: 'impressions',
        });

        const submission = await createSharedGallerySubmission({
            submissionGroupId,
            title,
            description,
            submitterName,
            submitterEmail,
            imageUrl: blob.url,
            imageStoragePath: blob.pathname,
            imageMimeType: converted.mimeType,
            imageFilename: converted.filename,
            dateTaken: dateTaken ? new Date(dateTaken) : undefined,
            location,
        });

        // Revalidate the shared gallery cache so admins see new submissions
        revalidateTag('shared-gallery');

        // Send push notification to admins (deduplication happens in the function)
        // Note: Since images are submitted one by one, the notification is sent on first image
        notifyNewSharedGallery(
            submissionGroupId,
            submitterName || 'Anonym',
            1 // We don't know total count here, just say "new submission"
        ).catch((err) =>
            console.error('Failed to send shared gallery notification:', err)
        );

        return NextResponse.json(
            {
                message: 'Submission created successfully',
                submission: {
                    id: submission.id,
                    title: submission.title,
                    status: submission.status,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating shared gallery submission:', error);
        return NextResponse.json(
            { error: 'Failed to create submission' },
            { status: 500 }
        );
    }
}
