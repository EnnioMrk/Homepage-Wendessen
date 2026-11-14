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
import { ClubContacts } from '../_components/ClubContacts';

export const metadata = {
    title: 'Schützenverein Wendessen e.V.',
    description:
        'Schützenverein Wendessen e.V. – sportliche Heimat für über 50 Mitglieder. Schießsport für Kinder, Jugendliche, Frauen und Männer, Schießabende mittwochs 18–21 Uhr.',
};

const AUSSTATTUNG = [
    {
        stand: 'KK und SpoPi',
        detail: '2 Stände auf 50/25 m Distanz, elektronische Auswertung',
    },
    {
        stand: 'Luftgewehr',
        detail: '2 Stände mit Infrarotauswertung',
    },
];

const VERANSTALTUNGEN = [
    {
        titel: 'Ostereierschießen',
        text: 'Traditionelles Frühjahrs-Event für die ganze Familie',
    },
    {
        titel: 'Königsschießen',
        text: 'Mit großer Königsproklamation – das Highlight des Jahres',
    },
    {
        titel: 'Pokal- und Mannschaftsschießen',
        text: 'Wettkampf und Teamgeist stehen im Vordergrund',
    },
    {
        titel: 'Schweineschießen',
        text: 'Geselliges Schießen mit kulinarischem Höhepunkt',
    },
];

export default async function SchuetzenvereinPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Schützenverein"
                    tallies={[
                        { label: 'Mitglieder', value: '50+' },
                        { label: 'Stände', value: 4 },
                        { label: 'Schießabend', value: 'Mi 18–21' },
                    ]}
                    note={
                        <>
                            Jugendtraining sonntags von 10:00 bis 13:00 Uhr.
                            Interessierte Bürger sind jederzeit herzlich
                            willkommen.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Vereine / Schützenverein</span>
            </p>

            <PageHead
                title="Schützenverein Wendessen e.V."
                lede="Schießsport für Kinder, Jugendliche, Frauen und Männer – allein, zu zweit oder mit der ganzen Familie."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Unser Schützenverein Wendessen e.V. ist mehr als nur ein
                        Name. Er ist die sportliche Heimat von über 50
                        Mitgliedern. Bei uns können Kinder, Jugendliche, Frauen
                        und Männer den Schießsport ausüben – allein, zu zweit oder
                        mit der ganzen Familie.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Mitglieder</dt>
                            <dd>über 50</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Schießabend</dt>
                            <dd>mittwochs von 18:00 bis 21:00 Uhr</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Jugendtraining</dt>
                            <dd>sonntags von 10:00 bis 13:00 Uhr</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Jugendalter</dt>
                            <dd>9 bis 17 Jahre</dd>
                        </div>
                    </dl>
                </div>
                <Image
                    src="/images/Vereinsleben/schuetzenverein.jpg"
                    alt="Schützenverein Wendessen"
                    width={520}
                    height={360}
                    sizes="260px"
                />
            </div>

            <section aria-labelledby="ausstattung">
                <SectionHead title="Unsere Ausstattung" id="ausstattung" />
                <p className="small muted" style={{ marginBottom: 'var(--s2)' }}>
                    Als moderner Schützenverein verfügen wir über ein
                    breitgefächertes Programm.
                </p>
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Anlage</th>
                            <th scope="col">Ausstattung</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AUSSTATTUNG.map((eintrag) => (
                            <tr key={eintrag.stand}>
                                <td>
                                    <strong>{eintrag.stand}</strong>
                                </td>
                                <td>{eintrag.detail}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="block" aria-labelledby="schiessabende">
                <SectionHead title="Schießabende" id="schiessabende" />
                <p className="small muted" style={{ marginBottom: 'var(--s2)' }}>
                    Wir würden uns freuen, interessierte Bürger begrüßen zu
                    können.
                </p>
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Tag</th>
                            <th scope="col">Zeit</th>
                            <th scope="col">Gruppe</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Mittwoch</strong>
                            </td>
                            <td>18:00 – 21:00 Uhr</td>
                            <td>Schießabend</td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Sonntag</strong>
                            </td>
                            <td>10:00 – 13:00 Uhr</td>
                            <td>Jugendtraining</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="block" aria-labelledby="veranstaltungen">
                <SectionHead
                    title="Unsere Veranstaltungen"
                    id="veranstaltungen"
                />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Nicht nur aktives Schießen gehört zum Vereinsleben.
                    </p>
                    <ul>
                        {VERANSTALTUNGEN.map((eintrag) => (
                            <li key={eintrag.titel}>
                                <strong>{eintrag.titel}</strong> –{' '}
                                {eintrag.text}
                            </li>
                        ))}
                    </ul>
                    <p>
                        An diesen Veranstaltungen können alle Bürger unseres
                        Dorfes teilnehmen (Informationen kommen frühzeitig).
                    </p>
                    <p>
                        Das Highlight: Der Volkskönig und die Volkskönigin sind
                        für ein Jahr kostenfreie Mitglieder des
                        Schützenvereines.
                    </p>
                </div>
                <div style={{ marginTop: 'var(--s4)', maxWidth: '68ch' }}>
                    <Notice title="Hinweis">
                        Den Königinnen und Königen entstehen keine Kosten.
                        Lediglich zum Königsball würden wir uns über eine
                        Getränkespende freuen!
                    </Notice>
                </div>
            </section>

            <section className="block" aria-labelledby="jugend">
                <SectionHead title="Jugendabteilung" id="jugend" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Mit unseren Jugendlichen im Alter von 9–17 Jahren wird
                        neben dem Schießsport Luftgewehr und Luftpistole auch
                        einiges an Freizeitaktivitäten geboten (z.B. gemeinsame
                        Ausflüge usw.).
                    </p>
                    <p>
                        Neu ist die Infrarotanlage: Hier darf schon ab 6 Jahren
                        geschossen werden, da keine Munition verwendet wird.
                        Unsere Schützenjugend ist begeistert. Alle
                        interessierten Kids sind herzlich zum Probeschießen
                        eingeladen!
                    </p>
                </div>
                <div style={{ marginTop: 'var(--s4)', maxWidth: '68ch' }}>
                    <Notice tone="warn" title="Aktueller Hinweis">
                        Jugendtraining immer sonntags von 10–13 Uhr. Ab 10 Uhr
                        Laser für Kinder von 6–12 Jahren. Ab ca. 11 Uhr
                        Luftgewehr für Kinder und Jugendliche von 12–18 Jahren.
                    </Notice>
                </div>
            </section>

            <ClubContacts organizationId="schutzenverein-wendessen-ev" />

            <p className="block">
                Wir freuen uns schon heute darauf, Sie an einer der
                aufgeführten Veranstaltungen begrüßen zu dürfen.
            </p>

            <p>
                <Link className="arrow-link" href="/dorfleben">
                    Zurück zum Dorfleben
                </Link>
            </p>
        </Leaf>
    );
}
