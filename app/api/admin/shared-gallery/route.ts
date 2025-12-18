import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import {
    getSharedGallerySubmissionGroups,
    approveSharedGallerySubmission,
    approveAllInGroup,
    rejectSharedGallerySubmission,
    rejectAllInGroup,
    resetSharedGallerySubmissionToPending,
    resetAllInGroupToPending,
    deleteSharedGallerySubmission,
    deleteSharedGallerySubmissionGroup,
    getSubmissionsInGroup,
    getSharedGallerySubmissionById,
} from '@/lib/database';
import { revalidateTagSafe } from '@/lib/revalidate';
import { deleteFromBlob } from '@/lib/utils/blob-utils';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

// Helper function to notify WebSocket server
async function notifyClients() {
    try {
        // Non-blocking call
        fetch('http://localhost:8081/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'refresh' }),
        }).catch((err) => console.error('WS notify error:', err));
    } catch (error) {
        console.error('Error notifying WebSocket server:', error);
    }
}

export async function GET(request: NextRequest) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as
            | 'pending'
            | 'approved'
            | 'rejected'
            | null;
        const limit = searchParams.get('limit')
            ? parseInt(searchParams.get('limit')!, 10)
            : 25;
        const offset = searchParams.get('offset')
            ? parseInt(searchParams.get('offset')!, 10)
            : 0;

        const { groups: submissionGroups, total } =
            await getSharedGallerySubmissionGroups(
                status || undefined,
                limit,
                offset
            );

        return NextResponse.json({ submissionGroups, total });
    } catch (error) {
        console.error(
            'Error fetching shared gallery submission groups:',
            error
        );
        return NextResponse.json(
            { error: 'Failed to fetch submission groups' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { action, id, submissionGroupId, imageIds, reason } = body;

        if (!action) {
            return NextResponse.json(
                { error: 'Action is required' },
                { status: 400 }
            );
        }

        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);

        if (action === 'approve-all' && submissionGroupId) {
            if (!hasPermission(currentUser, 'shared_gallery.edit')) {
                return NextResponse.json(
                    { error: 'Keine Berechtigung zum Freigeben' },
                    { status: 403 }
                );
            }
            const count = await approveAllInGroup(
                submissionGroupId,
                currentUser?.username || 'Admin'
            );
            revalidateTagSafe('shared-gallery');
            notifyClients();

            logAdminAction({
                userId: currentUser?.id,
                username: currentUser?.username,
                action: 'shared_gallery.approve',
                resourceType: 'shared_gallery',
                resourceId: submissionGroupId,
                details: { count, type: 'approve-all' },
                ...requestInfo,
            });

            return NextResponse.json({
                message: `${count} images approved`,
                count,
            });
        } else if (action === 'reject-all' && submissionGroupId) {
            if (!hasPermission(currentUser, 'shared_gallery.edit')) {
                return NextResponse.json(
                    { error: 'Keine Berechtigung zum Ablehnen' },
                    { status: 403 }
                );
            }
            const count = await rejectAllInGroup(
                submissionGroupId,
                currentUser?.username || 'Admin',
                reason
            );
            revalidateTagSafe('shared-gallery');
            notifyClients();

            logAdminAction({
                userId: currentUser?.id,
                username: currentUser?.username,
                action: 'shared_gallery.reject',
                resourceType: 'shared_gallery',
                resourceId: submissionGroupId,
                details: { count, type: 'reject-all', reason },
                ...requestInfo,
            });

            return NextResponse.json({
                message: `${count} images rejected`,
                count,
            });
        } else if (action === 'reset-all' && submissionGroupId) {
            if (!hasPermission(currentUser, 'shared_gallery.edit')) {
                return NextResponse.json(
                    { error: 'Keine Berechtigung zum Zurücksetzen' },
                    { status: 403 }
                );
            }
            const count = await resetAllInGroupToPending(submissionGroupId);
            revalidateTagSafe('shared-gallery');
            notifyClients();

            logAdminAction({
                userId: currentUser?.id,
                username: currentUser?.username,
                action: 'shared_gallery.approve',
                resourceType: 'shared_gallery',
                resourceId: submissionGroupId,
                details: { count, type: 'reset-all' },
                ...requestInfo,
            });

            return NextResponse.json({
                message: `${count} images reset to pending`,
                count,
            });
        } else if (
            action === 'approve-selected' &&
            imageIds &&
            Array.isArray(imageIds)
        ) {
            if (!hasPermission(currentUser, 'shared_gallery.edit')) {
                return NextResponse.json(
                    { error: 'Keine Berechtigung zum Freigeben' },
                    { status: 403 }
                );
            }
            for (const imageId of imageIds) {
                await approveSharedGallerySubmission(
                    imageId,
                    currentUser?.username || 'Admin'
                );
            }
            revalidateTagSafe('shared-gallery');
            notifyClients();

            logAdminAction({
                userId: currentUser?.id,
                username: currentUser?.username,
                action: 'shared_gallery.approve',
                resourceType: 'shared_gallery',
                details: { count: imageIds.length, type: 'approve-selected' },
                ...requestInfo,
            });

            return NextResponse.json({
                message: `${imageIds.length} images approved`,
            });
        } else if (
            action === 'reject-selected' &&
            imageIds &&
            Array.isArray(imageIds)
        ) {
            if (!hasPermission(currentUser, 'shared_gallery.edit')) {
                return NextResponse.json(
                    { error: 'Keine Berechtigung zum Ablehnen' },
                    { status: 403 }
                );
            }
            for (const imageId of imageIds) {
                await rejectSharedGallerySubmission(
                    imageId,
                    currentUser?.username || 'Admin',
                    reason
                );
            }
            revalidateTagSafe('shared-gallery');
            notifyClients();

            logAdminAction({
                userId: currentUser?.id,
                username: currentUser?.username,
                action: 'shared_gallery.reject',
                resourceType: 'shared_gallery',
                details: {
                    count: imageIds.length,
                    type: 'reject-selected',
                    reason,
                },
                ...requestInfo,
            });

            return NextResponse.json({
                message: `${imageIds.length} images rejected`,
            });
        } else if (
            action === 'reset-selected' &&
            imageIds &&
            Array.isArray(imageIds)
        ) {
            if (!hasPermission(currentUser, 'shared_gallery.edit')) {
                return NextResponse.json(
                    { error: 'Keine Berechtigung zum Zurücksetzen' },
                    { status: 403 }
                );
            }
            for (const imageId of imageIds) {
                await resetSharedGallerySubmissionToPending(imageId);
            }
            revalidateTagSafe('shared-gallery');

            logAdminAction({
                userId: currentUser?.id,
                username: currentUser?.username,
                action: 'shared_gallery.approve',
                resourceType: 'shared_gallery',
                details: { count: imageIds.length, type: 'reset-selected' },
                ...requestInfo,
            });

            return NextResponse.json({
                message: `${imageIds.length} images reset to pending`,
            });
        } else if (action === 'approve' && id) {
            if (!hasPermission(currentUser, 'shared_gallery.edit')) {
                return NextResponse.json(
                    { error: 'Keine Berechtigung zum Freigeben' },
                    { status: 403 }
                );
            }
            const submission = await approveSharedGallerySubmission(
                id,
                currentUser?.username || 'Admin'
            );
            revalidateTagSafe('shared-gallery');

            logAdminAction({
                userId: currentUser?.id,
                username: currentUser?.username,
                action: 'shared_gallery.approve',
                resourceType: 'shared_gallery',
                resourceId: id,
                details: { type: 'approve-single' },
                ...requestInfo,
            });

            return NextResponse.json({ message: 'Image approved', submission });
        } else if (action === 'reject' && id) {
            if (!hasPermission(currentUser, 'shared_gallery.edit')) {
                return NextResponse.json(
                    { error: 'Keine Berechtigung zum Ablehnen' },
                    { status: 403 }
                );
            }
            const submission = await rejectSharedGallerySubmission(
                id,
                currentUser?.username || 'Admin',
                reason
            );
            revalidateTagSafe('shared-gallery');

            logAdminAction({
                userId: currentUser?.id,
                username: currentUser?.username,
                action: 'shared_gallery.reject',
                resourceType: 'shared_gallery',
                resourceId: id,
                details: { type: 'reject-single', reason },
                ...requestInfo,
            });

            return NextResponse.json({ message: 'Image rejected', submission });
        } else if (action === 'delete' && id) {
            if (!hasPermission(currentUser, 'shared_gallery.delete')) {
                return NextResponse.json(
                    { error: 'Keine Berechtigung zum Löschen' },
                    { status: 403 }
                );
            }

            // Get submission info before deleting
            let submitterName: string | undefined;
            try {
                const submission = await getSharedGallerySubmissionById(id);
                submitterName = submission?.submitterName;
                const objectPath =
                    submission?.imageStoragePath || submission?.imageUrl;
                if (objectPath) {
                    await deleteFromBlob(objectPath);
                }
            } catch (blobError) {
                console.warn(
                    'Failed to delete shared gallery image blob:',
                    blobError
                );
            }
            await deleteSharedGallerySubmission(id);
            revalidateTagSafe('shared-gallery');

            logAdminAction({
                userId: currentUser?.id,
                username: currentUser?.username,
                action: 'shared_gallery.delete',
                resourceType: 'shared_gallery',
                resourceId: id,
                resourceTitle: submitterName,
                ...requestInfo,
            });

            return NextResponse.json({ message: 'Submission deleted' });
        } else if (action === 'delete-group' && submissionGroupId) {
            if (!hasPermission(currentUser, 'shared_gallery.delete')) {
                return NextResponse.json(
                    { error: 'Keine Berechtigung zum Löschen' },
                    { status: 403 }
                );
            }

            // Get all submissions in the group to delete blobs
            try {
                const submissions = await getSubmissionsInGroup(
                    submissionGroupId
                );
                for (const sub of submissions) {
                    const objectPath = sub.imageStoragePath || sub.imageUrl;
                    if (objectPath) {
                        await deleteFromBlob(objectPath);
                    }
                }
            } catch (blobError) {
                console.warn(
                    'Failed to delete shared gallery group blobs:',
                    blobError
                );
            }

            await deleteSharedGallerySubmissionGroup(submissionGroupId);
            revalidateTagSafe('shared-gallery');

            logAdminAction({
                userId: currentUser?.id,
                username: currentUser?.username,
                action: 'shared_gallery.delete',
                resourceType: 'shared_gallery',
                resourceId: submissionGroupId,
                details: { type: 'delete-group' },
                ...requestInfo,
            });

            return NextResponse.json({ message: 'Submission group deleted' });
        } else {
            return NextResponse.json(
                { error: 'Invalid action or missing parameters' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error updating shared gallery submission:', error);
        return NextResponse.json(
            { error: 'Failed to update submission' },
            { status: 500 }
        );
    }
}
