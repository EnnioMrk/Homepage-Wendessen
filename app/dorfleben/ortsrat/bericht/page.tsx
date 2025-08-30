import Image from 'next/image';
import Link from 'next/link';
import {
    Briefcase,
    Mail,
    CheckCircle,
    AlertTriangle,
    Cake,
    Building2,
    Heart,
    Bell,
    Zap,
    BarChart3,
} from 'lucide-react';

export const metadata = {
    title: 'Bürgermeister berichtet - Grußwort 2023 | Wendessen',
    description:
        'Grußwort des Ortsbürgermeisters Andreas Rink zum Jahr 2023 - Rückblick und Ausblick für Wendessen',
};

export default function BuergermeisterBerichtetPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary via-secondary to-primary py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Wendessen_Luftaufnahme.jpg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                            Bürgermeister berichtet
                        </h1>
                        <div className="w-32 h-2 bg-gradient-to-r from-accent to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed">
                            Grußwort zum Jahr 2023
                        </p>

                        {/* Decorative elements */}
                        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-accent/50 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="absolute top-1/3 right-32 w-3 h-3 bg-accent/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Author Section */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16 bg-white rounded-3xl p-8 shadow-xl">
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 relative overflow-hidden rounded-2xl shadow-lg ring-4 ring-primary/20">
                                <Image
                                    src="/images/Ortsrat/Andreas_Rink.JPG"
                                    alt="Andreas Rink - Ortsbürgermeister"
                                    fill
                                    className="object-cover object-center"
                                />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                Andreas M. Rink
                            </h2>
                            <p className="text-xl text-primary font-semibold mb-4">
                                Ortsbürgermeister
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 text-gray-600 justify-center md:justify-start">
                                <div className="flex items-center space-x-2">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    <span>Marketingberater</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <Link
                                        href="/kontakt/andreas-rink"
                                        className="text-primary hover:text-primary-dark transition-colors"
                                    >
                                        Kontakt aufnehmen
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Report Content */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                        <div className="prose prose-lg max-w-none">
                            {/* Opening */}
                            <div className="text-center mb-12">
                                <h3 className="text-2xl font-bold text-foreground mb-6">
                                    Liebe Mitbürgerinnen, liebe Mitbürger,
                                </h3>
                            </div>

                            {/* Content Sections */}
                            <div className="space-y-8 text-gray-700 leading-relaxed">
                                <p className="text-lg">
                                    der Start ins Jahr 2023 wird von einer
                                    Mischung aus Zuversicht und Sorgen
                                    begleitet.
                                </p>

                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
                                    <h4 className="text-xl font-semibold text-green-800 mb-3 flex items-center">
                                        <CheckCircle className="w-6 h-6 mr-2" />
                                        Zuversicht
                                    </h4>
                                    <p>
                                        Zuversicht, weil wir nach über zwei
                                        Jahren Corona langsam und behutsam
                                        wieder zu der gewohnten Normalität aus
                                        Vor-Pandemie-Zeiten zurückfinden.
                                        Treffen und Versammlungen sind wieder
                                        ohne größere Auflagen möglich, das ist
                                        gut für unser Zusammenleben im Dorf und
                                        für unsere Vereine.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 p-6 rounded-r-2xl">
                                    <h4 className="text-xl font-semibold text-orange-800 mb-3 flex items-center">
                                        <AlertTriangle className="w-6 h-6 mr-2" />
                                        Herausforderungen
                                    </h4>
                                    <p>
                                        Sorgen machen uns der Krieg in der
                                        Ukraine und dessen Folgen. Steigende
                                        Preise bei der Energieversorgung und
                                        beim Einkaufen hinterlassen tiefe Spuren
                                        und bringen viele Mitbürgerinnen und
                                        Mitbürger, trotz aller Hilfsmaßnahmen
                                        des Staates, in echte Bedrängnis und
                                        verlangen uns allen Solidarität ab. Wir
                                        leben in einem stabilen Land, und dass
                                        dieses so bleibt und nicht rechte
                                        Rattenfänger die Ängste der Menschen für
                                        ihre Zwecke ausnutzen, bleibt eine
                                        Aufgabe für uns alle.
                                    </p>
                                </div>

                                {/* 850 Jahre Wendessen */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                                    <h4 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
                                        <Cake className="w-6 h-6 mr-2" />
                                        850 Jahre Wendessen
                                    </h4>
                                    <p>
                                        Wendessen konnte im vergangenen Jahr
                                        sein 850-jähriges Bestehen
                                        (nach)-feiern, und das war ein ganz
                                        tolles Wochenende für Jung und Alt.
                                        Vielen Dank all denjenigen, die zum
                                        Gelingen beigetragen haben! Runde
                                        Geburtstage feierten auch der
                                        Schützenverein, der Kirchbauverein und
                                        unsere Kleingärtner – immer begleitet
                                        von einem ordentlichen
                                        Publikumszuspruch.
                                    </p>
                                </div>

                                {/* Entwicklungen 2022 */}
                                <h4 className="text-2xl font-bold text-foreground mt-12 mb-6">
                                    Entwicklungen im Jahr 2022
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                                        <h5 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                                            <Building2 className="w-5 h-5 mr-2" />
                                            Baugebiet
                                        </h5>
                                        <p className="text-sm">
                                            Für unser neues Baugebiet auf dem
                                            Stiller-Gelände an der Bahn wurde
                                            ein Investor gefunden, und die
                                            ersten Schritte zur Bebauung liegen
                                            hinter uns.
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border border-green-100">
                                        <h5 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                                            <Heart className="w-5 h-5 mr-2" />
                                            Hospiz
                                        </h5>
                                        <p className="text-sm">
                                            Am Leuchtturmprojekt &quot;Hospiz im
                                            Gutspark&quot; wird trotz einer
                                            vorhandenen Finanzierungslücke
                                            fleißig weitergebaut und der Verein
                                            ist zuversichtlich, die fehlenden
                                            Gelder aufzutreiben.
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-100">
                                        <h5 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                                            <Bell className="w-5 h-5 mr-2" />
                                            Kirchenglocken
                                        </h5>
                                        <p className="text-sm">
                                            Nach vielen Problemen sind die neuen
                                            Glocken für unsere Kirche gegossen
                                            und warten darauf, im Jahr 2023 ganz
                                            neue Töne ins Dorf zu bringen.
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                                        <h5 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                                            <Zap className="w-5 h-5 mr-2" />
                                            Sport
                                        </h5>
                                        <p className="text-sm">
                                            Wendessen hat Geschichte geschrieben
                                            – unsere tollen Fußballerinnen
                                            spielen jetzt in der Oberliga und
                                            setzen dort ihren Erfolgskurs fort.
                                        </p>
                                    </div>
                                </div>

                                {/* Verkehr */}
                                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-500 p-6 rounded-r-2xl">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                                        <BarChart3 className="w-6 h-6 mr-2" />
                                        Verkehr - Ein Dauerbrenner
                                    </h4>
                                    <p>
                                        Die kritischen Situationen auf der
                                        Leipziger Allee gehören nun endlich
                                        durch das verhängte Parkverbot der
                                        Vergangenheit an, im Ortseingang vom
                                        Atzumer Kreisel aus mahnt seit dem
                                        Frühjahr 2022 eine Tempomessanlage die
                                        Autofahrer zu einer angemessenen
                                        Geschwindigkeit.
                                    </p>
                                </div>

                                {/* Ausblick 2023 */}
                                <h4 className="text-2xl font-bold text-foreground mt-12 mb-6">
                                    Ausblick auf das Jahr 2023
                                </h4>

                                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 p-8 rounded-2xl">
                                    <p className="mb-6">
                                        Im Namen des gesamten Ortsrates darf ich
                                        versichern - wir bleiben am Ball, wenn
                                        es um Themen wie verkehrsberuhigende
                                        Maßnahmen, um Tempolimits und um
                                        Sicherheit geht. Wir werden den Prozess
                                        der Entwicklung unseres Baugebietes und
                                        der Realisierung des
                                        Feuerwehrgerätehauses an der Ecke
                                        Leipziger Allee aktiv begleiten, kümmern
                                        uns um eine anständige Gestaltung und
                                        Pflege unserer Grünflächen und
                                        Spielplätze – und natürlich machen wir,
                                        wo es nur geht, Druck, damit unser
                                        Bahnhaltepunkt doch früher als im Jahr
                                        2027 kommt.
                                    </p>

                                    <div className="bg-accent/20 p-4 rounded-xl mb-6">
                                        <p className="font-semibold text-accent-dark">
                                            <strong>Übrigens:</strong> Wir
                                            werden noch im Frühjahr 2023 eine
                                            Bücherzelle gegenüber der Kirche
                                            aufstellen und damit den Mittelpunkt
                                            unseres Dorfes noch attraktiver
                                            machen.
                                        </p>
                                    </div>

                                    <p>
                                        Und selbstverständlich haben wir alle
                                        offene Ohren für die Anliegen und
                                        Wünsche, die von den Vereinen und von
                                        den Bürgerinnen und Bürgern aus dem Dorf
                                        an uns herangetragen werden.
                                    </p>
                                </div>

                                {/* Closing */}
                                <div className="text-center py-8">
                                    <p className="text-lg font-semibold text-foreground mb-4">
                                        In diesem Sinne wünsche ich Ihnen,
                                        wünsche ich uns allen ein glückliches,
                                        gesundes und erfolgreiches Jahr 2023.
                                    </p>
                                    <p className="text-xl font-bold text-primary mb-6">
                                        Bleiben Sie zuversichtlich!
                                    </p>

                                    <div className="inline-block bg-white p-6 rounded-2xl shadow-lg border border-primary/10">
                                        <p className="text-lg font-semibold text-foreground">
                                            Andreas M. Rink
                                        </p>
                                        <p className="text-primary font-medium">
                                            Ortsbürgermeister
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
