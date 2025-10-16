'use client';

import { useState, useEffect } from 'react';
import { usePermissions } from '@/lib/usePermissions';
import Link from 'next/link';
import { 
    NewspaperClipping, 
    Plus, 
    PencilSimple, 
    Trash,
    Article,
    User,
    CalendarBlank,
    ArrowLeft
} from '@phosphor-icons/react/dist/ssr';

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
        if (!confirm('Möchten Sie diesen Archiveintrag wirklich löschen?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/archive/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchArchiveItems();
            } else {
                const error = await response.json();
                alert(error.error || 'Fehler beim Löschen');
            }
        } catch (error) {
            console.error('Error deleting archive item:', error);
            alert('Fehler beim Löschen');
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dorfarchiv</h1>
                        <p className="text-gray-600">Historische Dokumente und Texte verwalten</p>
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
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Noch keine Einträge</h2>
                    <p className="text-gray-600 mb-4">Beginnen Sie mit dem Aufbau des Archivs</p>
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
                        <div key={item.id} className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
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
                                            onClick={() => handleDelete(item.id)}
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
                                        <span>{new Date(item.created_date).toLocaleDateString('de-DE')}</span>
                                    </div>
                                )}
                            </div>

                            <div className="text-gray-700 text-sm line-clamp-3">
                                {(() => {
                                    try {
                                        const parsed = JSON.parse(item.content);
                                        // Extract text from first paragraph for preview
                                        if (Array.isArray(parsed) && parsed[0]?.children?.[0]?.text) {
                                            return parsed[0].children[0].text;
                                        }
                                        return 'Kein Vorschautext verfügbar';
                                    } catch {
                                        // Plain text content
                                        return item.content.substring(0, 150) + (item.content.length > 150 ? '...' : '');
                                    }
                                })()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
