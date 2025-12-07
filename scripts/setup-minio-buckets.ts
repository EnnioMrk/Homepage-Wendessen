#!/usr/bin/env bunx tsx
/**
 * Ensure MinIO buckets exist and set public-read for GETs.
 * Run at server start to guarantee correct bucket policies.
 */

import Minio from 'minio';

const {
    MINIO_ENDPOINT = 'http://localhost:9000',
    MINIO_PORT = '9000',
    MINIO_ACCESS_KEY = 'minioadmin',
    MINIO_SECRET_KEY = 'minioadmin',
    MINIO_USE_SSL = 'false',
    MINIO_BUCKET_GALLERY = 'admin-gallery',
    MINIO_BUCKET_PORTRAITS = 'portraits',
    MINIO_BUCKET_IMPRESSIONS = 'impressions',
} = process.env as Record<string, string>;

function parseEndpoint(endpoint: string) {
    try {
        const u = new URL(endpoint);
        return { host: u.hostname, port: u.port || MINIO_PORT, protocol: u.protocol.replace(':', '') };
    } catch {
        return { host: endpoint.replace(/https?:\/\//, '').replace(/:\d+$/, ''), port: MINIO_PORT, protocol: MINIO_USE_SSL === 'true' ? 'https' : 'http' };
    }
}

const parsed = parseEndpoint(MINIO_ENDPOINT);

const client = new Minio.Client({
    endPoint: parsed.host,
    port: parseInt(MINIO_PORT, 10) || (parsed.port ? parseInt(parsed.port, 10) : 9000),
    useSSL: (MINIO_USE_SSL === 'true'),
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
});

const buckets = [MINIO_BUCKET_GALLERY, MINIO_BUCKET_PORTRAITS, MINIO_BUCKET_IMPRESSIONS];

async function ensureBucket(bucket: string) {
    try {
        const exists = await client.bucketExists(bucket);
        if (!exists) {
            console.log(`Creating bucket: ${bucket}`);
            await client.makeBucket(bucket, '');
        } else {
            console.log(`Bucket exists: ${bucket}`);
        }

        // Set a policy that allows public read (GetObject) for all,
        // while write/delete require valid credentials (no policy for anonymous).
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: ['s3:GetObject'],
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Resource: [`arn:aws:s3:::${bucket}/*`],
                    Sid: '',
                },
            ],
        };

        await client.setBucketPolicy(bucket, JSON.stringify(policy));
        console.log(`Set public-read policy on ${bucket}`);
    } catch (err) {
        console.error(`Failed to ensure bucket ${bucket}:`, err);
        throw err;
    }
}

async function main() {
    for (const b of buckets) {
        if (!b) continue;
        await ensureBucket(b);
    }
    console.log('MinIO buckets configured.');
}

main().catch((e) => {
    console.error('Error configuring MinIO buckets:', e);
    process.exit(1);
});
