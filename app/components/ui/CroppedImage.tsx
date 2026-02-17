'use client';

import Image, { ImageProps } from 'next/image';
import { ImageCropConfig } from '@/lib/database/events';

interface CroppedImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    cropData?: ImageCropConfig;
    viewId?: string; // e.g. 'card', 'popup'
    containerClassName?: string;
}

export default function CroppedImage({
    src,
    cropData,
    viewId = 'card',
    className,
    containerClassName,
    alt,
    fill = true, // Default to fill behavior
    style,
    ...props
}: CroppedImageProps) {
    const crop = cropData?.[viewId];
    const isHomeCard = viewId === 'home-card';

    // Default render (no crop)
    if (!crop) {
        return (
            <div
                className={`relative w-full h-full overflow-hidden ${containerClassName || ''}`}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill={fill}
                    className={`w-full h-full object-cover ${className || ''}`}
                    style={style}
                    {...props}
                />
            </div>
        );
    }

    if (isHomeCard) {
        const focusX = Math.max(0, Math.min(100, crop.x + crop.width / 2));
        const focusY = Math.max(0, Math.min(100, crop.y + crop.height / 2));

        return (
            <div
                className={`relative w-full h-full overflow-hidden ${containerClassName || ''}`}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill={fill}
                    draggable={false}
                    className={`w-full h-full ${className || ''}`}
                    style={{
                        ...style,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: `${focusX}% ${focusY}%`,
                    }}
                    {...props}
                />
            </div>
        );
    }

    // Simplified rendering for Cropped Image.
    // Instead of messing with object-fit and percentage math on the IMG tag itself (which Next.js fights),
    // we use a wrapper DIV that is absolutely positioned to be LARGER than the container.
    // Container = The view port (hole in the wall).
    // Wrapper = The full image, shifted and scaled so the crop area aligns with the hole.

    // Math:
    // crop.width = 50% means the crop is half the width of the image.
    // So the image must be 200% width of the container (100 / 50 * 100).
    // crop.x = 25% means the crop starts at 25% of the image's width.
    // We need to shift the image LEFT by that amount relative to the CONTAINER.
    // Shift = - (crop.x / crop.width) * 100 %.
    // Example: crop x=25, w=50. Shift = -(25/50)*100 = -50% of container width.

    // Re-calculating with clear variable names (hiding previous declarations)

    const wrapperWidth = (100 / crop.width) * 100;
    const wrapperHeight = (100 / crop.height) * 100;

    const wrapperLeft = -(crop.x / crop.width) * 100;
    const wrapperTop = -(crop.y / crop.height) * 100;

    return (
        <div
            className={`relative w-full h-full overflow-hidden ${containerClassName || ''}`}
        >
            <div
                className="absolute origin-top-left"
                style={{
                    width: `${wrapperWidth}%`,
                    height: `${wrapperHeight}%`,
                    left: `${wrapperLeft}%`,
                    top: `${wrapperTop}%`,
                }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill={fill}
                    draggable={false}
                    className={`${className || ''}`}
                    style={{
                        ...style,
                        objectFit: 'fill',
                        maxWidth: 'none',
                        maxHeight: 'none',
                    }}
                    {...props}
                />
            </div>
        </div>
    );
}
