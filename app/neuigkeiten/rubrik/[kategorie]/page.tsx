import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    Leaf,
    Margin,
    Notice,
    PageHead,
} from '@/app/components/register/Layout';
import { NewsList } from '@/app/components/news/NewsList';
import { loadNews } from '@/app/components/news/news-data';
import { newsCategories } from '@/app/components/news/content';
import { pageToday } from '@/app/lib/page-today';

export async function generateStaticParams() {
    if (!process.env.DATABASE_URL) return [{ kategorie: 'Verwaltung' }];
    const { newsCategories } = await import('@/app/components/news/content');
    const { loadNews } = await import('@/app/components/news/news-data');
    const news = await loadNews();
    return newsCategories(news ?? []).map((kategorie: string) => ({
        kategorie,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ kategorie: string }>;
}): Promise<Metadata> {
    const { kategorie } = await params;
    const news = await loadNews();
    const known = news ? newsCategories(news) : [];

    if (!news || !known.includes(kategorie)) {
        return {
            title: 'Eintrag nicht gefunden',
            robots: { index: false, follow: false },
        };
    }

    return {
        title: `Nachrichten: ${kategorie}`,
        description: `Nachrichten aus Wendessen in der Rubrik ${kategorie}, geordnet nach Datum.`,
        alternates: {
            canonical: `/neuigkeiten/rubrik/${encodeURIComponent(kategorie)}`,
        },
    };
}

export default async function NewsCategoryPage({
    params,
}: {
    params: Promise<{ kategorie: string }>;
}) {
    const { kategorie } = await params;
    const news = await loadNews();

    if (!news) {
        return (
            <Leaf
                margin={
                    <Margin
                    date={await pageToday()}
                        label="Register"
                        note={
                            <>
                                Nachrichten tragen Datum und Rubrik. Sobald das
                                Register antwortet, steht die Rubrik wieder da.
                            </>
                        }
                    />
                }
            >
                <PageHead
                    kicker="Register · Nachrichten"
                    title="Rubrik nicht erreichbar"
                />
                <Notice tone="error" title="Das Register antwortet nicht">
                    Die Rubrik konnte nicht geladen werden.{' '}
                    <Link className="link" href="/neuigkeiten">
                        Alle Nachrichten
                    </Link>
                </Notice>
            </Leaf>
        );
    }

    const categories = newsCategories(news);
    if (!categories.includes(kategorie)) notFound();

    const entries = news.filter((item) => item.category === kategorie);
    const pinnedCount = entries.filter((item) => item.isPinned).length;

    return (
        <Leaf
            margin={
                <Margin
                    label="Rubrik"
                    tallies={[
                        { label: 'Einträge', value: entries.length },
                        {
                            label: 'Gesamt',
                            value: news.length,
                            href: '/neuigkeiten',
                        },
                        { label: 'Angeheftet', value: pinnedCount },
                    ]}
                    note={
                        <>
                            Diese Rubrik sammelt Meldungen aus Wendessen. Das
                            Register ordnet sie nach Datum.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Register · Nachrichten"
                title="Neuigkeiten"
                lede={`Meldungen aus Wendessen in der Rubrik ${kategorie}, geordnet nach Datum. Angeheftete Einträge bleiben oben stehen.`}
            />

            <NewsList
                news={entries}
                categories={categories}
                active={kategorie}
            />
        </Leaf>
    );
}
