// sharp is imported dynamically to avoid module loading errors in restricted runtimes
// import sharp from 'sharp';

export interface ConvertedImage {
    buffer: Buffer;
    mimeType: string;
    filename: string;
}

/**
 * Default quality setting for WebP conversion (0-100)
 */
const WEBP_QUALITY = 85;

/**
 * Converts an image buffer to WebP format using sharp.
 * If the image is already in an optimal web format, it returns the original.
 * SVGs are not converted.
 */
function ensureWebpFilename(originalFilename: string): string {
    if (/\.webp$/i.test(originalFilename)) {
        return originalFilename;
    }
    if (/\.[^.]+$/.test(originalFilename)) {
        return originalFilename.replace(/\.[^.]+$/, '.webp');
    }
    return `${originalFilename}.webp`;
}

export async function convertToWebP(
    buffer: Buffer,
    originalFilename: string,
    originalMimeType: string
): Promise<ConvertedImage> {
    // Skip conversion for SVGs - they're already optimized vector graphics
    if (originalMimeType === 'image/svg+xml') {
        return {
            buffer,
            mimeType: originalMimeType,
            filename: originalFilename,
        };
    }

    // Convert filename extension to .webp
    const newFilename = ensureWebpFilename(originalFilename);

    try {
        const sharp = (await import('sharp')).default;
        const convertedBuffer = await sharp(buffer)
            .webp({ quality: WEBP_QUALITY })
            .toBuffer();

        return {
            buffer: convertedBuffer,
            mimeType: 'image/webp',
            filename: newFilename,
        };
    } catch (error) {
        console.error('Error converting image to WebP:', error);
        // Return original if conversion fails
        return {
            buffer,
            mimeType: originalMimeType,
            filename: originalFilename,
        };
    }
}

/**
 * Converts an image File to WebP format.
 * Returns a new buffer with the converted image data.
 */
export async function convertFileToWebP(file: File): Promise<ConvertedImage> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return convertToWebP(buffer, file.name, file.type);
}

/**
 * Converts a base64 data URL to WebP format.
 * Returns the converted buffer and metadata.
 */
export async function convertDataUrlToWebP(
    dataUrl: string,
    originalFilename?: string
): Promise<ConvertedImage> {
    // Parse the data URL
    const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches) {
        throw new Error('Invalid data URL format');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate a filename if not provided
    const filename = originalFilename || `image-${Date.now()}.${mimeType.split('/')[1] || 'png'}`;

    return convertToWebP(buffer, filename, mimeType);
}

/**
 * Creates a data URL from a buffer and mime type
 */
export function bufferToDataUrl(buffer: Buffer, mimeType: string): string {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
}
