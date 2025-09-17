'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarEvent, NewsItem } from '@/lib/database';
import Link from 'next/link';
import EventModal from '@/app/components/EventModal';
import NewsModal from '@/app/components/NewsModal';
import { Calendar, Newspaper, Image as ImageIcon } from 'lucide-react';

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
    eventsError?: string;
    newsError?: string;
    galleryError?: string;
}

export default function AdminDashboard({
    events,
    news,
    galleryCount,
    eventsError,
    newsError,
    galleryError,
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
                            <Link
                                href="/"
                                className="text-center sm:text-left text-gray-600 hover:text-gray-900 px-3 py-2 sm:px-0 sm:py-0 text-sm font-medium border border-gray-300 rounded-md sm:border-none hover:bg-gray-50 sm:hover:bg-transparent transition-colors"
                            >
                                Website anzeigen
                            </Link>
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
                    <div className="grid grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6 mb-8">
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

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-3 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <div className="flex-shrink-0 mx-auto sm:mx-0 mb-2 sm:mb-0">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className="sm:ml-5 text-center sm:text-left sm:w-0 sm:flex-1">
                                        <dl>
                                            <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                                                Bilder
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
                    </div>

                    {/* Recent Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Events */}
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
                                        {events.slice(0, 5).map((event) => (
                                            <div
                                                key={event.id}
                                                className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {event.title}
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

                        {/* Recent News */}
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
                                        {news.slice(0, 5).map((item) => (
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
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                Schnellzugriff
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setShowEventModal(true)}
                                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Termin hinzufügen
                                </button>
                                <button
                                    onClick={() => setShowNewsModal(true)}
                                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <Newspaper className="w-4 h-4 mr-2" />
                                    Nachricht hinzufügen
                                </button>
                                <Link
                                    href="/admin/gallery"
                                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Galerie
                                </Link>
                            </div>
                        </div>
                    </div>
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
