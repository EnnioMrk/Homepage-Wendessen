import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { getAllRoles } from '@/lib/database';

export async function GET() {
    await connection();
    try {
        await requirePermission('users.view');

        const roles = await getAllRoles();
        return NextResponse.json({ roles });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.json(
            { error: 'Failed to fetch roles' },
            { status: 500 },
        );
    }
}
