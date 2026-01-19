// MinIO (S3-compatible) utilities
// Expects the following env vars:
// MINIO_ENDPOINT, MINIO_PORT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_USE_SSL
// MINIO_BUCKET_GALLERY, MINIO_BUCKET_PORTRAITS, MINIO_BUCKET_IMPRESSIONS

// If the `minio` package is not installed in a consumer environment yet,
// install `minio` in your environment to get full types.
// MinIO is imported dynamically where needed to avoid module loading errors in restricted runtimes
// import * as Minio from 'minio';

// Bucket types for different storage purposes
export type MinioBucket = 'gallery' | 'portraits' | 'impressions';

export { isMinioUrl } from './blob-utils-client';

interface BlobUploadResponse {
    url: string;
    pathname: string;
    contentType: string;
    contentDisposition: string;
}

// Read raw env values. We support either a plain host (like "localhost") or a
// full URL (like "http://host:9000") in MINIO_ENDPOINT. If a full URL is
// provided we parse it to extract host, port and protocol.
const DEFAULT_MINIO_PORT = 9000;
const RAW_MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || '';
let MINIO_ENDPOINT = RAW_MINIO_ENDPOINT;
let MINIO_PORT = process.env.MINIO_PORT
    ? Number(process.env.MINIO_PORT)
    : undefined;
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY;

// Bucket names from environment variables
const MINIO_BUCKETS: Record<MinioBucket, string> = {
    gallery: process.env.MINIO_BUCKET_GALLERY || 'admin-gallery',
    portraits: process.env.MINIO_BUCKET_PORTRAITS || 'portraits',
    impressions: process.env.MINIO_BUCKET_IMPRESSIONS || 'impressions',
};

// Legacy support: if old MINIO_BUCKET is set, use it as default for gallery
if (process.env.MINIO_BUCKET && !process.env.MINIO_BUCKET_GALLERY) {
    MINIO_BUCKETS.gallery = process.env.MINIO_BUCKET;
}

let MINIO_USE_SSL = process.env.MINIO_USE_SSL === 'true' || false;

// If the user supplied a full URL, parse it and derive host/port/ssl defaults
if (
    RAW_MINIO_ENDPOINT.startsWith('http://') ||
    RAW_MINIO_ENDPOINT.startsWith('https://')
) {
    try {
        const parsed = new URL(RAW_MINIO_ENDPOINT);
        MINIO_ENDPOINT = parsed.hostname;
        if (!process.env.MINIO_PORT && parsed.port) {
            MINIO_PORT = Number(parsed.port);
        }
        if (!process.env.MINIO_USE_SSL) {
            MINIO_USE_SSL = parsed.protocol === 'https:';
        }
    } catch {
        // leave values as-is; downstream code will warn if something is wrong
    }
}

if (!MINIO_PORT || Number.isNaN(MINIO_PORT)) {
    MINIO_PORT = DEFAULT_MINIO_PORT;
}

if (!MINIO_ENDPOINT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY) {
    console.warn(
        'MinIO not fully configured. Ensure MINIO_ENDPOINT (host or full URL), MINIO_ACCESS_KEY and MINIO_SECRET_KEY are set.'
    );
}

// Define a minimal interface for the MinIO client methods we use
interface MinioStatLike {
    metaData?: Record<string, string>;
    size?: number;
    contentType?: string;
}

interface MinioClientLike {
    bucketExists(
        bucket: string,
        callback: (err: Error | null, exists: boolean) => void
    ): void;
    makeBucket(
        bucket: string,
        region: string,
        callback: (err: Error | null) => void
    ): void;
    putObject(
        bucket: string,
        name: string,
        buffer: Buffer,
        size: number,
        meta: Record<string, string>,
        callback: (err: Error | null) => void
    ): void;
    removeObject(
        bucket: string,
        name: string,
        callback: (err: Error | null) => void
    ): void;
    getObject(
        bucket: string,
        name: string,
        callback: (
            err: Error | null,
            dataStream?: NodeJS.ReadableStream
        ) => void
    ): void;
    statObject(
        bucket: string,
        name: string,
        callback: (err: Error | null, stat?: MinioStatLike) => void
    ): void;
}

// Keep the client minimally typed to avoid depending on fragile upstream types
// in the `minio` package. We only need the runtime behavior.
let _minioClient: MinioClientLike | null = null;
async function getMinioClient(): Promise<MinioClientLike> {
    if (_minioClient) return _minioClient;
    const Minio = await import('minio');
    _minioClient = new (
        Minio as unknown as { Client: new (opts: unknown) => MinioClientLike }
    ).Client({
        endPoint: MINIO_ENDPOINT || 'localhost',
        port: MINIO_PORT,
        useSSL: MINIO_USE_SSL,
        accessKey: MINIO_ACCESS_KEY || '',
        secretKey: MINIO_SECRET_KEY || '',
    });
    return _minioClient;
}

function resolveBucketAndObject(
    urlOrPath: string
): { bucket: string; object: string } | null {
    if (!urlOrPath) {
        return null;
    }

    try {
        const parsed = new URL(urlOrPath);
        const parts = parsed.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
            const bucket = parts[0];
            const object = decodeURIComponent(parts.slice(1).join('/'));
            return { bucket, object };
        }
    } catch {
        // not a URL, fall through
    }

    // Default to gallery bucket for backward compatibility
    return {
        bucket: MINIO_BUCKETS.gallery,
        object: decodeURIComponent(urlOrPath),
    };
}

// Helper function to get bucket name
export function getBucketName(bucket: MinioBucket): string {
    return MINIO_BUCKETS[bucket];
}

// Get all bucket names
export function getAllBucketNames(): string[] {
    return Object.values(MINIO_BUCKETS);
}

// Check if MinIO is configured
export function isMinioConfigured(): boolean {
    return !!(MINIO_ENDPOINT && MINIO_ACCESS_KEY && MINIO_SECRET_KEY);
}

/**
 * Initialize all MinIO buckets on server startup.
 * Creates buckets if they don't exist.
 */
export async function initializeMinIOBuckets(): Promise<void> {
    if (!isMinioConfigured()) {
        console.warn('[MinIO] Not configured, skipping bucket initialization');
        return;
    }

    console.log('[MinIO] Initializing buckets...');

    const bucketTypes: MinioBucket[] = ['gallery', 'portraits', 'impressions'];

    for (const bucketType of bucketTypes) {
        const bucketName = MINIO_BUCKETS[bucketType];
        try {
            await ensureBucketExists(bucketName);
            console.log(`[MinIO] ✓ Bucket "${bucketName}" ready`);
        } catch (error) {
            console.error(
                `[MinIO] ✗ Failed to initialize bucket "${bucketName}":`,
                error
            );
        }
    }

    console.log('[MinIO] Bucket initialization complete');
}

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}

async function ensureBucketExists(bucket: string) {
    const client = await getMinioClient();
    return new Promise<void>((resolve, reject) => {
        client.bucketExists(
            bucket,
            (err: Error | null, exists: boolean) => {
                if (err) {
                    console.error(`[MinIO] Connection error for bucket "${bucket}":`, {
                        endpoint: MINIO_ENDPOINT,
                        port: MINIO_PORT,
                        useSSL: MINIO_USE_SSL,
                        errorMessage: err.message,
                        errorCode: (err as { code?: string }).code,
                    });
                    return reject(err);
                }
                if (exists) return resolve();
                client.makeBucket(bucket, '', (mkErr: Error | null) => {
                    if (mkErr) {
                        console.error(`[MinIO] Failed to create bucket "${bucket}":`, mkErr.message);
                        return reject(mkErr);
                    }
                    resolve();
                });
            }
        );
    });
}

function bufferFromFile(
    file: File | Blob | Buffer | Uint8Array
): Promise<Buffer> {
    if (Buffer.isBuffer(file)) {
        return Promise.resolve(file as Buffer);
    }
    if (typeof (file as Blob).arrayBuffer === 'function') {
        return (file as Blob).arrayBuffer().then((ab) => Buffer.from(ab));
    }
    // Fallback for Uint8Array
    if (file instanceof Uint8Array) {
        return Promise.resolve(Buffer.from(file));
    }
    throw new Error('Unsupported file type for upload');
}

export async function uploadToBlob(
    filename: string,
    file: File | Blob | Buffer | Uint8Array,
    options: {
        addRandomSuffix?: boolean;
        contentType?: string;
        bucket?: MinioBucket;
    } = {}
): Promise<BlobUploadResponse> {
    if (!MINIO_ENDPOINT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY) {
        throw new Error(
            'MinIO environment variables not configured (MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY)'
        );
    }

    const {
        addRandomSuffix = false,
        contentType: providedContentType,
        bucket: bucketType = 'gallery',
    } = options;

    const finalFilename = addRandomSuffix
        ? `${Date.now()}-${Math.random().toString(36).substring(2)}-${filename}`
        : filename;

    const bucket = MINIO_BUCKETS[bucketType];

    await ensureBucketExists(bucket);

    const buf = await bufferFromFile(file);

    // Determine content type if possible
    // If file has a `type` property (Browser File/Blob), use it; else fallback
    function hasTypeProp(x: unknown): x is { type: string } {
        return (
            typeof x === 'object' &&
            x !== null &&
            'type' in (x as Record<string, unknown>) &&
            typeof (x as Record<string, unknown>).type === 'string'
        );
    }

    const contentType = providedContentType
        ? providedContentType
        : hasTypeProp(file)
            ? file.type
            : 'application/octet-stream';

    await new Promise<void>(async (resolve, reject) => {
        const client = await getMinioClient();
        client.putObject(
            bucket,
            finalFilename,
            buf,
            buf.length,
            { 'Content-Type': contentType },
            (err: Error | null /*, etag */) => {
                if (err) return reject(err);
                resolve();
            }
        );
    });

    const protocol = MINIO_USE_SSL ? 'https' : 'http';
    const url = `${protocol}://${MINIO_ENDPOINT}:${MINIO_PORT}/${bucket}/${encodeURIComponent(
        finalFilename
    )}`;

    return {
        url,
        pathname: finalFilename,
        contentType,
        contentDisposition: `inline; filename="${filename}"`,
    };
}

export async function deleteFromBlob(urlOrPath: string): Promise<void> {
    if (!MINIO_ENDPOINT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY) {
        throw new Error(
            'MinIO environment variables not configured (MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY)'
        );
    }

    const target = resolveBucketAndObject(urlOrPath);
    if (!target) {
        throw new Error('Unable to resolve MinIO object for deletion');
    }

    await new Promise<void>(async (resolve, reject) => {
        const client = await getMinioClient();
        client.removeObject(
            target.bucket,
            target.object,
            (err: Error | null) => {
                if (err) return reject(err);
                resolve();
            }
        );
    });
}

export async function downloadFromBlob(urlOrPath: string): Promise<{
    buffer: Buffer;
    contentType?: string;
}> {
    if (!MINIO_ENDPOINT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY) {
        throw new Error(
            'MinIO environment variables not configured (MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY)'
        );
    }

    const target = resolveBucketAndObject(urlOrPath);
    if (!target) {
        throw new Error('Unable to resolve MinIO object for download');
    }

    const dataStream = await new Promise<NodeJS.ReadableStream>(
        async (resolve, reject) => {
            const client = await getMinioClient();
            client.getObject(
                target.bucket,
                target.object,
                (err: Error | null, stream?: NodeJS.ReadableStream) => {
                    if (err || !stream) return reject(err);
                    resolve(stream);
                }
            );
        }
    );

    const buffer = await streamToBuffer(dataStream);

    let contentType: string | undefined;
    try {
        const stat = await new Promise<MinioStatLike | null>(
            async (resolve, reject) => {
                const client = await getMinioClient();
                client.statObject(
                    target.bucket,
                    target.object,
                    (err: Error | null, s?: MinioStatLike) => {
                        if (err) {
                            // If object metadata cannot be fetched, continue with buffer only
                            if (
                                (err as { code?: string }).code === 'NotFound'
                            ) {
                                return resolve(null);
                            }
                            return reject(err);
                        }
                        resolve(s || null);
                    }
                );
            }
        );
        contentType =
            stat?.metaData?.['content-type'] ||
            stat?.metaData?.['Content-Type'] ||
            stat?.contentType;
    } catch (err) {
        console.warn('Unable to fetch MinIO metadata for download:', err);
    }

    return { buffer, contentType };
}