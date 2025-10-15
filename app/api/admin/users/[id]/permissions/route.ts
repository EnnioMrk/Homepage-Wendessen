import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { updateAdminUserRoleAndPermissions } from '@/lib/database';

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

        const { roleId, customPermissions } = await request.json();

        const updatedUser = await updateAdminUserRoleAndPermissions(
            userId,
            roleId,
            customPermissions
        );

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error('Error updating user role and permissions:', error);
        return NextResponse.json(
            { error: 'Failed to update user role and permissions' },
            { status: 500 }
        );
    }
}
