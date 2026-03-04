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

    const parsed = parseHttpUrl(url);
    if (!parsed) return false;

    const hostname = normalizeHostname(parsed.hostname);
    const pathname = parsed.pathname.toLowerCase();
    const isKnownBucketPath = KNOWN_BUCKET_PREFIXES.some((prefix) =>
        pathname.startsWith(prefix),
    );

    if (isKnownMinioHostname(hostname)) return true;

    const configuredHosts = getConfiguredMinioHosts();
    if (configuredHosts.has(hostname)) return true;

    const isPort9000 = parsed.port === "9000";
    if (isPort9000 && (isKnownBucketPath || isIpv4Address(hostname))) {
        return true;
    }

    return false;
}

const KNOWN_BUCKET_PREFIXES = [
    "/admin-gallery/",
    "/portraits/",
    "/impressions/",
];

const LOCAL_MINIO_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "minio"]);

function parseHttpUrl(url: string): URL | null {
    const trimmed = url.trim();
    if (!trimmed) return null;

    const normalizedUrl = trimmed.startsWith("//")
        ? `https:${trimmed}`
        : trimmed;

    try {
        const parsed = new URL(normalizedUrl);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

function normalizeHostname(hostname: string): string {
    return hostname.toLowerCase().replace(/^\[|\]$/g, "");
}

function isIpv4Address(hostname: string): boolean {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
}

function isKnownMinioHostname(hostname: string): boolean {
    if (LOCAL_MINIO_HOSTS.has(hostname)) return true;
    if (hostname.includes("minio")) return true;
    if (hostname.endsWith(".duckdns.org")) return true;
    return false;
}

function getConfiguredMinioHosts(): Set<string> {
    const rawCandidates = [
        process.env.MINIO_ENDPOINT,
        process.env.MINIO_HOSTNAME,
        process.env.MINIO_HOST,
        process.env.NEXT_PUBLIC_MINIO_ENDPOINT,
        process.env.NEXT_PUBLIC_MINIO_HOSTNAME,
        process.env.NEXT_PUBLIC_MINIO_HOST,
    ].filter((value): value is string => Boolean(value?.trim()));

    const hosts = new Set<string>();

    for (const candidate of rawCandidates) {
        const parsed = parseHttpUrl(candidate);
        if (parsed) {
            hosts.add(normalizeHostname(parsed.hostname));
            continue;
        }

        const normalized = candidate
            .trim()
            .replace(/^https?:\/\//, "")
            .replace(/\/.*$/, "")
            .replace(/:\d+$/, "");

        if (normalized) {
            hosts.add(normalizeHostname(normalized));
        }
    }

    return hosts;
}
