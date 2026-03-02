'use client';

import dynamic from 'next/dynamic';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import { CalendarEvent } from '@/lib/database';

const CalendarClient = dynamic(() => import('./CalendarClient'), {
    ssr: false,
    loading: () => (
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
    ),
});

interface CalendarClientNoSSRProps {
    initialEvents: CalendarEvent[];
}

export default function CalendarClientNoSSR({
    initialEvents,
}: CalendarClientNoSSRProps) {
    return <CalendarClient initialEvents={initialEvents} />;
}
