import Image from 'next/image';
import {
    Star,
    Users,
    Clock,
    Zap,
    UserPlus,
    MapPin,
    User,
    Phone,
    Smartphone,
} from 'lucide-react';

export const metadata = {
    title: 'Jugendfeuerwehr Wendessen - Vereine',
    description:
        'Die Jugendfeuerwehr Wendessen - Spaß, Action und feuerwehrtechnisches Wissen für Kinder und Jugendliche von 10 bis 16 Jahren',
};

export default function JugendfeuerwehrPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Events/Jugendfeuerwehr.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-pink-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-4 sm:mr-6 flex-shrink-0">
                                <Star
                                    className="w-8 h-8 sm:w-12 sm:h-12 text-orange-600"
                                    fill="currentColor"
                                />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                                Jugendfeuerwehr
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Wendessen
                        </p>
                        <p className="text-xl text-yellow-200 font-semibold mt-4">
                            Spaß • Action • Gemeinschaft • Feuerwehrtechnik
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
                    {/* Hero Image Section */}
                    <div className="text-center mb-16">
                        <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-100">
                            <Image
                                src="/images/Events/Jugendfeuerwehr.jpeg"
                                alt="Jugendfeuerwehr Wendessen in Aktion"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h2 className="text-3xl font-bold mb-2">
                                    Über 25 Jahre Jugendfeuerwehr
                                </h2>
                                <p className="text-lg">
                                    Jungen und Mädchen von 10 bis 16 Jahren
                                    lernen gemeinsam
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Hallo Kinder & Jugendliche!
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-pink-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Willkommen in eurem neuen Zuhause Wendessen!
                        </p>
                    </div>

                    {/* Welcome Message */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <div className="bg-gradient-to-r from-orange-50 to-pink-50 border-l-4 border-orange-500 p-6 rounded-r-2xl">
                                <p className="text-lg">
                                    <strong>Hallo</strong> all den Kindern und
                                    Jugendlichen, die mit Ihren Eltern hier bei
                                    uns in Wendessen ein neues Zuhause gefunden
                                    haben. Damit Ihr wisst, was in unserem Dorf
                                    so los ist und was ihr so machen könnt,
                                    möchten wir uns kurz vorstellen.
                                </p>
                            </div>

                            <p className="text-lg">
                                Wir sind die{' '}
                                <strong>
                                    Jugendgruppe der Freiwilligen Feuerwehr
                                    Wolfenbüttel im Ortsteil Wendessen
                                </strong>{' '}
                                und mittlerweile gibt es unsere Jugendfeuerwehr
                                schon <strong>über 25 Jahre</strong>.
                            </p>

                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-500 p-8 rounded-2xl">
                                <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                                    <Users className="w-8 h-8 mr-3" />
                                    Wer kann mitmachen?
                                </h3>
                                <p className="text-lg">
                                    Bei uns gibt es{' '}
                                    <strong>
                                        Jungen und Mädchen im Alter von 10 bis
                                        16 Jahren
                                    </strong>
                                    .
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Activities and Schedule */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Was wir machen
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Schedule */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                                    <Clock className="w-8 h-8 mr-3" />
                                    Unsere Dienstzeiten
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Jeden Montag treffen wir uns in unserem
                                    Jugendraum zum &quot;Dienst&quot;.
                                </p>
                                <div className="bg-white p-6 rounded-xl border border-green-200">
                                    <p className="font-semibold text-green-800 text-lg">
                                        Jeden Montag
                                    </p>
                                    <p className="text-green-600 text-xl font-bold">
                                        18:00 - 19:30 Uhr
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        im Jugendraum des Feuerwehrgerätehauses
                                    </p>
                                </div>
                            </div>

                            {/* Activities */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
                                    <Zap className="w-8 h-8 mr-3" />
                                    Action & Spaß
                                </h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                                        <span>
                                            Feuerwehrtechnisches Wissen erlernen
                                            und üben
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></span>
                                        <span>
                                            Wettpaddeln auf dem Fümmelsee
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></span>
                                        <span>Oder-Camp Abenteuer</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 mt-2"></span>
                                        <span>
                                            Leistungsfahrten und Wettbewerbe
                                        </span>
                                    </li>
                                </ul>
                                <div className="bg-white p-4 rounded-xl border border-blue-200 mt-4">
                                    <p className="font-semibold text-blue-800">
                                        Auf jeden Fall haben wir immer Spaß
                                        zusammen! 🎉
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Unser Team
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                                Gemeinsam mit unserem Jugendfeuerwehrwart und
                                Betreuern
                            </p>
                        </div>

                        <div className="text-center text-gray-700">
                            <p className="text-lg mb-6">
                                Gemeinsam mit unserem{' '}
                                <strong>
                                    Jugendfeuerwehrwart Cornelius Witte
                                </strong>
                                , seinem{' '}
                                <strong>Stellvertreter Frederick Witte</strong>{' '}
                                sowie unseren Betreuern eignen wir uns durch
                                Erlernen und Üben feuerwehrtechnisches Wissen
                                an.
                            </p>
                        </div>
                    </div>

                    {/* Join Us Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Mach mit!
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mb-6"></div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                <UserPlus className="w-12 h-12 text-white" />
                            </div>

                            <h3 className="text-3xl font-bold text-orange-700 mb-6">
                                Bist Du zwischen 10 und 16 Jahren alt?
                            </h3>

                            <div className="space-y-6 text-gray-700 text-lg">
                                <p>
                                    Wenn Du zwischen{' '}
                                    <strong>10 und 16 Jahren alt</strong> bist
                                    und gern bei uns mitmachen möchtest, dann
                                    melde Dich doch bei uns!
                                </p>

                                <div className="bg-white p-6 rounded-2xl border-2 border-orange-200">
                                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        Wo du uns findest:
                                    </h4>
                                    <p className="text-orange-700">
                                        Das Feuerwehr-Gerätehaus findest Du{' '}
                                        <strong>
                                            mitten im Dorf gegenüber dem
                                            Spielplatz
                                        </strong>
                                        .
                                    </p>
                                </div>

                                <p>
                                    Wenn Du neugierig geworden bist kannst Du
                                    uns auch gerne einmal im Internet unter{' '}
                                    <a
                                        href="http://www.jf-wendessen.jimdo.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-600 hover:text-orange-700 font-semibold underline"
                                    >
                                        www.jf-wendessen.jimdo.com
                                    </a>{' '}
                                    besuchen oder Du wendest Dich direkt an die
                                    Jugendwarte Cornelius und Frederick Witte.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Ansprechpartner
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600">
                            Unsere Jugendwarte sind für euch da
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Jugendfeuerwehrwart */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-orange-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-2">
                                    Jugendfeuerwehrwart
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Christoph Ruprecht
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                                        <a
                                            href="tel:053319358049"
                                            className="flex items-center justify-center text-orange-600 hover:text-orange-700 transition-colors"
                                        >
                                            <Phone className="w-5 h-5 mr-2" />
                                            05331 / 935849
                                        </a>
                                    </div>
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                                        <a
                                            href="tel:015170168231"
                                            className="flex items-center justify-center text-orange-600 hover:text-orange-700 transition-colors"
                                        >
                                            <Smartphone className="w-5 h-5 mr-2" />
                                            0151 / 70168231
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stellvertretender Jugendfeuerwehrwart */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-red-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">
                                    stellv. Jugendfeuerwehrwart
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Frederick Witte
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl">
                                        <a
                                            href="tel:0533164618"
                                            className="flex items-center justify-center text-red-600 hover:text-red-700 transition-colors"
                                        >
                                            <Phone className="w-5 h-5 mr-2" />
                                            05331 / 64618
                                        </a>
                                    </div>
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl">
                                        <a
                                            href="tel:015775767067"
                                            className="flex items-center justify-center text-red-600 hover:text-red-700 transition-colors"
                                        >
                                            <Smartphone className="w-5 h-5 mr-2" />
                                            01577 / 5767067
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-orange-700 mb-6">
                            Wir freuen uns auf Dich! 🚒
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Deine Jugendfeuerwehr Wendessen
                        </p>
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2 text-orange-600">
                                <Star className="w-6 h-6" fill="currentColor" />
                                <span className="font-semibold">
                                    Über 25 Jahre Jugendfeuerwehr
                                </span>
                                <Star className="w-6 h-6" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
