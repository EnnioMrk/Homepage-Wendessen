'use client';

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/de';
import '../../was-steht-an/calendar.css'; // Import calendar styles
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/lib/database';
import { getCategoryBackgroundColor } from '@/lib/event-utils';
import EventModal from '@/app/components/EventModal';
import {
    Users,
    Calendar as CalendarIcon,
    Zap,
    Music,
    MapPin,
    Clock,
    X,
    User,
    Edit,
    Trash2,
    Save,
    Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import ImagePicker from '../../components/ImagePicker';

// Set German locale and configure moment properly
moment.locale('de');

// Create localizer with proper configuration
const localizer = momentLocalizer(moment);

interface AdminEventsCalendarProps {
    initialEvents: CalendarEvent[];
    showCreateModal?: boolean;
    setShowCreateModal?: (show: boolean) => void;
    onEventsUpdate?: () => Promise<void>;
}

// Event form interface
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
};

// Custom event component
const EventComponent = ({ event }: { event: CalendarEvent }) => {
    return (
        <div
            className={`${getCategoryBackgroundColor(
                event.category || 'sonstiges'
            )} text-white p-1 rounded text-xs font-medium overflow-hidden`}
        >
            <div className="truncate">{event.title}</div>
        </div>
    );
};

// Custom agenda event component
const AgendaEventComponent = ({ event }: { event: CalendarEvent }) => {
    return (
        <div className="flex items-center space-x-3">
            <div
                className={`w-3 h-3 rounded-full ${getCategoryBackgroundColor(
                    event.category || 'sonstiges'
                )}`}
            ></div>
            <div className="flex-1">
                <div className="font-medium text-gray-900">{event.title}</div>
                {event.location && (
                    <div className="text-sm text-gray-500">
                        {event.location}
                    </div>
                )}
                {event.organizer && (
                    <div className="text-sm text-gray-500">
                        Veranstalter: {event.organizer}
                    </div>
                )}
            </div>
            <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                    {moment(event.start).format('HH:mm')}
                    {event.end && ` - ${moment(event.end).format('HH:mm')}`}
                </div>
                <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        event.category === 'sitzung'
                            ? 'bg-blue-100 text-blue-800'
                            : event.category === 'veranstaltung'
                            ? 'bg-green-100 text-green-800'
                            : event.category === 'sport'
                            ? 'bg-orange-100 text-orange-800'
                            : event.category === 'kultur'
                            ? 'bg-purple-100 text-purple-800'
                            : event.category === 'notfall'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                >
                    {event.category === 'sitzung'
                        ? 'Sitzung'
                        : event.category === 'veranstaltung'
                        ? 'Veranstaltung'
                        : event.category === 'sport'
                        ? 'Sport'
                        : event.category === 'kultur'
                        ? 'Kultur'
                        : event.category === 'notfall'
                        ? 'Notfall'
                        : 'Sonstiges'}
                </span>
            </div>
        </div>
    );
};

export default function AdminEventsCalendar({
    initialEvents,
    showCreateModal = false,
    setShowCreateModal,
    onEventsUpdate,
}: AdminEventsCalendarProps) {
    // State for events that updates when initialEvents changes
    const [events, setEvents] = useState<CalendarEvent[]>(() =>
        initialEvents.map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
        }))
    );

    // Update events when initialEvents changes
    useEffect(() => {
        console.log(
            'initialEvents changed, updating events. Count:',
            initialEvents.length
        );
        const processedEvents = initialEvents.map((event) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
        }));
        setEvents(processedEvents);
        console.log('Events updated. New count:', processedEvents.length);
    }, [initialEvents]);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null
    );
    const [showEventModal, setShowEventModal] = useState(false);
    const [eventForm, setEventForm] = useState<EventFormData>(defaultEventForm);
    const [isEditing, setIsEditing] = useState(false);
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialValues, setModalInitialValues] = useState<{
        start?: string;
        end?: string;
    }>({});

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'sitzung':
                return <Users className="w-5 h-5" />;
            case 'veranstaltung':
                return <CalendarIcon className="w-5 h-5" />;
            case 'sport':
                return <Zap className="w-5 h-5" />;
            case 'kultur':
                return <Music className="w-5 h-5" />;
            default:
                return <CalendarIcon className="w-5 h-5" />;
        }
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setShowEventModal(true);
    };

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        // Get the actual Date objects from the slot
        const startDate = slotInfo.start;
        const endDate = slotInfo.end;

        if (startDate && endDate) {
            // Format dates in local timezone to avoid UTC conversion issues
            const formatLocalDate = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const start = formatLocalDate(startDate);
            let end;

            // Calculate the difference in days
            const timeDiff = endDate.getTime() - startDate.getTime();
            const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));

            // If selecting a single day (difference is 0 or 1 day), use the same date for start and end
            if (daysDiff <= 1) {
                end = start;
            } else {
                // For multi-day selections, use the day before the end date (since calendar adds an extra day)
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

        setLoading(true);
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
                // Refresh events from parent component
                await onEventsUpdate?.();
                setIsEditing(false);
                setSelectedEvent(null);
                setShowEventModal(false);
            } else {
                alert('Fehler beim Aktualisieren des Termins');
            }
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Fehler beim Aktualisieren des Termins');
        }
        setLoading(false);
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;

        if (!confirm('Möchten Sie diesen Termin wirklich löschen?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/events/${selectedEvent.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Refresh events from parent component
                await onEventsUpdate?.();
                setShowEventModal(false);
                setSelectedEvent(null);
            } else {
                console.error('Delete failed with status:', response.status);
                alert('Fehler beim Löschen des Termins');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Fehler beim Löschen des Termins');
        }
        setLoading(false);
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
        });
        setIsEditing(true);
    };

    const categoryOptions = [
        { value: 'sitzung', label: 'Sitzung' },
        { value: 'veranstaltung', label: 'Veranstaltung' },
        { value: 'sport', label: 'Sport' },
        { value: 'kultur', label: 'Kultur' },
        { value: 'notfall', label: 'Notfall' },
        { value: 'sonstiges', label: 'Sonstiges' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
            {/* Calendar */}
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    onNavigate={setDate}
                    onView={setView}
                    view={view}
                    date={date}
                    selectable
                    components={{
                        event: EventComponent,
                        agenda: {
                            event: AgendaEventComponent,
                        },
                    }}
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
                        event: 'Ereignis',
                        noEventsInRange: 'Keine Termine in diesem Zeitraum',
                        showMore: (total: number) => `+ ${total} weitere`,
                    }}
                    culture="de"
                />
            </div>

            {/* Event Details Modal */}
            {showEventModal && selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditing
                                    ? 'Termin bearbeiten'
                                    : selectedEvent.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                                {!isEditing && (
                                    <>
                                        <button
                                            onClick={startEditing}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleDeleteEvent}
                                            disabled={loading}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        setShowEventModal(false);
                                        setIsEditing(false);
                                    }}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Titel
                                    </label>
                                    <input
                                        type="text"
                                        value={eventForm.title}
                                        onChange={(e) =>
                                            setEventForm({
                                                ...eventForm,
                                                title: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Beschreibung
                                    </label>
                                    <textarea
                                        value={eventForm.description}
                                        onChange={(e) =>
                                            setEventForm({
                                                ...eventForm,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={eventForm.start}
                                            onChange={(e) =>
                                                setEventForm({
                                                    ...eventForm,
                                                    start: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ende
                                        </label>
                                        <input
                                            type="datetime-local"
                                            value={eventForm.end}
                                            onChange={(e) =>
                                                setEventForm({
                                                    ...eventForm,
                                                    end: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ort
                                    </label>
                                    <input
                                        type="text"
                                        value={eventForm.location}
                                        onChange={(e) =>
                                            setEventForm({
                                                ...eventForm,
                                                location: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kategorie
                                    </label>
                                    <select
                                        value={eventForm.category}
                                        onChange={(e) =>
                                            setEventForm({
                                                ...eventForm,
                                                category: e.target
                                                    .value as CalendarEvent['category'],
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    >
                                        {categoryOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Veranstalter
                                    </label>
                                    <input
                                        type="text"
                                        value={eventForm.organizer}
                                        onChange={(e) =>
                                            setEventForm({
                                                ...eventForm,
                                                organizer: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bild (optional)
                                    </label>
                                    <div className="space-y-2">
                                        {eventForm.imageUrl ? (
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                                                    <Image
                                                        src={eventForm.imageUrl}
                                                        alt="Ausgewähltes Bild"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        Bild ausgewählt
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Wird in der
                                                        Terminübersicht
                                                        angezeigt
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEventForm({
                                                            ...eventForm,
                                                            imageUrl: '',
                                                        })
                                                    }
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowImagePicker(true)
                                                }
                                                className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                                            >
                                                <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
                                                <span className="text-gray-600">
                                                    Bild aus Galerie wählen
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        onClick={handleUpdateEvent}
                                        disabled={loading}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2 inline" />
                                        Speichern
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`p-2 rounded-lg ${
                                            selectedEvent.category === 'sitzung'
                                                ? 'bg-blue-100 text-blue-600'
                                                : selectedEvent.category ===
                                                  'veranstaltung'
                                                ? 'bg-green-100 text-green-600'
                                                : selectedEvent.category ===
                                                  'sport'
                                                ? 'bg-orange-100 text-orange-600'
                                                : selectedEvent.category ===
                                                  'kultur'
                                                ? 'bg-purple-100 text-purple-600'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {getCategoryIcon(
                                            selectedEvent.category ||
                                                'sonstiges'
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-700">
                                        {categoryOptions.find(
                                            (opt) =>
                                                opt.value ===
                                                selectedEvent.category
                                        )?.label || 'Sonstiges'}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-700">
                                        {moment(selectedEvent.start).format(
                                            'dddd, DD. MMMM YYYY, HH:mm'
                                        )}{' '}
                                        -{' '}
                                        {moment(selectedEvent.end).format(
                                            'HH:mm'
                                        )}{' '}
                                        Uhr
                                    </span>
                                </div>

                                {selectedEvent.location && (
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-700">
                                            {selectedEvent.location}
                                        </span>
                                    </div>
                                )}

                                {selectedEvent.organizer && (
                                    <div className="flex items-center space-x-3">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <span className="text-gray-700">
                                            {selectedEvent.organizer}
                                        </span>
                                    </div>
                                )}

                                {selectedEvent.description && (
                                    <div className="mt-6">
                                        <h4 className="font-bold text-gray-800 mb-2">
                                            Beschreibung
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed">
                                            {selectedEvent.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Event Modal for creating new events from button */}
            <EventModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal?.(false)}
                onSuccess={() => {
                    // Refresh the events list using the parent's update function
                    onEventsUpdate?.();
                }}
            />

            {/* Event Modal for creating new events from calendar selection */}
            <EventModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setModalInitialValues({});
                }}
                onSuccess={() => {
                    // Refresh the events list using the parent's update function
                    onEventsUpdate?.();
                    setIsModalOpen(false);
                    setModalInitialValues({});
                }}
                initialValues={modalInitialValues}
            />

            {/* Image Picker Modal */}
            {showImagePicker && (
                <ImagePicker
                    selectedImageUrl={eventForm.imageUrl}
                    onImageSelect={(imageUrl) => {
                        setEventForm({
                            ...eventForm,
                            imageUrl: imageUrl || '',
                        });
                        setShowImagePicker(false);
                    }}
                    onClose={() => setShowImagePicker(false)}
                />
            )}

            <style jsx global>{`
                .calendar-container .rbc-calendar {
                    font-family: inherit;
                }

                .calendar-container .rbc-header {
                    background-color: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                    padding: 12px 8px;
                    font-weight: 600;
                    color: #374151;
                }

                .calendar-container .rbc-month-view {
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .calendar-container .rbc-date-cell {
                    padding: 8px;
                }

                .calendar-container .rbc-off-range-bg {
                    background-color: #f9fafb;
                }

                .calendar-container .rbc-today {
                    background-color: #fef3c7;
                }

                .calendar-container .rbc-toolbar {
                    margin-bottom: 20px;
                    gap: 16px;
                    flex-wrap: wrap;
                }

                .calendar-container .rbc-toolbar-label {
                    color: #1f2937;
                    font-size: 1.25rem;
                    font-weight: 700;
                    text-align: center;
                    flex-grow: 1;
                    padding: 8px 16px;
                }

                .calendar-container .rbc-toolbar button {
                    background-color: #6366f1;
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-weight: 500;
                    transition: all 0.2s;
                }

                .calendar-container .rbc-toolbar button:hover {
                    background-color: #4f46e5;
                    transform: translateY(-1px);
                }

                .calendar-container .rbc-toolbar button.rbc-active {
                    background-color: #312e81;
                }

                .calendar-container .rbc-event {
                    border: none;
                    border-radius: 4px;
                }

                .calendar-container .rbc-slot-selection {
                    background-color: rgba(99, 102, 241, 0.1);
                }
            `}</style>
        </div>
    );
}
