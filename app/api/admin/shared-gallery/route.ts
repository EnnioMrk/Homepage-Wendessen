import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import {
    getSharedGallerySubmissionGroups,
    approveSharedGallerySubmission,
    approveAllInGroup,
    rejectSharedGallerySubmission,
    rejectAllInGroup,
    resetSharedGallerySubmissionToPending,
    resetAllInGroupToPending,
    deleteSharedGallerySubmission,
} from '@/lib/database';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as 'pending' | 'approved' | 'rejected' | null;

        const submissionGroups = await getSharedGallerySubmissionGroups(status || undefined);

        return NextResponse.json({ submissionGroups });
    } catch (error) {
        console.error('Error fetching shared gallery submission groups:', error);
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

        if (action === 'approve-all' && submissionGroupId) {
            const count = await approveAllInGroup(submissionGroupId, 'Admin');
            revalidateTag('shared-gallery');
            return NextResponse.json({ message: `${count} images approved`, count });
        } else if (action === 'reject-all' && submissionGroupId) {
            const count = await rejectAllInGroup(submissionGroupId, 'Admin', reason);
            revalidateTag('shared-gallery');
            return NextResponse.json({ message: `${count} images rejected`, count });
        } else if (action === 'reset-all' && submissionGroupId) {
            const count = await resetAllInGroupToPending(submissionGroupId);
            revalidateTag('shared-gallery');
            return NextResponse.json({ message: `${count} images reset to pending`, count });
        } else if (action === 'approve-selected' && imageIds && Array.isArray(imageIds)) {
            for (const imageId of imageIds) {
                await approveSharedGallerySubmission(imageId, 'Admin');
            }
            revalidateTag('shared-gallery');
            return NextResponse.json({ message: `${imageIds.length} images approved` });
        } else if (action === 'reject-selected' && imageIds && Array.isArray(imageIds)) {
            for (const imageId of imageIds) {
                await rejectSharedGallerySubmission(imageId, 'Admin', reason);
            }
            revalidateTag('shared-gallery');
            return NextResponse.json({ message: `${imageIds.length} images rejected` });
        } else if (action === 'reset-selected' && imageIds && Array.isArray(imageIds)) {
            for (const imageId of imageIds) {
                await resetSharedGallerySubmissionToPending(imageId);
            }
            revalidateTag('shared-gallery');
            return NextResponse.json({ message: `${imageIds.length} images reset to pending` });
        } else if (action === 'approve' && id) {
            const submission = await approveSharedGallerySubmission(id, 'Admin');
            revalidateTag('shared-gallery');
            return NextResponse.json({ message: 'Image approved', submission });
        } else if (action === 'reject' && id) {
            const submission = await rejectSharedGallerySubmission(id, 'Admin', reason);
            revalidateTag('shared-gallery');
            return NextResponse.json({ message: 'Image rejected', submission });
        } else if (action === 'delete' && id) {
            await deleteSharedGallerySubmission(id);
            revalidateTag('shared-gallery');
            return NextResponse.json({ message: 'Submission deleted' });
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
