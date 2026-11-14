import Link from 'next/link';
import { getSiteSettings } from '@/lib/database';
import {
    Leaf,
    Margin,
    Notice,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import styles from './whatsapp.module.css';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'WhatsApp-Kanal',
    description:
        'Der WhatsApp-Kanal von Wendessen: Hinweise auf Termine und Nachrichten aus dem Dorf.',
};

const steps = [
    {
        label: 'Link oder Code',
        note: 'Am Telefon den QR-Code scannen, am Rechner den Link zum Kanal öffnen.',
    },
    {
        label: 'Kanal lesen',
        note: 'Der Kanal zeigt die Beiträge des Ortsrats. Mitlesen ist ohne Abo möglich.',
    },
    {
        label: 'Kanal folgen',
        note: 'Auf „Folgen“ tippen. Danach erscheinen neue Beiträge im Kanal.',
    },
];

export default async function WhatsAppPage() {
    let settings: Record<string, string> = {};

    try {
        settings = await getSiteSettings();
    } catch (error) {
        console.error('WhatsApp-Seite: Einstellungen nicht geladen', error);
    }

    const channelUrl = settings.whatsapp_channel_url ?? '';
    const isEnabled =
        settings.whatsapp_channel_enabled === 'true' && channelUrl.length > 0;

    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="WhatsApp-Kanal"
                    note={
                        <>
                            Der Kanal ist ein zusätzlicher Weg. Verzeichnis und
                            Formular bleiben die Wege, die beim Ortsrat
                            ankommen.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Kontakt · Kanal"
                title="WhatsApp-Kanal"
                lede="Hinweise auf Termine und Nachrichten aus Wendessen, direkt auf das Telefon. Der Kanal ersetzt weder Verzeichnis noch Formular."
            />

            {isEnabled ? (
                <>
                    <section aria-labelledby="folgen">
                        <SectionHead title="Kanal folgen" id="folgen" />
                        <div className={styles.intro}>
                            <figure className={styles.qr}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/svgs/whatsapp-qrcode.svg"
                                    alt="QR-Code zum WhatsApp-Kanal von Wendessen"
                                    width={260}
                                    height={260}
                                />
                                <figcaption>
                                    QR-Code zum Kanal · mit der Kamera scannen
                                </figcaption>
                            </figure>
                            <div>
                                <p className={styles.introText}>
                                    Der Kanal wird vom Ortsrat Wendessen
                                    betreut. Wer folgt, bekommt neue Beiträge
                                    angezeigt; antworten können nur
                                    Kanalbetreiber.
                                </p>
                                <div
                                    className="pill-row"
                                    style={{ marginTop: 'var(--s4)' }}
                                >
                                    <a
                                        className="btn btn--primary"
                                        href={channelUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Kanal in WhatsApp öffnen
                                    </a>
                                    <Link
                                        className="btn btn--quiet"
                                        href="/kontakt/formular"
                                    >
                                        Stattdessen schreiben
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="block" aria-labelledby="schritte">
                        <SectionHead title="So funktioniert es" id="schritte" />
                        <div className="club-index">
                            {steps.map((step, index) => (
                                <div key={step.label} className="club-line">
                                    <span className="club-num">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="club-name">
                                        {step.label}
                                    </span>
                                    <span className="club-desc">
                                        {step.note}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="block" aria-labelledby="daten">
                        <SectionHead title="Kanal und Daten" id="daten" />
                        <dl className="kv" style={{ marginTop: 'var(--s4)' }}>
                            <dt>Betreiber</dt>
                            <dd>Ortsrat Wendessen</dd>
                            <dt>Inhalt</dt>
                            <dd>
                                Hinweise auf Termine, Nachrichten und
                                Veröffentlichungen dieser Website
                            </dd>
                            <dt>Zugang</dt>
                            <dd>
                                <a
                                    className="link"
                                    href={channelUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Kanal öffnen (externer Link)
                                </a>{' '}
                                · QR-Code oben
                            </dd>
                            <dt>Daten</dt>
                            <dd>
                                Es gilt die Datenschutzerklärung von WhatsApp.
                                Diese Seite bindet keine Inhalte von WhatsApp
                                ein.{' '}
                                <Link className="link" href="/datenschutz">
                                    Datenschutz dieser Website
                                </Link>
                            </dd>
                        </dl>
                    </section>
                </>
            ) : (
                <Notice tone="warn" title="Kanal derzeit nicht veröffentlicht">
                    Der WhatsApp-Kanal ist für diese Website abgeschaltet. Es
                    führt deshalb kein Link von hier dorthin. Nutzen Sie das{' '}
                    <Link className="link" href="/kontakt/formular">
                        Kontaktformular
                    </Link>{' '}
                    oder das{' '}
                    <Link className="link" href="/kontakt/verzeichnis">
                        Verzeichnis
                    </Link>
                    .
                </Notice>
            )}

            <section className="block" aria-labelledby="wege">
                <SectionHead title="Weitere Wege" id="wege" />
                <div className="pill-row" style={{ marginTop: 'var(--s4)' }}>
                    <Link className="btn btn--quiet" href="/kontakt/verzeichnis">
                        Verzeichnis
                    </Link>
                    <Link className="btn btn--quiet" href="/kontakt/formular">
                        Kontaktformular
                    </Link>
                    <Link
                        className="btn btn--quiet"
                        href="/kontakt/redaktionsteam"
                    >
                        Redaktionsteam
                    </Link>
                </div>
            </section>
        </Leaf>
    );
}
