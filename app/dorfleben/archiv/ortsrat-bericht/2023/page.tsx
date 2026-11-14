import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';

export const metadata: Metadata = {
    title: 'Bürgermeister berichtet 2023 (Archiv)',
    description:
        'Archivierter Bürgermeisterbericht von Andreas M. Rink zum Jahr 2023: Rückblick auf 2022 und Ausblick auf die Themen des Ortsrates.',
};

export default async function BuergermeisterBerichtet2023ArchivePage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Archiv"
                    tallies={[{ label: 'Bericht', value: 2023 }]}
                    note={
                        <>
                            Der Bericht steht unverändert im Archiv. Die
                            aktuellen Themen des Ortsrates stehen auf der
                            Seite des Ortsbürgermeisters.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s3)' }}>
                <Link className="link-quiet" href="/dorfleben/archiv">
                    ← Zurück zum Archiv
                </Link>
            </p>

            <PageHead
                kicker="Dorfarchiv · Bericht 2023"
                title="Bürgermeister berichtet"
                lede="Der archivierte Bericht von Andreas M. Rink zum Jahr 2023: Rückblick auf 2022 und Ausblick auf die Themen des Ortsrates."
            />

            <div className="person-card person-card--plate">
                <Image
                    src="/images/Ortsrat/andreas-rink.jpg"
                    alt="Andreas M. Rink, Ortsbürgermeister"
                    width={160}
                    height={160}
                    priority
                />
                <div>
                    <h2>Andreas M. Rink</h2>
                    <p className="person-role">Ortsbürgermeister</p>
                    <p className="small muted" style={{ marginTop: 'var(--s2)' }}>
                        Marketingberater ·{' '}
                        <Link className="link" href="/kontakt/andreas-rink">
                            Kontakt aufnehmen
                        </Link>
                    </p>
                </div>
            </div>

            <div className="prose" style={{ marginTop: 'var(--s5)' }}>
                <h2>Liebe Mitbürgerinnen, liebe Mitbürger,</h2>
                <p>
                    der Start ins Jahr 2023 wird von einer Mischung aus
                    Zuversicht und Sorgen begleitet.
                </p>

                <h3>Zuversicht</h3>
                <p>
                    Zuversicht, weil wir nach über zwei Jahren Corona langsam
                    und behutsam wieder zu der gewohnten Normalität aus
                    Vor-Pandemie-Zeiten zurückfinden. Treffen und Versammlungen
                    sind wieder ohne größere Auflagen möglich, das ist gut für
                    unser Zusammenleben im Dorf und für unsere Vereine.
                </p>

                <h3>Herausforderungen</h3>
                <p>
                    Sorgen machen uns der Krieg in der Ukraine und dessen
                    Folgen. Steigende Preise bei der Energieversorgung und beim
                    Einkaufen hinterlassen tiefe Spuren und bringen viele
                    Mitbürgerinnen und Mitbürger, trotz aller Hilfsmaßnahmen des
                    Staates, in echte Bedrängnis und verlangen uns allen
                    Solidarität ab. Wir leben in einem stabilen Land, und dass
                    dieses so bleibt und nicht rechte Rattenfänger die Ängste
                    der Menschen für ihre Zwecke ausnutzen, bleibt eine Aufgabe
                    für uns alle.
                </p>

                <h3>850 Jahre Wendessen</h3>
                <p>
                    Wendessen konnte im vergangenen Jahr sein 850-jähriges
                    Bestehen (nach)-feiern, und das war ein ganz tolles
                    Wochenende für Jung und Alt. Vielen Dank all denjenigen, die
                    zum Gelingen beigetragen haben! Runde Geburtstage feierten
                    auch der Schützenverein, der Kirchbauverein und unsere
                    Kleingärtner – immer begleitet von einem ordentlichen
                    Publikumszuspruch.
                </p>

                <h2>Entwicklungen im Jahr 2022</h2>

                <h3>Baugebiet</h3>
                <p>
                    Für unser neues Baugebiet auf dem Stiller-Gelände an der
                    Bahn wurde ein Investor gefunden, und die ersten Schritte
                    zur Bebauung liegen hinter uns.
                </p>

                <h3>Hospiz</h3>
                <p>
                    Am Leuchtturmprojekt „Hospiz im Gutspark“ wird trotz einer
                    vorhandenen Finanzierungslücke fleißig weitergebaut und der
                    Verein ist zuversichtlich, die fehlenden Gelder
                    aufzutreiben.
                </p>

                <h3>Kirchenglocken</h3>
                <p>
                    Nach vielen Problemen sind die neuen Glocken für unsere
                    Kirche gegossen und warten darauf, im Jahr 2023 ganz neue
                    Töne ins Dorf zu bringen.
                </p>

                <h3>Sport</h3>
                <p>
                    Wendessen hat Geschichte geschrieben – unsere tollen
                    Fußballerinnen spielen jetzt in der Oberliga und setzen dort
                    ihren Erfolgskurs fort.
                </p>

                <h3>Verkehr – Ein Dauerbrenner</h3>
                <p>
                    Die kritischen Situationen auf der Leipziger Allee gehören
                    nun endlich durch das verhängte Parkverbot der Vergangenheit
                    an, im Ortseingang vom Atzumer Kreisel aus mahnt seit dem
                    Frühjahr 2022 eine Tempomessanlage die Autofahrer zu einer
                    angemessenen Geschwindigkeit.
                </p>

                <h2>Ausblick auf das Jahr 2023</h2>
                <p>
                    Im Namen des gesamten Ortsrates darf ich versichern – wir
                    bleiben am Ball, wenn es um Themen wie verkehrsberuhigende
                    Maßnahmen, um Tempolimits und um Sicherheit geht. Wir werden
                    den Prozess der Entwicklung unseres Baugebietes und der
                    Realisierung des Feuerwehrgerätehauses an der Ecke Leipziger
                    Allee aktiv begleiten, kümmern uns um eine anständige
                    Gestaltung und Pflege unserer Grünflächen und Spielplätze –
                    und natürlich machen wir, wo es nur geht, Druck, damit unser
                    Bahnhaltepunkt doch früher als im Jahr 2027 kommt.
                </p>
                <p>
                    <strong>Übrigens:</strong> Wir werden noch im Frühjahr 2023
                    eine Bücherzelle gegenüber der Kirche aufstellen und damit
                    den Mittelpunkt unseres Dorfes noch attraktiver machen.
                </p>
                <p>
                    Und selbstverständlich haben wir alle offene Ohren für die
                    Anliegen und Wünsche, die von den Vereinen und von den
                    Bürgerinnen und Bürgern aus dem Dorf an uns herangetragen
                    werden.
                </p>
                <p>
                    In diesem Sinne wünsche ich Ihnen, wünsche ich uns allen ein
                    glückliches, gesundes und erfolgreiches Jahr 2023.
                </p>
                <p>
                    <strong>Bleiben Sie zuversichtlich!</strong>
                </p>
                <p>
                    Andreas M. Rink
                    <br />
                    <span className="muted">Ortsbürgermeister</span>
                </p>
            </div>

            <section className="block" aria-labelledby="weiterlesen">
                <SectionHead title="Weiter im Archiv" id="weiterlesen" />
                <p style={{ marginTop: 'var(--s3)' }}>
                    <Link className="arrow-link" href="/dorfleben/archiv">
                        Alle Archiveinträge
                    </Link>
                </p>
            </section>
        </Leaf>
    );
}
