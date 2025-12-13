import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Menubar } from '@/app/components/layout/menubar';
import MobileNavbar from '@/app/components/layout/mobile-navbar';
import { Footer } from '@/app/components/layout/footer';
import { AdminAuthProvider } from '@/lib/admin-auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Wendessen.de - Unser Dorf im Netz',
    description:
        'Willkommen auf der offiziellen Webseite von Wendessen. Neuigkeiten, Termine, Vereine und mehr.',
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
        <html lang="de">
            <body
                className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}
            >
                <AdminAuthProvider>
                    {/* Desktop Navigation */}
                    <div className="hidden lg:block sticky top-0 z-50">
                        <Menubar />
                    </div>

                    {/* Mobile Navigation */}
                    <div className="lg:hidden sticky top-0 z-50">
                        <MobileNavbar />
                    </div>

                    <main className="flex-grow w-full">{children}</main>

                    <Footer />
                </AdminAuthProvider>
            </body>
        </html>
    );
}
