'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import {
    Cloud,
    Thermometer,
    Drop,
    Wind,
    TrendUp,
    Sun,
    CloudRain,
    Calendar,
    MapPin,
    Clock,
    Warning,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/PageHeader';

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
                        max: { value: 26.7, time: '18:00' },
                    },
                    humidity: {
                        current: 50,
                        average: 61,
                        min: { value: 38, time: '16:00' },
                        max: { value: 80, time: '07:45' },
                    },
                    wind: {
                        speed: 3.2,
                        direction: 'W',
                        degrees: 270,
                        gusts: 9.7,
                    },
                    pressure: {
                        current: 1008.1,
                        trend: -0.2,
                    },
                    solar: {
                        current: 613,
                        uvIndex: 3,
                    },
                    precipitation: {
                        today: 0.0,
                        month: 10.0,
                        year: 208.8,
                    },
                    forecast: 'veränderlich',
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
            <div className="bg-white rounded-lg shadow-lg p-6">
                <LoadingSpinner
                    size="xl"
                    text="Wetterdaten werden geladen..."
                    centered
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 mb-4">
                        <Warning className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <PageHeader
                title="Wetter"
                subtitle={`Aktuelle Wetterdaten aus Wendessen`}
                icon={<Cloud />}
                backgroundImage="/images/Wendessen_Luftaufnahme.jpg"
                color="blue"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Last Update */}
                    <div className="text-center mb-12">
                        <div className="bg-white rounded-2xl p-4 shadow-lg inline-block">
                            <p className="text-gray-600">
                                <span className="font-semibold">
                                    Letzte Aktualisierung:
                                </span>{' '}
                                {lastUpdate}
                            </p>
                        </div>
                    </div>

                    {/* Current Conditions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {/* Temperature */}
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-6 shadow-xl border-l-4 border-orange-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-orange-800">
                                    Temperatur
                                </h3>
                                <Thermometer className="w-8 h-8 text-orange-600" />
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-orange-700 mb-2">
                                    {weatherData?.temperature.current}°C
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div>
                                        Min:{' '}
                                        {weatherData?.temperature.min.value}°C (
                                        {weatherData?.temperature.min.time})
                                    </div>
                                    <div>
                                        Max:{' '}
                                        {weatherData?.temperature.max.value}°C (
                                        {weatherData?.temperature.max.time})
                                    </div>
                                    <div>
                                        Ø: {weatherData?.temperature.average}°C
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Humidity */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 shadow-xl border-l-4 border-blue-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-blue-800">
                                    Luftfeuchte
                                </h3>
                                <Drop className="w-8 h-8 text-blue-600" />
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-blue-700 mb-2">
                                    {weatherData?.humidity.current}%
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div>
                                        Min: {weatherData?.humidity.min.value}%
                                        ({weatherData?.humidity.min.time})
                                    </div>
                                    <div>
                                        Max: {weatherData?.humidity.max.value}%
                                        ({weatherData?.humidity.max.time})
                                    </div>
                                    <div>
                                        Ø: {weatherData?.humidity.average}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wind */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 shadow-xl border-l-4 border-green-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-green-800">
                                    Wind
                                </h3>
                                <Wind className="w-8 h-8 text-green-600" />
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-700 mb-2">
                                    {weatherData?.wind.speed} km/h
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div>
                                        Richtung: {weatherData?.wind.direction}{' '}
                                        ({weatherData?.wind.degrees}°)
                                    </div>
                                    <div>
                                        Böen: {weatherData?.wind.gusts} km/h
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pressure */}
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-6 shadow-xl border-l-4 border-purple-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-purple-800">
                                    Luftdruck
                                </h3>
                                <TrendUp className="w-8 h-8 text-purple-600" />
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-700 mb-2">
                                    {weatherData?.pressure.current} hPa
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                    <div
                                        className={`${
                                            (weatherData?.pressure.trend ?? 0) >
                                            0
                                                ? 'text-green-600'
                                                : (weatherData?.pressure
                                                      .trend ?? 0) < 0
                                                ? 'text-red-600'
                                                : 'text-gray-600'
                                        }`}
                                    >
                                        Trend:{' '}
                                        {(weatherData?.pressure.trend ?? 0) > 0
                                            ? '+'
                                            : ''}
                                        {weatherData?.pressure.trend ?? 0} hPa/h
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
                                    <Sun className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                    Sonnenstrahlung
                                </h3>
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
                                    <CloudRain className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                    Niederschlag
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <div>
                                        Heute:{' '}
                                        <span className="font-semibold">
                                            {weatherData?.precipitation.today}{' '}
                                            l/m²
                                        </span>
                                    </div>
                                    <div>
                                        Monat:{' '}
                                        <span className="font-semibold">
                                            {weatherData?.precipitation.month}{' '}
                                            l/m²
                                        </span>
                                    </div>
                                    <div>
                                        Jahr:{' '}
                                        <span className="font-semibold">
                                            {weatherData?.precipitation.year}{' '}
                                            l/m²
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Forecast */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                    Vorhersage
                                </h3>
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
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Wetterstation Wendessen
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Die Wetterdaten werden von unserer lokalen
                            Wetterstation in Wendessen erfasst und alle 5
                            Minuten aktualisiert.
                        </p>
                        <p className="text-gray-600 mb-4">
                            <a
                                href="https://www.wetterstation.ws/2cms/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                https://www.wetterstation.ws/2cms/
                            </a>
                        </p>
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>79m über NN</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Aktualisierung alle 5 Min.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
