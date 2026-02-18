import CroppedImage from '../ui/CroppedImage';
import { Calendar } from '@phosphor-icons/react/dist/ssr';
import { ImageCropConfig } from '@/lib/database/events';
import Link from 'next/link';

interface EventCardProps {
    id: string;
    title: string;
    location: string;
    time: string;
    date: string;
    imageSrc?: string;
    imageCropData?: ImageCropConfig;
    imageAlt: string;
    hasImage?: boolean;
    isCancelled?: boolean;
}

export default function EventCard({
    id,
    title,
    location,
    time,
    date,
    imageSrc,
    imageCropData,
    imageAlt,
    hasImage = true,
    isCancelled = false,
}: EventCardProps) {
    return (
        <Link
            href={`/was-steht-an?event=${id}`}
            className={`group relative aspect-[16/9] md:aspect-[4/5] lg:aspect-square overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border block ${
                isCancelled ? 'border-red-300 opacity-75' : 'border-gray-200'
            }`}
        >
            {hasImage && imageSrc ? (
                <>
                    <div className="absolute inset-0 overflow-hidden">
                        <CroppedImage
                            src={imageSrc}
                            cropData={imageCropData}
                            viewId="home-card"
                            alt={imageAlt}
                            fill
                            containerClassName="absolute inset-0"
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10 pointer-events-none"></div>
                        <div className="absolute top-4 right-4">
                            <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {date}
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 text-white bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                        {isCancelled && (
                            <div className="mb-2">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                                    🚫 ABGESAGT
                                </span>
                            </div>
                        )}
                        <h3
                            className={`text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-300 drop-shadow-lg ${
                                isCancelled ? 'line-through' : ''
                            }`}
                        >
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
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="absolute top-4 right-4">
                            <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                {date}
                            </div>
                        </div>
                        <div className="text-center p-6 text-gray-700">
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-gray-600" />
                            </div>
                            {isCancelled && (
                                <div className="mb-2">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                                        🚫 ABGESAGT
                                    </span>
                                </div>
                            )}
                            <h3
                                className={`text-xl font-bold mb-2 group-hover:text-gray-900 transition-colors duration-300 ${
                                    isCancelled ? 'line-through' : ''
                                }`}
                            >
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
        </Link>
    );
}
