import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings } from '@/lib/database';
import { InstallPWA } from '@/app/components/layout/InstallPWA';

/**
 * The colophon: the register's imprint. Server-rendered from site settings so
 * the footer never drifts from what the editors configured.
 */
export async function Colophon() {
    const settings = await getSiteSettings();
    const copyright =
        settings.copyright_text || '© Ortsrat Wendessen. Alle Rechte vorbehalten.';
    const whatsappUrl = settings.whatsapp_channel_url || '';
    const facebookUrl = settings.facebook_url || '';
    const instagramUrl = settings.instagram_url || '';
    const showWhatsApp =
        settings.whatsapp_channel_enabled === 'true' && whatsappUrl.length > 0;

    return (
        <footer className="colophon">
            <div className="wrap">
                <div className="colophon-inner">
                    <div>
                        <div className="colophon-mark">
                            <Image
                                src="/images/wappen.png"
                                alt=""
                                width={40}
                                height={40}
                            />
                            <div>
                                <p>
                                    <strong
                                        style={{
                                            color: 'var(--pine-ink)',
                                            letterSpacing: '0.1em',
                                        }}
                                    >
                                        WENDESSEN
                                    </strong>
                                    <br />
                                    Dorfchronik seit 1170. Das Register des
                                    Ortes, geführt von Ortsrat und Vereinen.
                                </p>
                            </div>
                        </div>
                        {showWhatsApp && (
                            <p style={{ marginTop: 'var(--s4)' }}>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    WhatsApp-Kanal abonnieren →
                                </a>
                            </p>
                        )}
                        {(facebookUrl || instagramUrl) && (
                            <p style={{ marginTop: 'var(--s2)', display: 'flex', gap: 'var(--s4)' }}>
                                {facebookUrl && (
                                    <a
                                        href={facebookUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Facebook →
                                    </a>
                                )}
                                {instagramUrl && (
                                    <a
                                        href={instagramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Instagram →
                                    </a>
                                )}
                            </p>
                        )}
                    </div>

                    <nav aria-label="Register">
                        <h2>Register</h2>
                        <Link href="/was-steht-an">Termine</Link>
                        <Link href="/neuigkeiten">Nachrichten</Link>
                        <Link href="/dorfleben">Dorfleben</Link>
                        <Link href="/dorfleben/vereine/feuerwehr">Vereine</Link>
                        <Link href="/wohnen-bauen">Wohnen &amp; Bauen</Link>
                        <Link href="/geschichte">Geschichte</Link>
                        <Link href="/impressionen">Impressionen</Link>
                    </nav>

                    <nav aria-label="Menschen">
                        <h2>Menschen</h2>
                        <Link href="/kontakt/verzeichnis">Verzeichnis</Link>
                        <Link href="/kontakt/redaktionsteam">Redaktionsteam</Link>
                        <Link href="/dorfleben/ortsrat/mitglieder">Ortsrat</Link>
                        <Link href="/kontakt/formular">Kontaktformular</Link>
                        <Link href="/dorfleben/wir-wendesser">Wir Wendesser</Link>
                    </nav>

                    <nav aria-label="Rechtliches">
                        <h2>Rechtliches</h2>
                        <Link href="/impressum">Impressum</Link>
                        <Link href="/datenschutz">Datenschutz</Link>
                        <Link href="/admin">Redaktion</Link>
                    </nav>
                </div>

                <div className="colophon-bar">
                    <span>{copyright}</span>
                    <span style={{ display: 'flex', gap: 'var(--s4)', alignItems: 'center' }}>
                        <InstallPWA />
                        <Link href="/suche">Suche</Link>
                    </span>
                </div>
            </div>
        </footer>
    );
}
