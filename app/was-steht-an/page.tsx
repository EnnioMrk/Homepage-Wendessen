'use client';

import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/de';
import { useState, useEffect } from 'react';
import './calendar.css';
import { CalendarEvent } from '@/lib/database';
import {
    getCategoryBackgroundColor,
    getCategoryBadgeClasses,
    getCategoryDisplayName,
} from '@/lib/event-utils';
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
} from '@phosphor-icons/react/dist/ssr';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import Image from 'next/image';

// Set German locale
moment.locale('de');
const localizer = momentLocalizer(moment);

// Custom event component
const EventComponent = ({ event }: { event: CalendarEvent }) => {
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
const AgendaEventComponent = ({ event }: { event: CalendarEvent }) => {
    const isCancelled = event.isCancelled;
    
    return (
        <div className={`flex items-center space-x-3 ${isCancelled ? 'opacity-60' : ''}`}>
            <div
                className={`w-3 h-3 rounded-full ${
                    isCancelled 
                        ? 'bg-gray-400' 
                        : getCategoryBackgroundColor(event.category || 'sonstiges')
                }`}
            ></div>
            <div className="flex-1">
                <div className={`font-medium ${
                    isCancelled 
                        ? 'text-gray-500 line-through' 
                        : 'text-gray-900'
                }`}>
                    {isCancelled && '🚫 '}
                    {event.title}
                </div>
                {event.location && (
                    <div className="text-sm text-gray-500">
                        {event.location}
                    </div>
                )}
                {isCancelled && event.cancelledAt && (
                    <div className="text-xs text-red-600 mt-1">
                        Abgesagt
                    </div>
                )}
            </div>
            <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isCancelled 
                        ? 'bg-gray-100 text-gray-600' 
                        : getCategoryBadgeClasses(event.category || 'sonstiges')
                }`}
            >
                {isCancelled ? 'Abgesagt' : getCategoryDisplayName(event.category || 'sonstiges')}
            </span>
        </div>
    );
};

export default function WasStehAnPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null
    );
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch events from database
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }

                const eventsData = await response.json();
                
                // Calculate date range: today to +1 year
                const now = new Date();
                const oneYearFromNow = new Date(now);
                oneYearFromNow.setFullYear(now.getFullYear() + 1);
                
                // Convert date strings back to Date objects and filter to next year only
                const parsedEvents = eventsData
                    .map((event: CalendarEvent) => ({
                        ...event,
                        start: new Date(event.start),
                        end: new Date(event.end),
                    }))
                    .filter((event: CalendarEvent) => 
                        event.start >= now && event.start <= oneYearFromNow
                    );

                setEvents(parsedEvents);

                // Keep calendar on current month by default
                setDate(now);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Fehler beim Laden der Termine');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    const handleNavigate = (newDate: Date) => {
        setDate(newDate);
    };

    const handleViewChange = (newView: View) => {
        setView(newView);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 to-pink-600/95"></div>

                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mr-4">
                                    <CalendarBlank className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                                    Was steht an?
                                </h1>
                            </div>
                            <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-6"></div>
                            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                                Termine und Veranstaltungen in Wendessen
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
                            <LoadingSpinner
                                size="xl"
                                color="indigo"
                                text="Lade Termine..."
                                centered
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 to-pink-600/95"></div>

                    <div className="relative z-10 container mx-auto px-4 text-center">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mr-4">
                                    <CalendarBlank className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                                    Was steht an?
                                </h1>
                            </div>
                            <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-6"></div>
                            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                                Termine und Veranstaltungen in Wendessen
                            </p>
                        </div>
                    </div>
                </div>

                {/* Error */}
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <WarningCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Fehler beim Laden
                            </h2>
                            <p className="text-lg text-gray-600 mb-6">
                                {error}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Erneut versuchen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 to-pink-600/95"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mr-4">
                                <CalendarBlank className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                                Was steht an?
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-6"></div>
                        <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                            Alle Termine und Veranstaltungen in Wendessen auf
                            einen Blick
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Legend */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Kategorien
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[
                                {
                                    category: 'sitzung',
                                    label: 'Sitzungen',
                                    color: 'bg-blue-500',
                                },
                                {
                                    category: 'veranstaltung',
                                    label: 'Veranstaltungen',
                                    color: 'bg-green-500',
                                },
                                {
                                    category: 'sport',
                                    label: 'Sport',
                                    color: 'bg-orange-500',
                                },
                                {
                                    category: 'kultur',
                                    label: 'Kultur',
                                    color: 'bg-purple-500',
                                },
                                {
                                    category: 'sonstiges',
                                    label: 'Sonstiges',
                                    color: 'bg-gray-500',
                                },
                            ].map(({ category, label, color }) => (
                                <div
                                    key={category}
                                    className="flex items-center space-x-2"
                                >
                                    <div
                                        className={`w-4 h-4 ${color} rounded`}
                                    ></div>
                                    <span className="text-sm text-gray-700">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl calendar-container">
                        <Calendar
                            localizer={localizer}
                            events={events}
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
                                noEventsInRange:
                                    'Keine Termine in diesem Zeitraum',
                                showMore: (total: number) =>
                                    `+ ${total} weitere`,
                            }}
                            culture="de"
                        />
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl mt-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            Nächste Termine
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events
                                .filter((event) => event.start >= new Date())
                                .sort(
                                    (a, b) =>
                                        a.start.getTime() - b.start.getTime()
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
                                                <div className="relative h-32 w-full">
                                                    <Image
                                                        src={event.imageUrl}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-start space-x-3 mb-3">
                                            <div
                                                className={`p-2 rounded-lg ${getCategoryBadgeClasses(
                                                    event.category ||
                                                        'sonstiges'
                                                )}`}
                                            >
                                                {getCategoryIcon(
                                                    event.category ||
                                                        'sonstiges'
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-800 mb-1">
                                                    {event.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    {moment(event.start).format(
                                                        'DD.MM.YYYY, HH:mm'
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
                </div>
            </div>

            {/* Event Details Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Event Image Header */}
                        {selectedEvent.imageUrl && (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={selectedEvent.imageUrl}
                                    alt={selectedEvent.title}
                                    fill
                                    className="object-cover rounded-t-3xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-t-3xl"></div>
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
                                                    🚫 Dieser Termin wurde abgesagt
                                                </h4>
                                                <p className="text-xs text-red-700">
                                                    Bitte beachten Sie, dass diese Veranstaltung nicht stattfindet.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`p-2 rounded-lg ${getCategoryBadgeClasses(
                                            selectedEvent.category ||
                                                'sonstiges'
                                        )}`}
                                    >
                                        {getCategoryIcon(
                                            selectedEvent.category ||
                                                'sonstiges'
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-700">
                                        {getCategoryDisplayName(
                                            selectedEvent.category ||
                                                'sonstiges'
                                        )}
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
                                        <h3 className="font-bold text-gray-800 mb-2">
                                            Beschreibung
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {selectedEvent.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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
