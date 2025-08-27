import EventCard from './EventCard';

export default function EventsSection() {
    const events = [
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
                {events.map((event, index) => (
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
