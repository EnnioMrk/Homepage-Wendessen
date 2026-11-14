import Image from 'next/image';
import Link from 'next/link';
import {
    Leaf,
    Margin,
    Notice,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';
import { ClubContacts } from '../../_components/ClubContacts';

export const metadata = {
    title: 'Freiwillige Feuerwehr Wendessen – Einsatzabteilung',
    description:
        'Die Freiwillige Feuerwehr Wendessen: Retten, Löschen, Bergen, Schützen. Dienst mittwochs um 18:30 Uhr im Gerätehaus Kirchring / Schustergasse.',
};

const HAUPTAUFGABEN = [
    {
        aufgabe: 'Retten',
        bedeutung: 'Menschen und Tiere aus Notlagen befreien',
    },
    {
        aufgabe: 'Löschen',
        bedeutung: 'Brände bekämpfen und eindämmen',
    },
    {
        aufgabe: 'Bergen',
        bedeutung: 'Sachgüter vor Schäden bewahren',
    },
    {
        aufgabe: 'Schützen',
        bedeutung: 'Gefahren abwenden',
    },
];

const GEMEINSCHAFT = [
    'Wöchentliche Dienste für Ausbildung und Übung',
    'Tagesfahrten und Ausflüge',
    'Zeltlager',
    'Gemeinsame Aktionen und Übungen mit anderen Feuerwehren',
    'Wettkämpfe auf Stadt-, Kreis-, Bezirk- und Landesebene',
    'Osterfeuer',
    'Kinderfest',
    'Laternenumzug',
    'Gedenkveranstaltung zum Volkstrauertag',
    'Evakuierungsübungen im Hospiz',
    'Weihnachtsbaum-Verkauf',
];

export default async function FeuerwehrEinsatzabteilungPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Einsatzabteilung"
                    tallies={[{ label: 'Dienst', value: 'Mi 18:30' }]}
                    note={
                        <>
                            Der Dienst ist offen für Gäste: Wer die Feuerwehr
                            kennenlernen möchte, kommt mittwochs ins Gerätehaus.
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
                    / Einsatzabteilung
                </span>
            </p>

            <PageHead
                title="Freiwillige Feuerwehr"
                lede="Retten, Löschen, Bergen, Schützen – und ein Dorf, das mitwächst."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Auch wir, die „Freiwillige Feuerwehr Wendessen“, möchten
                        auf diesem Wege alle neuen Bürger, die sich hier bei uns
                        im schönen Wendessen ein neues Zuhause geschaffen haben,
                        recht herzlich begrüßen.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Dienst</dt>
                            <dd>immer mittwochs um 18:30 Uhr</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Treffpunkt</dt>
                            <dd>
                                Feuerwehrgerätehaus, Kirchring / Schustergasse
                            </dd>
                        </div>
                        <div className="club-fact">
                            <dt>Mitgliedschaft</dt>
                            <dd>aktiv oder fördernd</dd>
                        </div>
                    </dl>
                </div>
                <Image
                    src="/images/Vereinsleben/freiwillige-feuerwehr.jpg"
                    alt="Freiwillige Feuerwehr Wendessen"
                    width={520}
                    height={360}
                    sizes="260px"
                />
            </div>

            <section aria-labelledby="willkommen">
                <SectionHead title="Warum wir wachsen müssen" id="willkommen" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Wie wichtig eine schlagkräftige Feuerwehr ist, braucht
                        Ihnen als „Häuslebauer“ sicher niemand erzählen. Wer
                        möchte nicht, dass im Notfall – sei mal der Keller unter
                        Wasser oder der Holzschuppen brennt – eine fachkundige
                        und helfende Hand schnell zur Stelle ist. Und auch wenn
                        dies selbstverständlich der Fall ist, so bleibt eines
                        jedoch festzustellen: unser Dorf wächst und somit nimmt
                        auch die Zahl der zu beschützenden Bürger stetig zu. Da
                        bleibt es nicht aus, dass auch wir, die Feuerwehr, wachsen
                        wollen und müssen!
                    </p>
                </div>

                <div style={{ marginTop: 'var(--s4)', maxWidth: '68ch' }}>
                    <Notice title="Darum unsere Bitte an Sie">
                        Werden auch Sie Feuerwehrfrau oder Feuerwehrmann! Tragen
                        auch Sie dazu bei, dass der „Rote Hahn“ in Wendessen
                        weiterhin keine Chance hat und wir weiterhin so
                        schlagkräftig bleiben. Werden Sie Mitglied in einer der
                        größten ehrenamtlichen Organisationen Deutschlands.
                        Immerhin sind deutschlandweit über 1.000.000 Kameraden
                        ehrenamtlich in der Feuerwehr organisiert!
                    </Notice>
                </div>

                <div
                    className="prose"
                    style={{ marginTop: 'var(--s4)' }}
                >
                    <p>
                        Nutzen Sie die Möglichkeit, sich sinnvoll in das aktive
                        Dorfgeschehen mit einzubringen und somit Land und Leute
                        besser und schneller kennen zu lernen. Sollte es Ihnen
                        aus welchen Gründen auch immer nicht möglich sein, sich
                        aktiv an unserem Dienstgeschehen zu beteiligen, so freuen
                        wir uns natürlich auch über eine fördernde
                        Mitgliedschaft.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="aufgaben">
                <SectionHead title="Hauptaufgaben" id="aufgaben" />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Aufgabe</th>
                            <th scope="col">Bedeutung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {HAUPTAUFGABEN.map((eintrag) => (
                            <tr key={eintrag.aufgabe}>
                                <td>
                                    <strong>{eintrag.aufgabe}</strong>
                                </td>
                                <td>{eintrag.bedeutung}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="block" aria-labelledby="gemeinschaft">
                <SectionHead title="Gemeinschaftsaktivitäten" id="gemeinschaft" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <ul>
                        {GEMEINSCHAFT.map((eintrag) => (
                            <li key={eintrag}>{eintrag}</li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="block" aria-labelledby="besuch">
                <SectionHead title="Besuchen Sie uns" id="besuch" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Besuchen Sie einmal den Feuerwehr-Dienst unserer
                        Feuerwehrkameradinnen und -kameraden und informieren Sie
                        sich dort über alles weitere.
                    </p>
                </div>
                <table className="data" style={{ marginTop: 'var(--s4)' }}>
                    <thead>
                        <tr>
                            <th scope="col">Was</th>
                            <th scope="col">Wo und wann</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Dienst</strong>
                            </td>
                            <td>immer mittwochs um 18:30 Uhr</td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Treffpunkt</strong>
                            </td>
                            <td>
                                Feuerwehrgerätehaus im alten Dorfkern nahe der
                                Kirche, Kirchring / Schustergasse
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Jugendfeuerwehr</strong>
                            </td>
                            <td>
                                montags von 18:00 bis 19:30 Uhr im Jugendraum des
                                Feuerwehrgerätehauses
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <ClubContacts organizationId="freiwillige-feuerwehr-wendessen" />

            <p className="block">
                Wir freuen uns auf Ihren Besuch! Ihre Freiwillige Feuerwehr
                Wendessen.
            </p>

            <p>
                <Link
                    className="arrow-link"
                    href="/dorfleben/vereine/jugendfeuerwehr"
                >
                    Zur Jugendfeuerwehr
                </Link>
            </p>
        </Leaf>
    );
}
