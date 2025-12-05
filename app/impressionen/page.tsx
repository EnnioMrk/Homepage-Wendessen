import { getApprovedSharedGalleryGroups } from '@/lib/database';
import { Camera } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/PageHeader';
import Link from 'next/link';
import GalleryGrid from '@/app/components/GalleryGrid';

export const metadata = {
    title: 'Impressionen - Wendessen',
    description:
        'Fotos und Eindrücke aus Wendessen - von Wendessenern für Wendessener',
};

export const revalidate = 300; // Revalidate every 5 minutes

export default async function ImpessionenPage() {
    let approvedGroups: Awaited<
        ReturnType<typeof getApprovedSharedGalleryGroups>
    > = [];

    try {
        approvedGroups = await getApprovedSharedGalleryGroups();
    } catch (error) {
        console.error('Failed to fetch approved photo groups:', error);
        approvedGroups = [];
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="Impressionen"
                subtitle="Wendessen durch die Augen unserer Gemeinschaft"
                icon={<Camera />}
                color="purple"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                {/* Submit Photo CTA */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            Teilen Sie Ihre Momente
                        </h2>
                        <p className="text-gray-700 mb-6">
                            Haben Sie schöne Fotos aus Wendessen? Teilen Sie sie
                            mit der Gemeinschaft!
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
                                Seien Sie der Erste, der ein Foto mit der
                                Gemeinschaft teilt!
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
