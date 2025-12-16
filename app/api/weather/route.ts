import { NextResponse } from 'next/server';
import { parseWeatherReport } from '@/lib/utils/weather-utils';

const WEATHER_REPORT_URL = 'https://www.wetterstation.ws/cms/iframes/Wetter_aktuell/Text/ws_report.txt';

export async function GET() {
    try {
        const response = await fetch(WEATHER_REPORT_URL, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Weather station returned ${response.status}`);
        }

        const text = await response.text();

        // Parse the weather report on the server
        console.log('Fetched weather report text:', text);
            const weatherData = parseWeatherReport(text);

            // Recursively escape string values to avoid embedding problematic
            // characters (line separators, HTML brackets, control chars) in the JSON
            const escapeString = (s: string) =>
                s
                    .replace(/\u2028/g, '\\u2028')
                    .replace(/\u2029/g, '\\u2029')
                    .replace(/</g, '\\u003C')
                    .replace(/>/g, '\\u003E')
                    .replace(/&/g, '\\u0026')
                    .replace(/[\u0000-\u001F]/g, (c) => {
                        return `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`;
                    });

            const escapeObj = (v: any): any => {
                if (v == null) return v;
                if (typeof v === 'string') return escapeString(v);
                if (Array.isArray(v)) return v.map(escapeObj);
                if (typeof v === 'object') {
                    const out: Record<string, any> = {};
                    for (const [k, val] of Object.entries(v)) {
                        out[k] = escapeObj(val);
                    }
                    return out;
                }
                return v;
            };

            const safe = escapeObj(weatherData);
            const body = JSON.stringify(safe);

            return new NextResponse(body, {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
                },
            });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch weather data' },
            { status: 500 }
        );
    }
}
