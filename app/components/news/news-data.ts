import { getNews } from '@/lib/database';
import type { NewsItem } from '@/lib/database';
import { sortNews } from './content';

/**
 * Cached news rows in register order (pinned first, then newest). Returns
 * null when the register cannot be read, so screens can tell "empty" from
 * "unreachable".
 */
export async function loadNews(): Promise<NewsItem[] | null> {
    try {
        return sortNews(await getNews());
    } catch (error) {
        console.error('Neuigkeiten: Daten konnten nicht geladen werden', error);
        return null;
    }
}
