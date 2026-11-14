import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
    Leaf,
    Margin,
    Notice,
    PageHead,
} from '@/app/components/register/Layout';
import {
    ORTSRAT_MEMBERS,
    getMemberBySlug,
    getAllMemberSlugs,
} from '@/lib/constants/members';
import { pageToday } from '@/app/lib/page-today';

export async function generateStaticParams() {
    const slugs = getAllMemberSlugs();
    return slugs.map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const contact = getMemberBySlug(slug);

    if (!contact) {
        return {
            title: 'Kontakt nicht gefunden',
            description: 'Die angeforderte Kontaktseite wurde nicht gefunden.',
        };
    }

    return {
        title: `${contact.name} · ${contact.position || contact.role}`,
        description: `Kontaktinformationen von ${contact.name}, ${
            contact.position || contact.role
        } in Wendessen. Telefon, E-Mail und Anschrift.`,
    };
}

function telHref(value: string): string {
    return `tel:${value.replace(/[^\d+]/g, '')}`;
}

export default async function ContactPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const contact = getMemberBySlug(slug);

    if (!contact || !contact.contactInfo) {
        notFound();
    }

    const position = contact.position || contact.role;

    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Ortsrat"
                    tallies={[
                        {
                            label: 'Mitglieder',
                            value: ORTSRAT_MEMBERS.length,
                            href: '/dorfleben/ortsrat/mitglieder',
                        },
                        {
                            label: 'Kontaktseiten',
                            value: getAllMemberSlugs().length,
                            href: '/kontakt/verzeichnis',
                        },
                    ]}
                    note={
                        <>
                            Die Kontaktseite nennt die Angaben, die für die
                            Ortsratsarbeit veröffentlicht sind.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Kontakt · Ortsrat"
                title={contact.name}
                lede={position}
            />

            <div className="person-card person-card--plate">
                {contact.imageSrc ? (
                    <Image
                        src={contact.imageSrc}
                        alt={contact.imageAlt || contact.name}
                        width={320}
                        height={320}
                        sizes="(max-width: 640px) 200px, 160px"
                    />
                ) : (
                    <div
                        aria-hidden="true"
                        style={{
                            aspectRatio: '1 / 1',
                            border: 'var(--border) solid var(--rule)',
                            background: 'var(--paper-sunken)',
                        }}
                    />
                )}

                <div>
                    {contact.subtitle ? (
                        <p
                            className="muted"
                            style={{ marginTop: 'var(--s2)', maxWidth: '52ch' }}
                        >
                            {contact.subtitle}
                        </p>
                    ) : null}

                    <dl className="kv" style={{ marginTop: 'var(--s4)' }}>
                        {contact.party ? (
                            <>
                                <dt>Aufgestellt für</dt>
                                <dd>{contact.party}</dd>
                            </>
                        ) : null}
                        {contact.profession ? (
                            <>
                                <dt>Beruf</dt>
                                <dd>{contact.profession}</dd>
                            </>
                        ) : null}
                        {contact.birthYear ? (
                            <>
                                <dt>Geburtsjahr</dt>
                                <dd className="num">{contact.birthYear}</dd>
                            </>
                        ) : null}
                        <dt>Anschrift</dt>
                        <dd>{contact.contactInfo.address}</dd>
                        {contact.contactInfo.phone ? (
                            <>
                                <dt>Telefon</dt>
                                <dd>
                                    <a
                                        className="link"
                                        href={telHref(contact.contactInfo.phone)}
                                    >
                                        {contact.contactInfo.phone}
                                    </a>
                                </dd>
                            </>
                        ) : null}
                        <dt>Mobil</dt>
                        <dd>
                            <a
                                className="link"
                                href={telHref(contact.contactInfo.mobile)}
                            >
                                {contact.contactInfo.mobile}
                            </a>
                        </dd>
                        <dt>E-Mail</dt>
                        <dd>
                            <a
                                className="link"
                                href={`mailto:${contact.contactInfo.email}`}
                            >
                                {contact.contactInfo.email}
                            </a>
                        </dd>
                    </dl>
                </div>
            </div>

            <Notice tone="info" title="So erreichen Sie mich">
                Telefon und E-Mail führen direkt zu {contact.name}. Für Anfragen
                an den ganzen Ortsrat ist das{' '}
                <Link className="link" href="/kontakt/formular">
                    Kontaktformular
                </Link>{' '}
                der passende Weg.
            </Notice>

            <div className="pill-row" style={{ marginTop: 'var(--s5)' }}>
                <Link className="btn btn--quiet" href="/kontakt/verzeichnis">
                    Zurück zum Verzeichnis
                </Link>
                <Link
                    className="btn btn--quiet"
                    href="/dorfleben/ortsrat/mitglieder"
                >
                    Alle Ortsratsmitglieder
                </Link>
            </div>
        </Leaf>
    );
}
