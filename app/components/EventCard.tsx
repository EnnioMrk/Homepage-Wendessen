import Image from 'next/image';

interface EventCardProps {
    title: string;
    location: string;
    time: string;
    date: string;
    imageSrc?: string;
    imageAlt: string;
    hasImage?: boolean;
}

export default function EventCard({
    title,
    location,
    time,
    date,
    imageSrc,
    imageAlt,
    hasImage = true,
}: EventCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200">
            {hasImage && imageSrc ? (
                <>
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
                </>
            ) : (
                <>
                    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="absolute top-4 right-4">
                            <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {date}
                            </div>
                        </div>
                        <div className="text-center p-6 text-gray-700">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📅</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-gray-900 transition-colors duration-300">
                                {title}
                            </h3>
                            <p className="text-sm opacity-80 mb-1">
                                {location}
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                {time}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
