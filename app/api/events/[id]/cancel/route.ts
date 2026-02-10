import { NextRequest, NextResponse } from 'next/server';
import { cancelEvent, uncancelEvent, getEventById } from '@/lib/database';
import { requireAnyPermission } from '@/lib/permissions';
import { revalidatePathSafe, revalidateTagSafe } from '@/lib/revalidate';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

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
        const user = await requireAnyPermission([
            'events.cancel',
            'verein.events.cancel',
        ]);
        console.log(
            'User authenticated:',
            user.username,
            'Role:',
            user.roleName,
            'VereinId:',
            user.vereinId
        );

        // If user has verein permission, verify they can only cancel their own verein's events
        const hasGeneralPermission =
            user.customPermissions?.includes('events.cancel') ||
            user.customPermissions?.includes('events.*') ||
            user.customPermissions?.includes('*');
        const hasVereinPermission =
            user.customPermissions?.includes('verein.events.cancel') ||
            user.customPermissions?.includes('verein.events.*') ||
            user.customPermissions?.includes('verein.*');

        if (!hasGeneralPermission && hasVereinPermission) {
            // User only has verein permission, check if they can cancel this event
            if (
                !user.vereinId ||
                !existingEvent.vereinId ||
                user.vereinId !== existingEvent.vereinId
            ) {
                console.log(
                    'Verein mismatch - User vereinId:',
                    user.vereinId,
                    'Event vereinId:',
                    existingEvent.vereinId
                );
                return NextResponse.json(
                    {
                        error: 'Forbidden: You can only cancel events from your own Verein',
                    },
                    { status: 403 }
                );
            }
        }

        console.log(
            'User has permission, cancelling event. User:',
            user.username
        );

        // Use username, fallback to "admin" if not available
        const cancelledBy = user.username || 'admin';
        console.log('Cancelling with user identifier:', cancelledBy);

        const cancelledEvent = await cancelEvent(id, cancelledBy);

        console.log('Event cancelled successfully');

        // Revalidate pages that show events
        revalidatePathSafe('/');
        revalidatePathSafe('/was-steht-an');
        revalidateTagSafe('events');

        // Log the action
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: user.id,
            username: user.username,
            action: 'event.cancel',
            resourceType: 'event',
            resourceId: id,
            resourceTitle: existingEvent.title,
            details: {
                category: existingEvent.category,
            },
            ...requestInfo,
        });

        return NextResponse.json({
            message: 'Event cancelled successfully',
            event: cancelledEvent,
        });
    } catch (error: unknown) {
        console.error('API Error cancelling event:', error);
        console.error('Error stack:', (error as Error).stack);

        const errorMessage = (error as Error).message || 'Unknown error';

        if (
            errorMessage.includes('Forbidden') ||
            errorMessage.includes('Unauthorized')
        ) {
            return NextResponse.json(
                { error: errorMessage },
                { status: errorMessage.includes('Unauthorized') ? 401 : 403 }
            );
        }

        return NextResponse.json(
            { error: `Failed to cancel event: ${errorMessage}` },
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
        const user = await requireAnyPermission([
            'events.cancel',
            'verein.events.cancel',
        ]);

        // If user has verein permission, verify they can only restore their own verein's events
        const hasGeneralPermission =
            user.customPermissions?.includes('events.cancel') ||
            user.customPermissions?.includes('events.*') ||
            user.customPermissions?.includes('*');
        const hasVereinPermission =
            user.customPermissions?.includes('verein.events.cancel') ||
            user.customPermissions?.includes('verein.events.*') ||
            user.customPermissions?.includes('verein.*');

        if (!hasGeneralPermission && hasVereinPermission) {
            // User only has verein permission, check if they can restore this event
            if (
                !user.vereinId ||
                !existingEvent.vereinId ||
                user.vereinId !== existingEvent.vereinId
            ) {
                return NextResponse.json(
                    {
                        error: 'Forbidden: You can only restore events from your own Verein',
                    },
                    { status: 403 }
                );
            }
        }

        const uncancelledEvent = await uncancelEvent(id);

        // Revalidate pages that show events
        revalidatePathSafe('/');
        revalidatePathSafe('/was-steht-an');
        revalidateTagSafe('events');

        // Log the action
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: user.id,
            username: user.username,
            action: 'event.uncancel',
            resourceType: 'event',
            resourceId: id,
            resourceTitle: existingEvent.title,
            details: {
                category: existingEvent.category,
            },
            ...requestInfo,
        });

        return NextResponse.json({
            message: 'Event restored successfully',
            event: uncancelledEvent,
        });
    } catch (error: unknown) {
        console.error('API Error restoring event:', error);

        const errorMessage = (error as Error).message || 'Unknown error';

        if (
            errorMessage.includes('Forbidden') ||
            errorMessage.includes('Unauthorized')
        ) {
            return NextResponse.json(
                { error: errorMessage },
                { status: errorMessage.includes('Unauthorized') ? 401 : 403 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to restore event' },
            { status: 500 }
        );
    }
}
