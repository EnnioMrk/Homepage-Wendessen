import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middlewareAuth';
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/session-utils';

const PUBLIC_ADMIN_API = [
    '/api/admin/login',
    '/api/admin/logout',
    '/api/admin/me',
];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // The admin API answers 401 itself, but only after a route handler runs.
    // Reject an unauthenticated call here so it never reaches the handler and
    // never surfaces as a 500 from a thrown permission check.
    if (pathname.startsWith('/api/admin')) {
        const isPublic = PUBLIC_ADMIN_API.some(
            (allowed) =>
                pathname === allowed || pathname.startsWith(`${allowed}/`),
        );
        if (!isPublic) {
            const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
            const session = token ? await verifySession(token) : null;
            if (!session) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 },
                );
            }
        }
        return NextResponse.next();
    }

    // Protect admin pages except login and change-password
    if (
        pathname.startsWith('/admin') &&
        !pathname.startsWith('/admin/login') &&
        !pathname.startsWith('/admin/change-password')
    ) {
        const authResult = await requireAuth(request);
        if (authResult) {
            return authResult;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
