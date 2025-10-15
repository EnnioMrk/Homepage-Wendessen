import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getGalleryReports, updateGalleryReportStatus } from '@/lib/database';
import { revalidateTag } from 'next/cache';

export async function GET(request: Request) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as 'pending' | 'reviewed' | 'dismissed' | null;

        const reports = await getGalleryReports(status || undefined);

        return NextResponse.json({ reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reports' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { reportId, status } = body;

        if (!reportId || !status) {
            return NextResponse.json(
                { error: 'Report ID and status are required' },
                { status: 400 }
            );
        }

        if (status !== 'reviewed' && status !== 'dismissed') {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const report = await updateGalleryReportStatus(reportId, status, 'admin');
        
        // Revalidate the reports cache
        revalidateTag('gallery-reports');

        return NextResponse.json({ success: true, report });
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json(
            { error: 'Failed to update report' },
            { status: 500 }
        );
    }
}
