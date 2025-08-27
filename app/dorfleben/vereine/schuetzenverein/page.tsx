export const metadata = {
    title: 'Schützenverein Wendessen e.V. - Dorfleben',
    description:
        'Schützenverein Wendessen e.V. - Sportliche Heimat für über 50 Mitglieder. Schießsport für Kinder, Jugendliche, Frauen und Männer.',
};

export default function SchuetzenvereinsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-red-700 via-orange-600 to-yellow-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-700/90 to-yellow-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-6">
                                <svg
                                    className="w-12 h-12 text-red-700"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21A7,7 0 0,1 14,26H10A7,7 0 0,1 3,19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M12,4.5A0.5,0.5 0 0,0 11.5,4A0.5,0.5 0 0,0 12,3.5A0.5,0.5 0 0,0 12.5,4A0.5,0.5 0 0,0 12,4.5Z" />
                                </svg>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                Schützenverein
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Wendessen e.V.
                        </p>
                        <p className="text-xl text-yellow-200 font-semibold mt-4">
                            Sport • Tradition • Gemeinschaft • Familie
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
                    {/* Introduction */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Willkommen beim Schützenverein
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Sportliche Heimat für über 50 Mitglieder
                        </p>
                    </div>

                    {/* Website Notice */}
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 p-6 rounded-r-2xl mb-16">
                        <div className="flex items-center mb-3">
                            <svg
                                className="w-6 h-6 mr-2 text-orange-600"
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
                            <h3 className="text-xl font-semibold text-orange-800">
                                Website im Umbau
                            </h3>
                        </div>
                        <p className="text-orange-800">
                            Unsere WebSite befindet sich derzeit gerade im
                            Umbau. Auf diesen Seiten finden Sie Informationen
                            über unseren Verein und unsere Aktivitäten.
                        </p>
                    </div>

                    {/* About Section */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="text-lg">
                                Unser{' '}
                                <strong>Schützenverein Wendessen e.V.</strong>{' '}
                                ist mehr als nur ein Name. Er ist die sportliche
                                Heimat von über <strong>50 Mitgliedern</strong>.
                                Bei uns können{' '}
                                <strong>
                                    Kinder, Jugendliche, Frauen und Männer
                                </strong>{' '}
                                den Schießsport ausüben - allein, zu zweit oder
                                mit der ganzen Familie.
                            </p>
                        </div>
                    </div>

                    {/* Facilities Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Unsere Ausstattung
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mb-6"></div>
                            <p className="text-lg text-gray-600">
                                Als moderner Schützenverein verfügen wir über
                                ein breitgefächertes Programm
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* KK and SpoPi */}
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
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                    Elektronische Auswertung
                                </h3>
                                <div className="bg-white p-6 rounded-xl border border-red-200">
                                    <h4 className="font-semibold text-red-800 mb-3">
                                        2 Stände
                                    </h4>
                                    <p className="text-gray-700 mb-2">
                                        <strong>KK und SpoPi</strong>
                                    </p>
                                    <p className="text-red-600 font-medium">
                                        50/25 m Distanz
                                    </p>
                                </div>
                            </div>

                            {/* Air Rifle */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg">
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
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                    Infrarotauswertung
                                </h3>
                                <div className="bg-white p-6 rounded-xl border border-blue-200">
                                    <h4 className="font-semibold text-blue-800 mb-3">
                                        2 Stände
                                    </h4>
                                    <p className="text-gray-700 mb-2">
                                        <strong>Luftgewehr</strong>
                                    </p>
                                    <p className="text-blue-600 font-medium">
                                        Mit Infrarotauswertung
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Training Times */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Schießabende
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                                Wir würden uns freuen, interessierte Bürger
                                begrüßen zu können
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-green-700 mb-2">
                                    Mittwochs
                                </h4>
                                <p className="text-green-600 text-lg font-semibold">
                                    18:00 - 21:00 Uhr
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-bold text-emerald-700 mb-2">
                                    Freitags
                                </h4>
                                <p className="text-emerald-600 text-lg font-semibold">
                                    18:00 - 21:00 Uhr
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Events Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Unsere Veranstaltungen
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-orange-600 mx-auto mb-6"></div>
                            <p className="text-lg text-gray-600">
                                Nicht nur aktives Schießen gehört zum
                                Vereinsleben
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Easter Shooting */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-3xl shadow-lg">
                                <h3 className="text-xl font-bold text-yellow-700 mb-4 flex items-center">
                                    <svg
                                        className="w-6 h-6 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21A7,7 0 0,1 14,26H10A7,7 0 0,1 3,19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2Z" />
                                    </svg>
                                    Ostereierschießen
                                </h3>
                                <p className="text-gray-700">
                                    Traditionelles Frühjahrs-Event für die ganze
                                    Familie
                                </p>
                            </div>

                            {/* King's Shooting */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl shadow-lg">
                                <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                                    <svg
                                        className="w-6 h-6 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M5,16L3,5H1V3H4L6,14H18.5L19.5,11H21.5L20.2,16H5ZM12,2L13.5,6H18L15,9L16.5,13L12,10L7.5,13L9,9L6,6H10.5L12,2Z" />
                                    </svg>
                                    Königsschießen
                                </h3>
                                <p className="text-gray-700">
                                    Mit großer Königsproklamation - das
                                    Highlight des Jahres
                                </p>
                            </div>

                            {/* Cup and Team Shooting */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl shadow-lg">
                                <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                                    <svg
                                        className="w-6 h-6 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M17,2H7A2,2 0 0,0 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4A2,2 0 0,0 17,2M17,8H15V4H17V8Z" />
                                    </svg>
                                    Pokal- und Mannschaftsschießen
                                </h3>
                                <p className="text-gray-700">
                                    Wettkampf und Teamgeist stehen im
                                    Vordergrund
                                </p>
                            </div>

                            {/* Pig Shooting */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl shadow-lg">
                                <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                                    <svg
                                        className="w-6 h-6 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21A7,7 0 0,1 14,26H10A7,7 0 0,1 3,19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2Z" />
                                    </svg>
                                    Schweineschießen
                                </h3>
                                <p className="text-gray-700">
                                    Geselliges Schießen mit kulinarischem
                                    Höhepunkt
                                </p>
                            </div>
                        </div>

                        {/* Participation Info */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-500 p-8 rounded-2xl mt-8">
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
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                Für alle Dorfbürger!
                            </h3>
                            <p className="text-red-800 text-lg mb-4">
                                An diesen Veranstaltungen können{' '}
                                <strong>alle Bürger unseres Dorfes</strong>{' '}
                                teilnehmen (Informationen kommen frühzeitig).
                            </p>
                            <div className="bg-white p-6 rounded-xl border border-red-200">
                                <h4 className="font-semibold text-red-800 mb-3">
                                    🏆 Besonderes Bonbon:
                                </h4>
                                <p className="text-red-800">
                                    Der{' '}
                                    <strong>
                                        Volkskönig und die Volkskönigin
                                    </strong>{' '}
                                    sind für ein Jahr{' '}
                                    <strong>kostenfreie Mitglieder</strong> des
                                    Schützenvereines.
                                </p>
                            </div>
                        </div>

                        {/* Cost Notice */}
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl mt-6">
                            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
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
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Hinweis:
                            </h4>
                            <p className="text-yellow-800">
                                Den Königinnen und Königen entstehen{' '}
                                <strong>keine Kosten</strong>. Lediglich zum
                                Königsball würden wir uns über eine
                                Getränkespende freuen!
                            </p>
                        </div>
                    </div>

                    {/* Youth Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Jugendabteilung
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                                Ein wichtiger Bestandteil des Schützenvereines
                            </p>
                        </div>

                        <div className="space-y-6 text-gray-700">
                            <p className="text-lg">
                                Mit unseren{' '}
                                <strong>
                                    Jugendlichen im Alter von 9-17 Jahren
                                </strong>{' '}
                                wird neben dem Schießsport{' '}
                                <strong>Luftgewehr und Luftpistole</strong> auch
                                einiges an Freizeitaktivitäten geboten (z.B.
                                gemeinsame Ausflüge usw.).
                            </p>

                            <div className="bg-white p-6 rounded-2xl border-2 border-purple-200">
                                <h4 className="text-xl font-bold text-purple-700 mb-3 flex items-center">
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
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                    Neu: Infrarotanlage
                                </h4>
                                <p className="text-purple-800 mb-3">
                                    Hier darf schon <strong>ab 6 Jahren</strong>{' '}
                                    geschossen werden, da keine Munition
                                    verwendet wird. Unsere Schützenjugend ist
                                    begeistert.
                                </p>
                                <p className="text-purple-700 font-medium">
                                    Alle interessierten Kids sind herzlich zum
                                    Probeschießen eingeladen!
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-red-100 to-orange-100 border-l-4 border-red-500 p-6 rounded-r-2xl">
                                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
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
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                        />
                                    </svg>
                                    Aktueller Hinweis:
                                </h4>
                                <p className="text-red-800">
                                    Leider kann derzeit{' '}
                                    <strong>
                                        kein Training für Jugendliche
                                    </strong>{' '}
                                    angeboten werden.
                                </p>
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
                            Ihr Kontakt für alle Fragen rund um den
                            Schützenverein
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        {/* Contact Person */}
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
                                    Schriftführer
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-3">
                                    Lothar Lange
                                </h3>
                                <div className="space-y-2 text-gray-600 mb-4">
                                    <p>Im Weingarten 9a</p>
                                    <p>38300 Wolfenbüttel</p>
                                </div>
                                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl">
                                    <a
                                        href="tel:05331966756"
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
                                        05331 / 966756
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-red-700 mb-6">
                            Wir freuen uns auf Sie! 🎯
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Wir freuen uns schon heute darauf, Sie an einer der
                            aufgeführten Veranstaltungen begrüßen zu dürfen.
                        </p>
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2 text-red-600">
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21A7,7 0 0,1 14,26H10A7,7 0 0,1 3,19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2Z" />
                                </svg>
                                <span className="font-semibold">
                                    Schützenverein Wendessen e.V.
                                </span>
                                <svg
                                    className="w-6 h-6"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M5,16L3,5H1V3H4L6,14H18.5L19.5,11H21.5L20.2,16H5ZM12,2L13.5,6H18L15,9L16.5,13L12,10L7.5,13L9,9L6,6H10.5L12,2Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
