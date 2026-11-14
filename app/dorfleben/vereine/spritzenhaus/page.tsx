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
    title: 'Initiative Wendesser Spritzenhaus e.V.',
    description:
        'Die Initiative Wendesser Spritzenhaus e.V. – Erhalt und Pflege des historischen Spritzenhauses im Herzen von Wendessen. Gegründet 1998, 75 Mitglieder.',
};

export default async function SpritzenhausPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Spritzenhaus"
                    tallies={[
                        { label: 'Mitglieder', value: 75 },
                        { label: 'Gegründet', value: 1998 },
                        { label: 'Beitrag', value: '12 €' },
                    ]}
                    note={
                        <>
                            Der Verein veranstaltet seit 1999 jedes Jahr in der
                            Vorweihnachtszeit einen Weihnachtsbaummarkt.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Vereine / Spritzenhaus</span>
            </p>

            <PageHead
                title="Initiative Wendesser Spritzenhaus e.V."
                lede="Von der Rettung vor dem Abriss zum lebendigen Kulturdenkmal im alten Ortskern."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        1998 wurde durch den Rat der Stadt Wolfenbüttel und den
                        damaligen Wendesser Ortsrat der Abriss des – denkmal-
                        geschützten – ehemaligen Spritzenhauses der Wendesser
                        Freiwilligen Feuerwehr beschlossen. Daraufhin wurde von
                        Wendesser Bürgern, die sich für den Erhalt dieses
                        Gebäudes mitten im alten Ortskern einsetzen wollten,
                        buchstäblich in letzter Minute die „Initiative Wendesser
                        Spritzenhaus e.V.“ gegründet.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Gegründet</dt>
                            <dd>1998, in letzter Minute vor dem Abriss</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Eingeweiht</dt>
                            <dd>im Sommer des Jahres 2000</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Mitglieder</dt>
                            <dd>75</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Beitrag</dt>
                            <dd>12,00 € Einzelmitglied, 18,00 € Paare pro Jahr</dd>
                        </div>
                    </dl>
                </div>
                <figure className="figure">
                    <Image
                        src="/images/Vereinsleben/spritzenhaus.webp"
                        alt="Spritzenhaus Wendessen"
                        width={520}
                        height={360}
                        sizes="260px"
                    />
                    <figcaption>
                        <span>Spritzenhaus</span>
                        <span>Alter Ortskern</span>
                    </figcaption>
                </figure>
            </div>

            <section aria-labelledby="sanierung">
                <SectionHead title="Sanierung und Wiedergeburt" id="sanierung" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Mit Mitteln der Stadt, des Landes Niedersachsen,
                        Eigenmitteln des Vereins und sehr viel Eigenleistung wurde
                        das Gebäude saniert und im Sommer des Jahres 2000
                        eingeweiht. Heute bildet dieses kleine Fachwerkhaus mit
                        seinem – 1952 angebauten – Schlauchturm zusammen mit der
                        benachbarten Dorfkirche und den umliegenden alten
                        Fachwerkhäusern als ein Stück greifbarer Ortsgeschichte
                        den eigentlichen Kern unseres Ortsteiles.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="veranstaltungen">
                <SectionHead
                    title="Veranstaltungen & Aktivitäten"
                    id="veranstaltungen"
                />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <h3>Weihnachtsbaummarkt</h3>
                    <p>
                        Der Verein veranstaltet seit 1999 jedes Jahr in der
                        Vorweihnachtszeit einen Weihnachtsbaummarkt, der sich
                        stetig wachsender Beliebtheit erfreut. Besuchen Sie uns
                        z.B. beim Weihnachtsbaummarkt!
                    </p>
                    <h3>Weitere Veranstaltungen</h3>
                    <ul>
                        <li>Spritzenhausfest für Mitglieder im Sommer</li>
                        <li>Tag des offenen Denkmals (2002)</li>
                        <li>
                            Fotoausstellungen zur Ortsgeschichte (2003, 2005)
                        </li>
                        <li>Kooperationen mit dem Kirchbauverein</li>
                    </ul>
                </div>
            </section>

            <section className="block" aria-labelledby="mitgliedschaft">
                <SectionHead title="Mitgliedschaft" id="mitgliedschaft" />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Beitrag</th>
                            <th scope="col" className="right">
                                Pro Jahr
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Einzelmitglied</td>
                            <td className="right">12,00 €</td>
                        </tr>
                        <tr>
                            <td>Paare</td>
                            <td className="right">18,00 €</td>
                        </tr>
                    </tbody>
                </table>
                <p className="small muted" style={{ marginTop: 'var(--s2)' }}>
                    Der Verein zählt 75 Mitglieder.
                </p>
                <div
                    className="figure--note"
                    style={{ marginTop: 'var(--s4)' }}
                >
                    <p>
                        „Wer eine Möglichkeit sucht, sich ohne großen und
                        regelmäßigen Zeitaufwand und bei geringem Beitrag im
                        Dorfgemeinschaftsleben zu engagieren, ist in der
                        Initiative Wendesser Spritzenhaus e.V. gut aufgehoben.“
                    </p>
                </div>
            </section>

            <ClubContacts organizationId="initiative-wendesser-spritzenhaus-ev" />

            <p className="block">
                <Link className="arrow-link" href="/dorfleben">
                    Zurück zum Dorfleben
                </Link>
            </p>
        </Leaf>
    );
}
