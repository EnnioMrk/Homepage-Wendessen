import Image from 'next/image';

export const metadata = {
    title: 'Hospiz - Wohnen & Bauen in Wendessen',
    description:
        'Hospiz des Hospizvereins Wolfenbüttel im alten Gutshaus Wendessen. Um- und Ausbau des historischen Gebäudes für 10 Hospizgäste.',
};

export default function HospizPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Features/Hospiz.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-blue-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-6">
                                <svg
                                    className="w-12 h-12 text-purple-600"
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
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                Hospiz
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Neues Zuhause im alten Gutshaus
                        </p>
                        <p className="text-xl text-yellow-200 font-semibold mt-4">
                            Hospizverein Wolfenbüttel • Historisches Gutshaus •
                            Ab 2024
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
                            Ein Ort der Würde und Geborgenheit
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Das historische Gutshaus wird zu einem modernen
                            Hospiz für Menschen in ihrer letzten Lebensphase
                        </p>
                    </div>

                    {/* Hospiz Image */}
                    <div className="mb-16">
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="relative w-full mb-8">
                                <Image
                                    src="/images/Hospiz_Bau.webp"
                                    alt="Hospiz Bau - Altes Gutshaus Wendessen wird zum Hospiz umgebaut"
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto rounded-2xl shadow-lg"
                                    priority
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Hospiz im Bau
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center">
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
                                    Hospiz des Hospizvereins Wolfenbüttel
                                </h3>
                                <p className="text-lg text-gray-800 font-medium">
                                    Menschen, die aufgrund ihrer Symptome in
                                    ihrer vertrauten Umgebung nicht mehr
                                    versorgt werden können, finden künftig im
                                    Hospiz des Hospizvereins Wolfenbüttel ein
                                    neues Zuhause.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p>
                                Zu diesem Zweck wird das alte Gutshaus im
                                Zentrum Wendessens um- und ausgebaut. Die großen
                                Terrassen und der Hausgarten können für
                                Aufenthalte der Hospizgäste genutzt werden. Für
                                Parkplätze gibt es eine ausreichend große
                                Fläche. Die Bushaltestelle ist in der Nähe.
                            </p>

                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 p-6 rounded-2xl">
                                <h4 className="text-xl font-bold text-green-700 mb-3">
                                    🏡 Ausstattung & Lage
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p>
                                            <strong>Kapazität:</strong> 10
                                            Hospizgäste
                                        </p>
                                        <p>
                                            <strong>Außenanlagen:</strong> Große
                                            Terrassen
                                        </p>
                                        <p>
                                            <strong>Garten:</strong> Hausgarten
                                            für Aufenthalte
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <strong>Parkplätze:</strong>{' '}
                                            Ausreichend große Fläche
                                        </p>
                                        <p>
                                            <strong>ÖPNV:</strong>{' '}
                                            Bushaltestelle in der Nähe
                                        </p>
                                        <p>
                                            <strong>Betrieb ab:</strong>{' '}
                                            Anfang/Mitte 2024
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historical Background */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Geschichte des Gutshauses
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-600 mx-auto mb-6"></div>
                            <p className="text-lg text-gray-600">
                                Über 360 Jahre Geschichte werden zu neuem Leben
                                erweckt
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
                                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        1660
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-800">
                                            Ursprüngliche Anlage
                                        </h4>
                                        <p className="text-gray-700">
                                            Das Gut wurde um 1660 angelegt
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        1944
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-red-800">
                                            Kriegszerstörung & Wiederaufbau
                                        </h4>
                                        <p className="text-gray-700">
                                            Im Januar 1944 wurde das Haus durch
                                            Bomben zerstört und nach dem Krieg
                                            wiederaufgebaut
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        2001
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-800">
                                            Eigentümerwechsel
                                        </h4>
                                        <p className="text-gray-700">
                                            Bis 2001 befand es sich im Besitz
                                            der Familie Seeliger, danach der
                                            Stadt Wolfenbüttel
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border-l-4 border-gray-400">
                                    <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        2017
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-700">
                                            Leerstand
                                        </h4>
                                        <p className="text-gray-700">
                                            Seit 2017 stand das Gutshaus leer,
                                            ohne Perspektive für die zukünftige
                                            Nutzung
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg
                                            className="w-5 h-5 text-white"
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
                                        <h4 className="font-bold text-purple-800">
                                            Neue Perspektive -
                                            Erbbaurechtsvertrag
                                        </h4>
                                        <p className="text-gray-700">
                                            Mit dem Erbbaurechtsvertrag zwischen
                                            der Stadt Wolfenbüttel wurde die
                                            langfristige Nutzung ausschließlich
                                            als HospizZentrum festgeschrieben
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Hospiz-Ausstattung
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-purple-800 mb-3">
                                    Würdevolle Betreuung
                                </h3>
                                <p className="text-gray-700">
                                    10 Gäste können dauerhaft betreut und
                                    versorgt werden
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
                                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-3">
                                    Naturnahe Umgebung
                                </h3>
                                <p className="text-gray-700">
                                    Große Terrassen und Hausgarten für
                                    Aufenthalte im Freien
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
                                <h3 className="text-xl font-bold text-blue-800 mb-3">
                                    Zentrale Lage
                                </h3>
                                <p className="text-gray-700">
                                    Im Zentrum Wendessens mit Bushaltestelle und
                                    Parkplätzen
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Legal Framework */}
                    <div className="mb-16">
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
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
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Rechtliche Grundlage
                                </h3>
                                <p className="text-lg text-gray-800 font-medium">
                                    Mit dem Erbbaurechtsvertrag zwischen der
                                    Stadt Wolfenbüttel wurde die langfristige
                                    Nutzung ausschließlich als HospizZentrum
                                    festgeschrieben.
                                </p>
                                <div className="mt-4 bg-white border border-blue-200 p-4 rounded-xl">
                                    <p className="text-sm text-gray-700">
                                        <strong>Vertragspartner:</strong> Stadt
                                        Wolfenbüttel & Hospizverein Wolfenbüttel
                                        <br />
                                        <strong>Nutzung:</strong> Ausschließlich
                                        als HospizZentrum
                                        <br />
                                        <strong>Laufzeit:</strong> Langfristig
                                        über Erbbaurecht gesichert
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Projektverlauf
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
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
                                        <h4 className="font-bold text-purple-800">
                                            Erbbaurechtsvertrag
                                        </h4>
                                        <p className="text-gray-700">
                                            Langfristige Nutzung als
                                            HospizZentrum vertraglich gesichert
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
                                            2022-2024 - Umbauarbeiten
                                        </h4>
                                        <p className="text-gray-700">
                                            Um- und Ausbau des historischen
                                            Gutshauses zum modernen Hospiz
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-4 h-4 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-green-800">
                                            Anfang/Mitte 2024 - Eröffnung
                                        </h4>
                                        <p className="text-gray-700">
                                            Hospiz nimmt Betrieb auf - 10 Gäste
                                            können betreut werden
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-purple-700 mb-6">
                            Neues Leben für historische Mauern 💜
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Das alte Gutshaus wird zu einem Ort der Würde,
                            Geborgenheit und professionellen Betreuung
                        </p>
                        <div className="flex justify-center mt-6">
                            <div className="flex items-center space-x-2 text-purple-600">
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
                                    Hospizverein Wolfenbüttel
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
