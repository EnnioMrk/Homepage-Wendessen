import {
    Fire,
    Warning,
    Shield,
    UsersThree,
    Clock,
    MapPin,
    Globe,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import OrganizationContacts from '@/app/components/OrganizationContacts';

export const metadata = {
    title: 'Freiwillige Feuerwehr Wendessen - Vereine',
    description:
        'Die Freiwillige Feuerwehr Wendessen - Retten, Löschen, Bergen, Schützen. Werden Sie Teil unserer Gemeinschaft!',
};

export default async function FeuerwehrPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="Feuerwehr"
                icon={<Fire />}
                backgroundImage="/images/Vereinsleben/Freiwillige_Feuerwehr.jpeg"
                color="red"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Welcome Section */}
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-2">
                            Herzlich Willkommen
                        </h2>
                        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-4 sm:mb-6"></div>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            Werden Sie Teil unserer Gemeinschaft und helfen Sie
                            mit, Wendessen sicher zu halten
                        </p>
                    </div>

                    {/* Main Message */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-xl mb-8 sm:mb-12 md:mb-16">
                        <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 sm:p-6 rounded-r-xl sm:rounded-r-2xl">
                                <p className="text-base sm:text-lg">
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

                            <div className="bg-gradient-to-r from-yellow-50 to-red-50 border-2 border-red-500 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-700 mb-3 sm:mb-4 flex items-center">
                                    <Warning className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2 sm:mr-3 flex-shrink-0" />
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
                    <div className="mb-8 sm:mb-12 md:mb-16">
                        <div className="text-center mb-6 sm:mb-8 md:mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-2">
                                Unsere Aktivitäten
                            </h2>
                            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mb-4 sm:mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-red-700 mb-4 sm:mb-6 flex items-center">
                                    <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2 sm:mr-3 flex-shrink-0" />
                                    Hauptaufgaben
                                </h3>
                                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                        <span>
                                            <strong>Retten</strong> - Menschen
                                            und Tiere aus Notlagen befreien
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                        <span>
                                            <strong>Löschen</strong> - Brände
                                            bekämpfen und eindämmen
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                        <span>
                                            <strong>Bergen</strong> - Sachgüter
                                            vor Schäden bewahren
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-red-600 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                        <strong>Schützen</strong> - Gefahren
                                        abwenden
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-green-50 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg">
                                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-700 mb-4 sm:mb-6 flex items-center justify-center md:justify-start">
                                    <UsersThree className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 mr-2 sm:mr-3 flex-shrink-0" />
                                    <span className="break-words">
                                        Gemeinschaftsaktivitäten
                                    </span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 sm:gap-y-3">
                                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>
                                                Wöchentliche Dienste für
                                                Ausbildung und Übung
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>
                                                Tagesfahrten und Ausflüge
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>Zeltlager</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>
                                                Gemeinsame Aktionen und Übungen
                                                mit anderen Feuerwehren
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>
                                                Wettkämpfe auf Stadt-, Kreis-,
                                                Bezirk- und Landesebene
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>Osterfeuer</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-pink-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>Kinderfest</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>Laternenumzug</span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>
                                                Gedenkveranstaltung zum
                                                Volkstrauertag
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>
                                                Evakuierungsübungen im Hospiz
                                            </span>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 sm:mr-3 mt-1.5 flex-shrink-0"></span>
                                            <span>Weihnachtsbaum-Verkauf</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Service Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-12 shadow-xl mb-8 sm:mb-12 md:mb-16">
                        <div className="text-center mb-6 sm:mb-8">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4 px-2">
                                Besuchen Sie uns!
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            <div>
                                <h4 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
                                    Dienstzeiten
                                </h4>
                                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                                    Besuchen Sie einmal den Feuerwehr-Dienst
                                    unserer Feuerwehrkameradinnen und -kameraden
                                    und informieren Sie sich dort über alles
                                    weitere.
                                </p>
                                <div className="bg-white p-3 sm:p-4 rounded-xl border border-blue-200">
                                    <p className="font-semibold text-blue-800">
                                        Die Dienste sind immer mittwochs um
                                        18:30 Uhr
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
                                    Treffpunkt
                                </h4>
                                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                                    Unser Feuerwehrgerätehaus finden Sie im
                                    alten Dorfkern nahe der Kirche.
                                </p>
                                <div className="bg-white p-3 sm:p-4 rounded-xl border border-blue-200">
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
                    <div className="mt-16 sm:mt-24 md:mt-32">
                        <div className="text-center mb-12 md:mb-20">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                                Ihre Ansprechpartner
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-8"></div>
                            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4 leading-relaxed">
                                Haben Sie Fragen zur Einsatzabteilung, der
                                Jugendfeuerwehr oder unserem Förderverein? Wir
                                sind gerne für Sie da.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto px-4">
                            <OrganizationContacts organization="Freiwillige Feuerwehr Wendessen" />
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-8 sm:mt-12 md:mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700 mb-4 sm:mb-6 px-2">
                            Wir freuen uns auf Ihren Besuch!
                        </h3>
                        <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium px-2">
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
