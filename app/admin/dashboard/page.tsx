import { redirect } from 'next/navigation';
import {
    isAuthenticated,
    getSessionData,
    getCurrentAdminUser,
} from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import {
    getEvents,
    getNews,
    getSharedGalleryImageCount,
    getPortraitSubmissions,
    CalendarEvent,
    NewsItem,
} from '@/lib/database';
import AdminDashboard from './AdminDashboard';

async function getPortraitsCount(): Promise<number> {
    try {
        const submissions = await getPortraitSubmissions();
        return submissions.length;
    } catch (error) {
        console.error('Error loading portraits count:', error);
        return 0;
    }
}

export default async function AdminDashboardPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    // Check if user must change password
    const sessionData = await getSessionData();
    if (sessionData?.mustChangePassword) {
        redirect('/admin/change-password');
    }

    // Get current user for permission checking
    const currentUser = await getCurrentAdminUser();

    // Fetch data for the dashboard based on permissions
    let events: CalendarEvent[] = [];
    let news: NewsItem[] = [];
    let galleryCount = 0;
    let portraitsCount = 0;
    let eventsError: string | undefined;
    let newsError: string | undefined;
    let galleryError: string | undefined;
    let portraitsError: string | undefined;

    // Check permissions before fetching data
    const canViewEvents = hasPermission(currentUser, 'events.view');
    const canViewNews = hasPermission(currentUser, 'news.view');
    const canViewAdminGallery = hasPermission(currentUser, 'gallery.view');
    const canViewSharedGallery = hasPermission(
        currentUser,
        'shared_gallery.view'
    );
    const canViewPortraits = hasPermission(currentUser, 'portraits.view');
    const canViewArchive = hasPermission(currentUser, 'archive.view');

    if (canViewEvents) {
        try {
            events = await getEvents();
        } catch (error) {
            console.error('Failed to fetch events:', error);
            eventsError = 'Failed to load events';
        }
    }

    if (canViewNews) {
        try {
            news = await getNews();
        } catch (error) {
            console.error('Failed to fetch news:', error);
            newsError = 'Failed to load news';
        }
    }

    if (canViewSharedGallery) {
        try {
            galleryCount = await getSharedGalleryImageCount();
        } catch (error) {
            console.error('Failed to fetch gallery count:', error);
            galleryError = 'Failed to load gallery count';
        }
    }

    if (canViewPortraits) {
        try {
            portraitsCount = await getPortraitsCount();
        } catch (error) {
            console.error('Failed to fetch portraits count:', error);
            portraitsError = 'Failed to load portraits count';
        }
    }

    return (
        <AdminDashboard
            events={events}
            news={news}
            galleryCount={galleryCount}
            portraitsCount={portraitsCount}
            eventsError={eventsError}
            newsError={newsError}
            galleryError={galleryError}
            portraitsError={portraitsError}
            canViewEvents={canViewEvents}
            canViewNews={canViewNews}
            canViewAdminGallery={canViewAdminGallery}
            canViewSharedGallery={canViewSharedGallery}
            canViewPortraits={canViewPortraits}
            canViewArchive={canViewArchive}
            canManageEvents={
                hasPermission(currentUser, 'events.create') ||
                hasPermission(currentUser, 'verein.events.create')
            }
            canManageNews={hasPermission(currentUser, 'news.create')}
            canManageUsers={hasPermission(currentUser, 'users.view')}
            canViewSettings={hasPermission(currentUser, 'settings.view')}
            canViewLogs={hasPermission(currentUser, 'logs.view')}
            canViewWendessen={hasPermission(currentUser, 'wendessen.view')}
        />
    );
}
