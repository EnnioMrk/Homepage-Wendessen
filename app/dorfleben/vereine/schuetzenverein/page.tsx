import {
    Target,
    Info,
    ChartBar,
    Lightning,
    Clock,
    Crown,
    Trophy,
    Warning,
    UsersThree,
    Phone,
    User,
    Lightbulb,
    Egg,
    BowlFood,
} from '@phosphor-icons/react/dist/ssr';

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
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-4 sm:mr-6 flex-shrink-0">
                                <Target className="w-8 h-8 sm:w-12 sm:h-12 text-red-700" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
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

                        {/* Decorative elements - hidden on mobile */}
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
                            <Info className="w-6 h-6 mr-2 text-orange-600" />
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
                                    <ChartBar className="w-8 h-8 mr-3" />
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
                                    <Lightning className="w-8 h-8 mr-3" />
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
                                    <Clock className="w-8 h-8 text-white" />
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
                                    <Clock className="w-8 h-8 text-white" />
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
                                    <Egg className="w-6 h-6 mr-2" />
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
                                    <Crown className="w-6 h-6 mr-2" />
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
                                    <Trophy className="w-6 h-6 mr-2" />
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
                                    <BowlFood className="w-6 h-6 mr-2" />
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
                                <UsersThree className="w-8 h-8 mr-3" />
                                Für alle Dorfbürger!
                            </h3>
                            <p className="text-red-800 text-lg mb-4">
                                An diesen Veranstaltungen können{' '}
                                <strong>alle Bürger unseres Dorfes</strong>{' '}
                                teilnehmen (Informationen kommen frühzeitig).
                            </p>
                            <div className="bg-white p-6 rounded-xl border border-red-200">
                                <h4 className="font-semibold text-red-800 mb-3">
                                    Das Highlight:
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
                                <Info className="w-5 h-5 mr-2" />
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
                                    <Lightning className="w-6 h-6 mr-2" />
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
                                    <Warning className="w-5 h-5 mr-2" />
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
                                <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <User className="w-10 h-10 text-white" />
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
                                        <Phone className="w-5 h-5 mr-2" />
                                        05331 / 966756
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-red-700 mb-6">
                            Wir freuen uns auf Sie!
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Wir freuen uns schon heute darauf, Sie an einer der
                            aufgeführten Veranstaltungen begrüßen zu dürfen.
                        </p>
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2 text-red-600">
                                <Lightbulb className="w-6 h-6" />
                                <span className="font-semibold">
                                    Schützenverein Wendessen e.V.
                                </span>
                                <Crown className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
