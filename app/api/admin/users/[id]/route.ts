import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { deleteAdminUser, getAdminUserById } from '@/lib/database';
import { getCurrentAdminUser } from '@/lib/auth';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('users.delete');

        const { id } = await context.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: 'Invalid user ID' },
                { status: 400 }
            );
        }

        // Get user info before deletion for logging
        const userToDelete = await getAdminUserById(userId);

        await deleteAdminUser(userId);

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'user.delete',
            resourceType: 'user',
            resourceId: String(userId),
            resourceTitle: userToDelete?.username,
            details: {
                role:
                    userToDelete?.roleDisplayName ||
                    userToDelete?.roleName ||
                    undefined,
            },
            ...requestInfo,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting admin user:', error);

        if (
            error instanceof Error &&
            error.message === 'Cannot delete the last admin user'
        ) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(
            { error: 'Failed to delete admin user' },
            { status: 500 }
        );
    }
}
