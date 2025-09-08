import Image from 'next/image';
import {
    Shield,
    Building,
    Clock,
    CheckCircle,
    Wrench,
    Hammer,
    Music,
    MapPin,
    Mail,
    Users,
    Plus,
    Heart,
    Globe,
} from 'lucide-react';

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
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-4 sm:mr-6 flex-shrink-0">
                                <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-blue-700" />
                            </div>
                            <div className="text-left">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                    Kirchbauverein
                                </h1>
                                <p className="text-xl sm:text-2xl md:text-3xl text-blue-100 mt-2">
                                    St. Georg Wendessen
                                </p>
                            </div>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-blue-300 to-white mx-auto mb-8"></div>
                        <p className="text-xl text-blue-200 font-semibold mt-4">
                            Erhaltung • Kultur • Gemeinschaft • Geschichte
                        </p>

                        {/* Decorative elements - hidden on mobile */}
                        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 border-2 border-blue-300/50 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="hidden md:block absolute top-1/3 right-32 w-3 h-3 bg-blue-300/60 rounded-full animate-bounce delay-300"></div>
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
                                    <Building className="w-6 h-6 mr-2" />
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
                                    <Clock className="w-6 h-6 mr-2" />
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
                                    <CheckCircle className="w-6 h-6 mr-2" />
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
                                    <Wrench className="w-8 h-8 mr-3" />
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
                                    <Hammer className="w-8 h-8 mr-3" />
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
                                        <Music className="w-5 h-5 mr-2" />
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
                                        <MapPin className="w-5 h-5 mr-2" />
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
                                    <Mail className="w-5 h-5 mr-2" />
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
                                    <Mail className="w-4 h-4 mr-1" />
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
                                <Users className="w-8 h-8 mr-3" />
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
                                    <Plus className="w-5 h-5 mr-2" />
                                    Beitragsformular
                                </a>
                            </div>
                        </div>

                        {/* Donations */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg">
                            <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
                                <Heart className="w-8 h-8 mr-3" />
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
                                <Globe className="w-5 h-5 mr-2" />
                                www.kirchbauverein-wendessen.de
                            </a>
                            <a
                                href="mailto:kirchbauverein.wendessen@gmail.com"
                                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                            >
                                <Mail className="w-5 h-5 mr-2" />
                                E-Mail schreiben
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
