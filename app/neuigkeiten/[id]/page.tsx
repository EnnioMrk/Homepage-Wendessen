import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleBody } from '@/app/components/news/ArticleBody';
import { excerptOf } from '@/app/components/news/content';
import { loadNews } from '@/app/components/news/news-data';
import {
    Leaf,
    Margin,
    Notice,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { Entry } from '@/app/components/register/Entry';
import { dateLong, yearOf } from '@/app/lib/register-format';
import type { NewsItem } from '@/lib/database';
import styles from '../news.module.css';
import { pageToday } from '@/app/lib/page-today';

function findArticle(news: NewsItem[], articleId: string): NewsItem | null {
    return news.find((item) => item.articleId === articleId) ?? null;
}

function descriptionOf(article: NewsItem): string {
    return (
        excerptOf(article.content, 160) ||
        `Nachricht aus Wendessen, Rubrik ${article.category}.`
    );
}

export async function generateStaticParams() {
    const news = await loadNews();
    if (!news) return [];
    return news.map((item) => ({ id: item.articleId }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const news = await loadNews();

    if (!news) {
        return {
            title: 'Nachricht nicht erreichbar',
            robots: { index: false, follow: false },
        };
    }

    const article = findArticle(news, id);

    if (!article) {
        return {
            title: 'Eintrag nicht gefunden',
            robots: { index: false, follow: false },
        };
    }

    const description = descriptionOf(article);

    return {
        title: article.title,
        description,
        alternates: { canonical: `/neuigkeiten/${article.articleId}` },
        openGraph: {
            type: 'article',
            title: article.title,
            description,
            publishedTime: article.publishedDate.toISOString(),
        },
    };
}

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
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
                                Register antwortet, steht der Eintrag wieder da.
                            </>
                        }
                    />
                }
            >
                <PageHead
                    kicker="Register · Nachrichten"
                    title="Nachricht nicht erreichbar"
                />
                <Notice
                    tone="error"
                    title="Das Register antwortet nicht"
                >
                    Die Nachricht konnte nicht geladen werden.{' '}
                    <Link className="link" href={`/neuigkeiten/${id}`}>
                        Erneut laden
                    </Link>
                </Notice>
            </Leaf>
        );
    }

    const article = findArticle(news, id);
    if (!article) notFound();

    const publishedDate = article.publishedDate;
    const pinnedCount = news.filter((item) => item.isPinned).length;
    const others = news
        .filter((item) => item.articleId !== article.articleId)
        .slice(0, 3);

    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Nachrichten"
                    tallies={[
                        {
                            label: 'Einträge',
                            value: news.length,
                            href: '/neuigkeiten',
                        },
                        { label: 'Angeheftet', value: pinnedCount },
                    ]}
                    note={
                        <>
                            Diese Nachricht steht im Register bei den Meldungen
                            aus Wendessen. Angeheftete Einträge bleiben oben.
                        </>
                    }
                />
            }
        >
            <nav className={styles.back} aria-label="Zurück">
                <Link className={styles.backLink} href="/neuigkeiten">
                    ← Alle Nachrichten
                </Link>
            </nav>

            <article>
                <header className="article-head">
                    <p className="kicker">
                        {article.category} · {dateLong(publishedDate)}
                    </p>
                    <h1>{article.title}</h1>
                    {article.isPinned && (
                        <p className={styles.pinned}>
                            <span className="stamp stamp--pinned">
                                Angeheftet
                            </span>
                        </p>
                    )}
                </header>

                <div className="article-body">
                    <ArticleBody content={article.content} />
                </div>
            </article>

            {others.length > 0 && (
                <section className="block" aria-labelledby="weitere">
                    <SectionHead
                        title="Weitere Nachrichten"
                        id="weitere"
                        more="/neuigkeiten"
                        moreLabel="Alle Nachrichten"
                    />
                    <div className="entries">
                        {others.map((item) => (
                            <Entry
                                key={item.id}
                                date={item.publishedDate}
                                title={item.title}
                                href={`/neuigkeiten/${item.articleId}`}
                                meta={[item.category]}
                                description={excerptOf(item.content)}
                                state={item.isPinned ? 'decided' : 'open'}
                                stamp={item.isPinned ? 'Angeheftet' : undefined}
                                number={item.id}
                                showClock={false}
                                timeText={String(yearOf(item.publishedDate))}
                            />
                        ))}
                    </div>
                </section>
            )}
        </Leaf>
    );
}
