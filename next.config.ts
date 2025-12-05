import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol:
                    process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http',
                hostname: process.env.MINIO_ENDPOINT?.includes('://')
                    ? new URL(process.env.MINIO_ENDPOINT).hostname
                    : process.env.MINIO_ENDPOINT || 'localhost',
                port: process.env.MINIO_PORT || '9000',
                pathname: '/**',
            },
        ],
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
