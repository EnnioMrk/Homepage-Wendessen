import Image from 'next/image';
import {
    Users,
    Presentation,
    Globe,
    GameController,
    Fire,
    Gift,
    FilmStrip,
    CalendarBlank,
    User,
    Heart,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import OrganizationContacts from '@/app/components/OrganizationContacts';

export const metadata = {
    title: 'Evang. Seniorenkreis Atzum-Wendessen - Dorfleben',
    description:
        'Evangelischer Seniorenkreis Atzum-Wendessen - Auch im Alter in geselliger Runde etwas unternehmen! Treffen jeden 1. Dienstag im Monat in der Alten Schule.',
};

export default async function SeniorenkreisPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="Evang. Seniorenkreis"
                icon={<Users />}
                backgroundImage="/images/Vereinsleben/seniorenkreis.jpg"
                color="emerald"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Image Section */}
                    <div className="text-center mb-16">
                        <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-100">
                            <Image
                                src="/images/Vereinsleben/seniorenkreis.jpg"
                                alt="Evangelischer Seniorenkreis Atzum-Wendessen"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h2 className="text-3xl font-bold mb-2">
                                    Auch im Alter in geselliger Runde
                                </h2>
                                <p className="text-lg">
                                    Gemeinsam aktiv bleiben und schöne Stunden
                                    erleben
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Introduction */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Herzlich willkommen!
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Auch im Alter in geselliger Runde etwas unternehmen!
                        </p>
                    </div>

                    {/* Meeting Information */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-8">
                            {/* Meeting Location */}
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-emerald-800 mb-3 flex items-center">
                                    <CalendarBlank className="w-6 h-6 mr-2" />
                                    Unsere Treffen
                                </h3>
                                <p className="text-lg text-emerald-800">
                                    Unser Vereinslokal ist die{' '}
                                    <strong>&quot;Alte Schule&quot;</strong>.
                                    Wir treffen uns jeden{' '}
                                    <strong>1. Dienstag im Monat</strong>.
                                </p>
                            </div>

                            {/* Welcome Message */}
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
                                    <Heart className="w-6 h-6 mr-2" />
                                    Jeder ist willkommen
                                </h3>
                                <p className="text-blue-800">
                                    Es ist uns jeder willkommen,{' '}
                                    <strong>Mindestalter: 60 Jahre</strong>. Wir
                                    freuen uns über jeden neuen Gast! Unser
                                    Seniorenkreis ist{' '}
                                    <strong>beitragsfrei</strong>!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Activities Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Unsere Aktivitäten
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Expert Presentations */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Presentation className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-emerald-700 mb-3">
                                    Fachvorträge
                                </h3>
                                <p className="text-gray-700">
                                    Vorträge von Referenten aus der Wirtschaft
                                    und der Medizin
                                </p>
                            </div>

                            {/* Travel Presentations */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Globe className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-700 mb-3">
                                    Lichtbildervorträge
                                </h3>
                                <p className="text-gray-700">
                                    Beeindruckende Bilder aus aller Welt
                                </p>
                            </div>

                            {/* Game Afternoons */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <GameController className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-purple-700 mb-3">
                                    Spielnachmittage
                                </h3>
                                <p className="text-gray-700">
                                    Gemeinsam spielen und Spaß haben
                                </p>
                            </div>

                            {/* Film Afternoon (replaced Faschingstreffen) */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <FilmStrip className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-orange-700 mb-3">
                                    Filmnachmittag
                                </h3>
                                <p className="text-gray-700">
                                    Gemütlicher Filmnachmittag mit Austausch
                                </p>
                            </div>

                            {/* Grilling */}
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Fire className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-yellow-700 mb-3">
                                    Grillen
                                </h3>
                                <p className="text-gray-700">
                                    Gesellige Grillabende im Sommer
                                </p>
                            </div>

                            {/* Christmas */}
                            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Gift className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-red-700 mb-3">
                                    Weihnachtsfeier
                                </h3>
                                <p className="text-gray-700">
                                    Festliche Feier zum Jahresende
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Membership Benefits */}
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Beitragsfrei
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-teal-600 to-emerald-600 mx-auto mb-6"></div>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <h4 className="text-2xl font-semibold text-emerald-800 mb-4">
                                    Kostenlose Mitgliedschaft
                                </h4>
                                <p className="text-lg text-gray-700">
                                    Unser Seniorenkreis ist komplett{' '}
                                    <strong>beitragsfrei</strong>! Kommen Sie
                                    einfach vorbei und erleben Sie schöne
                                    Stunden in netter Gesellschaft.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-16 sm:mt-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                                Ansprechpartnerin
                            </h2>
                            <div className="w-20 h-1 bg-emerald-600 mx-auto mb-8"></div>
                            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4 leading-relaxed">
                                Näheres zu unseren Aktivitäten erfahren Sie bei
                                unserer Vorsitzenden.
                            </p>
                        </div>

                        <div className="max-w-md mx-auto px-4">
                            <OrganizationContacts
                                organization="Seniorenkreis Wendessen"
                                colorClassName="text-emerald-600"
                            />
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-emerald-700 mb-6">
                            Kommen Sie vorbei!
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Wir freuen uns über jeden neuen Gast!
                        </p>
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2 text-emerald-600">
                                <Users className="w-6 h-6" />
                                <span className="font-semibold">
                                    Jeden 1. Dienstag im Monat
                                </span>
                                <Heart className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-600 mt-4 text-sm">
                            Mindestalter: 60 Jahre • Beitragsfrei
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
