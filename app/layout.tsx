import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import './globals.css';
import { MenubarDemo } from './components/menubar';
import MobileNavbar from './components/mobile-navbar';
import { Footer } from './components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Dorfleben - Willkommen in unserem Dorf',
    description:
        'Offizielle Website unseres Dorfes - Aktuelle Informationen, Veranstaltungen und mehr',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de" className="h-full">
            <body
                className={`${inter.className} min-h-full bg-background-secondary`}
            >
                <div className="flex min-h-screen flex-col">
                    {/* Banner image at the very top */}
                    <div className="w-full bg-background flex justify-center border-b border-border">
                        <Image
                            src="/images/Banner.jpg"
                            alt="Willkommen in Wendessen"
                            width={1853}
                            height={275}
                            priority
                            className="w-full h-auto object-cover max-h-[220px] md:max-h-[275px] shadow-md rounded-b-lg"
                        />
                    </div>
                    {/* Navigation with Wappen icon */}
                    <header className="sticky top-0 z-50 w-full border-b border-border bg-background relative">
                        <div className="container mx-auto flex items-center justify-center py-1 relative">
                            {/* Absolutely positioned icon on the left */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2">
                                <Image
                                    src="/images/Wappen.png"
                                    alt="Wappen Wendessen"
                                    width={48}
                                    height={48}
                                    className="h-10 w-10 md:h-12 md:w-12 object-contain drop-shadow"
                                    priority
                                />
                            </div>
                            {/* Centered menubar (desktop only) */}
                            <div className="hidden lg:flex">
                                <MenubarDemo />
                            </div>
                            {/* Mobile: Centered heading */}
                            <div className="flex-1 flex justify-center lg:hidden">
                                <span className="font-bold text-lg text-foreground">
                                    Willkommen in Wendessen
                                </span>
                            </div>
                            {/* Mobile navbar (mobile only) */}
                            <div className="flex lg:hidden ml-auto">
                                <MobileNavbar />
                            </div>
                        </div>
                    </header>
                    <main className="flex-1 relative" style={{ zIndex: 20 }}>
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
