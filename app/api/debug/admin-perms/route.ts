import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getCurrentAdminUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 },
            );
        }

        // Return a small, safe snapshot of the admin user for debugging
        return NextResponse.json({
            user: {
                id: user.id,
                username: user.username,
                roleName: user.roleName || null,
                customPermissions: user.customPermissions || [],
                vereinId: user.vereinId || null,
            },
        });
    } catch (error) {
        console.error('Error in debug admin-perms route:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user information' },
            { status: 500 },
        );
    }
}
