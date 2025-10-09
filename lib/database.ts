import { neon } from '@neondatabase/serverless';
import { unstable_cache } from 'next/cache';

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

// Contacts types
export interface ContactRecord {
    id: number;
    name: string;
    emails: string[];
    phones: { type: string; value: string }[];
    addresses: string[];
    affiliations: { org: string; role: string }[];
    sources: string[];
    importance: number;
}

export type ContactListItem = Omit<ContactRecord, 'id'> & { id: string };

function convertToContactItem(row: Record<string, unknown>): ContactListItem {
    return {
        id: String(row.id),
        name: String(row.name),
        emails: Array.isArray(row.emails)
            ? row.emails
            : JSON.parse((row.emails as string) ?? '[]'),
        phones: Array.isArray(row.phones)
            ? row.phones
            : JSON.parse((row.phones as string) ?? '[]'),
        addresses: Array.isArray(row.addresses)
            ? row.addresses
            : JSON.parse((row.addresses as string) ?? '[]'),
        affiliations: Array.isArray(row.affiliations)
            ? row.affiliations
            : JSON.parse((row.affiliations as string) ?? '[]'),
        sources: Array.isArray(row.sources)
            ? row.sources
            : JSON.parse((row.sources as string) ?? '[]'),
        importance: Number(row.importance ?? 0),
    };
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
export const getEvents = unstable_cache(
    async (): Promise<CalendarEvent[]> => {
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
    },
    ['all-events'],
    {
        tags: ['events'],
        revalidate: 3600, // Revalidate every hour as fallback
    }
);

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
export const getUpcomingEvents = unstable_cache(
    async (limit: number = 10): Promise<CalendarEvent[]> => {
        try {
            // Use current date with time set to beginning of day to include events happening today
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Set to beginning of today
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
    },
    ['upcoming-events'],
    {
        tags: ['events'],
        revalidate: 3600, // Revalidate every hour as fallback
    }
);

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
export const getRecentNews = unstable_cache(
    async (limit: number = 4): Promise<NewsItem[]> => {
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
    },
    ['recent-news'],
    {
        tags: ['news'],
        revalidate: 3600, // Revalidate every hour as fallback
    }
);

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

// Gallery functions

// Get gallery images count
export async function getGalleryImageCount(): Promise<number> {
    try {
        const result = await sql`
            SELECT COUNT(*) as count 
            FROM gallery_images
        `;

        return Number(result[0].count);
    } catch (error) {
        console.error('Error fetching gallery image count:', error);
        throw new Error('Failed to fetch gallery image count from database');
    }
}

// Contacts functions

export const getContacts = unstable_cache(
    async (): Promise<ContactListItem[]> => {
        try {
            const result = await sql`SELECT * FROM contacts ORDER BY name ASC;`;
            return result.map(convertToContactItem);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw new Error('Failed to fetch contacts from database');
        }
    },
    ['contacts-all'],
    { tags: ['contacts'], revalidate: 3600 }
);

export async function searchContacts(
    query: string
): Promise<ContactListItem[]> {
    const q = `%${query.toLowerCase()}%`;
    try {
        const result = await sql`
            SELECT * FROM contacts
            WHERE LOWER(name) LIKE ${q}
               OR EXISTS (
                    SELECT 1 FROM jsonb_array_elements_text(emails) e
                    WHERE LOWER(e) LIKE ${q}
               )
               OR EXISTS (
                    SELECT 1 FROM jsonb_array_elements(phones) p
                    WHERE LOWER(p->>'value') LIKE ${q}
               )
               OR EXISTS (
                    SELECT 1 FROM jsonb_array_elements(affiliations) a
                    WHERE LOWER(a->>'org') LIKE ${q} OR LOWER(a->>'role') LIKE ${q}
               )
            ORDER BY name ASC;
        `;
        return result.map(convertToContactItem);
    } catch (error) {
        console.error('Error searching contacts:', error);
        throw new Error('Failed to search contacts');
    }
}

// Portrait types
export interface DatabasePortrait {
    id: number;
    name: string;
    description: string;
    email?: string;
    image_data: string;
    image_mime_type: string;
    image_filename?: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    created_at: string;
    updated_at: string;
}

export interface PortraitSubmission {
    id: string;
    name: string;
    description: string;
    email?: string;
    imageData: string;
    imageMimeType: string;
    imageFilename?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
}

function convertToPortraitSubmission(
    row: Record<string, unknown>
): PortraitSubmission {
    return {
        id: String(row.id),
        name: String(row.name),
        description: String(row.description),
        email: row.email ? String(row.email) : undefined,
        imageData: String(row.image_data),
        imageMimeType: String(row.image_mime_type),
        imageFilename: row.image_filename
            ? String(row.image_filename)
            : undefined,
        status: String(row.status) as 'pending' | 'approved' | 'rejected',
        submittedAt: new Date(String(row.submitted_at)),
        reviewedAt: row.reviewed_at
            ? new Date(String(row.reviewed_at))
            : undefined,
        reviewedBy: row.reviewed_by ? String(row.reviewed_by) : undefined,
    };
}

// Portrait database functions
export const getPortraitSubmissions = unstable_cache(
    async (): Promise<PortraitSubmission[]> => {
        try {
            const result = await sql`
                SELECT * FROM portraits 
                ORDER BY submitted_at DESC
            `;
            return result.map(convertToPortraitSubmission);
        } catch (error) {
            console.error('Error fetching portrait submissions:', error);
            throw new Error(
                'Failed to fetch portrait submissions from database'
            );
        }
    },
    ['portraits-all'],
    { tags: ['portraits'], revalidate: 3600 }
);

export const getApprovedPortraits = unstable_cache(
    async (): Promise<PortraitSubmission[]> => {
        try {
            const result = await sql`
                SELECT * FROM portraits 
                WHERE status = 'approved'
                ORDER BY submitted_at DESC
            `;
            return result.map(convertToPortraitSubmission);
        } catch (error) {
            console.error('Error fetching approved portraits:', error);
            throw new Error('Failed to fetch approved portraits from database');
        }
    },
    ['portraits-approved'],
    { tags: ['portraits'], revalidate: 3600 }
);

export async function createPortraitSubmission(
    name: string,
    description: string,
    imageData: string,
    imageMimeType: string,
    imageFilename?: string,
    email?: string
): Promise<PortraitSubmission> {
    try {
        const result = await sql`
            INSERT INTO portraits (name, description, image_data, image_mime_type, image_filename, email)
            VALUES (${name}, ${description}, ${imageData}, ${imageMimeType}, ${
            imageFilename || null
        }, ${email})
            RETURNING *
        `;
        return convertToPortraitSubmission(result[0]);
    } catch (error) {
        console.error('Error creating portrait submission:', error);
        throw new Error('Failed to create portrait submission');
    }
}

export async function updatePortraitStatus(
    id: string,
    status: 'approved' | 'rejected',
    reviewedBy?: string
): Promise<PortraitSubmission> {
    try {
        const result = await sql`
            UPDATE portraits 
            SET status = ${status}, 
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy || null},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${parseInt(id)}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Portrait submission not found');
        }

        return convertToPortraitSubmission(result[0]);
    } catch (error) {
        console.error('Error updating portrait status:', error);
        throw new Error('Failed to update portrait status');
    }
}

export async function deletePortraitSubmission(id: string): Promise<void> {
    try {
        const result = await sql`
            DELETE FROM portraits 
            WHERE id = ${parseInt(id)}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Portrait submission not found');
        }
    } catch (error) {
        console.error('Error deleting portrait submission:', error);
        throw new Error('Failed to delete portrait submission');
    }
}

/**
 * Cleans up old rejected portraits if the count exceeds the maximum limit.
 * Deletes the oldest rejected portraits first.
 */
export async function cleanupOldRejectedPortraits(
    maxRejectedPortraits: number
): Promise<number> {
    try {
        // Count current rejected portraits
        const countResult = await sql`
            SELECT COUNT(*) as count 
            FROM portraits 
            WHERE status = 'rejected'
        `;

        const rejectedCount = parseInt(countResult[0].count as string);

        if (rejectedCount <= maxRejectedPortraits) {
            return 0; // No cleanup needed
        }

        // Calculate how many to delete
        const toDelete = rejectedCount - maxRejectedPortraits;

        // Get the oldest rejected portraits to delete
        const toDeleteResult = await sql`
            SELECT id FROM portraits 
            WHERE status = 'rejected'
            ORDER BY reviewed_at ASC, submitted_at ASC
            LIMIT ${toDelete}
        `;

        if (toDeleteResult.length === 0) {
            return 0;
        }

        // Delete the oldest rejected portraits
        const idsToDelete = toDeleteResult.map((row) => row.id);
        const deleteResult = await sql`
            DELETE FROM portraits 
            WHERE id = ANY(${idsToDelete})
        `;

        console.log(
            `Cleaned up ${deleteResult.length} old rejected portraits (limit: ${maxRejectedPortraits}, was: ${rejectedCount})`
        );

        return deleteResult.length;
    } catch (error) {
        console.error('Error cleaning up old rejected portraits:', error);
        throw new Error('Failed to cleanup old rejected portraits');
    }
}
