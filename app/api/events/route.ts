import { NextRequest, NextResponse } from 'next/server';
import { getEvents, createEvent, CalendarEvent } from '@/lib/database';
import { hasPermission } from '@/lib/permissions';
import { getCurrentAdminUser } from '@/lib/auth';
import { revalidatePathSafe, revalidateTagSafe } from '@/lib/revalidate';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

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
        const eventData = await request.json();

        // Create context-aware permission check
        const currentUser = await getCurrentAdminUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const hasGlobalCreate = hasPermission(currentUser, 'events.create');
        const hasVereinCreate = hasPermission(currentUser, 'verein.events.create');

        if (!hasGlobalCreate && !hasVereinCreate) {
            return NextResponse.json(
                { error: 'Forbidden: Missing permission to create events' },
                { status: 403 }
            );
        }

        // Determine Verein ID and enforce validation
        let vereinId: string | undefined = undefined;

        if (hasGlobalCreate) {
            // Global admins can create for any verein (or none)
            vereinId = eventData.vereinId || currentUser.vereinId || undefined;
        } else {
            // Users with Verein permissions
            if (!currentUser.vereinId) {
                // If they have permission but no Verein, they can ONLY create general events (no vereinId)
                if (eventData.vereinId) {
                    return NextResponse.json(
                        { error: 'Forbidden: You are not assigned to a Verein and cannot create events for one.' },
                        { status: 403 }
                    );
                }
                vereinId = undefined;
            } else {
                // Vereinsverwalter MUST have a verein assigned and can only create for it
                // Force the ID to match their own
                vereinId = currentUser.vereinId;

                // Optional: If they tried to send a different ID, we could error, but silently correcting it is also safe/admin-friendly
                if (eventData.vereinId && eventData.vereinId !== vereinId) {
                    return NextResponse.json(
                        { error: 'Forbidden: You can only create events for your own Verein.' },
                        { status: 403 }
                    );
                }
            }
        }

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
            vereinId: vereinId,
        };

        const createdEvent = await createEvent(newEvent);

        // Revalidate pages that show events
        revalidatePathSafe('/');
        revalidateTagSafe('events');

        // Log the action
        const requestInfo = getRequestInfo(request);
        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'event.create',
            resourceType: 'event',
            resourceId: createdEvent.id?.toString(),
            resourceTitle: eventData.title,
            details: {
                category: eventData.category || 'sonstiges',
                location: eventData.location,
                startDate: eventData.start,
            },
            ...requestInfo,
        });

        return NextResponse.json(createdEvent, { status: 201 });
    } catch (error) {
        console.error('API Error creating event:', error);
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}
