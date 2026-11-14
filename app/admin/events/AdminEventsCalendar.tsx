'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/de';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { CalendarEvent } from '@/lib/database';

import { usePermissions } from '@/lib/usePermissions';
import EventModal from '@/app/components/events/EventModal';
import GalleryImagePicker from '@/app/admin/components/GalleryImagePicker';
import ImageCropper from '@/app/components/ui/ImageCropper';
import CroppedImage from '@/app/components/ui/CroppedImage';
import { ImageCropConfig } from '@/lib/database/events';

import { ASSOCIATIONS_MAP } from '@/lib/constants/associations';
import {
    EVENT_CATEGORIES,
} from '@/lib/constants/categories';
import {
    clock,
    dateLong,
    dateShort,
    timeRange,
    weekday,
    weekdayLong,
} from '@/app/lib/register-format';
import styles from './events.module.css';

moment.locale('de');

const localizer = momentLocalizer(moment);

const VEREINE_MAP: Record<string, string> = ASSOCIATIONS_MAP;

interface AdminEventsCalendarProps {
    initialEvents: CalendarEvent[];
    showCreateModal?: boolean;
    setShowCreateModal?: (show: boolean) => void;
    onEventsUpdate?: () => Promise<void>;
}

interface EventFormData {
    title: string;
    description: string;
    start: string;
    end: string;
    location: string;
    category:
        | 'sitzung'
        | 'veranstaltung'
        | 'sport'
        | 'kultur'
        | 'notfall'
        | 'sonstiges';
    organizer: string;
    imageUrl: string;
    imageCropData?: ImageCropConfig;
}

const defaultEventForm: EventFormData = {
    title: '',
    description: '',
    start: '',
    end: '',
    location: '',
    category: 'sonstiges',
    organizer: '',
    imageUrl: '',
    imageCropData: undefined,
};

type Period = 'upcoming' | 'past' | 'all';
type PendingAction = 'cancel' | 'restore' | 'delete' | null;

const categoryLabel = (category?: string) =>
    EVENT_CATEGORIES.find((entry) => entry.id === category)?.label ??
    'Sonstiges';

const humanise = (value: string) =>
    value
        .replace(/-wendessen.*$/i, '')
        .replace(/-ev$/i, '')
        .split('-')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

/**
 * Event rows store a club id, which does not always equal an association key
 * (`frauenhilfe-wendessen` vs `frauenhilfe`). Resolve by exact key, then by
 * prefix, then print a readable name instead of the raw machine id.
 */
const vereinLabel = (vereinId?: string) => {
    if (!vereinId) return '—';
    if (VEREINE_MAP[vereinId]) return VEREINE_MAP[vereinId];
    const clean = vereinId.replace(/-wendessen.*$/i, '').replace(/-ev$/i, '');
    const match = Object.entries(VEREINE_MAP).find(
        ([key]) => key === clean || key.startsWith(clean) || clean.startsWith(key),
    );
    return match ? match[1] : humanise(vereinId);
};

const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <span className={event.isCancelled ? styles.calEventCancelled : undefined}>
        {event.isCancelled ? 'Abgesagt · ' : ''}
        {event.title}
    </span>
);

/**
 * Focus trap and Escape for the ruled overlays. The overlay markup is a plain
 * fixed layer (not a native dialog) so the gallery picker and cropper can sit
 * above it.
 */
function useOverlay(
    open: boolean,
    onClose: () => void,
    blocked?: React.RefObject<boolean>,
) {
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
                if (blocked?.current) return;
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
    }, [open, blocked]);

    return ref;
}

export default function AdminEventsCalendar({
    initialEvents,
    showCreateModal = false,
    setShowCreateModal,
    onEventsUpdate,
}: AdminEventsCalendarProps) {
    const { hasPermission, user } = usePermissions();

    const events = useMemo(
        () =>
            initialEvents.map((event) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            })),
        [initialEvents],
    );

    const canEditEvent = (event: CalendarEvent) => {
        if (hasPermission('events.edit')) return true;
        if (!hasPermission('verein.events.edit')) return false;
        return Boolean(
            user?.vereinId &&
                event.vereinId &&
                event.vereinId === user.vereinId,
        );
    };

    const canCancelEvent = (event: CalendarEvent) => {
        if (hasPermission('events.cancel')) return true;
        if (!hasPermission('verein.events.cancel')) return false;
        return Boolean(
            user?.vereinId &&
                event.vereinId &&
                event.vereinId === user.vereinId,
        );
    };

    const canDeleteEvent = (event: CalendarEvent) => {
        if (hasPermission('events.delete')) return true;
        if (!hasPermission('verein.events.delete')) return false;
        return Boolean(
            user?.vereinId &&
                event.vereinId &&
                event.vereinId === user.vereinId,
        );
    };

    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null,
    );
    const [isEditing, setIsEditing] = useState(false);
    const [pendingAction, setPendingAction] = useState<PendingAction>(null);
    const [eventForm, setEventForm] = useState<EventFormData>(defaultEventForm);
    const [formError, setFormError] = useState<string | null>(null);
    const [view, setView] = useState<View>('agenda');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [showCropper, setShowCropper] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialValues, setModalInitialValues] = useState<{
        start?: string;
        end?: string;
    }>({});
    const [search, setSearch] = useState('');
    const [period, setPeriod] = useState<Period>('upcoming');
    const [flash, setFlash] = useState<string | null>(null);

    useEffect(() => {
        if (!flash) return;
        const timer = window.setTimeout(() => setFlash(null), 4500);
        return () => window.clearTimeout(timer);
    }, [flash]);

    const closeDetail = useCallback(() => {
        setSelectedEvent(null);
        setIsEditing(false);
        setPendingAction(null);
        setFormError(null);
    }, []);

    const childOverlayRef = useRef(false);
    useEffect(() => {
        childOverlayRef.current = showImagePicker || showCropper;
    }, [showImagePicker, showCropper]);

    const detailRef = useOverlay(
        Boolean(selectedEvent),
        closeDetail,
        childOverlayRef,
    );

    const openEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsEditing(false);
        setPendingAction(null);
        setFormError(null);
    };

    const handleSelectEvent = (event: CalendarEvent) => openEvent(event);

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        if (
            !hasPermission('events.create') &&
            !hasPermission('verein.events.create')
        ) {
            return;
        }

        const startDate = slotInfo.start;
        const endDate = slotInfo.end;

        if (startDate && endDate) {
            const formatLocalDate = (value: Date) => {
                const year = value.getFullYear();
                const month = String(value.getMonth() + 1).padStart(2, '0');
                const day = String(value.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const start = formatLocalDate(startDate);
            let end;

            const timeDiff = endDate.getTime() - startDate.getTime();
            const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));

            if (daysDiff <= 1) {
                end = start;
            } else {
                const adjustedEndDate = new Date(endDate);
                adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);
                end = formatLocalDate(adjustedEndDate);
            }

            setModalInitialValues({ start, end });
        }

        setIsModalOpen(true);
    };

    const handleUpdateEvent = async () => {
        if (!selectedEvent) return;

        if (!eventForm.title.trim()) {
            setFormError('Bitte geben Sie einen Titel an.');
            return;
        }
        if (!eventForm.start || !eventForm.end) {
            setFormError('Bitte Start und Ende angeben.');
            return;
        }
        if (new Date(eventForm.end) < new Date(eventForm.start)) {
            setFormError('Das Ende darf nicht vor dem Start liegen.');
            return;
        }

        setLoading(true);
        setFormError(null);
        try {
            const response = await fetch(`/api/events/${selectedEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...eventForm,
                    start: new Date(eventForm.start),
                    end: new Date(eventForm.end),
                }),
            });

            if (response.ok) {
                await onEventsUpdate?.();
                closeDetail();
                setFlash('Termin gespeichert.');
            } else {
                const data = await response.json().catch(() => null);
                setFormError(
                    data?.error || 'Fehler beim Aktualisieren des Termins.',
                );
            }
        } catch (error) {
            console.error('Error updating event:', error);
            setFormError('Fehler beim Aktualisieren des Termins.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/events/${selectedEvent.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await onEventsUpdate?.();
                closeDetail();
                setFlash('Termin gelöscht.');
            } else {
                const errorData = await response.json().catch(() => null);
                setFormError(
                    errorData?.error ||
                        'Fehler beim Löschen des Termins. Nur Administratoren können Termine dauerhaft löschen.',
                );
                setPendingAction(null);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            setFormError('Fehler beim Löschen des Termins.');
            setPendingAction(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEvent = async () => {
        if (!selectedEvent) return;

        setLoading(true);
        try {
            const response = await fetch(
                `/api/events/${selectedEvent.id}/cancel`,
                {
                    method: 'POST',
                },
            );

            if (response.ok) {
                await onEventsUpdate?.();
                closeDetail();
                setFlash('Termin abgesagt. Er bleibt im Register sichtbar.');
            } else {
                const errorData = await response.json().catch(() => null);
                setFormError(
                    errorData?.error || 'Fehler beim Absagen des Termins.',
                );
                setPendingAction(null);
            }
        } catch (error) {
            console.error('Error cancelling event:', error);
            setFormError('Fehler beim Absagen des Termins.');
            setPendingAction(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreEvent = async () => {
        if (!selectedEvent) return;

        setLoading(true);
        try {
            const response = await fetch(
                `/api/events/${selectedEvent.id}/cancel`,
                {
                    method: 'DELETE',
                },
            );

            if (response.ok) {
                await onEventsUpdate?.();
                closeDetail();
                setFlash('Termin wiederhergestellt.');
            } else {
                const errorData = await response.json().catch(() => null);
                setFormError(
                    errorData?.error ||
                        'Fehler beim Wiederherstellen des Termins.',
                );
                setPendingAction(null);
            }
        } catch (error) {
            console.error('Error restoring event:', error);
            setFormError('Fehler beim Wiederherstellen des Termins.');
            setPendingAction(null);
        } finally {
            setLoading(false);
        }
    };

    const runPendingAction = () => {
        if (pendingAction === 'cancel') return handleCancelEvent();
        if (pendingAction === 'restore') return handleRestoreEvent();
        if (pendingAction === 'delete') return handleDeleteEvent();
    };

    const startEditing = () => {
        if (!selectedEvent) return;

        setEventForm({
            title: selectedEvent.title,
            description: selectedEvent.description || '',
            start: moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm'),
            end: moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm'),
            location: selectedEvent.location || '',
            category: selectedEvent.category,
            organizer: selectedEvent.organizer || '',
            imageUrl: selectedEvent.imageUrl || '',
            imageCropData: selectedEvent.imageCropData,
        });
        setFormError(null);
        setPendingAction(null);
        setIsEditing(true);
    };

    const categoryOptions = EVENT_CATEGORIES.map((entry) => ({
        value: entry.id,
        label: entry.label,
    }));

    const query = search.trim().toLowerCase();
    const matchesQuery = (event: CalendarEvent) => {
        if (!query) return true;
        return [
            event.title,
            event.location,
            event.organizer,
            categoryLabel(event.category),
            vereinLabel(event.vereinId),
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);
    };

    const visibleEvents = events.filter(matchesQuery);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const agendaEvents = visibleEvents
        .filter((event) => {
            if (period === 'upcoming') return event.end >= today;
            if (period === 'past') return event.end < today;
            return true;
        })
        .sort((a, b) => a.start.getTime() - b.start.getTime());

    const viewLabels: { id: View; label: string }[] = [
        { id: 'agenda', label: 'Agenda' },
        { id: 'month', label: 'Monat' },
        { id: 'week', label: 'Woche' },
        { id: 'day', label: 'Tag' },
    ];

    const rangeLabel = () => {
        if (view === 'month') return moment(date).format('MMMM YYYY');
        if (view === 'week') {
            return `${moment(date).startOf('week').format('DD.MM.')} – ${moment(
                date,
            )
                .endOf('week')
                .format('DD.MM.YYYY')}`;
        }
        return moment(date).format('dddd, DD. MMMM YYYY');
    };

    const navigate = (direction: -1 | 1 | 0) => {
        if (direction === 0) {
            setDate(new Date());
            return;
        }
        const unit = view === 'month' ? 'month' : view === 'week' ? 'week' : 'day';
        setDate(moment(date).add(direction, unit).toDate());
    };

    const selectedIsCancelled = Boolean(selectedEvent?.isCancelled);

    const confirmCopy = () => {
        if (!selectedEvent) return null;
        if (pendingAction === 'cancel') {
            return {
                tone: 'notice--warn',
                title: 'Termin absagen?',
                text: 'Der Termin wird nicht gelöscht. Er bleibt im Register und auf der Website sichtbar, verliert seine Farbe und erhält den Stempel „Abgesagt“.',
                confirm: 'Ja, absagen',
                button: 'btn--danger',
            };
        }
        if (pendingAction === 'restore') {
            return {
                tone: 'notice--ok',
                title: 'Termin wiederherstellen?',
                text: 'Der Stempel „Abgesagt“ wird entfernt. Der Termin gilt wieder als angesetzt.',
                confirm: 'Wiederherstellen',
                button: 'btn--primary',
            };
        }
        return {
            tone: 'notice--warn',
            title: 'Termin dauerhaft löschen?',
            text: 'Der Eintrag wird aus dem Register entfernt. Diese Aktion kann nicht rückgängig gemacht werden.',
            confirm: 'Endgültig löschen',
            button: 'btn--danger',
        };
    };

    const confirmation = confirmCopy();

    return (
        <div>
            {flash && (
                <div className="notice notice--ok" role="status">
                    <strong>Gespeichert</strong>
                    <span>{flash}</span>
                </div>
            )}

            <div className={styles.toolbar}>
                <div
                    className="tabs"
                    role="tablist"
                    aria-label="Ansicht wählen"
                >
                    {viewLabels.map((entry) => (
                        <button
                            key={entry.id}
                            type="button"
                            role="tab"
                            aria-selected={view === entry.id}
                            aria-controls="event-view-panel"
                            onClick={() => setView(entry.id)}
                        >
                            {entry.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filterbar">
                <div className="field grow">
                    <label htmlFor="event-search">Suche</label>
                    <input
                        id="event-search"
                        className="input"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Titel, Ort, Verein …"
                    />
                </div>
                {view === 'agenda' && (
                    <div className="field">
                        <label htmlFor="event-period">Zeitraum</label>
                        <select
                            id="event-period"
                            className="select"
                            value={period}
                            onChange={(event) =>
                                setPeriod(event.target.value as Period)
                            }
                        >
                            <option value="upcoming">Kommende</option>
                            <option value="past">Vergangene</option>
                            <option value="all">Alle</option>
                        </select>
                    </div>
                )}
                <p className="count">
                    {view === 'agenda'
                        ? `${agendaEvents.length} von ${events.length} Einträgen`
                        : `${visibleEvents.length} von ${events.length} Einträgen`}
                </p>
            </div>

            <div id="event-view-panel" role="tabpanel">
                {view === 'agenda' ? (
                    agendaEvents.length === 0 ? (
                        <div className="empty">
                            <h3>Keine Termine im gewählten Zeitraum</h3>
                            <p>
                                {query
                                    ? 'Die Suche ergab keinen Treffer. Setzen Sie den Suchbegriff zurück oder wählen Sie einen anderen Zeitraum.'
                                    : period === 'past'
                                      ? 'Für die Vergangenheit sind keine Einträge verzeichnet.'
                                      : 'Für diesen Zeitraum ist noch kein Termin eingetragen. Legen Sie den ersten Eintrag an.'}
                            </p>
                        </div>
                    ) : (
                        <table className={`data ${styles.agenda}`}>
                            <thead>
                                <tr>
                                    <th scope="col">Datum</th>
                                    <th scope="col">Zeit</th>
                                    <th scope="col">Termin</th>
                                    <th scope="col" className={styles.colPlace}>
                                        Ort
                                    </th>
                                    <th scope="col" className={styles.colClub}>
                                        Verein
                                    </th>
                                    <th scope="col">Zustand</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agendaEvents.map((event) => (
                                    <tr key={event.id}>
                                        <td className={styles.cellDate}>
                                            <span className={styles.dateCell}>
                                                <span className={styles.dow}>
                                                    {weekday(event.start)}
                                                </span>
                                                <span>
                                                    {dateShort(event.start)}
                                                </span>
                                            </span>
                                        </td>
                                        <td
                                            className={styles.cellTime}
                                            style={{
                                                whiteSpace: 'nowrap',
                                                fontVariantNumeric:
                                                    'tabular-nums',
                                            }}
                                        >
                                            {timeRange(event.start, event.end)}
                                        </td>
                                        <td className={styles.cellTitle}>
                                            <button
                                                type="button"
                                                className={`${styles.agendaTitle} ${
                                                    event.isCancelled
                                                        ? styles.agendaTitleCancelled
                                                        : ''
                                                }`}
                                                onClick={() => openEvent(event)}
                                            >
                                                {event.title}
                                            </button>
                                            <span className={styles.category}>
                                                {categoryLabel(event.category)}
                                            </span>
                                        </td>
                                        <td className={styles.colPlace}>
                                            <span className={styles.place}>
                                                {event.location || '—'}
                                            </span>
                                        </td>
                                        <td className={styles.colClub}>
                                            <span className={styles.club}>
                                                {vereinLabel(event.vereinId)}
                                            </span>
                                        </td>
                                        <td className={styles.cellState}>
                                            {event.isCancelled ? (
                                                <span className="stamp stamp--cancelled">
                                                    Abgesagt
                                                </span>
                                            ) : (
                                                <span className={styles.stateOpen}>
                                                    Angesetzt
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                ) : (
                    <>
                        <div className={styles.navRow}>
                            <button
                                type="button"
                                className="btn btn--sm btn--quiet"
                                onClick={() => navigate(-1)}
                            >
                                Zurück
                            </button>
                            <button
                                type="button"
                                className="btn btn--sm btn--quiet"
                                onClick={() => navigate(0)}
                            >
                                Heute
                            </button>
                            <button
                                type="button"
                                className="btn btn--sm btn--quiet"
                                onClick={() => navigate(1)}
                            >
                                Weiter
                            </button>
                            <p className={styles.rangeLabel}>{rangeLabel()}</p>
                        </div>
                        <div className={styles.surface}>
                            <Calendar
                                localizer={localizer}
                                events={visibleEvents}
                                startAccessor="start"
                                endAccessor="end"
                                onSelectEvent={handleSelectEvent}
                                onSelectSlot={handleSelectSlot}
                                onNavigate={setDate}
                                onView={setView}
                                view={view}
                                views={['month', 'week', 'day']}
                                date={date}
                                selectable
                                toolbar={false}
                                components={{ event: EventComponent }}
                                messages={{
                                    next: 'Weiter',
                                    previous: 'Zurück',
                                    today: 'Heute',
                                    month: 'Monat',
                                    week: 'Woche',
                                    day: 'Tag',
                                    agenda: 'Agenda',
                                    date: 'Datum',
                                    time: 'Zeit',
                                    event: 'Termin',
                                    noEventsInRange:
                                        'Keine Termine in diesem Zeitraum',
                                    showMore: (total: number) =>
                                        `+ ${total} weitere`,
                                }}
                                culture="de"
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Detail / edit dialog */}
            {selectedEvent && (
                <div
                    className={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeDetail();
                    }}
                >
                    <div
                        ref={detailRef}
                        className={`dialog ${styles.dialogWide}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="event-dialog-title"
                    >
                        <div className="dialog-head">
                            <div>
                                <h2 id="event-dialog-title">
                                    {isEditing
                                        ? 'Termin bearbeiten'
                                        : selectedEvent.title}
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={closeDetail}
                                aria-label="Dialog schließen"
                            >
                                ×
                            </button>
                        </div>

                        <div className="dialog-body">
                            {formError && (
                                <div
                                    className="notice notice--error"
                                    role="alert"
                                    style={{ marginBottom: 'var(--s4)' }}
                                >
                                    <strong>Nicht gespeichert</strong>
                                    <span>{formError}</span>
                                </div>
                            )}

                            {isEditing ? (
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        handleUpdateEvent();
                                    }}
                                >
                                    <div className={styles.formSection}>
                                        <p className={styles.formSectionTitle}>
                                            Eintrag
                                        </p>
                                        <div className={styles.formGrid}>
                                            <div className="field">
                                                <label htmlFor="event-title">
                                                    Titel *
                                                </label>
                                                <input
                                                    id="event-title"
                                                    className="input"
                                                    type="text"
                                                    required
                                                    value={eventForm.title}
                                                    onChange={(event) =>
                                                        setEventForm({
                                                            ...eventForm,
                                                            title: event.target
                                                                .value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="field">
                                                <label htmlFor="event-description">
                                                    Beschreibung
                                                </label>
                                                <textarea
                                                    id="event-description"
                                                    className="textarea"
                                                    rows={4}
                                                    value={
                                                        eventForm.description
                                                    }
                                                    onChange={(event) =>
                                                        setEventForm({
                                                            ...eventForm,
                                                            description:
                                                                event.target
                                                                    .value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className={styles.formRow}>
                                                <div className="field">
                                                    <label htmlFor="event-start">
                                                        Start *
                                                    </label>
                                                    <input
                                                        id="event-start"
                                                        className="input"
                                                        type="datetime-local"
                                                        required
                                                        value={eventForm.start}
                                                        onChange={(event) =>
                                                            setEventForm({
                                                                ...eventForm,
                                                                start: event
                                                                    .target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="field">
                                                    <label htmlFor="event-end">
                                                        Ende *
                                                    </label>
                                                    <input
                                                        id="event-end"
                                                        className="input"
                                                        type="datetime-local"
                                                        required
                                                        value={eventForm.end}
                                                        onChange={(event) =>
                                                            setEventForm({
                                                                ...eventForm,
                                                                end: event.target
                                                                    .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.formRow}>
                                                <div className="field">
                                                    <label htmlFor="event-location">
                                                        Ort
                                                    </label>
                                                    <input
                                                        id="event-location"
                                                        className="input"
                                                        type="text"
                                                        value={
                                                            eventForm.location
                                                        }
                                                        onChange={(event) =>
                                                            setEventForm({
                                                                ...eventForm,
                                                                location:
                                                                    event.target
                                                                        .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="field">
                                                    <label htmlFor="event-organizer">
                                                        Veranstalter
                                                    </label>
                                                    <input
                                                        id="event-organizer"
                                                        className="input"
                                                        type="text"
                                                        value={
                                                            eventForm.organizer
                                                        }
                                                        onChange={(event) =>
                                                            setEventForm({
                                                                ...eventForm,
                                                                organizer:
                                                                    event.target
                                                                        .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="field">
                                                <label htmlFor="event-category">
                                                    Rubrik
                                                </label>
                                                <select
                                                    id="event-category"
                                                    className="select"
                                                    value={eventForm.category}
                                                    onChange={(event) =>
                                                        setEventForm({
                                                            ...eventForm,
                                                            category: event.target
                                                                .value as CalendarEvent['category'],
                                                        })
                                                    }
                                                >
                                                    {categoryOptions.map(
                                                        (option) => (
                                                            <option
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </div>
                                            <div className="field">
                                                <span className="field-label">
                                                    Bild
                                                </span>
                                                {eventForm.imageUrl ? (
                                                    <div
                                                        className={
                                                            styles.imageTray
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                styles.trayThumb
                                                            }
                                                        >
                                                            <CroppedImage
                                                                src={
                                                                    eventForm.imageUrl
                                                                }
                                                                cropData={
                                                                    eventForm.imageCropData
                                                                }
                                                                viewId="popup"
                                                                alt="Gewähltes Terminbild"
                                                                fill
                                                            />
                                                        </span>
                                                        <span
                                                            className={
                                                                styles.imageTrayText
                                                            }
                                                        >
                                                            Das Bild erscheint in
                                                            der Terminübersicht.
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="btn btn--sm btn--quiet"
                                                            onClick={() =>
                                                                setShowCropper(
                                                                    true,
                                                                )
                                                            }
                                                        >
                                                            Zuschneiden
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn--sm btn--quiet"
                                                            onClick={() =>
                                                                setEventForm({
                                                                    ...eventForm,
                                                                    imageUrl:
                                                                        '',
                                                                    imageCropData:
                                                                        undefined,
                                                                })
                                                            }
                                                        >
                                                            Entfernen
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className={
                                                            styles.picker
                                                        }
                                                        onClick={() =>
                                                            setShowImagePicker(
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        Bild aus der Galerie
                                                        wählen
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.formSection}>
                                        <p className={styles.formSectionTitle}>
                                            Absage
                                        </p>
                                        {selectedIsCancelled ? (
                                            <div className="notice notice--warn">
                                                <strong>
                                                    Dieser Termin ist abgesagt
                                                </strong>
                                                <span>
                                                    Der Eintrag bleibt im
                                                    Register sichtbar. Zum
                                                    Reaktivieren wechseln Sie
                                                    zurück in die Ansicht und
                                                    wählen „Wiederherstellen“.
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="notice">
                                                <strong>
                                                    Absagen statt löschen
                                                </strong>
                                                <span>
                                                    Ein abgesagter Termin bleibt
                                                    im Register und auf der
                                                    Website sichtbar, wird aber
                                                    mit dem Stempel „Abgesagt“
                                                    gekennzeichnet. Die
                                                    Absage können Sie in der
                                                    Ansicht auslösen.
                                                </span>
                                            </div>
                                        )}
                                        {canCancelEvent(selectedEvent) && (
                                            <div
                                                style={{
                                                    marginTop: 'var(--s3)',
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="btn btn--sm btn--danger"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setPendingAction(
                                                            selectedIsCancelled
                                                                ? 'restore'
                                                                : 'cancel',
                                                        );
                                                    }}
                                                >
                                                    {selectedIsCancelled
                                                        ? 'Wiederherstellen'
                                                        : 'Termin absagen'}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`dialog-foot ${styles.footSticky}`}
                                        style={{ marginTop: 'var(--s5)' }}
                                    >
                                        <button
                                            type="button"
                                            className="btn btn--quiet"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormError(null);
                                            }}
                                            disabled={loading}
                                        >
                                            Abbrechen
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn--primary"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? 'Speichern …'
                                                : 'Änderungen speichern'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className={styles.detailState}>
                                        <span className={styles.category}>
                                            {categoryLabel(
                                                selectedEvent.category,
                                            )}
                                        </span>
                                        {selectedIsCancelled && (
                                            <div className="notice notice--warn">
                                                <strong>
                                                    Dieser Termin ist abgesagt
                                                </strong>
                                                {selectedEvent.cancelledBy && (
                                                    <span>
                                                        Abgesagt von{' '}
                                                        {
                                                            selectedEvent.cancelledBy
                                                        }
                                                        {selectedEvent.cancelledAt
                                                            ? ` am ${dateShort(
                                                                  new Date(
                                                                      selectedEvent.cancelledAt,
                                                                  ),
                                                              )} um ${clock(
                                                                  new Date(
                                                                      selectedEvent.cancelledAt,
                                                                  ),
                                                              )} Uhr`
                                                            : ''}
                                                        .
                                                    </span>
                                                )}
                                                <span>
                                                    Der Eintrag bleibt im
                                                    Register sichtbar und ist auf
                                                    der Website als abgesagt
                                                    gekennzeichnet.
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <dl className="kv">
                                        <dt>Zeit</dt>
                                        <dd>
                                            {weekdayLong(selectedEvent.start)},{' '}
                                            {dateLong(selectedEvent.start)} ·{' '}
                                            {timeRange(
                                                selectedEvent.start,
                                                selectedEvent.end,
                                            )}{' '}
                                            Uhr
                                        </dd>
                                        <dt>Ort</dt>
                                        <dd>{selectedEvent.location || '—'}</dd>
                                        <dt>Veranstalter</dt>
                                        <dd>
                                            {selectedEvent.organizer || '—'}
                                        </dd>
                                        <dt>Verein</dt>
                                        <dd>
                                            {vereinLabel(selectedEvent.vereinId)}
                                        </dd>
                                    </dl>

                                    {selectedEvent.description && (
                                        <>
                                            <p className={styles.kicker}>
                                                Beschreibung
                                            </p>
                                            <p className={styles.description}>
                                                {selectedEvent.description}
                                            </p>
                                        </>
                                    )}

                                    {selectedEvent.imageUrl && (
                                        <div
                                            className={styles.figure}
                                            style={{
                                                position: 'relative',
                                                aspectRatio: '16 / 9',
                                                marginTop: 'var(--s4)',
                                            }}
                                        >
                                            <CroppedImage
                                                src={selectedEvent.imageUrl}
                                                cropData={
                                                    selectedEvent.imageCropData
                                                }
                                                viewId="popup"
                                                alt={selectedEvent.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <p className={styles.figureCaption}>
                                                Terminbild
                                            </p>
                                        </div>
                                    )}

                                    {confirmation && pendingAction && (
                                        <div className={styles.confirmBlock}>
                                            <div
                                                className={`notice ${confirmation.tone}`}
                                                role="alert"
                                            >
                                                <strong>
                                                    {confirmation.title}
                                                </strong>
                                                <span>{confirmation.text}</span>
                                            </div>
                                            <div
                                                className={
                                                    styles.confirmActions
                                                }
                                            >
                                                <button
                                                    type="button"
                                                    className={`btn ${confirmation.button}`}
                                                    onClick={runPendingAction}
                                                    disabled={loading}
                                                >
                                                    {loading
                                                        ? 'Einen Moment …'
                                                        : confirmation.confirm}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn--quiet"
                                                    onClick={() =>
                                                        setPendingAction(null)
                                                    }
                                                    disabled={loading}
                                                >
                                                    Abbrechen
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {!isEditing && (
                            <div className={`dialog-foot ${styles.footSticky}`}>
                                {canDeleteEvent(selectedEvent) && (
                                    <button
                                        type="button"
                                        className="btn btn--danger"
                                        onClick={() => setPendingAction('delete')}
                                        disabled={loading}
                                    >
                                        Löschen
                                    </button>
                                )}
                                {canCancelEvent(selectedEvent) && (
                                    <button
                                        type="button"
                                        className="btn btn--quiet"
                                        onClick={() =>
                                            setPendingAction(
                                                selectedIsCancelled
                                                    ? 'restore'
                                                    : 'cancel',
                                            )
                                        }
                                        disabled={loading}
                                    >
                                        {selectedIsCancelled
                                            ? 'Wiederherstellen'
                                            : 'Absagen'}
                                    </button>
                                )}
                                {canEditEvent(selectedEvent) && (
                                    <button
                                        type="button"
                                        className="btn btn--primary"
                                        onClick={startEditing}
                                        disabled={loading}
                                    >
                                        Bearbeiten
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn--quiet"
                                    onClick={closeDetail}
                                    disabled={loading}
                                >
                                    Schließen
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <EventModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal?.(false)}
                onSuccess={() => {
                    onEventsUpdate?.();
                    setFlash('Termin angelegt.');
                }}
            />

            <EventModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalInitialValues({});
                }}
                onSuccess={() => {
                    onEventsUpdate?.();
                    setIsModalOpen(false);
                    setModalInitialValues({});
                    setFlash('Termin angelegt.');
                }}
                initialValues={modalInitialValues}
            />

            {showImagePicker && (
                <GalleryImagePicker
                    onSelect={(image) => {
                        setEventForm((prev) => ({
                            ...prev,
                            imageUrl: image.url || '',
                        }));
                        setShowImagePicker(false);
                    }}
                    onClose={() => setShowImagePicker(false)}
                    canUpload={hasPermission('gallery.upload')}
                />
            )}

            {showCropper && eventForm.imageUrl && (
                <ImageCropper
                    imageUrl={eventForm.imageUrl}
                    initialCrops={eventForm.imageCropData}
                    onSave={(crops) => {
                        setEventForm((prev) => ({
                            ...prev,
                            imageCropData: crops,
                        }));
                        setShowCropper(false);
                    }}
                    onCancel={() => setShowCropper(false)}
                />
            )}
        </div>
    );
}
