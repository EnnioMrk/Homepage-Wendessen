import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import { MenubarDemo } from './components/menubar';
import MobileNavbar from './components/mobile-navbar';
import { Footer } from './components/footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Wendessen',
    description:
        'Offizielle Website des Dorfes Wendessen - Aktuelle Informationen, Veranstaltungen und mehr',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de" className="h-full" suppressHydrationWarning={true}>
            <body
                className={`${inter.className} min-h-full bg-background-secondary`}
                suppressHydrationWarning={true}
            >
                <div className="flex min-h-screen flex-col">
                    {/* Navigation with Wappen icon */}
                    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
                        <div className="container mx-auto flex items-center justify-between py-1">
                            {/* Logo on the left */}
                            <div className="flex items-center">
                                <Link href="/" className="cursor-pointer">
                                    <Image
                                        src="/images/Wappen.png"
                                        alt="Wappen Wendessen"
                                        width={48}
                                        height={48}
                                        className="h-10 w-10 md:h-12 md:w-12 object-contain drop-shadow hover:scale-105 transition-transform duration-200"
                                        priority
                                    />
                                </Link>
                            </div>
                            {/* Centered menubar (desktop only) */}
                            <div className="hidden lg:flex flex-1 justify-center">
                                <MenubarDemo />
                            </div>
                            {/* Mobile: Centered heading */}
                            <div className="flex-1 flex justify-center lg:hidden">
                                <span className="font-bold text-lg text-foreground">
                                    Willkommen in Wendessen
                                </span>
                            </div>
                            {/* Mobile navbar (mobile only) */}
                            <div className="flex lg:hidden">
                                <MobileNavbar />
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 relative" style={{ zIndex: 20 }}>
                        {children}
                    </main>
                    <Footer />
                </div>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
