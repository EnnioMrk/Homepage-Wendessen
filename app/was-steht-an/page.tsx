import { getEvents } from '@/lib/database';
import { CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import CalendarClient from './CalendarClient';
import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

<<<<<<< HEAD
import { ASSOCIATIONS } from '@/lib/constants/associations';

// Set German locale
moment.locale('de');
const localizer = momentLocalizer(moment);

// Custom event component
const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const isCancelled = event.isCancelled;

    return (
        <div
            className={`${isCancelled
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
        <div
            className={`flex items-center space-x-3 ${isCancelled ? 'opacity-60' : ''
                }`}
        >
            <div
                className={`w-3 h-3 rounded-full ${isCancelled
                    ? 'bg-gray-400'
                    : getCategoryBackgroundColor(
                        event.category || 'sonstiges'
                    )
                    }`}
            ></div>
            <div className="flex-1">
                <div
                    className={`font-medium ${isCancelled
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
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isCancelled
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

export default function WasStehAnPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
        null
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedVerein, setSelectedVerein] = useState<string>('all');
    const [view, setView] = useState<View>('agenda');
    const [date, setDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categories = [
        { id: 'all', label: 'Alle', color: 'bg-gray-800' },
        { id: 'sitzung', label: 'Sitzungen', color: 'bg-blue-500' },
        { id: 'veranstaltung', label: 'Veranstaltungen', color: 'bg-green-500' },
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
                event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (event.location &&
                event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (event.organizer &&
                event.organizer.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory =
            selectedCategory === 'all' || event.category === selectedCategory;

        const matchesVerein =
            selectedVerein === 'all' || event.vereinId === selectedVerein;

        return matchesSearch && matchesCategory && matchesVerein;
    });

    // Fetch events from database
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
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
                    .filter(
                        (event: CalendarEvent) =>
                            event.start >= now && event.start <= oneYearFromNow
                    );

                setEvents(parsedEvents);

                // Keep calendar on current month by default
                setDate(now);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Fehler beim Laden der Termine');
            } finally {
                setIsLoading(false);
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



    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Hero Section */}
                <PageHeader
                    title="Was steht an?"
                    subtitle="Termine und Veranstaltungen in Wendessen"
                    icon={<CalendarBlank />}
                    color="indigo"
                />

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
                <PageHeader
                    title="Was steht an?"
                    subtitle="Termine und Veranstaltungen in Wendessen"
                    icon={<CalendarBlank />}
                    color="indigo"
                />

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
=======
export default async function WasStehAnPage() {
    // This function now uses 'use cache' internally in lib/database/events.ts
    const initialEvents = await getEvents();
>>>>>>> 81807c1d47160b1ef8627c0f7f776637f07d4659

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <PageHeader
                title="Was steht an?"
                subtitle="Alle Termine und Veranstaltungen in Wendessen auf einen Blick"
                icon={<CalendarBlank />}
                color="indigo"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <Suspense
                    fallback={
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
                    }
                >
                    <CalendarClient initialEvents={initialEvents} />
                </Suspense>
            </div>
        </div>
    );
}
