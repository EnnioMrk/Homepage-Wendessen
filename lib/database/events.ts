import { sql } from '../sql';
import { cacheTag } from 'next/cache';

export interface DatabaseEvent {
    id: number;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    location?: string;
    category:
        | 'sitzung'
        | 'veranstaltung'
        | 'sport'
        | 'kultur'
        | 'notfall'
        | 'sonstiges';
    organizer?: string;
    image_url?: string;
    is_cancelled?: boolean;
    cancelled_at?: string;
    cancelled_by?: string;
    created_at: string;
    updated_at: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
    category:
        | 'sitzung'
        | 'veranstaltung'
        | 'sport'
        | 'kultur'
        | 'notfall'
        | 'sonstiges';
    organizer?: string;
    imageUrl?: string;
    isCancelled?: boolean;
    cancelledAt?: Date;
    cancelledBy?: string;
    vereinId?: string;
}

function convertToCalendarEvent(
    dbEvent: Record<string, unknown>
): CalendarEvent {
    return {
        id: String(dbEvent.id),
        title: String(dbEvent.title),
        start: new Date(String(dbEvent.start_date)),
        end: new Date(String(dbEvent.end_date)),
        description: dbEvent.description
            ? String(dbEvent.description)
            : undefined,
        location: dbEvent.location ? String(dbEvent.location) : undefined,
        category: String(dbEvent.category) as CalendarEvent['category'],
        organizer: dbEvent.organizer ? String(dbEvent.organizer) : undefined,
        imageUrl: dbEvent.image_url ? String(dbEvent.image_url) : undefined,
        isCancelled: dbEvent.is_cancelled
            ? Boolean(dbEvent.is_cancelled)
            : undefined,
        cancelledAt: dbEvent.cancelled_at
            ? new Date(String(dbEvent.cancelled_at))
            : undefined,
        cancelledBy: dbEvent.cancelled_by
            ? String(dbEvent.cancelled_by)
            : undefined,
        vereinId: dbEvent.verein_id ? String(dbEvent.verein_id) : undefined,
    };
}

export async function getEvents(): Promise<CalendarEvent[]> {
    'use cache';
    cacheTag('events');
    try {
        const events = await sql`
          SELECT * FROM events 
          ORDER BY start_date ASC
        `;

        return events.map(convertToCalendarEvent);
    } catch (error) {
        console.error('Error fetching events:', error);
        throw new Error('Failed to fetch events from database');
    }
}

export async function getEventsByDateRange(
    startDate: Date,
    endDate: Date
): Promise<CalendarEvent[]> {
    'use cache';
    cacheTag('events');
    try {
        const events = await sql`
      SELECT * FROM events 
      WHERE start_date >= ${startDate.toISOString()} 
        AND start_date <= ${endDate.toISOString()}
      ORDER BY start_date ASC
    `;

        return events.map(convertToCalendarEvent);
    } catch (error) {
        console.error('Error fetching events by date range:', error);
        throw new Error('Failed to fetch events from database');
    }
}

export async function getUpcomingEvents(
    limit: number = 10
): Promise<CalendarEvent[]> {
    'use cache';
    cacheTag('events', `limit-${limit}`);
    try {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const events = await sql`
          SELECT * FROM events 
          WHERE start_date >= ${now.toISOString()}
          ORDER BY start_date ASC
          LIMIT ${limit}
        `;

        return events.map(convertToCalendarEvent);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        throw new Error('Failed to fetch upcoming events from database');
    }
}

export async function getEventsByCategory(
    category: string
): Promise<CalendarEvent[]> {
    'use cache';
    cacheTag('events', `category-${category}`);
    try {
        const events = await sql`
      SELECT * FROM events 
      WHERE category = ${category}
      ORDER BY start_date ASC
    `;

        return events.map(convertToCalendarEvent);
    } catch (error) {
        console.error('Error fetching events by category:', error);
        throw new Error('Failed to fetch events by category from database');
    }
}

export async function createEvent(
    event: Omit<CalendarEvent, 'id'>
): Promise<CalendarEvent> {
    try {
        const result = await sql`
      INSERT INTO events (title, description, start_date, end_date, location, category, organizer, image_url, verein_id)
      VALUES (
        ${event.title}, 
        ${event.description || null}, 
        ${event.start.toISOString()}, 
        ${event.end.toISOString()}, 
        ${event.location || null}, 
        ${event.category}, 
        ${event.organizer || null},
        ${event.imageUrl || null},
        ${event.vereinId || null}
      )
      RETURNING *
    `;

        return convertToCalendarEvent(result[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Failed to create event in database');
    }
}

export async function updateEvent(
    id: string,
    event: Partial<Omit<CalendarEvent, 'id'>>
): Promise<CalendarEvent> {
    try {
        const existing = await sql`SELECT * FROM events WHERE id = ${id}`;
        if (existing.length === 0) {
            throw new Error('Event not found');
        }

        const existingEvent = existing[0];

        const title =
            event.title !== undefined ? event.title : existingEvent.title;
        const description =
            event.description !== undefined
                ? event.description || null
                : existingEvent.description;
        const startDate =
            event.start !== undefined
                ? event.start.toISOString()
                : existingEvent.start_date;
        const endDate =
            event.end !== undefined
                ? event.end.toISOString()
                : existingEvent.end_date;
        const location =
            event.location !== undefined
                ? event.location || null
                : existingEvent.location;
        const category =
            event.category !== undefined
                ? event.category
                : existingEvent.category;
        const organizer =
            event.organizer !== undefined
                ? event.organizer || null
                : existingEvent.organizer;
        const imageUrl =
            event.imageUrl !== undefined
                ? event.imageUrl || null
                : existingEvent.image_url;
        const vereinId =
            event.vereinId !== undefined
                ? event.vereinId || null
                : existingEvent.verein_id;

        const result = await sql`
            UPDATE events 
            SET 
                title = ${title},
                description = ${description},
                start_date = ${startDate},
                end_date = ${endDate},
                location = ${location},
                category = ${category},
                organizer = ${organizer},
                image_url = ${imageUrl},
                verein_id = ${vereinId},
                updated_at = ${new Date().toISOString()}
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Event not found');
        }

        return convertToCalendarEvent(result[0]);
    } catch (error) {
        console.error('Error updating event:', error);
        throw new Error('Failed to update event in database');
    }
}

export async function deleteEvent(id: string): Promise<boolean> {
    try {
        await sql`
      DELETE FROM events 
      WHERE id = ${id}
    `;

        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw new Error('Failed to delete event from database');
    }
}

export async function cancelEvent(
    id: string,
    cancelledBy: string
): Promise<CalendarEvent> {
    try {
        const now = new Date().toISOString();

        const result = await sql`
            UPDATE events 
            SET 
                is_cancelled = TRUE,
                cancelled_at = ${now},
                cancelled_by = ${cancelledBy},
                updated_at = ${now}
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Event not found');
        }

        return convertToCalendarEvent(result[0]);
    } catch (error: unknown) {
        console.error('Error cancelling event in database:', error);
        throw error;
    }
}

export async function uncancelEvent(id: string): Promise<CalendarEvent> {
    try {
        const result = await sql`
            UPDATE events 
            SET 
                is_cancelled = FALSE,
                cancelled_at = NULL,
                cancelled_by = NULL,
                updated_at = ${new Date().toISOString()}
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Event not found');
        }

        return convertToCalendarEvent(result[0]);
    } catch (error) {
        console.error('Error uncancelling event:', error);
        throw new Error('Failed to uncancel event in database');
    }
}

export async function getEventById(id: string): Promise<CalendarEvent | null> {
    try {
        const result = await sql`
      SELECT * FROM events 
      WHERE id = ${id}
    `;

        if (result.length === 0) {
            return null;
        }

        return convertToCalendarEvent(result[0]);
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        throw new Error('Failed to fetch event by ID from database');
    }
}
