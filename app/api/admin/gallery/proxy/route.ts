import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '../../../../../lib/permissions';
import dns from 'dns';
import net from 'net';

function resolveHost(endpoint?: string): string | null {
    if (!endpoint) return null;

    const trimmed = endpoint.trim();
    if (!trimmed) return null;

    try {
        return new URL(trimmed).hostname.toLowerCase();
    } catch {
        const withoutProtocol = trimmed.replace(/^https?:\/\//i, '');
        const hostWithMaybePort = withoutProtocol.split('/')[0] || '';
        const hostOnly = hostWithMaybePort.split(':')[0] || '';
        return hostOnly.toLowerCase() || null;
    }
}

function getAllowedHosts(): Set<string> {
    const hosts = new Set<string>();

    const envHosts = [
        process.env.MINIO_ENDPOINT,
        process.env.MINIO_HOSTNAME,
        process.env.MINIO_HOST,
    ];

    for (const value of envHosts) {
        const host = resolveHost(value);
        if (host) {
            hosts.add(host);
        }
    }

    return hosts;
}

function isIpPrivateOrLoopback(ip: string): boolean {
    if (!net.isIP(ip)) return false;

    // IPv4 checks
    if (net.isIPv4(ip)) {
        const octets = ip.split('.').map(Number);
        const [a, b] = octets;

        // 10.0.0.0/8
        if (a === 10) return true;
        // 172.16.0.0/12
        if (a === 172 && b >= 16 && b <= 31) return true;
        // 192.168.0.0/16
        if (a === 192 && b === 168) return true;
        // 127.0.0.0/8 loopback
        if (a === 127) return true;
        // 169.254.0.0/16 link-local
        if (a === 169 && b === 254) return true;
    }

    // IPv6 private/link-local/loopback ranges
    const ipv6 = ip.toLowerCase();
    if (ipv6 === '::1') return true; // loopback
    if (ipv6.startsWith('fc') || ipv6.startsWith('fd')) return true; // unique local
    if (ipv6.startsWith('fe80:')) return true; // link-local

    return false;
}

async function ensureSafeHost(
    targetUrl: URL,
    allowedHosts: Set<string>,
): Promise<void> {
    const hostname = targetUrl.hostname.toLowerCase();

    if (allowedHosts.size > 0 && !allowedHosts.has(hostname)) {
        throw new Error('Host not allowed');
    }

    // Resolve hostname to IP and ensure it is not private/loopback
    const addresses = await dns.promises.lookup(hostname, { all: true });
    for (const addr of addresses) {
        if (isIpPrivateOrLoopback(addr.address)) {
            throw new Error('Host not allowed');
        }
    }
}

export async function GET(request: NextRequest) {
    try {
        if (process.env.NEXT_PHASE === 'phase-production-build') {
            return new NextResponse('Prerender Skip', { status: 200 });
        }

        await requirePermission('gallery.view');

        const rawUrl = request.nextUrl.searchParams.get('url');
        if (!rawUrl) {
            return NextResponse.json(
                { error: 'Missing url parameter' },
                { status: 400 },
            );
        }

        let targetUrl: URL;
        try {
            targetUrl = new URL(rawUrl);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
            return NextResponse.json(
                { error: 'Unsupported URL protocol' },
                { status: 400 },
            );
        }

        const allowedHosts = getAllowedHosts();

        try {
            await ensureSafeHost(targetUrl, allowedHosts);
        } catch {
            return NextResponse.json(
                { error: 'Host not allowed' },
                { status: 403 },
            );
        }

        // Build a safe base URL using one of the allowed hosts or MINIO endpoint.
        let baseOrigin: string | null = null;
        if (process.env.MINIO_ENDPOINT) {
            try {
                const envUrl = new URL(process.env.MINIO_ENDPOINT);
                baseOrigin = envUrl.origin;
            } catch {
                // ignore invalid MINIO_ENDPOINT, will fall back to allowedHosts
            }
        }

        if (!baseOrigin && allowedHosts.size > 0) {
            const firstAllowedHost = Array.from(allowedHosts)[0];
            const protocol =
                targetUrl.protocol === 'https:' ? 'https:' : 'http:';
            baseOrigin = `${protocol}//${firstAllowedHost}`;
        }

        if (!baseOrigin) {
            return NextResponse.json(
                { error: 'No configured upstream host' },
                { status: 500 },
            );
        }

        const baseUrl = new URL(baseOrigin);
        const finalUrl = new URL(
            targetUrl.pathname + targetUrl.search + targetUrl.hash,
            baseUrl,
        );

        try {
            await ensureSafeHost(finalUrl, allowedHosts);
        } catch {
            return NextResponse.json(
                { error: 'Host not allowed' },
                { status: 403 },
            );
        }

        const upstreamResponse = await fetch(finalUrl.toString(), {
            method: 'GET',
            redirect: 'manual',
            cache: 'no-store',
        });

        if (!upstreamResponse.ok) {
            console.error('Upstream image request failed:', {
                status: upstreamResponse.status,
                url: finalUrl.toString(),
                statusText: upstreamResponse.statusText,
            });
            return NextResponse.json(
                {
                    error: 'Upstream image request failed',
                    status: upstreamResponse.status,
                    url: finalUrl.toString(),
                },
                { status: upstreamResponse.status },
            );
        }

        const headers = new Headers();
        const contentType = upstreamResponse.headers.get('content-type');
        const contentLength = upstreamResponse.headers.get('content-length');
        const etag = upstreamResponse.headers.get('etag');
        const lastModified = upstreamResponse.headers.get('last-modified');

        if (contentType) headers.set('Content-Type', contentType);
        if (contentLength) headers.set('Content-Length', contentLength);
        if (etag) headers.set('ETag', etag);
        if (lastModified) headers.set('Last-Modified', lastModified);
        headers.set('Cache-Control', 'private, no-store, max-age=0');

        return new NextResponse(upstreamResponse.body, {
            status: 200,
            headers,
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.startsWith('Unauthorized:')) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 },
                );
            }

            if (error.message.startsWith('Forbidden:')) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
        }

        console.error('Gallery proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
