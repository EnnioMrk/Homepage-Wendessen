import { NextResponse } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { getAdminLogs } from '@/lib/admin-log';

export async function GET(request: Request) {
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const currentUser = await getCurrentAdminUser();
        if (!hasPermission(currentUser, 'logs.view')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const userId = searchParams.get('userId')
            ? parseInt(searchParams.get('userId')!)
            : undefined;
        const action = searchParams.get('action') || undefined;
        const resourceType = searchParams.get('resourceType') || undefined;

        const { logs, total } = await getAdminLogs({
            page,
            limit,
            userId,
            action,
            resourceType,
        });

        return NextResponse.json({
            logs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching admin logs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
