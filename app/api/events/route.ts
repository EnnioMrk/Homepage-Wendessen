import { NextRequest, NextResponse } from 'next/server';
import { getEvents, createEvent, CalendarEvent } from '@/lib/database';
import { isAuthenticated } from '@/lib/auth';

export async function GET() {
    try {
        const events = await getEvents();
        return NextResponse.json(events);
    } catch (error) {
        console.error('API Error fetching events:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Check authentication for creating events
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const eventData = await request.json();

        // Validate required fields
        if (!eventData.title || !eventData.start || !eventData.end) {
            return NextResponse.json(
                { error: 'Title, start, and end are required' },
                { status: 400 }
            );
        }

        // Create the event
        const newEvent: Omit<CalendarEvent, 'id'> = {
            title: eventData.title,
            description: eventData.description || '',
            start: new Date(eventData.start),
            end: new Date(eventData.end),
            location: eventData.location || '',
            category: eventData.category || 'sonstiges',
            organizer: eventData.organizer || '',
            imageUrl: eventData.imageUrl || '',
        };

        const createdEvent = await createEvent(newEvent);
        return NextResponse.json(createdEvent, { status: 201 });
    } catch (error) {
        console.error('API Error creating event:', error);
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}
