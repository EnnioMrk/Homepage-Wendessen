'use client';

import AdminEventsCalendar from './AdminEventsCalendar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarEvent } from '@/lib/database';
import { usePermissions } from '@/lib/usePermissions';
import { AdminHead } from '@/app/components/admin/AdminPage';

export default function AdminEventsPage() {
    const { hasPermission, loading: permissionsLoading } = usePermissions();
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
            const eventsResponse = await fetch(
                `/api/events?fresh=1&t=${Date.now()}`,
                {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                },
            );
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

    const canCreate =
        hasPermission('events.create') || hasPermission('verein.events.create');

    if (loading || permissionsLoading) {
        return (
            <div>
                <AdminHead
                    title="Termine verwalten"
                    sub="Register der Termine"
                />
                <div className="panel">
                    <div className="panel-body">
                        <p className="muted">Lade Termine …</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasPermission('events.view')) {
        return (
            <div>
                <AdminHead
                    title="Termine verwalten"
                    sub="Register der Termine"
                />
                <div className="empty">
                    <h3>Keine Berechtigung</h3>
                    <p>
                        Sie haben keine Berechtigung, Termine zu verwalten.
                        Wenden Sie sich an die Redaktionsleitung, wenn Sie
                        Einträge pflegen sollen.
                    </p>
                    <Link className="btn btn--quiet" href="/admin/dashboard">
                        Zurück zum Schreibtisch
                    </Link>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <AdminHead
                    title="Termine verwalten"
                    sub="Register der Termine"
                />
                <div className="notice notice--error">
                    <strong>Termine nicht geladen</strong>
                    <span>
                        Die Termine konnten nicht geladen werden. Prüfen Sie die
                        Verbindung und versuchen Sie es erneut.
                    </span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--s2)',
                        marginTop: 'var(--s4)',
                    }}
                >
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => loadEvents(true)}
                    >
                        Erneut laden
                    </button>
                    <Link className="btn btn--quiet" href="/admin/dashboard">
                        Zurück zum Schreibtisch
                    </Link>
                </div>
            </div>
        );
    }

    const cancelledCount = events.filter((event) => event.isCancelled).length;

    return (
        <div>
            <AdminHead
                title="Termine verwalten"
                sub={`${events.length} ${
                    events.length === 1 ? 'Eintrag' : 'Einträge'
                } · ${cancelledCount} abgesagt`}
                actions={
                    canCreate ? (
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Neuer Termin
                        </button>
                    ) : null
                }
            />
            <AdminEventsCalendar
                initialEvents={events}
                showCreateModal={showCreateModal}
                setShowCreateModal={setShowCreateModal}
                onEventsUpdate={refreshEvents}
            />
        </div>
    );
}
