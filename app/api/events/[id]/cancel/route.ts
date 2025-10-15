import { NextRequest, NextResponse } from 'next/server';
import { cancelEvent, uncancelEvent, getEventById } from '@/lib/database';
import { requirePermission, requireAnyPermission, hasRole } from '@/lib/permissions';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        console.log('Cancel event request for ID:', id);
        
        // Check if event exists
        const existingEvent = await getEventById(id);
        if (!existingEvent) {
            console.log('Event not found:', id);
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        console.log('Event found, checking permissions...');
        
        // Check permission - editors and Verein users can cancel events
        let user;
        try {
            user = await requireAnyPermission(['events.cancel', 'verein.events.cancel']);
            console.log('User authenticated:', user.username, 'Role:', user.roleName);
        } catch (permError: any) {
            console.error('Permission check failed:', permError.message);
            throw permError;
        }
        
        console.log('User has permission, cancelling event. User:', user.username);

        // Use username, fallback to "admin" if not available
        const cancelledBy = user.username || 'admin';
        console.log('Cancelling with user identifier:', cancelledBy);

        const cancelledEvent = await cancelEvent(id, cancelledBy);
        
        console.log('Event cancelled successfully');

        // Revalidate pages that show events
        revalidatePath('/');
        revalidateTag('events');

        return NextResponse.json({
            message: 'Event cancelled successfully',
            event: cancelledEvent,
        });
    } catch (error: any) {
        console.error('API Error cancelling event:', error);
        console.error('Error stack:', error.stack);
        
        if (error.message?.includes('Forbidden') || error.message?.includes('Unauthorized')) {
            return NextResponse.json(
                { error: error.message },
                { status: error.message.includes('Unauthorized') ? 401 : 403 }
            );
        }
        
        return NextResponse.json(
            { error: `Failed to cancel event: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        // Check if event exists
        const existingEvent = await getEventById(id);
        if (!existingEvent) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        // Only editors with cancel permission can uncancel
        const user = await requireAnyPermission(['events.cancel', 'verein.events.cancel']);

        const uncancelledEvent = await uncancelEvent(id);

        // Revalidate pages that show events
        revalidatePath('/');
        revalidateTag('events');

        return NextResponse.json({
            message: 'Event restored successfully',
            event: uncancelledEvent,
        });
    } catch (error: any) {
        console.error('API Error restoring event:', error);
        
        if (error.message.includes('Forbidden') || error.message.includes('Unauthorized')) {
            return NextResponse.json(
                { error: error.message },
                { status: error.message.includes('Unauthorized') ? 401 : 403 }
            );
        }
        
        return NextResponse.json(
            { error: 'Failed to restore event' },
            { status: 500 }
        );
    }
}
