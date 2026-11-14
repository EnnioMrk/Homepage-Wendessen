import ZoomableImage from '@/app/components/ZoomableImage';
import Link from 'next/link';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';
import { ClubContacts } from '../../vereine/_components/ClubContacts';

export const metadata = {
    title: 'Hospiz im Gutspark – Institutionen',
    description:
        'Hospiz im Gutspark in Wendessen – Geborgenheit an einem geschichtsträchtigen Ort. Stationäre Versorgung, zehn Gäste und die Geschichte vom Rittergut zum HospizZentrum.',
};

const ZEITLINIE = [
    {
        jahr: '1660',
        titel: 'Erste Erwähnung',
        text: 'Das „Rittergut Wendessen“ wird erstmals erwähnt.',
    },
    {
        jahr: '1860',
        titel: 'Familie Seeliger',
        text: 'Familie Seeliger erwirbt das Gut und betreibt hier Landwirtschaft.',
    },
    {
        jahr: '1944',
        titel: 'Zerstörung & Wiederaufbau',
        text: 'Im Januar wird das Gutshaus durch den Bombenabwurf auf die nahegelegene Bahnlinie zerstört. Nach dem Krieg wird es wieder aufgebaut. Daher stehen nur die Gutsmauer und der Gewölbekeller unter Denkmalschutz.',
    },
    {
        jahr: '2001',
        titel: 'Verkauf an die Stadt',
        text: 'Familie Seeliger verkauft das Gut an die Stadt Wolfenbüttel. Sie nutzt ihr Wohnrecht bis 2017.',
    },
    {
        jahr: '2017',
        titel: 'Leerstand',
        text: 'Das Gutshaus steht leer, unbeheizt und ohne Perspektive für die zukünftige Nutzung.',
    },
    {
        jahr: '2020',
        titel: 'Erbbaurecht für den Hospizverein',
        text: 'Die Stadt übergibt das Haus im Erbbaurecht für 90 Jahre an den Hospizverein Wolfenbüttel – zur ausschließlichen Nutzung als HospizZentrum.',
    },
    {
        jahr: '2024',
        titel: 'Eröffnung',
        text: 'Die umfangreichen Umbauarbeiten werden ausschließlich durch Spenden und Fördermittel finanziert. Am 16. Juni wird der Bau seiner Bestimmung übergeben. Der Hospizverein Wolfenbüttel eröffnet das „Hospiz im Gutspark“.',
    },
];

export default async function HospizInstitutionPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Hospiz im Gutspark"
                    tallies={[
                        { label: 'Gäste', value: 10 },
                        { label: 'Mitarbeitende', value: '30+' },
                        { label: 'Eröffnet', value: 2024 },
                    ]}
                    note={
                        <>
                            Das HospizZentrum steht in Sichtweite der Kirche St.
                            Georg, gleich hinter der historischen Gutsmauer.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Institutionen / Hospiz</span>
            </p>

            <PageHead
                kicker="Dorfleben · Institutionen"
                title="Hospiz im Gutspark"
                lede="Geborgenheit an einem geschichtsträchtigen Ort – vom Rittergut zum HospizZentrum."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        In Sichtweite der Kirche St. Georg – gleich hinter der
                        historischen Gutsmauer – erhebt sich ein viergeschossiger
                        Bau: das HospizZentrum Wolfenbüttel. Neben dem stationären
                        „Hospiz im Gutspark“ hat hier der Hospizverein seine
                        Räume.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Adresse</dt>
                            <dd>Am Gute 2, Wendessen</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Gäste</dt>
                            <dd>zehn Plätze</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Träger</dt>
                            <dd>Hospiz im Gutspark gGmbH</dd>
                        </div>
                    </dl>
                </div>
                <ZoomableImage
                    src="/images/hospiz.jpg"
                    alt="Hospiz im Gutspark"
                    caption="Hospiz im Gutspark, Wendessen"
                />
            </div>

            <section aria-labelledby="haus">
                <SectionHead title="Das Haus" id="haus" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Der weiße Außenputz und das rote Ziegeldach heben sich
                        deutlich vom Grau der Mauer ab. Einzig die Gebäudeform und
                        das große grüne Tor an der Westfront erinnern an die
                        Geschichte des Hauses.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="zeitlinie">
                <SectionHead
                    title="Vom Rittergut zum HospizZentrum"
                    id="zeitlinie"
                />
                <p className="small muted" style={{ marginTop: 'var(--s2)' }}>
                    Eine Reise durch die Jahrhunderte (1660 – 2024).
                </p>
                <div className="timeline">
                    {ZEITLINIE.map((eintrag) => (
                        <div className="era" key={eintrag.jahr}>
                            <p className="era-year num">{eintrag.jahr}</p>
                            <div className="era-body">
                                <h3>{eintrag.titel}</h3>
                                <p>{eintrag.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="block" aria-labelledby="versorgung">
                <SectionHead title="Das Hospiz im Gutspark" id="versorgung" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <h3>Liebevolle Versorgung</h3>
                    <p>
                        Das Hospiz kann zehn Gäste aufnehmen – Menschen mit einer
                        lebensverkürzenden Erkrankung, die absehbar zum Tod führen
                        wird. Sie werden hier von Fachkräften medizinisch und
                        pflegerisch versorgt und liebevoll umsorgt.
                    </p>
                    <h3>Atmosphäre & Umgebung</h3>
                    <p>
                        Die Gäste und ihre An- und Zugehörigen schätzen die Lage
                        des Hauses am Rande des Gutsparks mit seinen hohen Bäumen.
                        Der schön angelegte Hospizgarten und die beiden Terrassen
                        laden zum Verweilen ein. Mit dem Umbau ist es gelungen,
                        bei aller notwendigen Funktionalität eine wohnliche
                        Atmosphäre zu schaffen, die der Historie des Ortes gerecht
                        wird.
                    </p>
                    <p>
                        Mit über 30 Mitarbeitenden in Pflege, Hauswirtschaft und
                        Verwaltung ist das Hospiz der größte Arbeitgeber von
                        Wendessen.
                    </p>
                </div>
            </section>

            <ClubContacts
                organizationId="hospiz-institution-wendessen"
                title="Ihr Ansprechpartner"
            />

            <p className="block">
                <Link className="arrow-link" href="/dorfleben/vereine/hospiz">
                    Zum Hospizverein Wolfenbüttel
                </Link>
            </p>
        </Leaf>
    );
}
