import { getEvents } from '@/lib/database';
import { CalendarBlank } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import CalendarClient from './CalendarClient';
import { Suspense } from 'react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default async function WasStehAnPage() {
    // This function now uses 'use cache' internally in lib/database/events.ts
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
                <Suspense
                    fallback={
                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
                                <LoadingSpinner
                                    size="xl"
                                    color="indigo"
                                    text="Lade Termine..."
                                    centered
                                />
                            </div>
                        </div>
                    }
                >
                    <CalendarClient initialEvents={initialEvents} />
                </Suspense>
            </div>
        </div>
    );
}
