export const metadata = {
    title: 'Wir Wendesser - Unsere Dorfgemeinschaft',
    description:
        'Lernen Sie die Menschen kennen, die Wendessen zu dem machen, was es ist - eine lebendige Dorfgemeinschaft von über 1100 Einwohnern.',
};

export default function WirWendesserPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Wendessen_Luftaufnahme.jpg')] bg-cover bg-center opacity-30"></div>
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
                                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H10.42c-.14 0-.25-.11-.25-.25l.03-.12L11.1 11h7.45c.75 0 1.38-.41 1.72-1.01L21.7 4H5.21l-.94-2H1zm7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                Wir Wendesser
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Die Menschen unserer Dorfgemeinschaft
                        </p>
                        <p className="text-xl text-yellow-200 font-semibold mt-4">
                            Vielfalt • Gemeinschaft • Zusammenhalt
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
                    {/* Welcome Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Unsere wachsende Gemeinschaft
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-teal-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            1100 Menschen, die Wendessen zu dem machen, was es
                            ist
                        </p>
                    </div>

                    {/* Statistics Section */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Wendessen wächst
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-emerald-600 to-green-600 mx-auto"></div>
                        </div>

                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
                                <h4 className="text-xl font-bold text-green-800 mb-3 flex items-center">
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
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    Aktuelle Einwohnerzahl
                                </h4>
                                <p className="text-lg">
                                    In Wendessen leben aktuell rund{' '}
                                    <strong>1100 Menschen</strong> - und wir
                                    werden immer mehr.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                                    <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
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
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                        Leipziger Allee
                                    </h4>
                                    <p className="text-gray-700">
                                        An der Leipziger Allee entsteht aktuell
                                        neben dem ehemaligen Hotel Gala ein
                                        Mehrfamilienhaus.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                                    <h4 className="text-lg font-bold text-green-800 mb-3 flex items-center">
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
                                                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21l-1.5 2L21 7H3l1.5-2L3 3h7.5z"
                                            />
                                        </svg>
                                        Neues Baugebiet
                                    </h4>
                                    <p className="text-gray-700">
                                        Im Baugebiet neben der Bahn wird es ab
                                        2024 Platz für fast{' '}
                                        <strong>200 Neu-Wendesser</strong> und{' '}
                                        <strong>Neu-Wendesserinnen</strong>{' '}
                                        geben.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Portrait Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Gesichter unserer Gemeinschaft
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-6"></div>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Kurzportraits, die die Vielfalt unserer
                                Dorfgemeinschaft deutlich machen
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-xl">
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-bold text-foreground mb-4">
                                    Wer sind wir?
                                </h3>
                                <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mb-6"></div>
                            </div>

                            <div className="space-y-6 text-gray-700 leading-relaxed text-center">
                                <p className="text-lg">
                                    Einige von uns wollen wir künftig an dieser
                                    Stelle kurz vorstellen.
                                    <strong>
                                        {' '}
                                        Wer sind sie, was bewegt sie, was
                                        wünschen sie sich?
                                    </strong>
                                </p>

                                <div className="bg-white p-6 rounded-2xl border-2 border-amber-200">
                                    <h4 className="text-xl font-bold text-amber-800 mb-4 flex items-center justify-center">
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
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                        Portraits in Vorbereitung
                                    </h4>
                                    <p className="text-gray-700">
                                        Diese Sektion wird bald mit persönlichen
                                        Geschichten und Portraits unserer
                                        Dorfbewohner gefüllt. Bleiben Sie
                                        gespannt auf die vielfältigen Menschen,
                                        die Wendessen zu ihrem Zuhause gemacht
                                        haben.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 shadow-xl">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-green-700 mb-6">
                                Stellen Sie sich vor!
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto mb-8"></div>

                            <div className="max-w-3xl mx-auto">
                                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                                    Wenn auch Sie Interesse haben, sich hier
                                    vorzustellen, dann schicken Sie doch einfach
                                    ein Foto mit ein paar Textzeilen an:
                                </p>

                                <div className="bg-white p-6 rounded-2xl border-2 border-green-300 shadow-lg">
                                    <div className="flex items-center justify-center space-x-3 mb-4">
                                        <svg
                                            className="w-8 h-8 text-green-600"
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
                                        <a
                                            href="mailto:portrait@wendessen.de"
                                            className="text-2xl font-bold text-green-600 hover:text-green-800 transition-colors"
                                        >
                                            portrait@wendessen.de
                                        </a>
                                    </div>
                                    <p className="text-gray-600">
                                        Wir freuen uns darauf, auch Ihre
                                        Geschichte zu teilen!
                                    </p>
                                </div>

                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
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
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            📸 Foto
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Ein schönes Bild von Ihnen
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            ✍️ Text
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Ein paar Zeilen über Sie
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                                />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                            🤝 Gemeinschaft
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Teil unserer Vielfalt werden
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Community Values */}
                    <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-blue-700 mb-6">
                                Was uns verbindet
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🌟</span>
                                    </div>
                                    <h4 className="text-xl font-semibold text-blue-800 mb-2">
                                        Vielfalt
                                    </h4>
                                    <p className="text-gray-600">
                                        Jeder bringt seine eigene Geschichte mit
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">🤝</span>
                                    </div>
                                    <h4 className="text-xl font-semibold text-indigo-800 mb-2">
                                        Gemeinschaft
                                    </h4>
                                    <p className="text-gray-600">
                                        Zusammen sind wir stärker
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">❤️</span>
                                    </div>
                                    <h4 className="text-xl font-semibold text-purple-800 mb-2">
                                        Zusammenhalt
                                    </h4>
                                    <p className="text-gray-600">
                                        Wendessen ist unser gemeinsames Zuhause
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
