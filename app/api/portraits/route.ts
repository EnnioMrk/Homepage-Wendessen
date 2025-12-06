import { NextRequest, NextResponse } from 'next/server';
import { createPortraitSubmission } from '@/lib/database';
import { PORTRAIT_CONFIG } from '@/lib/portrait-config';
import { revalidateTag } from 'next/cache';
import { convertFileToWebP } from '@/lib/image-utils';
import { uploadToBlob } from '@/lib/blob-utils';
import { notifyNewPortrait } from '@/lib/push-notifications';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const image = formData.get('image') as File;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const email = formData.get('email') as string;

        // Validate required fields
        if (!image || !name || !description) {
            return NextResponse.json(
                { message: 'Bild, Name und Beschreibung sind erforderlich.' },
                { status: 400 }
            );
        }

        // Validate description length
        if (description.length < PORTRAIT_CONFIG.MIN_DESCRIPTION_LENGTH) {
            return NextResponse.json(
                {
                    message: `Die Beschreibung muss mindestens ${PORTRAIT_CONFIG.MIN_DESCRIPTION_LENGTH} Zeichen haben.`,
                },
                { status: 400 }
            );
        }

        // Validate file type
        if (
            !PORTRAIT_CONFIG.ALLOWED_IMAGE_TYPES.includes(
                image.type as (typeof PORTRAIT_CONFIG.ALLOWED_IMAGE_TYPES)[number]
            )
        ) {
            return NextResponse.json(
                {
                    message:
                        'Nur Bilddateien sind erlaubt (JPEG, PNG, WebP, GIF).',
                },
                { status: 400 }
            );
        }

        // Validate file size
        if (image.size > PORTRAIT_CONFIG.MAX_FILE_SIZE) {
            return NextResponse.json(
                {
                    message: `Die Datei ist zu groß. Maximale Größe: ${Math.round(
                        PORTRAIT_CONFIG.MAX_FILE_SIZE / 1024 / 1024
                    )}MB`,
                },
                { status: 400 }
            );
        }

        // Convert image to WebP format
        const converted = await convertFileToWebP(image);

        // Upload to MinIO S3 storage (portraits bucket)
        const blob = await uploadToBlob(
            `portraits/${converted.filename}`,
            converted.buffer,
            {
                addRandomSuffix: true,
                contentType: converted.mimeType,
                bucket: 'portraits',
            }
        );

        // Save to database with MinIO URL
        const submission = await createPortraitSubmission(
            name,
            description,
            blob.url,
            blob.pathname,
            converted.mimeType,
            converted.filename,
            email || undefined
        );

        // Revalidate the portraits cache
        revalidateTag('portraits');

        // Send push notification to admins
        notifyNewPortrait(String(submission.id), name).catch((err) =>
            console.error('Failed to send portrait notification:', err)
        );

        console.log(
            `New portrait submission from ${name} at ${new Date().toISOString()}`
        );

        return NextResponse.json(
            {
                message: 'Portrait erfolgreich eingereicht!',
                submissionId: submission.id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing portrait submission:', error);
        return NextResponse.json(
            { message: 'Fehler beim Verarbeiten der Einreichung.' },
            { status: 500 }
        );
    }
}
