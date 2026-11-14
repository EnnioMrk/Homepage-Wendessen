import Link from 'next/link';
import { ASSOCIATIONS } from '@/lib/constants/associations';
import { ORTSRAT_MEMBERS } from '@/lib/constants/members';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Dorfleben – Ortsrat, Vereine und Institutionen',
    description:
        'Das Dorfleben in Wendessen: die Mitglieder des Ortsrates, alle Vereine von der Feuerwehr bis zum Hospizverein und die Institutionen Kirche St. Georg und Hospiz im Gutspark.',
};

const WEITERE_ORTE = [
    {
        kicker: 'Menschen',
        title: 'Wir Wendesser',
        href: '/dorfleben/wir-wendesser',
        note: 'Porträts der Menschen, die hier wohnen, arbeiten und sich kümmern.',
    },
    {
        kicker: 'Orientierung',
        title: 'Karte',
        href: '/dorfleben/karte',
        note: 'Das Dorf mit Straßen, Hausnummern und den wichtigen Orten.',
    },
    {
        kicker: 'Wetter',
        title: 'Wetterstation',
        href: '/dorfleben/wetter',
        note: 'Die Messwerte der Wendesser Wetterstation, laufend aktualisiert.',
    },
    {
        kicker: 'Chronik',
        title: 'Archiv',
        href: '/dorfleben/archiv',
        note: 'Nachrichten, Dokumente und Berichte aus früheren Jahren.',
    },
];

export default async function DorflebenPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    tallies={[
                        {
                            label: 'Vereine',
                            value: ASSOCIATIONS.length,
                        },
                        {
                            label: 'Ortsrat',
                            value: ORTSRAT_MEMBERS.length,
                            href: '/dorfleben/ortsrat/mitglieder',
                        },
                        { label: 'Institutionen', value: 2 },
                    ]}
                    note={
                        <>
                            Das Dorfleben steht in drei Abteilungen: der
                            Ortsrat, die Vereine und die Institutionen. Jede
                            Seite nennt, was zu ihr verzeichnet ist: Termine,
                            Ansprechpartner und Geschichte.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Dorfleben · Register"
                title="Dorfleben"
                lede="Der Ortsrat, die Vereine und die Institutionen: die Stellen, an denen in Wendessen entschieden, trainiert, gefeiert und geholfen wird."
            />

            <section aria-labelledby="ortsrat">
                <SectionHead
                    title="Ortsrat"
                    id="ortsrat"
                    more="/dorfleben/ortsrat/mitglieder"
                    moreLabel="Die Mitglieder"
                />
                <div className="hub-grid">
                    <Link
                        className="hub-tile"
                        href="/dorfleben/ortsrat/mitglieder"
                    >
                        <span className="hub-kicker">Gremium</span>
                        <span className="hub-title">Die Mitglieder</span>
                        <span className="hub-note">
                            Die sieben Mitglieder des Ortsrates mit ihren
                            Aufgaben und, soweit angegeben, ihren Kontaktdaten.
                        </span>
                    </Link>
                    <Link
                        className="hub-tile"
                        href="/dorfleben/ortsrat/bericht"
                    >
                        <span className="hub-kicker">Bericht</span>
                        <span className="hub-title">
                            Der Ortsbürgermeister berichtet
                        </span>
                        <span className="hub-note">
                            Das passiert im Jahr 2026 in Wendessen – das
                            Grußwort von Andreas M. Rink.
                        </span>
                    </Link>
                </div>
            </section>

            <section className="block" aria-labelledby="vereine">
                <SectionHead title="Vereine" id="vereine" />
                <div className="club-index">
                    {ASSOCIATIONS.map((club, index) => (
                        <Link
                            key={club.id}
                            href={club.buttonHref}
                            className="club-line"
                        >
                            <span className="club-num">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="club-name">{club.title}</span>
                            <span className="club-desc">{club.description}</span>
                        </Link>
                    ))}
                </div>
                <p className="small muted" style={{ marginTop: 'var(--s3)' }}>
                    Die Freiwillige Feuerwehr hat zwei eigene Seiten:{' '}
                    <Link
                        className="link"
                        href="/dorfleben/vereine/feuerwehr/einsatzabteilung"
                    >
                        Einsatzabteilung
                    </Link>{' '}
                    und{' '}
                    <Link
                        className="link"
                        href="/dorfleben/vereine/jugendfeuerwehr"
                    >
                        Jugendfeuerwehr
                    </Link>
                    .
                </p>
            </section>

            <section className="block" aria-labelledby="institutionen">
                <SectionHead title="Institutionen" id="institutionen" />
                <div className="hub-grid">
                    <Link
                        className="hub-tile"
                        href="/dorfleben/institutionen/kirche"
                    >
                        <span className="hub-kicker">Kirchengemeinde</span>
                        <span className="hub-title">
                            Kirche St. Georg
                        </span>
                        <span className="hub-note">
                            Die Kirchengemeinde Ahlum-Atzum-Wendessen mit
                            Gottesdiensten, Taufen und dem Kirchenbüro.
                        </span>
                    </Link>
                    <Link
                        className="hub-tile"
                        href="/dorfleben/institutionen/hospiz"
                    >
                        <span className="hub-kicker">Hospiz</span>
                        <span className="hub-title">Hospiz im Gutspark</span>
                        <span className="hub-note">
                            Vom Rittergut zum HospizZentrum: die Geschichte des
                            Hauses am Gutspark und die stationäre Versorgung.
                        </span>
                    </Link>
                </div>
            </section>

            <section className="block" aria-labelledby="weiteres">
                <SectionHead title="Weiter im Dorfleben" id="weiteres" />
                <div className="hub-grid">
                    {WEITERE_ORTE.map((ort) => (
                        <Link
                            className="hub-tile"
                            href={ort.href}
                            key={ort.href}
                        >
                            <span className="hub-kicker">{ort.kicker}</span>
                            <span className="hub-title">{ort.title}</span>
                            <span className="hub-note">{ort.note}</span>
                        </Link>
                    ))}
                </div>
            </section>
        </Leaf>
    );
}
