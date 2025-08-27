'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
    location: string;
    elevation: string;
    lastUpdate: string;
    temperature: {
        current: number;
        average: number;
        min: { value: number; time: string };
        max: { value: number; time: string };
    };
    humidity: {
        current: number;
        average: number;
        min: { value: number; time: string };
        max: { value: number; time: string };
    };
    wind: {
        speed: number;
        direction: string;
        degrees: number;
        gusts: number;
    };
    pressure: {
        current: number;
        trend: number;
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

export default function WetterPage() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<string>('');

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true);
                // For now, we'll use mock data since we can't directly fetch from the external URL due to CORS
                // In production, you'd need a backend endpoint to proxy this request
                const mockData = {
                    location: 'Wendessen bei Wolfenbüttel',
                    elevation: '79 m über NN',
                    lastUpdate: 'Mittwoch, 27. August 2025 - 12:15',
                    temperature: {
                        current: 26.5,
                        average: 20.3,
                        min: { value: 15.5, time: '05:30' },
                        max: { value: 26.7, time: '18:00' }
                    },
                    humidity: {
                        current: 50,
                        average: 61,
                        min: { value: 38, time: '16:00' },
                        max: { value: 80, time: '07:45' }
                    },
                    wind: {
                        speed: 3.2,
                        direction: 'W',
                        degrees: 270,
                        gusts: 9.7
                    },
                    pressure: {
                        current: 1008.1,
                        trend: -0.2
                    },
                    solar: {
                        current: 613,
                        uvIndex: 3
                    },
                    precipitation: {
                        today: 0.0,
                        month: 10.0,
                        year: 208.8
                    },
                    forecast: 'veränderlich'
                };
                
                setWeatherData(mockData);
                setLastUpdate(mockData.lastUpdate);
                setError(null);
            } catch (err) {
                setError('Fehler beim Laden der Wetterdaten');
                console.error('Weather fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
        // Refresh every 5 minutes
        const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-600 font-medium">Wetterdaten werden geladen...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Wendessen_Luftaufnahme.jpg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-cyan-500/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-6">
                                <svg
                                    className="w-12 h-12 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                Wetter
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Aktuelle Wetterdaten aus Wendessen
                        </p>
                        <p className="text-xl text-yellow-200 font-semibold mt-4">
                            {weatherData?.location} • {weatherData?.elevation}
                        </p>

                        {/* Decorative elements */}
                        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-yellow-400/50 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="absolute top-1/3 right-32 w-3 h-3 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Last Update */}
                    <div className="text-center mb-12">
                        <div className="bg-white rounded-2xl p-4 shadow-lg inline-block">
                            <p className="text-gray-600">
                                <span className="font-semibold">Letzte Aktualisierung:</span> {lastUpdate}
                            </p>
                        </div>
                    </div>

                    {/* Current Conditions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {/* Temperature */}
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-6 shadow-xl border-l-4 border-orange-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-orange-800">Temperatur</h3>
                                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 0 0 6 0z"/>
                                </svg>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-orange-700 mb-2">
                                    {weatherData?.temperature.current}°C
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div>Min: {weatherData?.temperature.min.value}°C ({weatherData?.temperature.min.time})</div>
                                    <div>Max: {weatherData?.temperature.max.value}°C ({weatherData?.temperature.max.time})</div>
                                    <div>Ø: {weatherData?.temperature.average}°C</div>
                                </div>
                            </div>
                        </div>

                        {/* Humidity */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-xl border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-blue-800">Luftfeuchte</h3>
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-700 mb-2">
                                    {weatherData?.humidity.current}%
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div>Min: {weatherData?.humidity.min.value}% ({weatherData?.humidity.min.time})</div>
                                    <div>Max: {weatherData?.humidity.max.value}% ({weatherData?.humidity.max.time})</div>
                                    <div>Ø: {weatherData?.humidity.average}%</div>
                                </div>
                            </div>
                        </div>

                        {/* Wind */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 shadow-xl border-l-4 border-green-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-green-800">Wind</h3>
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-700 mb-2">
                                    {weatherData?.wind.speed} km/h
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div>Richtung: {weatherData?.wind.direction} ({weatherData?.wind.degrees}°)</div>
                                    <div>Böen: {weatherData?.wind.gusts} km/h</div>
                                </div>
                            </div>
                        </div>

                        {/* Pressure */}
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-6 shadow-xl border-l-4 border-purple-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-purple-800">Luftdruck</h3>
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-700 mb-2">
                                    {weatherData?.pressure.current} hPa
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div className={`${(weatherData?.pressure.trend ?? 0) > 0 ? 'text-green-600' : (weatherData?.pressure.trend ?? 0) < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                        Trend: {(weatherData?.pressure.trend ?? 0) > 0 ? '+' : ''}{weatherData?.pressure.trend ?? 0} hPa/h
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Weather Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {/* Solar Radiation */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Sonnenstrahlung</h3>
                                <div className="text-3xl font-bold text-yellow-600 mb-2">
                                    {weatherData?.solar.current} W/m²
                                </div>
                                <div className="text-lg text-yellow-700">
                                    UV-Index: {weatherData?.solar.uvIndex}
                                </div>
                            </div>
                        </div>

                        {/* Precipitation */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Niederschlag</h3>
                                <div className="space-y-2 text-gray-600">
                                    <div>Heute: <span className="font-semibold">{weatherData?.precipitation.today} l/m²</span></div>
                                    <div>Monat: <span className="font-semibold">{weatherData?.precipitation.month} l/m²</span></div>
                                    <div>Jahr: <span className="font-semibold">{weatherData?.precipitation.year} l/m²</span></div>
                                </div>
                            </div>
                        </div>

                        {/* Forecast */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Vorhersage</h3>
                                <div className="text-lg font-semibold text-indigo-600 capitalize">
                                    {weatherData?.forecast}
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                    (ohne Gewähr)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weather Station Info */}
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-3xl p-8 shadow-lg text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Wetterstation Wendessen</h3>
                        <p className="text-gray-600 mb-4">
                            Die Wetterdaten werden von unserer lokalen Wetterstation in Wendessen erfasst und alle 5 Minuten aktualisiert.
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>79m über NN</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Aktualisierung alle 5 Min.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
