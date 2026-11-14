import { cacheTag } from 'next/cache';
import { sql } from '../sql';

export interface WendessenCard {
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonHref?: string;
    theme?: Record<string, string>;
}

export interface WendessenLayout {
    id: number;
    name: string;
    cards: WendessenCard[];
}

function toCard(raw: unknown): WendessenCard | null {
    if (!raw || typeof raw !== 'object') return null;
    const value = raw as Record<string, unknown>;
    const title = typeof value.title === 'string' ? value.title : '';
    if (!title) return null;
    return {
        title,
        subtitle:
            typeof value.subtitle === 'string' && value.subtitle.length > 0
                ? value.subtitle
                : undefined,
        description:
            typeof value.description === 'string' && value.description.length > 0
                ? value.description
                : undefined,
        imageUrl:
            typeof value.image_url === 'string' && value.image_url.length > 0
                ? value.image_url
                : undefined,
        buttonText:
            typeof value.button_text === 'string' && value.button_text.length > 0
                ? value.button_text
                : undefined,
        buttonHref:
            typeof value.button_href === 'string' && value.button_href.length > 0
                ? value.button_href
                : undefined,
        theme:
            value.theme && typeof value.theme === 'object'
                ? (value.theme as Record<string, string>)
                : undefined,
    };
}

/**
 * The editors' active "Dorfwissen" layout: three cards that used to render on
 * the home page. The register renders them as three ruled tiles.
 */
export async function getActiveWendessenLayout(): Promise<WendessenLayout | null> {
    'use cache';
    cacheTag('wendessen');
    try {
        const rows = await sql`
            SELECT * FROM wendessen_layouts
            WHERE is_active = true
            LIMIT 1
        `;
        if (rows.length === 0) return null;
        const row = rows[0];
        const cards = [row.card_1, row.card_2, row.card_3]
            .map(toCard)
            .filter((card): card is WendessenCard => card !== null);
        if (cards.length === 0) return null;
        return {
            id: Number(row.id),
            name: String(row.name),
            cards,
        };
    } catch (error) {
        console.error('Error fetching Wendessen layout:', error);
        return null;
    }
}
