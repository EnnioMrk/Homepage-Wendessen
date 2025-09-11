import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminEventsCalendar from './AdminEventsCalendar';
import { getEvents } from '@/lib/database';

export default async function AdminEventsPage() {
    // Check authentication
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    try {
        const events = await getEvents();

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="py-10">
                    <header>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                                    Termine verwalten
                                </h1>
                                <a
                                    href="/admin/dashboard"
                                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    ← Zurück zum Dashboard
                                </a>
                            </div>
                        </div>
                    </header>
                    <main>
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <AdminEventsCalendar initialEvents={events} />
                        </div>
                    </main>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error loading events:', error);
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Fehler beim Laden der Termine
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Die Termine konnten nicht geladen werden.
                    </p>
                    <a
                        href="/admin/dashboard"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        ← Zurück zum Dashboard
                    </a>
                </div>
            </div>
        );
    }
}
