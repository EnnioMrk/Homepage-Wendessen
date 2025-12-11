'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Check, X } from '@phosphor-icons/react';
import Link from 'next/link';
import EnhancedRichTextEditor from '@/app/components/EnhancedRichTextEditor';
import ArticleRenderer from '@/app/components/news/ArticleRenderer';
import { Descendant } from 'slate';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

const initialEditorValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

// ArchiveItem interface was unused here; keep the shape in the fetch handling instead.

export default function EditArchivePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [step, setStep] = useState<'editing' | 'preview'>('editing');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [archiveId, setArchiveId] = useState<string>('');

    // Form data
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [content, setContent] = useState<Descendant[]>(initialEditorValue);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const p = await params;
                const id = p.id;
                setArchiveId(id);

                if (mounted) setIsLoading(true);
                if (mounted) setError(null);

                const response = await fetch(`/api/archive/${id}`);
                if (response.ok) {
                    const data = await response.json();

                    if (!mounted) return;

                    setTitle(data.title);
                    setAuthor(data.author || '');
                    setCategory(data.category || '');
                    setCreatedDate(data.created_date || '');

                    // Parse content if it's JSON
                    try {
                        const parsedContent = JSON.parse(data.content);
                        setContent(parsedContent);
                    } catch {
                        // If content is plain text, convert to Slate format
                        setContent([
                            {
                                type: 'paragraph',
                                children: [{ text: data.content }],
                            },
                        ]);
                    }
                } else {
                    if (mounted) setError('Archiveintrag nicht gefunden');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                if (mounted) setError('Fehler beim Laden des Archiveintrags');
            } finally {
                if (mounted) setIsLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [params]);

    const handleUpdate = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/archive/${archiveId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    author: author.trim(),
                    category: category.trim(),
                    created_date: createdDate,
                    content: JSON.stringify(content),
                }),
            });

            if (response.ok) {
                router.push('/admin/archiv');
                router.refresh();
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Aktualisieren');
            }
        } catch (err) {
            console.error('Update error:', err);
            setError('Netzwerkfehler beim Aktualisieren');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Editing View
    if (step === 'editing') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 min-w-0 flex-1">
                                <Link
                                    href="/admin/archiv"
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl font-bold text-gray-900">Archiveintrag bearbeiten</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setStep('preview')}
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <Eye className="w-5 h-5" />
                                    Vorschau
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400"
                                >
                                    {isSaving ? (
                                        <>
                                            <LoadingSpinner size="sm" color="white" />
                                            Speichern...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Speichern
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                            <X className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
                    {/* Metadata */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Metadaten</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titel *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Titel des Archiveintrags"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Autor
                                    </label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Verfasser"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kategorie
                                    </label>
                                    <input
                                        type="text"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="z.B. Chronik, Brief"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Erstellungsdatum
                                    </label>
                                    <input
                                        type="date"
                                        value={createdDate}
                                        onChange={(e) => setCreatedDate(e.target.value)}
                                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Inhalt</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Bearbeiten Sie hier den vollständigen Inhalt des Archiveintrags
                            </p>
                        </div>
                        <div className="h-[500px]">
                            <EnhancedRichTextEditor
                                value={content}
                                onChange={setContent}
                                placeholder="Schreiben Sie hier den vollständigen Inhalt..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Preview View
    if (step === 'preview') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* Preview Header */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setStep('editing')}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </button>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Vorschau</h1>
                                    <p className="text-sm text-gray-600">So wird der Eintrag aussehen</p>
                                </div>
                            </div>
                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400"
                            >
                                {isSaving ? (
                                    <>
                                        <LoadingSpinner size="sm" color="white" />
                                        Speichern...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Speichern
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Content */}
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-8 md:p-12">
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    {title || 'Ohne Titel'}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    {author && (
                                        <div className="flex items-center">
                                            <span className="font-medium">Autor:</span>
                                            <span className="ml-1">{author}</span>
                                        </div>
                                    )}
                                    {category && (
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                            {category}
                                        </span>
                                    )}
                                    {createdDate && (
                                        <div className="flex items-center">
                                            <span className="font-medium">Datum:</span>
                                            <span className="ml-1">
                                                {new Date(createdDate).toLocaleDateString('de-DE')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="prose prose-lg max-w-none">
                                <ArticleRenderer content={content} />
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        );
    }

    return null;
}
