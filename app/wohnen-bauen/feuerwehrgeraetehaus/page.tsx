export const metadata = {
    title: 'Feuerwehrgerätehaus - Wohnen & Bauen in Wendessen',
    description:
        'Neues Feuerwehrgerätehaus in Wendessen am Eckgrundstück Leipziger Allee / Ahlumer Weg. Moderne Unterbringung für unsere Freiwillige Feuerwehr.',
};

export default function FeuerwehrgeraetehausPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-orange-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Features/Freiwillige_Feuerwehr.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-orange-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-6">
                                <svg
                                    className="w-12 h-12 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 3l7 7-7 7-7-7 7-7z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                Feuerwehrgerätehaus
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Neue Heimat für unsere Feuerwehr
                        </p>
                        <p className="text-xl text-yellow-200 font-semibold mt-4">
                            Leipziger Allee / Ahlumer Weg • Spatenstich ab 2025
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
                <div className="max-w-5xl mx-auto">
                    {/* Introduction Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Endlich eine neue Heimat
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Nach vielen Jahren in unzureichender Unterbringung
                            erhält unsere Feuerwehr ein modernes Gerätehaus
                        </p>
                    </div>

                    {/* Project Overview */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
                                    <svg
                                        className="w-6 h-6 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    Neues Feuerwehrgerätehaus am Eckgrundstück
                                </h3>
                                <p className="text-lg">
                                    Die Stadt Wolfenbüttel hat 2021 das
                                    Eckgrundstück Leipziger Allee / Ahlumer Weg
                                    erworben - und dort soll nun unsere
                                    Feuerwehr endlich eine neue Heimat erhalten.
                                </p>
                            </div>

                            <p>
                                Die aktuelle Unterbringung der Feuerwehr in der
                                Alten Schule entspricht schon seit vielen Jahren
                                nicht mehr dem, was notwendig ist. Und darum
                                freut sich ganz Wendessen darauf, dass in einem
                                Neubau den Erfordernissen und Anforderungen
                                Rechnung getragen werden soll.
                            </p>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 p-6 rounded-2xl">
                                <h4 className="text-xl font-bold text-blue-700 mb-3">
                                    📅 Planungsstand
                                </h4>
                                <p>
                                    <strong>Grundstückserwerb:</strong> 2021
                                    durch die Stadt Wolfenbüttel
                                    <br />
                                    <strong>Planungspriorität:</strong> 2.
                                    Stelle nach Halchter
                                    <br />
                                    <strong>Spatenstich:</strong> Nicht vor 2025
                                    <br />
                                    <strong>Status:</strong> In der
                                    Planungsphase der Stadt Wolfenbüttel
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl">
                                <div className="flex items-start space-x-3">
                                    <svg
                                        className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <div>
                                        <h4 className="font-bold text-yellow-800 mb-2">
                                            Aktuelle Situation
                                        </h4>
                                        <p className="text-gray-700">
                                            Die bisherige Unterbringung in der
                                            Alten Schule entspricht seit Jahren
                                            nicht mehr den modernen
                                            Anforderungen an ein
                                            Feuerwehrgerätehaus. Der Neubau wird
                                            zeitgemäße Bedingungen für unsere
                                            ehrenamtlichen Feuerwehrleute
                                            schaffen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Features */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Standort & Vorteile
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-red-800 mb-3">
                                    Zentrale Lage
                                </h3>
                                <p className="text-gray-700">
                                    Eckgrundstück Leipziger Allee / Ahlumer Weg
                                    - optimal für schnelle Einsatzbereitschaft
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-blue-800 mb-3">
                                    Moderne Ausstattung
                                </h3>
                                <p className="text-gray-700">
                                    Neubau nach aktuellen Standards mit
                                    zeitgemäßer Fahrzeughalle und Ausrüstung
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                <h3 className="text-xl font-bold text-green-800 mb-3">
                                    Bessere Bedingungen
                                </h3>
                                <p className="text-gray-700">
                                    Angemessene Räumlichkeiten für Training,
                                    Ausbildung und Kameradschaft
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Development */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Weitere Entwicklung
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-6"></div>
                            <p className="text-lg text-gray-600">
                                Zusätzliche Wohnprojekte in der Nähe
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-emerald-800 mb-3 flex items-center">
                                    <svg
                                        className="w-6 h-6 mr-3"
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
                                    Mehrfamilienhaus zwischen
                                    Feuerwehrgerätehaus und Hotel Gala
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-lg">
                                        Zwischen dem künftigen
                                        Feuerwehrgerätehaus und dem ehemaligen
                                        Hotel Gala errichtet ein privater
                                        Investor aktuell ein Mehrfamilienhaus.
                                    </p>
                                    <div className="bg-white border border-emerald-200 p-4 rounded-xl">
                                        <h4 className="font-bold text-emerald-700 mb-2">
                                            Projektdetails:
                                        </h4>
                                        <ul className="space-y-1 text-gray-700">
                                            <li>
                                                • <strong>6 Wohnungen</strong> à
                                                90 Quadratmeter
                                            </li>
                                            <li>
                                                • <strong>Erste Mieter:</strong>{' '}
                                                Anfang 2024
                                            </li>
                                            <li>
                                                • <strong>Investor:</strong>{' '}
                                                Privat
                                            </li>
                                            <li>
                                                • <strong>Status:</strong>{' '}
                                                Aktuell im Bau
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Zeitplan
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-green-800">
                                            2021 - Grundstückserwerb
                                        </h4>
                                        <p className="text-gray-700">
                                            Stadt Wolfenbüttel erwirbt
                                            Eckgrundstück Leipziger Allee /
                                            Ahlumer Weg
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-800">
                                            2022-2024 - Planungsphase
                                        </h4>
                                        <p className="text-gray-700">
                                            Projekt steht an 2. Stelle in der
                                            Stadtplanung nach Halchter
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-yellow-800">
                                            Ab 2025 - Baubeginn
                                        </h4>
                                        <p className="text-gray-700">
                                            Spatenstich für das neue
                                            Feuerwehrgerätehaus
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border-l-4 border-gray-400">
                                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
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
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-700">
                                            2026-2027 - Fertigstellung
                                        </h4>
                                        <p className="text-gray-700">
                                            Neue Heimat für die Freiwillige
                                            Feuerwehr Wendessen
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-red-700 mb-6">
                            Eine neue Ära für unsere Feuerwehr! 🚒
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Nach Jahren in unzureichender Unterbringung endlich
                            moderne Bedingungen für unsere Helden
                        </p>
                        <div className="flex justify-center mt-6">
                            <div className="flex items-center space-x-2 text-red-600">
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
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                <span className="font-semibold">
                                    Für die Sicherheit von Wendessen
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
