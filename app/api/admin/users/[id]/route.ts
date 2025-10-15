import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { deleteAdminUser } from '@/lib/database';

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await requirePermission('users.delete');

        const { id } = await context.params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: 'Invalid user ID' },
                { status: 400 }
            );
        }

        await deleteAdminUser(userId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting admin user:', error);
        
        if (error instanceof Error && error.message === 'Cannot delete the last admin user') {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }
        
        return NextResponse.json(
            { error: 'Failed to delete admin user' },
            { status: 500 }
        );
    }
}
