import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSession } from '@/lib/auth';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        const user = await verifyCredentials(username, password);

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        // Create session
        await createSession(user);

        // Log the login
        const { ipAddress, userAgent } = getRequestInfo(request);
        logAdminAction({
            userId: user.id,
            username: user.username,
            action: 'auth.login',
            resourceType: 'auth',
            ipAddress,
            userAgent,
        });

        return NextResponse.json({
            success: true,
            message: 'Login successful',
            mustChangePassword: user.mustChangePassword,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
