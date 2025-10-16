import BackgroundElements from '@/app/components/BackgroundElements';
import { NewspaperClipping } from '@phosphor-icons/react/dist/ssr';
import { getArchivedNews } from '@/lib/database';
import ArchiveClient from './ArchiveClient';

export const revalidate = 3600;

interface ArchiveItem {
    id: number;
    title: string;
    author?: string;
    category?: string;
    created_date?: string;
    content: string;
    created_at: string;
}

async function getArchiveItems(): Promise<ArchiveItem[]> {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/archive`, {
            cache: 'no-store'
        });
        if (!response.ok) return [];
        return response.json();
    } catch (error) {
        console.error('Failed to fetch archive items:', error);
        return [];
    }
}

export default async function ArchivPage() {
    const archiveItems = await getArchiveItems();
    const archivedNews = await getArchivedNews();

    const totalItems = archiveItems.length + archivedNews.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative">
            <BackgroundElements />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 to-pink-600/95"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mr-4">
                                <NewspaperClipping className="w-8 h-8 text-indigo-600" />
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                                Dorfarchiv
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-6"></div>
                        <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                            Historische Dokumente, Texte und ältere Nachrichten aus Wendessen
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {archiveItems.length === 0 && archivedNews.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
                            <NewspaperClipping className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Noch keine Archiveinträge
                            </h2>
                            <p className="text-lg text-gray-600">
                                Das Archiv wird derzeit aufgebaut.
                            </p>
                        </div>
                    ) : (
                        <ArchiveClient 
                            archiveItems={archiveItems}
                            archivedNews={archivedNews}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
