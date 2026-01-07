import { unstable_cache } from 'next/cache';
import { sql } from '../sql';

export interface DatabaseNews {
    id: number;
    title: string;
    content?: string;
    category: string;
    published_date: string;
    is_pinned?: boolean;
    pinned_at?: string;
    pinned_order?: number;
    created_at: string;
    updated_at: string;
}

export interface NewsItem {
    id: string;
    title: string;
    content?: unknown;
    category: string;
    publishedDate: Date;
    articleId: string;
    isPinned?: boolean;
    pinnedAt?: Date;
    pinnedOrder?: number;
}

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
        pinnedOrder: dbNews.pinned_order ? Number(dbNews.pinned_order) : 0,
    };
}

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

export const getRecentNews = unstable_cache(
    async (limit: number = 4): Promise<NewsItem[]> => {
        try {
            const pinnedNews = await sql`
                SELECT * FROM news 
                WHERE is_pinned = TRUE
                ORDER BY pinned_order ASC, pinned_at DESC
                LIMIT 3
            `;

            const pinnedCount = pinnedNews.length;
            const remainingSlots = limit - pinnedCount;

            let regularNews: Record<string, unknown>[] = [];
            if (remainingSlots > 0) {
                const pinnedIds = pinnedNews.map(
                    (n: Record<string, unknown>) => n.id
                );
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

            const allNews = [...pinnedNews, ...regularNews];
            return allNews.map(convertToNewsItem);
        } catch (error) {
            console.error('Error fetching recent news:', error);
            throw new Error('Failed to fetch recent news from database');
        }
    },
    ['recent-news'],
    { tags: ['news'], revalidate: 3600 }
);

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
    { tags: ['news'], revalidate: 3600 }
);

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

export async function pinNews(id: string): Promise<NewsItem> {
    try {
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
                pinned_at = ${new Date().toISOString()},
                pinned_order = ${pinnedCount + 1}
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
                pinned_at = NULL,
                pinned_order = 0
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('News item not found');
        }

        // Reorder remaining pinned items
        const remainingPinned = await sql`
            SELECT id FROM news 
            WHERE is_pinned = TRUE 
            ORDER BY pinned_order ASC, pinned_at ASC
        `;

        for (let i = 0; i < remainingPinned.length; i++) {
            await sql`
                UPDATE news 
                SET pinned_order = ${i + 1} 
                WHERE id = ${remainingPinned[i].id}
            `;
        }

        return convertToNewsItem(result[0]);
    } catch (error) {
        console.error('Error unpinning news:', error);
        throw new Error('Failed to unpin news in database');
    }
}

export async function updatePinnedOrder(
    orderedIds: string[]
): Promise<NewsItem[]> {
    try {
        const results: Record<string, unknown>[] = [];

        for (let i = 0; i < orderedIds.length; i++) {
            const res = await sql`
                UPDATE news 
                SET pinned_order = ${i + 1}
                WHERE id = ${orderedIds[i]} AND is_pinned = TRUE
                RETURNING *
            `;
            if (res.length > 0) {
                results.push(res[0]);
            }
        }

        return results.map(convertToNewsItem);
    } catch (error) {
        console.error('Error updating pinned order:', error);
        throw new Error('Failed to update pinned order in database');
    }
}

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
export async function getArchiveItemById(
    id: string
): Promise<ArchiveItem | null> {
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
