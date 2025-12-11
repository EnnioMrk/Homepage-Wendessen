import type { Metadata } from 'next';
// Initialize MinIO buckets/policies and ensure default admin on server runtime start
import '@/lib/minio-init';
import ensureAdmin from '@/lib/ensure-admin';

// Trigger ensure-admin at module import time so it runs on process startup
if (typeof window === 'undefined') {
    // fire-and-forget — logs and errors will appear in the server console
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ensureAdmin().catch((e) =>
        console.error('ensureAdmin (import-time) failed', e)
    );
}
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
    // Run ensure-admin on server render/startup so it executes reliably
    try {
        const mod = await import('@/lib/ensure-admin');
        if (typeof mod.ensureAdmin === 'function') {
            await mod.ensureAdmin();
        }
    } catch (e) {
        console.error('RootLayout: ensure-admin failed', e);
    }
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
