import { NextRequest, NextResponse } from 'next/server';
import {
    getEventById,
    updateEvent,
    deleteEvent,
    CalendarEvent,
} from '@/lib/database';
import { requirePermission } from '@/lib/permissions';
import { revalidatePath, revalidateTag } from 'next/cache';

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
        // Check permission for updating events
        await requirePermission('events.edit');

        const eventData = await request.json();
        const { id } = await params;

        // Check if event exists
        const existingEvent = await getEventById(id);
        if (!existingEvent) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        // Prepare update data
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

        const updatedEvent = await updateEvent(id, updateData);

        // Revalidate pages that show events
        revalidatePath('/');
        revalidateTag('events');

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
        // Only Administrators (admin role) can delete events permanently
        // Editors and Verein users should use cancel instead
        await requirePermission('events.delete');

        const { id } = await params;

        // Check if event exists
        const existingEvent = await getEventById(id);
        if (!existingEvent) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        await deleteEvent(id);

        // Revalidate pages that show events
        revalidatePath('/');
        revalidateTag('events');

        return NextResponse.json(
            { message: 'Event deleted successfully' },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error('API Error deleting event:', error);
        
        const errorMessage = (error as Error).message || 'Unknown error';
        
        if (errorMessage.includes('Forbidden') || errorMessage.includes('Unauthorized')) {
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
