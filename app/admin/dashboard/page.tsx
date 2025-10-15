import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
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

    // Fetch data for the dashboard
    let events: CalendarEvent[] = [];
    let news: NewsItem[] = [];
    let galleryCount = 0;
    let portraitsCount = 0;
    let eventsError: string | undefined;
    let newsError: string | undefined;
    let galleryError: string | undefined;
    let portraitsError: string | undefined;

    try {
        events = await getEvents();
    } catch (error) {
        console.error('Failed to fetch events:', error);
        eventsError = 'Failed to load events';
    }

    try {
        news = await getNews();
    } catch (error) {
        console.error('Failed to fetch news:', error);
        newsError = 'Failed to load news';
    }

    try {
        galleryCount = await getSharedGalleryImageCount();
    } catch (error) {
        console.error('Failed to fetch gallery count:', error);
        galleryError = 'Failed to load gallery count';
    }

    try {
        portraitsCount = await getPortraitsCount();
    } catch (error) {
        console.error('Failed to fetch portraits count:', error);
        portraitsError = 'Failed to load portraits count';
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
        />
    );
}
