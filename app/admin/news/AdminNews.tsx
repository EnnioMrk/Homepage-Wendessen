'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import PromptDialog from '@/app/components/ui/PromptDialog';
import ArticleRenderer from '@/app/components/news/ArticleRenderer';
import Link from 'next/link';
import {
    Plus,
    MagnifyingGlass,
    ArrowsDownUp,
    PencilSimple,
    Trash,
    Eye,
    ArrowLeft,
    X,
    Check,
    WarningCircle,
    Calendar,
    Tag,
    PushPin,
    PushPinSlash,
    // Article icon removed (unused)
} from '@phosphor-icons/react/dist/ssr';
import { usePermissions } from '@/lib/usePermissions';

interface NewsItem {
    id: string;
    title: string;
    content?: string;
    category: string;
    publishedDate: string;
    articleId?: string;
    isPinned?: boolean;
    pinnedAt?: string;
}

export default function AdminNews() {
    const router = useRouter();
    const { hasPermission } = usePermissions();

    // Permission checks
    const canCreate = hasPermission('news.create');
    const canEdit = hasPermission('news.edit');
    const canDelete = hasPermission('news.delete');
    const canPin = hasPermission('news.pin');

    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('date');
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pinnedCount, setPinnedCount] = useState(0);
    const [pinLoading, setPinLoading] = useState<string | null>(null);
    const [newsToDelete, setNewsToDelete] = useState<NewsItem | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
    });

    const categories = [
        'allgemein',
        'veranstaltung',
        'ortsrat',
        'verein',
        'feuerwehr',
        'sport',
        'kultur',
        'bau',
        'wichtig',
    ];

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/api/admin/news');
            if (response.ok) {
                const data = await response.json();
                const newsItems = data.news || [];
                setNews(newsItems);
                setPinnedCount(
                    newsItems.filter((n: NewsItem) => n.isPinned).length
                );
            } else {
                setError('Fehler beim Laden der Nachrichten');
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Fehler beim Laden der Nachrichten');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!formData.title.trim() || !formData.category) {
            setError('Titel und Kategorie sind erforderlich');
            return;
        }

        try {
            const response = await fetch('/api/admin/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setNews((prev) => [data.news, ...prev]);
                setIsCreating(false);
                setFormData({ title: '', content: '', category: '' });
                setError(null);
            } else {
                const errorData = await response.json();
                setError(
                    errorData.error || 'Fehler beim Erstellen der Nachricht'
                );
            }
        } catch (error) {
            console.error('Create error:', error);
            setError('Fehler beim Erstellen der Nachricht');
        }
    };

    const handleUpdate = async () => {
        if (!selectedNews || !formData.title.trim() || !formData.category) {
            setError('Titel und Kategorie sind erforderlich');
            return;
        }

        try {
            const response = await fetch(`/api/admin/news/${selectedNews.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                setNews((prev) =>
                    prev.map((item) =>
                        item.id === selectedNews.id ? data.news : item
                    )
                );
                setIsEditing(false);
                setSelectedNews(null);
                setFormData({ title: '', content: '', category: '' });
                setError(null);
            } else {
                const errorData = await response.json();
                setError(
                    errorData.error || 'Fehler beim Aktualisieren der Nachricht'
                );
            }
        } catch (error) {
            console.error('Update error:', error);
            setError('Fehler beim Aktualisieren der Nachricht');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/news/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setNews((prev) => prev.filter((item) => item.id !== id));
                setPinnedCount((prev) => {
                    const item = news.find((n) => n.id === id);
                    return item?.isPinned ? prev - 1 : prev;
                });
                setError(null);
            } else {
                const errorData = await response.json();
                setError(
                    errorData.error || 'Fehler beim Löschen der Nachricht'
                );
            }
        } catch (error) {
            console.error('Delete error:', error);
            setError('Fehler beim Löschen der Nachricht');
        }
    };

    const handleTogglePin = async (id: string, isPinned: boolean) => {
        setPinLoading(id);
        try {
            const response = await fetch(`/api/admin/news/${id}/pin`, {
                method: isPinned ? 'DELETE' : 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                setNews((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? {
                                  ...item,
                                  isPinned:
                                      data.news.isPinned || data.news.is_pinned,
                                  pinnedAt:
                                      data.news.pinnedAt || data.news.pinned_at,
                              }
                            : item
                    )
                );
                setPinnedCount((prev) => (isPinned ? prev - 1 : prev + 1));
                setError(null);
            } else {
                const errorData = await response.json();
                setError(
                    errorData.error || 'Fehler beim Ändern des Pin-Status'
                );
            }
        } catch (error) {
            console.error('Pin toggle error:', error);
            setError('Fehler beim Ändern des Pin-Status');
        } finally {
            setPinLoading(null);
        }
    };

    const sortedAndFilteredNews = news
        .filter((item) => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (item.content &&
                    item.content
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()));
            return matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title
                        .toLowerCase()
                        .localeCompare(b.title.toLowerCase());
                case 'category':
                    return a.category
                        .toLowerCase()
                        .localeCompare(b.category.toLowerCase());
                case 'date':
                    return (
                        new Date(b.publishedDate).getTime() -
                        new Date(a.publishedDate).getTime()
                    );
                default:
                    return 0;
            }
        });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getCategoryColor = (category: string) => {
        const colorMap: Record<string, string> = {
            Bildung: 'bg-amber-100 text-amber-800',
            Gemeinschaft: 'bg-green-100 text-green-800',
            Feuerwehr: 'bg-red-100 text-red-800',
            Digital: 'bg-indigo-100 text-indigo-800',
            Sport: 'bg-blue-100 text-blue-800',
            Kultur: 'bg-purple-100 text-purple-800',
            Verwaltung: 'bg-gray-100 text-gray-800',
        };

        return colorMap[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Nachrichten Verwaltung
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Nachrichten erstellen, bearbeiten und
                                    verwalten
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {canPin && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-sm">
                                    <PushPin
                                        size={16}
                                        className="text-amber-600"
                                        weight="fill"
                                    />
                                    <span className="text-amber-800 font-medium">
                                        {pinnedCount}/3 angepinnt
                                    </span>
                                </div>
                            )}
                            {canCreate && (
                                <Link
                                    href="/admin/news/erstellen"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                                >
                                    <Plus size={16} className="mr-2" />
                                    Nachricht erstellen
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Search and Sort Bar */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <MagnifyingGlass
                                    size={20}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Nachrichten durchsuchen..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                            </div>
                            <div className="relative">
                                <ArrowsDownUp
                                    size={20}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    <option value="date">Nach Datum</option>
                                    <option value="title">Nach Titel</option>
                                    <option value="category">
                                        Nach Kategorie
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <WarningCircle className="h-5 w-5 text-red-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">
                                        {error}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setError(null)}
                                    className="ml-auto"
                                >
                                    <X className="h-5 w-5 text-red-400" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* News List */}
                    <div className="bg-white shadow rounded-lg">
                        {loading ? (
                            <LoadingSpinner
                                size="md"
                                text="Lade Nachrichten..."
                                centered
                                className="my-12"
                            />
                        ) : sortedAndFilteredNews.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {sortedAndFilteredNews.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`p-6 hover:bg-gray-50 ${
                                            item.isPinned
                                                ? 'bg-amber-50/50 border-l-4 border-amber-400'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    {item.isPinned && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                            <PushPin
                                                                size={12}
                                                                className="mr-1"
                                                                weight="fill"
                                                            />
                                                            Angepinnt
                                                        </span>
                                                    )}
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        {item.title}
                                                    </h3>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                                                            item.category
                                                        )}`}
                                                    >
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <Calendar
                                                        size={14}
                                                        className="mr-1"
                                                    />
                                                    {formatDate(
                                                        item.publishedDate
                                                    )}
                                                </div>
                                                {item.content && (
                                                    <p className="text-gray-600 text-sm line-clamp-2">
                                                        {(() => {
                                                            const extractPreview =
                                                                (
                                                                    content: unknown
                                                                ): string => {
                                                                    try {
                                                                        const parsed =
                                                                            typeof content ===
                                                                            'string'
                                                                                ? JSON.parse(
                                                                                      content
                                                                                  )
                                                                                : content;

                                                                        if (
                                                                            Array.isArray(
                                                                                parsed
                                                                            ) &&
                                                                            parsed.length >
                                                                                0
                                                                        ) {
                                                                            const first =
                                                                                parsed[0] as unknown;
                                                                            if (
                                                                                typeof first ===
                                                                                    'object' &&
                                                                                first !==
                                                                                    null &&
                                                                                'children' in
                                                                                    (first as Record<
                                                                                        string,
                                                                                        unknown
                                                                                    >) &&
                                                                                Array.isArray(
                                                                                    (
                                                                                        first as Record<
                                                                                            string,
                                                                                            unknown
                                                                                        >
                                                                                    )
                                                                                        .children
                                                                                )
                                                                            ) {
                                                                                const children =
                                                                                    (
                                                                                        first as Record<
                                                                                            string,
                                                                                            unknown
                                                                                        >
                                                                                    )
                                                                                        .children as unknown[];
                                                                                const texts =
                                                                                    children
                                                                                        .map(
                                                                                            (
                                                                                                c
                                                                                            ) => {
                                                                                                if (
                                                                                                    typeof c ===
                                                                                                        'object' &&
                                                                                                    c !==
                                                                                                        null &&
                                                                                                    'text' in
                                                                                                        (c as Record<
                                                                                                            string,
                                                                                                            unknown
                                                                                                        >)
                                                                                                ) {
                                                                                                    const maybe =
                                                                                                        (
                                                                                                            c as Record<
                                                                                                                string,
                                                                                                                unknown
                                                                                                            >
                                                                                                        )
                                                                                                            .text;
                                                                                                    return typeof maybe ===
                                                                                                        'string'
                                                                                                        ? maybe
                                                                                                        : '';
                                                                                                }
                                                                                                return '';
                                                                                            }
                                                                                        )
                                                                                        .filter(
                                                                                            Boolean
                                                                                        )
                                                                                        .join(
                                                                                            ' '
                                                                                        );
                                                                                return texts.substring(
                                                                                    0,
                                                                                    200
                                                                                );
                                                                            }
                                                                        }

                                                                        return 'Vorschau nicht verfügbar';
                                                                    } catch {
                                                                        return typeof content ===
                                                                            'string'
                                                                            ? content.substring(
                                                                                  0,
                                                                                  200
                                                                              )
                                                                            : 'Vorschau nicht verfügbar';
                                                                    }
                                                                };

                                                            return extractPreview(
                                                                item.content
                                                            );
                                                        })()}
                                                        ...
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                                {canPin && (
                                                    <button
                                                        onClick={() =>
                                                            handleTogglePin(
                                                                item.id,
                                                                !!item.isPinned
                                                            )
                                                        }
                                                        disabled={
                                                            pinLoading ===
                                                                item.id ||
                                                            (!item.isPinned &&
                                                                pinnedCount >=
                                                                    3)
                                                        }
                                                        title={
                                                            item.isPinned
                                                                ? 'Nicht mehr anpinnen'
                                                                : pinnedCount >=
                                                                  3
                                                                ? 'Maximal 3 angepinnte Nachrichten erlaubt'
                                                                : 'Auf der Startseite anpinnen'
                                                        }
                                                        className={`p-2 rounded-full transition-colors ${
                                                            item.isPinned
                                                                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-100'
                                                                : pinnedCount >=
                                                                  3
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                                        } ${
                                                            pinLoading ===
                                                            item.id
                                                                ? 'opacity-50'
                                                                : ''
                                                        }`}
                                                    >
                                                        {item.isPinned ? (
                                                            <PushPinSlash
                                                                size={16}
                                                                weight="fill"
                                                            />
                                                        ) : (
                                                            <PushPin
                                                                size={16}
                                                            />
                                                        )}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        setSelectedNews(item)
                                                    }
                                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {canEdit && (
                                                    <Link
                                                        href={`/admin/news/bearbeiten/${item.id}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full inline-block"
                                                        title="Bearbeiten"
                                                    >
                                                        <PencilSimple
                                                            size={16}
                                                        />
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        onClick={() =>
                                                            setNewsToDelete(
                                                                item
                                                            )
                                                        }
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    Keine Nachrichten
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Keine Nachrichten gefunden
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Es wurden noch keine Nachrichten erstellt
                                    oder Ihre Suche ergab keine Treffer.
                                </p>
                                {canCreate && (
                                    <Link
                                        href="/admin/news/erstellen"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium inline-flex items-center mx-auto"
                                    >
                                        <Plus size={16} className="mr-2" />
                                        Erste Nachricht erstellen
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* View Modal */}
            {selectedNews && !isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Nachricht anzeigen
                            </h3>
                            <button
                                onClick={() => setSelectedNews(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                    {selectedNews.title}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center">
                                        <Calendar size={14} className="mr-1" />
                                        {formatDate(selectedNews.publishedDate)}
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                                            selectedNews.category
                                        )}`}
                                    >
                                        <Tag size={12} className="mr-1" />
                                        {selectedNews.category}
                                    </span>
                                </div>
                            </div>
                            {selectedNews.content && (
                                <div className="prose prose-sm max-w-none">
                                    <ArticleRenderer
                                        content={
                                            typeof selectedNews.content ===
                                            'string'
                                                ? JSON.parse(
                                                      selectedNews.content
                                                  )
                                                : selectedNews.content
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            {canEdit && (
                                <Link
                                    href={`/admin/news/bearbeiten/${selectedNews.id}`}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
                                >
                                    <PencilSimple size={16} className="mr-2" />
                                    Bearbeiten
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {(isCreating || isEditing) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {isCreating
                                    ? 'Nachricht erstellen'
                                    : 'Nachricht bearbeiten'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsCreating(false);
                                    setIsEditing(false);
                                    setSelectedNews(null);
                                    setFormData({
                                        title: '',
                                        content: '',
                                        category: '',
                                    });
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titel *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    placeholder="Titel der Nachricht..."
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategorie *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                >
                                    <option value="">
                                        Kategorie wählen...
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Inhalt
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            content: e.target.value,
                                        }))
                                    }
                                    rows={8}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                    placeholder="Inhalt der Nachricht..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            <button
                                onClick={() => {
                                    setIsCreating(false);
                                    setIsEditing(false);
                                    setSelectedNews(null);
                                    setFormData({
                                        title: '',
                                        content: '',
                                        category: '',
                                    });
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={
                                    isCreating ? handleCreate : handleUpdate
                                }
                                disabled={
                                    !formData.title.trim() || !formData.category
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-md flex items-center"
                            >
                                <Check size={16} className="mr-2" />
                                {isCreating ? 'Erstellen' : 'Speichern'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <PromptDialog
                isOpen={newsToDelete !== null}
                onCancel={() => setNewsToDelete(null)}
                onConfirm={async () => {
                    if (newsToDelete) {
                        await handleDelete(newsToDelete.id);
                        setNewsToDelete(null);
                    }
                }}
                title="Nachricht löschen"
                description="Sind Sie sicher, dass Sie diese Nachricht löschen möchten?"
                confirmText="Löschen"
                cancelText="Abbrechen"
                icon={<Trash className="h-12 w-12" />}
                accentColor="red"
            />
        </div>
    );
}
