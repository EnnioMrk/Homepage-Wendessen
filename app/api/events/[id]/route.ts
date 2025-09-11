import { NextRequest, NextResponse } from 'next/server';
import {
    getEventById,
    updateEvent,
    deleteEvent,
    CalendarEvent,
} from '@/lib/database';
import { isAuthenticated } from '@/lib/auth';

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
        // Check authentication for updating events
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

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
        // Check authentication for deleting events
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

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
        return NextResponse.json(
            { message: 'Event deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('API Error deleting event:', error);
        return NextResponse.json(
            { error: 'Failed to delete event' },
            { status: 500 }
        );
    }
}
