import {
    Flame,
    AlertTriangle,
    Shield,
    Cake,
    Clock,
    MapPin,
    User,
    Phone,
    Globe,
} from 'lucide-react';

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
                                <Flame className="w-12 h-12 text-red-600" />
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
                                    <AlertTriangle className="w-8 h-8 mr-3" />
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
                                    <Shield className="w-8 h-8 mr-3" />
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
                                    <Cake className="w-8 h-8 mr-3" />
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
                                    <Clock className="w-6 h-6 mr-2" />
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
                                    <MapPin className="w-6 h-6 mr-2" />
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
                                    <User className="w-10 h-10 text-white" />
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
                                        <Phone className="w-5 h-5 mr-2" />
                                        0157/54517195
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Stellvertretender Ortsbrandmeister */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-orange-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <User className="w-10 h-10 text-white" />
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
                                        <Phone className="w-5 h-5 mr-2" />
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
                                <Globe
                                    className="w-6 h-6"
                                    fill="currentColor"
                                />
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
