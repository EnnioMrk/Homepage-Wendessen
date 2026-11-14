import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Descendant } from 'slate';
import ArticleRenderer from '@/app/components/news/ArticleRenderer';
import { Leaf, Margin, PageHead } from '@/app/components/register/Layout';
import { dateLong } from '@/app/lib/register-format';
import { getArchiveItemById } from '@/lib/database';
import { pageToday } from '@/app/lib/page-today';

export async function generateStaticParams() {
    // A build without a database runs in compile mode and prerenders nothing;
    // Cache Components still insists on a non-empty list, so give it a throwaway
    // param that mode never renders.
    if (!process.env.DATABASE_URL) return [{ id: '1' }];
    const { getArchiveItems } = await import('@/lib/database');
    const items = await getArchiveItems();
    return items.map((item) => ({ id: String(item.id) }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const item = await getArchiveItemById(id);

    if (!item) {
        // Resolve the 404 before the shell streams, so the not-found document
        // is complete in the HTML response (no-JS and crawler safe).
        notFound();
    }

    return {
        title: `${item.title} – Dorfarchiv`,
        description: `Archivierter Eintrag aus dem Dorfarchiv Wendessen: ${item.title}.`,
    };
}

function parseSlate(content: string): Descendant[] | null {
    try {
        const parsed: unknown = JSON.parse(content);
        return Array.isArray(parsed) ? (parsed as Descendant[]) : null;
    } catch {
        return null;
    }
}

function formatDate(value: string | undefined): string | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : dateLong(date);
}

export default async function ArchiveItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const item = await getArchiveItemById(id);

    // A missing row is a missing page, not a 200 with an apology.
    if (!item) {
        notFound();
    }

    const slate = parseSlate(item.content);
    const created = formatDate(item.created_at);
    const dated = formatDate(item.created_date);

    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Archiv"
                    tallies={[
                        ...(item.category
                            ? [{ label: 'Kategorie', value: item.category }]
                            : []),
                        ...(item.author
                            ? [{ label: 'Verfasser', value: item.author }]
                            : []),
                        ...(dated
                            ? [{ label: 'Datum', value: dated }]
                            : []),
                    ]}
                    note={
                        <>
                            Einträge des Dorfarchivs bleiben unverändert
                            stehen. Neuere Nachrichten stehen unter
                            Neuigkeiten.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s3)' }}>
                <Link className="link-quiet" href="/dorfleben/archiv">
                    ← Zurück zum Archiv
                </Link>
            </p>

            <PageHead
                kicker={
                    item.category
                        ? `Dorfarchiv · ${item.category}`
                        : 'Dorfarchiv'
                }
                title={item.title}
                lede={
                    <span className="small muted">
                        {[item.author, dated].filter(Boolean).join(' · ') ||
                            'Archivierter Eintrag'}
                    </span>
                }
            />

            <div className="article-body">
                {slate ? (
                    <ArticleRenderer content={slate} />
                ) : (
                    <div className="prose" style={{ whiteSpace: 'pre-wrap' }}>
                        {item.content}
                    </div>
                )}
            </div>

            <p className="article-foot">
                <span>
                    {created
                        ? `Archiviert am ${created}`
                        : 'Zeitpunkt der Archivierung nicht verzeichnet'}
                </span>
                <Link className="link-quiet" href="/dorfleben/archiv">
                    Alle Archiveinträge
                </Link>
            </p>
        </Leaf>
    );
}
