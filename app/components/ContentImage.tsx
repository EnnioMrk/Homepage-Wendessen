import Image from 'next/image';

interface ContentImageProps {
    src: string;
    alt: string;
    caption?: string;
    className?: string;
}

export default function ContentImage({
    src,
    alt,
    caption,
    className = '',
}: ContentImageProps) {
    return (
        <div className={`my-8 ${className}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <Image
                    src={src}
                    alt={alt}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-cover"
                />
            </div>
            {caption && (
                <p className="mt-3 text-center text-sm text-gray-500 italic">
                    {caption}
                </p>
            )}
        </div>
    );
}
