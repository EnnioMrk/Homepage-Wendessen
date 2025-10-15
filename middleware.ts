import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export function middleware(request: NextRequest) {
    // Protect admin routes except login and change-password
    if (
        request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login') &&
        !request.nextUrl.pathname.startsWith('/admin/change-password')
    ) {
        const authResult = requireAuth(request);
        if (authResult) {
            return authResult;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
