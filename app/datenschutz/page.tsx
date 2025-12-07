/* eslint-disable react/no-unescaped-entities */
import PageHeader from '@/app/components/PageHeader';
import { Gavel } from '@phosphor-icons/react/dist/ssr';

export const metadata = {
    title: 'Impressum & Datenschutz - Homepage Wendessen',
    description: 'Impressum, rechtliche Hinweise und Datenschutzerklärung der Wendessen-Webseite.',
};

// This component contains the full legal text provided by the user.
// It is used by both the /impressum and /datenschutz pages.
function LegalContent() {
    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md divide-y divide-gray-200 text-gray-800">
            {/* Disclaimer Section */}
            <div className="pb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Impressum & Datenschutzerklärung</h2>
                <p className="text-gray-700">Stand: Dezember 2025</p>
            </div>

            {/* IMPRESSUM */}
            <div className="py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">IMPRESSUM (Pflichtangaben nach § 5 TMG)</h2>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Verantwortlicher für den Inhalt dieser Website (Herausgeber)</h3>
                <div className="pl-4 border-l-4 border-gray-200 text-gray-800">
                    <p className="font-semibold">Dorfgemeinschaft Wendessen e.V.</p>
                    <p>[Vollständige Adresse]</p>
                    <p>[PLZ Ort]</p>
                    <p>Deutschland</p>
                </div>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Vertreter (Vertretungsberechtigter)</h3>
                <div className="pl-4 border-l-4 border-gray-200 space-y-4 text-gray-800">
                    <div>
                        <p><strong className="font-semibold">Name:</strong> Andreas M. Rink</p>
                        <p><strong className="font-semibold">Position:</strong> Ortsbürgermeister / Vorsitzender</p>
                        <p><strong className="font-semibold">Adresse:</strong> Am Gute 2 R, 38300 Wolfenbüttel - Wendessen</p>
                    </div>
                    <div>
                        <p><strong className="font-semibold">Name:</strong> Ennio Marke</p>
                        <p><strong className="font-semibold">Position:</strong> Technischer Vertreter / Webmaster</p>
                        <p><strong className="font-semibold">E-Mail:</strong> ennio@wendessen.de</p>
                        <p><strong className="font-semibold">Telefon:</strong> [Telefonnummer]</p>
                    </div>
                    <p className="text-sm text-gray-700 pt-2">
                        <strong>Rechtliche Funktion:</strong> Beide sind berechtigt, die Website im Namen des Verantwortlichen zu verwalten und Anfragen zu bearbeiten.
                    </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Kontaktinformationen</h3>
                <div className="pl-4 border-l-4 border-gray-200">
                    <p><strong className="font-semibold">Telefon:</strong> 05331 - 7107733</p>
                    <p><strong className="font-semibold">E-Mail (Allgemein):</strong> info@wendessen.de</p>
                    <p><strong className="font-semibold">E-Mail (Datenschutz):</strong> datenschutz@wendessen.de</p>
                    <p><strong className="font-semibold">Webseite:</strong> www.wendessen.de</p>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Inhaltlich Verantwortlicher (gemäß § 10 Absatz 3 MDStV)</h3>
                <p className="pl-4 border-l-4 border-gray-200">Der Ortsrat Wendessen, vertreten durch Andreas M. Rink (Adresse wie oben).</p>
            </div>

            {/* DATENSCHUTZERKLÄRUNG */}
            <div className="py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">DATENSCHUTZERKLÄRUNG (Ausführliche Fassung)</h2>
                <p className="mb-4">Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung von personenbezogenen Daten auf unserer Website.</p>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">1. Verantwortlicher für Datenverarbeitung</h3>
                <p>Siehe Abschnitt "Impressum" oben.</p>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">2. Datenverarbeitung bei Website-Besuch</h3>
                <h4 className="font-medium text-gray-800 mt-4">Automatisch erfasste Daten</h4>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                    <li>Besuchsdatum und -uhrzeit</li>
                    <li>Browser-Typ und Betriebssystem</li>
                    <li>Referer (von welcher Seite Sie kamen)</li>
                    <li>HTTP-Status</li>
                </ul>
                <p className="mt-2"><strong>IP-Adresse:</strong> ❌ NICHT gespeichert</p>
                <p><strong>Tracking:</strong> ❌ KEINE Google Analytics, Matomo oder ähnliche Dienste</p>
                <p><strong>Cookies:</strong> ✅ Nur ein funktionales Cookie (admin-session) für Admin-Login</p>
                <p className="mt-4"><strong>Speicherdauer:</strong> Nicht persistent (Server-Logs sind deaktiviert)</p>
                <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (technische Bereitstellung und Systemsicherheit)</p>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">3. Datenverarbeitung beim Foto-Upload</h3>
                <h4 className="font-medium text-gray-800 mt-4">Was wird gespeichert?</h4>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                    <li>Ihr Name (optional)</li>
                    <li>E-Mail-Adresse (optional, für Rückfragen)</li>
                    <li>Die Fotodatei(en)</li>
                    <li>Ihre Einwilligung (inkl. IP-Adresse und Zeitpunkt als Nachweis)</li>
                </ul>
                <p className="mt-2"><strong>EXIF-Daten:</strong> ✅ Metadaten wie Ort und Datum werden bei der Verarbeitung aus den Bildern entfernt.</p>

                <h4 className="font-medium text-gray-800 mt-4">Speicherort</h4>
                <p>Alle Daten werden auf unserem eigenen Server bei OVH in Frankreich gespeichert und verbleiben somit innerhalb der EU.</p>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                    <li><strong>Datenbank:</strong> PostgreSQL</li>
                    <li><strong>Bilder:</strong> MinIO Object Storage</li>
                </ul>

                <h4 className="font-medium text-gray-800 mt-4">Granulare Einwilligung</h4>
                <p>Sie geben beim Upload zwei separate Einwilligungen:</p>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                    <li><strong>Pflicht:</strong> Einwilligung zur Nutzung auf der Webseite (wendessen.de)</li>
                    <li><strong>Optional:</strong> Einwilligung zur Nutzung auf Social-Media-Kanälen</li>
                </ul>

                <h4 className="font-medium text-gray-800 mt-4">Speicherdauer</h4>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                    <li><strong>Bilder:</strong> Bis Sie Ihre Einwilligung widerrufen.</li>
                    <li><strong>Einwilligungsprotokoll:</strong> 1 Jahr nach Löschung des zugehörigen Bildes zu Nachweiszwecken.</li>
                    <li><strong>Backups:</strong> Gelöschte Bilder können noch bis zu 30 Tage in verschlüsselten Backups vorhanden sein.</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">4. Ihre Rechte als betroffene Person</h3>
                <p>Sie haben jederzeit das Recht auf:</p>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                    <li><strong>Auskunft</strong> über die von uns zu Ihrer Person gespeicherten Daten.</li>
                    <li><strong>Berichtigung</strong> unrichtiger Daten.</li>
                    <li><strong>Löschung</strong> Ihrer Daten ("Recht auf Vergessenwerden").</li>
                    <li><strong>Einschränkung</strong> der Verarbeitung Ihrer Daten.</li>
                    <li><strong>Widerruf</strong> Ihrer Einwilligung(en) – jederzeit, formlos und ohne Angabe von Gründen. Wir garantieren die Umsetzung (Löschung von unseren Plattformen) innerhalb von 24 Stunden.</li>
                    <li><strong>Beschwerde</strong> bei einer Datenschutz-Aufsichtsbehörde.</li>
                </ul>
                <p className="mt-2"><strong>Kontakt für Widerruf und Anfragen:</strong> <a href="mailto:datenschutz@wendessen.de" className="text-blue-600 hover:underline">datenschutz@wendessen.de</a></p>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">5. Auftragsverarbeiter (Dritte mit Datenzugriff)</h3>
                <p className="mb-4">Wir setzen für den Betrieb dieser Seite nur wenige, sorgfältig ausgewählte Dienstleister ein:</p>
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-2 border-b">Unternehmen</th>
                                <th className="text-left p-2 border-b">Rolle</th>
                                <th className="text-left p-2 border-b">Standort</th>
                                <th className="text-left p-2 border-b">DPA vorhanden</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2 border-b">OVH SE</td>
                                <td className="p-2 border-b">Server-Hosting</td>
                                <td className="p-2 border-b">🇫🇷 Frankreich</td>
                                <td className="p-2 border-b">✅ Ja</td>
                            </tr>
                            <tr>
                                <td className="p-2 border-b">Google Ireland Ltd.</td>
                                <td className="p-2 border-b">Push-Benachrichtigungen</td>
                                <td className="p-2 border-b">🇺🇸 USA</td>
                                <td className="p-2 border-b">✅ Ja (Standardvertragsklauseln)</td>
                            </tr>
                            <tr>
                                <td className="p-2 border-b">Mozilla Corporation</td>
                                <td className="p-2 border-b">Push-Benachrichtigungen</td>
                                <td className="p-2 border-b">🇪🇺/🇺🇸 EU/USA</td>
                                <td className="p-2 border-b">✅ Ja (Standardvertragsklauseln)</td>
                            </tr>
                            <tr>
                                <td className="p-2 border-b">Apple Inc.</td>
                                <td className="p-2 border-b">Push-Benachrichtigungen</td>
                                <td className="p-2 border-b">🇺🇸 USA</td>
                                <td className="p-2 border-b">✅ Ja (Standardvertragsklauseln)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                 <p className="text-sm text-gray-700 mt-2"><strong>Wichtig:</strong> Die Browser-Hersteller (Google, Mozilla, Apple) erhalten nur die für die technische Zustellung von Push-Benachrichtigungen notwendigen Tokens, keine direkten personenbezogenen Daten wie Namen oder E-Mails von Ihnen.</p>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">6. Zuständige Datenschutzbehörde</h3>
                <p>Für Beschwerden können Sie sich an die für uns zuständige Aufsichtsbehörde wenden:</p>
                <div className="pl-4 border-l-4 border-gray-200 mt-2">
                    <p><strong>Die Landesbeauftragte für den Datenschutz Niedersachsen</strong></p>
                    <p>Prinzenstraße 5, 30159 Hannover</p>
                    <p>E-Mail: poststelle@lfd.niedersachsen.de</p>
                    <p>Webseite: <a href="https://www.lfd.niedersachsen.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.lfd.niedersachsen.de</a></p>
                </div>
            </div>

            {/* HAFTUNGSAUSSCHLUSS */}
            <div className="py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">HAFTUNGSAUSSCHLUSS</h2>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">1. Haftung für Inhalte</h3>
                <p>Der Autor übernimmt keinerlei Gewähr für die Aktualität, Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen. Haftungsansprüche gegen den Autor, welche sich auf Schäden materieller oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, sind grundsätzlich ausgeschlossen, sofern seitens des Autors kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt. Alle Angebote sind freibleibend und unverbindlich.</p>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">2. Haftung für Links</h3>
                <p>Bei direkten oder indirekten Verweisen auf fremde Internetseiten ("Links"), die außerhalb des Verantwortungsbereiches des Autors liegen, würde eine Haftungsverpflichtung ausschließlich in dem Fall in Kraft treten, in dem der Autor von den Inhalten Kenntnis hat und es ihm technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger Inhalte zu verhindern. Der Autor erklärt hiermit ausdrücklich, dass zum Zeitpunkt der Linksetzung keine illegalen Inhalte auf den zu verlinkenden Seiten erkennbar waren. Auf die aktuelle und zukünftige Gestaltung, die Inhalte oder die Urheberschaft der gelinkten/verknüpften Seiten hat der Autor keinerlei Einfluss. Deshalb distanziert er sich hiermit ausdrücklich von allen Inhalten aller gelinkten/verknüpften Seiten, die nach der Linksetzung verändert wurden.</p>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">3. Urheber- und Kennzeichenrecht</h3>
                <p>Das Copyright für veröffentlichte, vom Autor selbst erstellte Objekte bleibt allein beim Autor der Seiten. Eine Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente, Videosequenzen und Texte in anderen elektronischen oder gedruckten Publikationen ist ohne ausdrückliche Zustimmung des Autors nicht gestattet. Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte geschützten Marken- und Warenzeichen unterliegen uneingeschränkt den Bestimmungen des jeweils gültigen Kennzeichenrechts und den Besitzrechten der jeweiligen eingetragenen Eigentümer.</p>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">4. Rechtswirksamkeit dieses Haftungsausschlusses</h3>
                <p>Sofern Teile oder einzelne Formulierungen dieses Textes der geltenden Rechtslage nicht, nicht mehr oder nicht vollständig entsprechen sollten, bleiben die übrigen Teile des Dokumentes in ihrem Inhalt und ihrer Gültigkeit davon unberührt.</p>
            </div>
            
            {/* BILDRECHTE & HOCHLADUNG */}
             <div className="py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">BILDRECHTE & HOCHLADUNG</h2>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Ihre Garantie bei Upload</h3>
                <p>Wenn Sie ein Foto hochladen, garantieren Sie:</p>
                <ol className="list-decimal list-inside text-gray-700 mt-2 space-y-1">
                    <li><strong>Urheberschaft:</strong> Sie sind Fotograf/in oder haben die vollumfänglichen Nutzungsrechte.</li>
                    <li><strong>Einwilligung abgebildeter Personen:</strong> Alle Personen auf dem Bild haben Ihnen gegenüber der Veröffentlichung zugestimmt.</li>
                    <li><strong>Minderjährigen-Schutz:</strong> Bei Personen unter 16 Jahren liegt Ihnen die Zustimmung der Erziehungsberechtigten vor.</li>
                    <li><strong>Keine Rechtsverletzung:</strong> Das Foto verletzt keine sonstigen Rechte Dritter.</li>
                </ol>
                <p className="mt-2"><strong>Konsequenz bei falscher Garantie:</strong> Sie haften uns gegenüber für alle Ansprüche, die Dritte aufgrund der von Ihnen hochgeladenen Bilder gegen uns geltend machen (Schadensersatz, Abmahnungen).</p>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Freistellung der Website</h3>
                <p>Sie stellen uns von Ansprüchen Dritter frei, <strong>soweit die Rechtsverletzung auf einem von Ihnen zu vertretenden Verstoß gegen die obigen Garantien beruht.</strong></p>
                <p className="mt-2 text-sm text-gray-700">Diese Freistellung gilt nicht, wenn die Rechtsverletzung auf einem Verschulden unsererseits beruht (z.B. wenn wir ein Bild trotz Widerruf nicht löschen).</p>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Widerruf Ihrer Einwilligung</h3>
                <p>Sie können Ihre Einwilligung jederzeit widerrufen:</p>
                 <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li><strong>Formlos</strong> per E-Mail an <a href="mailto:datenschutz@wendessen.de" className="text-blue-600 hover:underline">datenschutz@wendessen.de</a>.</li>
                    <li><strong>Teilweise widerrufbar</strong> (z.B. nur für Social Media).</li>
                    <li><strong>Löschung garantiert:</strong> Wir entfernen das Bild nach Widerruf innerhalb von 24 Stunden von allen uns direkt kontrollierbaren Plattformen.</li>
                </ul>
            </div>
            
             {/* SICHERHEIT & DATENSCHUTZ */}
             <div className="py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">SICHERHEIT & DATENSCHUTZ</h2>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Technische und Organisatorische Maßnahmen (TOMs)</h3>
                 <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                    <li>✅ <strong>HTTPS:</strong> Alle Daten werden verschlüsselt übertragen (TLS 1.2+).</li>
                    <li>✅ <strong>Datenstandort EU:</strong> Datenbank und Bild-Speicher befinden sich ausschließlich in Frankreich.</li>
                    <li>✅ <strong>Backups:</strong> Tägliche, AES-256 verschlüsselte Backups mit einer Vorhaltezeit von 30 Tagen.</li>
                    <li>✅ <strong>EXIF-Daten-Entfernung:</strong> Metadaten werden vor der Veröffentlichung aus Bildern entfernt.</li>
                    <li>✅ <strong>Passwort-Hashing:</strong> Administrator-Passwörter werden mit bcryptjs sicher gehasht.</li>
                    <li>✅ **Datenminimierung:** Es werden keine Server-Access-Logs gespeichert.</li>
                </ul>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">Datenübermittlung in die USA</h3>
                <p>Außer den für Push-Benachrichtigungen technisch notwendigen Tokens, die über die Server der Browser-Hersteller (Google, Apple) laufen, findet keine aktive Datenübermittlung in die USA statt.</p>
             </div>
        </div>
    );
}


export default function LegalPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <PageHeader
                title="Impressum & Datenschutz"
                subtitle="Rechtliche Hinweise und Informationen zur Datenverarbeitung"
                icon={<Gavel />}
                color="gray"
            />
            <main className="container mx-auto px-4 py-12">
                <LegalContent />
            </main>
        </div>
    );
}
