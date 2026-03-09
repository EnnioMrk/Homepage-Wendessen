import {
    Heart,
    House,
    HandHeart,
    FirstAid,
    Flower,
    ShieldCheck,
    UsersThree,
    Plus,
} from "@phosphor-icons/react/dist/ssr";
import PageHeader from "@/app/components/layout/PageHeader";
import OrganizationContacts from "@/app/components/OrganizationContacts";

export const metadata = {
    title: "Hospizverein Wolfenbüttel e. V. - Vereine",
    description:
        "Hospizverein Wolfenbüttel e. V. - Begleitung schwerstkranker und sterbender Menschen sowie deren Angehörige.",
};

export default async function HospizPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
            <PageHeader
                title="Hospizverein Wolfenbüttel e. V."
                icon={<Heart />}
                backgroundImage="/images/hospiz.jpg"
                color="green"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Welcome Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Im Gutspark Wendessen
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-teal-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Seit 2024 hat der Hospizverein seine Adresse in
                            Wendessen: <strong>Am Gute 2</strong>. Auf Grundlage
                            eines Erbbaurechtsvertrages mit der Stadt
                            Wolfenbüttel hat der Verein das ehemalige Gutshaus
                            zu einem HospizZentrum umgebaut. In seiner
                            Trägerschaft wurde hier zum 1. Juli 2024 ein
                            stationäres Hospiz, die „Hospiz im Gutspark gGmbH“,
                            eröffnet. Unter dem Dach des HospizZentrums hat auch
                            der Verein seine Räume.
                        </p>
                    </div>

                    {/* Steckbrief */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Steckbrief
                            </h3>
                            <div className="w-20 h-1 bg-green-200 mx-auto"></div>
                        </div>

                        <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                            <p>
                                Der Verein wurde 2006 von 13 engagierten
                                Bürgerinnen und Bürgern gegründet. Wie bereits
                                Hospizvereine in anderen Städten setzten sie
                                sich zum Ziel, schwerstkranke und sterbende
                                Menschen, ihre An- und Zugehörigen sowie
                                trauernde Menschen zu begleiten.
                            </p>
                            <p>
                                Derzeit hat der Verein{" "}
                                <strong>780 Mitglieder</strong>. Davon
                                engagieren sich etwa 10 Prozent ehrenamtlich.
                            </p>

                            <div className="bg-green-50 p-8 rounded-3xl border-l-4 border-green-500">
                                <p className="text-green-900 italic text-xl">
                                    &quot;Hospizarbeit ist in den 1980-er Jahren
                                    in Deutschland aus Bürgerinitiativen
                                    hervorgegangen. Sie wird nur in Teilen von
                                    den Krankenkassen finanziert und beruht bis
                                    heute auf bürgerschaftlichem
                                    Engagement.&quot;
                                </p>
                            </div>

                            <p>
                                Hospizarbeit ist daher angewiesen auf
                                Geldspenden und nur realisierbar durch
                                Zeitspenden vieler Ehrenamtlicher. In
                                Wolfenbüttel erfährt die Hospizarbeit
                                vielfältige Unterstützung durch Stiftungen und
                                Unternehmen, Verbände und Vereine sowie
                                zahlreiche Bürgerinnen und Bürger.
                            </p>
                        </div>
                    </div>

                    {/* Leistungen Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Unsere Leistungen
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-green-600 mx-auto mb-6"></div>
                            <p className="text-lg text-gray-600">
                                Vielfältige Angebote für Menschen in ihrer
                                letzten Lebensphase
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Ambulante Begleitung */}
                            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <HandHeart className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-teal-800 mb-3">
                                    Ambulante Begleitung
                                </h3>
                                <p className="text-gray-700">
                                    Qualifizierte Ehrenamtliche begleiten
                                    Schwerstkranke dort, wo sie wohnen.
                                </p>
                            </div>

                            {/* Trauerangebote */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Flower className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-3">
                                    Trauerangebote
                                </h3>
                                <p className="text-gray-700">
                                    Trauercafé, Spaziergänge, Einzel- und
                                    Gruppenbegleitung für Erwachsene und Kinder.
                                </p>
                            </div>

                            {/* Vorsorge */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-emerald-800 mb-3">
                                    Vorsorge
                                </h3>
                                <p className="text-gray-700">
                                    Beratung zu Patientenverfügung,
                                    Vorsorgevollmacht und Betreuungsverfügung.
                                </p>
                            </div>

                            {/* Themen rund ums Lebensende */}
                            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FirstAid className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-cyan-800 mb-3">
                                    Lebensende-Themen
                                </h3>
                                <p className="text-gray-700">
                                    Letzte-Hilfe-Kurse und öffentliche
                                    Veranstaltungen zu ethischen Fragen.
                                </p>
                            </div>

                            {/* Stationäre Versorgung */}
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl shadow-lg text-center md:col-span-2 lg:col-span-2">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <House className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-800 mb-3">
                                    Stationäre Versorgung
                                </h3>
                                <p className="text-gray-700">
                                    Das „Hospiz im Gutspark“ bietet stationäre
                                    Plätze unter der Trägerschaft des Vereins.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Membership Information */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Mitgliedschaft & Unterstützung
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-teal-600 mx-auto mb-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg">
                            <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                                <UsersThree className="w-8 h-8 mr-3" />
                                Jahresbeiträge
                            </h3>

                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-green-200">
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="font-semibold text-green-800">
                                            Einzelpersonen
                                        </span>
                                        <span className="text-2xl font-bold text-green-700 whitespace-nowrap">
                                            40 €
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl border border-green-200">
                                    <div className="flex justify-between items-center gap-4">
                                        <span className="font-semibold text-green-800">
                                            Paare
                                        </span>
                                        <span className="text-2xl font-bold text-green-700 whitespace-nowrap">
                                            60 €
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <a
                                    href="/pdfs/hospizverein-beitrittserklaerung.pdf"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Beitrittsformular
                                </a>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-3xl shadow-lg">
                            <h3 className="text-2xl font-bold text-teal-700 mb-6 flex items-center">
                                <Heart className="w-8 h-8 mr-3" />
                                Spenden
                            </h3>

                            <p className="text-gray-700 mb-6">
                                Sie möchten uns gern finanziell unterstützen?
                                Dann freuen wir uns sehr über Ihre Spende.
                            </p>

                            <div className="bg-white p-6 rounded-xl border border-teal-200">
                                <h4 className="font-semibold text-teal-800 mb-3">
                                    Bankverbindung:
                                </h4>
                                <div className="space-y-2 text-gray-700">
                                    <p>
                                        <strong>
                                            Hospizverein Wolfenbüttel e.V.
                                        </strong>
                                    </p>
                                    <p className="font-mono text-sm bg-teal-50 p-2 rounded">
                                        IBAN: DE 16 2505 0000 0151 8233 33
                                    </p>
                                    <p>Braunschweigische Landessparkasse</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Kontakt
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-teal-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600">
                            Wir sind gerne für Sie da – sprechen Sie uns an.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <OrganizationContacts
                            organizationId="hospizverein-wolfenbuettel-ev"
                            colorClassName="text-green-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
