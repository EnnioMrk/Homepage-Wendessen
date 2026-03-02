import { getEvents } from '@/lib/database';
import { CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import CalendarClientNoSSR from './CalendarClientNoSSR';

export default async function WasStehAnPage() {
    const initialEvents = await getEvents();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <PageHeader
                title="Was steht an?"
                subtitle="Alle Termine und Veranstaltungen in Wendessen auf einen Blick"
                icon={<CalendarBlank />}
                color="indigo"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <CalendarClientNoSSR initialEvents={initialEvents} />
            </div>
        </div>
    );
}
