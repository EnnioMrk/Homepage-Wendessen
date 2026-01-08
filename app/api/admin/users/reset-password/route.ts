import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import bcrypt from 'bcryptjs';
import { resetAdminPassword, getAdminUserById } from '@/lib/database/admin';
import { getCurrentAdminUser } from '@/lib/auth';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

// Generate a random 6-digit number
function generateInitialPassword(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
    try {
        await requirePermission('users.edit');

        const { userId } = await request.json();

        if (!userId || typeof userId !== 'number') {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Fetch user to confirm existence and for logging
        const targetUser = await getAdminUserById(userId);
        if (!targetUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Generate initial password
        const initialPassword = generateInitialPassword();
        const hashedPassword = await bcrypt.hash(initialPassword, 10);

        // Update in database
        await resetAdminPassword(userId, hashedPassword);

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);

        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'user.password_reset',
            resourceType: 'user',
            resourceId: String(userId),
            resourceTitle: String(targetUser.username),
            details: {
                reason: 'Admin password reset',
            },
            ...requestInfo,
        });

        return NextResponse.json({
            success: true,
            initialPassword,
            username: targetUser.username,
        });
    } catch (error) {
        console.error('Error resetting admin password:', error);
        return NextResponse.json(
            { error: 'Failed to reset admin password' },
            { status: 500 }
        );
    }
}
