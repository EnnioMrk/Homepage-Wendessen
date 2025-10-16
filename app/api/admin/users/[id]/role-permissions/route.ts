import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, getRoleDefaultPermissions } from '@/lib/permissions';
import { getAdminUserById } from '@/lib/database';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requirePermission('users.view');

        const userId = parseInt(params.id);
        if (isNaN(userId)) {
            return NextResponse.json(
                { error: 'Invalid user ID' },
                { status: 400 }
            );
        }

        const user = await getAdminUserById(userId);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get role default permissions (used to highlight in UI)
        const rolePermissions = getRoleDefaultPermissions(user.roleName || '');

        return NextResponse.json({
            rolePermissions,
            roleName: user.roleName,
            roleDisplayName: user.roleDisplayName,
        });
    } catch (error) {
        console.error('Error fetching role permissions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch role permissions' },
            { status: 500 }
        );
    }
}
