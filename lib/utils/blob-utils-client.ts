/**
 * client-side utilities for MinIO blob storage.
 * This file MUST NOT import 'minio' or any other node-only packages.
 */

/**
 * Checks if a URL points to the configured MinIO instance.
 * Used to determine if unoptimized={true} should be passed to Next.js Image.
 */
export function isMinioUrl(url: string | null | undefined): boolean {
    if (!url) return false;

    // Check for common strings in our MinIO setup
    // This is safer than using process.env here which might not be available or correctly prefixed
    return (
        url.includes('minio') ||
        url.includes('duckdns.org') ||
        url.includes('localhost:9000')
    );
}
