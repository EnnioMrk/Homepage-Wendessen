import Link from 'next/link';
import { FileText, Lock } from 'lucide-react';

export const metadata = {
    title: 'Impressum - Wendessen',
    description:
        'Impressum der offiziellen Website des Ortsteils Wendessen, vertreten durch Ortsbürgermeister Andreas M. Rink.',
};

export default function ImpressumPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-slate-700 via-gray-700 to-slate-800 py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-700/95 to-slate-800/95"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mr-4">
                                <FileText className="w-8 h-8 text-slate-700" />
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                                Impressum
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-blue-400 to-white mx-auto mb-6"></div>
                        <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                            Rechtliche Hinweise und Angaben
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Impressum Section */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-foreground mb-4">
                                Impressum
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-blue-800 mb-4">
                                    Herausgeber
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Herausgeber dieses Webangebot ist der
                                    Ortsrat Wendessen, vertreten durch den
                                    Ortsbürgermeister:
                                </p>

                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                    <div className="text-lg font-semibold text-gray-800 mb-2">
                                        Andreas M. Rink
                                    </div>
                                    <div className="space-y-1 text-gray-700">
                                        <p>Am Gute 2 R</p>
                                        <p>38300 Wolfenbüttel - Wendessen</p>
                                        <div className="mt-3 space-y-1">
                                            <p>
                                                <strong>Telefon:</strong>{' '}
                                                <a
                                                    href="tel:053317107733"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    05331 - 7107733
                                                </a>
                                            </p>
                                            <p>
                                                <strong>E-Mail:</strong>{' '}
                                                <a
                                                    href="mailto:info@wendessen.de"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    info@wendessen.de
                                                </a>
                                            </p>
                                            <p>
                                                <strong>Internet:</strong>{' '}
                                                <a
                                                    href="https://www.wendessen.de"
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    www.wendessen.de
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 border-l-4 border-gray-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                    Rechtsstatus
                                </h3>
                                <p className="text-gray-700">
                                    Der Ortsteil Wolfenbüttel - Wendessen ist
                                    eine Körperschaft des Öffentlichen Rechts.
                                    Sie wird vertreten durch den
                                    Ortsbürgermeister Andreas M. Rink.
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-green-800 mb-3">
                                    Inhaltlich Verantwortlicher
                                </h3>
                                <p className="text-gray-700">
                                    Inhaltlich Verantwortlicher gemäß § 10
                                    Absatz 3 MDStV ist der Ortsrat, vertreten
                                    durch den Ortsbürgermeister: Andreas M. Rink
                                    (Anschrift wie oben)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Haftungsausschluss */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-foreground mb-4">
                                Haftungsausschluss
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto"></div>
                        </div>

                        <div className="space-y-8">
                            {/* 1. Inhalt des Onlineangebotes */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    1. Inhalt des Onlineangebotes
                                </h3>
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-2xl text-gray-700 leading-relaxed">
                                    <p className="mb-4">
                                        Der Autor übernimmt keinerlei Gewähr für
                                        die Aktualität, Korrektheit,
                                        Vollständigkeit oder Qualität der
                                        bereitgestellten Informationen.
                                        Haftungsansprüche gegen den Autor,
                                        welche sich auf Schäden materieller oder
                                        ideeller Art beziehen, die durch die
                                        Nutzung oder Nichtnutzung der
                                        dargebotenen Informationen bzw. durch
                                        die Nutzung fehlerhafter und
                                        unvollständiger Informationen verursacht
                                        wurden, sind grundsätzlich
                                        ausgeschlossen, sofern seitens des
                                        Autors kein nachweislich vorsätzliches
                                        oder grob fahrlässiges Verschulden
                                        vorliegt.
                                    </p>
                                    <p>
                                        Alle Angebote sind freibleibend und
                                        unverbindlich. Der Autor behält es sich
                                        ausdrücklich vor, Teile der Seiten oder
                                        das gesamte Angebot ohne gesonderte
                                        Ankündigung zu verändern, zu ergänzen,
                                        zu löschen oder die Veröffentlichung
                                        zeitweise oder endgültig einzustellen.
                                    </p>
                                </div>
                            </div>

                            {/* 2. Verweise und Links */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    2. Verweise und Links
                                </h3>
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl text-gray-700 leading-relaxed">
                                    <p className="mb-4">
                                        Bei direkten oder indirekten Verweisen
                                        auf fremde Internetseiten
                                        (&quot;Links&quot;), die außerhalb des
                                        Verantwortungsbereiches des Autors
                                        liegen, würde eine Haftungsverpflichtung
                                        ausschließlich in dem Fall in Kraft
                                        treten, in dem der Autor von den
                                        Inhalten Kenntnis hat und es ihm
                                        technisch möglich und zumutbar wäre, die
                                        Nutzung im Falle rechtswidriger Inhalte
                                        verhindern.
                                    </p>
                                    <p>
                                        Der Autor erklärt hiermit ausdrücklich,
                                        dass zum Zeitpunkt der Linkssetzung
                                        keine illegale Inhalte auf den zu
                                        verlinkenden Seiten erkennbar waren. Auf
                                        die aktuelle und zukünftige Gestaltung,
                                        die Inhalte oder die Urheberschaft der
                                        gelinkten/verknüpften Seiten hat der
                                        Autor keinerlei Einfluss. Deshalb
                                        distanziert er sich hiermit ausdrücklich
                                        von allen Inhalten aller
                                        gelinkten/verknüpften Seiten, die nach
                                        der Linksetzung verändert wurden. Diese
                                        Feststellung gilt für ale innerhalb des
                                        eigenen Internetangebotes gesetzten
                                        Links und Verweise sowie für
                                        Fremdeinträge in vom Autor
                                        eingerichteten Gästebüchern,
                                        Diskussionsforen und Mailinglisten. Für
                                        illegale, fehlerhafte oder
                                        unvollständige Inhalte und insbesondere
                                        für Schäden, die aus der Nutzung oder
                                        Nichtnutzung solcherart dargebotener
                                        Informationen entstehen, haftet allein
                                        der Anbieter der Seite, auf welche
                                        verwiesen wurde, nicht derjenige, der
                                        über Links auf die jeweilige
                                        Veröffentlichung lediglich verweist.
                                    </p>
                                </div>
                            </div>

                            {/* 3. Urheber- und Kennzeichenrecht */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    3. Urheber- und Kennzeichenrecht
                                </h3>
                                <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-2xl text-gray-700 leading-relaxed">
                                    <p className="mb-4">
                                        Der Autor ist bestrebt, in allen
                                        Publikationen die Urheberrechte der
                                        verwendeten Grafiken, Tondokumente,
                                        Videosequenzen und Texte zu beachten,
                                        von ihm selbst erstellte Grafiken,
                                        Tondokumente, Videosequenzen und Texte
                                        zurückzugreifen.
                                    </p>
                                    <p className="mb-4">
                                        Alle innerhalb der Internetangebotes
                                        genannten und ggf. durch Dritte
                                        geschützten Marken- und Warenzeichen
                                        unterliegen uneingeschränktden
                                        Bestimmungen des jeweils gültigen
                                        Kennzeichenrechts und den Besitzrechten
                                        der jeweiligen eingetragenen Eigentümer.
                                        Allein aufgrund der bloßen Nennung ist
                                        nicht der Schluß zu ziehen, dass
                                        Markenzeichen nicht durch Rechte Dritter
                                        geschützt sind!
                                    </p>
                                    <p>
                                        Das Copyright für veröffentlichte, vom
                                        Autor selbst erstellte Objekte bleibt
                                        allein beim Autor der Seiten. Eine
                                        Vervielfältigung oder Verwendung solcher
                                        Grafiken, Tondokumente, Videosequenzen
                                        und Texte in anderen elektronischen oder
                                        gedruckten Publikationen ist ohne
                                        ausdrücklich Zustimmung des Autors nicht
                                        gestattet.
                                    </p>
                                </div>
                            </div>

                            {/* 4. Rechtswirksamkeit */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    4. Rechtswirksamkeit dieses
                                    Haftungsausschlusses
                                </h3>
                                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-2xl text-gray-700 leading-relaxed">
                                    <p>
                                        Dieser Haftungsausschluss ist als Teil
                                        des Internetangebotes zu betrachten, von
                                        dem aus auf diese Seite verwiesen wurde.
                                        Sofern Teile oder einzelne
                                        Formulierungen dieses Textes der
                                        geltenden Rechtslage nicht, nicht mehr
                                        oder nicht vollständig entsprechen
                                        sollten, bleiben die übrigen Teile des
                                        Dokumentes in ihrem Inhalt und ihrer
                                        Gültigkeit davon unberührt.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Link to Datenschutzerklärung */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-foreground mb-6">
                                Datenschutzerklärung
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-8"></div>
                            <p className="text-lg text-gray-700 mb-8">
                                Informationen zum Umgang mit Ihren
                                personenbezogenen Daten finden Sie in unserer
                                separaten Datenschutzerklärung.
                            </p>
                            <Link
                                href="/kontakt/datenschutz"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                <Lock className="w-5 h-5 mr-2" />
                                Zur Datenschutzerklärung
                            </Link>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 shadow-lg">
                        <p className="text-gray-600 text-sm">
                            Stand: August 2025 • Ortsrat Wendessen
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
