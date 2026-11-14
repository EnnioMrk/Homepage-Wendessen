import Image from 'next/image';
import Link from 'next/link';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';
import { ClubContacts } from '../_components/ClubContacts';

export const metadata = {
    title: 'Kirchbauverein St. Georg Wendessen',
    description:
        'Der Kirchbauverein St. Georg Wendessen – Erhaltung und Pflege der historischen Wehrkirche aus dem 12. Jahrhundert. Gegründet im Januar 2002, 96 Mitglieder.',
};

const PROJEKTE = [
    'Einbau eines WCs',
    'Installation einer Teeküche',
    'Neue Heizung und Elektrik',
    'Erneuerung der Fassade',
    'Renovierung der Kirchgartenmauer',
];

const MUSIK = ['Jazz-Konzerte', 'Klezmer-Musik', 'Folk-Aufführungen', 'Klassische Musik'];

const ORTE = [
    'Konzerte in der Kirche',
    'Open-Air im Kirchgarten',
    'Besondere Akustik',
    'Angenehme Atmosphäre',
];

const BEITRAEGE = [
    { person: 'Paare', betrag: '40 €' },
    { person: 'Einzelpersonen', betrag: '24 €' },
    { person: 'Schüler/Studenten', betrag: '12 €' },
];

export default async function KirchbauvereinPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Kirchbauverein"
                    tallies={[
                        { label: 'Mitglieder', value: 96 },
                        { label: 'Gegründet', value: 2002 },
                    ]}
                    note={
                        <>
                            Der Verein wirbt gemeinsam mit der Kirchengemeinde
                            Ahlum – Atzum – Wendessen Mittel für Arbeiten an der
                            St. Georg Kirche ein.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Vereine / Kirchbauverein</span>
            </p>

            <PageHead
                title="Kirchbauverein St. Georg Wendessen e.V."
                lede="Seit 2002 setzt der Verein die Tradition der Kirchenerhaltung fort – mit Konzerten, Mitgliedsbeiträgen und Spenden."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Eine der ältesten Kirchen Wolfenbüttels: Die St. Georg
                        Kirche wurde im 12. Jahrhundert als Wehrkirche erbaut.
                        Der Kirchbauverein St. Georg Wendessen wurde im Januar
                        2002 als gemeinnütziger Verein gegründet und hat zurzeit
                        96 Mitglieder.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Gegründet</dt>
                            <dd>Januar 2002, gemeinnütziger Verein</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Mitglieder</dt>
                            <dd>96</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Kirche</dt>
                            <dd>
                                St. Georg, im 12. Jahrhundert als Wehrkirche
                                erbaut
                            </dd>
                        </div>
                        <div className="club-fact">
                            <dt>Beiträge</dt>
                            <dd>40 € Paare, 24 € Einzelpersonen, 12 € Schüler und Studenten</dd>
                        </div>
                    </dl>
                </div>
                <figure className="figure">
                    <Image
                        src="/images/Vereinsleben/kirche.webp"
                        alt="St. Georg Kirche Wendessen - Historische Wehrkirche aus dem 12. Jahrhundert"
                        width={520}
                        height={360}
                        sizes="260px"
                    />
                    <figcaption>
                        <span>St. Georg Kirche</span>
                        <span>Wendessen</span>
                    </figcaption>
                </figure>
            </div>

            <section aria-labelledby="geschichte">
                <SectionHead title="Über uns" id="geschichte" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <h3>Historischer Hintergrund</h3>
                    <p>
                        Im 12. Jahrhundert als Wehrkirche erbaut, gehört die
                        Wendesser Kirche zu den ältesten in Wolfenbüttel. Nach
                        ihrer fast vollständigen Zerstörung durch einen
                        Bombenangriff im Januar 1944 wurde die Kirche durch das
                        Engagement des damaligen Pfarrers und durch großzügige
                        Unterstützung von Wendesser Bürgern wieder aufgebaut.
                    </p>
                    <h3>Unsere Mission</h3>
                    <p>
                        Diese Tradition führt der Kirchbauverein nun seit
                        Vereinsgründung weiter fort. Das vorrangige Ziel des
                        Vereins ist, in Zusammenarbeit mit der Kirchengemeinde
                        Ahlum – Atzum – Wendessen, finanzielle Mittel einzuwerben,
                        die für Arbeiten am Innen- sowie am Außenbereich der St.
                        Georg Kirche aufgewendet werden.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="erfolge">
                <SectionHead title="Unsere Erfolge seit 2002" id="erfolge" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>Abgeschlossene Projekte:</p>
                    <ul>
                        {PROJEKTE.map((eintrag) => (
                            <li key={eintrag}>{eintrag}</li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="block" aria-labelledby="veranstaltungen">
                <SectionHead
                    title="Kulturelle Veranstaltungen"
                    id="veranstaltungen"
                />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Einer der Wege, um Geld für den Verein zu erwirtschaften,
                        sind die mittlerweile fest etablierten Konzerte. Jazz-,
                        Klezmer-, Folk- oder klassische Musik zieht regelmäßig
                        Publikum aus der ganzen Region an, Musiker, teils von
                        Weltrang, erfreuen sich an der Akustik der Kirche.
                    </p>
                    <h3>Musikrichtungen</h3>
                    <ul>
                        {MUSIK.map((eintrag) => (
                            <li key={eintrag}>{eintrag}</li>
                        ))}
                    </ul>
                    <h3>Veranstaltungsorte</h3>
                    <ul>
                        {ORTE.map((eintrag) => (
                            <li key={eintrag}>{eintrag}</li>
                        ))}
                    </ul>
                    <p>
                        Der Verein ist damit nicht nur für das Kirchengebäude,
                        sondern auch als kultureller Veranstalter von Bedeutung.
                    </p>
                    <h3>Newsletter abonnieren</h3>
                    <p>
                        Wenn Sie über die Veranstaltungen per E-Mail informiert
                        werden möchten:{' '}
                        <a href="mailto:kirchbauverein.wendessen@gmail.com">
                            kirchbauverein.wendessen@gmail.com
                        </a>
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="mitgliedschaft">
                <SectionHead
                    title="Mitgliedschaft & Unterstützung"
                    id="mitgliedschaft"
                />
                <h3 style={{ marginTop: 'var(--s4)' }}>Jahresbeiträge</h3>
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Mitgliedschaft</th>
                            <th scope="col" className="right">
                                Beitrag im Jahr
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {BEITRAEGE.map((eintrag) => (
                            <tr key={eintrag.person}>
                                <td>{eintrag.person}</td>
                                <td className="right">{eintrag.betrag}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p style={{ marginTop: 'var(--s3)' }}>
                    <a
                        className="btn"
                        href="https://www.kirchbauverein-wendessen.de/wp-content/uploads/2021/09/Beitrittserklaerung.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Beitragsformular
                    </a>
                </p>

                <h3 style={{ marginTop: 'var(--s6)' }}>Einmalige Spende</h3>
                <p className="small muted" style={{ marginBottom: 'var(--s2)' }}>
                    Sie möchten uns gern einmalig finanziell unterstützen? Dann
                    freuen wir uns sehr über Ihre Spende.
                </p>
                <dl className="kv">
                    <dt>Empfänger</dt>
                    <dd>Kirchbauverein St. Georg Wendessen</dd>
                    <dt>Bank</dt>
                    <dd>Volksbank Wolfenbüttel</dd>
                    <dt>IBAN</dt>
                    <dd className="num">DE 38 2709 2555 5000 7858 00</dd>
                </dl>
                <p className="small" style={{ marginTop: 'var(--s3)' }}>
                    Jede Spende hilft bei der Erhaltung unserer historischen
                    Kirche!
                </p>
            </section>

            <section className="block" aria-labelledby="kontakt">
                <SectionHead title="Kontakt & Website" id="kontakt" />
                <div className="feature-split">
                    <div>
                        <p className="feature-lead">
                            Sollten wir Ihr Interesse geweckt haben, sprechen Sie
                            uns doch einfach an oder besuchen Sie uns auf unserer
                            Homepage.
                        </p>
                        <p
                            className="pill-row"
                            style={{ marginTop: 'var(--s4)' }}
                        >
                            <a
                                className="btn btn--primary"
                                href="https://www.kirchbauverein-wendessen.de"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                www.kirchbauverein-wendessen.de
                            </a>
                            <a
                                className="btn"
                                href="mailto:kirchbauverein.wendessen@gmail.com"
                            >
                                E-Mail schreiben
                            </a>
                        </p>
                    </div>
                    <figure className="figure">
                        <Image
                            src="/images/Vereinsleben/kirchbauverein.webp"
                            alt="Kirchbauverein St. Georg Wendessen Logo"
                            width={520}
                            height={240}
                            sizes="(max-width: 860px) 100vw, 420px"
                        />
                        <figcaption>
                            <span>Kirchbauverein St. Georg</span>
                            <span>Wendessen</span>
                        </figcaption>
                    </figure>
                </div>
            </section>

            <ClubContacts organizationId="kirchbauverein-wendessen" />

            <p className="block">
                <Link
                    className="arrow-link"
                    href="/dorfleben/institutionen/kirche"
                >
                    Zur Kirchengemeinde Ahlum-Atzum-Wendessen
                </Link>
            </p>
        </Leaf>
    );
}
