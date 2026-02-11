import type { NextConfig } from 'next';

// Derive MinIO host/port/protocol from environment safely (no hardcoded host)
const minioEndpoint = process.env.MINIO_ENDPOINT;
function resolveMinioHost(endpoint?: string) {
    if (!endpoint) return undefined;
    try {
        const u = new URL(endpoint);
        return u.hostname;
    } catch {
        // If it's not a full URL, trim trailing slashes and ports if present
        return endpoint.replace(/:\/\/$|:\/|\/$/g, '').replace(/:\d+$/, '');
    }
}

const minioHostname =
    resolveMinioHost(minioEndpoint) ||
    process.env.MINIO_HOSTNAME ||
    process.env.MINIO_HOST;

const minioProtocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';

const minioPorts = ['80', '9000'];

// Build remotePatterns as URL instances when MinIO is configured. Using
// `URL` here matches Next.js typings `(URL | RemotePattern)[]` and keeps the
// allowed external image sources strict (blocks all others).
const imageRemotePatterns: (URL | Record<string, unknown>)[] = minioHostname
    ? (() => {
          const portSegment = process.env.MINIO_PORT
              ? `:${process.env.MINIO_PORT}`
              : '';
          const url = `${minioProtocol}://${minioHostname}${portSegment}/**`;
          try {
              return [new URL(url)];
          } catch {
              // fallback to object pattern if URL constructor fails for any reason
              return [
                  {
                      protocol: minioProtocol,
                      hostname: minioHostname,
                      ...(process.env.MINIO_PORT
                          ? { port: process.env.MINIO_PORT }
                          : {}),
                      pathname: '/:path*',
                  },
              ];
          }
      })()
    : [];

console.log(
    `Next.js image remotePatterns configured for MinIO: ${
        minioHostname
            ? `${minioProtocol}://${minioHostname}${
                  process.env.MINIO_PORT ? `:${process.env.MINIO_PORT}` : ''
              }`
            : 'none'
    }`,
);

const nextConfig: NextConfig = {
    images: {
        // Use only remotePatterns (domains is deprecated). Keep patterns strict
        // and only enable them when a MinIO hostname is configured via env.
        // Type assertion is required so TS accepts the plain-object patterns
        // as the expected `(URL | RemotePattern)[]` union.
        remotePatterns:
            imageRemotePatterns as unknown as import('next/dist/shared/lib/image-config').RemotePattern[],
        // Aggressive caching for optimized images (1 year)
        minimumCacheTTL: 31536000,
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                // Apply aggressive caching to all image files in public folder
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // Apply aggressive caching to SVGs
                source: '/svgs/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // Apply aggressive caching to PDFs
                source: '/pdfs/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // Do NOT aggressively cache manifest or service worker - they change and Android Chrome relies on them.
                source: '/manifest.json',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self'",
                    },
                ],
            },
            {
                // Apply aggressive caching to favicon and other root static files (images, icons), excluding manifest
                source: '/:file(favicon\\.ico|robots\\.txt|sitemap\\.xml|.+\\.png|.+\\.jpg|.+\\.jpeg|.+\\.gif|.+\\.webp|.+\\.svg|.+\\.ico)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // Apply aggressive caching to Next.js optimized images
                source: '/_next/image/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // Apply aggressive caching to static assets (JS, CSS, fonts, etc.)
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                // Apply aggressive caching to fonts
                source: '/fonts/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    cacheComponents: true,
    experimental: {
        useCache: true,
        cacheLife: {
            page: {
                stale: 3600, // 1 hour
                revalidate: 3600, // 1 hour
                expire: 86400, // 1 day
            },
        },
    },
};

export default nextConfig;
