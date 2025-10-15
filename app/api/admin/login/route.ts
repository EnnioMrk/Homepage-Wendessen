import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSession } from '@/lib/auth';

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
