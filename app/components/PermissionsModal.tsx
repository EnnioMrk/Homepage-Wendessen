'use client';

import { useState, useEffect } from 'react';
import { X, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import { AdminUserRecord } from '@/lib/database';

interface Permission {
    id: number;
    name: string;
    displayName: string;
    description?: string;
    category?: string;
}

interface PermissionsModalProps {
    user: AdminUserRecord;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PermissionsModal({ user, isOpen, onClose, onSuccess }: PermissionsModalProps) {
    const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(user.customPermissions || []);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadPermissions();
            setSelectedPermissions(user.customPermissions || []);
        }
    }, [isOpen, user]);

    const loadPermissions = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/permissions');
            if (response.ok) {
                const data = await response.json();
                setPermissions(data.permissions);
            }
        } catch (err) {
            console.error('Error loading permissions:', err);
            setError('Fehler beim Laden der Berechtigungen');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTogglePermission = (permissionName: string) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionName)) {
                return prev.filter(p => p !== permissionName);
            } else {
                return [...prev, permissionName];
            }
        });
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError('');

            const response = await fetch(`/api/admin/users/${user.id}/permissions`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roleId: user.roleId,
                    customPermissions: selectedPermissions,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update permissions');
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving permissions:', err);
            setError('Fehler beim Speichern der Berechtigungen');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const categoryNames: Record<string, string> = {
        users: 'Benutzerverwaltung',
        events: 'Termine',
        news: 'Neuigkeiten',
        gallery: 'Galerie',
        shared_gallery: 'Impressionen',
        portraits: 'Portraits',
        settings: 'Einstellungen',
        other: 'Sonstige',
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <ShieldCheck className="w-6 h-6 text-primary mr-2" />
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                Berechtigungen bearbeiten
                            </h3>
                            <p className="text-sm text-gray-600">
                                Benutzer: <strong>{user.username}</strong>
                                {user.roleDisplayName && (
                                    <span className="ml-2 text-primary">
                                        (Rolle: {user.roleDisplayName})
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Info Box */}
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Hinweis:</strong> Diese Berechtigungen werden zusätzlich zu den Rollenberechtigungen gewährt. 
                            Die Berechtigungsprüfung ist noch nicht aktiv und dient aktuell nur zur Verwaltung.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-3">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="mt-2 text-gray-600">Lade Berechtigungen...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(permissions).map(([category, perms]) => (
                                <div key={category} className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="text-md font-semibold text-gray-900 mb-3">
                                        {categoryNames[category] || category}
                                    </h4>
                                    <div className="space-y-2">
                                        {perms.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex items-start cursor-pointer hover:bg-gray-50 p-2 rounded"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(permission.name)}
                                                    onChange={() => handleTogglePermission(permission.name)}
                                                    className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                />
                                                <div className="ml-3 flex-1">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {permission.displayName}
                                                    </span>
                                                    {permission.description && (
                                                        <p className="text-xs text-gray-500">
                                                            {permission.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        {selectedPermissions.length} Berechtigung(en) ausgewählt
                    </p>
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Abbrechen
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-dark disabled:bg-gray-400"
                        >
                            {isSaving ? 'Speichert...' : 'Speichern'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
