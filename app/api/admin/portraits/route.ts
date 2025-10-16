import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import {
    getPortraitSubmissions,
    updatePortraitStatus,
    deletePortraitSubmission,
    cleanupOldRejectedPortraits,
} from '@/lib/database';
import { PORTRAIT_CONFIG } from '@/lib/portrait-config';
import { revalidateTag } from 'next/cache';

// GET - Load all submissions
export async function GET() {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await getCurrentAdminUser();
        if (!hasPermission(user, 'portraits.view')) {
            return NextResponse.json(
                { message: 'Keine Berechtigung' },
                { status: 403 }
            );
        }

        const submissions = await getPortraitSubmissions();

        // Convert dates to ISO strings for JSON serialization
        const serializedSubmissions = submissions.map((submission) => ({
            ...submission,
            submittedAt: submission.submittedAt.toISOString(),
            reviewedAt: submission.reviewedAt?.toISOString(),
        }));

        return NextResponse.json(serializedSubmissions);
    } catch (error) {
        console.error('Error loading portrait submissions:', error);
        return NextResponse.json(
            { message: 'Fehler beim Laden der Portrait-Einreichungen' },
            { status: 500 }
        );
    }
}

// PATCH - Approve or reject submission
export async function PATCH(request: NextRequest) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await getCurrentAdminUser();
        if (!hasPermission(user, 'portraits.edit')) {
            return NextResponse.json(
                { message: 'Keine Berechtigung' },
                { status: 403 }
            );
        }

        const { id, action } = await request.json();

        if (!id || !action) {
            return NextResponse.json(
                { message: 'ID und Aktion sind erforderlich' },
                { status: 400 }
            );
        }

        if (!['approve', 'reject', 'reset'].includes(action)) {
            return NextResponse.json(
                { message: 'Ungültige Aktion' },
                { status: 400 }
            );
        }

        const status = action === 'approve' ? 'approved' : action === 'reset' ? 'pending' : 'rejected';
        const submission = await updatePortraitStatus(id, status, 'admin');

        // If rejecting, trigger cleanup of old rejected portraits
        if (action === 'reject') {
            try {
                const cleanedUp = await cleanupOldRejectedPortraits(
                    PORTRAIT_CONFIG.MAX_REJECTED_PORTRAITS
                );
                if (cleanedUp > 0) {
                    console.log(
                        `Cleaned up ${cleanedUp} old rejected portraits after rejecting submission ${id}`
                    );
                }
            } catch (cleanupError) {
                console.error(
                    'Error during rejected portraits cleanup:',
                    cleanupError
                );
                // Don't fail the rejection if cleanup fails
            }
        }

        // Revalidate the portraits cache
        revalidateTag('portraits');

        const actionText = action === 'approve' ? 'approved' : action === 'reset' ? 'reset to pending' : 'rejected';
        const messageText = action === 'approve' ? 'freigegeben' : action === 'reset' ? 'zurückgesetzt' : 'abgelehnt';

        console.log(
            `Portrait submission ${id} ${actionText} by admin`
        );

        return NextResponse.json({
            message: `Einreichung erfolgreich ${messageText}`,
            submission: {
                ...submission,
                submittedAt: submission.submittedAt.toISOString(),
                reviewedAt: submission.reviewedAt?.toISOString(),
            },
        });
    } catch (error) {
        console.error('Error updating submission status:', error);
        return NextResponse.json(
            { message: 'Fehler beim Aktualisieren der Einreichung' },
            { status: 500 }
        );
    }
}

// DELETE - Delete submission
export async function DELETE(request: NextRequest) {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await getCurrentAdminUser();
        if (!hasPermission(user, 'portraits.delete')) {
            return NextResponse.json(
                { message: 'Keine Berechtigung' },
                { status: 403 }
            );
        }

        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { message: 'ID ist erforderlich' },
                { status: 400 }
            );
        }

        // Delete from database (no file deletion needed since we store base64)
        await deletePortraitSubmission(id);

        // Revalidate the portraits cache
        revalidateTag('portraits');

        console.log(`Portrait submission ${id} deleted by admin`);

        return NextResponse.json({
            message: 'Einreichung erfolgreich gelöscht',
        });
    } catch (error) {
        console.error('Error deleting submission:', error);
        return NextResponse.json(
            { message: 'Fehler beim Löschen der Einreichung' },
            { status: 500 }
        );
    }
}
