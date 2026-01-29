import {
    Fire,
    Users,
    ArrowRight,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import Link from 'next/link';

export const metadata = {
    title: 'Feuerwehr Wendessen - Übersicht',
    description:
        'Übersicht über die Feuerwehr in Wendessen: Freiwillige Feuerwehr und Jugendfeuerwehr',
};

export default function FeuerwehrOverviewPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="Feuerwehr Wendessen"
                subtitle="Wählen Sie einen Bereich"
                icon={<Fire />}
                backgroundImage="/images/Vereinsleben/Freiwillige_Feuerwehr.jpeg"
                color="red"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
                <div className="max-w-6xl mx-auto">
                    {/* Introduction */}
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-2">
                            Willkommen bei der Feuerwehr Wendessen
                        </h2>
                        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-4 sm:mb-6"></div>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                            Erfahren Sie mehr über unsere Einsatzabteilung und die
                            Jugendfeuerwehr
                        </p>
                    </div>

                    {/* Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
                        {/* Freiwillige Feuerwehr / Einsatzabteilung */}
                        <Link
                            href="/dorfleben/vereine/feuerwehr/einsatzabteilung"
                            className="group"
                            aria-label="Zur Freiwilligen Feuerwehr Einsatzabteilung"
                        >
                            <div className="h-full bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-red-500">
                                <div className="bg-gradient-to-br from-red-500 to-orange-600 p-6 sm:p-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                                        <Fire className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                        Freiwillige Feuerwehr
                                    </h3>
                                    <p className="text-red-50 text-sm sm:text-base">
                                        Einsatzabteilung
                                    </p>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
                                        Erfahren Sie mehr über unsere
                                        Einsatzabteilung, unsere Hauptaufgaben und
                                        wie Sie Mitglied werden können.
                                    </p>
                                    <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600 mb-6">
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                                            <span>Retten, Löschen, Bergen, Schützen</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                                            <span>Mitglied werden</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-red-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                                            <span>Dienstzeiten & Kontakt</span>
                                        </li>
                                    </ul>
                                    <div className="flex items-center text-red-600 font-semibold group-hover:text-red-700 text-sm sm:text-base">
                                        <span>Mehr erfahren</span>
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Jugendfeuerwehr */}
                        <Link
                            href="/dorfleben/vereine/jugendfeuerwehr"
                            className="group"
                            aria-label="Zur Jugendfeuerwehr"
                        >
                            <div className="h-full bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-orange-500">
                                <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-6 sm:p-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                                        <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                        Jugendfeuerwehr
                                    </h3>
                                    <p className="text-orange-50 text-sm sm:text-base">
                                        Für Kinder & Jugendliche
                                    </p>
                                </div>
                                <div className="p-6 sm:p-8">
                                    <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
                                        Die Jugendfeuerwehr für Jungen und Mädchen
                                        von 10 bis 16 Jahren - Spaß, Action und
                                        Feuerwehrtechnik!
                                    </p>
                                    <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600 mb-6">
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                                            <span>Für 10- bis 16-Jährige</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-pink-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                                            <span>Jeden Montag 18:00-19:30 Uhr</span>
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 bg-orange-600 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                                            <span>Über 25 Jahre Tradition</span>
                                        </li>
                                    </ul>
                                    <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700 text-sm sm:text-base">
                                        <span>Mehr erfahren</span>
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Bottom Info Section */}
                    <div className="mt-12 sm:mt-16 md:mt-20 text-center">
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg max-w-4xl mx-auto">
                            <Fire className="w-12 h-12 sm:w-16 sm:h-16 text-red-600 mx-auto mb-4 sm:mb-6" />
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700 mb-3 sm:mb-4">
                                Gemeinsam für Wendessen
                            </h3>
                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                                Die Feuerwehr Wendessen ist mehr als nur
                                Brandschutz - wir sind eine Gemeinschaft, die
                                sich für die Sicherheit und das Wohl unserer
                                Gemeinde einsetzt. Werden auch Sie Teil dieser
                                wichtigen ehrenamtlichen Arbeit!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
