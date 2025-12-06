import { unstable_cache } from 'next/cache';
import { sql, pool } from './sql';

const EXCLUDED_PERMISSION_PREFIXES = ['verein.news.'];

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

export interface DatabaseNews {
    id: number;
    title: string;
    content?: string;
    category: string;
    published_date: string;
    is_pinned?: boolean;
    pinned_at?: string;
    created_at: string;
    updated_at: string;
}

export interface NewsItem {
    id: string;
    title: string;
    content?: unknown; // Slate.js content (JSON)
    category: string;
    publishedDate: Date;
    articleId: string;
    isPinned?: boolean;
    pinnedAt?: Date;
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

// Convert database news to news item format
function convertToNewsItem(dbNews: Record<string, unknown>): NewsItem {
    return {
        id: String(dbNews.id),
        title: String(dbNews.title),
        content: dbNews.content || undefined,
        category: String(dbNews.category),
        publishedDate: new Date(String(dbNews.published_date)),
        articleId: String(dbNews.article_id),
        isPinned: Boolean(dbNews.is_pinned),
        pinnedAt: dbNews.pinned_at
            ? new Date(String(dbNews.pinned_at))
            : undefined,
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

// Update an event
export async function updateEvent(
    id: string,
    event: Partial<Omit<CalendarEvent, 'id'>>
): Promise<CalendarEvent> {
    try {
        // First, get the existing event to merge with updates
        const existing = await sql`SELECT * FROM events WHERE id = ${id}`;
        if (existing.length === 0) {
            throw new Error('Event not found');
        }

        const existingEvent = existing[0];

        // Merge: use new value if provided, otherwise keep existing
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

// Cancel an event (marks as cancelled but doesn't delete)
export async function cancelEvent(
    id: string,
    cancelledBy: string
): Promise<CalendarEvent> {
    try {
        console.log(
            'Database: Cancelling event ID:',
            id,
            'by user:',
            cancelledBy
        );

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

        console.log('Database: Update result length:', result.length);

        if (result.length === 0) {
            throw new Error('Event not found');
        }

        return convertToCalendarEvent(result[0]);
    } catch (error: unknown) {
        console.error('Error cancelling event in database:', error);
        console.error('Error message:', (error as Error).message);
        console.error('Error details:', error);
        throw error;
    }
}

// Uncancel an event (restore cancelled event)
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

// Get recent news (limited) - pinned news always shown first
export const getRecentNews = unstable_cache(
    async (limit: number = 4): Promise<NewsItem[]> => {
        try {
            // First get pinned news (max 3)
            const pinnedNews = await sql`
                SELECT * FROM news 
                WHERE is_pinned = TRUE
                ORDER BY pinned_at DESC
                LIMIT 3
            `;

            const pinnedCount = pinnedNews.length;
            const remainingSlots = limit - pinnedCount;

            // Then get regular news to fill remaining slots
            let regularNews: Record<string, unknown>[] = [];
            if (remainingSlots > 0) {
                const pinnedIds = pinnedNews.map((n) => n.id);
                if (pinnedIds.length > 0) {
                    regularNews = await sql`
                        SELECT * FROM news 
                        WHERE id != ALL(${pinnedIds})
                        ORDER BY published_date DESC
                        LIMIT ${remainingSlots}
                    `;
                } else {
                    regularNews = await sql`
                        SELECT * FROM news 
                        ORDER BY published_date DESC
                        LIMIT ${remainingSlots}
                    `;
                }
            }

            // Combine: pinned first, then regular
            const allNews = [...pinnedNews, ...regularNews];
            return allNews.map(convertToNewsItem);
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

// Get archived news (older than most recent 4)
export const getArchivedNews = unstable_cache(
    async (): Promise<NewsItem[]> => {
        try {
            const news = await sql`
          SELECT * FROM news 
          ORDER BY published_date DESC
          OFFSET 4
        `;

            return news.map(convertToNewsItem);
        } catch (error) {
            console.error('Error fetching archived news:', error);
            throw new Error('Failed to fetch archived news from database');
        }
    },
    ['archived-news'],
    {
        tags: ['news'],
        revalidate: 3600, // Revalidate every hour as fallback
    }
);

// Archive item interface
export interface ArchiveItem {
    id: number;
    title: string;
    author?: string;
    category?: string;
    created_date?: string;
    content: string;
    created_at: string;
}

// Convert raw DB row to ArchiveItem
function convertToArchiveItem(row: Record<string, unknown>): ArchiveItem {
    return {
        id: Number(row.id),
        title: String(row.title),
        author: row.author ? String(row.author) : undefined,
        category: row.category ? String(row.category) : undefined,
        created_date: row.created_date ? String(row.created_date) : undefined,
        content: String(row.content),
        created_at: String(row.created_at),
    };
}

// Get all archive items
export const getArchiveItems = unstable_cache(
    async (): Promise<ArchiveItem[]> => {
        try {
            const items = await sql`
                SELECT * FROM archive 
                ORDER BY created_date DESC NULLS LAST, created_at DESC
            `;
            return items.map(convertToArchiveItem);
        } catch (error) {
            console.error('Error fetching archive items:', error);
            return [];
        }
    },
    ['archive-items'],
    {
        tags: ['archive'],
        revalidate: 3600,
    }
);

// Get archive item by ID
export async function getArchiveItemById(id: string): Promise<ArchiveItem | null> {
    try {
        const result = await sql`
            SELECT * FROM archive WHERE id = ${id}
        `;
        if (result.length === 0) return null;
        return convertToArchiveItem(result[0]);
    } catch (error) {
        console.error('Error fetching archive item:', error);
        return null;
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

// Get count of pinned news
export async function getPinnedNewsCount(): Promise<number> {
    try {
        const result = await sql`
            SELECT COUNT(*) as count 
            FROM news 
            WHERE is_pinned = TRUE
        `;
        return Number(result[0].count);
    } catch (error) {
        console.error('Error fetching pinned news count:', error);
        throw new Error('Failed to fetch pinned news count from database');
    }
}

// Pin a news item (max 3 pinned at a time)
export async function pinNews(id: string): Promise<NewsItem> {
    try {
        // Check current pinned count
        const pinnedCount = await getPinnedNewsCount();
        if (pinnedCount >= 3) {
            throw new Error(
                'Maximum of 3 pinned news items allowed. Unpin another item first.'
            );
        }

        const result = await sql`
            UPDATE news 
            SET 
                is_pinned = TRUE,
                pinned_at = ${new Date().toISOString()}
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('News item not found');
        }

        return convertToNewsItem(result[0]);
    } catch (error) {
        console.error('Error pinning news:', error);
        throw error;
    }
}

// Unpin a news item
export async function unpinNews(id: string): Promise<NewsItem> {
    try {
        const result = await sql`
            UPDATE news 
            SET 
                is_pinned = FALSE,
                pinned_at = NULL
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('News item not found');
        }

        return convertToNewsItem(result[0]);
    } catch (error) {
        console.error('Error unpinning news:', error);
        throw new Error('Failed to unpin news in database');
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
    image_url: string;
    image_storage_path?: string;
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
    imageUrl: string;
    imageStoragePath?: string;
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
        imageUrl: String(row.image_url),
        imageStoragePath: row.image_storage_path
            ? String(row.image_storage_path)
            : undefined,
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
    imageUrl: string,
    imageStoragePath: string,
    imageMimeType: string,
    imageFilename?: string,
    email?: string
): Promise<PortraitSubmission> {
    try {
        const result = await sql`
            INSERT INTO portraits (name, description, image_url, image_storage_path, image_mime_type, image_filename, email)
            VALUES (${name}, ${description}, ${imageUrl}, ${imageStoragePath}, ${imageMimeType}, ${
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
    status: 'pending' | 'approved' | 'rejected',
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

export async function deletePortraitSubmission(
    id: string
): Promise<PortraitSubmission> {
    try {
        const result = await sql`
            DELETE FROM portraits 
            WHERE id = ${parseInt(id)}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Portrait submission not found');
        }

        return convertToPortraitSubmission(result[0]);
    } catch (error) {
        console.error('Error deleting portrait submission:', error);
        throw new Error('Failed to delete portrait submission');
    }
}

/**
 * Cleans up old rejected portraits if the count exceeds the maximum limit.
 * Deletes the oldest rejected portraits first.
 * Returns the deleted portraits so their images can be cleaned up from storage.
 */
export async function cleanupOldRejectedPortraits(
    maxRejectedPortraits: number
): Promise<PortraitSubmission[]> {
    try {
        // Count current rejected portraits
        const countResult = await sql`
            SELECT COUNT(*) as count 
            FROM portraits 
            WHERE status = 'rejected'
        `;

        const rejectedCount = parseInt(countResult[0].count as string);

        if (rejectedCount <= maxRejectedPortraits) {
            return []; // No cleanup needed
        }

        // Calculate how many to delete
        const toDelete = rejectedCount - maxRejectedPortraits;

        // Get the oldest rejected portraits to delete
        const toDeleteResult = await sql`
            SELECT id, image_storage_path FROM portraits 
            WHERE status = 'rejected'
            ORDER BY reviewed_at ASC, submitted_at ASC
            LIMIT ${toDelete}
        `;

        if (toDeleteResult.length === 0) {
            return [];
        }

        // Delete the oldest rejected portraits and return them
        const idsToDelete = toDeleteResult.map((row) => row.id);
        const deleteResult = await sql`
            DELETE FROM portraits 
            WHERE id = ANY(${idsToDelete})
            RETURNING *
        `;

        console.log(
            `Cleaned up ${deleteResult.length} old rejected portraits (limit: ${maxRejectedPortraits}, was: ${rejectedCount})`
        );

        return deleteResult.map(convertToPortraitSubmission);
    } catch (error) {
        console.error('Error cleaning up rejected portraits:', error);
        throw new Error('Failed to cleanup rejected portraits');
    }
}

// Shared Gallery (Impressionen) types and functions
export interface SharedGallerySubmission {
    id: string;
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterName?: string;
    submitterEmail?: string;
    imageUrl: string;
    imageStoragePath?: string;
    imageMimeType: string;
    imageFilename?: string;
    dateTaken?: Date;
    location?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
    rejectionReason?: string;
}

export interface SharedGallerySubmissionGroup {
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterNames: string[];
    submitterEmail?: string;
    images: SharedGallerySubmission[];
    submittedAt: Date;
    totalCount: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
}

function convertToSharedGallerySubmission(
    row: Record<string, unknown>
): SharedGallerySubmission {
    const imageUrl = row.image_url
        ? String(row.image_url)
        : row.image_data
        ? String(row.image_data)
        : '';

    return {
        id: String(row.id),
        submissionGroupId: String(row.submission_group_id),
        title: String(row.title),
        description: row.description ? String(row.description) : undefined,
        submitterName: row.submitter_name
            ? String(row.submitter_name)
            : undefined,
        submitterEmail: row.submitter_email
            ? String(row.submitter_email)
            : undefined,
        imageUrl,
        imageStoragePath: row.image_storage_path
            ? String(row.image_storage_path)
            : undefined,
        imageMimeType: String(row.image_mime_type),
        imageFilename: row.image_filename
            ? String(row.image_filename)
            : undefined,
        dateTaken: row.date_taken
            ? new Date(String(row.date_taken))
            : undefined,
        location: row.location ? String(row.location) : undefined,
        status: String(row.status) as 'pending' | 'approved' | 'rejected',
        submittedAt: new Date(String(row.submitted_at)),
        reviewedAt: row.reviewed_at
            ? new Date(String(row.reviewed_at))
            : undefined,
        reviewedBy: row.reviewed_by ? String(row.reviewed_by) : undefined,
        rejectionReason: row.rejection_reason
            ? String(row.rejection_reason)
            : undefined,
    };
}

export async function createSharedGallerySubmission(
    submission: Omit<
        SharedGallerySubmission,
        | 'id'
        | 'submittedAt'
        | 'status'
        | 'reviewedAt'
        | 'reviewedBy'
        | 'rejectionReason'
    >
): Promise<SharedGallerySubmission> {
    try {
        const result = await sql`
            INSERT INTO shared_gallery_submissions (
                submission_group_id, title, description, submitter_name, submitter_email, 
                image_data, image_url, image_storage_path, image_mime_type, image_filename, date_taken, location, status
            )
            VALUES (
                ${submission.submissionGroupId},
                ${submission.title},
                ${submission.description || null},
                ${submission.submitterName || null},
                ${submission.submitterEmail || null},
                NULL,
                ${submission.imageUrl},
                ${submission.imageStoragePath || null},
                ${submission.imageMimeType},
                ${submission.imageFilename || null},
                ${submission.dateTaken || null},
                ${submission.location || null},
                'pending'
            )
            RETURNING *
        `;
        return convertToSharedGallerySubmission(result[0]);
    } catch (error) {
        console.error('Error creating shared gallery submission:', error);
        throw new Error('Failed to create shared gallery submission');
    }
}

export async function getSharedGallerySubmissionGroups(
    status?: 'pending' | 'approved' | 'rejected',
    limit?: number,
    offset?: number
): Promise<{ groups: SharedGallerySubmissionGroup[]; total: number }> {
    try {
        const limitValue = limit ?? 25;
        const offsetValue = offset ?? 0;
        const params: unknown[] = [];

        let whereClause = '';
        if (status) {
            params.push(status);
            whereClause = `WHERE status = $${params.length}`;
        }

        params.push(limitValue);
        const limitIndex = params.length;
        params.push(offsetValue);
        const offsetIndex = params.length;

        const query = `
            WITH filtered AS (
                SELECT *
                FROM shared_gallery_submissions
                ${whereClause}
            ),
            grouped AS (
                SELECT submission_group_id, MIN(submitted_at) AS first_submitted
                FROM filtered
                GROUP BY submission_group_id
            ),
            ordered AS (
                SELECT
                    submission_group_id,
                    first_submitted,
                    COUNT(*) OVER () AS total_groups
                FROM grouped
                ORDER BY first_submitted DESC
            ),
            paged AS (
                SELECT *
                FROM ordered
                LIMIT $${limitIndex} OFFSET $${offsetIndex}
            )
            SELECT
                paged.total_groups,
                filtered.id,
                filtered.submission_group_id,
                filtered.title,
                filtered.description,
                filtered.submitter_name,
                filtered.submitter_email,
                filtered.image_url,
                filtered.image_storage_path,
                filtered.image_mime_type,
                filtered.image_filename,
                filtered.date_taken,
                filtered.location,
                filtered.status,
                filtered.submitted_at,
                filtered.reviewed_at,
                filtered.reviewed_by,
                filtered.rejection_reason
            FROM filtered
            JOIN paged ON filtered.submission_group_id = paged.submission_group_id
            ORDER BY paged.first_submitted DESC, filtered.submitted_at DESC;
        `;

        const { rows } = await pool.query(query, params);

        if (rows.length === 0) {
            const countResult = status
                ? await sql`SELECT COUNT(DISTINCT submission_group_id)::int as count FROM shared_gallery_submissions WHERE status = ${status}`
                : await sql`SELECT COUNT(DISTINCT submission_group_id)::int as count FROM shared_gallery_submissions`;
            const totalWhenEmpty = countResult[0]?.count || 0;
            return { groups: [], total: totalWhenEmpty };
        }

        const total = Number(rows[0].total_groups || 0);
        const groups = new Map<string, SharedGallerySubmissionGroup>();

        for (const row of rows) {
            const submission = convertToSharedGallerySubmission(row);

            if (!groups.has(submission.submissionGroupId)) {
                groups.set(submission.submissionGroupId, {
                    submissionGroupId: submission.submissionGroupId,
                    title: submission.title,
                    description: submission.description,
                    submitterNames: [],
                    submitterEmail: submission.submitterEmail,
                    images: [],
                    submittedAt: submission.submittedAt,
                    totalCount: 0,
                    pendingCount: 0,
                    approvedCount: 0,
                    rejectedCount: 0,
                });
            }

            const group = groups.get(submission.submissionGroupId)!;
            group.images.push(submission);
            group.totalCount++;

            if (
                submission.submitterName &&
                !group.submitterNames.includes(submission.submitterName)
            ) {
                group.submitterNames.push(submission.submitterName);
            }

            if (submission.status === 'pending') group.pendingCount++;
            else if (submission.status === 'approved') group.approvedCount++;
            else if (submission.status === 'rejected') group.rejectedCount++;
        }

        return { groups: Array.from(groups.values()), total };
    } catch (error) {
        console.error(
            'Error fetching shared gallery submission groups:',
            error
        );
        throw new Error('Failed to fetch shared gallery submission groups');
    }
}

export const getSharedGallerySubmissions = unstable_cache(
    async (
        status?: 'pending' | 'approved' | 'rejected'
    ): Promise<SharedGallerySubmission[]> => {
        try {
            // Legacy image_data payloads are excluded; URL is enough for rendering
            const result = status
                ? await sql`
                    SELECT id, submission_group_id, title, description, submitter_name, 
                          submitter_email, image_url, image_storage_path, image_mime_type, image_filename, date_taken, 
                           location, status, submitted_at, reviewed_at, reviewed_by, rejection_reason
                    FROM shared_gallery_submissions 
                    WHERE status = ${status}
                    ORDER BY submitted_at DESC
                  `
                : await sql`
                    SELECT id, submission_group_id, title, description, submitter_name, 
                          submitter_email, image_url, image_storage_path, image_mime_type, image_filename, date_taken, 
                           location, status, submitted_at, reviewed_at, reviewed_by, rejection_reason
                    FROM shared_gallery_submissions 
                    ORDER BY submitted_at DESC
                  `;
            return result.map(convertToSharedGallerySubmission);
        } catch (error) {
            console.error('Error fetching shared gallery submissions:', error);
            throw new Error('Failed to fetch shared gallery submissions');
        }
    },
    ['shared-gallery-submissions'],
    { tags: ['shared-gallery'], revalidate: 300 }
);

export const getApprovedSharedGalleryGroups = unstable_cache(
    async (): Promise<SharedGallerySubmissionGroup[]> => {
        try {
            // Get all approved submissions
            const result = await sql`
                SELECT * FROM shared_gallery_submissions 
                WHERE status = 'approved'
                ORDER BY submitted_at DESC
            `;

            const submissions = result.map(convertToSharedGallerySubmission);

            // Group by submission_group_id
            const groups = new Map<string, SharedGallerySubmissionGroup>();

            for (const submission of submissions) {
                if (!groups.has(submission.submissionGroupId)) {
                    groups.set(submission.submissionGroupId, {
                        submissionGroupId: submission.submissionGroupId,
                        title: submission.title,
                        description: submission.description,
                        submitterNames: [],
                        submitterEmail: submission.submitterEmail,
                        images: [],
                        submittedAt: submission.submittedAt,
                        totalCount: 0,
                        pendingCount: 0,
                        approvedCount: 0,
                        rejectedCount: 0,
                    });
                }

                const group = groups.get(submission.submissionGroupId)!;
                group.images.push(submission);
                group.totalCount++;
                group.approvedCount++;

                // Collect unique submitter names
                if (
                    submission.submitterName &&
                    !group.submitterNames.includes(submission.submitterName)
                ) {
                    group.submitterNames.push(submission.submitterName);
                }
            }

            return Array.from(groups.values());
        } catch (error) {
            console.error(
                'Error fetching approved shared gallery groups:',
                error
            );
            throw new Error('Failed to fetch approved shared gallery groups');
        }
    },
    ['approved-shared-gallery-groups'],
    { tags: ['shared-gallery'], revalidate: 300 }
);

export const getSharedGalleryImageCount = unstable_cache(
    async (): Promise<number> => {
        try {
            const result = await sql`
                SELECT COUNT(*) as count FROM shared_gallery_submissions 
                WHERE status = 'approved'
            `;
            return Number(result[0].count) || 0;
        } catch (error) {
            console.error('Error fetching shared gallery image count:', error);
            throw new Error('Failed to fetch shared gallery image count');
        }
    },
    ['shared-gallery-image-count'],
    { tags: ['shared-gallery'], revalidate: 300 }
);

export async function getSharedGallerySubmissionById(
    id: string
): Promise<SharedGallerySubmission | null> {
    try {
        const result = await sql`
            SELECT * FROM shared_gallery_submissions 
            WHERE id = ${id}
        `;
        if (result.length === 0) return null;
        return convertToSharedGallerySubmission(result[0]);
    } catch (error) {
        console.error('Error fetching shared gallery submission:', error);
        throw new Error('Failed to fetch shared gallery submission');
    }
}

export async function approveSharedGallerySubmission(
    id: string,
    reviewedBy: string
): Promise<SharedGallerySubmission> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'approved',
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            throw new Error('Submission not found');
        }
        return convertToSharedGallerySubmission(result[0]);
    } catch (error) {
        console.error('Error approving shared gallery submission:', error);
        throw new Error('Failed to approve shared gallery submission');
    }
}

export async function approveAllInGroup(
    submissionGroupId: string,
    reviewedBy: string
): Promise<number> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'approved',
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy},
                updated_at = CURRENT_TIMESTAMP
            WHERE submission_group_id = ${submissionGroupId}
            AND status = 'pending'
            RETURNING *
        `;
        return result.length;
    } catch (error) {
        console.error('Error approving all submissions in group:', error);
        throw new Error('Failed to approve all submissions in group');
    }
}

export async function rejectAllInGroup(
    submissionGroupId: string,
    reviewedBy: string,
    reason?: string
): Promise<number> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'rejected',
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy},
                rejection_reason = ${reason || null},
                updated_at = CURRENT_TIMESTAMP
            WHERE submission_group_id = ${submissionGroupId}
            AND status = 'pending'
            RETURNING *
        `;
        return result.length;
    } catch (error) {
        console.error('Error rejecting all submissions in group:', error);
        throw new Error('Failed to reject all submissions in group');
    }
}

export async function rejectSharedGallerySubmission(
    id: string,
    reviewedBy: string,
    reason?: string
): Promise<SharedGallerySubmission> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'rejected',
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy},
                rejection_reason = ${reason || null},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            throw new Error('Submission not found');
        }
        return convertToSharedGallerySubmission(result[0]);
    } catch (error) {
        console.error('Error rejecting shared gallery submission:', error);
        throw new Error('Failed to reject shared gallery submission');
    }
}

export async function resetSharedGallerySubmissionToPending(
    id: string
): Promise<SharedGallerySubmission> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'pending',
                reviewed_at = NULL,
                reviewed_by = NULL,
                rejection_reason = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            throw new Error('Submission not found');
        }
        return convertToSharedGallerySubmission(result[0]);
    } catch (error) {
        console.error(
            'Error resetting shared gallery submission to pending:',
            error
        );
        throw new Error('Failed to reset shared gallery submission to pending');
    }
}

export async function resetAllInGroupToPending(
    submissionGroupId: string
): Promise<number> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'pending',
                reviewed_at = NULL,
                reviewed_by = NULL,
                rejection_reason = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE submission_group_id = ${submissionGroupId}
            AND status != 'pending'
            RETURNING *
        `;
        return result.length;
    } catch (error) {
        console.error(
            'Error resetting all submissions in group to pending:',
            error
        );
        throw new Error('Failed to reset all submissions in group to pending');
    }
}

export async function deleteSharedGallerySubmission(id: string): Promise<void> {
    try {
        await sql`
            DELETE FROM shared_gallery_submissions 
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Error deleting shared gallery submission:', error);
        throw new Error('Failed to delete shared gallery submission');
    }
}

// Gallery Reports
export interface GalleryReport {
    id: string;
    submissionId: string;
    reason: string;
    reporterInfo?: string;
    status: 'pending' | 'reviewed' | 'dismissed';
    reviewedAt?: Date;
    reviewedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    // Joined data from submission
    imageUrl?: string;
    title?: string;
    submitterName?: string;
}

function convertToGalleryReport(row: Record<string, unknown>): GalleryReport {
    return {
        id: String(row.id),
        submissionId: String(row.submission_id),
        reason: String(row.reason),
        reporterInfo: row.reporter_info ? String(row.reporter_info) : undefined,
        status: String(row.status) as 'pending' | 'reviewed' | 'dismissed',
        reviewedAt: row.reviewed_at
            ? new Date(String(row.reviewed_at))
            : undefined,
        reviewedBy: row.reviewed_by ? String(row.reviewed_by) : undefined,
        createdAt: new Date(String(row.created_at)),
        updatedAt: new Date(String(row.updated_at)),
        imageUrl: row.image_url
            ? String(row.image_url)
            : row.image_data
            ? String(row.image_data)
            : undefined,
        title: row.title ? String(row.title) : undefined,
        submitterName: row.submitter_name
            ? String(row.submitter_name)
            : undefined,
    };
}

export async function createGalleryReport(
    submissionId: string,
    reason: string,
    reporterInfo?: string
): Promise<GalleryReport> {
    try {
        const result = await sql`
            INSERT INTO shared_gallery_reports (submission_id, reason, reporter_info)
            VALUES (${submissionId}, ${reason}, ${reporterInfo || null})
            RETURNING *
        `;
        return convertToGalleryReport(result[0]);
    } catch (error) {
        console.error('Error creating gallery report:', error);
        throw new Error('Failed to create gallery report');
    }
}

export const getGalleryReports = unstable_cache(
    async (
        status?: 'pending' | 'reviewed' | 'dismissed'
    ): Promise<GalleryReport[]> => {
        try {
            // Image data stays out of this query; admins fetch the URL lazily when needed
            const result = status
                ? await sql`
                                        SELECT r.*, s.title, s.submitter_name, s.image_url, s.image_storage_path, s.image_data
                    FROM shared_gallery_reports r
                    JOIN shared_gallery_submissions s ON r.submission_id = s.id
                    WHERE r.status = ${status}
                    ORDER BY r.created_at DESC
                  `
                : await sql`
                                        SELECT r.*, s.title, s.submitter_name, s.image_url, s.image_storage_path, s.image_data
                    FROM shared_gallery_reports r
                    JOIN shared_gallery_submissions s ON r.submission_id = s.id
                    ORDER BY r.created_at DESC
                  `;
            return result.map(convertToGalleryReport);
        } catch (error) {
            console.error('Error fetching gallery reports:', error);
            throw new Error('Failed to fetch gallery reports');
        }
    },
    ['gallery-reports'],
    { tags: ['gallery-reports'], revalidate: 60 }
);

export async function updateGalleryReportStatus(
    id: string,
    status: 'reviewed' | 'dismissed',
    reviewedBy: string
): Promise<GalleryReport> {
    try {
        const result = await sql`
            UPDATE shared_gallery_reports
            SET status = ${status},
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            throw new Error('Report not found');
        }
        return convertToGalleryReport(result[0]);
    } catch (error) {
        console.error('Error updating gallery report status:', error);
        throw new Error('Failed to update gallery report status');
    }
}

// Roles and Permissions Types
export interface Role {
    id: number;
    name: string;
    displayName: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Permission {
    id: number;
    name: string;
    displayName: string;
    description?: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
}

function convertToRole(row: Record<string, unknown>): Role {
    return {
        id: Number(row.id),
        name: String(row.name),
        displayName: String(row.display_name),
        description: row.description ? String(row.description) : undefined,
        createdAt: new Date(String(row.created_at)),
        updatedAt: new Date(String(row.updated_at)),
    };
}

function convertToPermission(row: Record<string, unknown>): Permission {
    return {
        id: Number(row.id),
        name: String(row.name),
        displayName: String(row.display_name),
        description: row.description ? String(row.description) : undefined,
        category: row.category ? String(row.category) : undefined,
        createdAt: new Date(String(row.created_at)),
        updatedAt: new Date(String(row.updated_at)),
    };
}

// Admin User Management Types and Functions
export interface AdminUserRecord {
    id: number;
    username: string;
    mustChangePassword: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
    roleId?: number;
    roleName?: string;
    roleDisplayName?: string;
    customPermissions: string[];
    roleDefaultPermissions?: string[];
    vereinId?: string;
}

function convertToAdminUserRecord(
    row: Record<string, unknown>
): AdminUserRecord {
    const rawCustomPermissions = row.custom_permissions
        ? Array.isArray(row.custom_permissions)
            ? row.custom_permissions
            : JSON.parse(String(row.custom_permissions))
        : [];

    const rawRoleDefaultPermissions = row.role_default_permissions
        ? Array.isArray(row.role_default_permissions)
            ? row.role_default_permissions
            : JSON.parse(String(row.role_default_permissions))
        : undefined;

    return {
        id: Number(row.id),
        username: String(row.username),
        mustChangePassword: Boolean(row.must_change_password),
        createdAt: new Date(String(row.created_at)),
        updatedAt: new Date(String(row.updated_at)),
        lastLogin: row.last_login
            ? new Date(String(row.last_login))
            : undefined,
        roleId: row.role_id ? Number(row.role_id) : undefined,
        roleName: row.role_name ? String(row.role_name) : undefined,
        roleDisplayName: row.role_display_name
            ? String(row.role_display_name)
            : undefined,
        vereinId: row.verein_id ? String(row.verein_id) : undefined,
        customPermissions: removeExcludedPermissions(
            rawCustomPermissions as string[]
        ),
        roleDefaultPermissions: rawRoleDefaultPermissions
            ? removeExcludedPermissions(rawRoleDefaultPermissions as string[])
            : undefined,
    };
}

export async function getAllAdminUsers(): Promise<AdminUserRecord[]> {
    try {
        const result = await sql`
            SELECT 
                u.id, 
                u.username, 
                u.must_change_password, 
                u.created_at, 
                u.updated_at, 
                u.last_login,
                u.role_id,
                u.verein_id,
                u.custom_permissions,
                r.name as role_name,
                r.display_name as role_display_name,
                r.default_permissions as role_default_permissions
            FROM admin_users u
            LEFT JOIN roles r ON u.role_id = r.id
            ORDER BY u.created_at DESC
        `;
        return result.map(convertToAdminUserRecord);
    } catch (error) {
        console.error('Error fetching admin users:', error);
        throw new Error('Failed to fetch admin users');
    }
}

export async function getAdminUserById(
    id: number
): Promise<AdminUserRecord | null> {
    try {
        const result = await sql`
            SELECT 
                u.id, 
                u.username, 
                u.must_change_password, 
                u.created_at, 
                u.updated_at, 
                u.last_login,
                u.role_id,
                u.verein_id,
                u.custom_permissions,
                r.name as role_name,
                r.display_name as role_display_name,
                r.default_permissions as role_default_permissions
            FROM admin_users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.id = ${id}
        `;
        if (result.length === 0) return null;
        return convertToAdminUserRecord(result[0]);
    } catch (error) {
        console.error('Error fetching admin user:', error);
        throw new Error('Failed to fetch admin user');
    }
}

export async function deleteAdminUser(id: number): Promise<void> {
    try {
        // Prevent deleting the last admin
        const countResult = await sql`
            SELECT COUNT(*) as count FROM admin_users
        `;
        const adminCount = Number(countResult[0].count);

        if (adminCount <= 1) {
            throw new Error('Cannot delete the last admin user');
        }

        await sql`
            DELETE FROM admin_users
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Error deleting admin user:', error);
        throw error;
    }
}

// Roles Functions
export async function getAllRoles(): Promise<Role[]> {
    try {
        const result = await sql`
            SELECT * FROM roles
            ORDER BY name ASC
        `;
        return result.map(convertToRole);
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw new Error('Failed to fetch roles');
    }
}

export async function getRoleById(id: number): Promise<Role | null> {
    try {
        const result = await sql`
            SELECT * FROM roles
            WHERE id = ${id}
        `;
        if (result.length === 0) return null;
        return convertToRole(result[0]);
    } catch (error) {
        console.error('Error fetching role:', error);
        throw new Error('Failed to fetch role');
    }
}

// Permissions Functions
export async function getAllPermissions(): Promise<Permission[]> {
    try {
        const result = await sql`
            SELECT * FROM permissions
            ORDER BY category, name ASC
        `;
        return result.map(convertToPermission);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw new Error('Failed to fetch permissions');
    }
}

export async function getPermissionsByCategory(): Promise<
    Record<string, Permission[]>
> {
    try {
        const permissions = await getAllPermissions();
        const filteredPermissions = permissions.filter(
            (perm) =>
                !EXCLUDED_PERMISSION_PREFIXES.some((prefix) =>
                    perm.name.startsWith(prefix)
                )
        );
        const grouped: Record<string, Permission[]> = {};

        filteredPermissions.forEach((perm) => {
            const category = perm.category || 'other';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(perm);
        });

        // Expose synthetic wildcard permission so the UI can toggle it explicitly
        const wildcardPermission: Permission = {
            id: -1,
            name: '*',
            displayName: 'Alle Berechtigungen',
            description:
                'Gewährt Zugriff auf jede einzelne Berechtigung des Systems',
            category: 'system',
            createdAt: new Date(0),
            updatedAt: new Date(0),
        };

        if (!grouped.system) {
            grouped.system = [];
        }

        const alreadyHasWildcard = grouped.system.some(
            (perm) => perm.name === '*'
        );

        if (!alreadyHasWildcard) {
            grouped.system.unshift(wildcardPermission);
        }

        return grouped;
    } catch (error) {
        console.error('Error grouping permissions:', error);
        throw new Error('Failed to group permissions');
    }
}

// Update admin user role and permissions
export async function updateAdminUserRoleAndPermissions(
    id: number,
    roleId?: number,
    customPermissions?: string[],
    vereinId?: string | null
): Promise<AdminUserRecord> {
    try {
        const normalizedPermissions =
            normalizeCustomPermissions(customPermissions);

        const result = await sql`
            UPDATE admin_users
            SET role_id = ${roleId || null},
                custom_permissions = ${
                    normalizedPermissions !== null
                        ? JSON.stringify(normalizedPermissions)
                        : sql`custom_permissions`
                },
                verein_id = ${
                    vereinId === undefined ? sql`verein_id` : vereinId
                },
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Admin user not found');
        }

        // Fetch the updated user with role information
        const updatedUser = await getAdminUserById(id);
        if (!updatedUser) {
            throw new Error('Failed to fetch updated user');
        }

        return updatedUser;
    } catch (error) {
        console.error('Error updating admin user role and permissions:', error);
        throw error;
    }
}

function removeExcludedPermissions(permissions: string[]): string[] {
    return permissions.filter(
        (permission) =>
            !EXCLUDED_PERMISSION_PREFIXES.some((prefix) =>
                permission.startsWith(prefix)
            )
    );
}

function normalizeCustomPermissions(permissions?: string[]): string[] | null {
    if (!Array.isArray(permissions)) {
        return null;
    }

    const uniquePermissions = Array.from(
        new Set(
            permissions
                .map((permission) => permission?.trim())
                .filter((permission): permission is string =>
                    Boolean(permission)
                )
        )
    );

    const filteredPermissions = removeExcludedPermissions(uniquePermissions);

    if (filteredPermissions.includes('*')) {
        return ['*'];
    }

    return filteredPermissions;
}

// ============================================================================
// Site Settings
// ============================================================================

export interface SiteSetting {
    key: string;
    value: string;
}

export const getSiteSettings = unstable_cache(
    async (): Promise<Record<string, string>> => {
        const result = await sql`
            SELECT key, value
            FROM site_settings
        `;

        const settings: Record<string, string> = {};
        for (const row of result) {
            settings[row.key as string] = (row.value as string) || '';
        }
        return settings;
    },
    ['site-settings'],
    { revalidate: 300, tags: ['settings'] }
);

export async function getSiteSetting(key: string): Promise<string | null> {
    const settings = await getSiteSettings();
    return settings[key] || null;
}
