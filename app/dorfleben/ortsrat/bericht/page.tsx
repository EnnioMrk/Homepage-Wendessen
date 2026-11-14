import Image from 'next/image';
import Link from 'next/link';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Bürgermeister berichtet 2026 | Wendessen',
    description:
        'Das passierte im Jahr 2026 in Wendessen – Grußwort des damaligen Ortsbürgermeisters Andreas M. Rink.',
};

export default async function BuergermeisterBerichtetPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Bericht"
                    tallies={[{ label: 'Jahrgang', value: 2026 }]}
                    note={
                        <>
                            Der Bericht ist das Grußwort von Andreas M. Rink,
                            Ortsbürgermeister bis 2026. Der Bericht von 2023
                            liegt im Archiv.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Ortsrat / Bericht</span>
            </p>

            <PageHead
                kicker="Dorfleben · Ortsrat"
                title="Bürgermeister berichtet"
                lede="Das passiert im Jahr 2026 in Wendessen."
            />

            <div className="person-card person-card--plate">
                <Image
                    src="/images/Ortsrat/andreas-rink.jpg"
                    alt="Andreas Rink - ehemaliger Ortsbürgermeister"
                    width={320}
                    height={320}
                    sizes="160px"
                />
                <div>
                    <p className="person-role">
                        Ortsbürgermeister bis 2026
                    </p>
                    <h2>Andreas M. Rink</h2>
                    <dl className="kv" style={{ marginTop: 'var(--s4)' }}>
                        <dt>Beruf</dt>
                        <dd>Marketingberater</dd>
                        <dt>Kontakt</dt>
                        <dd>
                            <Link className="link" href="/kontakt/andreas-rink">
                                Kontakt aufnehmen
                            </Link>
                        </dd>
                    </dl>
                </div>
            </div>

            <article className="prose block">
                <p>
                    Liebe Wendesserinnen und Wendesser, liebe Besucherinnen und
                    Besucher,
                </p>

                <p>
                    „Das große Problem mit Vorhersagen besteht darin, dass sie
                    die Zukunft betreffen“, hat einmal ein kluger Mensch
                    geschrieben. Und weil das natürlich völlig richtig ist, ist
                    es mehr als gewagt vorherzusagen, was im Jahr 2026 bei uns
                    in Wendessen passieren wird – und was eher nicht.
                </p>

                <h3>Neubaugebiet Leipziger Allee</h3>
                <p>
                    Fangen wir doch einfach mal mit unserem Neubaugebiet an der
                    Leipziger Allee an. Eigentlich sollten da bereits im letzten
                    Jahr die Bagger rollen und die Erschließungsarbeiten auf
                    Hochtouren laufen. Und ein Name für die neue Straße wurde
                    auch schon gefunden: Zuckerring soll sie heißen, das
                    Ergebnis eines Ideenwettbewerbes, zu dem der Ortsrat
                    aufgerufen hatte.
                </p>
                <p>
                    Doch die notwendigen rechtlichen und formalen Schritte zur
                    Bebauung, die mit dem Erwerb des Geländes der ehemaligen
                    Zuckerfabrik durch den Investor so zügig begannen, sind ins
                    Stocken geraten. Die in vielen arbeitsreichen Monaten
                    zwischen dem Eigentümer und der Stadtverwaltung erstellten
                    Pläne liegen vor und warten auf Verabschiedung. Doch es hakt
                    – und woran das genau liegt, darüber schweigen sich die
                    beteiligten Parteien weitgehend aus.
                </p>
                <p>
                    „Anpassungen im städtebaulichen Vertrag“ müssten noch
                    vorgenommen werden, und „in den Bereichen Artenschutz und
                    Altlasten“ stünden noch Abstimmungen aus, hieß es in der
                    letzten Ortsratssitzung 2025. Für uns in Wendessen bedeutet
                    das: Wir hoffen sehr, dass sich die Verhandlungspartner
                    verständigen und auch die noch offenen Punkte geklärt werden
                    können – auf dass es nunmehr im Jahr 2026 losgeht.
                </p>

                <h3>Feuerwehrhaus und Bushaltestelle</h3>
                <p>
                    Sehr viel besser sieht es bei unserem anderen großen
                    Bauprojekt aus – noch im Januar 2026 soll der Spatenstich
                    für das Feuerwehrhaus an der Ecke Leipziger Allee / Ahlumer
                    Weg erfolgen! Darüber freuen sich alle Beteiligten,
                    besonders die Kameradinnen und Kameraden unserer Feuerwehr
                    sehr.
                </p>
                <p>
                    Wenn alles läuft wie geplant, steht dann 2027 endlich der
                    Auszug aus der Alten Schule und der Einzug in die neuen
                    Räumlichkeiten an.
                </p>
                <p>
                    Der Feuerwehrneubau hat übrigens auch zur Folge, dass die
                    Schulbushaltestelle verlegt werden muss – das ist unschön,
                    aber unabdingbar. „Umgezogen“ ist bereits die Infotafel, die
                    ebenfalls der künftigen Feuerwehrausfahrt im Wege stand –
                    sie steht nun gegenüber dem Friedhof an der Straße Am Gute.
                </p>

                <h3>Radwege und Verkehrssicherheit</h3>
                <p>
                    In 2024 haben wir uns sehr über den neuen Radweg entlang der
                    B 79 nach Wolfenbüttel gefreut, 2025 folgte erfreulicherweise
                    der Radweg zum Ahlumer Kreisel – beides total gute
                    Nachrichten für die Zweiradfreunde (und auch für Jogger und
                    Spaziergänger) und für die Verkehrssicherheit. Und für 2026
                    hat uns der Landkreis Wolfenbüttel fest versprochen, einen
                    Radweg nach Klein-Denkte in Angriff zu nehmen. Kein anderes
                    Dorf im Landkreis ist dann so perfekt mit Wegen erschlossen
                    und verbunden wie Wendessen.
                </p>

                <h3>Ehrenamt, Vereine und Zusammenhalt</h3>
                <p>
                    Es sind aber auch die vielen kleineren Dinge, die unser Leben
                    in den letzten Jahren bereicherten und auf die wir uns auch
                    im Jahr 2026 freuen dürfen: die vielen Feste, Feiern und
                    Veranstaltungen, die unsere Vereine und die sie tragenden
                    Ehrenamtlichen auf die Beine stellen.
                </p>
                <p>
                    Was wäre Wendessen ohne die Konzerte des Kirchbauvereins,
                    ohne die Gottesdienste der Kirchengemeinde, die Feiern des
                    Spritzenhausvereins, des Schützenvereins, der IDW und der
                    Kleingärtner? Wer denkt nicht gerne an Eigeninitiativen,
                    denen wir so tolle Dinge wie die nagelneue Boulebahn in der
                    Dorfmitte, den erfolgreichen Flohmarkt oder die Etablierung
                    eines WhatsApp-Informationskanals verdanken?
                </p>
                <p>
                    Ihnen allen gebührt unser uneingeschränkter Dank für ihren
                    großartigen ehrenamtlichen Einsatz, denn sie sorgen dafür,
                    dass Wendessen auch 2026 ein so vielfältiger lebens- und
                    liebenswerter Ort bleibt. Übrigens: Alle Vereinsvertreter
                    freuen sich darüber, wenn noch mehr mitmachen – wer sich
                    angesprochen fühlt, findet auf dieser Internetseite des
                    Dorfes alle Kontaktdaten.
                </p>

                <h3>Storchennest an der alten Mühle</h3>
                <p>
                    Was passiert noch in diesem Jahr? Im letzten Jahr haben wir
                    auf der Wiese an der alten Mühle ein Storchennest
                    aufgestellt. Der Standort nahe der Altenau sei für eine
                    Ansiedlung prima geeignet, berichteten uns Fachleute.
                </p>
                <p>
                    Jetzt hoffen wir sehr, dass Störche entweder lesen können
                    oder gut zugehört haben – und dass sich zumindest einer,
                    besser noch zwei, für Wendessen als neuen Lebensmittelpunkt
                    entscheiden. Aber wie gesagt: Es ist so ein Ding mit den
                    Vorhersagen …
                </p>

                <h3>Kommunalwahl im September 2026</h3>
                <p>
                    Liebe Mitbürgerinnen und Mitbürger, im September stehen in
                    ganz Niedersachsen Kommunalwahlen an und auch Wendessen wird
                    einen neuen Ortsrat wählen. Ich weiß nicht, wie Sie das sehen
                    – aber Kommunalwahlen sind in meinen Augen eine einfache
                    Möglichkeit, direkt und unmittelbar seine Bewertung des
                    Geleisteten und seine Wünsche für die Zukunft auszudrücken.
                </p>
                <p>
                    Konkret an der Gestaltung seines Dorfes und seines eigenen
                    Lebens direkt vor der Wohnungs- und Haustür mitzuwirken, ist
                    allemal besser, als meckernd in der Ecke zu stehen.
                </p>
                <p>
                    Meine herzliche Bitte lautet daher: Machen Sie mit,
                    beteiligen Sie sich, bringen Sie sich ein – entweder als
                    Kandidatin oder Kandidat für den Ortsrat oder eben als
                    Wählerin oder Wähler am 13. September. Und sehen Sie es mir
                    bitte nach, wenn ich einmal mehr die Hoffnung äußere, dass
                    Wendessen auch weiterhin vom Mitmischen extremer
                    Stimmungsmacher und demokratiefeindlicher Hetzer verschont
                    bleibt.
                </p>

                <p>
                    In diesem Sinne wünsche ich Ihnen und uns allen ein erfolg-
                    und ereignisreiches, glückliches Jahr 2026.
                </p>
                <p>
                    <strong>Bleiben Sie gesund und zuversichtlich!</strong>
                    <br />
                    Alles Gute,
                </p>
                <p className="small">
                    <strong>Andreas M. Rink</strong>
                    <br />
                    Ortsbürgermeister bis 2026
                </p>
            </article>

            <section className="block" aria-labelledby="weiterlesen">
                <SectionHead title="Weiterlesen" id="weiterlesen" />
                <div className="dir">
                    <Link
                        className="dir-person"
                        href="/dorfleben/archiv/ortsrat-bericht/2023"
                    >
                        <span className="dir-name">
                            Bericht des Ortsbürgermeisters 2023
                        </span>
                        <span className="dir-contacts">
                            Im Dorfarchiv abgelegt.
                        </span>
                        <span className="dir-importance">Archiv</span>
                    </Link>
                    <Link
                        className="dir-person"
                        href="/wohnen-bauen/neubaugebiet"
                    >
                        <span className="dir-name">
                            Neubaugebiet Leipziger Allee
                        </span>
                        <span className="dir-contacts">
                            Planung, Baufortschritt und Unterlagen zum neuen
                            Wohngebiet.
                        </span>
                        <span className="dir-importance">Vorhaben</span>
                    </Link>
                    <Link
                        className="dir-person"
                        href="/wohnen-bauen/feuerwehrgeraetehaus"
                    >
                        <span className="dir-name">Feuerwehrgerätehaus</span>
                        <span className="dir-contacts">
                            Planung und Baufortschritt des neuen Gerätehauses.
                        </span>
                        <span className="dir-importance">Vorhaben</span>
                    </Link>
                </div>
            </section>

            <p className="block">
                <Link
                    className="arrow-link"
                    href="/dorfleben/ortsrat/mitglieder"
                >
                    Die Mitglieder des Ortsrates
                </Link>
            </p>
        </Leaf>
    );
}
