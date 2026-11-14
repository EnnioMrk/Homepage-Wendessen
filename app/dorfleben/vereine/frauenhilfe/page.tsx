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
    title: 'Evang. Frauenhilfe Wendessen',
    description:
        'Evangelische Frauenhilfe Wendessen – gegründet am 28. Mai 1917. Frauen auf dem Boden christlichen Glaubens zusammenführen. Treffen jeden 3. Mittwoch im Monat um 15:00 Uhr.',
};

const THEMEN = [
    {
        titel: 'Vorträge',
        text: 'Vorträge zu christlichen und sozialen Themen',
    },
    {
        titel: 'Gedächtnistraining',
        text: 'Geistig fit bleiben durch regelmäßiges Training',
    },
    {
        titel: 'Basteln',
        text: 'Kreative Aktivitäten und handwerkliche Arbeiten',
    },
    {
        titel: 'Fahrten & Reiseberichte',
        text: 'Gemeinsame Ausflüge und spannende Reiseberichte',
    },
    {
        titel: 'Sicherheit im Alltag',
        text: 'Praktische Tipps für ein sicheres Leben',
    },
    {
        titel: 'Geselliges Beisammensein',
        text: 'Gemeinschaft und Austausch in netter Atmosphäre',
    },
];

export default async function FrauenhilfePage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Frauenhilfe"
                    tallies={[
                        { label: 'Mitglieder', value: 23 },
                        { label: 'Beitrag', value: '20 €' },
                        { label: 'Gegründet', value: 1917 },
                    ]}
                    note={
                        <>
                            Die Treffen finden auf dem „Hans-Meves-Hof“,
                            Dorfstr. 19, statt: jeden 3. Mittwoch im Monat um
                            15:00 Uhr.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Vereine / Frauenhilfe</span>
            </p>

            <PageHead
                title="Evang. Frauenhilfe"
                lede="Gegründet am 28. Mai 1917 – über 100 Jahre christliche Frauengemeinschaft in Wendessen."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Der Verein will Frauen auf dem Boden christlichen
                        Glaubens zusammenführen, sie in der Nachfolge Jesu Christi
                        stärken und ihnen bei der Wahrnehmung ihrer Verantwortung
                        in Familie, Gemeinde und Gesellschaft helfen.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Gegründet</dt>
                            <dd>28. Mai 1917</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Mitglieder</dt>
                            <dd>23</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Beitrag</dt>
                            <dd>
                                20,00 EUR jährlich, davon werden Beiträge an den
                                Kreis- und Landesverband geleistet
                            </dd>
                        </div>
                        <div className="club-fact">
                            <dt>Treffen</dt>
                            <dd>jeden 3. Mittwoch im Monat um 15:00 Uhr</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Ort</dt>
                            <dd>
                                „Hans-Meves-Hof“, Dorfstr. 19, 38300 WF-Wendessen
                            </dd>
                        </div>
                    </dl>
                </div>
                <Image
                    src="/images/Vereinsleben/frauenhilfe.jpg"
                    alt="Evangelische Frauenhilfe Wendessen"
                    width={520}
                    height={360}
                    sizes="260px"
                />
            </div>

            <section aria-labelledby="gemeinschaft">
                <SectionHead title="Unsere Gemeinschaft" id="gemeinschaft" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Zur Zeit haben wir 23 Mitglieder. Der Beitrag beträgt
                        20,00 EUR jährlich, davon werden Beiträge an den Kreis-
                        und Landesverband geleistet.
                    </p>
                    <p>
                        Außerdem wird ein Patenkind in Indien unterstützt. Mit
                        einem Teil unserer Beiträge leisten wir so einen
                        wertvollen Beitrag für eine bessere Zukunft.
                    </p>
                    <p>
                        Haben Sie Fragen zu unseren Treffen oder möchten Sie
                        Mitglied werden? Unsere Vorsitzende ist gerne für Sie da.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="satzung">
                <SectionHead title="Aus unserer Satzung" id="satzung" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <blockquote>
                        „Der Verein will Frauen auf dem Boden christlichen
                        Glaubens zusammenführen, sie in der Nachfolge Jesu Christi
                        stärken und ihnen bei der Wahrnehmung ihrer Verantwortung
                        in Familie, Gemeinde und Gesellschaft helfen.“
                    </blockquote>
                </div>
            </section>

            <section className="block" aria-labelledby="themen">
                <SectionHead title="Unsere Themen" id="themen" />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Thema</th>
                            <th scope="col">Was passiert</th>
                        </tr>
                    </thead>
                    <tbody>
                        {THEMEN.map((eintrag) => (
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
                organizationId="frauenhilfe-wendessen"
                title="Ansprechpartnerin"
            />

            <p className="block">
                Werden Sie Teil unserer Gemeinschaft! Wir freuen uns über neue
                Mitglieder.
            </p>

            <p>
                <Link className="arrow-link" href="/dorfleben">
                    Zurück zum Dorfleben
                </Link>
            </p>
        </Leaf>
    );
}
