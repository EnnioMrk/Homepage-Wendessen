import Image from 'next/image';

export const metadata = {
    title: 'Kirchbauverein St. Georg Wendessen - Dorfleben',
    description:
        'Der Kirchbauverein St. Georg Wendessen - Erhaltung und Pflege der historischen Wehrkirche aus dem 12. Jahrhundert',
};

export default function KirchbauvereinsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Vereinsleben/Kirche.webp')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-purple-700/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-6">
                                <svg
                                    className="w-12 h-12 text-blue-700"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2L3 7V10.5C3 16.75 7.3 22.4 12 24C16.7 22.4 21 16.75 21 10.5V7L12 2ZM12 4.3L18 7.9V10.5C18 15.64 15.03 20.09 12 21.5C8.97 20.09 6 15.64 6 10.5V7.9L12 4.3ZM11 7V13H13V7H11ZM11 15V17H13V15H11Z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                                    Kirchbauverein
                                </h1>
                                <p className="text-2xl md:text-3xl text-blue-100 mt-2">
                                    St. Georg Wendessen
                                </p>
                            </div>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-blue-300 to-white mx-auto mb-8"></div>
                        <p className="text-xl text-blue-200 font-semibold mt-4">
                            Erhaltung • Kultur • Gemeinschaft • Geschichte
                        </p>

                        {/* Decorative elements */}
                        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-blue-300/50 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="absolute top-1/3 right-32 w-3 h-3 bg-blue-300/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Image Section */}
                    <div className="text-center mb-16">
                        <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-100">
                            <Image
                                src="/images/Vereinsleben/Kirche.webp"
                                alt="St. Georg Kirche Wendessen - Historische Wehrkirche aus dem 12. Jahrhundert"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h2 className="text-3xl font-bold mb-2">
                                    St. Georg Kirche Wendessen
                                </h2>
                                <p className="text-lg">
                                    Eine der ältesten Kirchen Wolfenbüttels -
                                    12. Jahrhundert
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Introduction */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Über uns
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Seit 2002 setzen wir die Tradition der
                            Kirchenerhaltung fort
                        </p>
                    </div>

                    {/* Foundation Story */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-8 text-gray-700 leading-relaxed">
                            {/* Foundation */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
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
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                    Vereinsgründung
                                </h3>
                                <p className="text-lg">
                                    Der{' '}
                                    <strong>
                                        Kirchbauverein St. Georg Wendessen
                                    </strong>{' '}
                                    wurde im <strong>Januar 2002</strong> als
                                    gemeinnütziger Verein gegründet und hat
                                    zurzeit <strong>96 Mitglieder</strong>.
                                </p>
                            </div>

                            {/* Historical Context */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-purple-800 mb-3 flex items-center">
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
                                    Historischer Hintergrund
                                </h3>
                                <p>
                                    Im{' '}
                                    <strong>
                                        12. Jahrhundert als Wehrkirche erbaut
                                    </strong>
                                    , gehört die Wendesser Kirche zu den{' '}
                                    <strong>ältesten in Wolfenbüttel</strong>.
                                    Nach ihrer fast vollständigen Zerstörung
                                    durch einen Bombenangriff im{' '}
                                    <strong>Januar 1944</strong> wurde die
                                    Kirche durch das Engagement des damaligen
                                    Pfarrers und durch großzügige Unterstützung
                                    von Wendesser Bürgern wieder aufgebaut.
                                </p>
                            </div>

                            {/* Mission */}
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
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Unsere Mission
                                </h3>
                                <p>
                                    Diese Tradition führt der Kirchbauverein nun
                                    seit Vereinsgründung weiter fort. Das
                                    vorrangige Ziel des Vereins ist, in
                                    Zusammenarbeit mit der{' '}
                                    <strong>
                                        Kirchengemeinde Ahlum – Atzum –
                                        Wendessen
                                    </strong>
                                    , finanzielle Mittel einzuwerben, die für
                                    Arbeiten am Innen- sowie am Außenbereich der
                                    St. Georg Kirche aufgewendet werden.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Unsere Erfolge seit 2002
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
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
                                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                        />
                                    </svg>
                                    Abgeschlossene Projekte
                                </h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2"></span>
                                        <span>Einbau eines WCs</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></span>
                                        <span>Installation einer Teeküche</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                                        <span>Neue Heizung und Elektrik</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></span>
                                        <span>Erneuerung der Fassade</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 mt-2"></span>
                                        <span>
                                            Renovierung der Kirchgartenmauer
                                        </span>
                                    </li>
                                </ul>
                            </div>

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
                                            d="M15 17h5l-5 5v-5zM4.222 3.808l6.717 6.717-2.04 2.04L2.182 5.848 4.222 3.808zM10.323 13.323L22 1.646l-1.646-1.646L8.677 11.677l1.646 1.646z"
                                        />
                                    </svg>
                                    Aktuelles Projekt 2022
                                </h3>
                                <div className="bg-white p-6 rounded-xl border border-blue-200">
                                    <h4 className="font-semibold text-blue-800 text-xl mb-3">
                                        🔔 Zwei neue Glocken für St. Georg
                                        Wendessen!
                                    </h4>
                                    <p className="text-gray-700">
                                        Das aktuelle Projekt soll noch im Jahr
                                        2022 abgeschlossen sein.
                                    </p>
                                </div>
                                <div className="mt-6 bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-xl">
                                    <p className="text-blue-800 font-medium text-center">
                                        Ein wichtiger Meilenstein für unsere
                                        Kirchengemeinde
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cultural Activities */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Kulturelle Veranstaltungen
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4"></div>
                        </div>

                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="text-lg">
                                Einer der Wege, um Geld für den Verein zu
                                erwirtschaften, sind die mittlerweile{' '}
                                <strong>fest etablierten Konzerte</strong>.
                                Jazz-, Klezmer-, Folk- oder klassische Musik
                                zieht regelmäßig Publikum aus der ganzen Region
                                an, Musiker, teils von Weltrang, erfreuen sich
                                an der Akustik der Kirche.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
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
                                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                            />
                                        </svg>
                                        Musikrichtungen
                                    </h4>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• Jazz-Konzerte</li>
                                        <li>• Klezmer-Musik</li>
                                        <li>• Folk-Aufführungen</li>
                                        <li>• Klassische Musik</li>
                                    </ul>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
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
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        Veranstaltungsorte
                                    </h4>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• Konzerte in der Kirche</li>
                                        <li>• Open-Air im Kirchgarten</li>
                                        <li>• Besondere Akustik</li>
                                        <li>• Angenehme Atmosphäre</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl mt-6">
                                <p className="text-purple-800 font-medium text-center">
                                    Der Verein ist damit nicht nur für das
                                    Kirchengebäude, sondern auch als{' '}
                                    <strong>kultureller Veranstalter</strong>{' '}
                                    von Bedeutung.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border-2 border-purple-200">
                                <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
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
                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    Newsletter abonnieren
                                </h4>
                                <p className="text-gray-700 mb-3">
                                    Wenn Sie über die Veranstaltungen per E-Mail
                                    informiert werden möchten:
                                </p>
                                <a
                                    href="mailto:kirchbauverein.wendessen@gmail.com"
                                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
                                >
                                    <svg
                                        className="w-4 h-4 mr-1"
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
                                    kirchbauverein.wendessen@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Membership Information */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Mitgliedschaft & Unterstützung
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mb-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Membership */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg">
                            <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
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
                                Jahresbeiträge
                            </h3>

                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-green-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-green-800">
                                            Paare
                                        </span>
                                        <span className="text-2xl font-bold text-green-700">
                                            40 €
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-green-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-green-800">
                                            Einzelpersonen
                                        </span>
                                        <span className="text-2xl font-bold text-green-700">
                                            24 €
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-green-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-green-800">
                                            Schüler/Studenten
                                        </span>
                                        <span className="text-2xl font-bold text-green-700">
                                            12 €
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href="https://www.kirchbauverein-wendessen.de/beitreten/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
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
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Beitragsformular
                                </a>
                            </div>
                        </div>

                        {/* Donations */}
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
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                Einmalige Spende
                            </h3>

                            <p className="text-gray-700 mb-6">
                                Sie möchten uns gern einmalig finanziell
                                unterstützen? Dann freuen wir uns sehr über Ihre
                                Spende.
                            </p>

                            <div className="bg-white p-6 rounded-xl border border-blue-200">
                                <h4 className="font-semibold text-blue-800 mb-3">
                                    Bankverbindung:
                                </h4>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <strong>
                                            Kirchbauverein St. Georg Wendessen
                                        </strong>
                                    </p>
                                    <p>Volksbank Wolfenbüttel</p>
                                    <p className="font-mono text-sm bg-blue-50 p-2 rounded">
                                        IBAN: DE 38 2709 2555 5000 7858 00
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-xl">
                                <p className="text-blue-800 font-medium text-center">
                                    Jede Spende hilft bei der Erhaltung unserer
                                    historischen Kirche! 🙏
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Website */}
                    <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-blue-700 mb-6">
                            Interesse geweckt?
                        </h3>

                        {/* Kirchbauverein Logo */}
                        <div className="mb-6">
                            <div className="bg-white rounded-2xl p-4 shadow-lg max-w-md mx-auto">
                                <div className="relative w-full h-24 md:h-28 rounded-xl overflow-hidden">
                                    <Image
                                        src="/images/Vereinsleben/Kirchbauverein.webp"
                                        alt="Kirchbauverein St. Georg Wendessen Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-xl text-gray-700 mb-6">
                            Sollten wir Ihr Interesse geweckt haben, sprechen
                            Sie uns doch einfach an oder besuchen Sie uns auf
                            unserer Homepage.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <a
                                href="https://www.kirchbauverein-wendessen.de"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
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
                                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                                    />
                                </svg>
                                www.kirchbauverein-wendessen.de
                            </a>
                            <a
                                href="mailto:kirchbauverein.wendessen@gmail.com"
                                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
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
                                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                E-Mail schreiben
                            </a>
                        </div>
                        <p className="text-2xl font-bold text-blue-700 mt-8">
                            Wir freuen uns auf Sie! ⛪
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
