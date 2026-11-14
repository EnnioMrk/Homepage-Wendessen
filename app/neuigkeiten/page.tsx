import type { Metadata } from 'next';
import Link from 'next/link';
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

export const metadata: Metadata = {
    title: 'Neuigkeiten',
    description:
        'Nachrichten aus Wendessen im Register: Meldungen von Ortsrat, Vereinen und Redaktion, geordnet nach Datum und Rubrik.',
    alternates: { canonical: '/neuigkeiten' },
    openGraph: {
        type: 'website',
        title: 'Neuigkeiten · Wendessen',
        description:
            'Alle Meldungen aus Wendessen, wie sie ins Register eingetragen wurden.',
    },
};

export default async function NewsIndexPage() {
    const news = await loadNews();
    const categories = news ? newsCategories(news) : [];
    const pinnedCount = news?.filter((item) => item.isPinned).length ?? 0;

    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Register"
                    tallies={
                        news
                            ? [
                                  {
                                      label: 'Einträge',
                                      value: news.length,
                                      href: '/neuigkeiten',
                                  },
                                  { label: 'Angeheftet', value: pinnedCount },
                                  { label: 'Rubriken', value: categories.length },
                              ]
                            : undefined
                    }
                    note={
                        <>
                            Angeheftete Nachrichten stehen oben. Sonst gilt das
                            Datum: die jüngste Meldung zuerst.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Register · Nachrichten"
                title="Neuigkeiten"
                lede="Meldungen aus Wendessen, wie sie ins Register eingetragen wurden — jede Nachricht mit Rubrik, Datum und Jahrgang. Angeheftete Einträge bleiben oben stehen."
            />

            {news ? (
                <NewsList
                    news={news}
                    categories={categories}
                    active={null}
                />
            ) : (
                <Notice tone="error" title="Nachrichten konnten nicht geladen werden">
                    Das Register ist gerade nicht erreichbar.{' '}
                    <Link className="link" href="/neuigkeiten">
                        Erneut laden
                    </Link>
                </Notice>
            )}
        </Leaf>
    );
}
