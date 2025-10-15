import { NextRequest, NextResponse } from 'next/server';
import { createSharedGallerySubmission } from '@/lib/database';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { submissionGroupId, title, description, submitterName, submitterEmail, imageData, imageMimeType, imageFilename, dateTaken, location } = body;

        if (!submissionGroupId || !title || !imageData || !imageMimeType) {
            return NextResponse.json(
                { error: 'Submission group ID, title, image data, and MIME type are required' },
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

        const submission = await createSharedGallerySubmission({
            submissionGroupId,
            title,
            description,
            submitterName,
            submitterEmail,
            imageData,
            imageMimeType,
            imageFilename,
            dateTaken: dateTaken ? new Date(dateTaken) : undefined,
            location,
        });

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
