import { Shield } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';

export const metadata = {
    title: 'Datenschutzerklärung - Wendessen',
    description:
        'Datenschutzerklärung der offiziellen Website des Ortsteils Wendessen. Informationen zum Umgang mit personenbezogenen Daten.',
};

export default function DatenschutzPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <PageHeader
                title="Datenschutzerklärung"
                subtitle="Informationen zum Umgang mit Ihren Daten"
                icon={<Shield />}
                color="indigo"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Introduction */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-foreground mb-4">
                                Datenschutz
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto"></div>
                        </div>

                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                www.wendessen.de ist ein Angebot der Ortschaft
                                Wendessen. Wir nehmen den Datenschutz ernst. Die
                                Erhebung Ihrer Daten erfolgt im Rahmen der
                                gesetzlichen Vorschriften. Über diese können Sie
                                sich unter{' '}
                                <a
                                    href="https://www.datenschutz.de"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-800 underline"
                                >
                                    www.datenschutz.de
                                </a>{' '}
                                umfassend informieren.
                            </p>
                        </div>
                    </div>

                    {/* Datenprotokollierung */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                            Datenprotokollierung
                        </h3>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Grundsätzlich gilt: Bei jedem Zugriff eines
                                Nutzers auf eine Seite des Ortsteils Wendessen
                                und bei jedem Abruf einer Datei werden über
                                diesen Vorgang Daten in einer Protokolldatei
                                gespeichert. Die Speicherung dient
                                ausschließlich internen systembezogenen und
                                statistischen Zwecken.
                            </p>
                            <p className="text-gray-700 mb-4">
                                <strong>
                                    Im Einzelnen wird über jeden Abruf folgender
                                    Datensatz gespeichert:
                                </strong>
                            </p>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    <li>Name der abgerufenen Datei</li>
                                    <li>Datum und Uhrzeit des Abrufs</li>
                                    <li>übertragene Datenmenge</li>
                                    <li>
                                        Meldung, ob der Abruf erfolgreich war
                                    </li>
                                    <li>
                                        Beschreibung des Typs des verwendeten
                                        Webbrowsers
                                    </li>
                                    <li>anfragende Domain</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Datenschutz und Weitergabe */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                            Datenschutz und Weitergabe
                        </h3>
                        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-2xl text-gray-700 leading-relaxed">
                            <p className="mb-4">
                                Die im Rahmen der Registrierung von Nutzern
                                gemachten Angaben werden nicht an Dritte
                                weitergegeben.
                            </p>
                            <p className="mb-4">
                                Unsere Mitarbeiter sind zur Verschwiegenheit
                                über personenbezogene Daten verpflichtet. Eine
                                Weitergabe dieser Daten an Dritte erfolgt nur,
                                wenn dies für die Vertragserfüllung notwendig
                                ist. Solche Dritte sind ebenfalls zur Beachtung
                                des Datenschutzes der Nutzer verpflichtet.
                            </p>
                            <p>
                                Alle Daten, die sich auf unseren Servern
                                befinden und dort &quot;gehostet&quot; (also
                                aufbewahrt) werden, sind durch hintereinander
                                geschaltete Sicherheitssysteme vor dem Zugriff
                                Unberechtigter gesichert. Mitarbeiter unseres
                                Systemdienstleisters überprüfen die Wirksamkeit
                                des Schutzes regelmäßig.
                            </p>
                        </div>
                    </div>

                    {/* Automatisch erfasste Daten und Cookies */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                            Automatisch erfasste Daten und Cookies
                        </h3>
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl text-gray-700 leading-relaxed">
                            <p className="mb-4">
                                Wenn Sie auf unsere Websites zugreifen, werden
                                gelegentlich automatisch (also nicht über eine
                                Registrierung) erzeugte Informationen gesammelt,
                                die nicht einer bestimmten Person zugeordnet
                                werden können (z.B. vermittels eines
                                Internetbrowsers oder einem Betriebssystem;
                                Domainnamen von Webseiten, von denen aus über
                                einen Weblink ein Zugriff erfolgt; Anzahl der
                                Besuche; durschnittliche Verweilzeit;
                                aufgerufene Seiten).
                            </p>
                            <p className="mb-4">
                                Wir verwenden diese Informationen, um den
                                Auftritt unserer Webseiten ständig zu verbessern
                                und zu aktualisieren sowie um die Attraktivität
                                zu erhöhen. Wenn Sie eine unserer Websites
                                besuchen, kann es sein, dass durch uns
                                veranlasste Informationen in Form eines
                                &quot;Cookies&quot; auf Ihrem Computer abgelegt
                                werden, die Ihren Computer bei Ihrem nächsten
                                Besuch automatisch wieder erkennen.
                            </p>
                            <p>
                                Cookies erlauben uns unter anderem, eine Website
                                Ihren Wünschen anzupassen oder Ihr Kennwort so
                                zu speichern, dass Sie es nicht jedes Mal neu
                                eingeben müssen. Wenn Sie nicht wünschen, dass
                                wir Informationen über Ihren Computer wieder
                                erkennen, stellen Sie Ihren Internetbrowser
                                bitte so ein, dass er Cookies von Ihrer
                                Computerfestplatte löscht, alle Cookies
                                blockiert oder Sie warnt, bevor ein Cookie
                                gespeichert wird.
                            </p>
                        </div>
                    </div>

                    {/* Kontakt für Datenschutzfragen */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-12">
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">
                            Fragen zum Datenschutz
                        </h3>
                        <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-l-4 border-slate-500 p-6 rounded-r-2xl">
                            <p className="text-gray-700 mb-4">
                                Wir kümmern uns um die Einhaltung der
                                Datenschutzbestimmungen in allen Bereichen. Wenn
                                Sie Fragen haben, können Sie sich auch direkt an
                                uns wenden:
                            </p>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                <div className="text-lg font-semibold text-gray-800 mb-2">
                                    Ortsrat Wendessen
                                </div>
                                <div className="space-y-1 text-gray-700">
                                    <p>Andreas M. Rink (Ortsbürgermeister)</p>
                                    <p>Am Gute 2 R</p>
                                    <p>38300 Wolfenbüttel - Wendessen</p>
                                    <div className="mt-3 space-y-1">
                                        <p>
                                            <strong>Telefon:</strong>{' '}
                                            <a
                                                href="tel:053317107733"
                                                className="text-indigo-600 hover:text-indigo-800"
                                            >
                                                05331 - 7107733
                                            </a>
                                        </p>
                                        <p>
                                            <strong>E-Mail:</strong>{' '}
                                            <a
                                                href="mailto:info@wendessen.de"
                                                className="text-indigo-600 hover:text-indigo-800"
                                            >
                                                info@wendessen.de
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg">
                        <p className="text-gray-600 text-sm mb-2">
                            Stand: August 2025 • Ortsrat Wendessen
                        </p>
                        <p className="text-gray-500 text-xs">
                            Diese Datenschutzerklärung kann jederzeit auf
                            unserer Website eingesehen werden.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
