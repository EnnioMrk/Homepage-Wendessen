import Link from 'next/link';
import BackButton from './components/BackButton';
import {
    GearSix,
    Stack,
    Lightning,
    House,
    Buildings,
    UsersThree,
    EnvelopeSimple,
} from '@phosphor-icons/react/dist/ssr';

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
                        <GearSix className="w-16 h-16 text-white" />
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
                            <Stack className="w-6 h-6" />
                            <span className="font-medium">Im Aufbau</span>
                        </div>
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="flex items-center space-x-2 text-yellow-600">
                            <Lightning className="w-6 h-6" />
                            <span className="font-medium">Bald verfügbar</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            <House className="w-5 h-5 mr-2" />
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
                                        <Buildings className="w-5 h-5 text-green-600 group-hover:text-orange-600" />
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
                                        <UsersThree className="w-5 h-5 text-blue-600 group-hover:text-orange-600" />
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
                                        <EnvelopeSimple className="w-5 h-5 text-purple-600 group-hover:text-orange-600" />
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
                            Diese Website wird kontinuierlich erweitert und
                            verbessert
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
