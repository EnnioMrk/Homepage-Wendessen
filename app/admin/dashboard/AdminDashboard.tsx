'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarEvent, NewsItem } from '@/lib/database';
import Link from 'next/link';
import EventModal from '@/app/components/EventModal';
import NewsModal from '@/app/components/NewsModal';
import NotificationBell from '@/app/components/NotificationBell';
import PushNotificationToggle from '@/app/components/PushNotificationToggle';
import NotificationTester from '@/app/components/NotificationTester';
import {
    Calendar,
    Newspaper,
    ImageSquare,
    UsersThree,
    UserGear,
    Article,
    GearSix,
    ClockCounterClockwise,
} from '@phosphor-icons/react/dist/ssr';

// Function to get category colors for news badges
function getNewsCategoryColors(category: string): string {
    const colorMap: Record<string, string> = {
        Bildung: 'bg-amber-100 text-amber-800',
        Gemeinschaft: 'bg-green-100 text-green-800',
        Feuerwehr: 'bg-red-100 text-red-800',
        Digital: 'bg-indigo-100 text-indigo-800',
        Sport: 'bg-blue-100 text-blue-800',
        Kultur: 'bg-purple-100 text-purple-800',
        Verwaltung: 'bg-gray-100 text-gray-800',
    };

    return colorMap[category] || 'bg-gray-100 text-gray-800';
}

interface AdminDashboardProps {
    events: CalendarEvent[];
    news: NewsItem[];
    galleryCount: number;
    portraitsCount?: number;
    eventsError?: string;
    newsError?: string;
    galleryError?: string;
    portraitsError?: string;
    canViewEvents: boolean;
    canViewNews: boolean;
    canViewAdminGallery: boolean;
    canViewSharedGallery: boolean;
    canViewPortraits: boolean;
    canViewArchive: boolean;
    canManageEvents: boolean;
    canManageNews: boolean;
    canManageUsers: boolean;
    canViewSettings: boolean;
    canViewLogs: boolean;
}

export default function AdminDashboard({
    events,
    news,
    galleryCount,
    portraitsCount = 0,
    eventsError,
    newsError,
    galleryError,
    portraitsError,
    canViewEvents,
    canViewNews,
    canViewAdminGallery,
    canViewSharedGallery,
    canViewPortraits,
    canViewArchive,
    canManageEvents,
    canManageNews,
    canManageUsers,
    canViewSettings,
    canViewLogs,
}: AdminDashboardProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showNewsModal, setShowNewsModal] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch('/api/admin/logout', {
                method: 'POST',
            });
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
                        <div className="min-w-0 flex-1 text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                                Wendessen Website Verwaltung
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <PushNotificationToggle />
                            <NotificationBell />
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:bg-gray-400 w-full sm:w-auto"
                            >
                                {isLoggingOut ? 'Abmelden...' : 'Abmelden'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                        {canViewEvents && (
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-3 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                        <div className="flex-shrink-0 mx-auto sm:mx-0 mb-2 sm:mb-0">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="sm:ml-5 text-center sm:text-left sm:w-0 sm:flex-1">
                                            <dl>
                                                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                                                    Termine
                                                </dt>
                                                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                                                    {eventsError
                                                        ? 'Fehler'
                                                        : events.length}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {canViewNews && (
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-3 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                        <div className="flex-shrink-0 mx-auto sm:mx-0 mb-2 sm:mb-0">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-md flex items-center justify-center">
                                                <Newspaper className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="sm:ml-5 text-center sm:text-left sm:w-0 sm:flex-1">
                                            <dl>
                                                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                                                    Nachrichten
                                                </dt>
                                                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                                                    {newsError
                                                        ? 'Fehler'
                                                        : news.length}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {canViewSharedGallery && (
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-3 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                        <div className="flex-shrink-0 mx-auto sm:mx-0 mb-2 sm:mb-0">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                                <ImageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="sm:ml-5 text-center sm:text-left sm:w-0 sm:flex-1">
                                            <dl>
                                                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                                                    Impressionen
                                                </dt>
                                                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                                                    {galleryError
                                                        ? 'Fehler'
                                                        : galleryCount}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {canViewPortraits && (
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-3 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                        <div className="flex-shrink-0 mx-auto sm:mx-0 mb-2 sm:mb-0">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-md flex items-center justify-center">
                                                <UsersThree className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="sm:ml-5 text-center sm:text-left sm:w-0 sm:flex-1">
                                            <dl>
                                                <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                                                    Portraits
                                                </dt>
                                                <dd className="text-sm sm:text-lg font-medium text-gray-900">
                                                    {portraitsError
                                                        ? 'Fehler'
                                                        : portraitsCount}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent Content */}
                    {(canViewEvents || canViewNews) && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Events */}
                            {canViewEvents && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0 text-center sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Aktuelle Termine
                                            </h3>
                                            <Link
                                                href="/admin/events"
                                                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium self-center sm:self-auto"
                                            >
                                                Alle Termine →
                                            </Link>
                                        </div>
                                        {eventsError ? (
                                            <div className="text-red-600 text-sm">
                                                {eventsError}
                                            </div>
                                        ) : events.length > 0 ? (
                                            <div className="space-y-3">
                                                {events
                                                    .slice(0, 5)
                                                    .map((event) => (
                                                        <div
                                                            key={event.id}
                                                            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(
                                                                        event.start
                                                                    ).toLocaleDateString(
                                                                        'de-DE'
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                    event.category ===
                                                                    'sitzung'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : event.category ===
                                                                          'veranstaltung'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : event.category ===
                                                                          'sport'
                                                                        ? 'bg-orange-100 text-orange-800'
                                                                        : event.category ===
                                                                          'kultur'
                                                                        ? 'bg-purple-100 text-purple-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                            >
                                                                {event.category}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">
                                                Keine Termine gefunden
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Recent News */}
                            {canViewNews && (
                                <div className="bg-white shadow rounded-lg">
                                    <div className="px-4 py-5 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0 text-center sm:text-left">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Aktuelle Neugkeiten
                                            </h3>
                                            <Link
                                                href="/admin/news"
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium self-center sm:self-auto"
                                            >
                                                Alle Neuigkeiten →
                                            </Link>
                                        </div>
                                        {newsError ? (
                                            <div className="text-red-600 text-sm">
                                                {newsError}
                                            </div>
                                        ) : news.length > 0 ? (
                                            <div className="space-y-3">
                                                {news
                                                    .slice(0, 5)
                                                    .map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {item.title}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(
                                                                        item.publishedDate
                                                                    ).toLocaleDateString(
                                                                        'de-DE'
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNewsCategoryColors(
                                                                    item.category
                                                                )}`}
                                                            >
                                                                {item.category}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">
                                                Keine Nachrichten gefunden
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quick Actions */}
                    {(canManageEvents ||
                        canManageNews ||
                        canManageUsers ||
                        canViewSettings ||
                        canViewLogs) && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 px-1">
                                Schnellaktionen
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Add Event */}
                                {canManageEvents && (
                                    <button
                                        onClick={() => setShowEventModal(true)}
                                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500 text-left"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <h4 className="ml-3 text-base font-semibold text-gray-900">
                                                Neuer Termin
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Termin erstellen und veröffentlichen
                                        </p>
                                    </button>
                                )}

                                {/* Add News */}
                                {canManageNews && (
                                    <Link
                                        href="/admin/news/erstellen"
                                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500 text-left block"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <Newspaper className="w-5 h-5 text-green-600" />
                                            </div>
                                            <h4 className="ml-3 text-base font-semibold text-gray-900">
                                                Neue Nachricht
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Nachricht erstellen und
                                            veröffentlichen
                                        </p>
                                    </Link>
                                )}

                                {/* Admin Users */}
                                {canManageUsers && (
                                    <Link
                                        href="/admin/users"
                                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow border-l-4 border-primary block"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                <UserGear className="w-5 h-5 text-primary" />
                                            </div>
                                            <h4 className="ml-3 text-base font-semibold text-gray-900">
                                                Benutzer
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Admins und Rechte verwalten
                                        </p>
                                    </Link>
                                )}

                                {/* Settings */}
                                {canViewSettings && (
                                    <Link
                                        href="/admin/settings"
                                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow border-l-4 border-gray-500 block"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <GearSix className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <h4 className="ml-3 text-base font-semibold text-gray-900">
                                                Einstellungen
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Website-Einstellungen verwalten
                                        </p>
                                    </Link>
                                )}

                                {/* Activity Log */}
                                {canViewLogs && (
                                    <Link
                                        href="/admin/logs"
                                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow border-l-4 border-indigo-500 block"
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                                <ClockCounterClockwise className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <h4 className="ml-3 text-base font-semibold text-gray-900">
                                                Aktivitätslog
                                            </h4>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Admin-Aktivitäten einsehen
                                        </p>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Content Management */}
                    {(canViewAdminGallery ||
                        canViewSharedGallery ||
                        canViewPortraits ||
                        canViewArchive) && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 px-1">
                                Inhalte verwalten
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Gallery */}
                                {canViewAdminGallery && (
                                    <Link
                                        href="/admin/gallery"
                                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow block"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                    <ImageSquare className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <h4 className="ml-3 text-base font-semibold text-gray-900">
                                                    Admin Galerie
                                                </h4>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Bilder für Inhalte hochladen
                                        </p>
                                    </Link>
                                )}

                                {/* Shared Gallery */}
                                {canViewSharedGallery && (
                                    <Link
                                        href="/admin/shared-gallery"
                                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow block"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                                    <ImageSquare className="w-5 h-5 text-pink-600" />
                                                </div>
                                                <h4 className="ml-3 text-base font-semibold text-gray-900">
                                                    Impressionen
                                                </h4>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Von Bürgern eingereichte Fotos
                                        </p>
                                    </Link>
                                )}

                                {/* Portraits */}
                                {canViewPortraits && (
                                    <Link
                                        href="/admin/portraits"
                                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow block"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                    <UsersThree className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <h4 className="ml-3 text-base font-semibold text-gray-900">
                                                    Portraits
                                                </h4>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Wir Wendessener - Einwohner stellen
                                            sich vor
                                        </p>
                                    </Link>
                                )}

                                {/* Archive */}
                                {canViewArchive && (
                                    <Link
                                        href="/admin/archiv"
                                        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow block"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                                    <Article className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <h4 className="ml-3 text-base font-semibold text-gray-900">
                                                    Archiv
                                                </h4>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Historische Dokumente verwalten
                                        </p>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notification Tester - only in development */}
                    {process.env.NODE_ENV === 'development' && canViewLogs && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 px-1">
                                Entwickler-Tools
                            </h3>
                            <div className="max-w-2xl">
                                <NotificationTester />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <EventModal
                isOpen={showEventModal}
                onClose={() => setShowEventModal(false)}
                onSuccess={() => router.refresh()}
            />

            <NewsModal
                isOpen={showNewsModal}
                onClose={() => setShowNewsModal(false)}
                onSuccess={() => router.refresh()}
            />
        </div>
    );
}
