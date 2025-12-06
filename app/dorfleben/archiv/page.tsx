import BackgroundElements from '@/app/components/BackgroundElements';
import { NewspaperClipping } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/PageHeader';
import { getArchivedNews, getArchiveItems } from '@/lib/database';
import ArchiveClient from './ArchiveClient';

export const revalidate = 3600;

export default async function ArchivPage() {
    const [archiveItems, archivedNews] = await Promise.all([
        getArchiveItems(),
        getArchivedNews(),
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative">
            <BackgroundElements />

            {/* Hero Section */}
            <PageHeader
                title="Dorfarchiv"
                subtitle="Historische Dokumente, Texte und ältere Nachrichten aus Wendessen"
                icon={<NewspaperClipping />}
                color="indigo"
            />

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
