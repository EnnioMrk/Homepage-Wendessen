import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import {
    updateAdminUserRoleAndPermissions,
    getAdminUserById,
    getRoleById,
} from '@/lib/database';
import { getCurrentAdminUser } from '@/lib/auth';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('users.edit');

        const { id } = await context.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: 'Invalid user ID' },
                { status: 400 }
            );
        }

        const { roleId, customPermissions, vereinId } = await request.json();

        // Get user info before update for logging
        const userBefore = await getAdminUserById(userId);
        const oldPermissions = userBefore?.customPermissions || [];
        const oldRoleId = userBefore?.roleId;
        const oldVereinId = userBefore?.vereinId;

        const updatedUser = await updateAdminUserRoleAndPermissions(
            userId,
            roleId,
            customPermissions,
            vereinId
        );

        // Calculate changes for detailed logging
        const details: Record<string, unknown> = {};

        // Role change
        if (oldRoleId !== roleId) {
            const oldRole = oldRoleId ? await getRoleById(oldRoleId) : null;
            const newRole = roleId ? await getRoleById(roleId) : null;
            details.roleChange = {
                from: oldRole?.displayName || oldRole?.name,
                to: newRole?.displayName || newRole?.name,
            };
        }

        // Verein change
        if (oldVereinId !== vereinId) {
            details.vereinChange = {
                from: oldVereinId,
                to: vereinId,
            };
        }

        // Permission changes
        const newPermissions = customPermissions || [];
        const permissionsAdded = newPermissions.filter(
            (p: string) => !oldPermissions.includes(p)
        );
        const permissionsRemoved = oldPermissions.filter(
            (p: string) => !newPermissions.includes(p)
        );

        if (permissionsAdded.length > 0) {
            details.permissionsAdded = permissionsAdded;
        }
        if (permissionsRemoved.length > 0) {
            details.permissionsRemoved = permissionsRemoved;
        }

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'user.update',
            resourceType: 'user',
            resourceId: String(userId),
            resourceTitle: userBefore?.username,
            details: Object.keys(details).length > 0 ? details : undefined,
            ...requestInfo,
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error('Error updating user role and permissions:', error);
        return NextResponse.json(
            { error: 'Failed to update user role and permissions' },
            { status: 500 }
        );
    }
}
