'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import {
    getActionDescription,
    getLogSentence,
} from '@/lib/utils/admin-log-utils';
import { clock, dateShort } from '@/app/lib/register-format';
import s from './logs.module.css';

interface LogEntry {
    id: number;
    userId: number | null;
    username: string | null;
    action: string;
    resourceType: string | null;
    resourceId: string | null;
    resourceTitle: string | null;
    details: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
}

const actionFilters = [
    { value: '', label: 'Alle Aktionen' },
    { value: 'event', label: 'Termine' },
    { value: 'news', label: 'Neuigkeiten' },
    { value: 'gallery', label: 'Galerie' },
    { value: 'shared_gallery', label: 'Impressionen' },
    { value: 'portrait', label: 'Porträts' },
    { value: 'user', label: 'Benutzer' },
    { value: 'settings', label: 'Einstellungen' },
    { value: 'auth', label: 'Anmeldung' },
    { value: 'archive', label: 'Archiv' },
];

const resourceLabels: Record<string, string> = {
    event: 'Termin',
    news: 'Nachricht',
    gallery: 'Galerie',
    shared_gallery: 'Impression',
    portrait: 'Porträt',
    user: 'Benutzer',
    settings: 'Einstellung',
    auth: 'Anmeldung',
    archive: 'Archiv',
};

const PAGE_SIZE = 30;

export default function AdminLogs() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [actionFilter, setActionFilter] = useState('');
    const [userQuery, setUserQuery] = useState('');
    const [entryQuery, setEntryQuery] = useState('');
    const [reloadKey, setReloadKey] = useState(0);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(PAGE_SIZE),
            });
            if (actionFilter) params.set('action', actionFilter);

            const response = await fetch(`/api/admin/logs?${params}`);
            if (!response.ok) {
                throw new Error(`Status ${response.status}`);
            }
            const data = (await response.json()) as {
                logs: LogEntry[];
                total: number;
                totalPages: number;
            };
            setLogs(data.logs ?? []);
            setTotalPages(data.totalPages || 1);
            setTotal(data.total || 0);
        } catch (fetchError) {
            console.error('Error fetching logs:', fetchError);
            setError('Das Aktivitätslog konnte nicht geladen werden.');
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }, [page, actionFilter]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            if (cancelled) return;
            await fetchLogs();
        }

        run();
        return () => {
            cancelled = true;
        };
    }, [fetchLogs, reloadKey]);

    const filteredLogs = useMemo(() => {
        const user = userQuery.trim().toLowerCase();
        const entry = entryQuery.trim().toLowerCase();

        return logs.filter((log) => {
            if (
                user &&
                !(log.username ?? '').toLowerCase().includes(user)
            ) {
                return false;
            }
            if (entry) {
                const haystack = [
                    log.resourceTitle ?? '',
                    log.resourceId ?? '',
                    getActionDescription(log.action),
                    getLogSentence(log),
                ]
                    .join(' ')
                    .toLowerCase();
                if (!haystack.includes(entry)) return false;
            }
            return true;
        });
    }, [logs, userQuery, entryQuery]);

    const hasTextFilter = userQuery.trim() !== '' || entryQuery.trim() !== '';

    function resetFilters() {
        setActionFilter('');
        setUserQuery('');
        setEntryQuery('');
        setPage(1);
    }

    return (
        <div>
            <AdminHead
                title="Aktivitätslog"
                sub={`${total} ${
                    total === 1 ? 'Eintrag' : 'Einträge'
                } im Register · nur lesbar`}
            />

            <div className="admin-filter">
                <div className="field">
                    <label htmlFor="log-action">Aktion</label>
                    <select
                        id="log-action"
                        className="select"
                        value={actionFilter}
                        onChange={(event) => {
                            setActionFilter(event.target.value);
                            setPage(1);
                        }}
                    >
                        {actionFilters.map((filter) => (
                            <option key={filter.value} value={filter.value}>
                                {filter.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="log-user">Benutzer</label>
                    <input
                        id="log-user"
                        className="input"
                        type="search"
                        value={userQuery}
                        onChange={(event) => setUserQuery(event.target.value)}
                        placeholder="Name eingrenzen"
                    />
                </div>

                <div className="field">
                    <label htmlFor="log-entry">Eintrag</label>
                    <input
                        id="log-entry"
                        className="input"
                        type="search"
                        value={entryQuery}
                        onChange={(event) => setEntryQuery(event.target.value)}
                        placeholder="Titel oder Vorgang"
                    />
                </div>

                <button
                    type="button"
                    className="btn btn--quiet btn--sm"
                    onClick={resetFilters}
                    disabled={
                        !actionFilter && !userQuery && !entryQuery
                    }
                >
                    Filter zurücksetzen
                </button>

                {hasTextFilter && !loading && (
                    <p className={s.filterHint}>
                        Benutzer und Eintrag grenzen die geladene Seite ein.
                    </p>
                )}
            </div>

            {error && (
                <div className="notice notice--error" role="alert">
                    <strong>Log nicht geladen</strong>
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

            {loading ? (
                <p className="admin-empty" role="status">
                    Aktivitätslog wird geladen …
                </p>
            ) : error ? null : filteredLogs.length === 0 ? (
                <div className="admin-empty">
                    <h2>Keine Einträge gefunden</h2>
                    <p>
                        {hasTextFilter || actionFilter
                            ? 'Für diese Auswahl liegt kein Eintrag vor. Setzen Sie die Filter zurück.'
                            : 'Das Register hat noch keine Aktivität verzeichnet.'}
                    </p>
                    {(hasTextFilter || actionFilter) && (
                        <button
                            type="button"
                            className="btn btn--sm"
                            onClick={resetFilters}
                        >
                            Filter zurücksetzen
                        </button>
                    )}
                </div>
            ) : (
                <Panel
                    title="Verzeichnete Vorgänge"
                    flush
                    actions={
                        <span className="tally">
                            {filteredLogs.length} von {logs.length} auf dieser
                            Seite
                        </span>
                    }
                >
                    <div className={s.tableWrap}>
                        <table className="data">
                            <thead>
                                <tr>
                                    <th scope="col">Zeit</th>
                                    <th scope="col">Benutzer</th>
                                    <th scope="col">Aktion</th>
                                    <th scope="col">Ziel</th>
                                    <th scope="col">IP</th>
                                    <th scope="col">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => {
                                    const created = new Date(log.createdAt);
                                    const typeLabel = log.resourceType
                                        ? (resourceLabels[log.resourceType] ??
                                          log.resourceType)
                                        : 'Vorgang';
                                    const target =
                                        log.resourceTitle ||
                                        log.resourceId ||
                                        typeLabel;
                                    const hasTargetDetail = Boolean(
                                        log.resourceTitle || log.resourceId
                                    );

                                    return (
                                        <tr key={log.id}>
                                            <td className={s.nowrap}>
                                                <time
                                                    className={s.time}
                                                    dateTime={log.createdAt}
                                                >
                                                    <span>
                                                        {dateShort(created)}
                                                    </span>
                                                    <span>
                                                        {clock(created)} Uhr
                                                    </span>
                                                </time>
                                            </td>
                                            <td className={s.user}>
                                                {log.username ?? 'Unbekannt'}
                                            </td>
                                            <td>
                                                <span className="stamp stamp--info">
                                                    {getActionDescription(
                                                        log.action
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={s.target}>
                                                    <span>{target}</span>
                                                    {hasTargetDetail && (
                                                        <span
                                                            className={
                                                                s.targetType
                                                            }
                                                        >
                                                            {typeLabel}
                                                        </span>
                                                    )}
                                                </span>
                                            </td>
                                            <td className={s.ip}>
                                                {log.ipAddress ?? '—'}
                                            </td>
                                            <td className={s.details}>
                                                {getLogSentence(log)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className={s.pager}>
                            <p className={s.pagerInfo}>
                                Seite {page} von {totalPages} · {total}{' '}
                                {total === 1 ? 'Eintrag' : 'Einträge'}
                            </p>
                            <div className={s.pagerButtons}>
                                <button
                                    type="button"
                                    className="btn btn--quiet btn--sm"
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.max(1, current - 1)
                                        )
                                    }
                                    disabled={page === 1 || loading}
                                >
                                    ← Zurück
                                </button>
                                <button
                                    type="button"
                                    className="btn btn--quiet btn--sm"
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.min(totalPages, current + 1)
                                        )
                                    }
                                    disabled={page === totalPages || loading}
                                >
                                    Weiter →
                                </button>
                            </div>
                        </div>
                    )}
                </Panel>
            )}

            <p style={{ marginTop: 'var(--s4)' }}>
                <Link className="btn btn--quiet btn--sm" href="/admin/dashboard">
                    Zum Schreibtisch
                </Link>
            </p>
        </div>
    );
}
