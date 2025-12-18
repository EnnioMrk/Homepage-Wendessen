import { NextResponse } from 'next/server';
import { getCurrentAdminUser, isAuthenticated } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { getGalleryReports, updateGalleryReportStatus, deleteGalleryReport } from '@/lib/database';
import { revalidateTagSafe } from '@/lib/revalidate';

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
    const user = await getCurrentAdminUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(user, 'shared_gallery.edit')) {
        return NextResponse.json({ error: 'Keine Berechtigung zum Bearbeiten von Meldungen' }, { status: 403 });
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

        if (status !== 'reviewed' && status !== 'dismissed' && status !== 'pending') {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const report = await updateGalleryReportStatus(reportId, status, user.username || 'Admin');

        // Revalidate the reports cache
        revalidateTagSafe('gallery-reports');

        return NextResponse.json({ success: true, report });
    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json(
            { error: 'Failed to update report' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    const user = await getCurrentAdminUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(user, 'shared_gallery.delete')) {
        return NextResponse.json({ error: 'Keine Berechtigung zum Löschen von Meldungen' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const reportId = searchParams.get('reportId');

        if (!reportId) {
            return NextResponse.json(
                { error: 'Report ID is required' },
                { status: 400 }
            );
        }

        await deleteGalleryReport(reportId);

        // Revalidate the reports cache
        revalidateTagSafe('gallery-reports');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting report:', error);
        return NextResponse.json(
            { error: 'Failed to delete report' },
            { status: 500 }
        );
    }
}
