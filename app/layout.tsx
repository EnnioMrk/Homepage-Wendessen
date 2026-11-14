import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import './globals.css';
import './design/tokens.css';
import './design/base.css';
import './design/components.css';
import './design/admin.css';
import './design/pages.css';
import { Suspense } from 'react';
import { SpineNav } from './components/register/SpineNav';
import { NavMarkup } from './components/register/nav-markup';
import { MobileMenu } from './components/register/MobileMenu';
import { Colophon } from './components/register/Colophon';
import { getSiteSettings } from '@/lib/database';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wendessen.de';

export async function generateMetadata(): Promise<Metadata> {
    // Editors own the site's name, tagline and description in Einstellungen.
    // The defaults below only apply while those settings are empty.
    const settings = await getSiteSettings().catch(() => ({}) as Record<string, string>);
    const siteName = settings.site_name || 'Wendessen';
    const tagline = settings.site_tagline || 'Dorfchronik und Register';
    const description =
        settings.meta_description ||
        'Das Register des Dorfes Wendessen: Termine, Nachrichten, Vereine, Menschen, Bilder und Geschichte. Geführt von Ortsrat und Vereinen.';
    const keywords = settings.meta_keywords
        ? settings.meta_keywords.split(',').map((k) => k.trim()).filter(Boolean)
        : undefined;

    return {
    metadataBase: new URL(siteUrl),
    title: {
        default: `${siteName} — ${tagline}`,
        template: `%s · ${siteName}`,
    },
    description,
    keywords,
    applicationName: siteName,
    alternates: { canonical: '/' },
    icons: {
        icon: [
            { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/favicon.svg', type: 'image/svg+xml' },
        ],
        shortcut: '/favicon.ico',
        apple: [
            {
                url: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    },
    manifest: '/site.webmanifest',
    appleWebApp: { title: siteName },
    openGraph: {
        type: 'website',
        locale: 'de_DE',
        siteName,
        title: `${siteName} — ${tagline}`,
        description,
        images: [{ url: '/images/wendessen-luftaufnahme.jpg' }],
    },
    robots: { index: true, follow: true },
    };
}

export const viewport: Viewport = {
    themeColor: '#1b2f27',
    colorScheme: 'light',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="de">
            <head>
                <link
                    rel="preload"
                    href="/fonts/archivo-latin.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/literata-latin.woff2"
                    as="font"
                    type="font/woff2"
                    crossOrigin="anonymous"
                />
            </head>
            <body>
                <a className="skip-link" href="#inhalt">
                    Zum Inhalt springen
                </a>
                <header className="spine">
                    <div className="spine-inner wrap">
                        <Link href="/" className="spine-mark">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/images/wappen.png"
                                alt="Wappen der Gemeinde Wendessen"
                                width={34}
                                height={34}
                            />
                            <span className="spine-word">
                                Wendessen
                                <span className="spine-sub">
                                    Dorfchronik seit 1170
                                </span>
                            </span>
                        </Link>
                        <Suspense fallback={<NavMarkup />}>
                            <SpineNav />
                        </Suspense>
                        <div className="spine-tools">
                            <form
                                className="spine-search"
                                action="/suche"
                                method="get"
                                role="search"
                            >
                                <label
                                    className="visually-hidden"
                                    htmlFor="q"
                                >
                                    Im Register suchen
                                </label>
                                <input
                                    id="q"
                                    name="q"
                                    type="search"
                                    placeholder="Suchen …"
                                    autoComplete="off"
                                />
                            </form>
                            <Link href="/admin" className="spine-admin">
                                Redaktion
                            </Link>
                        </div>
                        <MobileMenu />
                    </div>
                </header>
                <main id="inhalt">{children}</main>
                <Colophon />
            </body>
        </html>
    );
}
