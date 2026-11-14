import Link from 'next/link';
import { getContacts, getSiteSettings } from '@/lib/database';
import {
    ORTSRAT_MEMBERS,
    REDAKTIONSTEAM_BEREICHSVERANTWORTLICHE,
    REDAKTIONSTEAM_KERNTEAM,
} from '@/lib/constants/members';
import {
    Leaf,
    Margin,
    Notice,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Kontakt',
    description:
        'Ansprechpartner, Kontaktformular, Redaktionsteam und rechtliche Angaben für Wendessen.',
};

interface Way {
    label: string;
    note: string;
    href: string;
}

const teamSize =
    REDAKTIONSTEAM_KERNTEAM.length +
    REDAKTIONSTEAM_BEREICHSVERANTWORTLICHE.length;

export default async function KontaktPage() {
    let contactCount = 0;
    let contactError = false;
    let settings: Record<string, string> = {};

    try {
        const contacts = await getContacts();
        contactCount = contacts.length;
    } catch (error) {
        console.error('Kontaktseite: Verzeichnis nicht geladen', error);
        contactError = true;
    }

    try {
        settings = await getSiteSettings();
    } catch (error) {
        console.error('Kontaktseite: Einstellungen nicht geladen', error);
    }

    const whatsappUrl = settings.whatsapp_channel_url ?? '';
    const showWhatsApp =
        settings.whatsapp_channel_enabled === 'true' && whatsappUrl.length > 0;

    const ways: Way[] = [
        {
            label: 'Verzeichnis',
            note:
                contactCount > 0
                    ? `${contactCount} Ansprechpartner aus Ortsrat, Vereinen und Institutionen, durchsuchbar nach Name, Organisation und Rolle.`
                    : 'Ansprechpartner aus Ortsrat, Vereinen und Institutionen, durchsuchbar nach Name, Organisation und Rolle.',
            href: '/kontakt/verzeichnis',
        },
        {
            label: 'Kontaktformular',
            note: 'Nachricht an den Ortsrat schreiben. Pflichtfelder, Datenschutz-Einwilligung und Fehlerhinweise stehen im Formular.',
            href: '/kontakt/formular',
        },
        {
            label: 'Redaktionsteam',
            note: 'Wer die Seiten pflegt: Kernteam und Bereichsverantwortliche der Vereine und Institutionen.',
            href: '/kontakt/redaktionsteam',
        },
        {
            label: 'Ortsrat',
            note: 'Die Mitglieder des Ortsrats mit Zuständigkeiten und Kontaktseiten.',
            href: '/dorfleben/ortsrat/mitglieder',
        },
    ];

    if (showWhatsApp) {
        ways.push({
            label: 'WhatsApp-Kanal',
            note: 'Hinweise auf Termine und Nachrichten aus dem Dorf, direkt auf das Telefon.',
            href: '/kontakt/whatsapp',
        });
    }

    const legal: Way[] = [
        {
            label: 'Impressum',
            note: 'Herausgeber, Vertretung, Kontakt und Haftungsausschluss.',
            href: '/impressum',
        },
        {
            label: 'Datenschutz',
            note: 'Verarbeitung personenbezogener Daten, Einwilligungen, Rechte und Aufsichtsbehörde.',
            href: '/datenschutz',
        },
    ];

    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Kontakt"
                    tallies={[
                        {
                            label: 'Ansprechpartner',
                            value: contactError ? '—' : contactCount,
                            href: '/kontakt/verzeichnis',
                        },
                        {
                            label: 'Ortsrat',
                            value: ORTSRAT_MEMBERS.length,
                            href: '/dorfleben/ortsrat/mitglieder',
                        },
                        {
                            label: 'Redaktion',
                            value: teamSize,
                            href: '/kontakt/redaktionsteam',
                        },
                    ]}
                    note={
                        <>
                            Das Verzeichnis führt Menschen mit ihren
                            Zuständigkeiten. Bei Unsicherheit zuerst nach der
                            Organisation suchen.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Register · Kontakt"
                title="Kontakt"
                lede="Das Dorf antwortet über Menschen: Ansprechpartner im Verzeichnis, das Formular für den Ortsrat, das Redaktionsteam für die Seiten selbst. Rechtliches steht am Fuß."
            />

            {contactError ? (
                <Notice tone="warn" title="Verzeichnis nicht geladen">
                    Die Ansprechpartner konnten gerade nicht aus der Datenbank
                    gelesen werden. Die Zahl in der Randspalte fehlt deshalb.{' '}
                    <Link className="link" href="/kontakt/verzeichnis">
                        Verzeichnis erneut öffnen
                    </Link>
                </Notice>
            ) : null}

            <section aria-labelledby="wege">
                <SectionHead title="Wege zu uns" id="wege" />
                <div className="club-index">
                    {ways.map((way, index) => (
                        <Link
                            key={way.href}
                            href={way.href}
                            className="club-line"
                        >
                            <span className="club-num">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="club-name">{way.label}</span>
                            <span className="club-desc">{way.note}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="block" aria-labelledby="direkt">
                <SectionHead title="Direkt" id="direkt" />
                <p className="muted small" style={{ marginTop: 'var(--s3)' }}>
                    Angaben aus dem Impressum. Für einen ersten Kontakt ist das
                    Formular der Weg, der beim Ortsrat ankommt; Telefon und
                    E-Mail erreichen die Ortsbürgermeisterin.
                </p>
                <dl className="kv" style={{ marginTop: 'var(--s4)' }}>
                    <dt>Anschrift</dt>
                    <dd>
                        Christina Balder
                        <br />
                        Lindenblick 12
                        <br />
                        38300 Wolfenbüttel – Wendessen
                    </dd>
                    <dt>Telefon</dt>
                    <dd>
                        {settings.contact_phone ? (
                            <a
                                className="link"
                                href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`}
                            >
                                {settings.contact_phone}
                            </a>
                        ) : (
                            <a className="link" href="tel:05331859860">
                                05331 – 859860
                            </a>
                        )}
                    </dd>
                    <dt>E-Mail</dt>
                    <dd>
                        <a
                            className="link"
                            href={`mailto:${settings.contact_email || 'info@wendessen.de'}`}
                        >
                            {settings.contact_email || 'info@wendessen.de'}
                        </a>
                    </dd>
                    <dt>Datenschutz</dt>
                    <dd>
                        <a className="link" href="mailto:datenschutz@wendessen.de">
                            datenschutz@wendessen.de
                        </a>
                    </dd>
                </dl>
            </section>

            <section className="block" aria-labelledby="rechtliches">
                <SectionHead title="Rechtliches" id="rechtliches" />
                <div className="club-index">
                    {legal.map((item, index) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="club-line"
                        >
                            <span className="club-num">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="club-name">{item.label}</span>
                            <span className="club-desc">{item.note}</span>
                        </Link>
                    ))}
                </div>
            </section>
        </Leaf>
    );
}
