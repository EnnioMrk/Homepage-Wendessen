import type { Metadata } from 'next';
import Link from 'next/link';
import ZoomableImage from '@/app/components/ZoomableImage';
import styles from './facts.module.css';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';

export const metadata: Metadata = {
    title: 'Feuerwehrgerätehaus – Wohnen & Bauen',
    description:
        'Das neue Feuerwehrgerätehaus in Wendessen am Eckgrundstück Leipziger Allee / Ahlumer Weg: Planung, Kosten, Standort und Baufortschritt.',
};

const VORHABEN: [string, string][] = [
    ['Standort', 'Eckgrundstück Leipziger Allee / Ahlumer Weg'],
    [
        'Gebäude',
        'zweigeschossiger Neubau in Massivbauweise mit Satteldach und Photovoltaikanlage',
    ],
    [
        'Platz',
        'für die aktuell über 60 aktiven Feuerwehrleute, darunter die Mitglieder der Kinder- und Jugendfeuerwehr',
    ],
    ['Fahrzeuge', 'zwei Fahrzeuge'],
    [
        'Bisher',
        'Jahrzehntelang war die Feuerwehr in der ehemaligen alten Schule am Kirchring untergebracht – mehr schlecht als recht.',
    ],
];

const BAU: [string, string][] = [
    [
        'Erste Maßnahmen',
        'Herstellen des Grundstücks, begonnen nach langer Planung im Herbst 2025',
    ],
    ['Spatenstich', 'Februar 2026'],
    ['Budget', '4,5 Millionen Euro (Stadt Wolfenbüttel)'],
    ['Fertigstellung', '2. Quartal 2027'],
];

const VORTEILE: [string, string][] = [
    [
        'Zentrale Lage',
        'Eckgrundstück Leipziger Allee / Ahlumer Weg – optimal für schnelle Einsatzbereitschaft.',
    ],
    [
        'Moderne Ausstattung',
        'Neubau nach aktuellen Standards mit zeitgemäßer Fahrzeughalle und Ausrüstung.',
    ],
    [
        'Bessere Bedingungen',
        'Angemessene Räumlichkeiten für Training, Ausbildung und Kameradschaft.',
    ],
];

const BAUFORTSCHRITT: {
    years: string;
    title: string;
    body: string;
    done: boolean;
}[] = [
    {
        years: '2021',
        title: 'Grundstückserwerb',
        body: 'Die Stadt Wolfenbüttel erwirbt das Eckgrundstück Leipziger Allee / Ahlumer Weg.',
        done: true,
    },
    {
        years: '2022–2024',
        title: 'Planungsphase',
        body: 'Das Projekt steht an 2. Stelle in der Stadtplanung nach Halchter.',
        done: true,
    },
    {
        years: '2025–2026',
        title: 'Baubeginn',
        body: 'Herbst 2025: Grundstücksvorbereitung. Februar 2026: Spatenstich.',
        done: true,
    },
    {
        years: '2027',
        title: 'Fertigstellung',
        body: 'Geplant für das 2. Quartal 2027.',
        done: false,
    },
];

export default async function FeuerwehrgeraetehausPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Gerätehaus"
                    tallies={[
                        { label: 'Budget', value: '4,5 Mio. €' },
                        { label: 'Spatenstich', value: 'Feb. 2026' },
                        { label: 'Fertig', value: 'Q2 2027' },
                    ]}
                    note={
                        <>
                            Planung und Bau liegen bei der Stadt
                            Wolfenbüttel. Die Bilder sind Visualisierungen und
                            ein Lageplan, keine Bestandsfotos.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Wohnen & Bauen · Feuerwehr"
                title="Feuerwehrgerätehaus"
                lede="Nach vielen Jahren in unzureichender Unterbringung erhält die Freiwillige Feuerwehr Wendessen ein neues Gerätehaus am Eckgrundstück Ahlumer Weg / Leipziger Allee."
            />

            <div className="prose">
                <p>
                    In Wendessen entsteht auf dem Eckgrundstück Ahlumer Weg /
                    Leipziger Allee ein Feuerwehrhaus – das erste in der langen
                    Geschichte der Freiwilligen Feuerwehr, die seit Jahrzehnten
                    mehr schlecht als recht in der ehemaligen alten Schule am
                    Kirchring untergebracht ist.
                </p>
                <p>
                    Das neue Haus wird Platz für die aktuell über 60 aktiven
                    Feuerwehrleute (darunter auch die Mitglieder der Kinder-
                    und Jugendfeuerwehr) sowie für zwei Fahrzeuge bieten.
                    Vorgesehen ist die Errichtung eines 2-geschossigen Gebäudes
                    in Massivbauweise mit einem Satteldach und einer
                    Photovoltaikanlage.
                </p>
            </div>

            <section className="block" aria-labelledby="vorhaben">
                <SectionHead title="Das Vorhaben" id="vorhaben" />
                <dl className={`kv ${styles.facts}`} style={{ marginTop: 'var(--s3)' }}>
                    {VORHABEN.map(([label, value]) => (
                        <div key={label} style={{ display: 'contents' }}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="block" aria-labelledby="bauphase">
                <SectionHead title="Bauphase & Fertigstellung" id="bauphase" />
                <dl className={`kv ${styles.facts}`} style={{ marginTop: 'var(--s3)' }}>
                    {BAU.map(([label, value]) => (
                        <div key={label} style={{ display: 'contents' }}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
                <p className="small muted" style={{ marginTop: 'var(--s3)' }}>
                    Der Stand auf dieser Seite gibt die veröffentlichten
                    Angaben wieder. Einen prozentualen Baufortschritt nennt die
                    Stadt nicht.
                </p>
            </section>

            <section className="block" aria-labelledby="bilder">
                <SectionHead title="Visualisierung und Lageplan" id="bilder" />
                <figure className="figure" style={{ marginTop: 'var(--s4)' }}>
                    <ZoomableImage
                        src="/images/feuerwehrhaus-wendessen-eingangsansicht.jpg"
                        alt="3D-Visualisierung der Eingangsansicht des geplanten Feuerwehrgerätehauses in Wendessen"
                        framed={false}
                    />
                    <figcaption>
                        <span>
                            3D-Visualisierung: Eingangsansicht des geplanten
                            Feuerwehrgerätehauses in Wendessen
                        </span>
                    </figcaption>
                </figure>
                <figure className="figure" style={{ marginTop: 'var(--s4)' }}>
                    <ZoomableImage
                        src="/images/lageplan-feuerwehrgeraetehaus.jpg"
                        alt="Lageplan des geplanten Feuerwehrgerätehauses in Wendessen"
                        framed={false}
                    />
                    <figcaption>
                        <span>Bebauungsplan Feuerwehrgerätehaus</span>
                    </figcaption>
                </figure>
            </section>

            <section className="block" aria-labelledby="situation">
                <SectionHead title="Aktuelle Situation" id="situation" />
                <div className="notice notice--warn" style={{ marginTop: 'var(--s3)' }}>
                    <strong>Die alte Unterkunft genügt nicht mehr</strong>
                    <span>
                        Die bisherige Unterbringung in der Alten Schule
                        entspricht seit Jahren nicht mehr den modernen
                        Anforderungen an ein Feuerwehrgerätehaus. Der Neubau
                        wird zeitgemäße Bedingungen für unsere ehrenamtlichen
                        Feuerwehrleute schaffen.
                    </span>
                </div>
            </section>

            <section className="block" aria-labelledby="vorteile">
                <SectionHead title="Standort & Vorteile" id="vorteile" />
                <dl className={`kv ${styles.facts}`} style={{ marginTop: 'var(--s3)' }}>
                    {VORTEILE.map(([label, value]) => (
                        <div key={label} style={{ display: 'contents' }}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="block" aria-labelledby="baufortschritt">
                <SectionHead title="Baufortschritt" id="baufortschritt" />
                <div className="timeline" style={{ marginTop: 'var(--s4)' }}>
                    {BAUFORTSCHRITT.map((step) => (
                        <article className="era" key={step.years}>
                            <p className="era-year">{step.years}</p>
                            <div className="era-body">
                                <h3>{step.title}</h3>
                                <p>{step.body}</p>
                                <p className="small muted">
                                    {step.done
                                        ? 'abgeschlossen'
                                        : 'vorgesehen'}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="block" aria-labelledby="ausblick">
                <SectionHead title="Eine neue Ära" id="ausblick" />
                <div className="prose" style={{ marginTop: 'var(--s3)' }}>
                    <p>
                        Für die Sicherheit von Wendessen: Nach Jahren in
                        unzureichender Unterbringung schafft der Neubau endlich
                        moderne Bedingungen für die Feuerwehr.
                    </p>
                    <p>
                        Die Einsatzabteilung stellt sich auf{' '}
                        <Link
                            className="link"
                            href="/dorfleben/vereine/feuerwehr/einsatzabteilung"
                        >
                            ihrer Seite
                        </Link>{' '}
                        vor; zurück zur Übersicht geht es unter{' '}
                        <Link className="link" href="/wohnen-bauen">
                            Wohnen &amp; Bauen
                        </Link>
                        .
                    </p>
                </div>
            </section>
        </Leaf>
    );
}
