import Link from 'next/link';
import BackButton from './components/BackButton';

export const metadata = {
    title: 'Seite nicht gefunden - Wendessen',
    description:
        'Die angeforderte Seite wurde nicht gefunden. Wendessen wird stetig erweitert.',
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-4 text-center">
                {/* Construction Icon */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <svg
                            className="w-16 h-16 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                            />
                        </svg>
                    </div>
                    {/* Animated dots */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full animate-bounce"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-300"></div>
                    <div className="absolute top-4 -left-4 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-6xl md:text-8xl font-bold text-orange-500">
                            404
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                            Seite im Aufbau
                        </h2>
                    </div>

                    <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-yellow-500 mx-auto"></div>

                    <div className="max-w-2xl mx-auto space-y-4">
                        <p className="text-xl text-gray-600 leading-relaxed">
                            Diese Seite befindet sich noch im Aufbau oder wurde
                            nicht gefunden.
                        </p>
                        <p className="text-lg text-gray-500">
                            Wendessen wird stetig erweitert - schauen Sie gerne
                            bald wieder vorbei!
                        </p>
                    </div>

                    {/* Construction Elements */}
                    <div className="flex items-center justify-center space-x-8 my-12">
                        <div className="flex items-center space-x-2 text-orange-600">
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span className="font-medium">Im Aufbau</span>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="flex items-center space-x-2 text-yellow-600">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                            <span className="font-medium">Bald verfügbar</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Zur Startseite
                        </Link>
                        <BackButton />
                    </div>

                    {/* Available Sections */}
                    <div className="mt-16 p-8 bg-white rounded-3xl shadow-xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">
                            Verfügbare Bereiche
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link
                                href="/dorfleben"
                                className="group p-4 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                        <svg
                                            className="w-5 h-5 text-green-600 group-hover:text-orange-600"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800 group-hover:text-orange-700">
                                            Dorfleben
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Ortsrat, Vereine & mehr
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/wir-wendesser"
                                className="group p-4 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                        <svg
                                            className="w-5 h-5 text-blue-600 group-hover:text-orange-600"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800 group-hover:text-orange-700">
                                            Wir Wendesser
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Unsere Gemeinschaft
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/kontakt"
                                className="group p-4 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                        <svg
                                            className="w-5 h-5 text-purple-600 group-hover:text-orange-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800 group-hover:text-orange-700">
                                            Kontakt
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Ansprechpartner
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 text-sm">
                            💻 Diese Website wird kontinuierlich erweitert und
                            verbessert
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
