'use client';

import {
    Calendar,
    momentLocalizer,
    View,
    EventProps,
} from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/de';
import { useState } from 'react';
import './calendar.css';
import { CalendarEvent } from '@/lib/database';
import {
    getCategoryBackgroundColor,
    getCategoryBadgeClasses,
    getCategoryDisplayName,
} from '@/lib/utils/event-utils';
import {
    UsersThree,
    CalendarBlank,
    Lightning,
    MusicNotesSimple,
    MapPin,
    Clock,
    X,
    User,
    WarningCircle,
    ArrowsClockwise,
} from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import CroppedImage from '@/app/components/ui/CroppedImage';
import { ASSOCIATIONS } from '@/lib/constants/associations';
import Modal from '@/app/components/ui/Modal';

// Set German locale
moment.locale('de');
const localizer = momentLocalizer(moment);

// Custom event component
const EventComponent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
    const isCancelled = event.isCancelled;

    return (
        <div
            className={`${
                isCancelled
                    ? 'bg-gray-400 line-through opacity-70'
                    : getCategoryBackgroundColor(event.category || 'sonstiges')
            } text-white p-1 rounded text-xs font-medium overflow-hidden`}
        >
            <div className="truncate">
                {isCancelled && '🚫 '}
                {event.title}
            </div>
        </div>
    );
};

// Custom agenda event component
const AgendaEventComponent: React.FC<EventProps<CalendarEvent>> = ({
    event,
}) => {
    const isCancelled = event.isCancelled;

    return (
        <div
            className={`flex items-center space-x-3 ${
                isCancelled ? 'opacity-60' : ''
            }`}
        >
            <div
                className={`w-3 h-3 rounded-full ${
                    isCancelled
                        ? 'bg-gray-400'
                        : getCategoryBackgroundColor(
                              event.category || 'sonstiges',
                          )
                }`}
            ></div>
            <div className="flex-1">
                <div
                    className={`font-medium ${
                        isCancelled
                            ? 'text-gray-500 line-through'
                            : 'text-gray-900'
                    }`}
                >
                    {isCancelled && '🚫 '}
                    {event.title}
                </div>
                {event.location && (
                    <div className="text-sm text-gray-500">
                        {event.location}
                    </div>
                )}
                {isCancelled && event.cancelledAt && (
                    <div className="text-xs text-red-600 mt-1">Abgesagt</div>
                )}
            </div>
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isCancelled
                        ? 'bg-gray-100 text-gray-600'
                        : getCategoryBadgeClasses(event.category || 'sonstiges')
                }`}
            >
                {isCancelled
                    ? 'Abgesagt'
                    : getCategoryDisplayName(event.category || 'sonstiges')}
            </span>
        </div>
    );
};

interface CalendarClientProps {
    initialEvents: CalendarEvent[];
}

export default function CalendarClient({ initialEvents }: CalendarClientProps) {
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedVerein, setSelectedVerein] = useState<string>('all');
    const [view, setView] = useState<View>('agenda');
    const [date, setDate] = useState(new Date());

    const categories = [
        { id: 'all', label: 'Alle', color: 'bg-gray-800' },
        { id: 'sitzung', label: 'Sitzungen', color: 'bg-blue-500' },
        {
            id: 'veranstaltung',
            label: 'Veranstaltungen',
            color: 'bg-green-500',
        },
        { id: 'sport', label: 'Sport', color: 'bg-orange-500' },
        { id: 'kultur', label: 'Kultur', color: 'bg-purple-500' },
        { id: 'sonstiges', label: 'Sonstiges', color: 'bg-gray-500' },
    ];

    // Filter events based on search, category and verein
    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            searchQuery === '' ||
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.description &&
                event.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) ||
            (event.location &&
                event.location
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) ||
            (event.organizer &&
                event.organizer
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()));

        const matchesCategory =
            selectedCategory === 'all' || event.category === selectedCategory;

        const matchesVerein =
            selectedVerein === 'all' || event.vereinId === selectedVerein;

        return matchesSearch && matchesCategory && matchesVerein;
    });

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    const handleNavigate = (newDate: Date) => {
        setDate(newDate);
    };

    const handleViewChange = (newView: View) => {
        setView(newView);
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/events');
            if (!response.ok) throw new Error('Failed to fetch events');

            const data = await response.json();

            // Parse dates from strings to Date objects
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const parsedEvents = data.map((event: any) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
                cancelledAt: event.cancelledAt
                    ? new Date(event.cancelledAt)
                    : undefined,
            }));

            setEvents(parsedEvents);
        } catch (error) {
            console.error('Error refreshing events:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'sitzung':
                return <UsersThree className="w-5 h-5" />;
            case 'veranstaltung':
                return <CalendarBlank className="w-5 h-5" />;
            case 'sport':
                return <Lightning className="w-5 h-5" />;
            case 'kultur':
                return <MusicNotesSimple className="w-5 h-5" />;
            case 'notfall':
                return <WarningCircle className="w-5 h-5 text-red-500" />;
            default:
                return <CalendarBlank className="w-5 h-5" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Filters & Search */}
            <div className="bg-white rounded-3xl p-6 shadow-xl mb-8">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    {/* Search */}
                    <div className="w-full md:w-1/3 relative flex gap-2">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Termine suchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900"
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50 flex-shrink-0"
                            title="Termine aktualisieren"
                        >
                            <ArrowsClockwise
                                className={`w-6 h-6 ${
                                    isLoading ? 'animate-spin' : ''
                                }`}
                            />
                        </button>
                    </div>
                    <div className="w-full md:w-1/4">
                        <select
                            value={selectedVerein}
                            onChange={(e) => setSelectedVerein(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none bg-white text-gray-900"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: `right 0.5rem center`,
                                backgroundRepeat: `no-repeat`,
                                backgroundSize: `1.5em 1.5em`,
                            }}
                        >
                            <option value="all">Alle Vereine</option>
                            {ASSOCIATIONS.map((verein) => (
                                <option key={verein.id} value={verein.id}>
                                    {verein.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div className="w-full md:w-1/4">
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none bg-white text-gray-900"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: `right 0.5rem center`,
                                backgroundRepeat: `no-repeat`,
                                backgroundSize: `1.5em 1.5em`,
                            }}
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-3xl p-6 shadow-xl calendar-container text-gray-900">
                <Calendar
                    localizer={localizer}
                    events={filteredEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    onSelectEvent={handleSelectEvent}
                    onNavigate={handleNavigate}
                    onView={handleViewChange}
                    view={view}
                    date={date}
                    length={365}
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
                        noEventsInRange: 'Keine Termine gefunden',
                        showMore: (total: number) => `+ ${total} weitere`,
                    }}
                    culture="de"
                />
            </div>

            {/* Upcoming Events List (Filtered) */}
            {filteredEvents.length > 0 && (
                <div className="bg-white rounded-3xl p-8 shadow-xl mt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">
                        {searchQuery ||
                        selectedCategory !== 'all' ||
                        selectedVerein !== 'all'
                            ? 'Gefundene Termine'
                            : 'Nächste Termine'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents
                            .filter((event) => event.start >= new Date())
                            .sort(
                                (a, b) => a.start.getTime() - b.start.getTime(),
                            )
                            .slice(0, 6)
                            .map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    {/* Event Image */}

                                    {event.imageUrl && (
                                        <div className="mb-4 -mx-6 -mt-6">
                                            <div className="relative w-full aspect-[3/1]">
                                                <CroppedImage
                                                    src={event.imageUrl}
                                                    cropData={
                                                        event.imageCropData
                                                    }
                                                    viewId="card"
                                                    alt={event.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start space-x-3 mb-3">
                                        <div
                                            className={`p-2 rounded-lg ${getCategoryBadgeClasses(
                                                event.category || 'sonstiges',
                                            )}`}
                                        >
                                            {getCategoryIcon(
                                                event.category || 'sonstiges',
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 mb-1">
                                                {event.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-2">
                                                {moment(event.start).format(
                                                    'DD.MM.YYYY, HH:mm',
                                                )}{' '}
                                                Uhr
                                            </p>
                                            {event.location && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {event.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* Event Details Modal */}
            <Modal
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
                className="max-w-2xl w-full"
                rounded="2xl"
            >
                {selectedEvent && (
                    <div className="w-full">
                        {/* Event Image Header */}
                        {selectedEvent.imageUrl && (
                            <div className="relative w-full aspect-[16/9]">
                                <CroppedImage
                                    src={selectedEvent.imageUrl}
                                    cropData={selectedEvent.imageCropData}
                                    viewId="popup"
                                    alt={selectedEvent.title}
                                    fill
                                    containerClassName="rounded-t-2xl"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-t-2xl pointer-events-none"></div>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                                        {selectedEvent.title}
                                    </h2>
                                </div>
                            </div>
                        )}

                        <div className="p-8">
                            {/* Title for events without image */}
                            {!selectedEvent.imageUrl && (
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {selectedEvent.title}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4">
                                {selectedEvent.isCancelled && (
                                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-start">
                                            <WarningCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-red-900 mb-1">
                                                    🚫 Dieser Termin wurde
                                                    abgesagt
                                                </h4>
                                                <p className="text-xs text-red-700">
                                                    Bitte beachten Sie, dass
                                                    diese Veranstaltung nicht
                                                    stattfindet.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`p-2 rounded-lg ${getCategoryBadgeClasses(
                                            selectedEvent.category ||
                                                'sonstiges',
                                        )}`}
                                    >
                                        {getCategoryIcon(
                                            selectedEvent.category ||
                                                'sonstiges',
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-700">
                                        {getCategoryDisplayName(
                                            selectedEvent.category ||
                                                'sonstiges',
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-700">
                                        {moment(selectedEvent.start).format(
                                            'dddd, DD. MMMM YYYY, HH:mm',
                                        )}{' '}
                                        -{' '}
                                        {moment(selectedEvent.end).format(
                                            'HH:mm',
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
                                        <h3 className="font-bold text-gray-800 mb-2">
                                            Beschreibung
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {selectedEvent.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

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

                /* Make agenda view scrollable */
                .calendar-container .rbc-agenda-view {
                    max-height: 600px;
                    overflow-y: auto;
                }

                .calendar-container .rbc-agenda-table {
                    width: 100%;
                }

                /* Sticky header for agenda view */
                .calendar-container .rbc-agenda-view table > thead {
                    position: sticky;
                    top: 0;
                    background-color: white;
                    z-index: 10;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }
            `}</style>
        </div>
    );
}
