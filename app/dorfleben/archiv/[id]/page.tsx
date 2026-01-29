import BackgroundElements from '@/app/components/layout/BackgroundElements';
import ArticleRenderer from '@/app/components/news/ArticleRenderer';
import {
    NewspaperClipping,
    User,
    CalendarBlank,
    Tag,
    ArrowLeft,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Descendant } from 'slate';
import { getArchiveItemById } from '@/lib/database';

export default async function ArchiveItemPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const item = await getArchiveItemById(id);

    if (!item) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative">
                <BackgroundElements />
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 shadow-xl text-center">
                        <NewspaperClipping className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Eintrag nicht gefunden
                        </h2>
                        <p className="text-lg text-gray-600 mb-6">
                            Der gesuchte Archiveintrag existiert nicht.
                        </p>
                        <Link
                            href="/dorfleben/archiv"
                            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Zurück zum Archiv</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative">
            <BackgroundElements />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/95 to-pink-600/95"></div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Link
                            href="/dorfleben/archiv"
                            className="inline-flex items-center space-x-2 text-white/90 hover:text-white mb-6"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Zurück zum Archiv</span>
                        </Link>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            {item.title}
                        </h1>

                        <div className="flex flex-wrap gap-4 text-white/90">
                            {item.author && (
                                <div className="flex items-center space-x-2">
                                    <User className="w-5 h-5" />
                                    <span>{item.author}</span>
                                </div>
                            )}
                            {item.created_date && (
                                <div className="flex items-center space-x-2">
                                    <CalendarBlank className="w-5 h-5" />
                                    <span>
                                        {new Date(
                                            item.created_date
                                        ).toLocaleDateString('de-DE', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            )}
                            {item.category && (
                                <div className="flex items-center space-x-2">
                                    <Tag className="w-5 h-5" />
                                    <span>{item.category}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                        <div className="prose prose-lg max-w-none">
                            {(() => {
                                let parsedContent: Descendant[] | null = null;
                                try {
                                    parsedContent = JSON.parse(item.content);
                                } catch {
                                    // Not JSON
                                }

                                if (parsedContent) {
                                    return (
                                        <ArticleRenderer
                                            content={parsedContent}
                                        />
                                    );
                                }

                                return (
                                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                                        {item.content}
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Archiviert am:{' '}
                                {new Date(item.created_at).toLocaleDateString(
                                    'de-DE',
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
