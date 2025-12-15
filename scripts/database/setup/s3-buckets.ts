#!/usr/bin/env bun
/**
 * Ensure AWS S3 buckets exist and set public-read policy for GETs.
 * Intended to be run during startup to guarantee correct bucket policies.
 */

import {
    S3Client,
    HeadBucketCommand,
    CreateBucketCommand,
    GetBucketPolicyCommand,
} from '@aws-sdk/client-s3';

const {
    AWS_REGION = 'eu-central-1',
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    S3_BUCKET_GALLERY = 'admin-gallery',
    S3_BUCKET_PORTRAITS = 'portraits',
    S3_BUCKET_IMPRESSIONS = 'impressions',
    // legacy/alternate S3 env vars
    S3_ENDPOINT,
    S3_PORT,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
} = process.env as Record<string, string | undefined>;

// Prefer S3_* env vars when provided (RustFS / custom S3 setups)
const accessKey = S3_ACCESS_KEY || AWS_ACCESS_KEY_ID;
const secretKey = S3_SECRET_KEY || AWS_SECRET_ACCESS_KEY;

let endpoint: string | undefined = undefined;
if (S3_ENDPOINT) {
    endpoint = S3_ENDPOINT.replace(/\/$/, '');
    if (S3_PORT) endpoint = `${endpoint}:${S3_PORT}`;
}

const client = new S3Client({
    region: AWS_REGION,
    endpoint: endpoint || undefined,
    forcePathStyle: true,
    credentials:
        accessKey && secretKey
            ? { accessKeyId: accessKey, secretAccessKey: secretKey }
            : undefined,
});

const buckets = [S3_BUCKET_GALLERY, S3_BUCKET_PORTRAITS, S3_BUCKET_IMPRESSIONS];

async function ensureBucket(bucket: string) {
    if (!bucket) return { bucket, isPublic: false };

    let created = false;
    // Ensure bucket exists
    try {
        await client.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch (err: unknown) {
        const metadataStatus =
            typeof err === 'object' && err !== null
                ? (err as { $metadata?: { httpStatusCode?: number } }).$metadata
                      ?.httpStatusCode
                : undefined;
        const notFound =
            metadataStatus === 404 || /Not Found/i.test(String(err));
        if (notFound) {
            console.log(`Creating bucket: ${bucket}`);
            const params: import('@aws-sdk/client-s3').CreateBucketCommandInput =
                { Bucket: bucket };
            if (AWS_REGION && AWS_REGION !== 'us-east-1') {
                params.CreateBucketConfiguration = {
                    LocationConstraint:
                        AWS_REGION as import('@aws-sdk/client-s3').BucketLocationConstraint,
                };
            }
            await client.send(new CreateBucketCommand(params));
            created = true;
            console.log(`Created bucket: ${bucket}`);
        } else {
            console.log(`HeadBucket failed for ${bucket}:`, err);
            throw err;
        }
    }

    // Check bucket policy to see if it grants public GET access
    let isPublic = false;
    try {
        const res = await client.send(
            new GetBucketPolicyCommand({ Bucket: bucket })
        );
        const policyText = res.Policy;
        if (policyText) {
            try {
                type PolicyStatement = {
                    Effect?: string;
                    Action?: string | string[];
                    Principal?:
                        | '*'
                        | { AWS?: string | string[] }
                        | Record<string, unknown>;
                    Resource?: string | string[];
                };
                type BucketPolicy = {
                    Statement: PolicyStatement | PolicyStatement[];
                };

                const policy = JSON.parse(policyText) as BucketPolicy;
                const statements = Array.isArray(policy.Statement)
                    ? policy.Statement
                    : [policy.Statement];
                for (const s of statements) {
                    if (!s || s.Effect !== 'Allow') continue;
                    const actions = Array.isArray(s.Action)
                        ? s.Action
                        : [s.Action];
                    const hasGet = actions.some(
                        (a) =>
                            typeof a === 'string' &&
                            /s3:GetObject|s3:\*/i.test(a)
                    );
                    if (!hasGet) continue;
                    const principal = s.Principal;
                    const principalIsPublic =
                        principal === '*' ||
                        (typeof principal === 'object' &&
                            (principal.AWS === '*' ||
                                (Array.isArray(principal.AWS) &&
                                    principal.AWS.includes('*'))));
                    if (!principalIsPublic) continue;
                    const resources = Array.isArray(s.Resource)
                        ? s.Resource
                        : [s.Resource];
                    const matchesBucket = resources.some(
                        (r) =>
                            String(r).includes(`arn:aws:s3:::${bucket}`) ||
                            String(r).includes(`${bucket}`)
                    );
                    if (matchesBucket) {
                        isPublic = true;
                        break;
                    }
                }
            } catch (parseErr) {
                console.warn(
                    `Could not parse bucket policy for ${bucket}:`,
                    parseErr
                );
            }
        }
    } catch (err) {
        // No policy or unable to fetch -> treat as non-public
        console.warn(`Could not get bucket policy for ${bucket}:`, err);
        isPublic = false;
    }

    const bucketUrl = endpoint
        ? `${endpoint.replace(/\/$/, '')}/${bucket}`
        : `https://${bucket}.s3.${AWS_REGION}.amazonaws.com`;
    console.log(
        `${created ? 'Created' : 'Found'} bucket: ${bucket} -> ${bucketUrl}`
    );
    return { bucket, isPublic };
}

async function main() {
    const privateBuckets: string[] = [];
    for (const b of buckets) {
        if (!b) continue;
        const res = await ensureBucket(b);
        if (!res.isPublic) privateBuckets.push(res.bucket);
    }

    if (privateBuckets.length > 0) {
        console.log(
            'The following buckets are not publicly readable (policy not set to public):'
        );
        console.log(privateBuckets.join(', '));
        console.log(
            'Please go to the dashboard and change the policies of these buckets to public (s3:GetObject) if you want them publicly accessible.'
        );
    } else {
        console.log('All checked buckets have a public GET policy.');
    }
}

main().catch((e) => {
    console.error('Error configuring S3 buckets:', e);
    process.exit(1);
});
