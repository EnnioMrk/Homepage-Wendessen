import ZoomableImage from '@/app/components/ZoomableImage';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Geschichte',
    description:
        'Von der ersten urkundlichen Erwähnung 1170 als Winedissen bis heute: die Chronik Wendessens mit Ortsnamen, Ereignissen und Einwohnerzahlen.',
};

const NAMES: [string, string, string?][] = [
    ['1170', 'Winedissen', 'Erste urkundliche Erwähnung'],
    ['um 1200', 'Winethissem'],
    ['1292', 'Wenethessen'],
    ['um 1300', 'Wendessem'],
    ['1358', 'Wendessum'],
    ['ab 1350', 'Wendessen', 'bis heute'],
];

const ERAS: {
    years: string;
    title: string;
    body: [string, string][];
    note?: string;
}[] = [
    {
        years: '1218',
        title: 'Kaiserliche Schenkung',
        body: [
            [
                '12. Mai 1218',
                'Kaiser Otto IV. schenkte dem Stift St. Blasii zu Braunschweig die Patronatsrechte, unter anderem auch über Wendessen.',
            ],
        ],
    },
    {
        years: '1493–1627',
        title: 'Kriege und Zerstörung',
        body: [
            ['1493', 'Wendessen wurde von den Braunschweigern geplündert.'],
            [
                '1542',
                'Im Schmalkaldischen Krieg wurde das Pfarrhaus von den Schmalkalden zerstört.',
            ],
            ['19. Juni 1550', 'Überfall der Stadt Braunschweig auf Wendessen.'],
            [
                '1627',
                'Im Dreißigjährigen Krieg wird das Dorf von den Dänen zerstört und niedergebrannt.',
            ],
        ],
    },
    {
        years: '1660',
        title: 'Das Gut Wendessen',
        body: [
            ['1660', 'Das Gut wurde gebaut.'],
            ['1736', 'Fürstliches Kammergut.'],
            ['1772', 'Kauf durch Amtsrat Müller.'],
            ['1864–2001', 'Besitz der Familie Seeliger.'],
            ['Heute', 'Hospizzentrum Wendessen.'],
        ],
    },
    {
        years: '1759',
        title: 'Wendesser Berg',
        body: [
            [
                '1759',
                'Die Wolfenbütteler Gerichtsstätte wurde auf den Wendesser Berg verlegt.',
            ],
            ['1762', 'Bau der Schanze auf dem Wendesser Berg.'],
        ],
    },
    {
        years: '1843',
        title: 'Eisenbahn und Industrie',
        body: [
            ['1843', 'Eisenbahnanschluss an der Strecke Braunschweig–Helmstedt.'],
            ['1857', 'Errichtung der Zuckerfabrik, betrieben bis 1957.'],
            ['1957', 'Ende der Zuckerfabrik.'],
        ],
        note: 'Heute ist die Bebauung des Geländes mit Ein- und Mehrfamilienhäusern geplant; die Wiederinbetriebnahme des Bahnhaltepunktes ist vorgesehen.',
    },
    {
        years: '1944',
        title: 'Luftangriff vom 14. Januar 1944',
        body: [
            [
                '14. Januar 1944',
                'Bei einem Luftangriff wurden das Rittergut, die aus dem 12. Jahrhundert stammende Kirche, Wohnhäuser, Scheunen und Ställe zerstört.',
            ],
            [
                'Opfer',
                'Durch einen Volltreffer auf einen haltenden Zug starben 36 Menschen.',
            ],
        ],
    },
];

const POPULATION: [string, string, string?][] = [
    ['1663', '75', 'ohne Kinder unter 14'],
    ['1756', '200'],
    ['1855', '5 Tote', 'Cholera'],
    ['1859', '10 Tote', 'Cholera'],
    ['Mitte 2005', '750'],
    ['2026', '1.100'],
];

export default async function GeschichtePage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Chronik"
                    tallies={[
                        { label: 'Erwähnt', value: 1170 },
                        { label: 'Jahre', value: '850' },
                        { label: 'Einwohner', value: '1.100' },
                    ]}
                    note={
                        <>
                            Ortsheimatpfleger: Erich Isensee. Quellen sind die
                            Ortschronik und die Angaben der Gemeinde.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Geschichte · seit 1170"
                title="Winedissen, Wendessum, Wendessen"
                lede="850 Jahre Chronik eines Dorfes, das Kriege und Krisen überstanden hat, gewachsen ist und heute zwischen Weidezaun und Neubaugebiet steht."
            />

            <section aria-labelledby="name">
                <SectionHead title="Die Entwicklung des Ortsnamens" id="name" />
                <table className="data" style={{ marginTop: 'var(--s3)' }}>
                    <caption className="visually-hidden">
                        Ortsnamen Wendessens von 1170 bis heute
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col">Jahr</th>
                            <th scope="col">Name</th>
                            <th scope="col">Anmerkung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {NAMES.map(([year, name, note]) => (
                            <tr key={name}>
                                <td className="num" style={{ whiteSpace: 'nowrap' }}>
                                    {year}
                                </td>
                                <td>
                                    <strong>{name}</strong>
                                </td>
                                <td className="muted">{note ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="block" aria-labelledby="ereignisse">
                <SectionHead title="Historische Ereignisse" id="ereignisse" />
                <div className="timeline" style={{ marginTop: 'var(--s4)' }}>
                    {ERAS.map((era) => (
                        <article className="era" key={era.title}>
                            <p className="era-year">{era.years}</p>
                            <div className="era-body">
                                <h3>{era.title}</h3>
                                <dl className="kv" style={{ borderTop: 0, paddingTop: 0 }}>
                                    {era.body.map(([when, what]) => (
                                        <div key={when} style={{ display: 'contents' }}>
                                            <dt>{when}</dt>
                                            <dd>{what}</dd>
                                        </div>
                                    ))}
                                </dl>
                                {era.note && (
                                    <p
                                        className="small"
                                        style={{
                                            marginTop: 'var(--s3)',
                                            paddingLeft: 'var(--s3)',
                                            borderLeft: '2px solid var(--ledger)',
                                            color: 'var(--ink-secondary)',
                                        }}
                                    >
                                        {era.note}
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="block" aria-labelledby="bevoelkerung">
                <SectionHead title="Bevölkerungsentwicklung" id="bevoelkerung" />
                <table className="data" style={{ marginTop: 'var(--s3)' }}>
                    <caption className="visually-hidden">
                        Einwohnerzahlen Wendessens
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col">Jahr</th>
                            <th scope="col">Einwohner</th>
                            <th scope="col">Anmerkung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {POPULATION.map(([year, value, note]) => (
                            <tr key={year}>
                                <td className="num">{year}</td>
                                <td>
                                    <strong>{value}</strong>
                                </td>
                                <td className="muted">{note ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="block" aria-labelledby="wappen">
                <SectionHead title="Wappen und Kirche" id="wappen" />
                <div className="feature-split">
                    <ZoomableImage
                        src="/images/850-jahre-geschichte.jpg"
                        alt="Historische Aufnahme zu 850 Jahren Wendessen"
                        caption="850 Jahre Geschichte Wendessens"
                    />
                    <div className="figure--note">
                        <p className="margin-label">Wappen</p>
                        <p>
                            Der Name Wendessen bedeutet „Heim im Weidezaun“. Im
                            Wappen versinnbildlicht der grüne Flechtzaun diesen
                            Namen und verweist zugleich auf die Landwirtschaft
                            als wichtigen Wirtschaftszweig.
                        </p>
                        <p style={{ marginTop: 'var(--s3)' }}>
                            Die Wehrkirche von Wendessen ist St. Georg geweiht.
                            Als Sinnbild erscheint das heraldische Attribut des
                            Schutzpatrons: das rote Kreuz auf silbernem Grund.
                        </p>
                        <div style={{ maxWidth: 120, marginTop: 'var(--s4)' }}>
                            <ZoomableImage
                                src="/images/wappen.png"
                                alt="Wappen von Wendessen"
                                framed={false}
                                imageClassName="object-contain"
                            />
                        </div>
                        <p className="muted small" style={{ marginTop: 'var(--s3)' }}>
                            Ortsheimatpfleger: Erich Isensee
                        </p>
                    </div>
                </div>
            </section>
        </Leaf>
    );
}
