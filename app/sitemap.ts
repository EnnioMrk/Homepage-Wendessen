import type { MetadataRoute } from 'next';
import { getNews, getArchiveItems } from '@/lib/database';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://wendessen.de';

const STATIC_ROUTES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1, freq: 'daily' },
    { path: '/was-steht-an', priority: 0.9, freq: 'daily' },
    { path: '/neuigkeiten', priority: 0.9, freq: 'weekly' },
    { path: '/dorfleben', priority: 0.8, freq: 'monthly' },
    { path: '/dorfleben/ortsrat/mitglieder', priority: 0.6, freq: 'yearly' },
    { path: '/dorfleben/ortsrat/bericht', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/feuerwehr', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/sv-wendessen', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/schuetzenverein', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/kirchbauverein', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/kleingaertner', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/idw', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/spritzenhaus', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/seniorenkreis', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/frauenhilfe', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/hospiz', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/vereine/jugendfeuerwehr', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/institutionen/kirche', priority: 0.5, freq: 'yearly' },
    { path: '/dorfleben/institutionen/hospiz', priority: 0.5, freq: 'yearly' },
    { path: '/dorfleben/wir-wendesser', priority: 0.6, freq: 'monthly' },
    { path: '/dorfleben/karte', priority: 0.5, freq: 'yearly' },
    { path: '/dorfleben/wetter', priority: 0.4, freq: 'daily' },
    { path: '/dorfleben/archiv', priority: 0.5, freq: 'monthly' },
    { path: '/geschichte', priority: 0.7, freq: 'yearly' },
    { path: '/impressionen', priority: 0.7, freq: 'weekly' },
    { path: '/impressionen/einreichen', priority: 0.5, freq: 'yearly' },
    { path: '/wohnen-bauen', priority: 0.7, freq: 'monthly' },
    { path: '/wohnen-bauen/neubaugebiet', priority: 0.6, freq: 'monthly' },
    { path: '/wohnen-bauen/feuerwehrgeraetehaus', priority: 0.6, freq: 'monthly' },
    { path: '/kontakt', priority: 0.7, freq: 'monthly' },
    { path: '/kontakt/verzeichnis', priority: 0.6, freq: 'monthly' },
    { path: '/kontakt/formular', priority: 0.5, freq: 'yearly' },
    { path: '/kontakt/redaktionsteam', priority: 0.5, freq: 'yearly' },
    { path: '/impressum', priority: 0.2, freq: 'yearly' },
    { path: '/datenschutz', priority: 0.2, freq: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
        url: `${BASE}${r.path}`,
        lastModified: now,
        changeFrequency: r.freq,
        priority: r.priority,
    }));

    try {
        const news = await getNews();
        for (const item of news) {
            entries.push({
                url: `${BASE}/neuigkeiten/${item.articleId}`,
                lastModified: item.publishedDate,
                changeFrequency: 'yearly',
                priority: 0.6,
            });
        }
    } catch (error) {
        console.error('sitemap: news unavailable', error);
    }

    try {
        const archive = await getArchiveItems();
        for (const item of archive) {
            entries.push({
                url: `${BASE}/dorfleben/archiv/${item.id}`,
                lastModified: item.created_at ? new Date(item.created_at) : now,
                changeFrequency: 'yearly',
                priority: 0.4,
            });
        }
    } catch (error) {
        console.error('sitemap: archive unavailable', error);
    }

    return entries;
}
