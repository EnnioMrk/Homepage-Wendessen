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
    title: 'Hospizverein Wolfenbüttel e.V.',
    description:
        'Hospizverein Wolfenbüttel e.V. – Begleitung schwerstkranker und sterbender Menschen sowie deren Angehöriger. Seit 2024 mit seinen Räumen im HospizZentrum Am Gute 2 in Wendessen.',
};

const LEISTUNGEN = [
    {
        titel: 'Ambulante Begleitung',
        text: 'Qualifizierte Ehrenamtliche begleiten Schwerstkranke dort, wo sie wohnen.',
    },
    {
        titel: 'Trauerangebote',
        text: 'Trauercafé, Spaziergänge, Einzel- und Gruppenbegleitung für Erwachsene und Kinder.',
    },
    {
        titel: 'Vorsorge',
        text: 'Beratung zu Patientenverfügung, Vorsorgevollmacht und Betreuungsverfügung.',
    },
    {
        titel: 'Lebensende-Themen',
        text: 'Letzte-Hilfe-Kurse und öffentliche Veranstaltungen zu ethischen Fragen.',
    },
    {
        titel: 'Stationäre Versorgung',
        text: 'Das „Hospiz im Gutspark“ bietet stationäre Plätze unter der Trägerschaft des Vereins.',
    },
];

const BEITRAEGE = [
    { person: 'Einzelpersonen', betrag: '40 €' },
    { person: 'Paare', betrag: '60 €' },
];

export default async function HospizVereinPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Hospizverein"
                    tallies={[
                        { label: 'Mitglieder', value: 780 },
                        { label: 'Gegründet', value: 2006 },
                    ]}
                    note={
                        <>
                            Etwa 10 Prozent der Mitglieder engagieren sich
                            ehrenamtlich. Der Verein hat seine Räume im
                            HospizZentrum Am Gute 2.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Vereine / Hospizverein</span>
            </p>

            <PageHead
                title="Hospizverein Wolfenbüttel e.V."
                lede="Begleitung schwerstkranker und sterbender Menschen sowie ihrer Angehörigen – mit den Vereinsräumen im HospizZentrum Am Gute 2."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Seit 2024 hat der Hospizverein seine Adresse in
                        Wendessen: Am Gute 2. Auf Grundlage eines
                        Erbbaurechtsvertrages mit der Stadt Wolfenbüttel hat der
                        Verein das ehemalige Gutshaus zu einem HospizZentrum
                        umgebaut. In seiner Trägerschaft wurde hier zum 1. Juli
                        2024 ein stationäres Hospiz, die „Hospiz im Gutspark
                        gGmbH“, eröffnet. Unter dem Dach des HospizZentrums hat
                        auch der Verein seine Räume.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Gegründet</dt>
                            <dd>2006 von 13 engagierten Bürgerinnen und Bürgern</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Mitglieder</dt>
                            <dd>780, davon etwa 10 Prozent ehrenamtlich</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Adresse</dt>
                            <dd>Am Gute 2, Wendessen</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Beiträge</dt>
                            <dd>40 € Einzelpersonen, 60 € Paare im Jahr</dd>
                        </div>
                    </dl>
                </div>
                <figure className="figure">
                    <Image
                        src="/images/hospiz.jpg"
                        alt="Hospiz im Gutspark"
                        width={520}
                        height={360}
                        sizes="260px"
                    />
                    <figcaption>
                        <span>Hospiz im Gutspark</span>
                        <span>Am Gute 2</span>
                    </figcaption>
                </figure>
            </div>

            <section aria-labelledby="steckbrief">
                <SectionHead title="Steckbrief" id="steckbrief" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Der Verein wurde 2006 von 13 engagierten Bürgerinnen und
                        Bürgern gegründet. Wie bereits Hospizvereine in anderen
                        Städten setzten sie sich zum Ziel, schwerstkranke und
                        sterbende Menschen, ihre An- und Zugehörigen sowie
                        trauernde Menschen zu begleiten.
                    </p>
                    <p>
                        Derzeit hat der Verein 780 Mitglieder. Davon engagieren
                        sich etwa 10 Prozent ehrenamtlich.
                    </p>
                    <blockquote>
                        „Hospizarbeit ist in den 1980-er Jahren in Deutschland aus
                        Bürgerinitiativen hervorgegangen. Sie wird nur in Teilen
                        von den Krankenkassen finanziert und beruht bis heute auf
                        bürgerschaftlichem Engagement.“
                    </blockquote>
                    <p>
                        Hospizarbeit ist daher angewiesen auf Geldspenden und nur
                        realisierbar durch Zeitspenden vieler Ehrenamtlicher. In
                        Wolfenbüttel erfährt die Hospizarbeit vielfältige
                        Unterstützung durch Stiftungen und Unternehmen, Verbände
                        und Vereine sowie zahlreiche Bürgerinnen und Bürger.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="leistungen">
                <SectionHead title="Unsere Leistungen" id="leistungen" />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Angebot</th>
                            <th scope="col">Was der Verein leistet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LEISTUNGEN.map((eintrag) => (
                            <tr key={eintrag.titel}>
                                <td>
                                    <strong>{eintrag.titel}</strong>
                                </td>
                                <td>{eintrag.text}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="small muted" style={{ marginTop: 'var(--s2)' }}>
                    Vielfältige Angebote für Menschen in ihrer letzten
                    Lebensphase.
                </p>
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
                        href="/pdfs/hospizverein-beitrittserklaerung.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Beitrittsformular
                    </a>
                </p>

                <h3 style={{ marginTop: 'var(--s6)' }}>Spenden</h3>
                <p className="small muted" style={{ marginBottom: 'var(--s2)' }}>
                    Sie möchten uns gern finanziell unterstützen? Dann freuen wir
                    uns sehr über Ihre Spende.
                </p>
                <dl className="kv">
                    <dt>Empfänger</dt>
                    <dd>Hospizverein Wolfenbüttel e.V.</dd>
                    <dt>Bank</dt>
                    <dd>Braunschweigische Landessparkasse</dd>
                    <dt>IBAN</dt>
                    <dd className="num">DE 16 2505 0000 0151 8233 33</dd>
                </dl>
            </section>

            <ClubContacts organizationId="hospizverein-wolfenbuettel-ev" />

            <p className="block">
                <Link
                    className="arrow-link"
                    href="/dorfleben/institutionen/hospiz"
                >
                    Zur Geschichte des Hospiz im Gutspark
                </Link>
            </p>
        </Leaf>
    );
}
