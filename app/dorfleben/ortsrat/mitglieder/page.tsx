import Image from 'next/image';
import Link from 'next/link';
import { ORTSRAT_MEMBERS } from '@/lib/constants/members';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';
import styles from '../../vereine/_components/facts.module.css';

export const metadata = {
    title: 'Ortsrat Wendessen – Die Mitglieder',
    description:
        'Die sieben Mitglieder des Ortsrates Wendessen mit Aufgaben, Parteien, Porträts und Kontaktdaten. Der Ortsrat ist am 13. November 2026 konstituiert worden.',
};

export default async function OrtsratMitgliederPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Ortsrat"
                    tallies={[
                        { label: 'Mitglieder', value: ORTSRAT_MEMBERS.length },
                    ]}
                    note={
                        <>
                            Der Ortsrat Wendessen ist am 13. November 2026
                            konstituiert worden. Die Kontaktdaten stehen bei
                            jeder Person, soweit sie angegeben sind.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Ortsrat</span>
            </p>

            <PageHead
                kicker="Dorfleben · Ortsrat"
                title="Die Mitglieder"
                lede="Sieben Wendesserinnen und Wendesser vertreten das Dorf im Ortsrat. Die Liste beginnt mit der Ortsbürgermeisterin und ihrem Stellvertreter, danach folgen die Mitglieder alphabetisch."
            />

            <section aria-labelledby="mitglieder">
                <SectionHead title="Mitglieder" id="mitglieder" />
                <div className="grid-2 ortsrat-grid" style={{ marginTop: 'var(--s4)' }}>
                    {ORTSRAT_MEMBERS.map((member) => (
                        <article
                            className="person-card person-card--plate"
                            key={member.name}
                        >
                            <Image
                                src={member.imageSrc ?? '/images/wappen.png'}
                                alt={member.imageAlt ?? member.name}
                                width={320}
                                height={320}
                                sizes="160px"
                            />
                            <div>
                                <p className="person-role">
                                    {member.position ?? member.role}
                                    {member.party ? ` · ${member.party}` : null}
                                </p>
                                <h3>
                                    {member.contactSlug ? (
                                        <Link
                                            className="link-quiet"
                                            href={`/kontakt/${member.contactSlug}`}
                                        >
                                            {member.name}
                                        </Link>
                                    ) : (
                                        member.name
                                    )}
                                </h3>
                                <dl className={styles.facts}>
                                    <dt>Partei</dt>
                                    <dd>{member.party ?? 'parteilos'}</dd>
                                    {member.profession && (
                                        <>
                                            <dt>Beruf</dt>
                                            <dd>{member.profession}</dd>
                                        </>
                                    )}
                                    {member.contactInfo && (
                                        <>
                                            <dt>Adresse</dt>
                                            <dd>
                                                {member.contactInfo.address}
                                            </dd>
                                            {member.contactInfo.phone && (
                                                <>
                                                    <dt>Telefon</dt>
                                                    <dd>
                                                        <a
                                                            className="link"
                                                            href={`tel:${member.contactInfo.phone.replace(
                                                                /[^\d+]/g,
                                                                '',
                                                            )}`}
                                                        >
                                                            {
                                                                member
                                                                    .contactInfo
                                                                    .phone
                                                            }
                                                        </a>
                                                    </dd>
                                                </>
                                            )}
                                            <dt>Mobil</dt>
                                            <dd>
                                                <a
                                                    className="link"
                                                    href={`tel:${member.contactInfo.mobile.replace(
                                                        /[^\d+]/g,
                                                        '',
                                                    )}`}
                                                >
                                                    {member.contactInfo.mobile}
                                                </a>
                                            </dd>
                                            <dt>E-Mail</dt>
                                            <dd>
                                                <a
                                                    className="link"
                                                    href={`mailto:${member.contactInfo.email}`}
                                                >
                                                    {member.contactInfo.email}
                                                </a>
                                            </dd>
                                        </>
                                    )}
                                </dl>
                                {member.contactSlug && (
                                    <p
                                        className="small"
                                        style={{ marginTop: 'var(--s3)' }}
                                    >
                                        <Link
                                            className="arrow-link"
                                            href={`/kontakt/${member.contactSlug}`}
                                        >
                                            Zur Kontaktseite
                                        </Link>
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="block" aria-labelledby="demokratie">
                <SectionHead title="Demokratie vor Ort" id="demokratie" />
                <div className="feature-split">
                    <div>
                        <p className="feature-lead">
                            Unser Ortsrat vertritt die Interessen der
                            Bürgerinnen und Bürger von Wendessen. Die Mitglieder
                            engagieren sich ehrenamtlich für die Belange unserer
                            Gemeinde und sorgen dafür, dass Wendessen ein lebens-
                            und liebenswerter Ort bleibt.
                        </p>
                    </div>
                    <dl className="kv">
                        <dt>Bürgernähe</dt>
                        <dd>
                            Direkte Ansprechpartner für alle Anliegen der
                            Gemeinde
                        </dd>
                        <dt>Gemeindeleben</dt>
                        <dd>
                            Förderung von Vereinen, Veranstaltungen und
                            Zusammenhalt
                        </dd>
                        <dt>Zukunft gestalten</dt>
                        <dd>
                            Planung und Entwicklung für ein lebenswertes
                            Wendessen
                        </dd>
                    </dl>
                </div>
            </section>

            <p className="block">
                <Link className="arrow-link" href="/dorfleben/ortsrat/bericht">
                    Der Ortsbürgermeister berichtet
                </Link>
            </p>
        </Leaf>
    );
}
