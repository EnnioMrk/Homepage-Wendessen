import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface DatabaseEvent {
    id: number;
    title: string;
    description?: string;
    start_date: string;
    end_date: string;
    location?: string;
    category:
        | 'meeting'
        | 'event'
        | 'sports'
        | 'culture'
        | 'emergency'
        | 'other';
    organizer?: string;
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
        | 'meeting'
        | 'event'
        | 'sports'
        | 'culture'
        | 'emergency'
        | 'other';
    organizer?: string;
}

// Convert database event to calendar event format
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
    };
}

// Get all events
export async function getEvents(): Promise<CalendarEvent[]> {
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

// Get events within a date range
export async function getEventsByDateRange(
    startDate: Date,
    endDate: Date
): Promise<CalendarEvent[]> {
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

// Get upcoming events (next N events)
export async function getUpcomingEvents(
    limit: number = 10
): Promise<CalendarEvent[]> {
    try {
        const now = new Date().toISOString();
        const events = await sql`
      SELECT * FROM events 
      WHERE start_date >= ${now}
      ORDER BY start_date ASC
      LIMIT ${limit}
    `;

        return events.map(convertToCalendarEvent);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        throw new Error('Failed to fetch upcoming events from database');
    }
}

// Get events by category
export async function getEventsByCategory(
    category: string
): Promise<CalendarEvent[]> {
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

// Create a new event
export async function createEvent(
    event: Omit<CalendarEvent, 'id'>
): Promise<CalendarEvent> {
    try {
        const result = await sql`
      INSERT INTO events (title, description, start_date, end_date, location, category, organizer)
      VALUES (
        ${event.title}, 
        ${event.description || null}, 
        ${event.start.toISOString()}, 
        ${event.end.toISOString()}, 
        ${event.location || null}, 
        ${event.category}, 
        ${event.organizer || null}
      )
      RETURNING *
    `;

        return convertToCalendarEvent(result[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Failed to create event in database');
    }
}

// Update an event
export async function updateEvent(
    id: string,
    event: Partial<Omit<CalendarEvent, 'id'>>
): Promise<CalendarEvent> {
    try {
        const updateFields: string[] = [];
        const updateValues: (string | null)[] = [];
        let paramCount = 1;

        if (event.title !== undefined) {
            updateFields.push(`title = $${paramCount++}`);
            updateValues.push(event.title);
        }
        if (event.description !== undefined) {
            updateFields.push(`description = $${paramCount++}`);
            updateValues.push(event.description || null);
        }
        if (event.start !== undefined) {
            updateFields.push(`start_date = $${paramCount++}`);
            updateValues.push(event.start.toISOString());
        }
        if (event.end !== undefined) {
            updateFields.push(`end_date = $${paramCount++}`);
            updateValues.push(event.end.toISOString());
        }
        if (event.location !== undefined) {
            updateFields.push(`location = $${paramCount++}`);
            updateValues.push(event.location || null);
        }
        if (event.category !== undefined) {
            updateFields.push(`category = $${paramCount++}`);
            updateValues.push(event.category);
        }
        if (event.organizer !== undefined) {
            updateFields.push(`organizer = $${paramCount++}`);
            updateValues.push(event.organizer || null);
        }

        updateFields.push(`updated_at = $${paramCount++}`);
        updateValues.push(new Date().toISOString());

        const result = await sql`
      UPDATE events 
      SET ${sql.unsafe(updateFields.join(', '))}
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

// Delete an event
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

// Get event by ID
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
