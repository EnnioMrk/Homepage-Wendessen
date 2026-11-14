'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import { dateShort } from '@/app/lib/register-format';
import s from './wendessen.module.css';

interface CardSummary {
    title?: string;
}

export interface LayoutItem {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
    card_1?: CardSummary | null;
    card_2?: CardSummary | null;
    card_3?: CardSummary | null;
}

interface AdminWendessenClientProps {
    canManage?: boolean;
    canCreate?: boolean;
    flash?: string;
}

function cardTitles(layout: LayoutItem) {
    return [layout.card_1, layout.card_2, layout.card_3].map(
        (card, index) => ({
            index: index + 1,
            title: card?.title?.trim() || 'Ohne Titel',
        })
    );
}

export default function AdminWendessenClient({
    canManage = false,
    canCreate = false,
    flash,
}: AdminWendessenClientProps) {
    const [layouts, setLayouts] = useState<LayoutItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(flash ?? null);
    const [reloadKey, setReloadKey] = useState(0);
    const [activating, setActivating] = useState<number | null>(null);
    const [duplicating, setDuplicating] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<LayoutItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/admin/wendessen');
                if (!response.ok) {
                    throw new Error(`Status ${response.status}`);
                }
                const data = (await response.json()) as {
                    layouts?: LayoutItem[];
                };
                if (!cancelled) setLayouts(data.layouts ?? []);
            } catch (loadError) {
                console.error('Error fetching layouts:', loadError);
                if (!cancelled) {
                    setError('Die Layouts konnten nicht geladen werden.');
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

    const activeLayout = useMemo(
        () => layouts.find((layout) => layout.is_active) ?? null,
        [layouts]
    );

    async function activate(layout: LayoutItem) {
        setActivating(layout.id);
        setError(null);
        try {
            const response = await fetch(`/api/admin/wendessen/${layout.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: true }),
            });
            if (!response.ok) {
                let message = 'Das Layout konnte nicht aktiviert werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }
            setSuccess(`„${layout.name}“ ist jetzt das aktive Layout.`);
            setReloadKey((key) => key + 1);
        } catch (activateError) {
            setError(
                activateError instanceof Error
                    ? activateError.message
                    : 'Das Layout konnte nicht aktiviert werden.'
            );
        } finally {
            setActivating(null);
        }
    }

    async function duplicate(layout: LayoutItem) {
        if (!canCreate) return;
        setDuplicating(layout.id);
        setError(null);
        try {
            const response = await fetch('/api/admin/wendessen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: layout.name?.trim()
                        ? `${layout.name} (Kopie)`
                        : 'Layout Kopie',
                    card_1: layout.card_1,
                    card_2: layout.card_2,
                    card_3: layout.card_3,
                }),
            });
            if (!response.ok) {
                let message = 'Das Layout konnte nicht dupliziert werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }
            setSuccess(`„${layout.name}“ wurde als Kopie angelegt.`);
            setReloadKey((key) => key + 1);
        } catch (duplicateError) {
            setError(
                duplicateError instanceof Error
                    ? duplicateError.message
                    : 'Das Layout konnte nicht dupliziert werden.'
            );
        } finally {
            setDuplicating(null);
        }
    }

    async function remove() {
        if (!deleteTarget) return;
        setDeleting(true);
        setError(null);
        try {
            const response = await fetch(
                `/api/admin/wendessen/${deleteTarget.id}`,
                { method: 'DELETE' }
            );
            if (!response.ok) {
                let message = 'Das Layout konnte nicht gelöscht werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }
            setSuccess(`„${deleteTarget.name}“ wurde gelöscht.`);
            setDeleteTarget(null);
            setReloadKey((key) => key + 1);
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Das Layout konnte nicht gelöscht werden.'
            );
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div>
            <AdminHead
                title="Dorfwissen"
                sub="Drei Kacheln für die Startseite · ein Layout ist jeweils aktiv"
                actions={
                    canManage ? (
                        <Link
                            className="btn btn--primary btn--sm"
                            href="/admin/wendessen/neu"
                        >
                            Neues Layout
                        </Link>
                    ) : undefined
                }
            />

            {success && (
                <div className="notice notice--ok" role="status">
                    <strong>Ausgeführt</strong>
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
                        Soll das Layout „{deleteTarget.name}“ gelöscht werden?
                        Die drei Karten dieses Layouts entfallen damit. Das
                        aktive Layout kann nicht gelöscht werden.
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
                            onClick={remove}
                            disabled={deleting}
                        >
                            {deleting ? 'Löschen …' : 'Endgültig löschen'}
                        </button>
                    </span>
                </div>
            )}

            {loading ? (
                <p className="admin-empty" role="status">
                    Layouts werden geladen …
                </p>
            ) : layouts.length === 0 ? (
                <div className="admin-empty">
                    <h2>Keine Layouts vorhanden</h2>
                    <p>
                        Die Startseite zeigt in diesem Bereich nichts an, solange
                        kein Layout aktiv ist.
                    </p>
                    {canManage && (
                        <Link
                            className="btn btn--primary btn--sm"
                            href="/admin/wendessen/neu"
                        >
                            Erstes Layout anlegen
                        </Link>
                    )}
                </div>
            ) : (
                <Panel
                    title="Layouts"
                    flush
                    actions={
                        <span className="tally">
                            {layouts.length}{' '}
                            {layouts.length === 1 ? 'Layout' : 'Layouts'}
                            {activeLayout
                                ? ` · aktiv: ${activeLayout.name}`
                                : ' · kein aktives Layout'}
                        </span>
                    }
                >
                    <div className={s.layouts}>
                        <table className="data">
                            <thead>
                                <tr>
                                    <th scope="col">Layout</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Erstellt</th>
                                    <th scope="col" className="right">
                                        Aktionen
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {layouts.map((layout) => (
                                    <tr key={layout.id}>
                                        <td>
                                            <strong>{layout.name}</strong>
                                            <ol className={s.cardList}>
                                                {cardTitles(layout).map(
                                                    (card) => (
                                                        <li key={card.index}>
                                                            <span
                                                                className={
                                                                    s.cardNum
                                                                }
                                                            >
                                                                {card.index}.
                                                            </span>
                                                            <span>
                                                                {card.title}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ol>
                                        </td>
                                        <td>
                                            {layout.is_active ? (
                                                <span className="stamp stamp--decided">
                                                    Aktiv
                                                </span>
                                            ) : (
                                                <span className="stamp stamp--draft">
                                                    Inaktiv
                                                </span>
                                            )}
                                        </td>
                                        <td className="num">
                                            {dateShort(
                                                new Date(layout.created_at)
                                            )}
                                        </td>
                                        <td>
                                            <span className={s.actions}>
                                                {canManage && (
                                                    <Link
                                                        className="btn btn--quiet btn--sm"
                                                        href={`/admin/wendessen/${layout.id}`}
                                                    >
                                                        Bearbeiten
                                                    </Link>
                                                )}
                                                {canManage && !layout.is_active && (
                                                    <button
                                                        type="button"
                                                        className="btn btn--sm"
                                                        onClick={() =>
                                                            activate(layout)
                                                        }
                                                        disabled={
                                                            activating ===
                                                            layout.id
                                                        }
                                                    >
                                                        {activating === layout.id
                                                            ? 'Aktivieren …'
                                                            : 'Aktivieren'}
                                                    </button>
                                                )}
                                                {canCreate && (
                                                    <button
                                                        type="button"
                                                        className="btn btn--quiet btn--sm"
                                                        onClick={() =>
                                                            duplicate(layout)
                                                        }
                                                        disabled={
                                                            duplicating ===
                                                            layout.id
                                                        }
                                                    >
                                                        {duplicating === layout.id
                                                            ? 'Kopieren …'
                                                            : 'Duplizieren'}
                                                    </button>
                                                )}
                                                {canManage && (
                                                    <button
                                                        type="button"
                                                        className="btn btn--danger btn--sm"
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                layout
                                                            )
                                                        }
                                                        disabled={layout.is_active}
                                                        title={
                                                            layout.is_active
                                                                ? 'Das aktive Layout kann nicht gelöscht werden.'
                                                                : 'Layout löschen'
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

            {!loading && activeLayout && (
                <p className="hint" style={{ marginTop: 'var(--s3)' }}>
                    Die Startseite liest nur das aktive Layout. Ein Wechsel
                    wirkt sofort nach dem nächsten Aufruf.
                </p>
            )}

            <p style={{ marginTop: 'var(--s4)' }}>
                <Link className="btn btn--quiet btn--sm" href="/admin/dashboard">
                    Zum Schreibtisch
                </Link>
            </p>
        </div>
    );
}
