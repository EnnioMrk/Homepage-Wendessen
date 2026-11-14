'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import GalleryImagePicker from '@/app/admin/components/GalleryImagePicker';
import { usePermissions } from '@/lib/usePermissions';
import ImageCropper from '@/app/components/ui/ImageCropper';
import { ImageCropConfig } from '@/lib/database/events';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    title?: string;
    initialValues?: {
        start?: string;
        end?: string;
        title?: string;
        description?: string;
        location?: string;
        category?: string;
        organizer?: string;
        imageUrl?: string;
    };
}

import { VEREINE_OPTIONS as GLOBAL_VEREINE_OPTIONS } from '@/lib/constants/associations';

// Vereine data for dropdown
const VEREINE_OPTIONS = [
    { id: '', label: 'Kein Verein' },
    ...GLOBAL_VEREINE_OPTIONS,
];

const CATEGORY_OPTIONS = [
    { id: 'sonstiges', label: 'Sonstiges' },
    { id: 'sitzung', label: 'Sitzung' },
    { id: 'veranstaltung', label: 'Veranstaltung' },
    { id: 'sport', label: 'Sport' },
    { id: 'kultur', label: 'Kultur' },
    { id: 'notfall', label: 'Notfall' },
];

export default function EventModal({
    isOpen,
    onClose,
    onSuccess,
    title = 'Neuer Termin',
    initialValues,
}: EventModalProps) {
    const {
        hasPermission,
        user,
        loading: permissionsLoading,
    } = usePermissions();
    const [isLoading, setIsLoading] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [showCropper, setShowCropper] = useState(false);
    const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl || '');
    const [imageCropData, setImageCropData] = useState<
        ImageCropConfig | undefined
    >(undefined);
    const [selectedVereinId, setSelectedVereinId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const childOverlayRef = useRef(false);

    const hasGeneralCreatePermission = hasPermission('events.create');
    const hasVereinCreatePermission = hasPermission('verein.events.create');
    const canSelectVerein = hasGeneralCreatePermission;

    useEffect(() => {
        if (!permissionsLoading && user) {
            if (
                !hasGeneralCreatePermission &&
                hasVereinCreatePermission &&
                user.vereinId
            ) {
                setSelectedVereinId(user.vereinId);
            }
        }
    }, [
        user,
        permissionsLoading,
        hasGeneralCreatePermission,
        hasVereinCreatePermission,
    ]);

    const closeRef = useRef(onClose);

    useEffect(() => {
        closeRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        childOverlayRef.current = showImagePicker || showCropper;
    }, [showImagePicker, showCropper]);

    useEffect(() => {
        if (!isOpen) return;
        const element = dialogRef.current;
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
                if (childOverlayRef.current) return;
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
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const startDate = formData.get('startDate') as string;
        const startTime = formData.get('startTime') as string;
        const endDate = formData.get('endDate') as string;
        const endTime = formData.get('endTime') as string;

        const isAllDay = !startTime && !endTime;

        let startDateTime: string;
        let endDateTime: string;

        if (isAllDay) {
            const startDateObject = new Date(startDate + 'T00:00:00');
            const endDateObject = new Date(endDate + 'T23:59:59');
            startDateTime = startDateObject.toISOString();
            endDateTime = endDateObject.toISOString();
        } else {
            const startTimeValue = startTime || '00:00';
            const endTimeValue = endTime || '23:59';
            const startDateObject = new Date(
                `${startDate}T${startTimeValue}:00`,
            );
            const endDateObject = new Date(`${endDate}T${endTimeValue}:00`);
            startDateTime = startDateObject.toISOString();
            endDateTime = endDateObject.toISOString();
        }

        if (new Date(endDateTime) < new Date(startDateTime)) {
            setError('Das Ende darf nicht vor dem Start liegen.');
            setIsLoading(false);
            return;
        }

        const eventData = {
            title: formData.get('title'),
            description: formData.get('description'),
            start: startDateTime,
            end: endDateTime,
            location: formData.get('location'),
            category: formData.get('category'),
            organizer: formData.get('organizer'),
            imageUrl: imageUrl,
            imageCropData: imageCropData,
            vereinId: formData.get('vereinId') || null,
        };

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventData),
            });

            if (response.ok) {
                onClose();
                if (onSuccess) {
                    onSuccess();
                }
                form.reset();
                setImageUrl('');
                setImageCropData(undefined);
            } else {
                const data = await response.json().catch(() => null);
                setError(
                    data?.error ||
                        'Der Termin konnte nicht angelegt werden. Prüfen Sie die Angaben.',
                );
            }
        } catch (requestError) {
            console.error('Error creating event:', requestError);
            setError(
                'Netzwerkfehler beim Anlegen des Termins. Versuchen Sie es erneut.',
            );
        } finally {
            setIsLoading(false);
        }
    };

    const datePart = (value?: string) =>
        value ? value.split('T')[0] : undefined;
    const timePart = (value?: string) =>
        value && value.includes('T')
            ? value.split('T')[1]?.substring(0, 5)
            : '';

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 60,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: 'var(--s5) var(--s4)',
                overflowY: 'auto',
                background: 'rgba(20, 36, 32, 0.62)',
            }}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div
                ref={dialogRef}
                className="dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-event-title"
            >
                <form onSubmit={handleSubmit}>
                    <div className="dialog-head">
                        <div>
                            <h2 id="create-event-title">{title}</h2>
                            <p className="small muted">
                                Eintrag im Register der Termine
                            </p>
                        </div>
                        <button
                            type="button"
                            className="dialog-close"
                            onClick={onClose}
                            aria-label="Dialog schließen"
                        >
                            ×
                        </button>
                    </div>

                    <div className="dialog-body">
                        {error && (
                            <div
                                className="notice notice--error"
                                role="alert"
                                style={{ marginBottom: 'var(--s4)' }}
                            >
                                <strong>Nicht angelegt</strong>
                                <span>{error}</span>
                            </div>
                        )}

                        <div
                            style={{
                                display: 'grid',
                                gap: 'var(--s4)',
                            }}
                        >
                            <div className="field">
                                <label htmlFor="create-event-title-field">
                                    Titel *
                                </label>
                                <input
                                    id="create-event-title-field"
                                    name="title"
                                    type="text"
                                    required
                                    disabled={isLoading}
                                    defaultValue={initialValues?.title || ''}
                                    className="input"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="create-event-description">
                                    Beschreibung
                                </label>
                                <textarea
                                    id="create-event-description"
                                    name="description"
                                    rows={3}
                                    disabled={isLoading}
                                    defaultValue={
                                        initialValues?.description || ''
                                    }
                                    className="textarea"
                                    style={{ minHeight: '96px' }}
                                />
                            </div>

                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns:
                                        'repeat(2, minmax(0, 1fr))',
                                    gap: 'var(--s4)',
                                }}
                            >
                                <div
                                    style={{
                                        display: 'grid',
                                        gap: 'var(--s3)',
                                    }}
                                >
                                    <div className="field">
                                        <label htmlFor="create-event-start-date">
                                            Startdatum *
                                        </label>
                                        <input
                                            id="create-event-start-date"
                                            name="startDate"
                                            type="date"
                                            required
                                            disabled={isLoading}
                                            defaultValue={datePart(
                                                initialValues?.start,
                                            )}
                                            className="input"
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="create-event-start-time">
                                            Startzeit
                                        </label>
                                        <input
                                            id="create-event-start-time"
                                            name="startTime"
                                            type="time"
                                            disabled={isLoading}
                                            defaultValue={timePart(
                                                initialValues?.start,
                                            )}
                                            className="input"
                                        />
                                        <span className="hint">
                                            Leer lassen für einen ganztägigen
                                            Termin.
                                        </span>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: 'grid',
                                        gap: 'var(--s3)',
                                    }}
                                >
                                    <div className="field">
                                        <label htmlFor="create-event-end-date">
                                            Enddatum *
                                        </label>
                                        <input
                                            id="create-event-end-date"
                                            name="endDate"
                                            type="date"
                                            required
                                            disabled={isLoading}
                                            defaultValue={datePart(
                                                initialValues?.end,
                                            )}
                                            className="input"
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="create-event-end-time">
                                            Endzeit
                                        </label>
                                        <input
                                            id="create-event-end-time"
                                            name="endTime"
                                            type="time"
                                            disabled={isLoading}
                                            defaultValue={timePart(
                                                initialValues?.end,
                                            )}
                                            className="input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <label htmlFor="create-event-location">
                                    Ort
                                </label>
                                <input
                                    id="create-event-location"
                                    name="location"
                                    type="text"
                                    disabled={isLoading}
                                    defaultValue={initialValues?.location || ''}
                                    className="input"
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="create-event-verein">
                                    Verein
                                </label>
                                {permissionsLoading ? (
                                    <p className="muted small">
                                        Berechtigungen werden geladen …
                                    </p>
                                ) : (
                                    <select
                                        id="create-event-verein"
                                        name="vereinId"
                                        disabled={isLoading || !canSelectVerein}
                                        value={selectedVereinId}
                                        onChange={(event) =>
                                            setSelectedVereinId(
                                                event.target.value,
                                            )
                                        }
                                        className="select"
                                    >
                                        {VEREINE_OPTIONS.map((verein) => (
                                            <option
                                                key={verein.id}
                                                value={verein.id}
                                            >
                                                {verein.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {!canSelectVerein &&
                                    hasVereinCreatePermission && (
                                        <span className="hint">
                                            Als Vereinsverwalter legen Sie
                                            Termine nur für Ihren eigenen Verein
                                            an.
                                        </span>
                                    )}
                            </div>

                            <div className="field">
                                <label htmlFor="create-event-category">
                                    Rubrik
                                </label>
                                <select
                                    id="create-event-category"
                                    name="category"
                                    disabled={isLoading}
                                    defaultValue={
                                        initialValues?.category || 'sonstiges'
                                    }
                                    className="select"
                                >
                                    {CATEGORY_OPTIONS.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="create-event-organizer">
                                    Veranstalter
                                </label>
                                <input
                                    id="create-event-organizer"
                                    name="organizer"
                                    type="text"
                                    disabled={isLoading}
                                    defaultValue={
                                        initialValues?.organizer || ''
                                    }
                                    className="input"
                                />
                            </div>

                            <div className="field">
                                <span className="field-label">
                                    Bild (optional)
                                </span>
                                {imageUrl ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            gap: 'var(--s3)',
                                            padding: 'var(--s3)',
                                            border: 'var(--border) solid var(--rule)',
                                            background: 'var(--paper-sunken)',
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: 'relative',
                                                display: 'block',
                                                width: '64px',
                                                height: '64px',
                                                flex: 'none',
                                                border: 'var(--border) solid var(--rule-strong)',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Image
                                                src={imageUrl}
                                                alt="Ausgewähltes Bild"
                                                fill
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </span>
                                        <span
                                            style={{
                                                flex: '1 1 160px',
                                                fontSize: 'var(--small)',
                                                color: 'var(--ink-secondary)',
                                            }}
                                        >
                                            Das Bild erscheint in der
                                            Terminübersicht.
                                        </span>
                                        <button
                                            type="button"
                                            className="btn btn--sm btn--quiet"
                                            onClick={() => setShowCropper(true)}
                                            disabled={isLoading}
                                        >
                                            Zuschneiden
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn--sm btn--quiet"
                                            onClick={() => {
                                                setImageUrl('');
                                                setImageCropData(undefined);
                                            }}
                                            disabled={isLoading}
                                        >
                                            Entfernen
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowImagePicker(true)
                                        }
                                        disabled={isLoading}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            border: 'var(--border) dashed var(--rule-strong)',
                                            background: 'var(--paper-raised)',
                                            padding: 'var(--s4)',
                                            textAlign: 'center',
                                            font: 'inherit',
                                            fontSize: 'var(--label)',
                                            color: 'var(--ink-secondary)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Bild aus der Galerie wählen
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className="dialog-foot"
                        style={{ position: 'sticky', bottom: 0, zIndex: 1 }}
                    >
                        <button
                            type="button"
                            className="btn btn--quiet"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Wird angelegt …' : 'Termin anlegen'}
                        </button>
                    </div>
                </form>
            </div>

            {showImagePicker && (
                <GalleryImagePicker
                    onSelect={(image) => {
                        setImageUrl(image.url || '');
                        setShowImagePicker(false);
                    }}
                    onClose={() => setShowImagePicker(false)}
                    canUpload={true}
                />
            )}

            {showCropper && imageUrl && (
                <ImageCropper
                    imageUrl={imageUrl}
                    initialCrops={imageCropData || {}}
                    onSave={(crops) => {
                        setImageCropData(crops);
                        setShowCropper(false);
                    }}
                    onCancel={() => setShowCropper(false)}
                />
            )}
        </div>
    );
}
