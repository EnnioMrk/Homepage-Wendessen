import { NextRequest, NextResponse } from 'next/server';
import { createSharedGallerySubmission } from '@/lib/database';
import { sql } from '@/lib/sql';
import { revalidateTagSafe } from '@/lib/revalidate';
import { uploadToBlob } from '@/lib/utils/blob-utils';
import { convertDataUrlToWebP } from '@/lib/utils/image-utils';
import {
    notifyNewSharedGallery,
    notifySharedGalleryAppended,
} from '@/lib/push-notifications';

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

        // Determine if this submissionGroupId already exists (append vs new)
        const existingCountResult =
            await sql`SELECT COUNT(*) as count FROM shared_gallery_submissions WHERE submission_group_id = ${submissionGroupId}`;
        const existingCount = Number(existingCountResult[0]?.count || 0);

        // If this is the first image for this submission group, require a submitter name
        if (
            existingCount === 0 &&
            (!submitterName || !String(submitterName).trim())
        ) {
            return NextResponse.json(
                { error: 'Submitter name is required for new submissions' },
                { status: 400 }
            );
        }

        // Legacy mapping creation removed: do not create gallery mappings here.

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
        revalidateTagSafe('shared-gallery');

        // Send push notification to admins. If this group already existed, send an "appended" notification,
        // otherwise send the new-submission notification.
        const senderName = submitterName || 'Anonym';
        if (existingCount > 0) {
            notifySharedGalleryAppended(submissionGroupId, senderName, 1).catch(
                (err) =>
                    console.error(
                        'Failed to send shared gallery appended notification:',
                        err
                    )
            );
        } else {
            // First image in this group -> new submission
            notifyNewSharedGallery(submissionGroupId, senderName, 1).catch(
                (err) =>
                    console.error(
                        'Failed to send shared gallery notification:',
                        err
                    )
            );
        }

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
