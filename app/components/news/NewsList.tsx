import Link from 'next/link';
import type { NewsItem } from '@/lib/database';
import { Empty, SectionHead } from '@/app/components/register/Layout';
import { Entry } from '@/app/components/register/Entry';
import { yearOf } from '@/app/lib/register-format';
import { excerptOf } from './content';
import styles from './news-list.module.css';

export function categoryHref(category: string): string {
    return `/neuigkeiten/rubrik/${encodeURIComponent(category)}`;
}

/** The ruled rail plus the entry list, shared by index and category pages. */
export function NewsList({
    news,
    categories,
    active,
}: {
    news: NewsItem[];
    categories: string[];
    active: string | null;
}) {
    return (
        <>
            <div className={styles.filters}>
                <p className="rail-label" id="rubrik">
                    Rubrik
                </p>
                <nav className="rail" aria-labelledby="rubrik">
                    <Link
                        href="/neuigkeiten"
                        aria-current={!active ? 'true' : undefined}
                    >
                        Alle
                    </Link>
                    {categories.map((category) => (
                        <Link
                            key={category}
                            href={categoryHref(category)}
                            aria-current={active === category ? 'true' : undefined}
                        >
                            {category}
                        </Link>
                    ))}
                </nav>
            </div>

            <SectionHead
                title={active ?? 'Alle Nachrichten'}
                more="/dorfleben/archiv"
                moreLabel="Archiv"
            />

            {news.length > 0 ? (
                <div className="entries">
                    {news.map((item) => (
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
            ) : active ? (
                <Empty
                    title={`Keine Nachrichten in „${active}“`}
                    action={
                        <Link className="btn" href="/neuigkeiten">
                            Alle Rubriken
                        </Link>
                    }
                >
                    In dieser Rubrik liegt noch kein Eintrag vor.
                </Empty>
            ) : (
                <Empty
                    title="Keine Nachrichten verzeichnet"
                    action={
                        <Link className="btn" href="/">
                            Zur Startseite
                        </Link>
                    }
                >
                    Die Redaktion hat den ersten Beitrag noch nicht
                    verzeichnet.
                </Empty>
            )}
        </>
    );
}
