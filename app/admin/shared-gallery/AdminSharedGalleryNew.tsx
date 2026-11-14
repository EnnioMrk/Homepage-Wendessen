'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import LazySharedGalleryImage from '@/app/components/LazySharedGalleryImage';
import { SharedGalleryImageProvider } from '@/app/components/SharedGalleryImageContext';
import { dateShort } from '@/app/lib/register-format';
import s from './shared-gallery.module.css';

interface SharedGalleryImage {
    id: string;
    imageUrl?: string;
    description?: string;
    submitterName?: string;
    submitterEmail?: string;
    imageFilename?: string;
    dateTaken?: string;
    location?: string;
    submittedAt?: string;
    rejectionReason?: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface SubmissionGroup {
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterNames: string[];
    submitterEmail?: string;
    images: SharedGalleryImage[];
    submittedAt: string;
    totalCount: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

type ActionKind =
    | 'approve-all'
    | 'reject-all'
    | 'reset-all'
    | 'approve-selected'
    | 'reject-selected'
    | 'reset-selected'
    | 'delete-group';

interface ActionPanelState {
    kind: ActionKind;
    groupId: string;
}

const PAGE_SIZE = 25;

const STATUS_LABEL: Record<SharedGalleryImage['status'], string> = {
    pending: 'Wartend',
    approved: 'Freigegeben',
    rejected: 'Abgelehnt',
};

function safeDate(value?: string): string {
    if (!value) return 'ohne Datum';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : dateShort(date);
}

function safeDateTime(value?: string): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${dateShort(date)}, ${date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
    })}`;
}

function imageStampClass(status: SharedGalleryImage['status']): string {
    if (status === 'approved') return `stamp ${s.approved}`;
    if (status === 'rejected') return `stamp ${s.rejected}`;
    return `stamp ${s.waiting}`;
}

function groupStatus(group: SubmissionGroup): {
    label: string;
    className: string;
} {
    if (
        group.pendingCount > 0 &&
        group.approvedCount === 0 &&
        group.rejectedCount === 0
    ) {
        return { label: 'Wartend', className: `stamp ${s.waiting}` };
    }
    if (
        group.approvedCount > 0 &&
        group.rejectedCount === 0 &&
        group.pendingCount === 0
    ) {
        return { label: 'Freigegeben', className: `stamp ${s.approved}` };
    }
    if (
        group.rejectedCount > 0 &&
        group.approvedCount === 0 &&
        group.pendingCount === 0
    ) {
        return { label: 'Abgelehnt', className: `stamp ${s.rejected}` };
    }
    return { label: 'Gemischt', className: 'stamp stamp--info' };
}

interface AdminSharedGalleryProps {
    canEdit?: boolean;
    canDelete?: boolean;
}

export default function AdminSharedGallery({
    canEdit = false,
    canDelete = false,
}: AdminSharedGalleryProps) {
    const [groups, setGroups] = useState<SubmissionGroup[]>([]);
    const [totalGroups, setTotalGroups] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [filter, setFilter] = useState<StatusFilter>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [actionPanel, setActionPanel] = useState<ActionPanelState | null>(
        null
    );
    const [reason, setReason] = useState('');
    const [processing, setProcessing] = useState(false);
    const [detailImage, setDetailImage] = useState<SharedGalleryImage | null>(
        null
    );
    const [detailImageUrl, setDetailImageUrl] = useState<string | null>(null);
    const [confirmDetailDelete, setConfirmDetailDelete] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    const loadGroups = useCallback(
        async (reset: boolean, offset = 0) => {
            if (reset) setLoading(true);
            else setLoadingMore(true);

            try {
                const response = await fetch(
                    `/api/admin/shared-gallery?limit=${PAGE_SIZE}&offset=${offset}`
                );
                if (!response.ok) {
                    throw new Error(`Status ${response.status}`);
                }
                const data = (await response.json()) as {
                    submissionGroups?: SubmissionGroup[];
                    total?: number;
                };
                const incoming = data.submissionGroups ?? [];
                setTotalGroups(data.total ?? 0);
                setGroups((prev) => {
                    if (reset) return incoming;
                    const known = new Set(
                        prev.map((group) => group.submissionGroupId)
                    );
                    return [
                        ...prev,
                        ...incoming.filter(
                            (group) =>
                                !known.has(group.submissionGroupId)
                        ),
                    ];
                });
                if (reset) setError(null);
            } catch (loadError) {
                console.error(
                    'Error fetching shared gallery submissions:',
                    loadError
                );
                setError('Die Einreichungen konnten nicht geladen werden.');
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        []
    );

    useEffect(() => {
        loadGroups(true);
    }, [loadGroups]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (detailImage && !dialog.open) dialog.showModal();
        if (!detailImage && dialog.open) dialog.close();
    }, [detailImage]);

    const expandedGroup = groups.find(
        (group) => group.submissionGroupId === expandedId
    );

    const totals = groups.reduce(
        (accumulator, group) => ({
            pending: accumulator.pending + group.pendingCount,
            approved: accumulator.approved + group.approvedCount,
            rejected: accumulator.rejected + group.rejectedCount,
        }),
        { pending: 0, approved: 0, rejected: 0 }
    );

    const visibleGroups = groups.filter((group) => {
        if (filter === 'pending') return group.pendingCount > 0;
        if (filter === 'approved') return group.approvedCount > 0;
        if (filter === 'rejected') return group.rejectedCount > 0;
        return true;
    });

    const hasMore = groups.length < totalGroups;

    function openDetail(image: SharedGalleryImage) {
        setDetailImageUrl(image.imageUrl ?? null);
        setConfirmDetailDelete(false);
        setDetailImage(image);
    }

    function toggleSelected(imageId: string) {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(imageId)) next.delete(imageId);
            else next.add(imageId);
            return next;
        });
    }

    function toggleExpanded(groupId: string) {
        setExpandedId((current) => (current === groupId ? null : groupId));
        setSelected(new Set());
        setActionPanel(null);
        setReason('');
    }

    async function runAction() {
        if (!actionPanel || processing) return;

        const { kind, groupId } = actionPanel;
        const imageIds = Array.from(selected);
        let body: Record<string, unknown>;
        let message: string;

        switch (kind) {
            case 'approve-all':
                body = { action: 'approve-all', submissionGroupId: groupId };
                message = 'Alle Fotos der Einreichung wurden freigegeben.';
                break;
            case 'reset-all':
                body = { action: 'reset-all', submissionGroupId: groupId };
                message =
                    'Alle Fotos der Einreichung wurden auf „Wartend“ zurückgesetzt.';
                break;
            case 'reject-all':
                body = {
                    action: 'reject-all',
                    submissionGroupId: groupId,
                    reason: reason || undefined,
                };
                message = 'Alle Fotos der Einreichung wurden abgelehnt.';
                break;
            case 'approve-selected':
                body = { action: 'approve-selected', imageIds };
                message = `${imageIds.length} ${
                    imageIds.length === 1 ? 'Foto' : 'Fotos'
                } freigegeben.`;
                break;
            case 'reset-selected':
                body = { action: 'reset-selected', imageIds };
                message = `${imageIds.length} ${
                    imageIds.length === 1 ? 'Foto' : 'Fotos'
                } auf „Wartend“ zurückgesetzt.`;
                break;
            case 'reject-selected':
                body = {
                    action: 'reject-selected',
                    imageIds,
                    reason: reason || undefined,
                };
                message = `${imageIds.length} ${
                    imageIds.length === 1 ? 'Foto' : 'Fotos'
                } abgelehnt.`;
                break;
            case 'delete-group':
                body = { action: 'delete-group', submissionGroupId: groupId };
                message = 'Die Einreichung wurde gelöscht.';
                break;
            default:
                return;
        }

        if (
            (kind === 'approve-selected' ||
                kind === 'reset-selected' ||
                kind === 'reject-selected') &&
            imageIds.length === 0
        ) {
            setError('Bitte zuerst mindestens ein Foto auswählen.');
            return;
        }

        setProcessing(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                let text = 'Die Aktion konnte nicht ausgeführt werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) text = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(text);
            }

            setSuccess(message);
            setActionPanel(null);
            setReason('');
            setSelected(new Set());
            if (kind === 'delete-group' && expandedId === groupId) {
                setExpandedId(null);
            }
            await loadGroups(true);
        } catch (actionError) {
            setError(
                actionError instanceof Error
                    ? actionError.message
                    : 'Die Aktion konnte nicht ausgeführt werden.'
            );
        } finally {
            setProcessing(false);
        }
    }

    async function deleteDetailImage() {
        if (!detailImage || processing) return;
        setProcessing(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/admin/shared-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete',
                    id: detailImage.id,
                }),
            });

            if (!response.ok) {
                let text = 'Das Foto konnte nicht gelöscht werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) text = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(text);
            }

            setSuccess('Das Foto wurde gelöscht.');
            setDetailImage(null);
            setConfirmDetailDelete(false);
            setSelected(new Set());
            await loadGroups(true);
        } catch (deleteError) {
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Das Foto konnte nicht gelöscht werden.'
            );
        } finally {
            setProcessing(false);
        }
    }

    function renderActionPanel() {
        if (!actionPanel || !expandedGroup) return null;

        const { kind } = actionPanel;
        const isReject = kind === 'reject-all' || kind === 'reject-selected';
        const needsSelection =
            kind === 'approve-selected' ||
            kind === 'reset-selected' ||
            kind === 'reject-selected';

        const question =
            kind === 'approve-all'
                ? 'Sollen alle Fotos dieser Einreichung freigegeben werden?'
                : kind === 'reset-all'
                  ? 'Sollen alle Fotos dieser Einreichung auf „Wartend“ zurückgesetzt werden?'
                  : kind === 'delete-group'
                    ? 'Soll die gesamte Einreichung mit allen Fotos endgültig gelöscht werden?'
                    : kind === 'reject-all'
                      ? 'Sollen alle Fotos dieser Einreichung abgelehnt werden?'
                      : kind === 'approve-selected'
                        ? `Sollen die ${selected.size} ausgewählten Fotos freigegeben werden?`
                        : kind === 'reset-selected'
                          ? `Sollen die ${selected.size} ausgewählten Fotos auf „Wartend“ zurückgesetzt werden?`
                          : `Sollen die ${selected.size} ausgewählten Fotos abgelehnt werden?`;

        return (
            <div className={s.confirm}>
                <p className={s.confirmHead}>
                    {isReject ? 'Ablehnen bestätigen' : 'Bestätigen'}
                </p>
                <p>{question}</p>
                {isReject && (
                    <div className="field">
                        <label htmlFor="reject-reason">
                            Grund (optional)
                        </label>
                        <textarea
                            id="reject-reason"
                            className="textarea"
                            rows={3}
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            placeholder="Grund für die Ablehnung"
                        />
                    </div>
                )}
                <div className={s.actions}>
                    <button
                        type="button"
                        className="btn btn--quiet btn--sm"
                        onClick={() => {
                            setActionPanel(null);
                            setReason('');
                        }}
                        disabled={processing}
                    >
                        Abbrechen
                    </button>
                    <button
                        type="button"
                        className={
                            isReject || kind === 'delete-group'
                                ? 'btn btn--danger btn--sm'
                                : 'btn btn--primary btn--sm'
                        }
                        onClick={runAction}
                        disabled={processing || (needsSelection && selected.size === 0)}
                    >
                        {processing
                            ? 'Ausführen …'
                            : kind === 'delete-group'
                              ? 'Endgültig löschen'
                              : isReject
                                ? 'Ablehnen'
                                : kind === 'reset-all' || kind === 'reset-selected'
                                  ? 'Zurücksetzen'
                                  : 'Freigeben'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <SharedGalleryImageProvider>
            <div>
                <AdminHead
                    title="Impressionen"
                    sub="Eingereichte Foto-Sammlungen prüfen, freigeben oder ablehnen"
                    actions={
                        <Link
                            className="btn btn--sm"
                            href="/admin/shared-gallery/meldungen"
                        >
                            Meldungen
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
                            onClick={() => loadGroups(true)}
                        >
                            Erneut laden
                        </button>
                    </div>
                )}

                <div className="admin-filter">
                    <div className="field">
                        <label htmlFor="gallery-status">Status</label>
                        <select
                            id="gallery-status"
                            className="select"
                            value={filter}
                            onChange={(event) => {
                                setFilter(event.target.value as StatusFilter);
                                setExpandedId(null);
                                setSelected(new Set());
                                setActionPanel(null);
                            }}
                        >
                            <option value="all">
                                Alle Einreichungen ({groups.length})
                            </option>
                            <option value="pending">
                                Wartend (
                                {groups.filter((group) => group.pendingCount > 0).length}
                                )
                            </option>
                            <option value="approved">
                                Freigegeben (
                                {groups.filter((group) => group.approvedCount > 0).length}
                                )
                            </option>
                            <option value="rejected">
                                Abgelehnt (
                                {groups.filter((group) => group.rejectedCount > 0).length}
                                )
                            </option>
                        </select>
                    </div>
                    <p className={s.filterCounts}>
                        Geladen: {groups.length} von {totalGroups} Einreichungen ·
                        Fotos: {totals.pending} wartend, {totals.approved}{' '}
                        freigegeben, {totals.rejected} abgelehnt
                    </p>
                </div>

                {loading ? (
                    <p className="admin-empty" role="status">
                        Einreichungen werden geladen …
                    </p>
                ) : visibleGroups.length === 0 ? (
                    <div className="admin-empty">
                        <h2>Keine Einreichungen gefunden</h2>
                        <p>
                            {filter === 'all'
                                ? 'Es wurden noch keine Foto-Sammlungen eingereicht.'
                                : filter === 'pending'
                                  ? 'Keine Einreichung hat wartende Fotos.'
                                  : filter === 'approved'
                                    ? 'Keine Einreichung enthält freigegebene Fotos.'
                                    : 'Keine Einreichung enthält abgelehnte Fotos.'}
                        </p>
                    </div>
                ) : (
                    <Panel
                        title="Einreichungen"
                        flush
                        actions={
                            <span className="tally">
                                Wartend {totals.pending} · Freigegeben{' '}
                                {totals.approved} · Abgelehnt {totals.rejected}
                            </span>
                        }
                    >
                        <div className={s.groups}>
                            {visibleGroups.map((group) => {
                                const state = groupStatus(group);
                                const expanded =
                                    expandedId === group.submissionGroupId;

                                return (
                                    <article
                                        key={group.submissionGroupId}
                                        className={s.groupCard}
                                    >
                                        <div className={s.groupHead}>
                                            <div className={s.groupTitle}>
                                                <h3>
                                                    {group.title ||
                                                        'Ohne Titel'}
                                                </h3>
                                                <span className={state.className}>
                                                    {state.label}
                                                </span>
                                            </div>
                                            <span className={s.groupWhen}>
                                                Eingereicht am{' '}
                                                {safeDate(group.submittedAt)}
                                            </span>
                                        </div>

                                        <div className={s.groupBody}>
                                            {group.submitterNames.length > 0 && (
                                                <p className={s.meta}>
                                                    <span>
                                                        Von:{' '}
                                                        <strong>
                                                            {group.submitterNames
                                                                .length === 1
                                                                ? group
                                                                      .submitterNames[0]
                                                                : `${group.submitterNames[0]} und ${
                                                                      group
                                                                          .submitterNames
                                                                          .length -
                                                                      1
                                                                  } weitere`}
                                                        </strong>
                                                    </span>
                                                    {group.submitterEmail && (
                                                        <span>
                                                            {
                                                                group.submitterEmail
                                                            }
                                                        </span>
                                                    )}
                                                </p>
                                            )}

                                            {group.description && (
                                                <p className={s.desc}>
                                                    {group.description}
                                                </p>
                                            )}

                                            <p className={s.meta}>
                                                <span>
                                                    {group.totalCount}{' '}
                                                    {group.totalCount === 1
                                                        ? 'Foto'
                                                        : 'Fotos'}
                                                </span>
                                                <span>
                                                    {group.pendingCount}{' '}
                                                    wartend
                                                </span>
                                                <span>
                                                    {group.approvedCount}{' '}
                                                    freigegeben
                                                </span>
                                                <span>
                                                    {group.rejectedCount}{' '}
                                                    abgelehnt
                                                </span>
                                            </p>

                                            <div className={s.previewPlates}>
                                                {group.images
                                                    .slice(0, 6)
                                                    .map((image) => (
                                                        <button
                                                            key={image.id}
                                                            type="button"
                                                            className={
                                                                s.previewTile
                                                            }
                                                            onClick={() =>
                                                                openDetail(image)
                                                            }
                                                            aria-label={`Foto öffnen, Status ${
                                                                STATUS_LABEL[
                                                                    image.status
                                                                ]
                                                            }`}
                                                        >
                                                            <LazySharedGalleryImage
                                                                imageId={
                                                                    image.id
                                                                }
                                                                alt=""
                                                                fill
                                                                sizes="(max-width: 640px) 33vw, 16vw"
                                                            />
                                                            {image.status ===
                                                                'rejected' && (
                                                                <span
                                                                    className={
                                                                        s.tileState
                                                                    }
                                                                >
                                                                    <span
                                                                        className={imageStampClass(
                                                                            image.status
                                                                        )}
                                                                    >
                                                                        {
                                                                            STATUS_LABEL[
                                                                                image.status
                                                                            ]
                                                                        }
                                                                    </span>
                                                                </span>
                                                            )}
                                                        </button>
                                                    ))}
                                                {group.totalCount > 6 && (
                                                    <button
                                                        type="button"
                                                        className={s.previewMore}
                                                        onClick={() =>
                                                            toggleExpanded(
                                                                group.submissionGroupId
                                                            )
                                                        }
                                                    >
                                                        +{group.totalCount - 6}
                                                    </button>
                                                )}
                                            </div>

                                            <div className={s.actions}>
                                                <button
                                                    type="button"
                                                    className="btn btn--quiet btn--sm"
                                                    aria-expanded={expanded}
                                                    onClick={() =>
                                                        toggleExpanded(
                                                            group.submissionGroupId
                                                        )
                                                    }
                                                >
                                                    {expanded
                                                        ? 'Details schließen'
                                                        : 'Details ansehen'}
                                                </button>

                                                {canEdit &&
                                                    group.pendingCount > 0 && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn btn--primary btn--sm"
                                                                onClick={() => {
                                                                    setActionPanel(
                                                                        {
                                                                            kind: 'approve-all',
                                                                            groupId:
                                                                                group.submissionGroupId,
                                                                        }
                                                                    );
                                                                    setSelected(
                                                                        new Set()
                                                                    );
                                                                    setExpandedId(
                                                                        group.submissionGroupId
                                                                    );
                                                                }}
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                Alle freigeben
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn--danger btn--sm"
                                                                onClick={() => {
                                                                    setActionPanel(
                                                                        {
                                                                            kind: 'reject-all',
                                                                            groupId:
                                                                                group.submissionGroupId,
                                                                        }
                                                                    );
                                                                    setSelected(
                                                                        new Set()
                                                                    );
                                                                    setExpandedId(
                                                                        group.submissionGroupId
                                                                    );
                                                                }}
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                Alle ablehnen
                                                            </button>
                                                        </>
                                                    )}

                                                {canEdit &&
                                                    (group.approvedCount > 0 ||
                                                        group.rejectedCount >
                                                            0) && (
                                                        <button
                                                            type="button"
                                                            className="btn btn--quiet btn--sm"
                                                            onClick={() => {
                                                                setActionPanel({
                                                                    kind: 'reset-all',
                                                                    groupId:
                                                                        group.submissionGroupId,
                                                                });
                                                                setSelected(
                                                                    new Set()
                                                                );
                                                                setExpandedId(
                                                                    group.submissionGroupId
                                                                );
                                                            }}
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            Zurücksetzen
                                                        </button>
                                                    )}

                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        className="btn btn--danger btn--sm"
                                                        onClick={() => {
                                                            setActionPanel({
                                                                kind: 'delete-group',
                                                                groupId:
                                                                    group.submissionGroupId,
                                                            });
                                                            setExpandedId(
                                                                group.submissionGroupId
                                                            );
                                                        }}
                                                        disabled={processing}
                                                    >
                                                        Einreichung löschen
                                                    </button>
                                                )}
                                            </div>

                                            {expanded &&
                                                actionPanel &&
                                                actionPanel.groupId ===
                                                    group.submissionGroupId &&
                                                renderActionPanel()}

                                            {expanded &&
                                                actionPanel?.groupId !==
                                                    group.submissionGroupId && (
                                                    <div className={s.detail}>
                                                        <div
                                                            className={
                                                                s.detailHead
                                                            }
                                                        >
                                                            <h3>
                                                                Fotos (
                                                                {
                                                                    group.totalCount
                                                                }
                                                                )
                                                            </h3>
                                                            {canEdit && (
                                                                <div
                                                                    className={
                                                                        s.actions
                                                                    }
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn--quiet btn--sm"
                                                                        onClick={() =>
                                                                            setSelected(
                                                                                new Set(
                                                                                    group.images.map(
                                                                                        (
                                                                                            image
                                                                                        ) =>
                                                                                            image.id
                                                                                    )
                                                                                )
                                                                            )
                                                                        }
                                                                    >
                                                                        Alle
                                                                        auswählen
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn--quiet btn--sm"
                                                                        onClick={() =>
                                                                            setSelected(
                                                                                new Set()
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            selected.size ===
                                                                            0
                                                                        }
                                                                    >
                                                                        Auswahl
                                                                        aufheben
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {canEdit &&
                                                            selected.size > 0 && (
                                                                <div
                                                                    className={
                                                                        s.actions
                                                                    }
                                                                >
                                                                    <span
                                                                        className="stamp stamp--info"
                                                                    >
                                                                        {
                                                                            selected.size
                                                                        }{' '}
                                                                        ausgewählt
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn--primary btn--sm"
                                                                        onClick={() =>
                                                                            setActionPanel(
                                                                                {
                                                                                    kind: 'approve-selected',
                                                                                    groupId:
                                                                                        group.submissionGroupId,
                                                                                }
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                    >
                                                                        Auswahl
                                                                        freigeben
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn--danger btn--sm"
                                                                        onClick={() =>
                                                                            setActionPanel(
                                                                                {
                                                                                    kind: 'reject-selected',
                                                                                    groupId:
                                                                                        group.submissionGroupId,
                                                                                }
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                    >
                                                                        Auswahl
                                                                        ablehnen
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn--quiet btn--sm"
                                                                        onClick={() =>
                                                                            setActionPanel(
                                                                                {
                                                                                    kind: 'reset-selected',
                                                                                    groupId:
                                                                                        group.submissionGroupId,
                                                                                }
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                    >
                                                                        Auswahl
                                                                        zurücksetzen
                                                                    </button>
                                                                </div>
                                                            )}

                                                        <div className={s.tiles}>
                                                            {group.images.map(
                                                                (image) => {
                                                                    const isSelected =
                                                                        selected.has(
                                                                            image.id
                                                                        );
                                                                    return (
                                                                        <figure
                                                                            key={
                                                                                image.id
                                                                            }
                                                                            className={
                                                                                s.tile
                                                                            }
                                                                        >
                                                                            <button
                                                                                type="button"
                                                                                className={
                                                                                    s.tileButton
                                                                                }
                                                                                aria-pressed={
                                                                                    isSelected
                                                                                }
                                                                                aria-label={`${
                                                                                    STATUS_LABEL[
                                                                                        image.status
                                                                                    ]
                                                                                }es Foto ${
                                                                                    isSelected
                                                                                        ? 'abwählen'
                                                                                        : 'auswählen'
                                                                                }`}
                                                                                onClick={() =>
                                                                                    toggleSelected(
                                                                                        image.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                <LazySharedGalleryImage
                                                                                    imageId={
                                                                                        image.id
                                                                                    }
                                                                                    alt=""
                                                                                    fill
                                                                                    sizes="(max-width: 640px) 50vw, 20vw"
                                                                                />
                                                                                <span
                                                                                    className={
                                                                                        s.tileState
                                                                                    }
                                                                                >
                                                                                    <span
                                                                                        className={imageStampClass(
                                                                                            image.status
                                                                                        )}
                                                                                    >
                                                                                        {
                                                                                            STATUS_LABEL[
                                                                                                image.status
                                                                                            ]
                                                                                        }
                                                                                    </span>
                                                                                </span>
                                                                                {isSelected && (
                                                                                    <span
                                                                                        className={`stamp ${s.selectedMark}`}
                                                                                    >
                                                                                        Gewählt
                                                                                    </span>
                                                                                )}
                                                                            </button>
                                                                            <figcaption
                                                                                className={
                                                                                    s.tileFoot
                                                                                }
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        STATUS_LABEL[
                                                                                            image
                                                                                                .status
                                                                                        ]
                                                                                    }
                                                                                </span>
                                                                                <button
                                                                                    type="button"
                                                                                    className="link-quiet"
                                                                                    onClick={() =>
                                                                                        openDetail(
                                                                                            image
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Details
                                                                                </button>
                                                                            </figcaption>
                                                                        </figure>
                                                                    );
                                                                }
                                                            )}
                                                        </div>

                                                        {group.images.length <
                                                            group.totalCount && (
                                                            <p className="hint">
                                                                In dieser
                                                                Ansicht sind{' '}
                                                                {
                                                                    group.images
                                                                        .length
                                                                }{' '}
                                                                von{' '}
                                                                {
                                                                    group.totalCount
                                                                }{' '}
                                                                Fotos geladen.
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {hasMore && (
                            <div className={s.loadMore}>
                                <button
                                    type="button"
                                    className="btn btn--quiet btn--sm"
                                    onClick={() =>
                                        loadGroups(false, groups.length)
                                    }
                                    disabled={loadingMore}
                                >
                                    {loadingMore
                                        ? 'Laden …'
                                        : `Mehr laden (${groups.length} von ${totalGroups})`}
                                </button>
                            </div>
                        )}
                    </Panel>
                )}

                <p style={{ marginTop: 'var(--s4)' }}>
                    <Link
                        className="btn btn--quiet btn--sm"
                        href="/admin/dashboard"
                    >
                        Zum Schreibtisch
                    </Link>
                </p>

                <dialog
                    ref={dialogRef}
                    className="dialog"
                    aria-labelledby="photo-detail-title"
                    onClose={() => setDetailImage(null)}
                    onClick={(event) => {
                        if (event.target === dialogRef.current) {
                            setDetailImage(null);
                        }
                    }}
                >
                    {detailImage && (
                        <>
                            <div className="dialog-head">
                                <div>
                                    <p className="tally">Foto-Details</p>
                                    <h2 id="photo-detail-title">
                                        {detailImage.submitterName ||
                                            'Eingereichtes Foto'}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    className="dialog-close"
                                    onClick={() => setDetailImage(null)}
                                    aria-label="Foto-Details schließen"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="dialog-body">
                                <div className={s.dialogGrid}>
                                    <div className={s.dialogImage}>
                                        {detailImageUrl ? (
                                            <Image
                                                src={detailImageUrl}
                                                alt={`Foto, Status ${
                                                    STATUS_LABEL[
                                                        detailImage.status
                                                    ]
                                                }`}
                                                fill
                                                unoptimized
                                            />
                                        ) : (
                                            <LazySharedGalleryImage
                                                imageId={detailImage.id}
                                                alt={`Foto, Status ${
                                                    STATUS_LABEL[
                                                        detailImage.status
                                                    ]
                                                }`}
                                                fill
                                                onLoad={(url) =>
                                                    setDetailImageUrl(url)
                                                }
                                            />
                                        )}
                                    </div>

                                    <dl className={s.metaList}>
                                        <div>
                                            <dt>Status</dt>
                                            <dd>
                                                <span
                                                    className={imageStampClass(
                                                        detailImage.status
                                                    )}
                                                >
                                                    {
                                                        STATUS_LABEL[
                                                            detailImage.status
                                                        ]
                                                    }
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt>Eingereicht von</dt>
                                            <dd>
                                                {detailImage.submitterName ||
                                                    'Unbekannt'}
                                            </dd>
                                        </div>
                                        {detailImage.submitterEmail && (
                                            <div>
                                                <dt>E-Mail</dt>
                                                <dd>
                                                    <a
                                                        className="link"
                                                        href={`mailto:${detailImage.submitterEmail}`}
                                                    >
                                                        {
                                                            detailImage.submitterEmail
                                                        }
                                                    </a>
                                                </dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt>Eingereicht am</dt>
                                            <dd>
                                                {safeDateTime(
                                                    detailImage.submittedAt
                                                )}
                                            </dd>
                                        </div>
                                        {detailImage.dateTaken && (
                                            <div>
                                                <dt>Aufgenommen am</dt>
                                                <dd>
                                                    {safeDateTime(
                                                        detailImage.dateTaken
                                                    )}
                                                </dd>
                                            </div>
                                        )}
                                        {detailImage.location && (
                                            <div>
                                                <dt>Ort / GPS</dt>
                                                <dd>
                                                    <span className={s.mono}>
                                                        {
                                                            detailImage.location
                                                        }
                                                    </span>
                                                    <a
                                                        className="link"
                                                        href={`https://www.google.com/maps?q=${encodeURIComponent(
                                                            detailImage.location
                                                        )}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Auf Google Maps
                                                    </a>
                                                </dd>
                                            </div>
                                        )}
                                        {detailImage.description && (
                                            <div>
                                                <dt>Beschreibung</dt>
                                                <dd>
                                                    {
                                                        detailImage.description
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                        {detailImage.rejectionReason && (
                                            <div>
                                                <dt>Ablehnungsgrund</dt>
                                                <dd className={s.reason}>
                                                    {
                                                        detailImage.rejectionReason
                                                    }
                                                </dd>
                                            </div>
                                        )}
                                        <div>
                                            <dt>System</dt>
                                            <dd className={s.mono}>
                                                ID: {detailImage.id}
                                                <br />
                                                Datei:{' '}
                                                {detailImage.imageFilename ||
                                                    '—'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {confirmDetailDelete && (
                                    <div className={s.confirm}>
                                        <p className={s.confirmHead}>
                                            Foto löschen
                                        </p>
                                        <p>
                                            Soll dieses Foto endgültig
                                            gelöscht werden? Die Datei wird
                                            dabei entfernt.
                                        </p>
                                        <div className={s.actions}>
                                            <button
                                                type="button"
                                                className="btn btn--quiet btn--sm"
                                                onClick={() =>
                                                    setConfirmDetailDelete(false)
                                                }
                                                disabled={processing}
                                            >
                                                Abbrechen
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn--danger btn--sm"
                                                onClick={deleteDetailImage}
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Löschen …'
                                                    : 'Endgültig löschen'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="dialog-foot">
                                <button
                                    type="button"
                                    className="btn btn--quiet"
                                    onClick={() => setDetailImage(null)}
                                >
                                    Schließen
                                </button>
                                {canDelete && !confirmDetailDelete && (
                                    <button
                                        type="button"
                                        className="btn btn--danger"
                                        onClick={() =>
                                            setConfirmDetailDelete(true)
                                        }
                                    >
                                        Foto löschen
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
