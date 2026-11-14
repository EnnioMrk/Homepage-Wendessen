'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { isMinioUrl } from '@/lib/utils/blob-utils-client';
import { dateLong } from '@/app/lib/register-format';
import { useDialog } from '@/app/impressionen/dialog';
import styles from '@/app/impressionen/impressionen.module.css';

export interface LightboxImage {
    id: string;
    imageUrl: string;
    description?: string;
    dateTaken?: Date;
    location?: string;
}

interface ImageLightboxProps {
    images: LightboxImage[];
    index: number;
    title: string;
    submitterName?: string;
    submittedAt: Date;
    filename?: string;
    onIndexChange: (index: number) => void;
    onClose: () => void;
}

function imageAlt(
    image: LightboxImage,
    title: string,
    index: number,
    total: number,
): string {
    const description = image.description?.trim();
    if (description) return description;
    return `${title} — Foto ${index + 1} von ${total}`;
}

/**
 * The register's plate viewer: one photo on the dark plate, no chrome but
 * rules. Escape and the arrow keys work, the report is a paper sheet on top.
 */
export default function ImageLightbox({
    images,
    index,
    title,
    submitterName,
    submittedAt,
    filename,
    onIndexChange,
    onClose,
}: ImageLightboxProps) {
    const safeIndex = Math.min(Math.max(index, 0), Math.max(images.length - 1, 0));
    const image = images[safeIndex];

    const [reportOpen, setReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportSubmitting, setReportSubmitting] = useState(false);
    const [reportSent, setReportSent] = useState(false);
    const [reportError, setReportError] = useState('');

    const dialogRef = useRef<HTMLDivElement>(null);
    const reasonRef = useRef<HTMLTextAreaElement>(null);
    const reportButtonRef = useRef<HTMLButtonElement>(null);

    const goTo = useCallback(
        (nextIndex: number) => {
            if (nextIndex < 0 || nextIndex >= images.length) return;
            setReportOpen(false);
            setReportReason('');
            setReportError('');
            setReportSent(false);
            onIndexChange(nextIndex);
        },
        [images.length, onIndexChange],
    );

    const closeDialog = () => {
        if (reportOpen) {
            closeReport();
            return;
        }
        onClose();
    };

    useDialog(dialogRef, closeDialog);

    function closeReport() {
        setReportOpen(false);
        setReportReason('');
        setReportError('');
        setReportSent(false);
        window.setTimeout(() => reportButtonRef.current?.focus(), 0);
    }

    function openReport() {
        setReportError('');
        setReportSent(false);
        setReportOpen(true);
    }

    // Arrow keys step through the group; they stay out of the way while the
    // report is open or the caret sits in a text field.
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (reportOpen) return;
            const target = event.target as HTMLElement | null;
            if (target?.tagName === 'TEXTAREA' || target?.tagName === 'INPUT') {
                return;
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                goTo(safeIndex + 1);
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goTo(safeIndex - 1);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [goTo, reportOpen, safeIndex]);

    useEffect(() => {
        if (reportOpen) reasonRef.current?.focus();
    }, [reportOpen]);

    if (!image) return null;

    const alt = imageAlt(image, title, safeIndex, images.length);
    const hasMany = images.length > 1;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image.imageUrl;
        link.download = filename || `wendessen-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReport = async () => {
        const reason = reportReason.trim();
        if (!reason) {
            setReportError('Bitte geben Sie einen Grund für die Meldung an.');
            return;
        }

        setReportError('');
        setReportSubmitting(true);

        try {
            const response = await fetch('/api/shared-gallery/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId: image.id, reason }),
            });

            if (!response.ok) throw new Error('report failed');

            setReportSent(true);
        } catch (error) {
            console.error('Error submitting report:', error);
            setReportError(
                'Die Meldung konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.',
            );
        } finally {
            setReportSubmitting(false);
        }
    };

    return createPortal(
        <div
            ref={dialogRef}
            className={`lightbox ${styles.viewer}`}
            role="dialog"
            aria-modal="true"
            aria-label={`Bildansicht: ${title}`}
        >
            <div
                className={`lightbox-bar ${styles.bar}`}
                inert={reportOpen || undefined}
            >
                <div className={styles.barLead}>
                    <p className={styles.barTitle}>{title}</p>
                    {hasMany && (
                        <p className={styles.counter}>
                            Foto {safeIndex + 1} von {images.length}
                        </p>
                    )}
                </div>
                <div className={styles.barActions}>
                    {hasMany && (
                        <>
                            <button
                                type="button"
                                onClick={() => goTo(safeIndex - 1)}
                                disabled={safeIndex === 0}
                                aria-label="Vorheriges Foto"
                            >
                                Zurück
                            </button>
                            <button
                                type="button"
                                onClick={() => goTo(safeIndex + 1)}
                                disabled={safeIndex === images.length - 1}
                                aria-label="Nächstes Foto"
                            >
                                Weiter
                            </button>
                        </>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Schließen"
                        data-autofocus
                    >
                        Schließen
                    </button>
                </div>
            </div>

            <div className="lightbox-stage" inert={reportOpen || undefined}>
                <div className={styles.stage}>
                    <Image
                        src={image.imageUrl}
                        alt={alt}
                        fill
                        sizes="100vw"
                        className={styles.stageImage}
                        priority
                        unoptimized={isMinioUrl(image.imageUrl)}
                    />
                </div>
            </div>

            <div className="lightbox-foot" inert={reportOpen || undefined}>
                <div className={styles.footMeta}>
                    {submitterName && <span>Eingereicht von {submitterName}</span>}
                    <span>
                        {image.dateTaken
                            ? `Aufgenommen: ${dateLong(new Date(image.dateTaken))}`
                            : `Hochgeladen: ${dateLong(new Date(submittedAt))}`}
                    </span>
                    {image.location && <span>Ort: {image.location}</span>}
                </div>
                <div className={styles.footActions}>
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="btn btn--sm"
                    >
                        Herunterladen
                    </button>
                    <button
                        ref={reportButtonRef}
                        type="button"
                        onClick={openReport}
                        className="btn btn--sm btn--danger"
                        aria-haspopup="dialog"
                    >
                        Melden
                    </button>
                </div>
            </div>

            {reportOpen && (
                <div className={styles.report}>
                    <div
                        className={styles.reportPanel}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Foto melden"
                    >
                        <h2>Foto melden</h2>
                        {reportSent ? (
                            <>
                                <div
                                    className="notice notice--ok"
                                    role="status"
                                >
                                    <strong>Meldung eingegangen</strong>
                                    <span>
                                        Vielen Dank. Die Redaktion prüft das
                                        Foto.
                                    </span>
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn--primary"
                                        onClick={closeReport}
                                    >
                                        Fertig
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className={styles.reportText}>
                                    Warum soll dieses Foto geprüft werden?
                                </p>
                                <div className="field">
                                    <label htmlFor="report-reason">
                                        Grund der Meldung *
                                    </label>
                                    <textarea
                                        ref={reasonRef}
                                        id="report-reason"
                                        className="textarea"
                                        rows={4}
                                        value={reportReason}
                                        onChange={(event) =>
                                            setReportReason(event.target.value)
                                        }
                                        aria-invalid={reportError ? 'true' : undefined}
                                        aria-describedby={
                                            reportError
                                                ? 'report-reason-error'
                                                : undefined
                                        }
                                    />
                                </div>
                                {reportError && (
                                    <p
                                        id="report-reason-error"
                                        className="error-text"
                                        role="alert"
                                        style={{ marginTop: 'var(--s2)' }}
                                    >
                                        {reportError}
                                    </p>
                                )}
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn--primary"
                                        onClick={handleReport}
                                        disabled={
                                            reportSubmitting ||
                                            !reportReason.trim()
                                        }
                                        aria-busy={reportSubmitting}
                                    >
                                        {reportSubmitting
                                            ? 'Wird gesendet …'
                                            : 'Meldung senden'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={closeReport}
                                        disabled={reportSubmitting}
                                    >
                                        Abbrechen
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>,
        document.body,
    );
}
