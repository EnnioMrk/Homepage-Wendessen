'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ErrorNotification from '@/app/components/ui/ErrorNotification';
import {
    User,
    Plus,
    Trash,
    ArrowLeft,
    Warning,
    ShieldCheck,
    Gear,
    ArrowClockwise,
    CheckCircle,
} from '@phosphor-icons/react/dist/ssr';
import { AdminUserRecord } from '@/lib/database';
import PermissionsModal from '@/app/components/PermissionsModal';
import { usePermissions } from '@/lib/usePermissions';

// Vereine data for display
const VEREINE_MAP: Record<string, string> = {
    'idw': 'IDW',
    'sv-wendessen': 'SV Wendessen',
    'feuerwehr': 'Freiwillige Feuerwehr',
    'jugendfeuerwehr': 'Jugendfeuerwehr',
    'kleingaertner': 'Kleingärtner-Verein',
    'kirchbauverein': 'Kirchbauverein',
    'initiative-spritzenhaus': 'Initiative Spritzenhaus',
    'schuetzenverein': 'Schützenverein',
    'seniorenkreis': 'Evang. Seniorenkreis',
    'frauenhilfe': 'Evang. Frauenhilfe',
};

export default function AdminUsersClient() {
    const { hasPermission, loading: permissionsLoading } = usePermissions();
    const [users, setUsers] = useState<AdminUserRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(
        null
    );
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetSuccessData, setResetSuccessData] = useState<{
        password: string;
        username: string;
    } | null>(null);
    const [isResetting, setIsResetting] = useState(false);

    // Wait for permissions to load before checking
    const canCreate = !permissionsLoading && hasPermission('users.create');
    const canEdit = !permissionsLoading && hasPermission('users.edit');
    const canDelete = !permissionsLoading && hasPermission('users.delete');

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/users');

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.users);
        } catch (err) {
            console.error('Error loading users:', err);
            setError('Fehler beim Laden der Benutzer');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDeleteClick = (user: AdminUserRecord) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handlePermissionsClick = (user: AdminUserRecord) => {
        setSelectedUser(user);
        setShowPermissionsModal(true);
    };

    const handleResetClick = (user: AdminUserRecord) => {
        setSelectedUser(user);
        setShowResetModal(true);
    };

    const getExtraPermissionsCount = (user: AdminUserRecord): number => {
        const defaults = user.roleDefaultPermissions;
        if (!defaults) return 0;

        const defaultSet = new Set(defaults);
        const uniqueCustom = Array.from(new Set(user.customPermissions || []));
        return uniqueCustom.filter((permission) => !defaultSet.has(permission))
            .length;
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(
                `/api/admin/users/${selectedUser.id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete user');
            }

            await loadUsers();
            setShowDeleteModal(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Fehler beim Löschen des Benutzers'
            );
        }
    };

    const handleResetConfirm = async () => {
        if (!selectedUser) return;

        try {
            setIsResetting(true);
            const response = await fetch('/api/admin/users/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: selectedUser.id }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            setResetSuccessData({
                password: data.initialPassword,
                username: data.username,
            });
            setShowResetModal(false);
            await loadUsers();
        } catch (err) {
            console.error('Error resetting password:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Fehler beim Zurücksetzen des Passworts'
            );
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/admin/dashboard"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Admin-Benutzer
                            </h1>
                        </div>
                        {canCreate && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Neuer Admin
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="mt-2 text-gray-600">
                                Lade Benutzer...
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {users.map((user) => {
                                    const extraPermissionsCount =
                                        getExtraPermissionsCount(user);
                                    return (
                                        <li key={user.id}>
                                            <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                                                <div className="flex items-center min-w-0 flex-1">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                                            <User className="w-5 h-5 text-white" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 min-w-0 flex-1">
                                                        <div className="flex items-center flex-wrap gap-2">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {user.username}
                                                            </p>
                                                            {user.roleDisplayName && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    <ShieldCheck className="w-3 h-3 mr-1" />
                                                                    {
                                                                        user.roleDisplayName
                                                                    }
                                                                </span>
                                                            )}
                                                            {user.vereinId && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    {VEREINE_MAP[
                                                                        user
                                                                            .vereinId
                                                                    ] ||
                                                                        user.vereinId}
                                                                </span>
                                                            )}
                                                            {user.mustChangePassword && (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                    Passwort
                                                                    ändern
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-x-4">
                                                            <span>
                                                                Erstellt:{' '}
                                                                {new Date(
                                                                    user.createdAt
                                                                ).toLocaleDateString(
                                                                    'de-DE'
                                                                )}
                                                            </span>
                                                            {user.lastLogin && (
                                                                <span>
                                                                    Letzter
                                                                    Login:{' '}
                                                                    {new Date(
                                                                        user.lastLogin
                                                                    ).toLocaleDateString(
                                                                        'de-DE'
                                                                    )}
                                                                </span>
                                                            )}
                                                            {extraPermissionsCount >
                                                                0 && (
                                                                    <span className="text-xs text-primary">
                                                                        +
                                                                        {
                                                                            extraPermissionsCount
                                                                        }{' '}
                                                                        spezielle
                                                                        Berechtigung(en)
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {canEdit && (
                                                        <button
                                                            onClick={() =>
                                                                handlePermissionsClick(
                                                                    user
                                                                )
                                                            }
                                                            className="text-primary hover:text-primary-dark"
                                                            title="Berechtigungen bearbeiten"
                                                        >
                                                            <Gear className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {canEdit && (
                                                        <button
                                                            onClick={() =>
                                                                handleResetClick(
                                                                    user
                                                                )
                                                            }
                                                            className="text-amber-600 hover:text-amber-800"
                                                            title="Passwort zurücksetzen"
                                                        >
                                                            <ArrowClockwise className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    user
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Benutzer löschen"
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </main>

            {/* Create User Modal */}
            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={loadUsers}
                />
            )}

            {/* Permissions Modal */}
            {showPermissionsModal && selectedUser && (
                <PermissionsModal
                    user={selectedUser}
                    isOpen={showPermissionsModal}
                    onClose={() => {
                        setShowPermissionsModal(false);
                        setSelectedUser(null);
                    }}
                    onSuccess={loadUsers}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
                                <Warning className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="ml-3 text-lg font-medium text-gray-900">
                                Benutzer löschen
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Möchten Sie den Benutzer{' '}
                            <strong>{selectedUser.username}</strong> wirklich
                            löschen? Diese Aktion kann nicht rückgängig gemacht
                            werden.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Reset Confirmation Modal */}
            {showResetModal && selectedUser && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 bg-amber-100 rounded-full p-2">
                                <ArrowClockwise className="h-6 w-6 text-amber-600" />
                            </div>
                            <h3 className="ml-3 text-lg font-medium text-gray-900">
                                Passwort zurücksetzen
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Möchten Sie das Passwort für den Benutzer{' '}
                            <strong>{selectedUser.username}</strong> wirklich
                            zurücksetzen? Ein neues temporäres Passwort wird
                            generiert und der Benutzer muss es beim nächsten
                            Login ändern.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowResetModal(false);
                                    setSelectedUser(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleResetConfirm}
                                disabled={isResetting}
                                className="px-4 py-2 bg-amber-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-amber-700 disabled:bg-gray-400"
                            >
                                {isResetting
                                    ? 'Setze zurück...'
                                    : 'Passwort zurücksetzen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Reset Success Modal */}
            {resetSuccessData && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="ml-3 text-lg font-medium text-gray-900">
                                Passwort zurückgesetzt
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-md p-4">
                                <p className="text-sm text-green-800 mb-2">
                                    Das Passwort wurde erfolgreich
                                    zurückgesetzt!
                                </p>
                                <div className="bg-white rounded border border-green-300 p-3 mt-2">
                                    <p className="text-xs text-gray-600 mb-1">
                                        Benutzername:
                                    </p>
                                    <p className="text-sm font-mono font-medium text-gray-900 mb-3">
                                        {resetSuccessData.username}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-1">
                                        Neues temporäres Passwort (6-stellig):
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-mono font-bold text-gray-900">
                                            {resetSuccessData.password}
                                        </p>
                                        <button
                                            onClick={() =>
                                                navigator.clipboard.writeText(
                                                    resetSuccessData.password
                                                )
                                            }
                                            className="text-primary hover:text-primary-dark text-sm"
                                        >
                                            Kopieren
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                                <strong>Wichtig:</strong> Bitte teilen Sie dem
                                Benutzer dieses Passwort sicher mit. Er wird
                                aufgefordert, es beim nächsten Einloggen zu
                                ändern.
                            </p>
                            <button
                                onClick={() => setResetSuccessData(null)}
                                className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium"
                            >
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface Role {
    id: number;
    name: string;
    displayName: string;
    description?: string;
}

function CreateUserModal({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [username, setUsername] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>(
        undefined
    );
    const [selectedVereinId, setSelectedVereinId] = useState<string>('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [error, setError] = useState('');
    const [initialPassword, setInitialPassword] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Vereine data
    const vereine = [
        { id: 'idw', name: 'IDW' },
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

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const response = await fetch('/api/admin/roles');
                if (response.ok) {
                    const data = await response.json();
                    setRoles(data.roles);
                    // Set default to 'admin' role if available
                    const defaultRole = data.roles.find(
                        (r: Role) => r.name === 'admin'
                    );
                    if (defaultRole) {
                        setSelectedRoleId(defaultRole.id);
                    }
                }
            } catch (err) {
                console.error('Error loading roles:', err);
            } finally {
                setIsLoadingRoles(false);
            }
        };
        loadRoles();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setError('');

        try {
            const response = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    roleId: selectedRoleId,
                    vereinId: selectedVereinId || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create user');
            }

            setInitialPassword(data.initialPassword);
            setShowSuccess(true);
        } catch (err) {
            console.error('Error creating user:', err);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Fehler beim Erstellen des Benutzers'
            );
        } finally {
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        if (showSuccess) {
            onSuccess();
        }
        onClose();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(initialPassword);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {showSuccess ? 'Admin erstellt' : 'Neuer Admin-Benutzer'}
                </h3>

                {showSuccess ? (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-md p-4">
                            <p className="text-sm text-green-800 mb-2">
                                Der Admin-Benutzer wurde erfolgreich erstellt!
                            </p>
                            <div className="bg-white rounded border border-green-300 p-3 mt-2">
                                <p className="text-xs text-gray-600 mb-1">
                                    Benutzername:
                                </p>
                                <p className="text-sm font-mono font-medium text-gray-900 mb-3">
                                    {username}
                                </p>
                                <p className="text-xs text-gray-600 mb-1">
                                    Anfangspasswort (6-stellig):
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-mono font-bold text-gray-900">
                                        {initialPassword}
                                    </p>
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-primary hover:text-primary-dark text-sm"
                                    >
                                        Kopieren
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                            <strong>Wichtig:</strong> Teilen Sie diese
                            Anmeldedaten sicher mit dem neuen Admin. Das
                            Passwort wird nur einmal angezeigt und muss beim
                            ersten Login geändert werden.
                        </p>
                        <button
                            onClick={handleClose}
                            className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md text-sm font-medium"
                        >
                            Schließen
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Benutzername
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                pattern="[a-zA-Z0-9_-]+"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="z.B. max.mustermann"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Nur Buchstaben, Zahlen, Unterstriche und
                                Bindestriche
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Rolle
                            </label>
                            {isLoadingRoles ? (
                                <div className="mt-1 text-sm text-gray-500">
                                    Lade Rollen...
                                </div>
                            ) : (
                                <select
                                    id="role"
                                    value={selectedRoleId || ''}
                                    onChange={(e) =>
                                        setSelectedRoleId(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : undefined
                                        )
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                >
                                    <option value="">Keine Rolle</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.displayName}
                                            {role.description &&
                                                ` - ${role.description}`}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Bestimmt die Grundberechtigungen des Benutzers
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="verein"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Verein (Optional)
                            </label>
                            <select
                                id="verein"
                                value={selectedVereinId}
                                onChange={(e) =>
                                    setSelectedVereinId(e.target.value)
                                }
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            >
                                <option value="">Kein Verein</option>
                                {vereine.map((verein) => (
                                    <option key={verein.id} value={verein.id}>
                                        {verein.name}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Ordnet den Admin einem spezifischen Verein zu
                            </p>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-3">
                                <div className="text-sm text-red-700">
                                    {error}
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <p className="text-sm text-blue-800">
                                Ein 6-stelliges Anfangspasswort wird automatisch
                                generiert. Der Benutzer muss es beim ersten
                                Login ändern.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Abbrechen
                            </button>
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-white hover:bg-primary-dark disabled:bg-gray-400"
                            >
                                {isCreating ? 'Erstelle...' : 'Admin erstellen'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {error && (
                <ErrorNotification
                    message={error}
                    onClose={() => setError('')}
                />
            )}
        </div>
    );
}
