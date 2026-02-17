import EventCard from './EventCard';
import { getUpcomingEvents, CalendarEvent } from '@/lib/database';

export default async function EventsSection() {
    let events: CalendarEvent[];
    try {
        events = await getUpcomingEvents(3); // Get next 3 upcoming events
    } catch (error) {
        console.error('Error fetching events:', error);

        // Fallback to hardcoded events if database fails
        events = [
            {
                id: 'fallback-1',
                title: 'Ortsratssitzung',
                location: 'Dorfgemeinschaftshaus',
                start: new Date('2025-10-15T19:00:00Z'),
                end: new Date('2025-10-15T21:00:00Z'),
                imageUrl: '/images/Events/Ortsratssitzung.jpg',
                isCancelled: false,
                category: 'sitzung',
            },
            {
                id: 'fallback-2',
                title: 'Herbstfest',
                location: 'Dorfplatz',
                start: new Date('2025-10-25T14:00:00Z'),
                end: new Date('2025-10-25T18:00:00Z'),
                imageUrl: '/images/Events/Herbstfest.jpg',
                isCancelled: false,
                category: 'veranstaltung',
            },
            {
                id: 'fallback-3',
                title: 'Bücherbus',
                location: 'Bushaltestelle Dorfmitte',
                start: new Date('2025-10-30T15:00:00Z'),
                end: new Date('2025-10-30T16:30:00Z'),
                imageUrl: '/images/Events/Bücherbus.jpeg',
                isCancelled: false,
                category: 'kultur',
            },
        ] as CalendarEvent[];
    }

    return (
        <div className="mb-32 mt-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {events.map((event: CalendarEvent) => {
                    const startDate = event.start
                        ? new Date(event.start)
                        : null;
                    return (
                        <EventCard
                            key={event.id}
                            title={event.title}
                            location={event.location || 'Wendessen'}
                            time={
                                startDate
                                    ? startDate.toLocaleTimeString('de-DE', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                      })
                                    : ''
                            }
                            date={
                                startDate
                                    ? startDate.toLocaleDateString('de-DE', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                      })
                                    : ''
                            }
                            imageSrc={event.imageUrl}
                            imageCropData={event.imageCropData}
                            imageAlt={event.title}
                            hasImage={!!event.imageUrl}
                            isCancelled={event.isCancelled}
                        />
                    );
                })}
            </div>
        </div>
    );
}
