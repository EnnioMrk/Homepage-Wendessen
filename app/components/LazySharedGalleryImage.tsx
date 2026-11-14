'use client';

import Image from 'next/image';
import { useSharedGalleryImage } from './SharedGalleryImageContext';
import { isMinioUrl } from '@/lib/utils/blob-utils-client';

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

const placeholderBox = {
    background: 'var(--paper-sunken)',
    border: '1px solid var(--rule)',
    color: 'var(--ink-muted)',
    fontSize: 'var(--tally)',
    letterSpacing: '0.04em',
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center' as const,
    padding: '4px',
};

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
    const box = fill
        ? { position: 'absolute' as const, inset: 0 }
        : { width, height };

    if (loading) {
        return (
            <div
                className={className}
                style={{ ...placeholderBox, ...box }}
                aria-hidden="true"
            />
        );
    }

    if (error || !imageUrl) {
        return (
            <div
                className={className}
                style={{ ...placeholderBox, ...box }}
                role="img"
                aria-label={`${alt} — Bild nicht verfügbar`}
            >
                Bild nicht verfügbar
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
