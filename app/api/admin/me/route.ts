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

        return NextResponse.json({
            user: {
                id: user.id,
                username: user.username,
                roleName: user.roleName,
                roleDisplayName: user.roleDisplayName,
                customPermissions: user.customPermissions || [],
                vereinId: user.vereinId || null,
            },
        });
    } catch (error) {
        console.error('Error fetching current user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user information' },
            { status: 500 },
        );
    }
}
