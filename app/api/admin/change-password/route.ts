import { NextRequest, NextResponse } from 'next/server';
import {
    getSessionData,
    changePassword,
    validatePasswordStrength,
    createSession,
    getAdminUserByUsername,
} from '@/lib/auth';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

export async function POST(request: NextRequest) {
    try {
        const sessionData = await getSessionData();

        if (!sessionData) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { newPassword } = await request.json();

        if (!newPassword || typeof newPassword !== 'string') {
            return NextResponse.json(
                { error: 'New password is required' },
                { status: 400 }
            );
        }

        // Validate password strength
        const validation = validatePasswordStrength(newPassword);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.message },
                { status: 400 }
            );
        }

        // Change the password
        const success = await changePassword(sessionData.userId, newPassword);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to change password' },
                { status: 500 }
            );
        }

        // Create a new session with updated mustChangePassword flag
        const user = await getAdminUserByUsername(sessionData.username);
        if (user) {
            await createSession(user);
        }

        // Log the action
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: sessionData.userId,
            username: sessionData.username,
            action: 'auth.password_change',
            resourceType: 'auth',
            ...requestInfo,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error changing password:', error);
        return NextResponse.json(
            { error: 'Failed to change password' },
            { status: 500 }
        );
    }
}
