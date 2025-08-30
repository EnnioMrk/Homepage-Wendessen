import Image from 'next/image';
import {
    Medal,
    Star,
    Users,
    Gamepad2,
    Activity,
    Timer,
    Heart,
    Trophy,
    ShoppingCart,
} from 'lucide-react';

export const metadata = {
    title: 'SV Wendessen - Dorfleben',
    description:
        'SV Wendessen - Über 75 Jahre Vereinstradition. Fußball, Gymnastik, Tennis, Tischtennis, Tanzsport und vieles mehr für die ganze Familie.',
};

export default function SVWendessenPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-700 via-green-600 to-emerald-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Features/SV_Wendessen.JPG')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-emerald-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-6">
                                <Medal className="w-12 h-12 text-blue-700" />
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                SV Wendessen
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-lime-400 to-white mx-auto mb-8"></div>
                        <p className="text-xl text-lime-200 font-semibold mt-4">
                            Sport • Gemeinschaft • Tradition • Familie
                        </p>
                        <p className="text-lg text-blue-100 mt-2">
                            Über 75 Jahre Vereinstradition
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
                        <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-100">
                            <Image
                                src="/images/Features/SV_Wendessen.JPG"
                                alt="SV Wendessen - Weinrich-Arena und Vereinsgelände"
                                fill
                                className="object-cover"
                                style={{ objectPosition: 'center 43%' }}
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h2
                                    className="text-3xl font-bold mb-2 drop-shadow-lg"
                                    style={{
                                        textShadow:
                                            '2px 2px 4px rgba(0,0,0,0.8)',
                                    }}
                                >
                                    Weinrich-Arena Wendessen
                                </h2>
                                <p
                                    className="text-lg drop-shadow-md"
                                    style={{
                                        textShadow:
                                            '1px 1px 3px rgba(0,0,0,0.8)',
                                    }}
                                >
                                    Unser Sportplatz und Vereinsheim - Zentrum
                                    des Vereinslebens
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Introduction */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Über 75 Jahre SV Wendessen
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Von einer Handvoll fußballbegeisterter Männer zum
                            vielseitigen Sportverein
                        </p>
                    </div>

                    {/* History and Success */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="text-lg">
                                Vor über <strong>75 Jahren</strong> gründeten
                                eine Handvoll fußballbegeisterter Männer den{' '}
                                <strong>SV Wendessen</strong>. Die größte Sparte
                                des Vereins ist die{' '}
                                <strong>Fußballabteilung</strong> geblieben.
                                Nicht nur die Kids und die Männer lieben diesen
                                Sport, auch die{' '}
                                <strong>
                                    Frauen sind mit Begeisterung und großem
                                    Erfolg
                                </strong>{' '}
                                dabei.
                            </p>

                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-green-800 mb-3 flex items-center">
                                    <Star className="w-6 h-6 mr-2" />
                                    Unser Erflog
                                </h3>
                                <p className="text-green-800">
                                    Stolz sind wir auf die mittlerweile
                                    erreichte <strong>Oberliga</strong>!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sports Departments */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Unsere Sportarten
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-blue-600 mx-auto mb-6"></div>
                            <p className="text-lg text-gray-600">
                                Vielfältige sportliche Aktivitäten für alle
                                Altersgruppen
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Football */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trophy className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-green-700 mb-3">
                                    Fußball
                                </h3>
                                <p className="text-gray-700">
                                    Kinder, Frauen und Männer - Oberliga
                                    erreicht!
                                </p>
                            </div>

                            {/* Gymnastics */}
                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Activity className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-pink-700 mb-3">
                                    Gymnastik
                                </h3>
                                <p className="text-gray-700">
                                    Aerobic, Damengymnastik, Fit and Fun,
                                    Wirbelsäulengymnastik
                                </p>
                            </div>

                            {/* Children's Gymnastics */}
                            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-orange-700 mb-3">
                                    Kinderturnen
                                </h3>
                                <p className="text-gray-700">
                                    Schon die Kleinsten toben sich bei uns aus
                                </p>
                            </div>

                            {/* Table Tennis */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Gamepad2 className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-700 mb-3">
                                    Tischtennis
                                </h3>
                                <p className="text-gray-700">
                                    Reaktionsvermögen und Beweglichkeit fördern
                                </p>
                            </div>

                            {/* Tennis */}
                            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Timer className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-purple-700 mb-3">
                                    Tennis
                                </h3>
                                <p className="text-gray-700">
                                    Zwei Plätze für Tennis-Begeisterte
                                </p>
                            </div>

                            {/* Dance Sport */}
                            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Heart className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-teal-700 mb-3">
                                    Tanzsport
                                </h3>
                                <p className="text-gray-700">
                                    Standard und lateinamerikanische Tänze für
                                    Paare
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Facilities and Catering */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Vereinsheim & Gastronomie
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mb-4"></div>
                        </div>

                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="text-lg">
                                Heute bieten wir neben dem Fußballtraining für
                                Kinder, Frauen und Männer weitere sportliche
                                Aktivitäten an, die überwiegend im{' '}
                                <strong>
                                    Vereinsheim bzw. auf dem Sportplatz, der
                                    Weinrich-Arena
                                </strong>{' '}
                                in Wendessen stattfinden.
                            </p>

                            <div className="bg-white p-6 rounded-2xl border-2 border-amber-200">
                                <h4 className="text-xl font-bold text-amber-700 mb-4 flex items-center">
                                    <ShoppingCart className="w-6 h-6 mr-2" />
                                    Vereinswirt
                                </h4>
                                <p className="text-amber-800 mb-3">
                                    Sport macht durstig und hungrig. Hier hilft
                                    unser Vereinswirt mit{' '}
                                    <strong>
                                        leckeren Speisen und kalten Getränken
                                    </strong>
                                    . Diese bietet er nicht nur den Sportlern,
                                    sondern{' '}
                                    <strong>allen Interessierten</strong> und
                                    berät gerne bei der Ausrichtung von{' '}
                                    <strong>
                                        Familienfeiern und Versammlungen
                                    </strong>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Community and Support */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Gemeinschaft & Unterstützung
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-4"></div>
                        </div>

                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p className="text-lg">
                                Unser Verein lebt vom{' '}
                                <strong>
                                    Interesse seiner Mitglieder und der
                                    Ortsgemeinschaft
                                </strong>
                                . Jeder fördert so gut er kann, mit{' '}
                                <strong>
                                    Engagement im Sportbereich,
                                    Mitgliederbeiträgen und Teilnahme
                                </strong>
                                .
                            </p>

                            <div className="bg-white p-6 rounded-2xl border-2 border-blue-200">
                                <h4 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                                    <Heart className="w-6 h-6 mr-2" />
                                    Besonderer Dank
                                </h4>
                                <p className="text-blue-800">
                                    Unsere{' '}
                                    <strong>
                                        Sponsoren und unseren Förderkreis
                                        &ldquo;Pool 99&rdquo;
                                    </strong>{' '}
                                    heben wir besonders heraus, weil wir durch
                                    ihre Unterstützung unserer
                                    Vereinsgemeinschaft viel Gutes tun können.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Machen Sie mit!
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-green-600 to-emerald-600 mx-auto mb-4"></div>
                        </div>

                        <div className="space-y-6 text-gray-700 leading-relaxed text-center">
                            <p className="text-lg">
                                Wir freuen uns auf Ihr Interesse und sind für
                                Reaktionen dankbar. Möchten Sie mit uns zusammen{' '}
                                <strong>
                                    Sport machen, die Gemeinschaft pflegen, neue
                                    Mitbürger kennen lernen
                                </strong>
                                ? Eine unserer Angebote passt auch für Sie.
                            </p>

                            <div className="bg-white p-6 rounded-2xl border-2 border-green-200">
                                <p className="text-green-800 text-lg">
                                    <strong>
                                        Greifen Sie zum Telefon oder schicken
                                        Sie uns eine Mail/SMS.
                                    </strong>{' '}
                                    So erfahren Sie die Trainingszeiten, die
                                    Kosten und die Mitgestaltungsmöglichkeiten.
                                    Abteilungsleiter und Vorstand steht
                                    jederzeit zur Verfügung.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Ansprechpartner
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600">
                            Ihre direkten Kontakte zu den verschiedenen
                            Abteilungen
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Football */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-green-500">
                            <h3 className="text-lg font-bold text-green-700 mb-3">
                                ⚽ Fußball
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Lennart Meinberg
                                    </p>
                                    <a
                                        href="tel:016044887045"
                                        className="text-green-600 hover:text-green-700"
                                    >
                                        0160 44 87 045
                                    </a>
                                    <br />
                                    <a
                                        href="mailto:fussball@sv-wendessen.de"
                                        className="text-green-600 hover:text-green-700 text-sm"
                                    >
                                        fussball@sv-wendessen.de
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Youth Football */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-blue-500">
                            <h3 className="text-lg font-bold text-blue-700 mb-3">
                                👦 Jugendfußball
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Stefan Landsperger
                                    </p>
                                    <a
                                        href="tel:017161110209"
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        0171 61 10 209
                                    </a>
                                    <br />
                                    <a
                                        href="mailto:fussball-ju@sv-wendessen.de"
                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        fussball-ju@sv-wendessen.de
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Gymnastics */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-pink-500">
                            <h3 className="text-lg font-bold text-pink-700 mb-3">
                                🤸‍♀️ Gymnastikabteilung
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                Damengymnastik, Aerobic, Fit and Fun,
                                Wirbelsäulengymnastik
                            </p>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Karlheinz Bock
                                    </p>
                                    <a
                                        href="tel:0533144133"
                                        className="text-pink-600 hover:text-pink-700"
                                    >
                                        05331-4 41 33
                                    </a>
                                    <br />
                                    <a
                                        href="mailto:gymnastik@sv-wendessen.de"
                                        className="text-pink-600 hover:text-pink-700 text-sm"
                                    >
                                        gymnastik@sv-wendessen.de
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Children's Gymnastics */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-orange-500">
                            <h3 className="text-lg font-bold text-orange-700 mb-3">
                                🧸 Kinderturnen
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Hanna Simon
                                    </p>
                                    <a
                                        href="tel:015901334664"
                                        className="text-orange-600 hover:text-orange-700"
                                    >
                                        0159 01 33 46 64
                                    </a>
                                    <br />
                                    <a
                                        href="mailto:kinderturnen@sv-wendessen.de"
                                        className="text-orange-600 hover:text-orange-700 text-sm"
                                    >
                                        kinderturnen@sv-wendessen.de
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Dance Sport */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-purple-500">
                            <h3 className="text-lg font-bold text-purple-700 mb-3">
                                💃 Tanzsport
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                                Paare, Standard und lateinamerikanische Tänze
                            </p>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Manfred Rasche
                                    </p>
                                    <a
                                        href="tel:053313186867"
                                        className="text-purple-600 hover:text-purple-700"
                                    >
                                        05331 31 86 7
                                    </a>
                                    <br />
                                    <a
                                        href="mailto:tanzsport@sv-wendessen.de"
                                        className="text-purple-600 hover:text-purple-700 text-sm"
                                    >
                                        tanzsport@sv-wendessen.de
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Tennis */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-indigo-500">
                            <h3 className="text-lg font-bold text-indigo-700 mb-3">
                                🎾 Tennis
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Johannes Grieger
                                    </p>
                                    <a
                                        href="tel:017148297336"
                                        className="text-indigo-600 hover:text-indigo-700"
                                    >
                                        0171 48 29 73 6
                                    </a>
                                    <br />
                                    <a
                                        href="mailto:tennis@sv-wendessen.de"
                                        className="text-indigo-600 hover:text-indigo-700 text-sm"
                                    >
                                        tennis@sv-wendessen.de
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Table Tennis */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-teal-500">
                            <h3 className="text-lg font-bold text-teal-700 mb-3">
                                🏓 Tischtennis
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Achim Schmeida
                                    </p>
                                    <a
                                        href="tel:015754110495"
                                        className="text-teal-600 hover:text-teal-700"
                                    >
                                        0157 54 11 04 95
                                    </a>
                                    <br />
                                    <a
                                        href="mailto:tischtennis@sv-wendessen.de"
                                        className="text-teal-600 hover:text-teal-700 text-sm"
                                    >
                                        tischtennis@sv-wendessen.de
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Pool 99 */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-yellow-500">
                            <h3 className="text-lg font-bold text-yellow-700 mb-3">
                                🏆 Fußballförderkreis &quot;Pool 99&quot;
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Thomas Rettberg
                                    </p>
                                    <a
                                        href="tel:017254998704"
                                        className="text-yellow-600 hover:text-yellow-700"
                                    >
                                        0172 54 98 704
                                    </a>
                                    <br />
                                    <a
                                        href="mailto:pool99@sv-wendessen.de"
                                        className="text-yellow-600 hover:text-yellow-700 text-sm"
                                    >
                                        pool99@sv-wendessen.de
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Club Host */}
                        <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-red-500">
                            <h3 className="text-lg font-bold text-red-700 mb-3">
                                🍺 Vereinswirt
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Maruan Nissan
                                    </p>
                                    <a
                                        href="tel:017655491268"
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        0176 55491268
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-blue-700 mb-6">
                            Werden Sie Teil unserer Gemeinschaft! ⚽
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            SV Wendessen - Mehr als nur ein Sportverein
                        </p>
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2 text-blue-600">
                                <Medal className="w-6 h-6" />
                                <span className="font-semibold">
                                    Über 75 Jahre Tradition
                                </span>
                                <Star className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
