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

export default function CreateNewsForm() {
    const router = useRouter();
    const [step, setStep] = useState<'initial' | 'editing' | 'preview'>(
        'initial'
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form data
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [articleContent, setArticleContent] =
        useState<Descendant[]>(initialEditorValue);

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && category) {
            setStep('editing');
            setError(null);
        }
    };

    const handlePublish = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    content: null,
                    category: category,
                    contentJson: JSON.stringify(articleContent),
                }),
            });

            if (response.ok) {
                router.push('/admin/news');
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
                        <h1 className="text-2xl font-bold text-gray-900">
                            Neue Nachricht erstellen
                        </h1>
                        <Link
                            href="/admin/news"
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </Link>
                    </div>

                    <form onSubmit={handleInitialSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Titel *
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="z.B. Neues Feuerwehrhaus geplant"
                                required
                                maxLength={255}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Kategorie *
                            </label>
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                            >
                                <option value="">Kategorie wählen</option>
                                <option value="Bildung">Bildung</option>
                                <option value="Gemeinschaft">
                                    Gemeinschaft
                                </option>
                                <option value="Feuerwehr">Feuerwehr</option>
                                <option value="Digital">Digital</option>
                                <option value="Sport">Sport</option>
                                <option value="Kultur">Kultur</option>
                                <option value="Verwaltung">Verwaltung</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Weiter zum Artikel
                            </button>
                            <Link
                                href="/admin/news"
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
                                    href="/admin/news"
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </Link>
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl font-bold text-gray-900 truncate">
                                        {title}
                                    </h1>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                                            {category}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep('preview')}
                                className="ml-4 flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
                        value={articleContent}
                        onChange={setArticleContent}
                        placeholder="Schreiben Sie hier Ihren vollständigen Artikel..."
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
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Vorschau
                                    </h1>
                                    <p className="text-sm text-gray-600">
                                        Überprüfen Sie Ihren Artikel vor der
                                        Veröffentlichung
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handlePublish}
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner
                                            size="sm"
                                            color="white"
                                        />
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
                            <div className="bg-gradient-to-r from-primary to-primary-dark p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                                        {category}
                                    </span>
                                    <span className="text-white/80 text-sm">
                                        {new Date().toLocaleDateString(
                                            'de-DE',
                                            {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                            }
                                        )}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                    {title}
                                </h1>
                            </div>

                            <div className="p-8 md:p-12">
                                <ArticleRenderer content={articleContent} />
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
