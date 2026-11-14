import Link from 'next/link';
import styles from './legal.module.css';

/**
 * The full legal text of wendessen.de, kept word for word from the shipped
 * version. Two typographic substitutions only: the shipped ✅/❌/flag emoji are
 * written as German words, and the literal `**Datenminimierung:**` markup is a
 * real <strong>. Three placeholders remain because no value exists in the repo
 * or in the site settings — they are marked and reported on the page.
 */
export function LegalText() {
    return (
        <div className="legal">
            <div className="notice notice--warn">
                <strong>Zwei Angaben sind offen</strong>
                <span>
                    Die vollständige Anschrift der Dorfgemeinschaft Wendessen
                    e.&nbsp;V. und die Telefonnummer des technischen Vertreters
                    liegen nicht vor. Beide stehen im Text als [Platzhalter] und
                    werden ergänzt, sobald die Angaben bestätigt sind.
                </span>
            </div>

            <h2 id="werk">Impressum &amp; Datenschutzerklärung</h2>
            <p className="muted small">Stand: Dezember 2025</p>

            <h2 id="impressum">IMPRESSUM (Pflichtangaben nach § 5 TMG)</h2>

            <h3>Verantwortlicher für den Inhalt dieser Website (Herausgeber)</h3>
            <address className={styles.address}>
                <strong>Dorfgemeinschaft Wendessen e.V.</strong>
                <span className={styles.placeholder}>
                    [Vollständige Adresse]
                </span>
                <span className={styles.placeholder}>[PLZ Ort]</span>
                <span>Deutschland</span>
            </address>

            <h3>Vertreter (Vertretungsberechtigter)</h3>
            <div className={styles.group}>
                <div>
                    <p>
                        <strong>Name:</strong> Christina Balder
                    </p>
                    <p>
                        <strong>Position:</strong> Ortsbürgermeisterin
                    </p>
                    <p>
                        <strong>Adresse:</strong> Lindenblick 12, 38300
                        Wolfenbüttel - Wendessen
                    </p>
                </div>
                <div>
                    <p>
                        <strong>Name:</strong> Ennio Marke
                    </p>
                    <p>
                        <strong>Position:</strong> Technischer Vertreter /
                        Webmaster
                    </p>
                    <p>
                        <strong>E-Mail:</strong>{' '}
                        <a href="mailto:ennio@wendessen.de">
                            ennio@wendessen.de
                        </a>
                    </p>
                    <p>
                        <strong>Telefon:</strong>{' '}
                        <span className={styles.placeholder}>
                            [Telefonnummer]
                        </span>
                    </p>
                </div>
                <p className="small">
                    <strong>Rechtliche Funktion:</strong> Beide sind berechtigt,
                    die Website im Namen des Verantwortlichen zu verwalten und
                    Anfragen zu bearbeiten.
                </p>
            </div>

            <h3>Kontaktinformationen</h3>
            <div className={styles.group}>
                <p>
                    <strong>Telefon:</strong>{' '}
                    <a href="tel:05331859860">05331 - 859860</a>
                </p>
                <p>
                    <strong>E-Mail (Allgemein):</strong>{' '}
                    <a href="mailto:info@wendessen.de">info@wendessen.de</a>
                </p>
                <p>
                    <strong>E-Mail (Datenschutz):</strong>{' '}
                    <a href="mailto:datenschutz@wendessen.de">
                        datenschutz@wendessen.de
                    </a>
                </p>
                <p>
                    <strong>Webseite:</strong>{' '}
                    <a href="https://www.wendessen.de">www.wendessen.de</a>
                </p>
            </div>

            <h3>Inhaltlich Verantwortlicher (gemäß § 10 Absatz 3 MDStV)</h3>
            <p>
                Der Ortsrat Wendessen, vertreten durch Christina Balder
                (Adresse wie oben).
            </p>

            <h2 id="datenschutz">
                DATENSCHUTZERKLÄRUNG (Ausführliche Fassung)
            </h2>
            <p>
                Diese Datenschutzerklärung informiert Sie über Art, Umfang und
                Zweck der Verarbeitung von personenbezogenen Daten auf unserer
                Website.
            </p>

            <h3>1. Verantwortlicher für Datenverarbeitung</h3>
            <p>Siehe Abschnitt „Impressum“ oben.</p>

            <h3>2. Datenverarbeitung bei Website-Besuch</h3>
            <h4>Automatisch erfasste Daten</h4>
            <ul>
                <li>Besuchsdatum und -uhrzeit</li>
                <li>Browser-Typ und Betriebssystem</li>
                <li>Referer (von welcher Seite Sie kamen)</li>
                <li>HTTP-Status</li>
            </ul>
            <p>
                <strong>IP-Adresse:</strong> Nein – nicht gespeichert.
            </p>
            <p>
                <strong>Tracking:</strong> Nein – keine Google Analytics, Matomo
                oder ähnliche Dienste.
            </p>
            <p>
                <strong>Cookies:</strong> Ja – nur ein funktionales Cookie
                (admin-session) für den Admin-Login.
            </p>
            <p>
                <strong>Speicherdauer:</strong> Nicht persistent (Server-Logs
                sind deaktiviert).
            </p>
            <p>
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
                (technische Bereitstellung und Systemsicherheit)
            </p>

            <h3>3. Datenverarbeitung beim Foto-Upload</h3>
            <h4>Was wird gespeichert?</h4>
            <ul>
                <li>Ihr Name (optional)</li>
                <li>E-Mail-Adresse (optional, für Rückfragen)</li>
                <li>Die Fotodatei(en)</li>
                <li>
                    Ihre Einwilligung (inkl. IP-Adresse und Zeitpunkt als
                    Nachweis)
                </li>
            </ul>
            <p>
                <strong>EXIF-Daten:</strong> Ja – Metadaten wie Ort und Datum
                werden bei der Verarbeitung aus den Bildern entfernt.
            </p>

            <h4>Speicherort</h4>
            <p>
                Alle Daten werden auf unserem eigenen Server bei OVH in
                Frankreich gespeichert und verbleiben somit innerhalb der EU.
            </p>
            <ul>
                <li>
                    <strong>Datenbank:</strong> PostgreSQL
                </li>
                <li>
                    <strong>Bilder:</strong> MinIO Object Storage
                </li>
            </ul>

            <h4>Granulare Einwilligung</h4>
            <p>Sie geben beim Upload zwei separate Einwilligungen:</p>
            <ul>
                <li>
                    <strong>Pflicht:</strong> Einwilligung zur Nutzung auf der
                    Webseite (wendessen.de)
                </li>
                <li>
                    <strong>Optional:</strong> Einwilligung zur Nutzung auf
                    Social-Media-Kanälen
                </li>
            </ul>

            <h4>Speicherdauer</h4>
            <ul>
                <li>
                    <strong>Bilder:</strong> Bis Sie Ihre Einwilligung
                    widerrufen.
                </li>
                <li>
                    <strong>Einwilligungsprotokoll:</strong> 1 Jahr nach Löschung
                    des zugehörigen Bildes zu Nachweiszwecken.
                </li>
                <li>
                    <strong>Backups:</strong> Gelöschte Bilder können noch bis zu
                    30 Tage in verschlüsselten Backups vorhanden sein.
                </li>
            </ul>

            <h3>4. Ihre Rechte als betroffene Person</h3>
            <p>Sie haben jederzeit das Recht auf:</p>
            <ul>
                <li>
                    <strong>Auskunft</strong> über die von uns zu Ihrer Person
                    gespeicherten Daten.
                </li>
                <li>
                    <strong>Berichtigung</strong> unrichtiger Daten.
                </li>
                <li>
                    <strong>Löschung</strong> Ihrer Daten („Recht auf
                    Vergessenwerden“).
                </li>
                <li>
                    <strong>Einschränkung</strong> der Verarbeitung Ihrer Daten.
                </li>
                <li>
                    <strong>Widerruf</strong> Ihrer Einwilligung(en) – jederzeit,
                    formlos und ohne Angabe von Gründen. Wir garantieren die
                    Umsetzung (Löschung von unseren Plattformen) innerhalb von
                    24 Stunden.
                </li>
                <li>
                    <strong>Beschwerde</strong> bei einer
                    Datenschutz-Aufsichtsbehörde.
                </li>
            </ul>
            <p>
                <strong>Kontakt für Widerruf und Anfragen:</strong>{' '}
                <a href="mailto:datenschutz@wendessen.de">
                    datenschutz@wendessen.de
                </a>
            </p>

            <h3>5. Auftragsverarbeiter (Dritte mit Datenzugriff)</h3>
            <p>
                Wir setzen für den Betrieb dieser Seite nur wenige, sorgfältig
                ausgewählte Dienstleister ein:
            </p>
            <div className={styles.tableWrap}>
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Unternehmen</th>
                            <th scope="col">Rolle</th>
                            <th scope="col">Standort</th>
                            <th scope="col">DPA vorhanden</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>OVH SE</td>
                            <td>Server-Hosting</td>
                            <td>Frankreich</td>
                            <td>Ja</td>
                        </tr>
                        <tr>
                            <td>Google Ireland Ltd.</td>
                            <td>Push-Benachrichtigungen</td>
                            <td>USA</td>
                            <td>Ja (Standardvertragsklauseln)</td>
                        </tr>
                        <tr>
                            <td>Mozilla Corporation</td>
                            <td>Push-Benachrichtigungen</td>
                            <td>EU/USA</td>
                            <td>Ja (Standardvertragsklauseln)</td>
                        </tr>
                        <tr>
                            <td>Apple Inc.</td>
                            <td>Push-Benachrichtigungen</td>
                            <td>USA</td>
                            <td>Ja (Standardvertragsklauseln)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="small">
                <strong>Wichtig:</strong> Die Browser-Hersteller (Google, Mozilla,
                Apple) erhalten nur die für die technische Zustellung von
                Push-Benachrichtigungen notwendigen Tokens, keine direkten
                personenbezogenen Daten wie Namen oder E-Mails von Ihnen.
            </p>

            <h3>6. Zuständige Datenschutzbehörde</h3>
            <p>
                Für Beschwerden können Sie sich an die für uns zuständige
                Aufsichtsbehörde wenden:
            </p>
            <div className={styles.group}>
                <p>
                    <strong>
                        Die Landesbeauftragte für den Datenschutz Niedersachsen
                    </strong>
                </p>
                <p>Prinzenstraße 5, 30159 Hannover</p>
                <p>E-Mail: poststelle@lfd.niedersachsen.de</p>
                <p>
                    Webseite:{' '}
                    <a
                        href="https://www.lfd.niedersachsen.de"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        www.lfd.niedersachsen.de
                    </a>
                </p>
            </div>

            <h2 id="haftung">HAFTUNGSAUSSCHLUSS</h2>

            <h3>1. Haftung für Inhalte</h3>
            <p>
                Der Autor übernimmt keinerlei Gewähr für die Aktualität,
                Korrektheit, Vollständigkeit oder Qualität der bereitgestellten
                Informationen. Haftungsansprüche gegen den Autor, welche sich auf
                Schäden materieller oder ideeller Art beziehen, die durch die
                Nutzung oder Nichtnutzung der dargebotenen Informationen bzw.
                durch die Nutzung fehlerhafter und unvollständiger Informationen
                verursacht wurden, sind grundsätzlich ausgeschlossen, sofern
                seitens des Autors kein nachweislich vorsätzliches oder grob
                fahrlässiges Verschulden vorliegt. Alle Angebote sind
                freibleibend und unverbindlich.
            </p>

            <h3>2. Haftung für Links</h3>
            <p>
                Bei direkten oder indirekten Verweisen auf fremde Internetseiten
                („Links“), die außerhalb des Verantwortungsbereiches des Autors
                liegen, würde eine Haftungsverpflichtung ausschließlich in dem
                Fall in Kraft treten, in dem der Autor von den Inhalten Kenntnis
                hat und es ihm technisch möglich und zumutbar wäre, die Nutzung
                im Falle rechtswidriger Inhalte zu verhindern. Der Autor erklärt
                hiermit ausdrücklich, dass zum Zeitpunkt der Linksetzung keine
                illegalen Inhalte auf den zu verlinkenden Seiten erkennbar waren.
                Auf die aktuelle und zukünftige Gestaltung, die Inhalte oder die
                Urheberschaft der gelinkten/verknüpften Seiten hat der Autor
                keinerlei Einfluss. Deshalb distanziert er sich hiermit
                ausdrücklich von allen Inhalten aller gelinkten/verknüpften
                Seiten, die nach der Linksetzung verändert wurden.
            </p>

            <h3>3. Urheber- und Kennzeichenrecht</h3>
            <p>
                Das Copyright für veröffentlichte, vom Autor selbst erstellte
                Objekte bleibt allein beim Autor der Seiten. Eine
                Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente,
                Videosequenzen und Texte in anderen elektronischen oder
                gedruckten Publikationen ist ohne ausdrückliche Zustimmung des
                Autors nicht gestattet. Alle innerhalb des Internetangebotes
                genannten und ggf. durch Dritte geschützten Marken- und
                Warenzeichen unterliegen uneingeschränkt den Bestimmungen des
                jeweils gültigen Kennzeichenrechts und den Besitzrechten der
                jeweiligen eingetragenen Eigentümer.
            </p>

            <h3>4. Rechtswirksamkeit dieses Haftungsausschlusses</h3>
            <p>
                Sofern Teile oder einzelne Formulierungen dieses Textes der
                geltenden Rechtslage nicht, nicht mehr oder nicht vollständig
                entsprechen sollten, bleiben die übrigen Teile des Dokumentes in
                ihrem Inhalt und ihrer Gültigkeit davon unberührt.
            </p>

            <h2 id="bildrechte">BILDRECHTE &amp; HOCHLADUNG</h2>

            <h3>Ihre Garantie bei Upload</h3>
            <p>Wenn Sie ein Foto hochladen, garantieren Sie:</p>
            <ol className={styles.ordered}>
                <li>
                    <strong>Urheberschaft:</strong> Sie sind Fotograf/in oder
                    haben die vollumfänglichen Nutzungsrechte.
                </li>
                <li>
                    <strong>Einwilligung abgebildeter Personen:</strong> Alle
                    Personen auf dem Bild haben Ihnen gegenüber der
                    Veröffentlichung zugestimmt.
                </li>
                <li>
                    <strong>Minderjährigen-Schutz:</strong> Bei Personen unter 16
                    Jahren liegt Ihnen die Zustimmung der Erziehungsberechtigten
                    vor.
                </li>
                <li>
                    <strong>Keine Rechtsverletzung:</strong> Das Foto verletzt
                    keine sonstigen Rechte Dritter.
                </li>
            </ol>
            <p>
                <strong>Konsequenz bei falscher Garantie:</strong> Sie haften uns
                gegenüber für alle Ansprüche, die Dritte aufgrund der von Ihnen
                hochgeladenen Bilder gegen uns geltend machen (Schadensersatz,
                Abmahnungen).
            </p>

            <h3>Freistellung der Website</h3>
            <p>
                Sie stellen uns von Ansprüchen Dritter frei,{' '}
                <strong>
                    soweit die Rechtsverletzung auf einem von Ihnen zu
                    vertretenden Verstoß gegen die obigen Garantien beruht.
                </strong>
            </p>
            <p className="small">
                Diese Freistellung gilt nicht, wenn die Rechtsverletzung auf einem
                Verschulden unsererseits beruht (z.B. wenn wir ein Bild trotz
                Widerruf nicht löschen).
            </p>

            <h3>Widerruf Ihrer Einwilligung</h3>
            <p>Sie können Ihre Einwilligung jederzeit widerrufen:</p>
            <ul>
                <li>
                    <strong>Formlos</strong> per E-Mail an{' '}
                    <a href="mailto:datenschutz@wendessen.de">
                        datenschutz@wendessen.de
                    </a>
                    .
                </li>
                <li>
                    <strong>Teilweise widerrufbar</strong> (z.B. nur für Social
                    Media).
                </li>
                <li>
                    <strong>Löschung garantiert:</strong> Wir entfernen das Bild
                    nach Widerruf innerhalb von 24 Stunden von allen uns direkt
                    kontrollierbaren Plattformen.
                </li>
            </ul>

            <h2 id="sicherheit">SICHERHEIT &amp; DATENSCHUTZ</h2>

            <h3>Technische und Organisatorische Maßnahmen (TOMs)</h3>
            <ul>
                <li>
                    Ja – <strong>HTTPS:</strong> Alle Daten werden verschlüsselt
                    übertragen (TLS 1.2+).
                </li>
                <li>
                    Ja – <strong>Datenstandort EU:</strong> Datenbank und
                    Bild-Speicher befinden sich ausschließlich in Frankreich.
                </li>
                <li>
                    Ja – <strong>Backups:</strong> Tägliche, AES-256
                    verschlüsselte Backups mit einer Vorhaltezeit von 30 Tagen.
                </li>
                <li>
                    Ja – <strong>EXIF-Daten-Entfernung:</strong> Metadaten werden
                    vor der Veröffentlichung aus Bildern entfernt.
                </li>
                <li>
                    Ja – <strong>Passwort-Hashing:</strong>{' '}
                    Administrator-Passwörter werden mit bcryptjs sicher gehasht.
                </li>
                <li>
                    Ja – <strong>Datenminimierung:</strong> Es werden keine
                    Server-Access-Logs gespeichert.
                </li>
            </ul>

            <h3>Datenübermittlung in die USA</h3>
            <p>
                Außer den für Push-Benachrichtigungen technisch notwendigen
                Tokens, die über die Server der Browser-Hersteller (Google,
                Apple) laufen, findet keine aktive Datenübermittlung in die USA
                statt.
            </p>

            <p className="muted small">
                Diese Fassung wird von der Redaktion gepflegt; Änderungen brauchen
                eine rechtliche Prüfung. Fragen zum Datenschutz:{' '}
                <Link href="/kontakt/formular">Kontaktformular</Link>.
            </p>
        </div>
    );
}
