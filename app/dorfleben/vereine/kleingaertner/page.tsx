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
    title: 'Kleingärtnerverein Wendessen',
    description:
        'Kleingärtner Wendessen – 58 Gärten mit je rund 500 m² für Arbeit und Erholung. Wasser- und Stromanschluss in jedem Garten, sozialverträgliche Kosten.',
};

const ANGEBOTE = [
    {
        titel: '58 Gärten',
        text: 'Je ca. 500 m² Grundstücksfläche',
    },
    {
        titel: 'Vollausstattung',
        text: 'Wasser- und Stromanschluss in jedem Garten',
    },
    {
        titel: 'Sozialverträglich',
        text: 'Faire Pacht- und Beitragskosten',
    },
    {
        titel: 'Körperliche Betätigung',
        text: 'Gesunde Bewegung an der frischen Luft',
    },
    {
        titel: 'Eigene Ernte',
        text: 'Freude am selbst angebauten Obst und Gemüse',
    },
    {
        titel: 'Gemeinschaft',
        text: 'Zusammenhalt unter Gartenfreunden',
    },
];

export default async function KleingaertnerPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Kleingärtner"
                    tallies={[
                        { label: 'Gärten', value: 58 },
                        { label: 'Fläche je Garten', value: 'ca. 500 m²' },
                    ]}
                    note={
                        <>
                            Die Kosten (Pacht und Beitrag) sind sozialverträglich
                            und beinhalten unter anderem die Gartenzeitung und
                            eine Unfallversicherung.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Vereine / Kleingärtner</span>
            </p>

            <PageHead
                title="Kleingärtnerverein"
                lede="58 Gärten mit je rund 500 m² – Freude am eigenen Obst und Gemüse für jung und alt."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Unsere 58 Gärten haben jeweils eine Größe von ca. 500 m².
                        Die Gärten haben durchweg Wasser- und Stromanschluss. Die
                        Kosten (Pacht und Beitrag) sind sozialverträglich und
                        beinhalten u.a. unsere Gartenzeitung und eine
                        Unfallversicherung.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Gärten</dt>
                            <dd>58</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Größe</dt>
                            <dd>je ca. 500 m²</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Anschlüsse</dt>
                            <dd>Wasser und Strom in jedem Garten</dd>
                        </div>
                    </dl>
                </div>
                <figure className="figure">
                    <Image
                        src="/images/Vereinsleben/kleingarten.jpeg"
                        alt="Kleingärten Wendessen - Gartenanlage für Erholung und Arbeit"
                        width={520}
                        height={360}
                        sizes="260px"
                    />
                    <figcaption>
                        <span>Gartenanlage</span>
                        <span>Wendessen</span>
                    </figcaption>
                </figure>
            </div>

            <section aria-labelledby="vorteile">
                <SectionHead title="Vorteile für jung und alt" id="vorteile" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Die Arbeit und Erholung im Kleingarten bietet viele
                        Vorteile für jung und alt. Neben der körperlichen
                        Betätigung ist es vor allem die Freude am eigenen Obst und
                        Gemüse.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="angebot">
                <SectionHead title="Was wir bieten" id="angebot" />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Angebot</th>
                            <th scope="col">Im Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ANGEBOTE.map((eintrag) => (
                            <tr key={eintrag.titel}>
                                <td>
                                    <strong>{eintrag.titel}</strong>
                                </td>
                                <td>{eintrag.text}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="block" aria-labelledby="beitrag">
                <SectionHead title="Im Beitrag enthalten" id="beitrag" />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Leistung</th>
                            <th scope="col">Beschreibung</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Gartenzeitung</strong>
                            </td>
                            <td>
                                Regelmäßige Informationen rund um Garten und
                                Verein
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Unfallversicherung</strong>
                            </td>
                            <td>
                                Schutz bei Unfällen während der Gartenarbeit
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <ClubContacts organizationId="kleingartnerverein-wendessen" />

            <p className="block">
                Interesse an einem Kleingarten? Kontaktieren Sie uns für weitere
                Informationen!
            </p>

            <p>
                <Link className="arrow-link" href="/dorfleben">
                    Zurück zum Dorfleben
                </Link>
            </p>
        </Leaf>
    );
}
