import { NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { getAllAdminUsers } from '@/lib/database';

export async function GET() {
    try {
        await requirePermission('users.view');

        const users = await getAllAdminUsers();
        return NextResponse.json({ users });
    } catch (error) {
        console.error('Error fetching admin users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch admin users' },
            { status: 500 }
        );
    }
}
