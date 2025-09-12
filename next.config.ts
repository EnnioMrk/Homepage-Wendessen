import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    experimental: {
        serverComponentsExternalPackages: ['undici'],
    },
    serverExternalPackages: ['undici'],
};

export default nextConfig;
