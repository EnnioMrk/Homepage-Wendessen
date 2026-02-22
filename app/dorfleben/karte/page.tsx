import type { Metadata } from 'next';
import { MapTrifold } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import WendessenMap from './WendessenMap';

export const metadata: Metadata = {
    title: 'Karte - Dorfleben',
    description: 'Interaktive Karte mit Fokus auf Wendessen in Wolfenbüttel, Niedersachsen.',
};

export default function KartePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <PageHeader
                title="Karte"
                subtitle="Wendessen in Wolfenbüttel, Niedersachsen"
                icon={<MapTrifold />}
                backgroundImage="/images/Wendessen_Luftaufnahme.jpg"
                color="blue"
            />

            <div className="container mx-auto px-4 py-10 sm:py-14">
                <div className="mx-auto max-w-6xl space-y-5">
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Interaktive Karte von Wendessen
                    </h2>
                    <p className="text-gray-700">
                        Die Karte ist auf Wendessen begrenzt und zeigt ausschließlich den Ort und seine direkte Umgebung.
                    </p>
                    <WendessenMap />
                </div>
            </div>
        </div>
    );
}
