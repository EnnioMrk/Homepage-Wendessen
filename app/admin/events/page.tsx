'use client';

import AdminEventsCalendar from './AdminEventsCalendar';
import { useState, useEffect } from 'react';
import { Plus, ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { CalendarEvent } from '@/lib/database';

export default function AdminEventsPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const loadEvents = async (showLoadingScreen = false) => {
        try {
            if (showLoadingScreen) {
                setLoading(true);
            }
            // Add cache busting to ensure fresh data
            const eventsResponse = await fetch(`/api/events?t=${Date.now()}`, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
            if (!eventsResponse.ok) {
                throw new Error('Failed to load events');
            }

            const eventsData = await eventsResponse.json();
            setEvents(eventsData);
            setError(null);
        } catch (err) {
            console.error('Error loading events:', err);
            setError('Fehler beim Laden der Termine');
        } finally {
            if (showLoadingScreen) {
                setLoading(false);
            }
        }
    };

    const refreshEvents = async () => {
        // Small delay to ensure database operation completes
        await new Promise((resolve) => setTimeout(resolve, 100));
        await loadEvents(false); // Don't show loading screen on refresh
    };

    useEffect(() => {
        const checkAuthAndLoadEvents = async () => {
            try {
                // Check authentication via API route
                const authResponse = await fetch('/api/admin/status');
                if (!authResponse.ok) {
                    window.location.href = '/admin/login';
                    return;
                }

                // Load events
                await loadEvents(true);
            } catch (err) {
                console.error('Error during initialization:', err);
                setError('Fehler beim Laden der Termine');
                setLoading(false);
            }
        };

        checkAuthAndLoadEvents();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Lade Termine...</p>
                </div>
            </div>
        );
    }

    if (error) {
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <a
                                href="/admin/dashboard"
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </a>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Termine verwalten
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Termine erstellen, bearbeiten und verwalten
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                        >
                            <Plus size={16} className="mr-2" />
                            Neuer Termin
                        </button>
                    </div>
                </div>
            </header>

            <main>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <AdminEventsCalendar
                        initialEvents={events}
                        showCreateModal={showCreateModal}
                        setShowCreateModal={setShowCreateModal}
                        onEventsUpdate={refreshEvents}
                    />
                </div>
            </main>
        </div>
    );
}
