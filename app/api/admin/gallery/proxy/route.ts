import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '../../../../../lib/permissions';

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

export async function GET(request: NextRequest) {
    try {
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
        if (
            allowedHosts.size > 0 &&
            !allowedHosts.has(targetUrl.hostname.toLowerCase())
        ) {
            return NextResponse.json(
                { error: 'Host not allowed' },
                { status: 403 },
            );
        }

        const upstreamResponse = await fetch(targetUrl.toString(), {
            method: 'GET',
            redirect: 'follow',
            cache: 'no-store',
        });

        if (!upstreamResponse.ok) {
            return NextResponse.json(
                { error: 'Upstream image request failed' },
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
        console.error('Gallery proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
