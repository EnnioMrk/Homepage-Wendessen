'use client';

import { useState, useEffect } from 'react';
import { usePermissions } from '@/lib/usePermissions';
import Link from 'next/link';
import PromptDialog from '@/app/components/PromptDialog';
import ErrorNotification from '@/app/components/ErrorNotification';
import {
    NewspaperClipping,
    Plus,
    PencilSimple,
    Trash,
    Article,
    User,
    CalendarBlank,
    ArrowLeft,
    Eye,
    X,
} from '@phosphor-icons/react/dist/ssr';
import ArticleRenderer from '@/app/components/ArticleRenderer';
import { Descendant } from 'slate';

interface ArchiveItem {
    id: number;
    title: string;
    author?: string;
    category?: string;
    created_date?: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export default function AdminArchivePage() {
    const { hasPermission } = usePermissions();
    const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewItem, setPreviewItem] = useState<ArchiveItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<ArchiveItem | null>(null);
    const [errorNotification, setErrorNotification] = useState('');

    useEffect(() => {
        fetchArchiveItems();
    }, []);

    const fetchArchiveItems = async () => {
        try {
            const response = await fetch('/api/archive');
            if (response.ok) {
                const data = await response.json();
                setArchiveItems(data);
            }
        } catch (error) {
            console.error('Error fetching archive items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/archive/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchArchiveItems();
            } else {
                const error = await response.json();
                setErrorNotification(error.error || 'Fehler beim Löschen');
            }
        } catch (error) {
            console.error('Error deleting archive item:', error);
            setErrorNotification('Fehler beim Löschen');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        window.location.href = `/admin/archiv/bearbeiten/${id}`;
    };

    const canCreate = hasPermission('archive.create');
    const canEdit = hasPermission('archive.edit');
    const canDelete = hasPermission('archive.delete');

    if (loading && archiveItems.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Lade Archiv...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8 flex justify-between items-center">
                <div className="flex items-center">
                    <Link
                        href="/admin/dashboard"
                        className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Dorfarchiv
                        </h1>
                        <p className="text-gray-600">
                            Historische Dokumente und Texte verwalten
                        </p>
                    </div>
                </div>
                {canCreate && (
                    <Link
                        href="/admin/archiv/erstellen"
                        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Neuer Eintrag</span>
                    </Link>
                )}
            </div>

            {archiveItems.length === 0 ? (
                <div className="bg-white rounded-lg p-12 text-center">
                    <NewspaperClipping className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                        Noch keine Einträge
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Beginnen Sie mit dem Aufbau des Archivs
                    </p>
                    {canCreate && (
                        <Link
                            href="/admin/archiv/erstellen"
                            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                        >
                            Ersten Eintrag erstellen
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archiveItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-lg p-6 shadow-lg border border-gray-200"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <Article className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg mb-2">
                                            {item.title}
                                        </h3>
                                        {item.category && (
                                            <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                {item.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setPreviewItem(item)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
                                        title="Vorschau"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    {canEdit && (
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                            title="Bearbeiten"
                                        >
                                            <PencilSimple className="w-4 h-4" />
                                        </button>
                                    )}
                                    {canDelete && (
                                        <button
                                            onClick={() =>
                                                setItemToDelete(item)
                                            }
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                                            title="Löschen"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                {item.author && (
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        <span>{item.author}</span>
                                    </div>
                                )}
                                {item.created_date && (
                                    <div className="flex items-center">
                                        <CalendarBlank className="w-4 h-4 mr-2" />
                                        <span>
                                            {new Date(
                                                item.created_date
                                            ).toLocaleDateString('de-DE')}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="text-gray-700 text-sm line-clamp-3">
                                {(() => {
                                    try {
                                        const parsed = JSON.parse(item.content);
                                        // Extract text from first paragraph for preview
                                        if (
                                            Array.isArray(parsed) &&
                                            parsed[0]?.children?.[0]?.text
                                        ) {
                                            return parsed[0].children[0].text;
                                        }
                                        return 'Kein Vorschautext verfügbar';
                                    } catch {
                                        // Plain text content
                                        return (
                                            item.content.substring(0, 150) +
                                            (item.content.length > 150
                                                ? '...'
                                                : '')
                                        );
                                    }
                                })()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            {previewItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start justify-center px-4 pb-4 pt-[66px] md:pt-[68px] lg:pt-[70px] z-50 overflow-y-auto scroll-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-auto">
                        {/* Modal Header */}
                        <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Article className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Vorschau
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {previewItem.title}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewItem(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 md:p-8">
                            {/* Article Header */}
                            <header className="mb-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                    {previewItem.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    {previewItem.category && (
                                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                            {previewItem.category}
                                        </span>
                                    )}
                                    {previewItem.author && (
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-1.5" />
                                            <span>{previewItem.author}</span>
                                        </div>
                                    )}
                                    {previewItem.created_date && (
                                        <div className="flex items-center">
                                            <CalendarBlank className="w-4 h-4 mr-1.5" />
                                            <span>
                                                {new Date(
                                                    previewItem.created_date
                                                ).toLocaleDateString('de-DE', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </header>

                            {/* Article Content */}
                            <div className="prose prose-lg max-w-none">
                                {(() => {
                                    try {
                                        const parsed = JSON.parse(
                                            previewItem.content
                                        ) as Descendant[];
                                        return (
                                            <ArticleRenderer content={parsed} />
                                        );
                                    } catch {
                                        // Plain text content - render as paragraphs
                                        return previewItem.content
                                            .split('\n\n')
                                            .map((paragraph, idx) => (
                                                <p
                                                    key={idx}
                                                    className="text-gray-700 mb-4 leading-relaxed"
                                                >
                                                    {paragraph}
                                                </p>
                                            ));
                                    }
                                })()}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                            <button
                                onClick={() => setPreviewItem(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                            >
                                Schließen
                            </button>
                            {canEdit && (
                                <button
                                    onClick={() => {
                                        setPreviewItem(null);
                                        handleEdit(previewItem.id);
                                    }}
                                    className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition flex items-center"
                                >
                                    <PencilSimple className="w-4 h-4 mr-2" />
                                    Bearbeiten
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <PromptDialog
                isOpen={itemToDelete !== null}
                onCancel={() => setItemToDelete(null)}
                onConfirm={async () => {
                    if (itemToDelete) {
                        await handleDelete(itemToDelete.id);
                        setItemToDelete(null);
                    }
                }}
                title="Archiveintrag löschen"
                description="Möchten Sie diesen Archiveintrag wirklich löschen?"
                confirmText="Löschen"
                cancelText="Abbrechen"
                icon={<Trash className="h-12 w-12" />}
                accentColor="red"
            />

            {errorNotification && (
                <ErrorNotification
                    message={errorNotification}
                    onClose={() => setErrorNotification('')}
                />
            )}
        </div>
    );
}
