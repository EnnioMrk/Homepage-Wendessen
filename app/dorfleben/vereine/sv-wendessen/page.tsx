import Image from 'next/image';
import {
    Medal,
    Star,
    Racquet,
    Barbell,
    TennisBall,
    MusicNotesSimple,
    Heart,
    SoccerBall,
    ShoppingCart,
    Baby,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import ContactCardFetcher from '@/app/components/ContactCardFetcher';

export const metadata = {
    title: 'SV Wendessen - Dorfleben',
    description:
        'SV Wendessen - Über 75 Jahre Vereinstradition. Fußball, Gymnastik, Tennis, Tischtennis, Tanzsport und vieles mehr für die ganze Familie.',
};

export default async function SVWendessenPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="SV Wendessen"
                icon={<Medal />}
                backgroundImage="/images/Vereinsleben/SV_Wendessen.JPG"
                color="blue"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Image Section */}
                    <div className="text-center mb-16">
                        <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-100">
                            <Image
                                src="/images/Vereinsleben/SV_Wendessen.JPG"
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
                                    Unser Erfolg
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
                                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <SoccerBall className="w-8 h-8 text-white" />
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
                                <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Barbell className="w-8 h-8 text-white" />
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
                                <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Baby className="w-8 h-8 text-white" />
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
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Racquet className="w-8 h-8 text-white" />
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
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <TennisBall className="w-8 h-8 text-white" />
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
                                <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <MusicNotesSimple className="w-8 h-8 text-white" />
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
                    <div className="mt-16 sm:mt-24 md:mt-32">
                        <div className="text-center mb-12 md:mb-20">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                                Ihre Ansprechpartner
                            </h2>
                            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
                            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4 leading-relaxed">
                                Haben Sie Fragen zu unseren Abteilungen oder möchten Sie Mitglied werden?
                                Unsere Ansprechpartner sind gerne für Sie da.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto px-4">
                            <ContactCardFetcher
                                name="Lennart Meinberg"
                                fallbackRole="Fußballobmann"
                                manualEmail="fussball@sv-wendessen.de"
                                colorClassName="text-green-600"
                            />
                            <ContactCardFetcher
                                name="Stefan Landsperger"
                                fallbackRole="Jugendfußball"
                                manualEmail="fussball-ju@sv-wendessen.de"
                                colorClassName="text-blue-600"
                            />
                            <ContactCardFetcher
                                name="Karlheinz Bock"
                                fallbackRole="Gymnastikabteilung"
                                colorClassName="text-pink-600"
                                manualEmail="gymnastik@sv-wendessen.de"
                            />
                            <ContactCardFetcher
                                name="Hanna Simon"
                                fallbackRole="Kinderturnen"
                                manualEmail="kinderturnen@sv-wendessen.de"
                                colorClassName="text-orange-600"
                            />
                            <ContactCardFetcher
                                name="Manfred Rasche"
                                fallbackRole="Tanzsport"
                                manualEmail="tanzsport@sv-wendessen.de"
                                colorClassName="text-purple-600"
                            />
                            <ContactCardFetcher
                                name="Johannes Grieger"
                                fallbackRole="Tennis"
                                manualEmail="tennis@sv-wendessen.de"
                                colorClassName="text-indigo-600"
                            />
                            <ContactCardFetcher
                                name="Achim Schmeida"
                                fallbackRole="Tischtennis"
                                manualEmail="tischtennis@sv-wendessen.de"
                                colorClassName="text-teal-600"
                            />
                            <ContactCardFetcher
                                name="Thomas Rettberg"
                                fallbackRole={'Fußballförderkreis "Pool 99"'}
                                manualEmail="pool99@sv-wendessen.de"
                                colorClassName="text-yellow-600"
                            />
                            <ContactCardFetcher
                                name="Maruan Nissan"
                                fallbackRole="Vereinswirt"
                                colorClassName="text-red-600"
                            />
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-blue-700 mb-6">
                            Werden Sie Teil unserer Gemeinschaft!
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
