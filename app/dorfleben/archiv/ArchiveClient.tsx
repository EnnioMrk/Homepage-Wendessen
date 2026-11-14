'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { Empty } from '@/app/components/register/Layout';
import { Entry } from '@/app/components/register/Entry';

export interface ArchivedNewsRow {
    id: string;
    title: string;
    content?: unknown;
    category: string;
    publishedDate: Date | string;
    articleId: string;
}

export interface ArchiveDocumentRow {
    id: number | string;
    title: string;
    author?: string;
    category?: string;
    created_date?: string;
    content: string;
    created_at: string;
    href?: string;
}

type EntryKind = 'news' | 'document' | 'webseite';

interface ArchiveEntry {
    key: string;
    number?: string | number;
    kind: EntryKind;
    title: string;
    href: string;
    category?: string;
    author?: string;
    date?: Date | string;
    preview: string;
}

type FilterType = 'all' | EntryKind;
type SortKey = 'date-desc' | 'date-asc' | 'title';

const TYPE_LABEL: Record<EntryKind, string> = {
    news: 'Nachricht',
    document: 'Dokument',
    webseite: 'Webseite',
};

/** First non-empty paragraph out of a Slate JSON body, or the plain text. */
function textOf(content: unknown): string {
    if (typeof content !== 'string') return '';

    try {
        const parsed: unknown = JSON.parse(content);
        if (Array.isArray(parsed)) {
            for (const node of parsed) {
                if (
                    !node ||
                    typeof node !== 'object' ||
                    !Array.isArray((node as { children?: unknown[] }).children)
                ) {
                    continue;
                }

                const text = (node as { children: unknown[] }).children
                    .map((child) =>
                        child &&
                        typeof child === 'object' &&
                        'text' in child &&
                        typeof (child as { text?: unknown }).text === 'string'
                            ? (child as { text: string }).text
                            : '',
                    )
                    .join(' ')
                    .trim();

                if (text) return text;
            }
            return '';
        }
    } catch {
        // Not Slate JSON: plain text below.
    }

    return content;
}

function toDate(value: Date | string | undefined): Date | null {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function dateOf(item: ArchiveEntry): Date | null {
    return toDate(item.date);
}

function sortValue(item: ArchiveEntry): number | null {
    const date = dateOf(item);
    return date ? date.getTime() : null;
}

export default function ArchiveClient({
    archiveItems,
    archivedNews,
}: {
    archiveItems: ArchiveDocumentRow[];
    archivedNews: ArchivedNewsRow[];
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortKey>('date-desc');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const searchRef = useRef<HTMLInputElement>(null);

    const allItems = useMemo<ArchiveEntry[]>(() => {
        const news: ArchiveEntry[] = archivedNews.map((item) => ({
            key: `news-${item.id}`,
            number: item.id,
            kind: 'news',
            title: item.title,
            href: `/neuigkeiten/${item.articleId}`,
            category: item.category,
            date: item.publishedDate,
            preview: textOf(item.content),
        }));

        // The 2023 report is a page, not a database row. It stays in the list
        // so the archive keeps a complete face even when the tables are bare.
        const bericht2023: ArchiveEntry = {
            key: 'doc-ortsrat-bericht-2023',
            kind: 'webseite',
            title: 'Neujahrsgruß 2023 des Ortsbürgermeisters',
            href: '/dorfleben/archiv/ortsrat-bericht/2023',
            category: 'Bericht',
            author: 'Andreas M. Rink',
            date: '2023-01-01',
            preview:
                'Grußwort zum Jahresbeginn 2023 mit Rückblick auf 2022 und Ausblick auf die Themen des Ortsrates für 2023.',
        };

        const documents: ArchiveEntry[] = archiveItems.map((item) => ({
            key: `doc-${item.id}`,
            number: item.id,
            kind: 'document',
            title: item.title,
            href: item.href || `/dorfleben/archiv/${item.id}`,
            category: item.category,
            author: item.author,
            date: item.created_date || item.created_at,
            preview: textOf(item.content),
        }));

        return [...news, bericht2023, ...documents];
    }, [archiveItems, archivedNews]);

    const categories = useMemo(() => {
        const set = new Set<string>();
        for (const item of allItems) {
            if (item.category) set.add(item.category);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b, 'de'));
    }, [allItems]);

    const fuse = useMemo(
        () =>
            new Fuse(
                allItems.map((item) => ({
                    key: item.key,
                    title: item.title,
                    text: item.preview,
                    category: item.category ?? '',
                    author: item.author ?? '',
                })),
                {
                    keys: [
                        { name: 'title', weight: 2 },
                        'text',
                        'category',
                        'author',
                    ],
                    threshold: 0.3,
                    ignoreLocation: true,
                    minMatchCharLength: 3,
                    includeScore: true,
                },
            ),
        [allItems],
    );

    const visible = useMemo(() => {
        let items: ArchiveEntry[] = allItems;

        if (searchQuery.trim()) {
            const order = new Map(
                fuse
                    .search(searchQuery.trim())
                    .map((result, index) => [result.item.key, index] as const),
            );
            items = items.filter((item) => order.has(item.key));
            if (items.length > 1) {
                items = [...items].sort(
                    (a, b) =>
                        (order.get(a.key) ?? 0) - (order.get(b.key) ?? 0),
                );
            }
        }

        if (filterType !== 'all') {
            items = items.filter((item) => item.kind === filterType);
        }

        if (filterCategory !== 'all') {
            items = items.filter((item) => item.category === filterCategory);
        }

        return [...items].sort((a, b) => {
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title, 'de');
            }

            const aTime = sortValue(a);
            const bTime = sortValue(b);

            if (aTime === null && bTime === null) {
                return a.title.localeCompare(b.title, 'de');
            }
            if (aTime === null) return 1;
            if (bTime === null) return -1;

            return sortBy === 'date-asc' ? aTime - bTime : bTime - aTime;
        });
    }, [allItems, filterCategory, filterType, fuse, searchQuery, sortBy]);

    const hasActiveFilters =
        searchQuery.trim().length > 0 ||
        filterType !== 'all' ||
        filterCategory !== 'all' ||
        sortBy !== 'date-desc';

    const resetFilters = () => {
        setSearchQuery('');
        setFilterType('all');
        setFilterCategory('all');
        setSortBy('date-desc');
        searchRef.current?.focus();
    };

    return (
        <div>
            <div className="filterbar">
                <div className="field grow">
                    <label htmlFor="archiv-suche">Suche</label>
                    <input
                        ref={searchRef}
                        id="archiv-suche"
                        className="input"
                        type="search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Titel, Text, Kategorie, Verfasser"
                        autoComplete="off"
                    />
                </div>
                <div className="field">
                    <label htmlFor="archiv-typ">Typ</label>
                    <select
                        id="archiv-typ"
                        className="select"
                        value={filterType}
                        onChange={(event) =>
                            setFilterType(event.target.value as FilterType)
                        }
                    >
                        <option value="all">Alle Typen</option>
                        <option value="news">Nachrichten</option>
                        <option value="webseite">Webseite</option>
                        <option value="document">Dokumente</option>
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="archiv-kategorie">Kategorie</label>
                    <select
                        id="archiv-kategorie"
                        className="select"
                        value={filterCategory}
                        onChange={(event) =>
                            setFilterCategory(event.target.value)
                        }
                    >
                        <option value="all">Alle Kategorien</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="archiv-sortierung">Sortierung</label>
                    <select
                        id="archiv-sortierung"
                        className="select"
                        value={sortBy}
                        onChange={(event) =>
                            setSortBy(event.target.value as SortKey)
                        }
                    >
                        <option value="date-desc">Neueste zuerst</option>
                        <option value="date-asc">Älteste zuerst</option>
                        <option value="title">Alphabetisch</option>
                    </select>
                </div>
                <p className="count" aria-live="polite">
                    {visible.length} von {allItems.length}
                </p>
            </div>

            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--s2) var(--s4)',
                    marginBottom: 'var(--s3)',
                }}
            >
                <p className="small muted" style={{ margin: 0 }}>
                    Gesucht werden Titel, Text, Kategorie und Verfasser. Die
                    Suche findet auch ähnliche Schreibweisen.
                </p>
                {hasActiveFilters && (
                    <button
                        type="button"
                        className="btn btn--quiet btn--sm"
                        onClick={resetFilters}
                    >
                        Filter zurücksetzen
                    </button>
                )}
            </div>

            {visible.length === 0 ? (
                <Empty
                    title="Keine Ergebnisse gefunden"
                    action={
                        hasActiveFilters ? (
                            <button
                                type="button"
                                className="btn"
                                onClick={resetFilters}
                            >
                                Filter zurücksetzen
                            </button>
                        ) : undefined
                    }
                >
                    {hasActiveFilters
                        ? 'Für diese Suche und Filter liegt kein Eintrag vor. Versuchen Sie einen anderen Suchbegriff oder setzen Sie die Filter zurück.'
                        : 'Für diese Auswahl liegt kein Eintrag vor.'}
                </Empty>
            ) : (
                <div className="entries">
                    {visible.map((item) => {
                        const date = dateOf(item);
                        const meta = [item.category, item.author];
                        const facts = meta.filter(
                            (fact): fact is string => Boolean(fact),
                        );

                        if (date) {
                            return (
                                <Entry
                                    key={item.key}
                                    date={date}
                                    title={item.title}
                                    href={item.href}
                                    meta={meta}
                                    description={item.preview}
                                    stamp={TYPE_LABEL[item.kind]}
                                    number={item.number}
                                    showClock={false}
                                    timeText={String(date.getFullYear())}
                                />
                            );
                        }

                        return (
                            <Link
                                key={item.key}
                                className="entry"
                                href={item.href}
                                aria-label={item.title}
                            >
                                <span className="entry-date" aria-hidden="true">
                                    <span className="d">–</span>
                                    <span className="m">o. J.</span>
                                </span>
                                <span className="entry-body">
                                    <span className="entry-title">
                                        {item.title}
                                    </span>
                                    {facts.length > 0 && (
                                        <span className="entry-meta">
                                            {facts.map((fact) => (
                                                <span key={fact}>{fact}</span>
                                            ))}
                                        </span>
                                    )}
                                    {item.preview && (
                                        <span className="entry-desc">
                                            {item.preview}
                                        </span>
                                    )}
                                </span>
                                <span className="entry-state">
                                    <span className="stamp stamp--info">
                                        {TYPE_LABEL[item.kind]}
                                    </span>
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
