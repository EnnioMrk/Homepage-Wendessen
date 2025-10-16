'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { 
    Article, 
    CalendarBlank, 
    User, 
    Newspaper,
    MagnifyingGlass,
    SortAscending,
    Funnel,
    X
} from '@phosphor-icons/react/dist/ssr';

interface NewsItem {
    id: string;
    title: string;
    content?: unknown; // JSON Slate content
    previewText?: string; // Extracted preview text
    category: string;
    publishedDate: Date | string;
    articleId: string;
    type: 'news';
}

interface ArchiveItem {
    id: number;
    title: string;
    author?: string;
    category?: string;
    created_date?: string;
    content: string;
    created_at: string;
    type: 'document';
}

type CombinedItem = NewsItem | ArchiveItem;

interface ArchiveClientProps {
    archiveItems: Omit<ArchiveItem, 'type'>[];
    archivedNews: Omit<NewsItem, 'type'>[];
}

function getNewsCategoryColors(category: string): string {
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
}

function extractTextFromContent(content: string): string {
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
            // Extract all text from Slate JSON structure
            return parsed.map(node => {
                if (node && typeof node === 'object' && 'children' in (node as Record<string, unknown>)) {
                    const children = (node as Record<string, unknown>).children as unknown[] | undefined;
                    if (Array.isArray(children)) {
                        return children.map((child) => {
                            if (child && typeof child === 'object' && 'text' in (child as Record<string, unknown>)) {
                                const t = (child as Record<string, unknown>).text;
                                return typeof t === 'string' ? t : '';
                            }
                            return '';
                        }).join(' ');
                    }
                }
                return '';
            }).join(' ');
        }
        return content;
    } catch {
        return content;
    }
}

export default function ArchiveClient({ archiveItems, archivedNews }: ArchiveClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>('date-desc');
    const [filterType, setFilterType] = useState<'all' | 'news' | 'document'>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    // Combine all items with type information and extract preview text from news content
    const allItems: CombinedItem[] = useMemo(() => {
        const news: NewsItem[] = archivedNews.map(item => {
            // Extract preview text from JSON content
            let previewText = '';
            try {
                if (typeof item.content === 'string') {
                    const parsed = JSON.parse(item.content);
                    if (Array.isArray(parsed) && parsed[0]?.children) {
                        previewText = parsed[0].children
                            .map((child: unknown) => {
                                if (typeof child === 'object' && child !== null && 'text' in (child as Record<string, unknown>)) {
                                    const t = (child as Record<string, unknown>).text;
                                    return typeof t === 'string' ? t : '';
                                }
                                return '';
                            })
                            .join(' ');
                    }
                }
            } catch {
                // If parsing fails, leave preview empty
            }
            
            return { ...item, previewText, type: 'news' as const };
        });
        const docs: ArchiveItem[] = archiveItems.map(item => ({ ...item, type: 'document' as const }));
        return [...news, ...docs];
    }, [archiveItems, archivedNews]);

    // Extract all unique categories
    const allCategories = useMemo(() => {
        const categories = new Set<string>();
        allItems.forEach(item => {
            if (item.category) {
                categories.add(item.category);
            }
        });
        return Array.from(categories).sort();
    }, [allItems]);

    // Setup Fuse.js for fuzzy search
    const fuse = useMemo(() => {
        const searchableItems = allItems.map(item => {
            if (item.type === 'news') {
                return {
                    ...item,
                    searchableContent: `${item.title} ${item.previewText || ''} ${item.category}`.toLowerCase()
                };
            } else {
                const textContent = extractTextFromContent(item.content);
                return {
                    ...item,
                    searchableContent: `${item.title} ${textContent} ${item.author || ''} ${item.category || ''}`.toLowerCase()
                };
            }
        });

        return new Fuse(searchableItems, {
            keys: ['searchableContent'],
            threshold: 0.3,
            includeScore: true,
        });
    }, [allItems]);

    // Filter and sort items
    const filteredAndSortedItems = useMemo(() => {
        let items: CombinedItem[] = allItems;

        // Apply search
        if (searchQuery.trim()) {
            const results = fuse.search(searchQuery);
            items = results.map(result => result.item);
        }

        // Apply type filter
        if (filterType !== 'all') {
            items = items.filter(item => item.type === filterType);
        }

        // Apply category filter
        if (filterCategory !== 'all') {
            items = items.filter(item => item.category === filterCategory);
        }

        // Apply sorting
        items.sort((a, b) => {
            if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            }
            
            const dateA = a.type === 'news' 
                ? new Date(a.publishedDate) 
                : new Date(a.created_date || a.created_at);
            const dateB = b.type === 'news' 
                ? new Date(b.publishedDate) 
                : new Date(b.created_date || b.created_at);

            if (sortBy === 'date-desc') {
                return dateB.getTime() - dateA.getTime();
            } else {
                return dateA.getTime() - dateB.getTime();
            }
        });

        return items;
    }, [allItems, searchQuery, sortBy, filterType, filterCategory, fuse]);

    const hasActiveFilters = searchQuery || filterType !== 'all' || filterCategory !== 'all' || sortBy !== 'date-desc';

    const clearFilters = () => {
        setSearchQuery('');
        setFilterType('all');
        setFilterCategory('all');
        setSortBy('date-desc');
    };

    return (
        <div>
            {/* Search and Filter Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Durchsuchen Sie alle Inhalte..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
                        />
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Type Filter */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Funnel className="w-4 h-4 inline mr-1" />
                                Typ
                            </label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as 'all' | 'news' | 'document')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                            >
                                <option value="all">Alle Typen</option>
                                <option value="news">Nachrichten</option>
                                <option value="document">Dokumente</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategorie
                            </label>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                            >
                                <option value="all">Alle Kategorien</option>
                                {allCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <SortAscending className="w-4 h-4 inline mr-1" />
                                Sortierung
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'date-desc' | 'date-asc' | 'title')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                            >
                                <option value="date-desc">Neueste zuerst</option>
                                <option value="date-asc">Älteste zuerst</option>
                                <option value="title">Alphabetisch</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters / Clear */}
                    {hasActiveFilters && (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                {filteredAndSortedItems.length} {filteredAndSortedItems.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
                            </p>
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                <X className="w-4 h-4" />
                                Filter zurücksetzen
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}
            {filteredAndSortedItems.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
                    <MagnifyingGlass className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Keine Ergebnisse gefunden
                    </h2>
                    <p className="text-lg text-gray-600 mb-4">
                        Versuchen Sie andere Suchbegriffe oder Filter
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Filter zurücksetzen
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedItems.map((item) => {
                        if (item.type === 'news') {
                            return (
                                <Link 
                                    key={`news-${item.id}`}
                                    href={`/neuigkeiten/${item.articleId}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1"
                                >
                                    {/* Header with gradient */}
                                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                                    <Newspaper className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-white text-xs font-semibold uppercase tracking-wide drop-shadow-sm">
                                                    Nachricht
                                                </span>
                                            </div>
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getNewsCategoryColors(item.category)}`}>
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <CalendarBlank className="w-4 h-4 mr-2 flex-shrink-0" />
                                            <span>{new Date(item.publishedDate).toLocaleDateString('de-DE', { 
                                                year: 'numeric', 
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                            {item.previewText || 'Keine Vorschau verfügbar. Klicken Sie, um den vollständigen Artikel zu lesen.'}
                                        </p>
                                    </div>
                                </Link>
                            );
                        } else {
                            return (
                                <Link 
                                    key={`doc-${item.id}`}
                                    href={`/dorfleben/archiv/${item.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:-translate-y-1"
                                >
                                    {/* Header with gradient */}
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                                    <Article className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-white text-xs font-semibold uppercase tracking-wide drop-shadow-sm">
                                                    Dokument
                                                </span>
                                            </div>
                                            {item.category && (
                                                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                                                    {item.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="font-bold text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        
                                        <div className="space-y-2 mb-4">
                                            {item.author && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <User className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span className="truncate">{item.author}</span>
                                                </div>
                                            )}
                                            {item.created_date && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <CalendarBlank className="w-4 h-4 mr-2 flex-shrink-0" />
                                                    <span>{new Date(item.created_date).toLocaleDateString('de-DE', { 
                                                        year: 'numeric', 
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                            {(() => {
                                                try {
                                                    const parsed = JSON.parse(item.content);
                                                    if (Array.isArray(parsed) && parsed[0]?.children?.[0]?.text) {
                                                        return parsed[0].children[0].text;
                                                    }
                                                    return 'Kein Vorschautext verfügbar';
                                                } catch {
                                                    return item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '');
                                                }
                                            })()}
                                        </p>
                                    </div>
                                </Link>
                            );
                        }
                    })}
                </div>
            )}
        </div>
    );
}
