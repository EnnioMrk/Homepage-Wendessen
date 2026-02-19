import Image from 'next/image';
import Link from 'next/link';
import {
    Briefcase,
    EnvelopeSimple,
    Buildings,
    Warning,
    Lightning,
    CheckCircle,
    Heart,
    Bell,
    ChartBar,
    ArrowLeft,
    UsersThree,
} from '@phosphor-icons/react/dist/ssr';

import PageHeader from '@/app/components/layout/PageHeader';

export const metadata = {
    title: 'Bürgermeister berichtet 2026 | Wendessen',
    description:
        'Das passiert im Jahr 2026 in Wendessen – aktuelles Grußwort des Ortsbürgermeisters Andreas M. Rink.',
};

export default function BuergermeisterBerichtetPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="Bürgermeister berichtet"
                subtitle="Das passiert im Jahr 2026 in Wendessen"
                icon={<UsersThree />}
                backgroundImage="/images/Wendessen_Luftaufnahme.jpg"
                color="primary"
            />

            <div className="container mx-auto px-4 pt-8">
                <div className="max-w-5xl mx-auto">
                    <Link
                        href="/dorfleben"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Zurück zu Dorfleben</span>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
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
                                    <EnvelopeSimple className="w-5 h-5 text-primary" />
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

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                        <div className="prose prose-lg max-w-none">
                            <div className="text-center mb-12">
                                <h3 className="text-2xl font-bold text-foreground mb-3">
                                    Das passiert im Jahr 2026 in Wendessen
                                </h3>
                                <p className="text-gray-700 mb-0">
                                    Liebe Wendesserinnen und Wendesser, liebe Besucherinnen und Besucher,
                                </p>
                            </div>

                            <div className="space-y-8 text-gray-700 leading-relaxed">
                                <p className="text-lg">
                                    „Das große Problem mit Vorhersagen besteht darin, dass sie die Zukunft betreffen“, hat einmal ein kluger
                                    Mensch geschrieben. Und weil das natürlich völlig richtig ist, ist es mehr als gewagt vorherzusagen,
                                    was im Jahr 2026 bei uns in Wendessen passieren wird – und was eher nicht.
                                </p>

                                <div className="bg-gradient-to-r from-indigo-50 to-sky-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl">
                                    <h4 className="text-xl font-semibold text-indigo-800 mb-3 flex items-center">
                                        <Buildings className="w-6 h-6 mr-2" />
                                        Neubaugebiet Leipziger Allee
                                    </h4>
                                    <p className="mb-4">
                                        Fangen wir doch einfach mal mit unserem Neubaugebiet an der Leipziger Allee an. Eigentlich sollten
                                        da bereits im letzten Jahr die Bagger rollen und die Erschließungsarbeiten auf Hochtouren laufen.
                                        Und ein Name für die neue Straße wurde auch schon gefunden: Zuckerring soll sie heißen, das
                                        Ergebnis eines Ideenwettbewerbes, zu dem der Ortsrat aufgerufen hatte.
                                    </p>
                                    <p className="mb-4">
                                        Doch die notwendigen rechtlichen und formalen Schritte zur Bebauung, die mit dem Erwerb des
                                        Geländes der ehemaligen Zuckerfabrik durch den Investor so zügig begannen, sind ins Stocken
                                        geraten. Die in vielen arbeitsreichen Monaten zwischen dem Eigentümer und der Stadtverwaltung
                                        erstellten Pläne liegen vor und warten auf Verabschiedung. Doch es hakt – und woran das genau
                                        liegt, darüber schweigen sich die beteiligten Parteien weitgehend aus.
                                    </p>
                                    <p>
                                        „Anpassungen im städtebaulichen Vertrag“ müssten noch vorgenommen werden, und „in den Bereichen
                                        Artenschutz und Altlasten“ stünden noch Abstimmungen aus, hieß es in der letzten
                                        Ortsratssitzung 2025. Für uns in Wendessen bedeutet das: Wir hoffen sehr, dass sich die
                                        Verhandlungspartner verständigen und auch die noch offenen Punkte geklärt werden können – auf dass
                                        es nunmehr im Jahr 2026 losgeht.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-r-2xl">
                                    <h4 className="text-xl font-semibold text-red-800 mb-3 flex items-center">
                                        <Warning className="w-6 h-6 mr-2" />
                                        Feuerwehrhaus und Bushaltestelle
                                    </h4>
                                    <p className="mb-4">
                                        Sehr viel besser sieht es bei unserem anderen großen Bauprojekt aus – noch im Januar 2026 soll
                                        der Spatenstich für das Feuerwehrhaus an der Ecke Leipziger Allee / Ahlumer Weg erfolgen! Darüber
                                        freuen sich alle Beteiligten, besonders die Kameradinnen und Kameraden unserer Feuerwehr sehr.
                                    </p>
                                    <p className="mb-4">
                                        Wenn alles läuft wie geplant, steht dann 2027 endlich der Auszug aus der Alten Schule und der
                                        Einzug in die neuen Räumlichkeiten an.
                                    </p>
                                    <p>
                                        Der Feuerwehrneubau hat übrigens auch zur Folge, dass die Schulbushaltestelle verlegt werden
                                        muss – das ist unschön, aber unabdingbar. „Umgezogen“ ist bereits die Infotafel, die ebenfalls der
                                        künftigen Feuerwehrausfahrt im Wege stand – sie steht nun gegenüber dem Friedhof an der Straße Am
                                        Gute.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
                                    <h4 className="text-xl font-semibold text-green-800 mb-3 flex items-center">
                                        <Lightning className="w-6 h-6 mr-2" />
                                        Radwege und Verkehrssicherheit
                                    </h4>
                                    <p>
                                        In 2024 haben wir uns sehr über den neuen Radweg entlang der B 79 nach Wolfenbüttel gefreut,
                                        2025 folgte erfreulicherweise der Radweg zum Ahlumer Kreisel – beides total gute Nachrichten für
                                        die Zweiradfreunde (und auch für Jogger und Spaziergänger) und für die Verkehrssicherheit. Und
                                        für 2026 hat uns der Landkreis Wolfenbüttel fest versprochen, einen Radweg nach Klein-Denkte in
                                        Angriff zu nehmen. Kein anderes Dorf im Landkreis ist dann so perfekt mit Wegen erschlossen und
                                        verbunden wie Wendessen.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                                    <h4 className="text-xl font-semibold text-purple-800 mb-3 flex items-center">
                                        <Heart className="w-6 h-6 mr-2" />
                                        Ehrenamt, Vereine und Zusammenhalt
                                    </h4>
                                    <p className="mb-4">
                                        Es sind aber auch die vielen kleineren Dinge, die unser Leben in den letzten Jahren bereicherten
                                        und auf die wir uns auch im Jahr 2026 freuen dürfen: die vielen Feste, Feiern und Veranstaltungen,
                                        die unsere Vereine und die sie tragenden Ehrenamtlichen auf die Beine stellen.
                                    </p>
                                    <p className="mb-4">
                                        Was wäre Wendessen ohne die Konzerte des Kirchbauvereins, ohne die Gottesdienste der
                                        Kirchengemeinde, die Feiern des Spritzenhausvereins, des Schützenvereins, der IDW und der
                                        Kleingärtner? Wer denkt nicht gerne an Eigeninitiativen, denen wir so tolle Dinge wie die
                                        nagelneue Boulebahn in der Dorfmitte, den erfolgreichen Flohmarkt oder die Etablierung eines
                                        WhatsApp-Informationskanals verdanken?
                                    </p>
                                    <p>
                                        Ihnen allen gebührt unser uneingeschränkter Dank für ihren großartigen ehrenamtlichen Einsatz,
                                        denn sie sorgen dafür, dass Wendessen auch 2026 ein so vielfältiger lebens- und liebenswerter Ort
                                        bleibt. Übrigens: Alle Vereinsvertreter freuen sich darüber, wenn noch mehr mitmachen – wer sich
                                        angesprochen fühlt, findet auf dieser Internetseite des Dorfes alle Kontaktdaten.
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl">
                                    <h4 className="text-xl font-semibold text-yellow-800 mb-3 flex items-center">
                                        <Bell className="w-6 h-6 mr-2" />
                                        Storchennest an der alten Mühle
                                    </h4>
                                    <p className="mb-4">
                                        Was passiert noch in diesem Jahr? Im letzten Jahr haben wir auf der Wiese an der alten Mühle ein
                                        Storchennest aufgestellt. Der Standort nahe der Altenau sei für eine Ansiedlung prima geeignet,
                                        berichteten uns Fachleute.
                                    </p>
                                    <p>
                                        Jetzt hoffen wir sehr, dass Störche entweder lesen können oder gut zugehört haben – und dass sich
                                        zumindest einer, besser noch zwei, für Wendessen als neuen Lebensmittelpunkt entscheiden. Aber wie
                                        gesagt: Es ist so ein Ding mit den Vorhersagen …
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-500 p-6 rounded-r-2xl">
                                    <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                                        <ChartBar className="w-6 h-6 mr-2" />
                                        Kommunalwahl im September 2026
                                    </h4>
                                    <p className="mb-4">
                                        Liebe Mitbürgerinnen und Mitbürger, im September stehen in ganz Niedersachsen Kommunalwahlen an
                                        und auch Wendessen wird einen neuen Ortsrat wählen. Ich weiß nicht, wie Sie das sehen – aber
                                        Kommunalwahlen sind in meinen Augen eine einfache Möglichkeit, direkt und unmittelbar seine
                                        Bewertung des Geleisteten und seine Wünsche für die Zukunft auszudrücken.
                                    </p>
                                    <p className="mb-4">
                                        Konkret an der Gestaltung seines Dorfes und seines eigenen Lebens direkt vor der Wohnungs- und
                                        Haustür mitzuwirken, ist allemal besser, als meckernd in der Ecke zu stehen.
                                    </p>
                                    <p>
                                        Meine herzliche Bitte lautet daher: Machen Sie mit, beteiligen Sie sich, bringen Sie sich ein –
                                        entweder als Kandidatin oder Kandidat für den Ortsrat oder eben als Wählerin oder Wähler am
                                        13. September. Und sehen Sie es mir bitte nach, wenn ich einmal mehr die Hoffnung äußere, dass
                                        Wendessen auch weiterhin vom Mitmischen extremer Stimmungsmacher und demokratiefeindlicher Hetzer
                                        verschont bleibt.
                                    </p>
                                </div>

                                <div className="bg-primary/10 border-2 border-primary/20 p-8 rounded-2xl text-center">
                                    <p className="text-lg font-semibold text-foreground mb-4">
                                        In diesem Sinne wünsche ich Ihnen und uns allen ein erfolg- und ereignisreiches,
                                        glückliches Jahr 2026.
                                    </p>
                                    <p className="text-xl font-bold text-primary mb-6">
                                        Bleiben Sie gesund und zuversichtlich! Alles Gute,
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

                                <div className="pt-2">
                                    <Link
                                        href="/dorfleben/archiv/ortsrat-bericht/2023"
                                        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-medium"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Zum Archivbericht 2023</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
