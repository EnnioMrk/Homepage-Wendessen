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
    title: 'Neubaugebiet Leipziger Allee – Wohnen & Bauen',
    description:
        'Das Neubaugebiet in Wendessen auf dem Gelände der ehemaligen Zuckerfabrik: rund 29.000 m², etwa 30 Häuser und 35 Wohnungen, Zuckerring, Regio-Bahn 2028/29 sowie P+R und B+R.',
};

const FACTS: [string, React.ReactNode][] = [
    ['Fläche', 'rund 29.000 m², unterteilt in Allgemeine Wohngebiete und Verkehrsflächen'],
    [
        'Wohnen',
        'etwa 30 Wohneinheiten in Einzel- oder Doppelhäusern und um die 35 Geschosswohnungen',
    ],
    [
        'Erschließung',
        'über die Leipziger Allee und eine Ringstraße, die den Namen „Zuckerring“ erhalten hat; fußläufig und für den Radverkehr über den „Lindenblick“',
    ],
    [
        'Lage',
        'im Westen an die offene Landschaft grenzend, entlang der südlichen Grenze verläuft die Bahntrasse Wolfenbüttel – Schöppenstedt',
    ],
    [
        'Bahn',
        'Haltepunkt der geplanten Regio-Bahn im Rahmen der Stationsoffensive des Regionalverbands Großraum Braunschweig, nach den aktuellen Planungen der Deutschen Bahn voraussichtlich 2028/29',
    ],
    [
        'Mobilität',
        'Park+Ride und Bike+Ride unmittelbar am künftigen Bahnhaltepunkt; Bushaltebucht auf der Westseite und Bushaltestelle auf der Ostseite im Zuge des Umbaus der B79 und des ÖPNV-Knotenpunkts, ergänzt um eine Querungshilfe',
    ],
];

const TIMELINE: [string, string][] = [
    ['Planungsphase', 'aktuell laufend durch die Stadt Wolfenbüttel'],
    ['Baubeginn', 'Ende 2026'],
    ['Status', 'planungsrechtliche Schritte in Bearbeitung'],
];

const FEATURES: [string, string][] = [
    [
        'Zukunftsorientiert',
        'Entwicklung auf dem Gelände der ehemaligen Zuckerfabrik mit modernen Wohnkonzepten.',
    ],
    [
        'Verkehrsanbindung',
        'Optimale Lage am künftigen Bahnhaltepunkt für beste Erreichbarkeit.',
    ],
    [
        'Professionell geplant',
        'Planungsrechtliche Betreuung durch die Stadt Wolfenbüttel.',
    ],
];

export default async function NeubaugebietPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Baugebiet"
                    tallies={[
                        { label: 'Fläche', value: '29.000 m²' },
                        { label: 'Häuser', value: '~30' },
                        { label: 'Wohnungen', value: '~35' },
                    ]}
                    note={
                        <>
                            Die Flächenangaben sind gerundet; verbindlich ist
                            der Bebauungsplan der Stadt Wolfenbüttel.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Wohnen & Bauen · Baugebiet"
                title="Neubaugebiet Leipziger Allee"
                lede="Auf dem Gelände der ehemaligen Zuckerfabrik entsteht Raum für modernes Wohnen am künftigen Bahnhaltepunkt. Wendessen wächst."
            />

            <div className="prose">
                <p>
                    In Wendessen entsteht auf dem Gelände der ehemaligen
                    Zuckerfabrik am künftigen Bahnhaltepunkt ein neues
                    Baugebiet. Das Gelände wurde von einem privaten Investor
                    erworben; im Sommer 2022 erfolgte der Beschluss zur
                    Aufstellung eines Bebauungsplanes.
                </p>
            </div>

            <section className="block" aria-labelledby="vorhaben">
                <SectionHead title="Das Vorhaben" id="vorhaben" />
                <dl className={`kv ${styles.facts}`} style={{ marginTop: 'var(--s3)' }}>
                    {FACTS.map(([label, value]) => (
                        <div key={label} style={{ display: 'contents' }}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="block" aria-labelledby="zeitplan">
                <SectionHead title="Zeitplan" id="zeitplan" />
                <dl className={`kv ${styles.facts}`} style={{ marginTop: 'var(--s3)' }}>
                    {TIMELINE.map(([label, value]) => (
                        <div key={label} style={{ display: 'contents' }}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="block" aria-labelledby="bebauungsplan">
                <SectionHead title="Bebauungsplan" id="bebauungsplan" />
                <div className="prose" style={{ marginTop: 'var(--s3)' }}>
                    <p>
                        Erste Eindrücke der möglichen künftigen Gestaltung des
                        Geländes.
                    </p>
                </div>

                <figure className="figure" style={{ marginTop: 'var(--s4)' }}>
                    <ZoomableImage
                        src="/images/bebauungsvorschlag-leiziger-allee.jpg"
                        alt="Bebauungsvorschlag Leipziger Allee – Neubaugebiet Wendessen"
                        framed={false}
                    />
                    <figcaption>
                        <span>Bebauungsvorschlag Leipziger Allee</span>
                    </figcaption>
                </figure>

                <figure className="figure" style={{ marginTop: 'var(--s4)' }}>
                    <ZoomableImage
                        src="/images/baugebiet-leiziger-allee-wendessen-mai-2024.jpg"
                        alt="Baugebiet Leipziger Allee in Wendessen im Mai 2024, Fläche für den geplanten Hausbau"
                        framed={false}
                    />
                    <figcaption>
                        <span>
                            Baugebiet Leipziger Allee (Mai 2024): Hier entstehen
                            die geplanten Häuser
                        </span>
                    </figcaption>
                </figure>

                <div className="notice notice--warn" style={{ marginTop: 'var(--s4)' }}>
                    <strong>Wichtiger Hinweis</strong>
                    <span>
                        Die dargestellten Grafiken zeigen erste Eindrücke der
                        möglichen künftigen Gestaltung des Geländes und sind
                        aktuell noch nicht rechtsverbindlich.
                    </span>
                </div>
            </section>

            <section className="block" aria-labelledby="merkmale">
                <SectionHead title="Projektmerkmale" id="merkmale" />
                <dl className={`kv ${styles.facts}`} style={{ marginTop: 'var(--s3)' }}>
                    {FEATURES.map(([label, value]) => (
                        <div key={label} style={{ display: 'contents' }}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="block" aria-labelledby="ansprechpartner">
                <SectionHead title="Ansprechpartner" id="ansprechpartner" />
                <div className="grid-2" style={{ marginTop: 'var(--s3)' }}>
                    <div>
                        <h3>Investor &amp; Eigentümer</h3>
                        <p style={{ marginTop: 'var(--s1)' }}>
                            <strong>MGM Management GbR</strong>
                        </p>
                        <dl className={`kv ${styles.facts}`} style={{ marginTop: 'var(--s3)' }}>
                            <div style={{ display: 'contents' }}>
                                <dt>Ansprechpartner</dt>
                                <dd>Stephan Malonnek</dd>
                            </div>
                            <div style={{ display: 'contents' }}>
                                <dt>Telefon</dt>
                                <dd>
                                    <a
                                        className="link"
                                        href="tel:051137359373"
                                    >
                                        0511-37359373
                                    </a>
                                </dd>
                            </div>
                            <div style={{ display: 'contents' }}>
                                <dt>E-Mail</dt>
                                <dd>
                                    <a
                                        className="link"
                                        href="mailto:stephan.malonnek@mgm-management.de"
                                    >
                                        stephan.malonnek@mgm-management.de
                                    </a>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div>
                        <h3>Planungsrechtliche Betreuung</h3>
                        <p style={{ marginTop: 'var(--s1)' }}>
                            <strong>Stadt Wolfenbüttel</strong>
                        </p>
                        <dl className={`kv ${styles.facts}`} style={{ marginTop: 'var(--s3)' }}>
                            <div style={{ display: 'contents' }}>
                                <dt>Zuständigkeiten</dt>
                                <dd>
                                    Erschließungsplanung, Bebauungsplan,
                                    Genehmigungsverfahren und rechtliche
                                    Rahmenbedingungen.
                                </dd>
                            </div>
                            <div style={{ display: 'contents' }}>
                                <dt>Kontakt</dt>
                                <dd>
                                    Fragen zu Grundstücken und Bauanträgen
                                    beantwortet die Stadt Wolfenbüttel. Für
                                    Hinweise an die Dorfseite steht das{' '}
                                    <Link
                                        className="link"
                                        href="/kontakt/formular"
                                    >
                                        Kontaktformular
                                    </Link>{' '}
                                    bereit.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </section>

            <section className="block" aria-labelledby="ausblick">
                <SectionHead title="Wendessen wächst weiter" id="ausblick" />
                <div className="prose" style={{ marginTop: 'var(--s3)' }}>
                    <p>
                        Neues Wohnen am Bahnhaltepunkt – modern, nachhaltig,
                        zukunftsorientiert. Die Zukunft des Wohnens in
                        Wendessen.
                    </p>
                    <p>
                        Zurück zur Übersicht:{' '}
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
