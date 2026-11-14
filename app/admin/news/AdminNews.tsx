'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ArticleRenderer from '@/app/components/news/ArticleRenderer';
import { usePermissions } from '@/lib/usePermissions';
import { AdminHead } from '@/app/components/admin/AdminPage';
import { dateShort } from '@/app/lib/register-format';
import styles from './news.module.css';

interface NewsItem {
    id: string;
    title: string;
    content?: string;
    category: string;
    publishedDate: string;
    articleId?: string;
    isPinned?: boolean;
    pinnedAt?: string;
    pinnedOrder?: number;
}

import { NEWS_CATEGORY_MAP } from '@/lib/constants/categories';

const categoryLabel = (categoryId: string) =>
    NEWS_CATEGORY_MAP[categoryId]?.label || categoryId;

const extractPreview = (content: unknown): string => {
    try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;

        if (Array.isArray(parsed) && parsed.length > 0) {
            const first = parsed[0] as unknown;
            if (
                typeof first === 'object' &&
                first !== null &&
                'children' in (first as Record<string, unknown>) &&
                Array.isArray((first as Record<string, unknown>).children)
            ) {
                const children = (first as Record<string, unknown>)
                    .children as unknown[];
                const texts = children
                    .map((child) => {
                        if (
                            typeof child === 'object' &&
                            child !== null &&
                            'text' in (child as Record<string, unknown>)
                        ) {
                            const maybe = (child as Record<string, unknown>).text;
                            return typeof maybe === 'string' ? maybe : '';
                        }
                        return '';
                    })
                    .filter(Boolean)
                    .join(' ');
                return texts.substring(0, 200);
            }
        }

        return 'Vorschau nicht verfügbar';
    } catch {
        return typeof content === 'string'
            ? content.substring(0, 200)
            : 'Vorschau nicht verfügbar';
    }
};

function useOverlay(open: boolean, onClose: () => void) {
    const ref = useRef<HTMLDivElement>(null);
    const closeRef = useRef(onClose);

    useEffect(() => {
        closeRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) return;
        const element = ref.current;
        if (!element) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const focusable = () =>
            Array.from(
                element.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                ),
            ).filter((node) => node.offsetParent !== null);

        focusable()[0]?.focus();

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                closeRef.current();
                return;
            }
            if (event.key !== 'Tab') return;
            const items = focusable();
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('keydown', handleKey);
            previouslyFocused?.focus();
        };
    }, [open]);

    return ref;
}

export default function AdminNews() {
    const { hasPermission } = usePermissions();

    const canCreate = hasPermission('news.create');
    const canEdit = hasPermission('news.edit');
    const canDelete = hasPermission('news.delete');
    const canPin = hasPermission('news.pin');

    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('date');
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [flash, setFlash] = useState<string | null>(null);
    const [pinnedCount, setPinnedCount] = useState(0);
    const [pinLoading, setPinLoading] = useState<string | null>(null);
    const [isReordering, setIsReordering] = useState(false);
    const [reorderLoading, setReorderLoading] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);

    useEffect(() => {
        fetchNews();
    }, []);

    useEffect(() => {
        if (!flash) return;
        const timer = window.setTimeout(() => setFlash(null), 4000);
        return () => window.clearTimeout(timer);
    }, [flash]);

    const fetchNews = async (showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const response = await fetch('/api/admin/news');
            if (response.ok) {
                const data = await response.json();
                const newsItems = data.news || [];
                setNews(newsItems);
                setPinnedCount(
                    newsItems.filter((n: NewsItem) => n.isPinned).length,
                );
                setError(null);
            } else {
                setError('Fehler beim Laden der Nachrichten');
            }
        } catch (fetchError) {
            console.error('Error fetching news:', fetchError);
            setError('Fehler beim Laden der Nachrichten');
        } finally {
            setLoading(false);
        }
    };

    const pinnedNewsItems = news
        .filter((item) => item.isPinned)
        .sort((a, b) => (a.pinnedOrder || 0) - (b.pinnedOrder || 0));

    const handleReorder = async (orderedIds: string[]) => {
        setReorderLoading(true);
        try {
            const response = await fetch('/api/admin/news/reorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderedIds }),
            });

            if (response.ok) {
                await fetchNews();
                setFlash('Reihenfolge gespeichert.');
            } else {
                setError('Fehler beim Speichern der Reihenfolge');
            }
        } catch (reorderError) {
            console.error('Reorder error:', reorderError);
            setError('Fehler beim Speichern der Reihenfolge');
        } finally {
            setReorderLoading(false);
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newPinned = [...pinnedNewsItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newPinned.length) {
            const temp = newPinned[index];
            newPinned[index] = newPinned[targetIndex];
            newPinned[targetIndex] = temp;

            handleReorder(newPinned.map((n) => n.id));
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/news/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setNews((prev) => prev.filter((item) => item.id !== id));
                setPinnedCount((prev) => {
                    const item = news.find((n) => n.id === id);
                    return item?.isPinned ? prev - 1 : prev;
                });
                setError(null);
                setFlash('Nachricht gelöscht.');
            } else {
                const errorData = await response.json();
                setError(
                    errorData.error || 'Fehler beim Löschen der Nachricht',
                );
            }
        } catch (deleteError) {
            console.error('Delete error:', deleteError);
            setError('Fehler beim Löschen der Nachricht');
        }
    };

    const handleTogglePin = async (id: string, isPinned: boolean) => {
        setPinLoading(id);
        try {
            const response = await fetch(`/api/admin/news/${id}/pin`, {
                method: isPinned ? 'DELETE' : 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                setNews((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? {
                                  ...item,
                                  isPinned:
                                      data.news.isPinned ||
                                      data.news.is_pinned,
                                  pinnedAt:
                                      data.news.pinnedAt ||
                                      data.news.pinned_at,
                              }
                            : item,
                    ),
                );
                setPinnedCount((prev) => (isPinned ? prev - 1 : prev + 1));
                setError(null);
                setFlash(
                    isPinned
                        ? 'Anheftung gelöst.'
                        : 'Nachricht angeheftet. Sie erscheint oben auf der Startseite.',
                );
            } else {
                const errorData = await response.json();
                setError(
                    errorData.error || 'Fehler beim Ändern des Pin-Status',
                );
            }
        } catch (pinError) {
            console.error('Pin toggle error:', pinError);
            setError('Fehler beim Ändern des Pin-Status');
        } finally {
            setPinLoading(null);
        }
    };

    const sortedAndFilteredNews = news
        .filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (item.content &&
                    item.content
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));
            return matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title
                        .toLowerCase()
                        .localeCompare(b.title.toLowerCase());
                case 'category':
                    return a.category
                        .toLowerCase()
                        .localeCompare(b.category.toLowerCase());
                case 'date':
                    return (
                        new Date(b.publishedDate).getTime() -
                        new Date(a.publishedDate).getTime()
                    );
                default:
                    return 0;
            }
        });

    const previewContent = (item: NewsItem) => {
        if (typeof item.content !== 'string') return item.content || [];
        try {
            return JSON.parse(item.content);
        } catch {
            return [];
        }
    };

    const previewRef = useOverlay(selectedNews !== null, () =>
        setSelectedNews(null),
    );
    const deleteRef = useOverlay(newsToDelete !== null, () =>
        setNewsToDelete(null),
    );

    return (
        <div>
            <AdminHead
                title="Nachrichten"
                sub={
                    loading
                        ? 'Register der Nachrichten'
                        : `${news.length} ${
                              news.length === 1 ? 'Eintrag' : 'Einträge'
                          } · ${pinnedCount}/3 angeheftet`
                }
                actions={
                    <>
                        {canPin && pinnedCount > 1 && (
                            <button
                                type="button"
                                className="btn btn--quiet btn--sm"
                                onClick={() => setIsReordering(!isReordering)}
                                aria-pressed={isReordering}
                            >
                                {isReordering
                                    ? 'Reihenfolge schließen'
                                    : 'Reihenfolge ändern'}
                            </button>
                        )}
                        {canCreate && (
                            <Link
                                className="btn btn--primary"
                                href="/admin/news/erstellen"
                            >
                                Nachricht schreiben
                            </Link>
                        )}
                    </>
                }
            />

            {flash && (
                <div
                    className="notice notice--ok"
                    role="status"
                    style={{ marginBottom: 'var(--s4)' }}
                >
                    <strong>Gespeichert</strong>
                    <span>{flash}</span>
                </div>
            )}

            {error && (
                <div
                    className="notice notice--error"
                    role="alert"
                    style={{ marginBottom: 'var(--s4)' }}
                >
                    <strong>Nicht abgeschlossen</strong>
                    <span>{error}</span>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 'var(--s2)',
                            marginTop: 'var(--s2)',
                        }}
                    >
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={() => fetchNews(true)}
                        >
                            Erneut laden
                        </button>
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={() => setError(null)}
                        >
                            Hinweis schließen
                        </button>
                    </div>
                </div>
            )}

            {isReordering && pinnedNewsItems.length > 1 && (
                <div className={`panel ${styles.reorderPanel}`}>
                    <div className="panel-head">
                        <h2>Reihenfolge der angehefteten Nachrichten</h2>
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={() => setIsReordering(false)}
                        >
                            Schließen
                        </button>
                    </div>
                    <div className="panel-body">
                        {pinnedNewsItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={styles.reorderRow}
                            >
                                <span className={styles.position}>
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <div>
                                    <p className={styles.reorderTitle}>
                                        {item.title}
                                    </p>
                                    <p className={styles.reorderMeta}>
                                        {categoryLabel(item.category)}
                                    </p>
                                </div>
                                <div className={styles.reorderButtons}>
                                    <button
                                        type="button"
                                        className="btn btn--sm btn--quiet"
                                        onClick={() =>
                                            moveItem(index, 'up')
                                        }
                                        disabled={
                                            index === 0 || reorderLoading
                                        }
                                        aria-label={`${item.title} nach oben`}
                                    >
                                        Nach oben
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn--sm btn--quiet"
                                        onClick={() =>
                                            moveItem(index, 'down')
                                        }
                                        disabled={
                                            index ===
                                                pinnedNewsItems.length - 1 ||
                                            reorderLoading
                                        }
                                        aria-label={`${item.title} nach unten`}
                                    >
                                        Nach unten
                                    </button>
                                </div>
                            </div>
                        ))}
                        <p className={styles.reorderHint}>
                            Die Reihenfolge bestimmt, welche Nachrichten in
                            welcher Folge auf der Startseite oben erscheinen.
                        </p>
                    </div>
                </div>
            )}

            <div className="filterbar">
                <div className="field grow">
                    <label htmlFor="news-search">Suche</label>
                    <input
                        id="news-search"
                        className="input"
                        type="search"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        placeholder="Titel, Rubrik oder Inhalt …"
                    />
                </div>
                <div className="field">
                    <label htmlFor="news-sort">Sortierung</label>
                    <select
                        id="news-sort"
                        className="select"
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                    >
                        <option value="date">Nach Datum</option>
                        <option value="title">Nach Titel</option>
                        <option value="category">Nach Rubrik</option>
                    </select>
                </div>
                <p className="count">
                    {sortedAndFilteredNews.length} von {news.length} Einträgen
                </p>
            </div>

            {loading ? (
                <div className="panel">
                    <div className="panel-body">
                        <p className="muted">Lade Nachrichten …</p>
                    </div>
                </div>
            ) : sortedAndFilteredNews.length === 0 ? (
                <div className="empty">
                    <h3>
                        {news.length === 0
                            ? 'Noch keine Nachricht verzeichnet'
                            : 'Keine Nachricht gefunden'}
                    </h3>
                    <p>
                        {news.length === 0
                            ? 'Das Register der Nachrichten ist leer. Der erste Artikel lässt sich mit dem Editor schreiben und erscheint danach auf der Startseite.'
                            : 'Die Suche ergab keinen Treffer. Setzen Sie den Suchbegriff zurück oder wählen Sie eine andere Sortierung.'}
                    </p>
                    {news.length === 0 && canCreate && (
                        <Link
                            className="btn btn--primary"
                            href="/admin/news/erstellen"
                        >
                            Erste Nachricht schreiben
                        </Link>
                    )}
                </div>
            ) : (
                <table className={`data ${styles.table}`}>
                    <thead>
                        <tr>
                            <th scope="col">Datum</th>
                            <th scope="col">Titel</th>
                            <th scope="col" className={styles.colRubric}>
                                Rubrik
                            </th>
                            <th scope="col">Zustand</th>
                            <th scope="col" className="right">
                                Aktionen
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredNews.map((item) => (
                            <tr key={item.id}>
                                <td
                                    className={styles.cellDate}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        fontSize: 'var(--small)',
                                    }}
                                >
                                    {dateShort(new Date(item.publishedDate))}
                                </td>
                                <td className={styles.cellTitle}>
                                    <button
                                        type="button"
                                        className={styles.titleBtn}
                                        onClick={() => setSelectedNews(item)}
                                    >
                                        {item.title}
                                    </button>
                                    {item.content && (
                                        <p className={styles.excerpt}>
                                            {extractPreview(item.content)} …
                                        </p>
                                    )}
                                </td>
                                <td className={styles.colRubric}>
                                    <span className={styles.rubric}>
                                        {categoryLabel(item.category)}
                                    </span>
                                </td>
                                <td className={styles.cellState}>
                                    {item.isPinned ? (
                                        <span className="stamp stamp--pinned">
                                            Angeheftet
                                        </span>
                                    ) : (
                                        <span className={styles.stateOpen}>
                                            Veröffentlicht
                                        </span>
                                    )}
                                </td>
                                <td className={`right ${styles.cellActions}`}>
                                    <div className={styles.actions}>
                                        <button
                                            type="button"
                                            className="btn btn--sm btn--quiet"
                                            onClick={() => setSelectedNews(item)}
                                        >
                                            Vorschau
                                        </button>
                                        {canPin && (
                                            <button
                                                type="button"
                                                className="btn btn--sm btn--quiet"
                                                onClick={() =>
                                                    handleTogglePin(
                                                        item.id,
                                                        Boolean(item.isPinned),
                                                    )
                                                }
                                                disabled={
                                                    pinLoading === item.id ||
                                                    (!item.isPinned &&
                                                        pinnedCount >= 3)
                                                }
                                                title={
                                                    item.isPinned
                                                        ? 'Nicht mehr anpinnen'
                                                        : pinnedCount >= 3
                                                          ? 'Maximal 3 angepinnte Nachrichten erlaubt'
                                                          : 'Auf der Startseite anpinnen'
                                                }
                                            >
                                                {item.isPinned
                                                    ? 'Ablösen'
                                                    : 'Anpinnen'}
                                            </button>
                                        )}
                                        {canEdit && (
                                            <Link
                                                className="btn btn--sm btn--quiet"
                                                href={`/admin/news/bearbeiten/${item.id}`}
                                            >
                                                Bearbeiten
                                            </Link>
                                        )}
                                        {canDelete && (
                                            <button
                                                type="button"
                                                className="btn btn--sm btn--danger"
                                                onClick={() =>
                                                    setNewsToDelete(item)
                                                }
                                            >
                                                Löschen
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedNews && (
                <div
                    className={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget)
                            setSelectedNews(null);
                    }}
                >
                    <div
                        ref={previewRef}
                        className={`dialog ${styles.dialogWide}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="news-preview-title"
                    >
                        <div className="dialog-head">
                            <div>
                                <p className="small muted">Vorschau</p>
                                <h2 id="news-preview-title">
                                    {selectedNews.title}
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={() => setSelectedNews(null)}
                                aria-label="Vorschau schließen"
                            >
                                ×
                            </button>
                        </div>
                        <div className="dialog-body">
                            <div className={styles.articleHead}>
                                <span className={styles.rubric}>
                                    {categoryLabel(selectedNews.category)}
                                </span>
                                <div className={styles.articleMeta}>
                                    <span>
                                        {dateShort(
                                            new Date(
                                                selectedNews.publishedDate,
                                            ),
                                        )}
                                    </span>
                                    {selectedNews.isPinned && (
                                        <span className="stamp stamp--pinned">
                                            Angeheftet
                                        </span>
                                    )}
                                </div>
                            </div>
                            {selectedNews.content ? (
                                <div className="prose">
                                    <ArticleRenderer
                                        content={previewContent(selectedNews)}
                                    />
                                </div>
                            ) : (
                                <p className="muted">
                                    Für diesen Eintrag ist kein Inhalt
                                    verzeichnet.
                                </p>
                            )}
                        </div>
                        <div className={`dialog-foot ${styles.footSticky}`}>
                            {canEdit && (
                                <Link
                                    className="btn btn--primary"
                                    href={`/admin/news/bearbeiten/${selectedNews.id}`}
                                >
                                    Bearbeiten
                                </Link>
                            )}
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={() => setSelectedNews(null)}
                            >
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {newsToDelete && (
                <div
                    className={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget)
                            setNewsToDelete(null);
                    }}
                >
                    <div
                        ref={deleteRef}
                        className="dialog"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="news-delete-title"
                    >
                        <div className="dialog-head">
                            <h2 id="news-delete-title">Nachricht löschen</h2>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={() => setNewsToDelete(null)}
                                aria-label="Dialog schließen"
                            >
                                ×
                            </button>
                        </div>
                        <div className="dialog-body">
                            <div className="notice notice--warn">
                                <strong>{newsToDelete.title}</strong>
                                <span>
                                    Der Eintrag wird dauerhaft aus dem Register
                                    entfernt. Diese Aktion kann nicht
                                    rückgängig gemacht werden.
                                </span>
                            </div>
                        </div>
                        <div className={`dialog-foot ${styles.footSticky}`}>
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={() => setNewsToDelete(null)}
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                className="btn btn--danger"
                                onClick={async () => {
                                    const target = newsToDelete;
                                    setNewsToDelete(null);
                                    await handleDelete(target.id);
                                }}
                            >
                                Endgültig löschen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
