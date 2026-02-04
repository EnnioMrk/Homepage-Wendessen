'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    Trash,
    PencilSimple,
    MagnifyingGlass,
} from '@phosphor-icons/react/dist/ssr';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import PromptDialog from '@/app/components/ui/PromptDialog';

interface Organization {
    id: string;
    title: string;
    alt_title: string | null;
    description: string | null;
}

export default function AdminOrganizationsClient() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Dialog states
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [, setIsDeleting] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const [deleteCandidate, setDeleteCandidate] = useState<Organization | null>(
        null
    );

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        alt_title: '',
        description: '',
    });

    const fetchOrganizations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/organizations');
            if (response.ok) {
                const data = await response.json();
                setOrganizations(data.organizations || []);
            } else {
                setError('Fehler beim Laden der Organisationen');
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
            setError('Fehler beim Laden der Organisationen');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    const handleCreateClick = () => {
        setEditingOrg(null);
        setFormData({ id: '', title: '', alt_title: '', description: '' });
        setIsEditorOpen(true);
    };

    const handleEditClick = (org: Organization) => {
        setEditingOrg(org);
        setFormData({
            id: org.id,
            title: org.title,
            alt_title: org.alt_title || '',
            description: org.description || '',
        });
        setIsEditorOpen(true);
    };

    const handleSave = async () => {
        try {
            const url = editingOrg
                ? `/api/admin/organizations/${editingOrg.id}`
                : '/api/admin/organizations';

            const method = editingOrg ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchOrganizations();
                setIsEditorOpen(false);
            } else {
                const data = await response.json();
                alert(data.error || 'Fehler beim Speichern');
            }
        } catch (error) {
            console.error('Error saving organization:', error);
            alert('Fehler beim Speichern');
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/organizations/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setOrganizations((prev) => prev.filter((o) => o.id !== id));
                setDeleteCandidate(null);
            } else {
                const data = await response.json();
                alert(data.error || 'Fehler beim Löschen');
            }
        } catch (error) {
            console.error('Error deleting organization:', error);
            alert('Fehler beim Löschen');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredOrgs = organizations.filter(
        (org) =>
            org.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (org.alt_title &&
                org.alt_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (org.description &&
                org.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))
    );

    // Auto-generate slug/ID from title for NEW orgs
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!editingOrg) {
            // New organization: auto-slugify
            const slug = val
                .toLowerCase()
                .replace(/ä/g, 'ae')
                .replace(/ö/g, 'oe')
                .replace(/ü/g, 'ue')
                .replace(/ß/g, 'ss')
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setFormData((prev) => ({ ...prev, title: val, id: slug }));
        } else {
            // Editing: just update title
            setFormData((prev) => ({ ...prev, title: val }));
        }
    };

    if (loading) return <LoadingSpinner centered />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                    Organisationen
                </h2>
                <button
                    onClick={handleCreateClick}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center text-sm font-medium"
                >
                    <Plus size={16} className="mr-2" />
                    Neue Organisation
                </button>
            </div>

            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlass
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </div>
                <input
                    type="text"
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-primary focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    placeholder="Suche nach Organisationen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {error}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredOrgs.length === 0 ? (
                        <li className="px-6 py-12 text-center text-gray-500">
                            Keine Organisationen gefunden.
                        </li>
                    ) : (
                        filteredOrgs.map((org) => (
                            <li
                                key={org.id}
                                className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                            {org.title}
                                        </h3>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                            {org.id}
                                        </span>
                                    </div>
                                    {org.alt_title && (
                                        <p className="text-sm font-semibold text-gray-600 mt-1">
                                            Alt: {org.alt_title}
                                        </p>
                                    )}
                                    {org.description && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {org.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handleEditClick(org)}
                                        className="text-gray-400 hover:text-blue-600 p-2"
                                        title="Bearbeiten"
                                    >
                                        <PencilSimple size={20} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteCandidate(org)}
                                        className="text-gray-400 hover:text-red-600 p-2"
                                        title="Löschen"
                                    >
                                        <Trash size={20} />
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Editor Modal/Overlay */}
            {isEditorOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                            {editingOrg
                                ? 'Organisation bearbeiten'
                                : 'Neue Organisation'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Titel (Name)
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                />
                            </div>

                             <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    ID (Slug)
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2 bg-gray-50 font-mono"
                                    value={formData.id}
                                    onChange={(e) =>
                                         // Allow manual edit if needed, mainly for corrections
                                        setFormData((prev) => ({
                                            ...prev,
                                            id: e.target.value,
                                        }))
                                    }
                                    disabled={!!editingOrg} // Disable ID editing for existing orgs usually
                                />
                                {editingOrg && <p className="text-xs text-gray-500 mt-1">ID kann nachträglich nicht geändert werden.</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Alternativer Titel (Kurzform)
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                    value={formData.alt_title}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            alt_title: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Beschreibung
                                </label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsEditorOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.title || !formData.id}
                                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
                            >
                                Speichern
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <PromptDialog
                isOpen={!!deleteCandidate}
                title="Organisation löschen?"
                description={`Möchten Sie die Organisation "${deleteCandidate?.title}" wirklich löschen?`}
                confirmText="Löschen"
                cancelText="Abbrechen"
                onConfirm={() =>
                    deleteCandidate && handleDelete(deleteCandidate.id)
                }
                onCancel={() => setDeleteCandidate(null)}
                accentColor="red"
            />
        </div>
    );
}
