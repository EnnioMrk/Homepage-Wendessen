import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getCurrentAdminUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // Combine role default permissions with custom permissions
        // Custom permissions override/extend role permissions
        const rolePermissions = user.roleDefaultPermissions || [];
        const customPermissions = user.customPermissions || [];

        // Merge permissions: role permissions + custom permissions (deduplicated)
        const allPermissions = [
            ...new Set([...rolePermissions, ...customPermissions]),
        ];

        return NextResponse.json({
            user: {
                id: user.id,
                username: user.username,
                roleName: user.roleName,
                roleDisplayName: user.roleDisplayName,
                customPermissions: allPermissions,
                vereinId: user.vereinId || null,
            },
        });
    } catch (error) {
        console.error('Error fetching current user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user information' },
            { status: 500 }
        );
    }
}
