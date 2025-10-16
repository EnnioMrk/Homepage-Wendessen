import { NextRequest, NextResponse } from 'next/server';
import { getEvents, createEvent, CalendarEvent } from '@/lib/database';
import { requireAnyPermission } from '@/lib/permissions';
import { getCurrentAdminUser } from '@/lib/auth';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET() {
    try {
        const events = await getEvents();
        return NextResponse.json(events, {
            headers: {
                'Cache-Control':
                    'public, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
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
        // Check permission for creating events
        await requireAnyPermission(['events.create', 'verein.events.create']);

        const eventData = await request.json();

        // Validate required fields
        if (!eventData.title || !eventData.start || !eventData.end) {
            return NextResponse.json(
                { error: 'Title, start, and end are required' },
                { status: 400 }
            );
        }

        // Get current user to set vereinId if they're a vereinsverwalter
        const currentUser = await getCurrentAdminUser();
        const vereinId = currentUser?.vereinId || eventData.vereinId || null;

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
            vereinId: vereinId,
        };

        const createdEvent = await createEvent(newEvent);

        // Revalidate pages that show events
        revalidatePath('/');
        revalidateTag('events');

        return NextResponse.json(createdEvent, { status: 201 });
    } catch (error) {
        console.error('API Error creating event:', error);
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}
