import { Client } from 'minio';

// Run once per Node process. Importing this module triggers initialization.
declare global {
    var __minioInitPromise: Promise<void> | undefined;
}

if (!globalThis.__minioInitPromise) {
    console.log('[minio-init] module import');
    globalThis.__minioInitPromise = (async () => {
        try {
            const env = process.env as Record<string, string | undefined>;
            const MINIO_ENDPOINT =
                env.MINIO_ENDPOINT || 'http://localhost:9000';
            const MINIO_PORT = env.MINIO_PORT || '9000';
            const MINIO_ACCESS_KEY = env.MINIO_ACCESS_KEY || 'minioadmin';
            const MINIO_SECRET_KEY = env.MINIO_SECRET_KEY || 'minioadmin';
            const MINIO_USE_SSL = env.MINIO_USE_SSL === 'true';
            const MINIO_BUCKET_GALLERY =
                env.MINIO_BUCKET_GALLERY || 'admin-gallery';
            const MINIO_BUCKET_PORTRAITS =
                env.MINIO_BUCKET_PORTRAITS || 'portraits';
            const MINIO_BUCKET_IMPRESSIONS =
                env.MINIO_BUCKET_IMPRESSIONS || 'impressions';

            function parseEndpoint(endpoint: string) {
                try {
                    const u = new URL(endpoint);
                    return { host: u.hostname, port: u.port || MINIO_PORT };
                } catch {
                    return {
                        host: endpoint
                            .replace(/https?:\/\//, '')
                            .replace(/:\d+$/, ''),
                        port: MINIO_PORT,
                    };
                }
            }

            const parsed = parseEndpoint(MINIO_ENDPOINT);

            const client = new Client({
                endPoint: parsed.host,
                port:
                    parseInt(MINIO_PORT, 10) ||
                    parseInt(parsed.port, 10) ||
                    9000,
                useSSL: MINIO_USE_SSL,
                accessKey: MINIO_ACCESS_KEY,
                secretKey: MINIO_SECRET_KEY,
            });

            const buckets = [
                MINIO_BUCKET_GALLERY,
                MINIO_BUCKET_PORTRAITS,
                MINIO_BUCKET_IMPRESSIONS,
            ];

            for (const bucket of buckets) {
                if (!bucket) continue;
                try {
                    const exists = await client.bucketExists(bucket);
                    if (!exists) {
                        await client.makeBucket(bucket, '');
                        console.log(`minio-init: created bucket ${bucket}`);
                    } else {
                        console.log(`minio-init: bucket exists ${bucket}`);
                    }

                    // Always apply the public-read policy so GETs work for all.
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

                    await client.setBucketPolicy(
                        bucket,
                        JSON.stringify(policy)
                    );
                    console.log(
                        `minio-init: applied public-read policy to ${bucket}`
                    );
                } catch (err) {
                    // Non-fatal: log and continue so app can still run.
                    console.warn(
                        `minio-init: failed for bucket ${bucket}:`,
                        err
                    );
                }
            }
            // Run ensure-admin here so it executes while startup logs are visible
            if (!process.env.DATABASE_URL) {
                console.warn(
                    'minio-init: DATABASE_URL not set — skipping ensure-admin'
                );
            } else {
                try {
                    console.log('=== [MinIO] ensure-admin START ===');
                    const mod = await import('./ensure-admin');
                    // prefer the named export but fall back to default
                    const ensureAdmin = (mod &&
                        (mod.ensureAdmin ||
                            mod.default)) as () => Promise<void>;
                    if (ensureAdmin) {
                        await ensureAdmin();
                    } else {
                        console.warn(
                            'minio-init: ensure-admin module found but no callable export'
                        );
                    }

                    try {
                        const { writeFile } = await import('fs/promises');
                        await writeFile(
                            '/tmp/ensure-admin-ran',
                            `ran ${new Date().toISOString()}\n`
                        );
                        console.log('[MinIO] wrote /tmp/ensure-admin-ran');
                    } catch (wfErr) {
                        console.warn(
                            'minio-init: failed writing marker file',
                            wfErr
                        );
                    }
                } catch (err) {
                    console.error('minio-init: ensure-admin failed', err);
                }
            }

            console.log('minio-init: complete');
        } catch (e) {
            console.warn('minio-init: unexpected error', e);
        }
    })();
}

export {};
