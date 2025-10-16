import Image from 'next/image';
import {
    Flower,
    ArrowsOutSimple,
    Lightning,
    Smiley,
    Plant,
    UsersThree,
    FileText,
    Shield,
    User,
    Phone,
    Buildings,
    Heart,
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
    title: 'Kleingärtner Wendessen - Dorfleben',
    description:
        'Kleingärtner Wendessen - 58 Gärten mit je 500 m² für Arbeit und Erholung. Sozialverträgliche Kosten mit Wasser- und Stromanschluss.',
};

export default function KleingaertnerPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Vereinsleben/Kleingärten.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-teal-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-4 sm:mr-6 flex-shrink-0">
                                <Plant className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                                Kleingärtnerverein
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-lime-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Wendessen
                        </p>
                        <p className="text-xl text-lime-200 font-semibold mt-4">
                            Arbeit • Erholung • Gemeinschaft • Natur
                        </p>

                        {/* Decorative elements - hidden on mobile */}
                        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 border-2 border-lime-400/50 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="hidden md:block absolute top-1/3 right-32 w-3 h-3 bg-lime-400/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Image Section */}
                    <div className="text-center mb-16">
                        <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-green-100">
                            <Image
                                src="/images/Vereinsleben/Kleingärten.jpeg"
                                alt="Kleingärten Wendessen - Gartenanlage für Erholung und Arbeit"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h2 className="text-3xl font-bold mb-2">
                                    58 Kleingärten in Wendessen
                                </h2>
                                <p className="text-lg">
                                    Je ca. 500 m² für Ihre ganz persönliche
                                    Erholung
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Introduction */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Willkommen bei den Kleingärtnern
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Freude am eigenen Obst und Gemüse für jung und alt
                        </p>
                    </div>

                    {/* Garden Information */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-8">
                            {/* Garden Details */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-green-800 mb-3 flex items-center">
                                    <Buildings className="w-6 h-6 mr-2" />
                                    Unsere Gartenanlage
                                </h3>
                                <p className="text-lg text-green-800">
                                    Unsere <strong>58 Gärten</strong> haben
                                    jeweils eine Größe von ca.{' '}
                                    <strong>500 m²</strong>. Die Gärten haben
                                    durchweg{' '}
                                    <strong>Wasser- und Stromanschluss</strong>.
                                    Die Kosten (Pacht und Beitrag) sind{' '}
                                    <strong>sozialverträglich</strong> und
                                    beinhalten u.a. unsere Gartenzeitung und
                                    eine Unfallversicherung.
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
                                    <Heart className="w-6 h-6 mr-2" />
                                    Vorteile für jung und alt
                                </h3>
                                <p className="text-blue-800">
                                    Die Arbeit und Erholung im Kleingarten
                                    bietet viele Vorteile für jung und alt.
                                    Neben der{' '}
                                    <strong>körperlichen Betätigung</strong> ist
                                    es vor allem die{' '}
                                    <strong>
                                        Freude am eigenen Obst und Gemüse
                                    </strong>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Was wir bieten
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Garden Size */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <ArrowsOutSimple className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-green-700 mb-3">
                                    58 Gärten
                                </h3>
                                <p className="text-gray-700">
                                    Je ca. 500 m² Grundstücksfläche
                                </p>
                            </div>
                            {/* Utilities */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Lightning className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-700 mb-3">
                                    Vollausstattung
                                </h3>
                                <p className="text-gray-700">
                                    Wasser- und Stromanschluss in jedem Garten
                                </p>
                            </div>{' '}
                            {/* Costs */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Plant className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-purple-700 mb-3">
                                    Sozialverträglich
                                </h3>
                                <p className="text-gray-700">
                                    Faire Pacht- und Beitragskosten
                                </p>
                            </div>
                            {/* Activities */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Smiley className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-orange-700 mb-3">
                                    Körperliche Betätigung
                                </h3>
                                <p className="text-gray-700">
                                    Gesunde Bewegung an der frischen Luft
                                </p>
                            </div>
                            {/* Harvest */}
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Plant className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-yellow-700 mb-3">
                                    Eigene Ernte
                                </h3>
                                <p className="text-gray-700">
                                    Freude am selbst angebauten Obst und Gemüse
                                </p>
                            </div>
                            {/* Community */}
                            <div className="bg-gradient-to-br from-teal-50 to-green-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <UsersThree className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-teal-700 mb-3">
                                    Gemeinschaft
                                </h3>
                                <p className="text-gray-700">
                                    Zusammenhalt unter Gartenfreunden
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Included Services */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Im Beitrag enthalten
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-lg">
                                <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Gartenzeitung
                                </h4>
                                <p className="text-gray-700">
                                    Regelmäßige Informationen rund um Garten und
                                    Verein
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-lg">
                                <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
                                    <Shield className="w-5 h-5 mr-2" />
                                    Unfallversicherung
                                </h4>
                                <p className="text-gray-700">
                                    Schutz bei Unfällen während der Gartenarbeit
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Ansprechpartner
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600">
                            Ihr Kontakt für alle Fragen rund um die Kleingärten
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        {/* Contact Person */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-green-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">
                                    1. Vorsitzender
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Felix Siebert
                                </h3>
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                                    <a
                                        href="tel:0533188667"
                                        className="flex items-center justify-center text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        05331 / 88 57 67
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-green-700 mb-6">
                            Interesse an einem Kleingarten?
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Kontaktieren Sie uns für weitere Informationen!
                        </p>
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2 text-green-600">
                                <Plant className="w-6 h-6" />
                                <span className="font-semibold">
                                    Gärtnern in Wendessen
                                </span>
                                <Flower className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
