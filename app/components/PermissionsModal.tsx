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

export default function PermissionsModal({
    user,
    isOpen,
    onClose,
    onSuccess,
}: PermissionsModalProps) {
    const [permissions, setPermissions] = useState<
        Record<string, Permission[]>
    >({});
    const [rolePermissions, setRolePermissions] = useState<string[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        user.customPermissions || []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadPermissions();

            (async () => {
                try {
                    const response = await fetch(
                        `/api/admin/users/${user.id}/role-permissions`
                    );
                    if (response.ok) {
                        const data = await response.json();
                        setRolePermissions(data.rolePermissions || []);
                    }
                } catch (err) {
                    console.error('Error loading role permissions:', err);
                }
            })();

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

    // role permissions are loaded inside the useEffect when the modal opens

    const handleTogglePermission = (permissionName: string) => {
        setSelectedPermissions((prev) => {
            if (prev.includes(permissionName)) {
                // When removing a permission, check if it's a view permission
                // If so, remove all related action permissions in the same category
                if (permissionName.endsWith('.view')) {
                    const [category] = permissionName.split('.');
                    return prev.filter((p) => !p.startsWith(`${category}.`));
                }
                return prev.filter((p) => p !== permissionName);
            } else {
                // When adding a permission, automatically add the view permission for that category
                const [category] = permissionName.split('.');
                const viewPermission = `${category}.view`;

                // If it's not a view permission and view permission isn't already selected, add it
                if (
                    !permissionName.endsWith('.view') &&
                    !prev.includes(viewPermission)
                ) {
                    return [...prev, viewPermission, permissionName];
                }

                return [...prev, permissionName];
            }
        });
    };

    const isPermissionChecked = (permissionName: string) => {
        return selectedPermissions.includes(permissionName);
    };

    const isPermissionFromRole = (permissionName: string) => {
        return rolePermissions.includes(permissionName);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError('');

            const response = await fetch(
                `/api/admin/users/${user.id}/permissions`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        roleId: user.roleId,
                        customPermissions: selectedPermissions,
                    }),
                }
            );

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
        archive: 'Archiv',
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
                            <strong>Hinweis:</strong> Berechtigungen mit
                            Rollensymbol{' '}
                            <ShieldCheck className="w-4 h-4 inline text-primary" />{' '}
                            sind Standard-Berechtigungen der Rolle. Sie können
                            diese entfernen oder zusätzliche Berechtigungen
                            hinzufügen. Die Anzahl der zusätzlichen
                            Berechtigungen wird berechnet.
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
                            <p className="mt-2 text-gray-600">
                                Lade Berechtigungen...
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(permissions).map(
                                ([category, perms]) => (
                                    <div
                                        key={category}
                                        className="border border-gray-200 rounded-lg p-4"
                                    >
                                        <h4 className="text-md font-semibold text-gray-900 mb-3">
                                            {categoryNames[category] ||
                                                category}
                                        </h4>
                                        <div className="space-y-2">
                                            {perms.map((permission) => {
                                                const isFromRole =
                                                    isPermissionFromRole(
                                                        permission.name
                                                    );
                                                return (
                                                    <label
                                                        key={permission.id}
                                                        className={`flex items-start p-2 rounded cursor-pointer hover:bg-gray-50 ${
                                                            isFromRole
                                                                ? 'bg-blue-50'
                                                                : ''
                                                        }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isPermissionChecked(
                                                                permission.name
                                                            )}
                                                            onChange={() =>
                                                                handleTogglePermission(
                                                                    permission.name
                                                                )
                                                            }
                                                            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                        />
                                                        <div className="ml-3 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`text-sm font-medium ${
                                                                        isFromRole
                                                                            ? 'text-blue-900'
                                                                            : 'text-gray-900'
                                                                    }`}
                                                                >
                                                                    {
                                                                        permission.displayName
                                                                    }
                                                                </span>
                                                                {isFromRole && (
                                                                    <span title="Standard-Berechtigung der Rolle">
                                                                        <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {permission.description && (
                                                                <p
                                                                    className={`text-xs ${
                                                                        isFromRole
                                                                            ? 'text-blue-700'
                                                                            : 'text-gray-500'
                                                                    }`}
                                                                >
                                                                    {
                                                                        permission.description
                                                                    }
                                                                    {isFromRole &&
                                                                        ' (Standard-Berechtigung)'}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        <p>
                            {selectedPermissions.length} Berechtigung(en)
                            insgesamt
                        </p>
                        <p className="text-xs text-gray-500">
                            {
                                selectedPermissions.filter(
                                    (p) => !rolePermissions.includes(p)
                                ).length
                            }{' '}
                            zusätzliche Berechtigung(en)
                        </p>
                    </div>
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
