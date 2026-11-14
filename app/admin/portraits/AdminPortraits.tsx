'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePermissions } from '@/lib/usePermissions';
import { dateLong, dateShort } from '@/app/lib/register-format';
import styles from './portraits.module.css';

interface PortraitSubmission {
    id: number;
    name: string;
    description: string;
    email: string;
    imageUrl: string;
    imageStoragePath?: string;
    imageMimeType: string;
    imageFilename: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface AdminPortraitsProps {
    submissions: PortraitSubmission[];
    onSubmissionsUpdate: () => void;
}

const statusText = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Wartend';
        case 'approved':
            return 'Freigegeben';
        case 'rejected':
            return 'Abgelehnt';
        default:
            return status;
    }
};

const statusStamp = (status: string) => {
    switch (status) {
        case 'pending':
            return 'stamp stamp--new';
        case 'approved':
            return 'stamp stamp--decided';
        case 'rejected':
            return 'stamp stamp--cancelled';
        default:
            return 'stamp';
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

export default function AdminPortraits({
    submissions,
    onSubmissionsUpdate,
}: AdminPortraitsProps) {
    const { hasPermission } = usePermissions();
    const [selectedSubmission, setSelectedSubmission] =
        useState<PortraitSubmission | null>(null);
    const [filterStatus, setFilterStatus] = useState<
        'all' | 'pending' | 'approved' | 'rejected'
    >('all');
    const [isActionLoading, setIsActionLoading] = useState<number | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [flash, setFlash] = useState<string | null>(null);

    const canEdit = hasPermission('portraits.edit');
    const canDelete = hasPermission('portraits.delete');

    useEffect(() => {
        if (!flash) return;
        const timer = window.setTimeout(() => setFlash(null), 4000);
        return () => window.clearTimeout(timer);
    }, [flash]);

    const filteredSubmissions = submissions.filter((submission) => {
        if (filterStatus === 'all') return true;
        return submission.status === filterStatus;
    });

    const runAction = async (
        id: number,
        action: 'approve' | 'reject' | 'reset',
    ) => {
        setIsActionLoading(id);
        setError(null);
        try {
            const response = await fetch('/api/admin/portraits', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action }),
            });

            if (response.ok) {
                onSubmissionsUpdate();
                setSelectedSubmission(null);
                setFlash(
                    action === 'approve'
                        ? 'Portrait freigegeben.'
                        : action === 'reject'
                          ? 'Portrait abgelehnt.'
                          : 'Portrait auf „Wartend“ zurückgesetzt.',
                );
            } else {
                const data = await response.json().catch(() => null);
                setError(
                    data?.message ||
                        (action === 'approve'
                            ? 'Fehler beim Freigeben der Einreichung'
                            : action === 'reject'
                              ? 'Fehler beim Ablehnen der Einreichung'
                              : 'Fehler beim Zurücksetzen der Einreichung'),
                );
            }
        } catch (actionError) {
            console.error('Error updating submission:', actionError);
            setError(
                action === 'approve'
                    ? 'Fehler beim Freigeben der Einreichung'
                    : action === 'reject'
                      ? 'Fehler beim Ablehnen der Einreichung'
                      : 'Fehler beim Zurücksetzen der Einreichung',
            );
        } finally {
            setIsActionLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        setIsActionLoading(id);
        setError(null);
        try {
            const response = await fetch('/api/admin/portraits', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                onSubmissionsUpdate();
                setSelectedSubmission(null);
                setFlash('Einreichung gelöscht.');
            } else {
                const data = await response.json().catch(() => null);
                setError(
                    data?.message || 'Fehler beim Löschen der Einreichung',
                );
            }
        } catch (deleteError) {
            console.error('Error deleting submission:', deleteError);
            setError('Fehler beim Löschen der Einreichung');
        } finally {
            setIsActionLoading(null);
            setDeleteConfirmId(null);
        }
    };

    const filterTabs: {
        key: 'all' | 'pending' | 'approved' | 'rejected';
        label: string;
    }[] = [
        { key: 'all', label: 'Alle' },
        { key: 'pending', label: 'Wartend' },
        { key: 'approved', label: 'Freigegeben' },
        { key: 'rejected', label: 'Abgelehnt' },
    ];

    const countFor = (key: 'all' | 'pending' | 'approved' | 'rejected') =>
        key === 'all'
            ? submissions.length
            : submissions.filter((submission) => submission.status === key)
                  .length;

    const detailRef = useOverlay(selectedSubmission !== null, () =>
        setSelectedSubmission(null),
    );
    const deleteRef = useOverlay(deleteConfirmId !== null, () =>
        setDeleteConfirmId(null),
    );

    return (
        <div>
            {flash && (
                <div className="notice notice--ok" role="status">
                    <strong>Gespeichert</strong>
                    <span>{flash}</span>
                </div>
            )}

            {error && (
                <div className="notice notice--error" role="alert">
                    <strong>Nicht abgeschlossen</strong>
                    <span>{error}</span>
                    <div style={{ marginTop: 'var(--s2)' }}>
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

            <div className="tabs" role="tablist" aria-label="Status filtern">
                {filterTabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={filterStatus === tab.key}
                        aria-controls="portrait-list"
                        onClick={() => setFilterStatus(tab.key)}
                    >
                        {tab.label} ({countFor(tab.key)})
                    </button>
                ))}
            </div>

            <div
                id="portrait-list"
                role="tabpanel"
                style={{ marginTop: 'var(--s4)' }}
            >
                {filteredSubmissions.length === 0 ? (
                    <div className="empty">
                        <h3>Keine Einreichungen gefunden</h3>
                        <p>
                            {filterStatus === 'all'
                                ? 'Es wurden noch keine Portrait-Einreichungen eingereicht.'
                                : `Keine Einreichungen mit Status „${statusText(
                                      filterStatus,
                                  )}“.`}
                        </p>
                    </div>
                ) : (
                    <div className={styles.rows}>
                        {filteredSubmissions.map((submission) => (
                            <article
                                key={submission.id}
                                className={styles.row}
                            >
                                <button
                                    type="button"
                                    className={styles.thumb}
                                    onClick={() =>
                                        setSelectedSubmission(submission)
                                    }
                                    aria-label={`Portrait von ${submission.name} öffnen`}
                                >
                                    <Image
                                        src={submission.imageUrl}
                                        alt={`Portrait von ${submission.name}`}
                                        fill
                                        sizes="(max-width: 640px) 200px, 148px"
                                    />
                                </button>
                                <div className={styles.body}>
                                    <div className={styles.rowHead}>
                                        <h2 className={styles.name}>
                                            {submission.name}
                                        </h2>
                                        <span
                                            className={statusStamp(
                                                submission.status,
                                            )}
                                        >
                                            {statusText(submission.status)}
                                        </span>
                                    </div>
                                    <p className={styles.meta}>
                                        <span>
                                            Eingereicht am{' '}
                                            {dateShort(
                                                new Date(
                                                    submission.submittedAt,
                                                ),
                                            )}
                                        </span>
                                        {submission.email && (
                                            <a
                                                href={`mailto:${submission.email}`}
                                            >
                                                {submission.email}
                                            </a>
                                        )}
                                    </p>
                                    <p className={styles.text}>
                                        {submission.description}
                                    </p>
                                    <div className={styles.actions}>
                                        <button
                                            type="button"
                                            className="btn btn--sm btn--quiet"
                                            onClick={() =>
                                                setSelectedSubmission(
                                                    submission,
                                                )
                                            }
                                        >
                                            Prüfen
                                        </button>
                                        {submission.status === 'pending' &&
                                            canEdit && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="btn btn--sm btn--primary"
                                                        onClick={() =>
                                                            runAction(
                                                                submission.id,
                                                                'approve',
                                                            )
                                                        }
                                                        disabled={
                                                            isActionLoading ===
                                                            submission.id
                                                        }
                                                    >
                                                        Freigeben
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn--sm btn--danger"
                                                        onClick={() =>
                                                            runAction(
                                                                submission.id,
                                                                'reject',
                                                            )
                                                        }
                                                        disabled={
                                                            isActionLoading ===
                                                            submission.id
                                                        }
                                                    >
                                                        Ablehnen
                                                    </button>
                                                </>
                                            )}
                                        {submission.status === 'approved' &&
                                            canEdit && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="btn btn--sm btn--quiet"
                                                        onClick={() =>
                                                            runAction(
                                                                submission.id,
                                                                'reset',
                                                            )
                                                        }
                                                        disabled={
                                                            isActionLoading ===
                                                            submission.id
                                                        }
                                                    >
                                                        Zurücksetzen
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn--sm btn--danger"
                                                        onClick={() =>
                                                            runAction(
                                                                submission.id,
                                                                'reject',
                                                            )
                                                        }
                                                        disabled={
                                                            isActionLoading ===
                                                            submission.id
                                                        }
                                                    >
                                                        Ablehnen
                                                    </button>
                                                </>
                                            )}
                                        {submission.status === 'rejected' &&
                                            canEdit && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="btn btn--sm btn--quiet"
                                                        onClick={() =>
                                                            runAction(
                                                                submission.id,
                                                                'reset',
                                                            )
                                                        }
                                                        disabled={
                                                            isActionLoading ===
                                                            submission.id
                                                        }
                                                    >
                                                        Zurücksetzen
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn--sm btn--primary"
                                                        onClick={() =>
                                                            runAction(
                                                                submission.id,
                                                                'approve',
                                                            )
                                                        }
                                                        disabled={
                                                            isActionLoading ===
                                                            submission.id
                                                        }
                                                    >
                                                        Freigeben
                                                    </button>
                                                </>
                                            )}
                                        {canDelete && (
                                            <button
                                                type="button"
                                                className="btn btn--sm btn--danger"
                                                onClick={() =>
                                                    setDeleteConfirmId(
                                                        submission.id,
                                                    )
                                                }
                                                disabled={
                                                    isActionLoading ===
                                                    submission.id
                                                }
                                            >
                                                Löschen
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {selectedSubmission && (
                <div
                    className={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget)
                            setSelectedSubmission(null);
                    }}
                >
                    <div
                        ref={detailRef}
                        className={`dialog ${styles.dialogWide}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="portrait-detail-title"
                    >
                        <div className="dialog-head">
                            <div>
                                <p className="small muted">
                                    Portrait-Einreichung
                                </p>
                                <h2 id="portrait-detail-title">
                                    {selectedSubmission.name}
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={() => setSelectedSubmission(null)}
                                aria-label="Dialog schließen"
                            >
                                ×
                            </button>
                        </div>
                        <div className="dialog-body">
                            <div className={styles.detailGrid}>
                                <div className={styles.detailImage}>
                                    <Image
                                        src={selectedSubmission.imageUrl}
                                        alt={`Portrait von ${selectedSubmission.name}`}
                                        fill
                                        sizes="(max-width: 640px) 240px, 220px"
                                    />
                                </div>
                                <div>
                                    <span
                                        className={statusStamp(
                                            selectedSubmission.status,
                                        )}
                                    >
                                        {statusText(
                                            selectedSubmission.status,
                                        )}
                                    </span>
                                    <dl
                                        className="kv"
                                        style={{ marginTop: 'var(--s3)' }}
                                    >
                                        <dt>Eingereicht</dt>
                                        <dd>
                                            {dateLong(
                                                new Date(
                                                    selectedSubmission.submittedAt,
                                                ),
                                            )}
                                        </dd>
                                        <dt>E-Mail</dt>
                                        <dd>
                                            {selectedSubmission.email ? (
                                                <a
                                                    className="link"
                                                    href={`mailto:${selectedSubmission.email}`}
                                                >
                                                    {selectedSubmission.email}
                                                </a>
                                            ) : (
                                                '—'
                                            )}
                                        </dd>
                                        <dt>Datei</dt>
                                        <dd>
                                            {selectedSubmission.imageFilename ||
                                                '—'}
                                        </dd>
                                    </dl>
                                </div>
                            </div>

                            <p
                                style={{
                                    marginTop: 'var(--s4)',
                                    fontSize: 'var(--tally)',
                                    fontWeight: 650,
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: 'var(--ink-faint)',
                                }}
                            >
                                Text des Einreichenden
                            </p>
                            <p className={styles.detailText}>
                                {selectedSubmission.description}
                            </p>
                        </div>
                        <div className={`dialog-foot ${styles.footSticky}`}>
                            {canDelete && (
                                <button
                                    type="button"
                                    className="btn btn--danger"
                                    onClick={() => {
                                        const target =
                                            selectedSubmission.id;
                                        setSelectedSubmission(null);
                                        setDeleteConfirmId(target);
                                    }}
                                    disabled={
                                        isActionLoading ===
                                        selectedSubmission.id
                                    }
                                >
                                    Löschen
                                </button>
                            )}
                            {selectedSubmission.status === 'pending' &&
                                canEdit && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn--quiet"
                                            onClick={() =>
                                                runAction(
                                                    selectedSubmission.id,
                                                    'reject',
                                                )
                                            }
                                            disabled={
                                                isActionLoading ===
                                                selectedSubmission.id
                                            }
                                        >
                                            Ablehnen
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn--primary"
                                            onClick={() =>
                                                runAction(
                                                    selectedSubmission.id,
                                                    'approve',
                                                )
                                            }
                                            disabled={
                                                isActionLoading ===
                                                selectedSubmission.id
                                            }
                                        >
                                            Freigeben
                                        </button>
                                    </>
                                )}
                            {selectedSubmission.status === 'approved' &&
                                canEdit && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn--quiet"
                                            onClick={() =>
                                                runAction(
                                                    selectedSubmission.id,
                                                    'reset',
                                                )
                                            }
                                            disabled={
                                                isActionLoading ===
                                                selectedSubmission.id
                                            }
                                        >
                                            Zurücksetzen
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn--danger"
                                            onClick={() =>
                                                runAction(
                                                    selectedSubmission.id,
                                                    'reject',
                                                )
                                            }
                                            disabled={
                                                isActionLoading ===
                                                selectedSubmission.id
                                            }
                                        >
                                            Ablehnen
                                        </button>
                                    </>
                                )}
                            {selectedSubmission.status === 'rejected' &&
                                canEdit && (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn--quiet"
                                            onClick={() =>
                                                runAction(
                                                    selectedSubmission.id,
                                                    'reset',
                                                )
                                            }
                                            disabled={
                                                isActionLoading ===
                                                selectedSubmission.id
                                            }
                                        >
                                            Zurücksetzen
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn--primary"
                                            onClick={() =>
                                                runAction(
                                                    selectedSubmission.id,
                                                    'approve',
                                                )
                                            }
                                            disabled={
                                                isActionLoading ===
                                                selectedSubmission.id
                                            }
                                        >
                                            Freigeben
                                        </button>
                                    </>
                                )}
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={() => setSelectedSubmission(null)}
                            >
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmId !== null && (
                <div
                    className={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget)
                            setDeleteConfirmId(null);
                    }}
                >
                    <div
                        ref={deleteRef}
                        className="dialog"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="portrait-delete-title"
                    >
                        <div className="dialog-head">
                            <h2 id="portrait-delete-title">
                                Einreichung löschen
                            </h2>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={() => setDeleteConfirmId(null)}
                                aria-label="Dialog schließen"
                            >
                                ×
                            </button>
                        </div>
                        <div className="dialog-body">
                            <div className="notice notice--warn">
                                <strong>
                                    Sind Sie sicher, dass Sie diese Einreichung
                                    löschen möchten?
                                </strong>
                                <span>
                                    Bild und Datensatz werden entfernt. Diese
                                    Aktion kann nicht rückgängig gemacht
                                    werden.
                                </span>
                            </div>
                        </div>
                        <div className={`dialog-foot ${styles.footSticky}`}>
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={() => setDeleteConfirmId(null)}
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                className="btn btn--danger"
                                onClick={() => handleDelete(deleteConfirmId)}
                                disabled={isActionLoading === deleteConfirmId}
                            >
                                {isActionLoading === deleteConfirmId
                                    ? 'Löschen …'
                                    : 'Endgültig löschen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
