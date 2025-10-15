import { getApprovedSharedGalleryGroups } from '@/lib/database';
import { Camera } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import GalleryGrid from '@/app/components/GalleryGrid';

export const metadata = {
    title: 'Impressionen - Wendessen',
    description: 'Fotos und Eindrücke aus Wendessen - von Wendessenern für Wendessener',
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function ImpessionenPage() {
    let approvedGroups: Awaited<ReturnType<typeof getApprovedSharedGalleryGroups>> = [];

    try {
        approvedGroups = await getApprovedSharedGalleryGroups();
    } catch (error) {
        console.error('Failed to fetch approved photo groups:', error);
        approvedGroups = [];
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/95 to-red-600/95"></div>
                
                {/* Decorative elements */}
                <div className="hidden md:block absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rounded-full animate-pulse"></div>
                <div className="hidden md:block absolute bottom-10 right-10 w-24 h-24 border-2 border-pink-300/30 rounded-full animate-pulse"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center mb-8 gap-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
                            <Camera className="w-10 h-10 md:w-14 md:h-14 text-purple-600" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                            Impressionen
                        </h1>
                    </div>
                    <div className="w-32 h-2 bg-white mx-auto mb-6"></div>
                    <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                        Wendessen durch die Augen unserer Gemeinschaft
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Submit Photo CTA */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Teilen Sie Ihre Momente
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Haben Sie schöne Fotos aus Wendessen? Teilen Sie sie mit der Gemeinschaft!
                        </p>
                        <Link
                            href="/impressionen/einreichen"
                            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                        >
                            <Camera className="w-5 h-5 mr-2" />
                            Foto einreichen
                        </Link>
                    </div>
                </div>

                {/* Gallery */}
                {approvedGroups.length > 0 ? (
                    <GalleryGrid groups={approvedGroups} />
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <Camera className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                Noch keine Fotos
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Seien Sie der Erste, der ein Foto mit der Gemeinschaft teilt!
                            </p>
                            <Link
                                href="/impressionen/einreichen"
                                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <Camera className="w-5 h-5 mr-2" />
                                Erstes Foto einreichen
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
