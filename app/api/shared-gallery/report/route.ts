import { NextResponse } from 'next/server';
import { createGalleryReport } from '@/lib/database';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { submissionId, reason, reporterInfo } = body;

        if (!submissionId || !reason) {
            return NextResponse.json(
                { error: 'Submission ID and reason are required' },
                { status: 400 }
            );
        }

        const report = await createGalleryReport(submissionId, reason, reporterInfo);

        return NextResponse.json({ success: true, report });
    } catch (error) {
        console.error('Error submitting report:', error);
        return NextResponse.json(
            { error: 'Failed to submit report' },
            { status: 500 }
        );
    }
}
