import {
    Building,
    AlertTriangle,
    Wrench,
    Sparkles,
    Calendar,
    Users,
    User,
    Heart,
    CreditCard,
    PenTool,
    Phone,
} from 'lucide-react';

export const metadata = {
    title: 'Initiative Wendesser Spritzenhaus e.V. - Vereine',
    description:
        'Die Initiative Wendesser Spritzenhaus e.V. - Erhalt und Pflege des historischen Spritzenhauses im Herzen von Wendessen',
};

export default function SpritzenhausPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-700 py-20 overflow-hidden">
                <div
                    className="absolute inset-0 bg-[url('/images/Vereinsleben/Spritzenhaus.webp')] bg-cover opacity-70"
                    style={{ backgroundPosition: 'center 66%' }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700/90 to-yellow-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-6">
                                <Building className="w-12 h-12 text-amber-700" />
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                Spritzenhaus
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-300 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Initiative Wendesser Spritzenhaus e.V.
                        </p>
                        <p className="text-xl text-yellow-200 font-semibold mt-4">
                            Erhalt • Geschichte • Gemeinschaft
                        </p>

                        {/* Decorative elements */}
                        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-yellow-300/50 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="absolute top-1/3 right-32 w-3 h-3 bg-yellow-300/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Introduction */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Geschichte & Mission
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Von der Rettung vor dem Abriss zum lebendigen
                            Kulturdenkmal
                        </p>
                    </div>

                    {/* Main Story */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-8 text-gray-700 leading-relaxed">
                            {/* Founding Story */}
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-red-800 mb-3 flex items-center">
                                    <AlertTriangle className="w-6 h-6 mr-2" />
                                    Die Rettung in letzter Minute
                                </h3>
                                <p className="text-lg">
                                    <strong>1998</strong> wurde durch den Rat
                                    der Stadt Wolfenbüttel und den damaligen
                                    Wendesser Ortsrat der Abriss des -
                                    denkmalgeschützten - ehemaligen
                                    Spritzenhauses der Wendesser Freiwilligen
                                    Feuerwehr beschlossen. Daraufhin wurde von
                                    Wendesser Bürgern, die sich für den Erhalt
                                    dieses Gebäudes mitten im alten Ortskern
                                    einsetzen wollten, buchstäblich in letzter
                                    Minute die{' '}
                                    <strong>
                                        &quot;Initiative Wendesser Spritzenhaus
                                        e.V.&quot;
                                    </strong>{' '}
                                    gegründet.
                                </p>
                            </div>

                            {/* Restoration */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-green-800 mb-3 flex items-center">
                                    <Wrench className="w-6 h-6 mr-2" />
                                    Sanierung und Wiedergeburt
                                </h3>
                                <p>
                                    Mit Mitteln der Stadt, des Landes
                                    Niedersachsen, Eigenmitteln des Vereins und
                                    sehr viel Eigenleistung wurde das Gebäude
                                    saniert und im{' '}
                                    <strong>Sommer des Jahres 2000</strong>{' '}
                                    eingeweiht. Heute bildet dieses kleine
                                    Fachwerkhaus mit seinem - 1952 angebauten -
                                    Schlauchturm zusammen mit der benachbarten
                                    Dorfkirche und den umliegenden alten
                                    Fachwerkhäusern als ein Stück greifbarer
                                    Ortsgeschichte den eigentlichen Kern unseres
                                    Ortsteiles.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Activities Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Veranstaltungen & Aktivitäten
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-yellow-600 to-amber-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                                    <Sparkles className="w-8 h-8 mr-3" />
                                    Weihnachtsbaummarkt
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Der Verein veranstaltet seit{' '}
                                    <strong>1999</strong> jedes Jahr in der
                                    Vorweihnachtszeit einen Weihnachtsbaummarkt,
                                    der sich stetig wachsender Beliebtheit
                                    erfreut.
                                </p>
                                <div className="bg-white p-4 rounded-xl border border-green-200">
                                    <p className="font-semibold text-green-800">
                                        Besuchen Sie uns z.B. beim
                                        Weihnachtsbaummarkt!
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
                                    <Calendar className="w-8 h-8 mr-3" />
                                    Weitere Veranstaltungen
                                </h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                                        <span>
                                            Spritzenhausfest für Mitglieder im
                                            Sommer
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></span>
                                        <span>
                                            Tag des offenen Denkmals (2002)
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></span>
                                        <span>
                                            Fotoausstellungen zur Ortsgeschichte
                                            (2003, 2005)
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 mt-2"></span>
                                        <span>
                                            Kooperationen mit dem Kirchbauverein
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Membership Information */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Mitgliedschaft
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-yellow-600 mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-10 h-10 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold text-foreground mb-2">
                                    75 Mitglieder
                                </h4>
                                <p className="text-gray-600">
                                    Aktive Gemeinschaft
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold text-foreground mb-2">
                                    12,00 €
                                </h4>
                                <p className="text-gray-600">
                                    Einzelmitglied pro Jahr
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-10 h-10 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold text-foreground mb-2">
                                    18,00 €
                                </h4>
                                <p className="text-gray-600">Paare pro Jahr</p>
                            </div>
                        </div>

                        <div className="text-center mt-8 bg-white p-6 rounded-2xl shadow-lg">
                            <p className="text-lg text-gray-700 italic">
                                &quot;Wer eine Möglichkeit sucht, sich ohne
                                großen und regelmäßigen Zeitaufwand und bei
                                geringem Beitrag im Dorfgemeinschaftsleben zu
                                engagieren, ist in der Initiative Wendesser
                                Spritzenhaus e.V. gut aufgehoben.&quot;
                            </p>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Ansprechpartner
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600">
                            Der Vorstand der Initiative Wendesser Spritzenhaus
                            e.V.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* 1. Vorsitzende */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-amber-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-2">
                                    1. Vorsitzende
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-3">
                                    Ines Lange
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <p>Am Gute 3</p>
                                    <p>38300 Wolfenbüttel</p>
                                </div>
                                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl mt-4">
                                    <a
                                        href="tel:053319455640"
                                        className="flex items-center justify-center text-amber-600 hover:text-amber-700 transition-colors"
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        05331/9455640
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* 2. Vorsitzende */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-yellow-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide mb-2">
                                    2. Vorsitzende
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-3">
                                    Ursula Hanke
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <p>Am Gute 22</p>
                                    <p>38300 Wolfenbüttel</p>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl mt-4">
                                    <a
                                        href="tel:053319357411"
                                        className="flex items-center justify-center text-yellow-600 hover:text-yellow-700 transition-colors"
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        05331/9357411
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Kassenführer */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-green-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CreditCard className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">
                                    Kassenführer
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-3">
                                    Klaus-Martin Jungkurth
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <p>Dorfstraße 18</p>
                                    <p>38300 Wolfenbüttel</p>
                                </div>
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mt-4">
                                    <a
                                        href="tel:0533168680"
                                        className="flex items-center justify-center text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        05331/68680
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Schriftführer */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-blue-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <PenTool className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                                    Schriftführer
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-3">
                                    Peter Dorn
                                </h3>
                                <div className="space-y-2 text-gray-600">
                                    <p>Im Weingarten 10</p>
                                    <p>38300 Wolfenbüttel</p>
                                </div>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mt-4">
                                    <a
                                        href="tel:05331906681"
                                        className="flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Phone className="w-5 h-5 mr-2" />
                                        05331/906681
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
