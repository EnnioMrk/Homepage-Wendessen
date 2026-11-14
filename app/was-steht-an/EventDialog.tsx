'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import CroppedImage from '@/app/components/ui/CroppedImage';
import type { CalendarEvent } from '@/lib/database';
import { clock, dateLong } from '@/app/lib/register-format';
import {
    categoryLabel,
    categoryRule,
    clubFor,
    eventWhenText,
    personName,
    registerNumber,
} from './calendar-utils';
import styles from './calendar.module.css';

interface EventDialogProps {
    event: CalendarEvent | null;
    onClose: () => void;
}

export default function EventDialog({ event, onClose }: EventDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (event && !dialog.open) dialog.showModal();
        if (!event && dialog.open) dialog.close();
    }, [event]);

    const cancelled = Boolean(event?.isCancelled);
    const club = event ? clubFor(event.vereinId) : null;

    return (
        <dialog
            ref={dialogRef}
            className={`dialog ${styles.dialog}`}
            aria-labelledby={event ? 'termin-titel' : undefined}
            onClose={onClose}
            onClick={(clickEvent) => {
                if (clickEvent.target === dialogRef.current) {
                    dialogRef.current?.close();
                }
            }}
        >
            {event && (
                <>
                    <div className="dialog-head">
                        <div>
                            <p className={styles.dialogKicker}>
                                {categoryLabel(event.category)} · Nr.{' '}
                                {registerNumber(event)}
                                {cancelled ? ' · Abgesagt' : ''}
                            </p>
                            <h2
                                id="termin-titel"
                                className={styles.dialogTitle}
                                data-cancelled={cancelled ? 'true' : undefined}
                            >
                                {event.title}
                            </h2>
                            {cancelled && (
                                <span className="stamp stamp--cancelled" style={{ marginTop: 8 }}>
                                    Abgesagt
                                </span>
                            )}
                        </div>
                        <button
                            type="button"
                            className="dialog-close"
                            aria-label="Termin schließen"
                            title="Schließen"
                            onClick={() => dialogRef.current?.close()}
                        >
                            ×
                        </button>
                    </div>

                    <div className="dialog-body">
                        {cancelled && (
                            <div
                                className="notice notice--error"
                                role="status"
                            >
                                <strong>
                                    Dieser Termin wurde abgesagt.
                                </strong>
                                <span>
                                    Bitte berücksichtigen: die Veranstaltung
                                    findet nicht statt.
                                    {event.cancelledAt && (
                                        <>
                                            {' '}
                                            Abgesagt am{' '}
                                            {dateLong(event.cancelledAt)},{' '}
                                            {clock(event.cancelledAt)} Uhr
                                            {event.cancelledBy
                                                ? ` von ${personName(event.cancelledBy)}`
                                                : ''}
                                            .
                                        </>
                                    )}
                                </span>
                            </div>
                        )}

                        {event.imageUrl && (
                            <div className={styles.media}>
                                <CroppedImage
                                    src={event.imageUrl}
                                    cropData={event.imageCropData}
                                    viewId="popup"
                                    alt={event.title}
                                    sizes="(max-width: 720px) 100vw, 720px"
                                />
                            </div>
                        )}

                        <dl className={`kv ${styles.facts}`}>
                            <dt>Datum</dt>
                            <dd>{eventWhenText(event)}</dd>
                            {event.location && (
                                <>
                                    <dt>Ort</dt>
                                    <dd>{event.location}</dd>
                                </>
                            )}
                            {event.organizer && (
                                <>
                                    <dt>Veranstalter</dt>
                                    <dd>{event.organizer}</dd>
                                </>
                            )}
                            {club && (
                                <>
                                    <dt>Verein</dt>
                                    <dd>
                                        <Link
                                            className="link"
                                            href={club.href}
                                        >
                                            {club.title}
                                        </Link>
                                    </dd>
                                </>
                            )}
                            <dt>Kategorie</dt>
                            <dd>
                                <span
                                    className={`${styles.cat} ${categoryRule(event.category)}`}
                                >
                                    {categoryLabel(event.category)}
                                </span>
                            </dd>
                        </dl>

                        {event.description && (
                            <>
                                <h3 className={styles.descHead}>
                                    Beschreibung
                                </h3>
                                <p className={`prose ${styles.desc}`}>
                                    {event.description}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="dialog-foot">
                        <button
                            type="button"
                            className="btn btn--quiet"
                            onClick={() => dialogRef.current?.close()}
                        >
                            Schließen
                        </button>
                    </div>
                </>
            )}
        </dialog>
    );
}
