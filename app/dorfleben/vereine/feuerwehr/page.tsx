import Image from 'next/image';
import Link from 'next/link';
import { Fire } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';

export const metadata = {
    title: 'Feuerwehr Wendessen - Übersicht',
    description:
        'Übersicht über die Feuerwehr in Wendessen: Freiwillige Feuerwehr und Jugendfeuerwehr',
};

export default function FeuerwehrOverviewPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <PageHeader
                title="Feuerwehr Wendessen"
                subtitle="Wählen Sie einen Bereich"
                icon={<Fire />}
                backgroundImage="/images/Vereinsleben/Freiwillige_Feuerwehr.jpg"
                color="red"
            />

            {/* Image Selection Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Freiwillige Feuerwehr / Einsatzabteilung */}
                <Link
                    href="/dorfleben/vereine/feuerwehr/einsatzabteilung"
                    className="group relative overflow-hidden transition-all duration-300"
                    aria-label="Zur Freiwilligen Feuerwehr Einsatzabteilung"
                >
                    <div className="relative h-[50vh] lg:h-[calc(100vh-300px)] w-full">
                        <Image
                            src="/images/Vereinsleben/Freiwillige_Feuerwehr.jpg"
                            alt="Freiwillige Feuerwehr"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Darker overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
                        
                        {/* Text Content - Centered */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-8 md:p-10">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg transition-all duration-300 group-hover:scale-110">
                                Freiwillige Feuerwehr
                            </h2>
                            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 drop-shadow-lg transition-all duration-300 group-hover:scale-110">
                                Einsatzabteilung
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Jugendfeuerwehr */}
                <Link
                    href="/dorfleben/vereine/jugendfeuerwehr"
                    className="group relative overflow-hidden transition-all duration-300"
                    aria-label="Zur Jugendfeuerwehr"
                >
                    <div className="relative h-[50vh] lg:h-[calc(100vh-300px)] w-full">
                        <Image
                            src="/images/Vereinsleben/Jugendfeuerwehr.jpeg"
                            alt="Jugendfeuerwehr"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Darker overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30"></div>
                        
                        {/* Text Content - Centered */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 sm:p-8 md:p-10">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg transition-all duration-300 group-hover:scale-110">
                                Jugendfeuerwehr
                            </h2>
                            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 drop-shadow-lg transition-all duration-300 group-hover:scale-110">
                                Für Kinder & Jugendliche
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
