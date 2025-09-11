import EventCard from './EventCard';
import { getUpcomingEvents } from '@/lib/database';

export default async function EventsSection() {
    try {
        const events = await getUpcomingEvents(3); // Get next 3 upcoming events

        return (
            <div className="mb-32 mt-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            title={event.title}
                            location={event.location || 'Wendessen'}
                            time={event.start.toLocaleTimeString('de-DE', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                            date={event.start.toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })}
                            imageSrc={event.imageUrl}
                            imageAlt={event.title}
                            hasImage={!!event.imageUrl}
                        />
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching events:', error);

        // Fallback to hardcoded events if database fails
        const fallbackEvents = [
            {
                title: 'Jugendfeuerwehr',
                location: 'Wendessen',
                time: 'Jubiläum "45 Jahre"',
                date: '30.09.2023',
                imageSrc: '/images/Events/Jugendfeuerwehr.jpeg',
                imageAlt: 'Jugendfeuerwehr Wendessen',
            },
            {
                title: 'Gitarren-Konzert',
                location: 'Kirche St. Georg',
                time: 'Beginn 20:00 Uhr',
                date: '15.10.2023',
                imageSrc: '/images/Events/Gitarrenkonzert.jpeg',
                imageAlt: 'Gitarren Konzert',
            },
            {
                title: 'Bücherbus',
                location: 'Spritzenhaus',
                time: '18:30 bis 19:00 Uhr',
                date: '18.10.2023',
                imageSrc: '/images/Events/Bücherbus.jpeg',
                imageAlt: 'Bücherbus',
            },
        ];

        return (
            <div className="mb-32 mt-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {fallbackEvents.map((event, index) => (
                        <EventCard
                            key={index}
                            title={event.title}
                            location={event.location}
                            time={event.time}
                            date={event.date}
                            imageSrc={event.imageSrc}
                            imageAlt={event.imageAlt}
                        />
                    ))}
                </div>
            </div>
        );
    }
}
