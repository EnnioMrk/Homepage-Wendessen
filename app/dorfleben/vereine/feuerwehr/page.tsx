import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'Feuerwehr Wendessen - Übersicht',
    description:
        'Übersicht über die Feuerwehr in Wendessen: Freiwillige Feuerwehr und Jugendfeuerwehr',
};

export default function FeuerwehrOverviewPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Image Selection Grid - Full screen height minus space for footer */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Freiwillige Feuerwehr / Einsatzabteilung */}
                <Link
                    href="/dorfleben/vereine/feuerwehr/einsatzabteilung"
                    className="group relative overflow-hidden transition-all duration-300"
                    aria-label="Zur Freiwilligen Feuerwehr Einsatzabteilung"
                >
                    <div className="relative h-[50vh] lg:h-[calc(100vh-200px)] w-full">
                        <Image
                            src="/images/Vereinsleben/Freiwillige_Feuerwehr.jpg"
                            alt="Freiwillige Feuerwehr"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                        
                        {/* Text Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg">
                                Freiwillige Feuerwehr
                            </h2>
                            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 drop-shadow-lg">
                                Einsatzabteilung
                            </p>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>

                {/* Jugendfeuerwehr */}
                <Link
                    href="/dorfleben/vereine/jugendfeuerwehr"
                    className="group relative overflow-hidden transition-all duration-300"
                    aria-label="Zur Jugendfeuerwehr"
                >
                    <div className="relative h-[50vh] lg:h-[calc(100vh-200px)] w-full">
                        <Image
                            src="/images/Vereinsleben/Jugendfeuerwehr.jpeg"
                            alt="Jugendfeuerwehr"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Dark overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                        
                        {/* Text Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg">
                                Jugendfeuerwehr
                            </h2>
                            <p className="text-xl sm:text-2xl md:text-3xl text-white/90 drop-shadow-lg">
                                Für Kinder & Jugendliche
                            </p>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
