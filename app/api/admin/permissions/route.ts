import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { getPermissionsByCategory } from '@/lib/database';

export async function GET() {
    try {
        await requirePermission('users.view');

        const permissions = await getPermissionsByCategory();
        return NextResponse.json({ permissions });
    } catch (error) {
        console.error('Error fetching permissions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch permissions' },
            { status: 500 }
        );
    }
}
