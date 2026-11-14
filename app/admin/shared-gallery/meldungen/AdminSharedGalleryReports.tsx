'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import LazySharedGalleryImage from '@/app/components/LazySharedGalleryImage';
import { SharedGalleryImageProvider } from '@/app/components/SharedGalleryImageContext';
import { useHasPermission } from '@/lib/usePermissions';
import { dateShort } from '@/app/lib/register-format';
import s from '../shared-gallery.module.css';

interface GalleryReport {
    id: string;
    submissionId: string;
    reason: string;
    reporterInfo?: string;
    status: 'pending' | 'reviewed' | 'dismissed';
    reviewedAt?: string;
    reviewedBy?: string;
    createdAt: string;
    imageUrl?: string;
    title?: string;
    submitterName?: string;
}

const STATUS_LABEL: Record<GalleryReport['status'], string> = {
    pending: 'Ausstehend',
    reviewed: 'Geprüft',
    dismissed: 'Abgewiesen',
};

type Filter = 'pending' | 'all';

interface ConfirmState {
    kind: 'disapprove' | 'delete-both' | 'delete-report';
    report: GalleryReport;
}

function safeDate(value?: string): string {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : dateShort(date);
}

function statusClass(status: GalleryReport['status']): string {
    if (status === 'reviewed') return `stamp ${s.approved}`;
    if (status === 'dismissed') return 'stamp stamp--draft';
    return `stamp ${s.waiting}`;
}

export default function AdminSharedGalleryReports() {
    const canEdit = useHasPermission('shared_gallery.edit');
    const canDelete = useHasPermission('shared_gallery.delete');

    const [allReports, setAllReports] = useState<GalleryReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<Filter>('pending');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [confirm, setConfirm] = useState<ConfirmState | null>(null);
    const [detail, setDetail] = useState<GalleryReport | null>(null);
    const [detailUrl, setDetailUrl] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const loadReports = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/shared-gallery/reports');
            if (!response.ok) {
                throw new Error(`Status ${response.status}`);
            }
            const data = (await response.json()) as {
                reports?: GalleryReport[];
            };
            setAllReports(data.reports ?? []);
            setError(null);
        } catch (loadError) {
            console.error('Error fetching reports:', loadError);
            setError('Die Meldungen konnten nicht geladen werden.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (detail && !dialog.open) dialog.showModal();
        if (!detail && dialog.open) dialog.close();
    }, [detail]);

    const reports = allReports.filter((report) =>
        filter === 'pending' ? report.status === 'pending' : true
    );

    const pendingCount = allReports.filter(
        (report) => report.status === 'pending'
    ).length;

    function openDetail(report: GalleryReport) {
        setDetailUrl(report.imageUrl ?? null);
        setDetail(report);
    }

    async function updateStatus(
        report: GalleryReport,
        status: GalleryReport['status']
    ) {
        setProcessingId(report.id);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(
                '/api/admin/shared-gallery/reports',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reportId: report.id, status }),
                }
            );
            if (!response.ok) {
                let message = 'Der Status konnte nicht geändert werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }
            setSuccess(
                status === 'pending'
                    ? 'Die Meldung ist wieder ausstehend.'
                    : `Die Meldung wurde als „${STATUS_LABEL[status]}“ verzeichnet.`
            );
            await loadReports();
        } catch (statusError) {
            setError(
                statusError instanceof Error
                    ? statusError.message
                    : 'Der Status konnte nicht geändert werden.'
            );
        } finally {
            setProcessingId(null);
        }
    }

    async function disapprove(report: GalleryReport) {
        setProcessingId(report.id);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'reject',
                    id: report.submissionId,
                    reason: 'Aufgrund einer Meldung entfernt',
                }),
            });
            if (!response.ok) {
                let message = 'Das Foto konnte nicht abgelehnt werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }
            setSuccess('Das Foto wurde abgelehnt.');
            setConfirm(null);
            setDetail(null);
            await loadReports();
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Das Foto konnte nicht abgelehnt werden.'
            );
        } finally {
            setProcessingId(null);
        }
    }

    async function deleteBoth(report: GalleryReport) {
        setProcessingId(report.id);
        setError(null);
        setSuccess(null);
        try {
            const submissionResponse = await fetch(
                '/api/admin/shared-gallery',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'delete',
                        id: report.submissionId,
                    }),
                }
            );
            if (!submissionResponse.ok) {
                let message = 'Das Foto konnte nicht gelöscht werden.';
                try {
                    const data = (await submissionResponse.json()) as {
                        error?: string;
                    };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }

            await fetch(
                `/api/admin/shared-gallery/reports?reportId=${report.id}`,
                { method: 'DELETE' }
            );

            setSuccess('Foto und Meldung wurden gelöscht.');
            setConfirm(null);
            setDetail(null);
            await loadReports();
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Foto und Meldung konnten nicht gelöscht werden.'
            );
        } finally {
            setProcessingId(null);
        }
    }

    async function deleteReport(report: GalleryReport) {
        setProcessingId(report.id);
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch(
                `/api/admin/shared-gallery/reports?reportId=${report.id}`,
                { method: 'DELETE' }
            );
            if (!response.ok) {
                let message = 'Die Meldung konnte nicht gelöscht werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }
            setSuccess('Die Meldung wurde gelöscht. Das Foto bleibt erhalten.');
            setConfirm(null);
            await loadReports();
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Die Meldung konnte nicht gelöscht werden.'
            );
        } finally {
            setProcessingId(null);
        }
    }

    function confirmAction() {
        if (!confirm) return;
        if (confirm.kind === 'disapprove') disapprove(confirm.report);
        else if (confirm.kind === 'delete-both') deleteBoth(confirm.report);
        else deleteReport(confirm.report);
    }

    const confirmText =
        confirm?.kind === 'disapprove'
            ? {
                  head: 'Foto ablehnen',
                  text: 'Soll das gemeldete Foto abgelehnt und aus der Impressionen-Galerie entfernt werden?',
                  action: 'Ablehnen',
              }
            : confirm?.kind === 'delete-both'
              ? {
                    head: 'Foto und Meldung löschen',
                    text: 'Sollen das Foto und die zugehörige Meldung endgültig gelöscht werden? Das lässt sich nicht rückgängig machen.',
                    action: 'Beides löschen',
                }
              : {
                    head: 'Meldung löschen',
                    text: 'Soll nur diese Meldung gelöscht werden? Das Foto bleibt erhalten.',
                    action: 'Meldung löschen',
                };

    return (
        <SharedGalleryImageProvider>
            <div>
                <AdminHead
                    title="Meldungen"
                    sub="Gemeldete Fotos prüfen · eine Meldung bleibt als Vorgang erhalten, bis sie entschieden ist"
                    actions={
                        <Link
                            className="btn btn--sm"
                            href="/admin/shared-gallery"
                        >
                            Zu den Impressionen
                        </Link>
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
                            onClick={loadReports}
                        >
                            Erneut laden
                        </button>
                    </div>
                )}

                {confirm && (
                    <div className={s.confirm}>
                        <p className={s.confirmHead}>{confirmText.head}</p>
                        <p>{confirmText.text}</p>
                        <p className={s.meta}>
                            <span>
                                Foto: {confirm.report.title || 'Ohne Titel'}
                            </span>
                            <span>Grund: {confirm.report.reason}</span>
                        </p>
                        <div className={s.actions}>
                            <button
                                type="button"
                                className="btn btn--quiet btn--sm"
                                onClick={() => setConfirm(null)}
                                disabled={processingId === confirm.report.id}
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                className="btn btn--danger btn--sm"
                                onClick={confirmAction}
                                disabled={processingId === confirm.report.id}
                            >
                                {processingId === confirm.report.id
                                    ? 'Ausführen …'
                                    : confirmText.action}
                            </button>
                        </div>
                    </div>
                )}

                <div className="admin-filter">
                    <div className="field">
                        <label htmlFor="report-status">Status</label>
                        <select
                            id="report-status"
                            className="select"
                            value={filter}
                            onChange={(event) =>
                                setFilter(event.target.value as Filter)
                            }
                        >
                            <option value="pending">
                                Ausstehend ({pendingCount})
                            </option>
                            <option value="all">
                                Alle ({allReports.length})
                            </option>
                        </select>
                    </div>
                    <p className={s.filterCounts}>
                        {reports.length}{' '}
                        {reports.length === 1 ? 'Meldung' : 'Meldungen'} in
                        dieser Auswahl
                    </p>
                </div>

                {loading ? (
                    <p className="admin-empty" role="status">
                        Meldungen werden geladen …
                    </p>
                ) : reports.length === 0 ? (
                    <div className="admin-empty">
                        <h2>Keine Meldungen</h2>
                        <p>
                            {filter === 'pending'
                                ? 'Es gibt keine ausstehenden Meldungen.'
                                : 'Es wurde noch kein Foto gemeldet.'}
                        </p>
                    </div>
                ) : (
                    <Panel
                        title="Gemeldete Fotos"
                        flush
                        actions={
                            <span className="tally">
                                {pendingCount} ausstehend ·{' '}
                                {allReports.length - pendingCount} entschieden
                            </span>
                        }
                    >
                        <div className={s.tableWrap}>
                            <table className="data">
                                <thead>
                                    <tr>
                                        <th scope="col">Foto und Meldung</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Gemeldet</th>
                                        <th scope="col">Bearbeitet</th>
                                        <th scope="col" className="right">
                                            Aktionen
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <td>
                                                <div className={s.reportCell}>
                                                    <button
                                                        type="button"
                                                        className={s.reportThumb}
                                                        onClick={() =>
                                                            openDetail(report)
                                                        }
                                                        aria-label="Gemeldetes Foto öffnen"
                                                    >
                                                        <LazySharedGalleryImage
                                                            imageId={
                                                                report.submissionId
                                                            }
                                                            alt=""
                                                            fill
                                                            sizes="84px"
                                                        />
                                                    </button>
                                                    <div
                                                        className={
                                                            s.reportText
                                                        }
                                                    >
                                                        <strong>
                                                            {report.title ||
                                                                'Unbekannter Titel'}
                                                        </strong>
                                                        <p>
                                                            Grund:{' '}
                                                            {report.reason}
                                                        </p>
                                                        {report.submitterName && (
                                                            <p className="small muted">
                                                                Foto von{' '}
                                                                {
                                                                    report.submitterName
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={statusClass(
                                                        report.status
                                                    )}
                                                >
                                                    {
                                                        STATUS_LABEL[
                                                            report.status
                                                        ]
                                                    }
                                                </span>
                                            </td>
                                            <td className="num">
                                                {safeDate(report.createdAt)}
                                            </td>
                                            <td className="num">
                                                {report.reviewedAt
                                                    ? safeDate(
                                                          report.reviewedAt
                                                      )
                                                    : '—'}
                                                {report.reviewedBy && (
                                                    <span className="small muted">
                                                        {' '}
                                                        · {report.reviewedBy}
                                                    </span>
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={s.rowActions}
                                                >
                                                    <button
                                                        type="button"
                                                        className="btn btn--quiet btn--sm"
                                                        onClick={() =>
                                                            openDetail(report)
                                                        }
                                                    >
                                                        Foto ansehen
                                                    </button>
                                                    {canEdit &&
                                                        report.status ===
                                                            'pending' && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn--sm"
                                                                    onClick={() =>
                                                                        updateStatus(
                                                                            report,
                                                                            'reviewed'
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processingId ===
                                                                        report.id
                                                                    }
                                                                >
                                                                    Als geprüft
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn--danger btn--sm"
                                                                    onClick={() =>
                                                                        setConfirm(
                                                                            {
                                                                                kind: 'disapprove',
                                                                                report,
                                                                            }
                                                                        )
                                                                    }
                                                                >
                                                                    Foto ablehnen
                                                                </button>
                                                            </>
                                                        )}
                                                    {canDelete &&
                                                        report.status ===
                                                            'pending' && (
                                                            <button
                                                                type="button"
                                                                className="btn btn--danger btn--sm"
                                                                onClick={() =>
                                                                    setConfirm({
                                                                        kind: 'delete-both',
                                                                        report,
                                                                    })
                                                                }
                                                            >
                                                                Foto &amp;
                                                                Meldung löschen
                                                            </button>
                                                        )}
                                                    {canEdit &&
                                                        report.status !==
                                                            'pending' && (
                                                            <button
                                                                type="button"
                                                                className="btn btn--quiet btn--sm"
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        report,
                                                                        'pending'
                                                                    )
                                                                }
                                                                disabled={
                                                                    processingId ===
                                                                    report.id
                                                                }
                                                            >
                                                                Zurücksetzen
                                                            </button>
                                                        )}
                                                    {canDelete && (
                                                        <button
                                                            type="button"
                                                            className="btn btn--quiet btn--sm"
                                                            onClick={() =>
                                                                setConfirm({
                                                                    kind: 'delete-report',
                                                                    report,
                                                                })
                                                            }
                                                        >
                                                            Nur Meldung löschen
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

                <p style={{ marginTop: 'var(--s4)' }}>
                    <Link
                        className="btn btn--quiet btn--sm"
                        href="/admin/shared-gallery"
                    >
                        Zurück zu den Impressionen
                    </Link>
                </p>

                <dialog
                    ref={dialogRef}
                    className="dialog"
                    aria-labelledby="report-detail-title"
                    onClose={() => setDetail(null)}
                    onClick={(event) => {
                        if (event.target === dialogRef.current) {
                            setDetail(null);
                        }
                    }}
                >
                    {detail && (
                        <>
                            <div className="dialog-head">
                                <div>
                                    <p className="tally">Gemeldetes Foto</p>
                                    <h2 id="report-detail-title">
                                        {detail.title || 'Unbekannter Titel'}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    className="dialog-close"
                                    onClick={() => setDetail(null)}
                                    aria-label="Meldung schließen"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="dialog-body">
                                <div className={s.dialogGrid}>
                                    <div className={s.dialogImage}>
                                        {detailUrl ? (
                                            <Image
                                                src={detailUrl}
                                                alt="Gemeldetes Foto"
                                                fill
                                                unoptimized
                                            />
                                        ) : (
                                            <LazySharedGalleryImage
                                                imageId={detail.submissionId}
                                                alt="Gemeldetes Foto"
                                                fill
                                                onLoad={(url) =>
                                                    setDetailUrl(url)
                                                }
                                            />
                                        )}
                                    </div>

                                    <dl className={s.metaList}>
                                        <div>
                                            <dt>Status</dt>
                                            <dd>
                                                <span
                                                    className={statusClass(
                                                        detail.status
                                                    )}
                                                >
                                                    {
                                                        STATUS_LABEL[
                                                            detail.status
                                                        ]
                                                    }
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>Grund der Meldung</dt>
                                            <dd className={s.reason}>
                                                {detail.reason}
                                            </dd>
                                        </div>
                                        {detail.reporterInfo && (
                                            <div>
                                                <dt>Zusatzinfo</dt>
                                                <dd>{detail.reporterInfo}</dd>
                                            </div>
                                        )}
                                        {detail.submitterName && (
                                            <div>
                                                <dt>Foto von</dt>
                                                <dd>
                                                    {detail.submitterName}
                                                </dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt>Gemeldet am</dt>
                                            <dd>
                                                {safeDate(detail.createdAt)}
                                            </dd>
                                        </div>
                                        {detail.reviewedAt && (
                                            <div>
                                                <dt>Bearbeitet</dt>
                                                <dd>
                                                    {safeDate(
                                                        detail.reviewedAt
                                                    )}
                                                    {detail.reviewedBy
                                                        ? ` · ${detail.reviewedBy}`
                                                        : ''}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            </div>
                            <div className="dialog-foot">
                                <button
                                    type="button"
                                    className="btn btn--quiet"
                                    onClick={() => setDetail(null)}
                                >
                                    Schließen
                                </button>
                                {canEdit && detail.status === 'pending' && (
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => {
                                            updateStatus(detail, 'reviewed');
                                            setDetail(null);
                                        }}
                                    >
                                        Als geprüft
                                    </button>
                                )}
                                {canEdit && (
                                    <button
                                        type="button"
                                        className="btn btn--danger"
                                        onClick={() => {
                                            setConfirm({
                                                kind: 'disapprove',
                                                report: detail,
                                            });
                                            setDetail(null);
                                        }}
                                    >
                                        Foto ablehnen
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </dialog>
            </div>
        </SharedGalleryImageProvider>
    );
}
