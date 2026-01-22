import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { MenubarDemo } from '@/app/components/layout/menubar';
import MobileNavbar from '@/app/components/layout/mobile-navbar';
import { Footer } from '@/app/components/layout/footer';
import { AdminAuthProvider } from '@/lib/admin-auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Wendessen.de - Unser Dorf im Netz',
    description:
        'Willkommen auf der offiziellen Webseite von Wendessen. Neuigkeiten, Termine, Vereine und mehr.',
    icons: {
        icon: [
            { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/favicon.svg', type: 'image/svg+xml' },
        ],
        shortcut: '/favicon.ico',
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    manifest: '/site.webmanifest',
    appleWebApp: {
        title: 'Wendessen',
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // NOTE: Do not run startup initialization here. Initialization (MinIO,
    // default admin user) should run from a controlled startup script so it
    // only executes once, not per Next/Turbopack build worker.
    return (
        <html lang="de" className="h-full" suppressHydrationWarning={true}>
            <body
                className={`${inter.className} min-h-full bg-background-secondary`}
                suppressHydrationWarning={true}
            >
                <AdminAuthProvider>
                    <div className="flex min-h-screen flex-col">
                        {/* Navigation with Wappen icon */}
                        <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
                            <div className="container mx-auto flex items-center justify-between py-1">
                                {/* Logo on the left */}
                                <div className="flex items-center px-4">
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
                        <main
                            className="flex-1 relative"
                            style={{ zIndex: 20 }}
                        >
                            {children}
                        </main>
                        <Footer />
                    </div>
                </AdminAuthProvider>
            </body>
        </html>
    );
}
