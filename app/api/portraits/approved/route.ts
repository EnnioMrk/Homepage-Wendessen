import { NextResponse } from 'next/server';
import { getApprovedPortraits } from '@/lib/database';

export async function GET() {
    try {
        const approvedPortraits = await getApprovedPortraits();

        // Convert to expected format for public display (remove email field)
        const publicPortraits = approvedPortraits.map((portrait) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {
                email,
                imageData,
                imageMimeType,
                imageFilename,
                ...publicPortrait
            } = portrait;

            // Create data URL from base64
            const imageUrl =
                imageData && imageMimeType
                    ? `data:${imageMimeType};base64,${imageData}`
                    : '';

            return {
                ...publicPortrait,
                imageUrl,
                submittedAt: portrait.submittedAt.toISOString(),
            };
        });

        return NextResponse.json(publicPortraits);
    } catch (error) {
        console.error('Error loading approved portraits:', error);
        return NextResponse.json([], { status: 500 });
    }
}
