'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Descendant } from 'slate';
import { ArrowLeft, Eye, Check, X } from '@phosphor-icons/react';
import Link from 'next/link';
import EnhancedRichTextEditor from '@/app/components/EnhancedRichTextEditor';
import ArticleRenderer from '@/app/components/news/ArticleRenderer';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

const initialEditorValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

export default function CreateArchivePage() {
    const router = useRouter();
    const [step, setStep] = useState<'initial' | 'editing' | 'preview'>('initial');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form data
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [content, setContent] = useState<Descendant[]>(initialEditorValue);

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            setStep('editing');
            setError(null);
        }
    };

    const handlePublish = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/archive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    author: author.trim() || undefined,
                    category: category.trim() || undefined,
                    created_date: createdDate || undefined,
                    content: JSON.stringify(content),
                }),
            });

            if (response.ok) {
                router.push('/admin/archiv');
                router.refresh();
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Veröffentlichen');
            }
        } catch (err) {
            console.error('Publishing error:', err);
            setError('Netzwerkfehler beim Veröffentlichen');
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Modal
    if (step === 'initial') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Neuer Archiveintrag erstellen</h1>
                        <Link
                            href="/admin/archiv"
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </Link>
                    </div>

                    <form onSubmit={handleInitialSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Titel *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="z.B. Chronik des Jahres 1950"
                                required
                                maxLength={255}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                                    Autor (optional)
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="z.B. Max Mustermann"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategorie (optional)
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="z.B. Chronik, Brief, Bericht"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="created_date" className="block text-sm font-medium text-gray-700 mb-2">
                                Erstellungsdatum (optional)
                            </label>
                            <input
                                type="date"
                                id="created_date"
                                value={createdDate}
                                onChange={(e) => setCreatedDate(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Das ursprüngliche Datum des Dokuments (falls bekannt)
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Weiter zum Inhalt
                            </button>
                            <Link
                                href="/admin/archiv"
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Abbrechen
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // Editor View
    if (step === 'editing') {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                <Link
                                    href="/admin/archiv"
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        {category && (
                                            <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                                                {category}
                                            </span>
                                        )}
                                        {author && (
                                            <p className="text-sm text-gray-600">von {author}</p>
                                        )}
                                        {createdDate && (
                                            <p className="text-sm text-gray-600">
                                                {new Date(createdDate).toLocaleDateString('de-DE')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep('preview')}
                                className="ml-4 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                <Eye className="w-5 h-5" />
                                Vorschau
                            </button>
                        </div>
                    </div>
                </div>

                {/* Editor Content */}
                <div className="h-[calc(100vh-5rem)]">
                    <EnhancedRichTextEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Schreiben Sie hier den vollständigen Inhalt des Archiveintrags..."
                    />
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
                                    <p className="text-sm text-gray-600">Überprüfen Sie den Archiveintrag vor der Veröffentlichung</p>
                                </div>
                            </div>
                            <button
                                onClick={handlePublish}
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" color="white" />
                                        Wird veröffentlicht...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Jetzt veröffentlichen
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="max-w-4xl mx-auto px-4 py-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                            <X className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-4">
                                    {category && (
                                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                                            {category}
                                        </span>
                                    )}
                                    {createdDate && (
                                        <span className="text-white/80 text-sm">
                                            {new Date(createdDate).toLocaleDateString('de-DE', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                    {title}
                                </h1>
                                {author && (
                                    <p className="mt-4 text-lg text-white/90 leading-relaxed">
                                        von {author}
                                    </p>
                                )}
                            </div>

                            <div className="p-8 md:p-12">
                                <ArticleRenderer content={content} />
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
