import Image from 'next/image';

interface EventCardProps {
    title: string;
    location: string;
    time: string;
    date: string;
    imageSrc: string;
    imageAlt: string;
}

export default function EventCard({
    title,
    location,
    time,
    date,
    imageSrc,
    imageAlt,
}: EventCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10"></div>
                <div className="absolute top-4 right-4">
                    <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {date}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-300 drop-shadow-lg">
                    {title}
                </h3>
                <p className="text-sm opacity-90 mb-1 drop-shadow-md">
                    {location}
                </p>
                <p className="text-lg font-semibold text-primary drop-shadow-lg">
                    {time}
                </p>
            </div>
        </div>
    );
}
