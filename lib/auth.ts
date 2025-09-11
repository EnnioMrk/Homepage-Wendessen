import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Admin password - in production, this should be from environment variables
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_COOKIE_NAME = 'admin-session';

// Simple session token generation
function generateSessionToken(): string {
    return Buffer.from(
        `${Date.now()}-${Math.random().toString(36).substring(2)}`
    ).toString('base64');
}

// Verify password
export function verifyPassword(password: string): boolean {
    return password === ADMIN_PASSWORD;
}

// Create session
export async function createSession(): Promise<string> {
    const token = generateSessionToken();
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    return token;
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionToken?.value) {
        return false;
    }

    // In a real app, you'd validate the token against a database
    // For simplicity, we're just checking if the cookie exists and is not expired
    try {
        const decoded = Buffer.from(sessionToken.value, 'base64').toString();
        const [timestamp] = decoded.split('-');
        const tokenAge = Date.now() - parseInt(timestamp);

        // Token is valid for 7 days
        return tokenAge < 7 * 24 * 60 * 60 * 1000;
    } catch {
        return false;
    }
}

// Clear session
export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

// Middleware helper for protecting admin routes
export function requireAuth(request: NextRequest): NextResponse | null {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionToken?.value) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
        const decoded = Buffer.from(sessionToken.value, 'base64').toString();
        const [timestamp] = decoded.split('-');
        const tokenAge = Date.now() - parseInt(timestamp);

        // Token is valid for 7 days
        if (tokenAge >= 7 * 24 * 60 * 60 * 1000) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    } catch {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return null; // User is authenticated
}
