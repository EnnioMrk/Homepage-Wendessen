import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { parseWeatherReport } from '@/lib/utils/weather-utils';

const WEATHER_REPORT_URL =
    'https://www.wetterstation.ws/cms/iframes/Wetter_aktuell/Text/ws_report.txt';

function getCharsetFromContentType(contentType: string | null): string | null {
    if (!contentType) return null;
    const match = contentType.match(/charset=([^;\s]+)/i);
    return match ? match[1].trim().toLowerCase() : null;
}

function decodeWeatherReport(buffer: ArrayBuffer, contentType: string | null): string {
    const bytes = new Uint8Array(buffer);
    const declaredCharset = getCharsetFromContentType(contentType);

    const decoderCandidates = [
        declaredCharset,
        'windows-1252',
        'iso-8859-1',
        'utf-8',
    ].filter((value): value is string => Boolean(value));

    for (const charset of decoderCandidates) {
        try {
            return new TextDecoder(charset).decode(bytes);
        } catch {
            // try next charset candidate
        }
    }

    return new TextDecoder().decode(bytes);
}

export async function GET() {
    await connection();
    try {
        const response = await fetch(WEATHER_REPORT_URL, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Weather station returned ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const text = decodeWeatherReport(
            buffer,
            response.headers.get('content-type'),
        );

        // Parse the weather report on the server
        console.log('Fetched weather report text:', text);
        const weatherData = parseWeatherReport(text);

        // Sanitize forecast string: remove control chars and escape HTML-sensitive chars
        const sanitize = (s: string | undefined) => {
            if (!s) return '';
            // collapse newlines and trim
            let out = s.replace(/\r?\n|\r/g, ' ').trim();
            // remove other control characters
            out = out.replace(/[\x00-\x1F\x7F]/g, '');
            // escape HTML-sensitive characters to avoid injection when returned in JSON
            const map: Record<string, string> = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
            };
            out = out.replace(/[&<>"'\/]/g, (c) => map[c]);
            return out;
        };

        weatherData.forecast = sanitize(String(weatherData.forecast));
        console.log('Fetched and parsed weather data:', weatherData);

        return NextResponse.json(weatherData, {
            status: 200,
            headers: {
                'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
            },
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch weather data' },
            { status: 500 },
        );
    }
}
