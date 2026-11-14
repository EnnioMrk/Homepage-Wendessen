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
    title: 'Evang. Seniorenkreis Atzum-Wendessen',
    description:
        'Evangelischer Seniorenkreis Atzum-Wendessen – auch im Alter in geselliger Runde etwas unternehmen. Treffen jeden 1. Dienstag im Monat in der Alten Schule, beitragsfrei.',
};

const AKTIVITAETEN = [
    {
        titel: 'Fachvorträge',
        text: 'Vorträge von Referenten aus der Wirtschaft und der Medizin',
    },
    {
        titel: 'Lichtbildervorträge',
        text: 'Beeindruckende Bilder aus aller Welt',
    },
    {
        titel: 'Spielnachmittage',
        text: 'Gemeinsam spielen und Spaß haben',
    },
    {
        titel: 'Filmnachmittag',
        text: 'Gemütlicher Filmnachmittag mit Austausch',
    },
    {
        titel: 'Grillen',
        text: 'Gesellige Grillabende im Sommer',
    },
    {
        titel: 'Weihnachtsfeier',
        text: 'Festliche Feier zum Jahresende',
    },
];

export default async function SeniorenkreisPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Seniorenkreis"
                    tallies={[
                        { label: 'Treffen', value: '1. Dienstag' },
                        { label: 'Mindestalter', value: 60 },
                    ]}
                    note={
                        <>
                            Der Seniorenkreis ist beitragsfrei. Gäste sind
                            jederzeit willkommen.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Vereine / Seniorenkreis</span>
            </p>

            <PageHead
                title="Evang. Seniorenkreis"
                lede="Auch im Alter in geselliger Runde etwas unternehmen – in der Alten Schule, jeden 1. Dienstag im Monat."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Unser Vereinslokal ist die „Alte Schule“. Wir treffen uns
                        jeden 1. Dienstag im Monat. Es ist uns jeder willkommen,
                        Mindestalter: 60 Jahre. Wir freuen uns über jeden neuen
                        Gast! Unser Seniorenkreis ist beitragsfrei!
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Treffen</dt>
                            <dd>jeden 1. Dienstag im Monat</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Ort</dt>
                            <dd>Alte Schule, Wendessen</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Mindestalter</dt>
                            <dd>60 Jahre</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Beitrag</dt>
                            <dd>beitragsfrei</dd>
                        </div>
                    </dl>
                </div>
                <Image
                    src="/images/Vereinsleben/seniorenkreis.jpg"
                    alt="Evangelischer Seniorenkreis Atzum-Wendessen"
                    width={520}
                    height={360}
                    sizes="260px"
                />
            </div>

            <section aria-labelledby="treffen">
                <SectionHead title="Unsere Treffen" id="treffen" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Kommen Sie einfach vorbei und erleben Sie schöne Stunden
                        in netter Gesellschaft. Näheres zu unseren Aktivitäten
                        erfahren Sie bei unserer Vorsitzenden.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="aktivitaeten">
                <SectionHead title="Unsere Aktivitäten" id="aktivitaeten" />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Aktivität</th>
                            <th scope="col">Was passiert</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AKTIVITAETEN.map((eintrag) => (
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

            <ClubContacts
                organizationId="seniorenkreis-wendessen"
                title="Ansprechpartnerin"
            />

            <p className="block">
                <Link className="arrow-link" href="/dorfleben">
                    Zurück zum Dorfleben
                </Link>
            </p>
        </Leaf>
    );
}
