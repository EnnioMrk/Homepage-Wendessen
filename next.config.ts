import type { NextConfig } from 'next';

// Derive MinIO host/port/protocol from environment safely (no hardcoded host)
const minioEndpoint = process.env.MINIO_ENDPOINT;
function resolveMinio(endpoint?: string) {
    if (!endpoint) return undefined;
    try {
        const u = new URL(endpoint);
        return {
            protocol: u.protocol.replace(':', ''),
            hostname: u.hostname,
            port: u.port || undefined,
        };
    } catch {
        // Accept formats like 'hostname:9000' or 'hostname/' or 'http://hostname:9000/'
        const cleaned = endpoint.replace(/^https?:\/\//, '').replace(/\/+$/g, '');
        const hostPort = cleaned.split('/')[0];
        const [hostname, port] = hostPort.split(':');
        const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : (endpoint.startsWith('https') ? 'https' : 'http');
        return {
            protocol,
            hostname,
            port: port || undefined,
        };
    }
}

const minio = resolveMinio(minioEndpoint);
const nextConfig: NextConfig = {
    images: {
        // Use remotePatterns (images.domains is deprecated)
        remotePatterns: minio
            ? [
                  {
                      protocol: minio.protocol,
                      hostname: minio.hostname,
                      port: minio.port || process.env.MINIO_PORT || undefined,
                      pathname: '/:path*',
                  },
              ]
            : [],
        // Aggressive caching for optimized images (1 year)
        minimumCacheTTL: 31536000,
    },
    async headers() {
        return [
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
                // Apply aggressive caching to favicon and other root static files
                source: '/:file(favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|.+\\.png|.+\\.jpg|.+\\.jpeg|.+\\.gif|.+\\.webp|.+\\.svg|.+\\.ico)',
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
};

export default nextConfig;
