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
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Ensure undici is bundled properly
            config.resolve = config.resolve || {};
            config.resolve.fallback = {
                ...config.resolve.fallback,
                'undici': require.resolve('undici'),
            };
        }
        return config;
    },
    serverExternalPackages: [],
};

export default nextConfig;
