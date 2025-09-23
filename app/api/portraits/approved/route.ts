import { NextResponse } from 'next/server';
import { getApprovedPortraits } from '@/lib/database';

export async function GET() {
    try {
        const approvedPortraits = await getApprovedPortraits();

        // Convert to expected format for public display (remove email field)
        const publicPortraits = approvedPortraits.map((portrait) => {
            const { imageData, imageMimeType } = portrait;

            // Create data URL from base64
            const imageUrl =
                imageData && imageMimeType
                    ? `data:${imageMimeType};base64,${imageData}`
                    : '';

            // Return only the public fields
            return {
                id: portrait.id,
                name: portrait.name,
                description: portrait.description,
                status: portrait.status,
                submittedAt: portrait.submittedAt.toISOString(),
                imageUrl,
            };
        });

        return NextResponse.json(publicPortraits);
    } catch (error) {
        console.error('Error loading approved portraits:', error);
        return NextResponse.json([], { status: 500 });
    }
}
