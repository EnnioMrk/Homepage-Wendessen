import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getEvents, getNews, getGalleryImageCount, CalendarEvent, NewsItem } from '@/lib/database';
import AdminDashboard from './AdminDashboard';

export default async function AdminDashboardPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    // Fetch data for the dashboard
    let events: CalendarEvent[] = [];
    let news: NewsItem[] = [];
    let galleryCount = 0;
    let eventsError: string | undefined;
    let newsError: string | undefined;
    let galleryError: string | undefined;

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
        galleryCount = await getGalleryImageCount();
    } catch (error) {
        console.error('Failed to fetch gallery count:', error);
        galleryError = 'Failed to load gallery count';
    }

    return (
        <AdminDashboard
            events={events}
            news={news}
            galleryCount={galleryCount}
            eventsError={eventsError}
            newsError={newsError}
            galleryError={galleryError}
        />
    );
}
