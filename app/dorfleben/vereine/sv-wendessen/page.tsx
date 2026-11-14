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
    title: 'SV Wendessen',
    description:
        'SV Wendessen – über 75 Jahre Vereinstradition. Fußball, Gymnastik, Tennis, Tischtennis, Tanzsport und vieles mehr für die ganze Familie.',
};

const SPORTARTEN = [
    {
        sport: 'Fußball',
        angebot: 'Kinder, Frauen und Männer – Oberliga erreicht!',
    },
    {
        sport: 'Gymnastik',
        angebot:
            'Aerobic, Damengymnastik, Fit and Fun, Wirbelsäulengymnastik',
    },
    {
        sport: 'Kinderturnen',
        angebot: 'Schon die Kleinsten toben sich bei uns aus',
    },
    {
        sport: 'Tischtennis',
        angebot: 'Reaktionsvermögen und Beweglichkeit fördern',
    },
    {
        sport: 'Tennis',
        angebot: 'Zwei Plätze für Tennis-Begeisterte',
    },
    {
        sport: 'Tanzsport',
        angebot: 'Standard und lateinamerikanische Tänze für Paare',
    },
];

export default async function SVWendessenPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="SV Wendessen"
                    tallies={[
                        { label: 'Vereinsjahre', value: '75+' },
                        { label: 'Sportarten', value: SPORTARTEN.length },
                    ]}
                    note={
                        <>
                            Trainingszeiten, Kosten und Mitgestaltung erfahren
                            Sie beim Verein – telefonisch, per Mail oder SMS.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Vereine / SV Wendessen</span>
            </p>

            <PageHead
                title="SV Wendessen"
                lede="Von einer Handvoll fußballbegeisterter Männer zum vielseitigen Sportverein – über 75 Jahre Vereinstradition."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Vor über 75 Jahren gründeten eine Handvoll
                        fußballbegeisterter Männer den SV Wendessen. Die größte
                        Sparte des Vereins ist die Fußballabteilung geblieben.
                        Nicht nur die Kids und die Männer lieben diesen Sport,
                        auch die Frauen sind mit Begeisterung und großem Erfolg
                        dabei.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Vereinsalter</dt>
                            <dd>über 75 Jahre</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Größte Sparte</dt>
                            <dd>Fußball</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Erfolg</dt>
                            <dd>Stolz sind wir auf die mittlerweile erreichte Oberliga!</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Gelände</dt>
                            <dd>Weinrich-Arena mit Vereinsheim</dd>
                        </div>
                    </dl>
                </div>
                <figure className="figure">
                    <Image
                        src="/images/Vereinsleben/sv-wendessen.jpg"
                        alt="SV Wendessen - Weinrich-Arena und Vereinsgelände"
                        width={520}
                        height={360}
                        sizes="260px"
                    />
                    <figcaption>
                        <span>Weinrich-Arena</span>
                        <span>Vereinsgelände</span>
                    </figcaption>
                </figure>
            </div>

            <section aria-labelledby="sportarten">
                <SectionHead title="Unsere Sportarten" id="sportarten" />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Sportart</th>
                            <th scope="col">Angebot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {SPORTARTEN.map((eintrag) => (
                            <tr key={eintrag.sport}>
                                <td>
                                    <strong>{eintrag.sport}</strong>
                                </td>
                                <td>{eintrag.angebot}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="small muted" style={{ marginTop: 'var(--s2)' }}>
                    Vielfältige sportliche Aktivitäten für alle Altersgruppen.
                </p>
            </section>

            <section className="block" aria-labelledby="vereinsheim">
                <SectionHead
                    title="Vereinsheim & Gastronomie"
                    id="vereinsheim"
                />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Heute bieten wir neben dem Fußballtraining für Kinder,
                        Frauen und Männer weitere sportliche Aktivitäten an, die
                        überwiegend im Vereinsheim bzw. auf dem Sportplatz, der
                        Weinrich-Arena in Wendessen stattfinden.
                    </p>
                    <p>
                        Sport macht durstig und hungrig. Hier hilft unser
                        Vereinswirt mit leckeren Speisen und kalten Getränken.
                        Diese bietet er nicht nur den Sportlern, sondern allen
                        Interessierten und berät gerne bei der Ausrichtung von
                        Familienfeiern und Versammlungen.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="gemeinschaft">
                <SectionHead
                    title="Gemeinschaft & Unterstützung"
                    id="gemeinschaft"
                />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Unser Verein lebt vom Interesse seiner Mitglieder und der
                        Ortsgemeinschaft. Jeder fördert so gut er kann, mit
                        Engagement im Sportbereich, Mitgliederbeiträgen und
                        Teilnahme.
                    </p>
                    <p>
                        Unsere Sponsoren und unseren Förderkreis „Pool 99“ heben
                        wir besonders heraus, weil wir durch ihre Unterstützung
                        unserer Vereinsgemeinschaft viel Gutes tun können.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="mitmachen">
                <SectionHead title="Machen Sie mit" id="mitmachen" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Wir freuen uns auf Ihr Interesse und sind für Reaktionen
                        dankbar. Möchten Sie mit uns zusammen Sport machen, die
                        Gemeinschaft pflegen, neue Mitbürger kennen lernen? Eines
                        unserer Angebote passt auch für Sie.
                    </p>
                    <p>
                        Greifen Sie zum Telefon oder schicken Sie uns eine
                        Mail/SMS. So erfahren Sie die Trainingszeiten, die Kosten
                        und die Mitgestaltungsmöglichkeiten. Abteilungsleiter und
                        Vorstand steht jederzeit zur Verfügung.
                    </p>
                </div>
            </section>

            <ClubContacts organizationId="sv-wendessen" />

            <p className="block feature-lead">
                SV Wendessen – mehr als nur ein Sportverein. Werden Sie Teil
                unserer Gemeinschaft!
            </p>

            <p>
                <Link className="arrow-link" href="/dorfleben">
                    Zurück zum Dorfleben
                </Link>
            </p>
        </Leaf>
    );
}
