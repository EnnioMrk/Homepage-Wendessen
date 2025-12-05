import { NextResponse } from 'next/server';
import { clearSession, getCurrentAdminUser } from '@/lib/auth';
import { logAdminAction } from '@/lib/admin-log';

export async function POST() {
    try {
        // Get user before clearing session
        const currentUser = await getCurrentAdminUser();

        // Log the logout before clearing session
        if (currentUser) {
            logAdminAction({
                userId: currentUser.id,
                username: currentUser.username,
                action: 'auth.logout',
                resourceType: 'auth',
            });
        }

        await clearSession();

        return NextResponse.json(
            { success: true, message: 'Logout successful' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
