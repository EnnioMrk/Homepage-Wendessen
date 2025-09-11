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
        | 'sitzung'
        | 'veranstaltung'
        | 'sport'
        | 'kultur'
        | 'notfall'
        | 'sonstiges';
    organizer?: string;
    image_url?: string;
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
}

export interface DatabaseNews {
    id: number;
    title: string;
    content?: string;
    category: string;
    published_date: string;
    created_at: string;
    updated_at: string;
}

export interface NewsItem {
    id: string;
    title: string;
    content?: string;
    category: string;
    publishedDate: Date;
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
        imageUrl: dbEvent.image_url ? String(dbEvent.image_url) : undefined,
    };
}

// Convert database news to news item format
function convertToNewsItem(dbNews: Record<string, unknown>): NewsItem {
    return {
        id: String(dbNews.id),
        title: String(dbNews.title),
        content: dbNews.content ? String(dbNews.content) : undefined,
        category: String(dbNews.category),
        publishedDate: new Date(String(dbNews.published_date)),
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
      INSERT INTO events (title, description, start_date, end_date, location, category, organizer, image_url)
      VALUES (
        ${event.title}, 
        ${event.description || null}, 
        ${event.start.toISOString()}, 
        ${event.end.toISOString()}, 
        ${event.location || null}, 
        ${event.category}, 
        ${event.organizer || null},
        ${event.imageUrl || null}
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
        // For simplicity, let's update all fields (this ensures consistency)
        const result = await sql`
            UPDATE events 
            SET 
                title = ${event.title !== undefined ? event.title : sql`title`},
                description = ${
                    event.description !== undefined
                        ? event.description || null
                        : sql`description`
                },
                start_date = ${
                    event.start !== undefined
                        ? event.start.toISOString()
                        : sql`start_date`
                },
                end_date = ${
                    event.end !== undefined
                        ? event.end.toISOString()
                        : sql`end_date`
                },
                location = ${
                    event.location !== undefined
                        ? event.location || null
                        : sql`location`
                },
                category = ${
                    event.category !== undefined
                        ? event.category
                        : sql`category`
                },
                organizer = ${
                    event.organizer !== undefined
                        ? event.organizer || null
                        : sql`organizer`
                },
                image_url = ${
                    event.imageUrl !== undefined
                        ? event.imageUrl || null
                        : sql`image_url`
                },
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

// News functions

// Get all news
export async function getNews(): Promise<NewsItem[]> {
    try {
        const news = await sql`
      SELECT * FROM news 
      ORDER BY published_date DESC
    `;

        return news.map(convertToNewsItem);
    } catch (error) {
        console.error('Error fetching news:', error);
        throw new Error('Failed to fetch news from database');
    }
}

// Get recent news (limited)
export async function getRecentNews(limit: number = 4): Promise<NewsItem[]> {
    try {
        const news = await sql`
      SELECT * FROM news 
      ORDER BY published_date DESC
      LIMIT ${limit}
    `;

        return news.map(convertToNewsItem);
    } catch (error) {
        console.error('Error fetching recent news:', error);
        throw new Error('Failed to fetch recent news from database');
    }
}

// Get news by category
export async function getNewsByCategory(category: string): Promise<NewsItem[]> {
    try {
        const news = await sql`
      SELECT * FROM news 
      WHERE category = ${category}
      ORDER BY published_date DESC
    `;

        return news.map(convertToNewsItem);
    } catch (error) {
        console.error('Error fetching news by category:', error);
        throw new Error('Failed to fetch news by category from database');
    }
}

// Create a new news item
export async function createNews(
    news: Omit<NewsItem, 'id' | 'publishedDate'>
): Promise<NewsItem> {
    try {
        const result = await sql`
      INSERT INTO news (title, content, category)
      VALUES (${news.title}, ${news.content || null}, ${news.category})
      RETURNING *
    `;

        return convertToNewsItem(result[0]);
    } catch (error) {
        console.error('Error creating news:', error);
        throw new Error('Failed to create news in database');
    }
}

// Get news by ID
export async function getNewsById(id: string): Promise<NewsItem | null> {
    try {
        const result = await sql`
      SELECT * FROM news 
      WHERE id = ${id}
    `;

        if (result.length === 0) {
            return null;
        }

        return convertToNewsItem(result[0]);
    } catch (error) {
        console.error('Error fetching news by ID:', error);
        throw new Error('Failed to fetch news by ID from database');
    }
}
