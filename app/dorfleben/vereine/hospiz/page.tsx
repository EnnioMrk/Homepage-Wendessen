import {
    Heart,
    House,
    HandHeart,
    FirstAid,
    Flower,
    ShieldCheck,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import OrganizationContacts from '@/app/components/OrganizationContacts';

export const metadata = {
    title: 'Hospizverein Wolfenbüttel e. V. - Vereine',
    description:
        'Hospizverein Wolfenbüttel e. V. - Begleitung schwerstkranker und sterbender Menschen sowie deren Angehörige.',
};

export default async function HospizPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
            <PageHeader
                title="Hospizverein Wolfenbüttel e. V."
                icon={<Heart />}
                color="green"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Welcome Section */}
                    <div className="text-center mb-8 sm:mb-12 md:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-2">
                            Im Gutspark Wendessen
                        </h2>
                        <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-green-600 to-teal-600 mx-auto mb-4 sm:mb-6"></div>
                        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                            Seit 2024 hat der Hospizverein seine Adresse in Wendessen: <strong>Am Gute 2</strong>.
                            Auf Grundlage eines Erbbaurechtsvertrages mit der Stadt Wolfenbüttel hat der Verein das ehemalige Gutshaus zu einem HospizZentrum umgebaut.
                            In seiner Trägerschaft wurde hier zum 1. Juli 2024 ein stationäres Hospiz, die „Hospiz im Gutspark gGmbH“, eröffnet.
                            Unter dem Dach des HospizZentrums hat auch der Verein seine Räume.
                        </p>
                    </div>

                    {/* Steckbrief */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-xl mb-8 sm:mb-12 md:mb-16 border-t-4 border-green-500">
                        <div className="text-center mb-8">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Steckbrief</h3>
                            <div className="w-16 h-1 bg-green-200 mx-auto"></div>
                        </div>

                        <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                            <p>
                                Der Verein wurde 2006 von 13 engagierten Bürgerinnen und Bürgern gegründet. Wie bereits Hospizvereine in anderen Städten setzten sie sich zum Ziel, schwerstkranke und sterbende Menschen, ihre An- und Zugehörigen sowie trauernde Menschen zu begleiten.
                            </p>
                            <p>
                                Derzeit hat der Verein <strong>750 Mitglieder</strong>. Davon engagieren sich etwa 10 Prozent ehrenamtlich.
                            </p>

                            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                <p className="text-green-900 italic">
                                    &quot;Hospizarbeit ist in den 1980-er Jahren in Deutschland aus Bürgerinitiativen hervorgegangen. Sie wird nur in Teilen von den Krankenkassen finanziert und beruht bis heute auf bürgerschaftlichem Engagement.&quot;
                                </p>
                            </div>

                            <p>
                                Sie ist daher angewiesen auf Geldspenden und nur realisierbar durch Zeitspenden vieler Ehrenamtlicher. In Wolfenbüttel erfährt die Hospizarbeit vielfältige Unterstützung durch Stiftungen und Unternehmen, Verbände und Vereine sowie zahlreiche Bürgerinnen und Bürger.
                            </p>
                        </div>
                    </div>

                    {/* Leistungen Section */}
                    <div className="mb-8 sm:mb-12 md:mb-16">
                        <div className="text-center mb-6 sm:mb-8 md:mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-2">
                                Die Leistungen des Vereins
                            </h2>
                            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-teal-600 to-green-600 mx-auto mb-4 sm:mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Ambulante Begleitung */}
                            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-teal-500 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-bold text-teal-800 mb-3 flex items-center">
                                    <HandHeart className="w-6 h-6 mr-2" />
                                    Ambulante Begleitung
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Schwerstkranke Menschen jeden Alters werden begleitet: Die in einem 140-stündigen Kurs vorbereiteten Ehrenamtlichen kommen dorthin, wo die Menschen wohnen.
                                </p>
                            </div>

                            {/* Trauerangebote */}
                            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
                                    <Flower className="w-6 h-6 mr-2" />
                                    Angebote für Trauernde
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Differenzierte Angebote für trauernde Erwachsene und auch Kinder: Die qualifizierten Trauerbegleiter/-innen veranstalten monatlich ein Trauercafé sowie Trauer-Spaziergänge, bieten Einzelbegleitung und Begleitung in einer festen Gruppe an.
                                </p>
                            </div>

                            {/* Vorsorge */}
                            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-emerald-500 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-bold text-emerald-800 mb-3 flex items-center">
                                    <ShieldCheck className="w-6 h-6 mr-2" />
                                    Vorsorge
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Ehrenamtliche beraten ausführlich zur Patientenverfügung und informieren über Vorsorgevollmacht und Betreuungsverfügung.
                                </p>
                            </div>

                            {/* Themen rund ums Lebensende */}
                            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-bold text-cyan-800 mb-3 flex items-center">
                                    <FirstAid className="w-6 h-6 mr-2" />
                                    Themen rund ums Lebensende
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    In Letzte-Hilfe-Kursen vermitteln Ehrenamtliche, was die Teilnehmenden für Menschen in der letzten Lebensphase tun und wie sie Beschwerden lindern können. In öffentlichen Veranstaltungen setzt sich der Hospizverein mit Themen wie Vorsorge, Sterbehilfe und Organspende auseinander.
                                </p>
                            </div>

                            {/* Stationäre Versorgung */}
                            <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow md:col-span-2">
                                <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                                    <House className="w-6 h-6 mr-2" />
                                    Stationäre Versorgung
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    Seit 2024 können Menschen, deren Symptomlast zu Hause nicht mehr gelindert werden kann, nach ärztlicher Verordnung einen Platz im „Hospiz im Gutspark“ bekommen. Das Hospiz wird in Trägerschaft des Hospizvereins geführt.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-16 sm:mt-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                                Kontakt
                            </h2>
                            <div className="w-20 h-1 bg-green-600 mx-auto mb-8"></div>
                            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4 leading-relaxed">
                                Haben Sie Fragen zu unserer Arbeit oder möchten Sie uns unterstützen?
                                Wir sind gerne für Sie da.
                            </p>
                        </div>

                        <div className="max-w-md mx-auto px-4">
                            <OrganizationContacts
                                organization="Hospizverein Wolfenbüttel"
                                colorClassName="text-green-600"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
