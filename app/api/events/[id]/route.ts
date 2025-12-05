import { NextRequest, NextResponse } from 'next/server';
import {
    getEventById,
    updateEvent,
    deleteEvent,
    CalendarEvent,
} from '@/lib/database';
import { requireAnyPermission } from '@/lib/permissions';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const event = await getEventById(id);

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error('API Error fetching event:', error);
        return NextResponse.json(
            { error: 'Failed to fetch event' },
            { status: 500 }
        );
    }
}

export async function PUT(
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

        // Check permission for updating events
        const user = await requireAnyPermission([
            'events.edit',
            'verein.events.edit',
        ]);

        // If user has verein permission, verify they can only edit their own verein's events
        const hasGeneralPermission =
            user.customPermissions?.includes('events.edit') ||
            user.customPermissions?.includes('events.*') ||
            user.customPermissions?.includes('*');
        const hasVereinPermission =
            user.customPermissions?.includes('verein.events.edit') ||
            user.customPermissions?.includes('verein.events.*') ||
            user.customPermissions?.includes('verein.*');

        if (!hasGeneralPermission && hasVereinPermission) {
            // User only has verein permission, check if they can edit this event
            if (
                !user.vereinId ||
                !existingEvent.vereinId ||
                user.vereinId !== existingEvent.vereinId
            ) {
                return NextResponse.json(
                    {
                        error: 'Forbidden: You can only edit events from your own Verein',
                    },
                    { status: 403 }
                );
            }
        }

        const eventData = await request.json();

        // Prepare update data
        // Note: vereinId is intentionally NOT included here - it should never be changed via edit
        const updateData: Partial<Omit<CalendarEvent, 'id'>> = {};

        if (eventData.title !== undefined) updateData.title = eventData.title;
        if (eventData.description !== undefined)
            updateData.description = eventData.description;
        if (eventData.start !== undefined)
            updateData.start = new Date(eventData.start);
        if (eventData.end !== undefined)
            updateData.end = new Date(eventData.end);
        if (eventData.location !== undefined)
            updateData.location = eventData.location;
        if (eventData.category !== undefined)
            updateData.category = eventData.category;
        if (eventData.organizer !== undefined)
            updateData.organizer = eventData.organizer;
        if (eventData.imageUrl !== undefined)
            updateData.imageUrl = eventData.imageUrl;
        // vereinId is explicitly excluded to prevent accidental changes

        const updatedEvent = await updateEvent(id, updateData);

        // Revalidate pages that show events
        revalidatePath('/');
        revalidateTag('events');

        // Log the action
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: user.id,
            username: user.username,
            action: 'event.update',
            resourceType: 'event',
            resourceId: id,
            resourceTitle: eventData.title || existingEvent.title,
            details: {
                category: eventData.category,
                location: eventData.location,
            },
            ...requestInfo,
        });

        return NextResponse.json(updatedEvent);
    } catch (error) {
        console.error('API Error updating event:', error);
        return NextResponse.json(
            { error: 'Failed to update event' },
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

        // Only Administrators (admin role) can delete events permanently
        // Editors and Verein users should use cancel instead
        const user = await requireAnyPermission([
            'events.delete',
            'verein.events.delete',
        ]);

        // If user has verein permission, verify they can only delete their own verein's events
        const hasGeneralPermission =
            user.customPermissions?.includes('events.delete') ||
            user.customPermissions?.includes('events.*') ||
            user.customPermissions?.includes('*');
        const hasVereinPermission =
            user.customPermissions?.includes('verein.events.delete') ||
            user.customPermissions?.includes('verein.events.*') ||
            user.customPermissions?.includes('verein.*');

        if (!hasGeneralPermission && hasVereinPermission) {
            // User only has verein permission, check if they can delete this event
            if (
                !user.vereinId ||
                !existingEvent.vereinId ||
                user.vereinId !== existingEvent.vereinId
            ) {
                return NextResponse.json(
                    {
                        error: 'Forbidden: You can only delete events from your own Verein',
                    },
                    { status: 403 }
                );
            }
        }

        await deleteEvent(id);

        // Revalidate pages that show events
        revalidatePath('/');
        revalidateTag('events');

        // Log the action
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: user.id,
            username: user.username,
            action: 'event.delete',
            resourceType: 'event',
            resourceId: id,
            resourceTitle: existingEvent.title,
            details: {
                category: existingEvent.category,
            },
            ...requestInfo,
        });

        return NextResponse.json(
            { message: 'Event deleted successfully' },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('API Error deleting event:', error);

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
            { error: 'Failed to delete event' },
            { status: 500 }
        );
    }
}
