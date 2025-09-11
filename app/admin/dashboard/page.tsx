import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getEvents, getNews, CalendarEvent, NewsItem } from '@/lib/database';
import AdminDashboard from './AdminDashboard';

export default async function AdminDashboardPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    // Fetch data for the dashboard
    let events: CalendarEvent[] = [];
    let news: NewsItem[] = [];
    let eventsError: string | undefined;
    let newsError: string | undefined;

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

    return (
        <AdminDashboard
            events={events}
            news={news}
            eventsError={eventsError}
            newsError={newsError}
        />
    );
}
