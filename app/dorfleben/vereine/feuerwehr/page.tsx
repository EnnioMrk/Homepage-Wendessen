export const metadata = {
    title: 'Freiwillige Feuerwehr Wendessen - Vereine',
    description:
        'Die Freiwillige Feuerwehr Wendessen - Retten, Löschen, Bergen, Schützen. Werden Sie Teil unserer Gemeinschaft!',
};

export default function FeuerwehrPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-red-600 via-orange-600 to-red-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Features/Freiwillige_Feuerwehr.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-orange-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-6">
                                <svg
                                    className="w-12 h-12 text-red-600"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                Feuerwehr
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Freiwillige Feuerwehr Wendessen
                        </p>
                        <p className="text-xl text-yellow-200 font-semibold mt-4">
                            Retten • Löschen • Bergen • Schützen
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
                            Herzlich Willkommen
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Werden Sie Teil unserer Gemeinschaft und helfen Sie
                            mit, Wendessen sicher zu halten
                        </p>
                    </div>

                    {/* Main Message */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-r-2xl">
                                <p className="text-lg">
                                    Auch wir, die{' '}
                                    <strong>
                                        &quot;Freiwillige Feuerwehr
                                        Wendessen&quot;
                                    </strong>
                                    , möchten auf diesem Wege alle neuen Bürger,
                                    die sich hier bei uns im schönen Wendessen
                                    ein neues Zuhause geschaffen haben, recht
                                    herzlich begrüßen.
                                </p>
                            </div>

                            <p>
                                Wie wichtig eine schlagkräftige Feuerwehr ist,
                                braucht Ihnen als &quot;Häuslebauer&quot; sicher
                                niemand erzählen. Wer möchte nicht, dass im
                                Notfall – sei mal der Keller unter Wasser oder
                                der Holzschuppen brennt – eine fachkundige und
                                helfende Hand schnell zur Stelle ist. Und auch
                                wenn dies selbstverständlich der Fall ist, so
                                bleibt eines jedoch festzustellen: unser Dorf
                                wächst und somit nimmt auch die Zahl der zu
                                beschützenden Bürger stetig zu. Da bleibt es
                                nicht aus, dass auch wir, die Feuerwehr, wachsen
                                wollen und müssen!
                            </p>

                            <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-2 border-red-500 p-8 rounded-2xl">
                                <h3 className="text-2xl font-bold text-red-700 mb-4 flex items-center">
                                    <svg
                                        className="w-8 h-8 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                    Darum unsere Bitte an Sie:
                                </h3>
                                <p className="text-lg">
                                    <strong>
                                        Werden auch Sie Feuerwehrfrau oder
                                        Feuerwehrmann!
                                    </strong>{' '}
                                    Tragen auch Sie dazu bei, dass der
                                    &quot;Rote Hahn&quot; in Wendessen weiterhin
                                    keine Chance hat und wir weiterhin so
                                    schlagkräftig bleiben. Werden Sie Mitglied
                                    in einer der größten ehrenamtlichen
                                    Organisationen Deutschlands. Immerhin sind
                                    deutschlandweit über 1.000.000 Kameraden
                                    ehrenamtlich in der Feuerwehr organisiert!
                                </p>
                            </div>

                            <p>
                                Nutzen Sie die Möglichkeit, sich sinnvoll in das
                                aktive Dorfgeschehen mit einzubringen und somit
                                Land und Leute besser und schneller kennen zu
                                lernen. Sollte es Ihnen aus welchen Gründen auch
                                immer nicht möglich sein, sich aktiv an unserem
                                Dienstgeschehen zu beteiligen, so freuen wir uns
                                natürlich auch über eine fördernde
                                Mitgliedschaft.
                            </p>
                        </div>
                    </div>

                    {/* Activities Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Unsere Aktivitäten
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center">
                                    <svg
                                        className="w-8 h-8 mr-3"
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
                                    Hauptaufgaben
                                </h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                        <strong>Retten</strong> - Menschen und
                                        Tiere aus Notlagen befreien
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                        <strong>Löschen</strong> - Brände
                                        bekämpfen und eindämmen
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                                        <strong>Bergen</strong> - Sachgüter vor
                                        Schäden bewahren
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                                        <strong>Schützen</strong> - Gefahren
                                        abwenden
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
                                    <svg
                                        className="w-8 h-8 mr-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zM3 9a2 2 0 012-2h14a2 2 0 012 2v2H3V9z"
                                        />
                                    </svg>
                                    Gemeinschaftsaktivitäten
                                </h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                        Braunkohl-Wanderungen
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                                        Tagesfahrten und Ausflüge
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                                        Osterfeuer
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                                        Gemeinschaftsveranstaltungen mit anderen
                                        Vereinen
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Service Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Besuchen Sie uns!
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
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
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Dienstzeiten
                                </h4>
                                <p className="text-gray-700 mb-4">
                                    Besuchen Sie einmal den Feuerwehr-Dienst
                                    unserer Feuerwehrkameradinnen und -kameraden
                                    und informieren Sie sich dort über alles
                                    weitere.
                                </p>
                                <div className="bg-white p-4 rounded-xl border border-blue-200">
                                    <p className="font-semibold text-blue-800">
                                        Jeden Freitag in den geraden
                                        Kalenderwochen
                                    </p>
                                    <p className="text-blue-600">
                                        ab 18:30 Uhr
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
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
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    Treffpunkt
                                </h4>
                                <p className="text-gray-700 mb-4">
                                    Unser Feuerwehrgerätehaus finden Sie im
                                    alten Dorfkern nahe der Kirche.
                                </p>
                                <div className="bg-white p-4 rounded-xl border border-blue-200">
                                    <p className="font-semibold text-blue-800">
                                        Feuerwehrgerätehaus
                                    </p>
                                    <p className="text-blue-600">
                                        Kirchring / Schustergasse
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Ansprechpartner
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600">
                            Ihre direkten Kontakte bei der Freiwilligen
                            Feuerwehr Wendessen
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Ortsbrandmeister */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-red-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
                                <p className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">
                                    Ortsbrandmeister
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Kai Brackmann
                                </h3>
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl">
                                    <a
                                        href="tel:01575454517195"
                                        className="flex items-center justify-center text-red-600 hover:text-red-700 transition-colors"
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
                                        0157/54517195
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Stellvertretender Ortsbrandmeister */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-orange-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
                                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-2">
                                    stellv. Ortsbrandmeister
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Olaf Glaeske
                                </h3>
                                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl">
                                    <a
                                        href="tel:053318049931"
                                        className="flex items-center justify-center text-orange-600 hover:text-orange-700 transition-colors"
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
                                        05331 / 8049931
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-red-700 mb-6">
                            Wir freuen uns auf Ihren Besuch!
                        </h3>
                        <p className="text-xl text-gray-700 font-medium">
                            Ihre Freiwillige Feuerwehr Wendessen
                        </p>
                        <div className="flex justify-center mt-6">
                            <div className="flex items-center space-x-2 text-red-600">
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                                <span className="font-semibold">
                                    Dem &quot;Roten Hahn&quot; keine Chance!
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
