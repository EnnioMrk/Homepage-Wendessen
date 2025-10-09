import Image from 'next/image';
import {
    Buildings,
    MapPin,
    House,
    Lightning,
    Train,
    Shield,
    Phone,
    EnvelopeSimple,
    DownloadSimple,
    FileText,
    Calendar,
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
    title: 'Neubaugebiet Leipziger Allee - Wohnen & Bauen in Wendessen',
    description:
        'Neues Baugebiet in Wendessen auf dem Gelände der ehemaligen Zuckerfabrik. Moderne Wohnkonzepte am künftigen Bahnhaltepunkt.',
};

export default function NeubaugebietPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Wendessen_Luftaufnahme.jpg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-teal-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6 gap-4 sm:gap-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl flex-shrink-0">
                                <Buildings className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-emerald-600" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white">
                                Neubaugebiet
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Leipziger Allee - Zukunft des Wohnens
                        </p>
                        <p className="text-base sm:text-lg md:text-xl text-yellow-200 font-semibold mt-4">
                            Moderne Wohnkonzepte • Bahnhaltepunkt •
                            Nachhaltigkeit
                        </p>

                        {/* Decorative elements */}
                        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 border-2 border-yellow-400/50 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="hidden md:block absolute top-1/3 right-32 w-3 h-3 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Introduction Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Wendessen wächst
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-6"></div>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Auf dem Gelände der ehemaligen Zuckerfabrik entsteht
                            Raum für modernes Wohnen
                        </p>
                    </div>

                    {/* Project Overview */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-emerald-800 mb-3 flex items-center">
                                    <MapPin className="w-6 h-6 mr-3" />
                                    Neues Baugebiet am Bahnhaltepunkt
                                </h3>
                                <p className="text-lg">
                                    In Wendessen entsteht auf dem Gelände der
                                    ehemaligen Zuckerfabrik am künftigen
                                    Bahnhaltepunkt ein neues Baugebiet.
                                </p>
                            </div>

                            <p>
                                Die planungsrechtlichen Schritte für die
                                Erschließung und Bebauung des Geländes werden
                                von der Stadt Wolfenbüttel erledigt. Mit einer
                                Bebauung ist frühestens Ende 2023 zu rechnen.
                            </p>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 p-6 rounded-2xl">
                                <h4 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                                    <Calendar className="w-6 h-6 mr-2" />
                                    Zeitplan
                                </h4>
                                <p>
                                    <strong>Planungsphase:</strong> Aktuell
                                    laufend durch die Stadt Wolfenbüttel
                                    <br />
                                    <strong>Baubeginn:</strong> Frühestens Ende
                                    2023
                                    <br />
                                    <strong>Status:</strong> Planungsrechtliche
                                    Schritte in Bearbeitung
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Development Plans */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Bebauungsplan
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 mx-auto mb-6"></div>
                            <p className="text-base sm:text-lg text-gray-600">
                                Erste Eindrücke der möglichen künftigen
                                Gestaltung
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="relative w-full mb-8">
                                <Image
                                    src="/images/Bebauungsplan_PB_4_Leipziger-Allee.webp"
                                    alt="Bebauungsplan PB 4 Leipziger Allee - Neubaugebiet Wendessen"
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto rounded-2xl shadow-lg"
                                    priority
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Bebauungsplan PB 4
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl">
                                <div className="flex items-start space-x-3">
                                    <Shield className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-yellow-800 mb-2">
                                            Wichtiger Hinweis
                                        </h4>
                                        <p className="text-gray-700">
                                            Die dargestellten Grafiken zeigen
                                            erste Eindrücke der möglichen
                                            künftigen Gestaltung des Geländes
                                            und sind aktuell{' '}
                                            <strong>
                                                noch nicht rechtsverbindlich
                                            </strong>
                                            .
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <a
                                    href="/pdfs/Bebauungsplan_PB_4_Leipziger-Allee.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    <DownloadSimple className="w-5 h-5 mr-2" />
                                    Bebauungsplan PDF herunterladen
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Project Features */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Projektmerkmale
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lightning className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-emerald-800 mb-3">
                                    Zukunftsorientiert
                                </h3>
                                <p className="text-gray-700">
                                    Entwicklung auf dem Gelände der ehemaligen
                                    Zuckerfabrik mit modernen Wohnkonzepten
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Train className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-800 mb-3">
                                    Verkehrsanbindung
                                </h3>
                                <p className="text-gray-700">
                                    Optimale Lage am künftigen Bahnhaltepunkt
                                    für beste Erreichbarkeit
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-purple-800 mb-3">
                                    Professionell geplant
                                </h3>
                                <p className="text-gray-700">
                                    Planungsrechtliche Betreuung durch die Stadt
                                    Wolfenbüttel
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Ansprechpartner
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-6"></div>
                        <p className="text-base sm:text-lg text-gray-600">
                            Ihr Kontakt für Rückfragen zum Projekt
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Investor Contact */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-emerald-500">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <House className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    Investor & Eigentümer
                                </h3>
                                <p className="text-lg font-semibold text-emerald-600 mb-4">
                                    MGM Management GbR
                                </p>
                                <div className="space-y-3 text-gray-600">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            Stephan Malonnek
                                        </p>
                                        <p className="text-sm">
                                            Ansprechpartner
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Phone className="w-5 h-5 text-emerald-500" />
                                        <a
                                            href="tel:051137359373"
                                            className="text-emerald-600 hover:text-emerald-800 transition-colors"
                                        >
                                            0511-37359373
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <EnvelopeSimple className="w-5 h-5 text-emerald-500" />
                                        <a
                                            href="mailto:stephan.malonnek@mgm-management.de"
                                            className="text-emerald-600 hover:text-emerald-800 transition-colors"
                                        >
                                            stephan.malonnek@mgm-management.de
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Planning Authority */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-blue-500">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    Planungsrechtliche Betreuung
                                </h3>
                                <p className="text-lg font-semibold text-blue-600 mb-4">
                                    Stadt Wolfenbüttel
                                </p>
                                <div className="space-y-3 text-gray-600">
                                    <div className="bg-blue-50 p-4 rounded-xl">
                                        <p className="font-semibold text-blue-800">
                                            Zuständigkeiten:
                                        </p>
                                        <ul className="text-sm mt-2 space-y-1 text-left">
                                            <li>• Erschließungsplanung</li>
                                            <li>• Bebauungsplan</li>
                                            <li>• Genehmigungsverfahren</li>
                                            <li>
                                                • Rechtliche Rahmenbedingungen
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-700 mb-6">
                            Wendessen wächst weiter!
                        </h3>
                        <p className="text-lg sm:text-xl text-gray-700 font-medium mb-4">
                            Neues Wohnen am Bahnhaltepunkt - Modern, nachhaltig,
                            zukunftsorientiert
                        </p>
                            <div className="flex justify-center mt-6">
                                <div className="flex items-center space-x-2 text-emerald-600">
                                    <Lightning className="w-6 h-6" />
                                <span className="font-semibold">
                                    Die Zukunft des Wohnens in Wendessen
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
