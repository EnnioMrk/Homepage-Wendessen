import { NextRequest, NextResponse } from 'next/server';
import { createPortraitSubmission } from '@/lib/database';
import { PORTRAIT_CONFIG } from '@/lib/portrait-config';
import { revalidateTag } from 'next/cache';

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
                { message: `Die Beschreibung muss mindestens ${PORTRAIT_CONFIG.MIN_DESCRIPTION_LENGTH} Zeichen haben.` },
                { status: 400 }
            );
        }

        // Validate file type
        if (!PORTRAIT_CONFIG.ALLOWED_IMAGE_TYPES.includes(image.type as (typeof PORTRAIT_CONFIG.ALLOWED_IMAGE_TYPES)[number])) {
            return NextResponse.json(
                { message: 'Nur Bilddateien sind erlaubt (JPEG, PNG, WebP, GIF).' },
                { status: 400 }
            );
        }

        // Validate file size
        if (image.size > PORTRAIT_CONFIG.MAX_FILE_SIZE) {
            return NextResponse.json(
                { message: `Die Datei ist zu groß. Maximale Größe: ${Math.round(PORTRAIT_CONFIG.MAX_FILE_SIZE / 1024 / 1024)}MB` },
                { status: 400 }
            );
        }

        // Convert image to base64
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString('base64');

        // Save to database with base64 data
        const submission = await createPortraitSubmission(
            name,
            description,
            base64Data,
            image.type,
            image.name,
            email || undefined
        );

        // Revalidate the portraits cache
        revalidateTag('portraits');

        console.log(`New portrait submission from ${name} at ${new Date().toISOString()}`);

        return NextResponse.json(
            { 
                message: 'Portrait erfolgreich eingereicht!',
                submissionId: submission.id 
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