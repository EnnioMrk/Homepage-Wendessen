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
    title: 'Jugendfeuerwehr Wendessen',
    description:
        'Die Jugendfeuerwehr Wendessen – Spaß, Action und feuerwehrtechnisches Wissen für Kinder und Jugendliche von 10 bis 16 Jahren. Dienst montags von 18:00 bis 19:30 Uhr.',
};

const AKTIONEN = [
    'Feuerwehrtechnisches Wissen erlernen und üben',
    'Wettpaddeln auf dem Fümmelsee',
    'Oder-Camp Abenteuer',
    'Leistungsfahrten und Wettbewerbe',
];

export default async function JugendfeuerwehrPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Jugendfeuerwehr"
                    tallies={[
                        { label: 'Alter', value: '10–16' },
                        { label: 'Bestehen', value: '25+ Jahre' },
                    ]}
                    note={
                        <>
                            Der Dienst findet im Jugendraum des
                            Feuerwehrgerätehauses statt, mitten im Dorf gegenüber
                            dem Spielplatz.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">
                    / Vereine /{' '}
                    <Link
                        className="link-quiet"
                        href="/dorfleben/vereine/feuerwehr"
                    >
                        Feuerwehr
                    </Link>{' '}
                    / Jugendfeuerwehr
                </span>
            </p>

            <PageHead
                title="Jugendfeuerwehr"
                lede="Spaß, Action und feuerwehrtechnisches Wissen für Jungen und Mädchen von 10 bis 16 Jahren."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Wir sind die Jugendgruppe der Freiwilligen Feuerwehr
                        Wolfenbüttel im Ortsteil Wendessen – und mittlerweile
                        gibt es unsere Jugendfeuerwehr schon über 25 Jahre.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Alter</dt>
                            <dd>Jungen und Mädchen von 10 bis 16 Jahren</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Dienst</dt>
                            <dd>jeden Montag von 18:00 bis 19:30 Uhr</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Ort</dt>
                            <dd>Jugendraum des Feuerwehrgerätehauses</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Leitung</dt>
                            <dd>
                                Jugendfeuerwehrwart Christoph Schmegner,
                                Stellvertreter Frederick Witte und Betreuer
                            </dd>
                        </div>
                    </dl>
                </div>
                <Image
                    src="/images/Vereinsleben/jugendfeuerwehr.jpeg"
                    alt="Jugendfeuerwehr Wendessen in Aktion"
                    width={520}
                    height={360}
                    sizes="260px"
                />
            </div>

            <section aria-labelledby="hallo">
                <SectionHead title="Hallo Kinder & Jugendliche" id="hallo" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Hallo all den Kindern und Jugendlichen, die mit Ihren
                        Eltern hier bei uns in Wendessen ein neues Zuhause
                        gefunden haben. Damit Ihr wisst, was in unserem Dorf so
                        los ist und was ihr so machen könnt, möchten wir uns kurz
                        vorstellen.
                    </p>
                    <p>
                        Bei uns gibt es Jungen und Mädchen im Alter von 10 bis 16
                        Jahren. Gemeinsam mit unserem Jugendfeuerwehrwart
                        Christoph Schmegner, seinem Stellvertreter Frederick Witte
                        sowie unseren Betreuern eignen wir uns durch Erlernen und
                        Üben feuerwehrtechnisches Wissen an.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="dienst">
                <SectionHead title="Unsere Dienstzeiten" id="dienst" />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Tag</th>
                            <th scope="col">Zeit</th>
                            <th scope="col">Ort</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Montag</strong>
                            </td>
                            <td>18:00 – 19:30 Uhr</td>
                            <td>Jugendraum des Feuerwehrgerätehauses</td>
                        </tr>
                    </tbody>
                </table>
                <p className="small muted" style={{ marginTop: 'var(--s2)' }}>
                    Jeden Montag treffen wir uns in unserem Jugendraum zum
                    „Dienst“.
                </p>
            </section>

            <section className="block" aria-labelledby="aktionen">
                <SectionHead title="Action & Spaß" id="aktionen" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <ul>
                        {AKTIONEN.map((eintrag) => (
                            <li key={eintrag}>{eintrag}</li>
                        ))}
                    </ul>
                    <p>
                        <strong>
                            Auf jeden Fall haben wir immer Spaß zusammen!
                        </strong>
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="mitmachen">
                <SectionHead title="Mach mit" id="mitmachen" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Wenn Du zwischen 10 und 16 Jahren alt bist und gern bei
                        uns mitmachen möchtest, dann melde Dich doch bei uns!
                    </p>
                    <p>
                        Das Feuerwehr-Gerätehaus findest Du mitten im Dorf
                        gegenüber dem Spielplatz. Wenn Du neugierig geworden bist,
                        kannst Du uns auch gerne einmal im Internet unter{' '}
                        <a
                            href="http://www.jf-wendessen.jimdo.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.jf-wendessen.jimdo.com
                        </a>{' '}
                        besuchen oder Du wendest Dich direkt an unseren
                        Jugendwart Frederick Witte.
                    </p>
                </div>
            </section>

            <ClubContacts organizationId="jugendfeuerwehr-wendessen" />

            <p className="block">
                Wir freuen uns auf Dich! Deine Jugendfeuerwehr Wendessen.
            </p>

            <p>
                <Link
                    className="arrow-link"
                    href="/dorfleben/vereine/feuerwehr/einsatzabteilung"
                >
                    Zur Einsatzabteilung
                </Link>
            </p>
        </Leaf>
    );
}
