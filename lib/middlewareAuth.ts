import { NextRequest, NextResponse } from 'next/server';
import { verifySession, SESSION_COOKIE_NAME } from './session-utils';

// Middleware helper for protecting admin routes. This function is intentionally
// small and edge-runtime safe so it can be imported from `middleware.ts`.
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionToken?.value) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const sessionData = await verifySession(sessionToken.value);
    if (!sessionData) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if token is expired (7 days)
    const tokenAge = Date.now() - sessionData.timestamp;
    if (tokenAge >= 7 * 24 * 60 * 60 * 1000) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If the user must change password, redirect (except for change-password path)
    if (sessionData.mustChangePassword && !request.nextUrl.pathname.startsWith('/admin/change-password')) {
        return NextResponse.redirect(new URL('/admin/change-password', request.url));
    }

    return null;
}
