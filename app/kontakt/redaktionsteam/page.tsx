import Link from 'next/link';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import {
    REDAKTIONSTEAM_BEREICHSVERANTWORTLICHE,
    REDAKTIONSTEAM_KERNTEAM,
} from '@/lib/constants/members';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Redaktionsteam',
    description:
        'Kernteam und Bereichsverantwortliche, die die Seiten von Wendessen pflegen.',
};

const kernteam = REDAKTIONSTEAM_KERNTEAM;
const bereich = REDAKTIONSTEAM_BEREICHSVERANTWORTLICHE;
const offeneBereiche = bereich.filter((member) => member.name === 'N.N.');

export default async function RedaktionsteamPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Redaktion"
                    tallies={[
                        { label: 'Kernteam', value: kernteam.length },
                        { label: 'Bereiche', value: bereich.length },
                        { label: 'Offen', value: offeneBereiche.length },
                    ]}
                    note={
                        <>
                            Die Bereichsverantwortlichen tragen Termine und
                            Nachrichten ihrer Vereine selbst ein. Das Kernteam
                            prüft Gestaltung und Inhalte.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Kontakt · Redaktion"
                title="Redaktionsteam"
                lede="Die Seiten des Dorfes werden von Wendesserinnen und Wendessern gepflegt. Das Kernteam kümmert sich um Gestaltung und Inhalte, die Bereichsverantwortlichen um Termine und Nachrichten ihrer Vereine und Institutionen."
            />

            <section aria-labelledby="kernteam">
                <SectionHead title="Kernteam" id="kernteam" />
                <div className="dir">
                    {kernteam.map((member) => (
                        <div key={member.name} className="dir-person">
                            <div>
                                <p className="dir-name">
                                    {member.contactSlug ? (
                                        <Link
                                            href={`/kontakt/${member.contactSlug}`}
                                        >
                                            {member.name}
                                        </Link>
                                    ) : (
                                        member.name
                                    )}
                                </p>
                                <p className="dir-affil">{member.role}</p>
                            </div>
                            <div className="dir-contacts">
                                <span>
                                    {member.contactSlug
                                        ? 'Kontaktseite im Ortsrat'
                                        : 'Keine eigene Kontaktseite'}
                                </span>
                            </div>
                            <p className="dir-importance">Kernteam</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="block" aria-labelledby="bereiche">
                <SectionHead title="Bereichsverantwortliche" id="bereiche" />
                <p className="muted small" style={{ marginTop: 'var(--s3)' }}>
                    Die Bereichsverantwortlichen pflegen eigenständig die Termine
                    und Nachrichten für ihre Vereine und Institutionen.
                </p>
                <div style={{ marginTop: 'var(--s4)' }}>
                    <table className="data">
                        <thead>
                            <tr>
                                <th scope="col">Bereich</th>
                                <th scope="col">Name</th>
                                <th scope="col">Aufgabe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bereich.map((member, index) => (
                                <tr key={`${member.area}-${member.name}-${index}`}>
                                    <td>{member.area ?? 'Ohne Bereich'}</td>
                                    <td
                                        className={
                                            member.name === 'N.N.'
                                                ? 'muted'
                                                : undefined
                                        }
                                    >
                                        {member.name}
                                    </td>
                                    <td className="muted">{member.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {offeneBereiche.length > 0 ? (
                    <p className="muted small" style={{ marginTop: 'var(--s3)' }}>
                        N.N. steht für eine noch nicht benannte Person.
                    </p>
                ) : null}
            </section>

            <section className="block" aria-labelledby="mitmachen">
                <SectionHead title="Mitmachen" id="mitmachen" />
                <p className="lede" style={{ marginTop: 'var(--s3)' }}>
                    Wer Termine und Nachrichten für einen Verein oder eine
                    Institution veröffentlichen möchte, meldet sich beim
                    Kernteam.
                </p>
                <div className="pill-row" style={{ marginTop: 'var(--s4)' }}>
                    <Link className="btn btn--primary" href="/kontakt/formular">
                        Beim Ortsrat melden
                    </Link>
                    <Link
                        className="btn btn--quiet"
                        href="/kontakt/verzeichnis"
                    >
                        Ansprechpartner suchen
                    </Link>
                </div>
            </section>
        </Leaf>
    );
}
