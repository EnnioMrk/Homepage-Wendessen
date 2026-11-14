'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Descendant } from 'slate';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import ArticleRenderer from '@/app/components/news/ArticleRenderer';
import { dateLong, dateShort } from '@/app/lib/register-format';
import s from './archiv.module.css';

export interface ArchiveItem {
    id: number;
    title: string;
    author?: string;
    category?: string;
    created_date?: string;
    content: string;
    created_at: string;
    updated_at: string;
}

function parseRichContent(content: string): Descendant[] | null {
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed as Descendant[];
        }
    } catch {
        // Plain text fallback is handled by the caller.
    }
    return null;
}

function excerptOf(content: string): string {
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
            const text = parsed
                .map((node: { children?: { text?: string }[] }) =>
                    (node.children ?? [])
                        .map((child) => child.text ?? '')
                        .join('')
                )
                .join(' ')
                .trim();
            if (text) return text;
        }
    } catch {
        // Plain text content.
    }
    return content.slice(0, 150) + (content.length > 150 ? '…' : '');
}

function documentDate(item: ArchiveItem): string {
    const value = item.created_date || item.created_at;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : dateShort(date);
}

function longDate(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : dateLong(date);
}

interface AdminArchiveProps {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

export default function AdminArchive({
    canCreate,
    canEdit,
    canDelete,
}: AdminArchiveProps) {
    const [items, setItems] = useState<ArchiveItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [reloadKey, setReloadKey] = useState(0);
    const [previewItem, setPreviewItem] = useState<ArchiveItem | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ArchiveItem | null>(null);
    const [deleting, setDeleting] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/archive');
                if (!response.ok) {
                    throw new Error(`Status ${response.status}`);
                }
                const data = (await response.json()) as ArchiveItem[];
                if (!cancelled) setItems(Array.isArray(data) ? data : []);
            } catch (loadError) {
                console.error('Error fetching archive items:', loadError);
                if (!cancelled) {
                    setError('Das Archiv konnte nicht geladen werden.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (previewItem && !dialog.open) dialog.showModal();
        if (!previewItem && dialog.open) dialog.close();
    }, [previewItem]);

    const categories = useMemo(
        () =>
            [...new Set(items.map((item) => item.category).filter(Boolean))].sort(
                (a, b) => (a as string).localeCompare(b as string, 'de')
            ) as string[],
        [items]
    );

    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return items.filter((item) => {
            if (category && item.category !== category) return false;
            if (!needle) return true;
            return [item.title, item.author ?? '', item.category ?? '']
                .join(' ')
                .toLowerCase()
                .includes(needle);
        });
    }, [items, query, category]);

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);
        setError(null);
        try {
            const response = await fetch(`/api/archive/${deleteTarget.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                let message = 'Der Eintrag konnte nicht gelöscht werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }
            setSuccess(`„${deleteTarget.title}“ wurde gelöscht.`);
            setDeleteTarget(null);
            setReloadKey((key) => key + 1);
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Der Eintrag konnte nicht gelöscht werden.'
            );
        } finally {
            setDeleting(false);
        }
    }

    const previewContent = previewItem
        ? parseRichContent(previewItem.content)
        : null;

    return (
        <div>
            <AdminHead
                title="Dorfarchiv"
                sub="Historische Dokumente und Texte · Einträge mit Datum und Herkunft"
                actions={
                    canCreate ? (
                        <Link
                            className="btn btn--primary btn--sm"
                            href="/admin/archiv/erstellen"
                        >
                            Neuer Eintrag
                        </Link>
                    ) : undefined
                }
            />

            {success && (
                <div className="notice notice--ok" role="status">
                    <strong>Gespeichert</strong>
                    <span>{success}</span>
                    <button
                        type="button"
                        className="btn btn--quiet btn--sm"
                        onClick={() => setSuccess(null)}
                    >
                        Schließen
                    </button>
                </div>
            )}

            {error && (
                <div className="notice notice--error" role="alert">
                    <strong>Fehler</strong>
                    <span>{error}</span>
                    <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => setReloadKey((key) => key + 1)}
                    >
                        Erneut laden
                    </button>
                </div>
            )}

            {deleteTarget && (
                <div className={`notice notice--warn ${s.confirm}`}>
                    <p>
                        Soll „{deleteTarget.title}“ endgültig aus dem Archiv
                        entfernt werden? Der Text kann danach nicht
                        wiederhergestellt werden.
                    </p>
                    <span className="admin-actions">
                        <button
                            type="button"
                            className="btn btn--quiet btn--sm"
                            onClick={() => setDeleteTarget(null)}
                            disabled={deleting}
                        >
                            Abbrechen
                        </button>
                        <button
                            type="button"
                            className="btn btn--danger btn--sm"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Löschen …' : 'Endgültig löschen'}
                        </button>
                    </span>
                </div>
            )}

            <div className="admin-filter">
                <div className="field">
                    <label htmlFor="archive-search">Suchen</label>
                    <input
                        id="archive-search"
                        className="input"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Titel, Autor oder Kategorie"
                    />
                </div>
                <div className="field">
                    <label htmlFor="archive-category">Kategorie</label>
                    <select
                        id="archive-category"
                        className="select"
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                    >
                        <option value="">Alle Kategorien</option>
                        {categories.map((entry) => (
                            <option key={entry} value={entry}>
                                {entry}
                            </option>
                        ))}
                    </select>
                </div>
                {(query || category) && (
                    <button
                        type="button"
                        className="btn btn--quiet btn--sm"
                        onClick={() => {
                            setQuery('');
                            setCategory('');
                        }}
                    >
                        Filter zurücksetzen
                    </button>
                )}
            </div>

            {loading ? (
                <p className="admin-empty" role="status">
                    Archiv wird geladen …
                </p>
            ) : items.length === 0 ? (
                <div className="admin-empty">
                    <h2>Noch keine Einträge</h2>
                    <p>
                        Das Dorfarchiv ist leer. Der erste Eintrag kann mit
                        Titel, Herkunft und Datum angelegt werden.
                    </p>
                    {canCreate && (
                        <Link
                            className="btn btn--primary btn--sm"
                            href="/admin/archiv/erstellen"
                        >
                            Ersten Eintrag anlegen
                        </Link>
                    )}
                </div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">
                    <h2>Kein Eintrag für diese Auswahl</h2>
                    <p>Setzen Sie Suche oder Kategorie zurück.</p>
                    <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => {
                            setQuery('');
                            setCategory('');
                        }}
                    >
                        Filter zurücksetzen
                    </button>
                </div>
            ) : (
                <Panel
                    title="Verzeichnete Einträge"
                    flush
                    actions={
                        <span className="tally">
                            {filtered.length} von {items.length}
                        </span>
                    }
                >
                    <div className={s.tableWrap}>
                        <table className="data">
                            <thead>
                                <tr>
                                    <th scope="col">Titel</th>
                                    <th scope="col">Kategorie</th>
                                    <th scope="col">Autor</th>
                                    <th scope="col">Dokumentdatum</th>
                                    <th scope="col" className="right">
                                        Aktionen
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <span className={s.titleCell}>
                                                <strong>{item.title}</strong>
                                                <span className={s.excerpt}>
                                                    {excerptOf(item.content)}
                                                </span>
                                            </span>
                                        </td>
                                        <td>
                                            {item.category ? (
                                                <span className="stamp stamp--info">
                                                    {item.category}
                                                </span>
                                            ) : (
                                                <span className="muted">
                                                    ohne Kategorie
                                                </span>
                                            )}
                                        </td>
                                        <td>{item.author || '—'}</td>
                                        <td className="num">
                                            {documentDate(item)}
                                        </td>
                                        <td>
                                            <span className={s.actions}>
                                                <button
                                                    type="button"
                                                    className="btn btn--quiet btn--sm"
                                                    onClick={() =>
                                                        setPreviewItem(item)
                                                    }
                                                >
                                                    Vorschau
                                                </button>
                                                {canEdit && (
                                                    <Link
                                                        className="btn btn--quiet btn--sm"
                                                        href={`/admin/archiv/bearbeiten/${item.id}`}
                                                    >
                                                        Bearbeiten
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        className="btn btn--danger btn--sm"
                                                        onClick={() =>
                                                            setDeleteTarget(item)
                                                        }
                                                    >
                                                        Löschen
                                                    </button>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            <dialog
                ref={dialogRef}
                className="dialog"
                aria-labelledby="archive-preview-title"
                onClose={() => setPreviewItem(null)}
                onClick={(event) => {
                    if (event.target === dialogRef.current) {
                        setPreviewItem(null);
                    }
                }}
            >
                {previewItem && (
                    <>
                        <div className="dialog-head">
                            <div>
                                <p className="tally">Vorschau</p>
                                <h2 id="archive-preview-title">
                                    {previewItem.title}
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={() => setPreviewItem(null)}
                                aria-label="Vorschau schließen"
                            >
                                ×
                            </button>
                        </div>
                        <div className="dialog-body">
                            <div className={s.dialogMeta}>
                                {previewItem.category && (
                                    <span className="stamp stamp--info">
                                        {previewItem.category}
                                    </span>
                                )}
                                {previewItem.author && (
                                    <span>von {previewItem.author}</span>
                                )}
                                {previewItem.created_date && (
                                    <span>
                                        {longDate(previewItem.created_date)}
                                    </span>
                                )}
                            </div>
                            <div className={`prose ${s.dialogBody}`}>
                                {previewContent ? (
                                    <ArticleRenderer content={previewContent} />
                                ) : (
                                    previewItem.content
                                        .split(/\n{2,}/)
                                        .map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))
                                )}
                            </div>
                        </div>
                        <div className="dialog-foot">
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={() => setPreviewItem(null)}
                            >
                                Schließen
                            </button>
                            {canEdit && (
                                <Link
                                    className="btn"
                                    href={`/admin/archiv/bearbeiten/${previewItem.id}`}
                                >
                                    Bearbeiten
                                </Link>
                            )}
                        </div>
                    </>
                )}
            </dialog>

            <p style={{ marginTop: 'var(--s4)' }}>
                <Link className="btn btn--quiet btn--sm" href="/admin/dashboard">
                    Zum Schreibtisch
                </Link>
            </p>
        </div>
    );
}
