'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Check, Trash, PencilSimple, Copy } from '@phosphor-icons/react/dist/ssr';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import PromptDialog from '@/app/components/ui/PromptDialog';

interface Layout {
    id: number;
    name: string;
    is_active: boolean;
    created_at: string;
    card_1?: unknown;
    card_2?: unknown;
    card_3?: unknown;
}

interface AdminWendessenClientProps {
    canManage?: boolean;
    canCreate?: boolean;
}

export default function AdminWendessenClient({
    canManage = false,
    canCreate = false,
}: AdminWendessenClientProps) {
    const router = useRouter();
    const [layouts, setLayouts] = useState<Layout[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [layoutToDelete, setLayoutToDelete] = useState<Layout | null>(null);
    const [, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState<number | null>(null);
    const [duplicatingLayoutId, setDuplicatingLayoutId] = useState<number | null>(null);

    useEffect(() => {
        fetchLayouts();
    }, []);

    const fetchLayouts = async () => {
        try {
            const response = await fetch('/api/admin/wendessen');
            if (response.ok) {
                const data = await response.json();
                setLayouts(data.layouts || []);
            } else {
                setError('Fehler beim Laden der Layouts');
            }
        } catch (error) {
            console.error('Error fetching layouts:', error);
            setError('Fehler beim Laden der Layouts');
        } finally {
            setLoading(false);
        }
    };

    const handleSetActive = async (id: number) => {
        setIsActivating(id);
        try {
            const response = await fetch(`/api/admin/wendessen/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: true }),
            });

            if (response.ok) {
                fetchLayouts(); // Refresh to show new active status
            } else {
                alert('Fehler beim Aktivieren des Layouts');
            }
        } catch (error) {
            console.error('Error activating layout:', error);
            alert('Fehler beim Aktivieren des Layouts');
        } finally {
            setIsActivating(null);
        }
    };

    const handleDelete = async (id: number) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/wendessen/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setLayouts(prev => prev.filter(l => l.id !== id));
                setLayoutToDelete(null);
            } else {
                const data = await response.json();
                alert(data.error || 'Fehler beim Löschen');
            }
        } catch (error) {
            console.error('Error deleting layout:', error);
            alert('Fehler beim Löschen');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicate = async (layout: Layout) => {
        if (!canCreate) {
            return;
        }

        setDuplicatingLayoutId(layout.id);

        try {
            const response = await fetch('/api/admin/wendessen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: layout.name?.trim()
                        ? `${layout.name} (Kopie)`
                        : 'Layout Kopie',
                    card_1: layout.card_1,
                    card_2: layout.card_2,
                    card_3: layout.card_3,
                }),
            });

            if (response.ok) {
                fetchLayouts();
            } else {
                const data = await response.json();
                alert(data.error || 'Fehler beim Duplizieren');
            }
        } catch (error) {
            console.error('Error duplicating layout:', error);
            alert('Fehler beim Duplizieren');
        } finally {
            setDuplicatingLayoutId(null);
        }
    };

    if (loading) return <LoadingSpinner centered />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Verfügbare Layouts</h2>
                {canManage && (
                    <button
                        onClick={() => router.push('/admin/wendessen/neu')}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center text-sm font-medium"
                    >
                        <Plus size={16} className="mr-2" />
                        Neues Layout
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {error}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {layouts.length === 0 ? (
                        <li className="px-6 py-12 text-center text-gray-500">
                            Keine Layouts vorhanden. Erstellen Sie das erste!
                        </li>
                    ) : (
                        layouts.map((layout) => (
                            <li key={layout.id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center">
                                        <h3 className="text-lg font-medium text-gray-900 mr-3">
                                            {layout.name}
                                        </h3>
                                        {layout.is_active && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Aktiv
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Erstellt am {new Date(layout.created_at).toLocaleDateString('de-DE')}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {canCreate && (
                                        <button
                                            onClick={() => handleDuplicate(layout)}
                                            disabled={duplicatingLayoutId === layout.id}
                                            className="text-gray-400 hover:text-gray-700 p-2"
                                            title="Duplizieren"
                                        >
                                            {duplicatingLayoutId === layout.id ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                <Copy size={20} />
                                            )}
                                        </button>
                                    )}
                                    {!layout.is_active && canManage && (
                                        <button
                                            onClick={() => handleSetActive(layout.id)}
                                            disabled={isActivating === layout.id}
                                            className="text-gray-400 hover:text-green-600 p-2"
                                            title="Aktivieren"
                                        >
                                            {isActivating === layout.id ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                <Check size={20} />
                                            )}
                                        </button>
                                    )}
                                    {canManage && (
                                        <>
                                            <button
                                                onClick={() => router.push(`/admin/wendessen/${layout.id}`)}
                                                className="text-gray-400 hover:text-blue-600 p-2"
                                                title="Bearbeiten"
                                            >
                                                <PencilSimple size={20} />
                                            </button>
                                            <button
                                                onClick={() => setLayoutToDelete(layout)}
                                                disabled={layout.is_active} // Cannot delete active
                                                className={`p-2 transition-colors ${layout.is_active
                                                    ? 'text-gray-200 cursor-not-allowed'
                                                    : 'text-gray-400 hover:text-red-600'
                                                    }`}
                                                title={layout.is_active ? "Aktives Layout kann nicht gelöscht werden" : "Löschen"}
                                            >
                                                <Trash size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <PromptDialog
                isOpen={!!layoutToDelete}
                title="Layout löschen?"
                description={`Möchten Sie das Layout "${layoutToDelete?.name}" wirklich löschen?`}
                confirmText="Löschen"
                cancelText="Abbrechen"
                onConfirm={() => layoutToDelete && handleDelete(layoutToDelete.id)}
                onCancel={() => setLayoutToDelete(null)}
                accentColor="red"
            />
        </div>
    );
}
