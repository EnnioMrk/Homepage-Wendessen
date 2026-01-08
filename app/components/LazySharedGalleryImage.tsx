'use client';

import Image from 'next/image';
import { useSharedGalleryImage } from './SharedGalleryImageContext';
import { isMinioUrl } from '@/lib/utils/blob-utils';

interface LazySharedGalleryImageProps {
    imageId: string;
    alt: string;
    className?: string;
    fill?: boolean;
    sizes?: string;
    width?: number;
    height?: number;
    onClick?: () => void;
    onLoad?: (imageUrl: string) => void;
}

export default function LazySharedGalleryImage({
    imageId,
    alt,
    className,
    fill,
    sizes,
    width,
    height,
    onClick,
    onLoad,
}: LazySharedGalleryImageProps) {
    const { imageUrl, loading, error } = useSharedGalleryImage(imageId, onLoad);

    if (loading) {
        return (
            <div
                className={`bg-gray-200 animate-pulse ${className || ''}`}
                style={
                    fill
                        ? { position: 'absolute', inset: 0 }
                        : { width, height }
                }
            />
        );
    }

    if (error || !imageUrl) {
        return (
            <div
                className={`bg-gray-300 flex items-center justify-center text-gray-500 text-xs ${className || ''
                    }`}
                style={
                    fill
                        ? { position: 'absolute', inset: 0 }
                        : { width, height }
                }
            >
                Fehler
            </div>
        );
    }

    if (fill) {
        return (
            <Image
                src={imageUrl}
                alt={alt}
                fill
                className={className}
                sizes={sizes}
                onClick={onClick}
                unoptimized={isMinioUrl(imageUrl)}
            />
        );
    }

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={width || 100}
            height={height || 100}
            className={className}
            onClick={onClick}
            unoptimized={isMinioUrl(imageUrl)}
        />
    );
}
