import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { getAllAdminUsers } from '@/lib/database';
import { apiAuthResponse } from '@/lib/api-error';

export async function GET() {
    await connection();
    try {
        await requirePermission('users.view');

        const users = await getAllAdminUsers();
        return NextResponse.json({ users });
    } catch (error) {
        const authResponse = apiAuthResponse(error);
        if (authResponse) return authResponse;
        console.error('Error fetching admin users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch admin users' },
            { status: 500 },
        );
    }
}
