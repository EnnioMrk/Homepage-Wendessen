import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'admin-session';

export interface SessionData {
    userId: number;
    username: string;
    mustChangePassword: boolean;
    roleId?: number;
    roleName?: string;
    vereinId?: string;
    timestamp: number;
}

function decodeSessionToken(token: string): SessionData | null {
    try {
        const decoded = Buffer.from(token, 'base64').toString();
        return JSON.parse(decoded) as SessionData;
    } catch {
        return null;
    }
}

// Middleware helper for protecting admin routes (Edge-compatible)
export function requireAuth(request: NextRequest): NextResponse | null {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionToken?.value) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const sessionData = decodeSessionToken(sessionToken.value);

    if (!sessionData) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if token is expired (7 days)
    const tokenAge = Date.now() - sessionData.timestamp;
    if (tokenAge >= 7 * 24 * 60 * 60 * 1000) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if user must change password (but allow access to change-password page)
    if (
        sessionData.mustChangePassword &&
        !request.nextUrl.pathname.startsWith('/admin/change-password')
    ) {
        return NextResponse.redirect(
            new URL('/admin/change-password', request.url)
        );
    }

    return null; // User is authenticated
}
