'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionHead } from '@/app/components/register/Layout';
import { clock } from '@/app/lib/register-format';
import styles from './wetter.module.css';

const POLL_MS = 5 * 60 * 1000;

type Range = { value: number; time: string };

interface WeatherData {
    location: string;
    elevation: string;
    lastUpdate: string;
    temperature: {
        current: number;
        average: number;
        min: Range;
        max: Range;
    };
    humidity: {
        current: number;
        average: number;
        min: Range;
        max: Range;
    };
    wind: {
        speed: number;
        direction: string;
        degrees: number;
        gusts: number;
    };
    pressure: {
        current: number;
        trend1h: number;
    };
    solar: {
        current: number;
        uvIndex: number;
    };
    precipitation: {
        today: number;
        month: number;
        year: number;
    };
    forecast: string;
}

/**
 * The API escapes its forecast for transport (`&amp;` and friends). The page
 * renders it as text, so the entities have to be turned back into characters
 * once — otherwise the old page's literal `&amp;` shows up in the sentence.
 */
function decodeEntities(value: string): string {
    return value
        .replace(/&#x2F;/gi, '/')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

function fmt(value: number | undefined | null, digits = 1): string {
    if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('de-DE', {
        maximumFractionDigits: digits,
    }).format(value);
}

function signed(value: number, digits = 1): string {
    if (!Number.isFinite(value)) return '—';
    const text = fmt(value, digits);
    return value > 0 ? `+${text}` : text;
}

function trendWord(trend: number): string {
    if (trend > 0) return 'steigend';
    if (trend < 0) return 'fallend';
    return 'unverändert';
}

function measuredAt(range: Range): string | null {
    return range.time ? range.time : null;
}

export default function WetterBoard() {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkedAt, setCheckedAt] = useState<Date | null>(null);

    const load = useCallback(async () => {
        setError(null);
        setRefreshing(true);

        try {
            const response = await fetch('/api/weather', {
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error(`Status ${response.status}`);
            }

            const contentType = response.headers.get('content-type') ?? '';
            if (!contentType.includes('application/json')) {
                throw new Error('Antwort war kein JSON');
            }

            const parsed = (await response.json()) as WeatherData;

            if (!parsed?.temperature || !parsed?.precipitation) {
                throw new Error('Antwort ohne Messwerte');
            }

            setData({
                location: parsed.location,
                elevation: parsed.elevation,
                lastUpdate: parsed.lastUpdate,
                temperature: parsed.temperature,
                humidity: parsed.humidity,
                wind: parsed.wind,
                pressure: {
                    current: parsed.pressure.current,
                    trend1h: parsed.pressure.trend1h,
                },
                solar: parsed.solar,
                precipitation: parsed.precipitation,
                forecast:
                    typeof parsed.forecast === 'string' ? parsed.forecast : '',
            });
            setCheckedAt(new Date());
        } catch (cause) {
            console.error('Wetter: Messwerte nicht geladen', cause);
            setError(
                'Die Wetterstation ist gerade nicht erreichbar. Bitte versuchen Sie es in einem Moment noch einmal.',
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void load();
        const interval = setInterval(() => {
            void load();
        }, POLL_MS);
        return () => clearInterval(interval);
    }, [load]);

    const stand = data?.lastUpdate?.trim();

    return (
        <div>
            <div className={styles.toolbar}>
                <p className="small muted" aria-live="polite">
                    Stand:{' '}
                    <strong>{stand && stand.length > 0 ? stand : 'unbekannt'}</strong>
                    {checkedAt && (
                        <span className="muted">
                            {' '}
                            · abgerufen um {clock(checkedAt)} Uhr
                        </span>
                    )}
                </p>
                <button
                    type="button"
                    className="btn btn--quiet btn--sm"
                    onClick={() => {
                        void load();
                    }}
                    disabled={refreshing || loading}
                >
                    {refreshing || loading
                        ? 'Wird geladen …'
                        : 'Jetzt aktualisieren'}
                </button>
            </div>

            {loading && !data ? (
                <div aria-busy="true" aria-live="polite">
                    <p className="notice">
                        <strong>Wetterdaten werden geladen …</strong>
                        <span>
                            Die Werte kommen von der Wetterstation in
                            Wendessen.
                        </span>
                    </p>
                    <div className={styles.skeletonStack}>
                        <div
                            className={`skeleton ${styles.skeletonRow}`}
                            aria-hidden="true"
                        />
                        <div
                            className={`skeleton ${styles.skeletonRow}`}
                            aria-hidden="true"
                        />
                        <div
                            className={`skeleton ${styles.skeletonRow}`}
                            aria-hidden="true"
                        />
                    </div>
                </div>
            ) : null}

            {error && !data ? (
                <div className="notice notice--error" role="alert">
                    <strong>Wetterdaten nicht geladen</strong>
                    <span>{error}</span>
                    <div style={{ marginTop: 'var(--s2)' }}>
                        <button
                            type="button"
                            className="btn btn--sm"
                            onClick={() => {
                                setLoading(true);
                                void load();
                            }}
                        >
                            Erneut laden
                        </button>
                    </div>
                </div>
            ) : null}

            {error && data ? (
                <div
                    className="notice notice--warn"
                    role="status"
                    style={{ marginBottom: 'var(--s4)' }}
                >
                    <strong>Aktualisierung fehlgeschlagen</strong>
                    <span>
                        Angezeigt werden die zuletzt geladenen Werte. {error}
                    </span>
                </div>
            ) : null}

            {data ? (
                <>
                    <div className="weather-board">
                        <div className="weather-now">
                            <p className="weather-label">
                                {data.location || 'Wendessen'}
                                {data.elevation ? ` · ${data.elevation}` : ''}
                            </p>
                            <p className="weather-temp">
                                {fmt(data.temperature.current)}°C
                            </p>
                            <p className="weather-label">Stand der Messung</p>
                            <p className="num" style={{ margin: 0 }}>
                                {stand && stand.length > 0 ? stand : 'unbekannt'}
                            </p>
                            <p
                                className="small"
                                style={{
                                    color: 'var(--pine-ink-muted)',
                                    marginTop: 'var(--s2)',
                                }}
                            >
                                {data.temperature.min.time
                                    ? `Tief ${fmt(data.temperature.min.value)}°C um ${data.temperature.min.time}`
                                    : `Tief ${fmt(data.temperature.min.value)}°C`}
                                {' · '}
                                {data.temperature.max.time
                                    ? `Hoch ${fmt(data.temperature.max.value)}°C um ${data.temperature.max.time}`
                                    : `Hoch ${fmt(data.temperature.max.value)}°C`}
                            </p>
                        </div>

                        <div className="weather-days">
                            <div className="weather-day">
                                <span className={styles.rowNum}>01</span>
                                <strong>Luftfeuchte</strong>
                                <span className="num">
                                    {fmt(data.humidity.current)} %
                                </span>
                                <span className={styles.rowNote}>
                                    Ø {fmt(data.humidity.average)} %
                                </span>
                            </div>
                            <div className="weather-day">
                                <span className={styles.rowNum}>02</span>
                                <strong>Wind</strong>
                                <span className="num">
                                    {fmt(data.wind.speed)} km/h
                                </span>
                                <span className={styles.rowNote}>
                                    {data.wind.direction}
                                    {Number.isFinite(data.wind.degrees)
                                        ? ` ${fmt(data.wind.degrees, 0)}°`
                                        : ''}
                                    {' · Böen '}
                                    {fmt(data.wind.gusts)} km/h
                                </span>
                            </div>
                            <div className="weather-day">
                                <span className={styles.rowNum}>03</span>
                                <strong>Luftdruck</strong>
                                <span className="num">
                                    {fmt(data.pressure.current)} hPa
                                </span>
                                <span className={styles.rowNote}>
                                    Trend {signed(data.pressure.trend1h)} hPa/h,{' '}
                                    {trendWord(data.pressure.trend1h)}
                                </span>
                            </div>
                            <div className="weather-day">
                                <span className={styles.rowNum}>04</span>
                                <strong>Sonnenstrahlung</strong>
                                <span className="num">
                                    {fmt(data.solar.current, 0)} W/m²
                                </span>
                                <span className={styles.rowNote}>
                                    UV-Index {fmt(data.solar.uvIndex)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <section className="block" aria-labelledby="tageswerte">
                        <SectionHead title="Tageswerte" id="tageswerte" />
                        <table className="data" style={{ marginTop: 'var(--s3)' }}>
                            <caption className="visually-hidden">
                                Temperatur und Luftfeuchte in Wendessen am
                                heutigen Tag
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">Messwert</th>
                                    <th scope="col" className="right">
                                        Minimum
                                    </th>
                                    <th scope="col" className="right">
                                        Maximum
                                    </th>
                                    <th scope="col" className="right">
                                        Mittel
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row" className={styles.rowHead}>
                                        Temperatur
                                    </th>
                                    <td className="right num">
                                        {fmt(data.temperature.min.value)} °C
                                        {measuredAt(data.temperature.min) && (
                                            <span className={styles.time}>
                                                {measuredAt(data.temperature.min)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="right num">
                                        {fmt(data.temperature.max.value)} °C
                                        {measuredAt(data.temperature.max) && (
                                            <span className={styles.time}>
                                                {measuredAt(data.temperature.max)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="right num">
                                        {fmt(data.temperature.average)} °C
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.rowHead}>
                                        Luftfeuchte
                                    </th>
                                    <td className="right num">
                                        {fmt(data.humidity.min.value)} %
                                        {measuredAt(data.humidity.min) && (
                                            <span className={styles.time}>
                                                {measuredAt(data.humidity.min)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="right num">
                                        {fmt(data.humidity.max.value)} %
                                        {measuredAt(data.humidity.max) && (
                                            <span className={styles.time}>
                                                {measuredAt(data.humidity.max)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="right num">
                                        {fmt(data.humidity.average)} %
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="block" aria-labelledby="wind-druck">
                        <SectionHead title="Wind, Luftdruck und Sonne" id="wind-druck" />
                        <table className="data" style={{ marginTop: 'var(--s3)' }}>
                            <caption className="visually-hidden">
                                Wind, Luftdruck und Sonnenstrahlung in Wendessen
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">Messwert</th>
                                    <th scope="col" className="right">
                                        Wert
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row" className={styles.rowHead}>
                                        Wind
                                    </th>
                                    <td className="right num">
                                        {fmt(data.wind.speed)} km/h
                                        <span className={styles.valueNote}>
                                            aus {data.wind.direction}
                                            {Number.isFinite(data.wind.degrees)
                                                ? ` (${fmt(data.wind.degrees, 0)}°)`
                                                : ''}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.rowHead}>
                                        Böen
                                    </th>
                                    <td className="right num">
                                        {fmt(data.wind.gusts)} km/h
                                        <span className={styles.valueNote}>
                                            Spitzenwert der Böen
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.rowHead}>
                                        Luftdruck
                                    </th>
                                    <td className="right num">
                                        {fmt(data.pressure.current)} hPa
                                        <span className={styles.valueNote}>
                                            Trend {signed(data.pressure.trend1h)}{' '}
                                            hPa/h,{' '}
                                            {trendWord(data.pressure.trend1h)}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.rowHead}>
                                        Sonnenstrahlung
                                    </th>
                                    <td className="right num">
                                        {fmt(data.solar.current, 0)} W/m²
                                        <span className={styles.valueNote}>
                                            UV-Index {fmt(data.solar.uvIndex)}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="block" aria-labelledby="niederschlag">
                        <SectionHead title="Niederschlag" id="niederschlag" />
                        <table className="data" style={{ marginTop: 'var(--s3)' }}>
                            <caption className="visually-hidden">
                                Niederschlagsmenge in Wendessen
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">Zeitraum</th>
                                    <th scope="col" className="right">
                                        Menge
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row" className={styles.rowHead}>
                                        Heute
                                    </th>
                                    <td className="right num">
                                        {fmt(data.precipitation.today)} l/m²
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.rowHead}>
                                        Dieser Monat
                                    </th>
                                    <td className="right num">
                                        {fmt(data.precipitation.month)} l/m²
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className={styles.rowHead}>
                                        Dieses Jahr
                                    </th>
                                    <td className="right num">
                                        {fmt(data.precipitation.year)} l/m²
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    <section className="block" aria-labelledby="vorhersage">
                        <SectionHead title="Vorhersage" id="vorhersage" />
                        <p className={`prose ${styles.forecast}`}>
                            {data.forecast
                                ? decodeEntities(data.forecast)
                                : 'Für heute liegt keine Vorhersage vor.'}
                        </p>
                        <p className="small muted">
                            (ohne Gewähr) · Quelle: Wetterstation Wendessen.
                        </p>
                    </section>

                    <p className="small muted" style={{ marginTop: 'var(--s5)' }}>
                        Die Seite fragt die Messwerte alle fünf Minuten neu ab.{' '}
                        <a
                            className="link"
                            href="https://www.wetterstation.ws/2cms/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Zur Wetterstation
                        </a>
                    </p>
                </>
            ) : null}
        </div>
    );
}
