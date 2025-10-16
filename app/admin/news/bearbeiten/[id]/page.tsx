'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Descendant } from 'slate';
import { ArrowLeft, Eye, Check, X } from '@phosphor-icons/react';
import Link from 'next/link';
import EnhancedRichTextEditor from '@/app/components/EnhancedRichTextEditor';
import ArticleRenderer from '@/app/components/ArticleRenderer';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const initialEditorValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

interface NewsArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    publishedDate: string;
    contentJson?: string;
    articleId: string;
}

export default function EditNewsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [step, setStep] = useState<'editing' | 'preview'>('editing');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newsArticle, setNewsArticle] = useState<NewsArticle | null>(null);

    // Form data
    const [title, setTitle] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [category, setCategory] = useState('');
    const [articleContent, setArticleContent] = useState<Descendant[]>(initialEditorValue);

    useEffect(() => {
        fetchNewsArticle();
    }, [params.id]);

    const fetchNewsArticle = async () => {
        try {
            const response = await fetch(`/api/admin/news/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                const article = data.news;
                
                setNewsArticle(article);
                setTitle(article.title);
                setShortDescription(article.content || '');
                setCategory(article.category);
                
                if (article.contentJson) {
                    try {
                        const parsedContent = JSON.parse(article.contentJson);
                        setArticleContent(parsedContent);
                    } catch (e) {
                        console.error('Error parsing article content:', e);
                    }
                }
            } else {
                setError('Artikel nicht gefunden');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Fehler beim Laden des Artikels');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/news/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    content: shortDescription.trim(),
                    category: category,
                    contentJson: JSON.stringify(articleContent),
                }),
            });

            if (response.ok) {
                router.push('/admin/news');
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Lade Artikel..." />
            </div>
        );
    }

    if (error && !newsArticle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Link
                        href="/admin/news"
                        className="text-primary hover:text-primary-dark"
                    >
                        Zurück zur Übersicht
                    </Link>
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
                                    <h1 className="text-xl font-bold text-gray-900">Nachricht bearbeiten</h1>
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

                {/* Form Content */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
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
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Kurzbeschreibung *
                                </label>
                                <textarea
                                    id="description"
                                    value={shortDescription}
                                    onChange={(e) => setShortDescription(e.target.value)}
                                    placeholder="Wird auf der Startseite angezeigt..."
                                    rows={4}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Diese Beschreibung erscheint auf der Startseite
                                </p>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
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
                                    <option value="Gemeinschaft">Gemeinschaft</option>
                                    <option value="Feuerwehr">Feuerwehr</option>
                                    <option value="Digital">Digital</option>
                                    <option value="Sport">Sport</option>
                                    <option value="Kultur">Kultur</option>
                                    <option value="Verwaltung">Verwaltung</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Article Editor */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Artikel-Inhalt</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Erstellen Sie hier den vollständigen Artikel-Inhalt
                                </p>
                            </div>
                            <div className="h-[500px]">
                                <EnhancedRichTextEditor
                                    value={articleContent}
                                    onChange={setArticleContent}
                                    placeholder="Schreiben Sie hier Ihren vollständigen Artikel..."
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
                                    <p className="text-sm text-gray-600">Überprüfen Sie Ihren Artikel vor dem Speichern</p>
                                </div>
                            </div>
                            <button
                                onClick={handleUpdate}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <LoadingSpinner size="sm" color="white" />
                                        Wird gespeichert...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Änderungen speichern
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
                                        {new Date().toLocaleDateString('de-DE', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                    {title}
                                </h1>
                                <p className="mt-4 text-lg text-white/90 leading-relaxed">
                                    {shortDescription}
                                </p>
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
