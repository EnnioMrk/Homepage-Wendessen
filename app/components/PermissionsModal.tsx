'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import { AdminUserRecord } from '@/lib/database';
import PromptDialog from '@/app/components/ui/PromptDialog';

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

// Vereine data
const VEREINE = [
    { id: 'sv-wendessen', name: 'SV Wendessen' },
    { id: 'feuerwehr', name: 'Freiwillige Feuerwehr' },
    { id: 'jugendfeuerwehr', name: 'Jugendfeuerwehr' },
    { id: 'kleingaertner', name: 'Kleingärtner-Verein' },
    { id: 'kirchbauverein', name: 'Kirchbauverein' },
    { id: 'initiative-spritzenhaus', name: 'Initiative Spritzenhaus' },
    { id: 'schuetzenverein', name: 'Schützenverein' },
    { id: 'seniorenkreis', name: 'Evang. Seniorenkreis' },
    { id: 'frauenhilfe', name: 'Evang. Frauenhilfe' },
];

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
    const [selectedVereinId, setSelectedVereinId] = useState<string>(
        user.vereinId || ''
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [pendingRoleRemoval, setPendingRoleRemoval] = useState<string | null>(
        null
    );
    const [rolePermissionsLoaded, setRolePermissionsLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadPermissions();
            setRolePermissionsLoaded(false);

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
                } finally {
                    setRolePermissionsLoaded(true);
                }
            })();

            setSelectedPermissions(user.customPermissions || []);
            setSelectedVereinId(user.vereinId || '');
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

    // Cross-category permission dependencies
    // Key: the required permission, Value: permissions that depend on it
    const PERMISSION_DEPENDENCIES: Record<string, string[]> = {
        'events.view': [
            'verein.events.create',
            'verein.events.edit',
            'verein.events.delete',
            'verein.events.cancel',
        ],
        'gallery.view': [
            'events.create',
            'events.edit',
            'verein.events.create',
            'verein.events.edit',
        ],
    };

    // Reverse mapping: permission -> its required dependencies (can have multiple)
    const PERMISSION_REQUIRES: Record<string, string[]> = {
        'verein.events.create': ['events.view', 'gallery.view'],
        'verein.events.edit': ['events.view', 'gallery.view'],
        'verein.events.delete': ['events.view'],
        'verein.events.cancel': ['events.view'],
        'events.create': ['gallery.view'],
        'events.edit': ['gallery.view'],
    };

    const handleTogglePermission = (
        permissionName: string,
        options?: { forceRemove?: boolean }
    ) => {
        // Special handling for wildcard permissions
        if (permissionName === '*') {
            setSelectedPermissions((prev) => {
                const alreadySelected = prev.includes('*');

                if (alreadySelected) {
                    const isFromRole = rolePermissionsSet.has('*');
                    if (isFromRole && !options?.forceRemove) {
                        setPendingRoleRemoval('*');
                        return prev;
                    }
                    return prev.filter((perm) => perm !== '*');
                }

                return ['*'];
            });
            return;
        }

        setSelectedPermissions((prev) => {
            if (prev.includes(permissionName)) {
                // Check if this is a standard role permission
                const isFromRole = rolePermissionsSet.has(permissionName);

                if (isFromRole) {
                    if (!options?.forceRemove) {
                        setPendingRoleRemoval(permissionName);
                        return prev;
                    }
                }

                // When removing a permission, check if it's a view permission
                // If so, remove all related action permissions in the same category
                if (permissionName.endsWith('.view')) {
                    const [category] = permissionName.split('.');
                    let filtered = prev.filter(
                        (p) => !p.startsWith(`${category}.`)
                    );

                    // Also remove cross-category dependent permissions
                    const dependentPermissions =
                        PERMISSION_DEPENDENCIES[permissionName] || [];
                    filtered = filtered.filter(
                        (p) => !dependentPermissions.includes(p)
                    );

                    return filtered;
                }
                return prev.filter((p) => p !== permissionName);
            } else {
                const sanitizedPrev = prev.includes('*')
                    ? prev.filter((perm) => perm !== '*')
                    : prev;

                // When adding a permission, automatically add the view permission for that category
                // Handle `verein.*` scoped permissions by using the second segment as the real category
                let viewPermission: string;
                if (permissionName.startsWith('verein.')) {
                    const parts = permissionName.split('.');
                    viewPermission =
                        parts.length >= 2 ? `${parts[1]}.view` : 'events.view';
                } else {
                    const [category] = permissionName.split('.');
                    viewPermission = `${category}.view`;
                }

                const permissionsToAdd: string[] = [permissionName];

                // If it's not a view permission and view permission isn't already selected, add it
                if (
                    !permissionName.endsWith('.view') &&
                    !sanitizedPrev.includes(viewPermission)
                ) {
                    permissionsToAdd.push(viewPermission);
                }

                // Check for cross-category dependencies (e.g., verein.events.* requires events.view and gallery.view)
                const requiredPermissions =
                    PERMISSION_REQUIRES[permissionName] || [];
                for (const requiredPermission of requiredPermissions) {
                    if (
                        !sanitizedPrev.includes(requiredPermission) &&
                        !permissionsToAdd.includes(requiredPermission)
                    ) {
                        permissionsToAdd.push(requiredPermission);
                    }
                }

                return [...sanitizedPrev, ...permissionsToAdd];
            }
        });
    };

    const rolePermissionsSet = useMemo(
        () => new Set(rolePermissions),
        [rolePermissions]
    );

    const uniqueSelectedPermissions = useMemo(
        () => Array.from(new Set(selectedPermissions)),
        [selectedPermissions]
    );

    const hasWildcard = uniqueSelectedPermissions.includes('*');

    const totalSelectedCount = uniqueSelectedPermissions.length;

    const extraPermissionsCount = rolePermissionsLoaded
        ? uniqueSelectedPermissions.filter(
              (permission) => !rolePermissionsSet.has(permission)
          ).length
        : 0;

    const isPermissionChecked = (permissionName: string) => {
        return selectedPermissions.includes(permissionName);
    };

    const isPermissionFromRole = (permissionName: string) => {
        return rolePermissionsSet.has(permissionName);
    };

    const getPermissionDetails = (
        permissionName: string
    ): Permission | null => {
        for (const perms of Object.values(permissions)) {
            const match = perms.find((perm) => perm.name === permissionName);
            if (match) {
                return match;
            }
        }
        return null;
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
                        vereinId: selectedVereinId || null,
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

    const handleConfirmRoleRemoval = () => {
        if (pendingRoleRemoval) {
            handleTogglePermission(pendingRoleRemoval, { forceRemove: true });
            setPendingRoleRemoval(null);
        }
    };

    const handleCancelRoleRemoval = () => {
        setPendingRoleRemoval(null);
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
        verein: 'Vereinsverwaltung',
        system: 'System',
        other: 'Sonstige',
    };

    const pendingPermissionDetails = pendingRoleRemoval
        ? getPermissionDetails(pendingRoleRemoval)
        : null;

    return (
        <>
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
                        {/* Verein Selection */}
                        <div className="mb-6 border border-gray-200 rounded-lg p-4">
                            <label
                                htmlFor="verein"
                                className="block text-md font-semibold text-gray-900 mb-2"
                            >
                                Verein
                            </label>
                            <select
                                id="verein"
                                value={selectedVereinId}
                                onChange={(e) =>
                                    setSelectedVereinId(e.target.value)
                                }
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            >
                                <option value="">Kein Verein</option>
                                {VEREINE.map((verein) => (
                                    <option key={verein.id} value={verein.id}>
                                        {verein.name}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Ordnet den Admin einem spezifischen Verein zu
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Hinweis:</strong> Berechtigungen mit
                                Rollensymbol{' '}
                                <ShieldCheck className="w-4 h-4 inline text-primary" />{' '}
                                sind Standard-Berechtigungen der Rolle. Sie
                                können diese entfernen oder zusätzliche
                                Berechtigungen hinzufügen. Die Anzahl der
                                zusätzlichen Berechtigungen wird berechnet.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-3">
                                <div className="text-sm text-red-700">
                                    {error}
                                </div>
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
                                                    const isWildcardPermission =
                                                        permission.name === '*';
                                                    const isDisabled =
                                                        hasWildcard &&
                                                        !isWildcardPermission;
                                                    return (
                                                        <label
                                                            key={permission.id}
                                                            className={`flex items-start p-2 rounded cursor-pointer hover:bg-gray-50 ${
                                                                isFromRole
                                                                    ? 'bg-blue-50'
                                                                    : ''
                                                            } ${
                                                                isDisabled
                                                                    ? 'opacity-60 cursor-not-allowed'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={isPermissionChecked(
                                                                    permission.name
                                                                )}
                                                                disabled={
                                                                    isDisabled
                                                                }
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
                            {hasWildcard ? (
                                <>
                                    <p className="text-gray-900">
                                        Alle Berechtigungen sind aktiviert.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Einzelne Berechtigungen können erst
                                        bearbeitet werden, nachdem die
                                        Stern-Berechtigung entfernt wurde.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>
                                        {totalSelectedCount} Berechtigung(en)
                                        insgesamt
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {rolePermissionsLoaded
                                            ? `${extraPermissionsCount} zusätzliche Berechtigung(en)`
                                            : 'Standardberechtigungen werden geladen...'}
                                    </p>
                                </>
                            )}
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
            <PromptDialog
                isOpen={Boolean(pendingRoleRemoval)}
                title="Standard-Berechtigung entfernen?"
                description={`"${
                    pendingPermissionDetails?.displayName ??
                    pendingRoleRemoval ??
                    ''
                }" ist Teil der Standardrechte der Rolle ${
                    user.roleDisplayName || user.roleName
                }. Möchten Sie sie wirklich entfernen?`}
                confirmText="Entfernen"
                cancelText="Behalten"
                onConfirm={handleConfirmRoleRemoval}
                onCancel={handleCancelRoleRemoval}
            />
        </>
    );
}
