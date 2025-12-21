'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarEvent, NewsItem } from '@/lib/database';
import Link from 'next/link';
import EventModal from '@/app/components/events/EventModal';
import NewsModal from '@/app/components/news/NewsModal';
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
    AddressBook,
    Plus,
    SignOut,
    CaretRight,
} from '@phosphor-icons/react/dist/ssr';

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
    canViewWendessen: boolean;
    canViewContacts: boolean;
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
    canViewWendessen,
    canViewContacts,
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

    const StatCard = ({
        icon: Icon,
        label,
        value,
        colorClass,
        bgClass,
    }: {
        icon: any;
        label: string;
        value: string | number;
        colorClass: string;
        bgClass: string;
    }) => (
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 p-4 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${bgClass}`}>
                <Icon className={`w-6 h-6 ${colorClass}`} weight="fill" />
            </div>
            <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    const MenuCard = ({
        href,
        icon: Icon,
        title,
        description,
        colorClass,
        bgClass,
    }: {
        href: string;
        icon: any;
        title: string;
        description: string;
        colorClass: string;
        bgClass: string;
    }) => (
        <Link
            href={href}
            className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col h-full"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-6 h-6 ${colorClass}`} weight="duotone" />
                </div>
                <CaretRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">
                {description}
            </p>
        </Link>
    );

    const QuickActionBtn = ({
        onClick,
        icon: Icon,
        label,
        description,
        colorClass,
        bgClass,
        href
    }: {
        onClick?: () => void;
        icon: any;
        label: string;
        description: string;
        colorClass: string;
        bgClass: string;
        href?: string;
    }) => {
        const content = (
            <div className="flex items-center w-full">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${bgClass}`}>
                    <Plus className={`w-5 h-5 ${colorClass}`} weight="bold" />
                </div>
                <div className="text-left">
                    <div className="font-semibold text-gray-900">{label}</div>
                    <div className="text-xs text-gray-500">{description}</div>
                </div>
            </div>
        );

        if (href) {
            return (
                <Link href={href} className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-lg p-3 transition-colors flex items-center">
                    {content}
                </Link>
            );
        }

        return (
            <button
                onClick={onClick}
                className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-lg p-3 transition-colors flex items-center w-full"
            >
                {content}
            </button>
        );
    };


    return (
        <div
            className="min-h-screen bg-slate-50"
            style={{
                backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                backgroundSize: '24px 24px'
            }}
        >
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 bg-opacity-80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">
                                Admin Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="hidden sm:block">
                                <PushNotificationToggle />
                            </div>
                            <NotificationBell />
                            <div className="h-6 w-px bg-gray-200 mx-2" />
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex items-center text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                                title="Abmelden"
                            >
                                <SignOut className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">

                {/* Stats Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {canViewEvents && (
                        <StatCard
                            icon={Calendar}
                            label="Termine"
                            value={eventsError ? '!' : events.length}
                            colorClass="text-blue-600"
                            bgClass="bg-blue-50"
                        />
                    )}
                    {canViewNews && (
                        <StatCard
                            icon={Newspaper}
                            label="News"
                            value={newsError ? '!' : news.length}
                            colorClass="text-green-600"
                            bgClass="bg-green-50"
                        />
                    )}
                    {canViewSharedGallery && (
                        <StatCard
                            icon={ImageSquare}
                            label="Impressionen"
                            value={galleryError ? '!' : galleryCount}
                            colorClass="text-purple-600"
                            bgClass="bg-purple-50"
                        />
                    )}
                    {canViewPortraits && (
                        <StatCard
                            icon={UsersThree}
                            label="Portraits"
                            value={portraitsError ? '!' : portraitsCount}
                            colorClass="text-emerald-600"
                            bgClass="bg-emerald-50"
                        />
                    )}
                </div>

                {/* Quick Actions */}
                {(canManageEvents || canManageNews) && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Schnellzugriff
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {canManageEvents && (
                                <QuickActionBtn
                                    onClick={() => setShowEventModal(true)}
                                    icon={Calendar}
                                    label="Neuer Termin"
                                    description="Einen Kalendereintrag erstellen"
                                    colorClass="text-blue-600"
                                    bgClass="bg-blue-50"
                                />
                            )}
                            {canManageNews && (
                                <QuickActionBtn
                                    href="/admin/news/erstellen"
                                    icon={Newspaper}
                                    label="Neue Nachricht"
                                    description="Einen News-Artikel verfassen"
                                    colorClass="text-green-600"
                                    bgClass="bg-green-50"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Section: Einsendungen (User Content) */}
                {(canViewSharedGallery || canViewPortraits) && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3"></span>
                            Einsendungen & Community
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {canViewSharedGallery && (
                                <MenuCard
                                    href="/admin/shared-gallery"
                                    icon={ImageSquare}
                                    title="Impressionen"
                                    description="Von Bürgern eingereichte Fotos verwalten und moderieren."
                                    colorClass="text-purple-600"
                                    bgClass="bg-purple-50"
                                />
                            )}
                            {canViewPortraits && (
                                <MenuCard
                                    href="/admin/portraits"
                                    icon={UsersThree}
                                    title="Portraits"
                                    description="'Wir Wendessener' - Einwohnerprofile und Vorstellungen."
                                    colorClass="text-emerald-600"
                                    bgClass="bg-emerald-50"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Section: Inhalte (Website Content) */}
                {(canViewEvents || canViewNews || canViewAdminGallery || canViewWendessen || canViewArchive || canViewContacts) && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3"></span>
                            Website Inhalte
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {canViewNews && (
                                <MenuCard
                                    href="/admin/news"
                                    icon={Newspaper}
                                    title="Nachrichten"
                                    description="Aktuelle Meldungen und Berichte verwalten."
                                    colorClass="text-green-600"
                                    bgClass="bg-green-50"
                                />
                            )}
                            {canViewEvents && (
                                <MenuCard
                                    href="/admin/events"
                                    icon={Calendar}
                                    title="Termine"
                                    description="Veranstaltungskalender pflegen."
                                    colorClass="text-blue-600"
                                    bgClass="bg-blue-50"
                                />
                            )}
                            {canViewContacts && (
                                <MenuCard
                                    href="/admin/contacts"
                                    icon={AddressBook}
                                    title="Kontakte"
                                    description="Ansprechpartner und Vereinsadressen pflegen."
                                    colorClass="text-cyan-600"
                                    bgClass="bg-cyan-50"
                                />
                            )}
                            {canViewWendessen && (
                                <MenuCard
                                    href="/admin/wendessen"
                                    icon={ImageSquare} // Keeping ImageSquare broadly for layout/visuals
                                    title="Das ist Wendessen"
                                    description="Startseiten-Layouts und Rubriken anpassen."
                                    colorClass="text-indigo-600"
                                    bgClass="bg-indigo-50"
                                />
                            )}
                            {canViewAdminGallery && (
                                <MenuCard
                                    href="/admin/gallery"
                                    icon={ImageSquare}
                                    title="Galerie"
                                    description="Zentrale Bilddatenbank für die Website."
                                    colorClass="text-pink-600"
                                    bgClass="bg-pink-50"
                                />
                            )}
                            {canViewArchive && (
                                <MenuCard
                                    href="/admin/archiv"
                                    icon={Article}
                                    title="Archiv"
                                    description="Historische Dokumente und Chroniken."
                                    colorClass="text-amber-600"
                                    bgClass="bg-amber-50"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Section: System Actions */}
                {(canManageUsers || canViewSettings || canViewLogs) && (
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <span className="w-1.5 h-6 bg-gray-500 rounded-full mr-3"></span>
                            System & Verwaltung
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {canManageUsers && (
                                <MenuCard
                                    href="/admin/users"
                                    icon={UserGear}
                                    title="Benutzer"
                                    description="Administratoren, Rollen und Berechtigungen verwalten."
                                    colorClass="text-primary"
                                    bgClass="bg-primary/10"
                                />
                            )}
                            {canViewSettings && (
                                <MenuCard
                                    href="/admin/settings"
                                    icon={GearSix}
                                    title="Einstellungen"
                                    description="Globale Konfigurationen der Website."
                                    colorClass="text-gray-600"
                                    bgClass="bg-gray-100"
                                />
                            )}
                            {canViewLogs && (
                                <MenuCard
                                    href="/admin/logs"
                                    icon={ClockCounterClockwise}
                                    title="Aktivitätslog"
                                    description="Protokoll aller Änderungen im Admin-Bereich."
                                    colorClass="text-violet-600"
                                    bgClass="bg-violet-50"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Developer Tools (Dev only) */}
                {process.env.NODE_ENV === 'development' && canViewLogs && (
                    <div className="opacity-60 hover:opacity-100 transition-opacity">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-t border-gray-200 pt-6">
                            Entwickler-Tools
                        </h3>
                        <div className="max-w-xl">
                            <NotificationTester />
                        </div>
                    </div>
                )}
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
