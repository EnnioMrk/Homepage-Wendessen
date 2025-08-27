import Image from 'next/image';

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
                <div className="absolute inset-0 bg-[url('/images/Features/Kleingärten.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-teal-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-6">
                                <svg
                                    className="w-12 h-12 text-green-600"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                                </svg>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                Kleingärtner
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-lime-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Wendessen
                        </p>
                        <p className="text-xl text-lime-200 font-semibold mt-4">
                            Arbeit • Erholung • Gemeinschaft • Natur
                        </p>

                        {/* Decorative elements */}
                        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-lime-400/50 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="absolute top-1/3 right-32 w-3 h-3 bg-lime-400/60 rounded-full animate-bounce delay-300"></div>
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
                                src="/images/Features/Kleingärten.jpeg"
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
                                    <svg
                                        className="w-6 h-6 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
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
                                    <svg
                                        className="w-6 h-6 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
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
                                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 8V4a1 1 0 011-1h4M4 16v4a1 1 0 001 1h4m8-16h4a1 1 0 011 1v4m-4 12h4a1 1 0 001-1v-4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-green-700 mb-3">
                                    58 Gärten
                                </h3>
                                <p className="text-gray-700">
                                    Je ca. 500 m² Grundstücksfläche
                                </p>
                            </div>

                            {/* Utilities */}
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
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
                                </div>
                                <h3 className="text-xl font-bold text-blue-700 mb-3">
                                    Vollausstattung
                                </h3>
                                <p className="text-gray-700">
                                    Wasser- und Stromanschluss in jedem Garten
                                </p>
                            </div>

                            {/* Costs */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        />
                                    </svg>
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
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
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
                                <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17,10.5V7A1,1 0 0,0 16,6H15V4A1,1 0 0,0 14,3H10A1,1 0 0,0 9,4V6H8A1,1 0 0,0 7,7V10.5C7,11.33 7.67,12 8.5,12C9.33,12 10,11.33 10,10.5V8H14V10.5C14,11.33 14.67,12 15.5,12C16.33,12 17,11.33 17,10.5M12,14A1,1 0 0,0 11,15V22H13V15A1,1 0 0,0 12,14Z" />
                                    </svg>
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
                                <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
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
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Gartenzeitung
                                </h4>
                                <p className="text-gray-700">
                                    Regelmäßige Informationen rund um Garten und
                                    Verein
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-lg">
                                <h4 className="font-semibold text-emerald-800 mb-3 flex items-center">
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
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
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
                                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-10 h-10 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
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
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        05331 / 88 57 67
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-green-700 mb-6">
                            Interesse an einem Kleingarten? 🌱
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Kontaktieren Sie uns für weitere Informationen!
                        </p>
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2 text-green-600">
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                                </svg>
                                <span className="font-semibold">
                                    Gärtnern in Wendessen
                                </span>
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M17,10.5V7A1,1 0 0,0 16,6H15V4A1,1 0 0,0 14,3H10A1,1 0 0,0 9,4V6H8A1,1 0 0,0 7,7V10.5C7,11.33 7.67,12 8.5,12C9.33,12 10,11.33 10,10.5V8H14V10.5C14,11.33 14.67,12 15.5,12C16.33,12 17,11.33 17,10.5M12,14A1,1 0 0,0 11,15V22H13V15A1,1 0 0,0 12,14Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
