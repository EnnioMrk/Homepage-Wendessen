'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AdminUserRecord } from '@/lib/database';
import ConfirmDialog from '@/app/admin/contacts/components/ConfirmDialog';
import { trapDialogTab } from '@/app/admin/contacts/components/dialog-focus';
import styles from '@/app/admin/users/users.module.css';
import { ASSOCIATIONS } from '@/lib/constants/associations';

interface Role {
    id: number;
    name: string;
    displayName: string;
    description?: string;
}

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

const VEREINE = ASSOCIATIONS.map((association) => ({
    id: association.id,
    name: association.title,
}));

const CATEGORY_NAMES: Record<string, string> = {
    users: 'Benutzerverwaltung',
    events: 'Termine',
    news: 'Neuigkeiten',
    gallery: 'Galerie',
    shared_gallery: 'Impressionen',
    portraits: 'Portraits',
    archive: 'Archiv',
    settings: 'Einstellungen',
    verein: 'Vereinsverwaltung',
    contacts: 'Kontakte',
    logs: 'Aktivitätslog',
    wendessen: 'Dorfwissen',
    system: 'System',
    other: 'Sonstige',
};

// A permission that unlocks another screen also unlocks its dependencies.
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

const PERMISSION_REQUIRES: Record<string, string[]> = {
    'verein.events.create': ['events.view', 'gallery.view'],
    'verein.events.edit': ['events.view', 'gallery.view'],
    'verein.events.delete': ['events.view'],
    'verein.events.cancel': ['events.view'],
    'events.create': ['gallery.view'],
    'events.edit': ['gallery.view'],
};

/** The reading permission a permission of that category needs. */
function viewPermissionFor(permissionName: string): string {
    if (permissionName.startsWith('verein.')) {
        const parts = permissionName.split('.');
        return parts.length >= 2 ? `${parts[1]}.view` : 'events.view';
    }
    return `${permissionName.split('.')[0]}.view`;
}

/** A permission plus the reading and cross-category keys it depends on. */
function expandPermission(base: string[], permissionName: string): string[] {
    const sanitized = base.filter((permission) => permission !== '*');
    const additions: string[] = [permissionName];

    if (!permissionName.endsWith('.view')) {
        const viewPermission = viewPermissionFor(permissionName);
        if (!sanitized.includes(viewPermission)) {
            additions.push(viewPermission);
        }
    }

    for (const required of PERMISSION_REQUIRES[permissionName] ?? []) {
        if (!sanitized.includes(required) && !additions.includes(required)) {
            additions.push(required);
        }
    }

    return additions;
}

export default function PermissionsModal({
    user,
    isOpen,
    onClose,
    onSuccess,
}: PermissionsModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    const [permissions, setPermissions] = useState<
        Record<string, Permission[]>
    >({});
    const [rolePermissions, setRolePermissions] = useState<string[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
        user.customPermissions || [],
    );
    const [selectedVereinId, setSelectedVereinId] = useState<string>(
        user.vereinId || '',
    );
    const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>(
        user.roleId,
    );
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [loadError, setLoadError] = useState(false);
    const [search, setSearch] = useState('');
    const [pendingRoleRemoval, setPendingRoleRemoval] = useState<string | null>(
        null,
    );
    const [rolePermissionsLoaded, setRolePermissionsLoaded] = useState(false);

    const loadRoles = async () => {
        try {
            setIsLoadingRoles(true);
            const response = await fetch('/api/admin/roles');
            if (response.ok) {
                const data = await response.json();
                setRoles(data.roles);
            }
        } catch (loadRolesError) {
            console.error('Error loading roles:', loadRolesError);
        } finally {
            setIsLoadingRoles(false);
        }
    };

    const loadPermissions = async () => {
        try {
            setIsLoading(true);
            setLoadError(false);
            const response = await fetch('/api/admin/permissions');
            if (response.ok) {
                const data = await response.json();
                setPermissions(data.permissions);
            } else {
                setLoadError(true);
            }
        } catch (loadPermissionsError) {
            console.error('Error loading permissions:', loadPermissionsError);
            setLoadError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        loadPermissions();
        loadRoles();
        setRolePermissionsLoaded(false);

        (async () => {
            try {
                const response = await fetch(
                    `/api/admin/users/${user.id}/role-permissions`,
                );
                if (response.ok) {
                    const data = await response.json();
                    setRolePermissions(data.rolePermissions || []);
                }
            } catch (rolePermissionsError) {
                console.error(
                    'Error loading role permissions:',
                    rolePermissionsError,
                );
            } finally {
                setRolePermissionsLoaded(true);
            }
        })();

        setSelectedPermissions(user.customPermissions || []);
        setSelectedVereinId(user.vereinId || '');
        setSelectedRoleId(user.roleId);
        setSearch('');
        setError('');
    }, [isOpen, user]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    const rolePermissionsSet = useMemo(
        () => new Set(rolePermissions),
        [rolePermissions],
    );

    const uniqueSelectedPermissions = useMemo(
        () => Array.from(new Set(selectedPermissions)),
        [selectedPermissions],
    );

    const hasWildcard = uniqueSelectedPermissions.includes('*');

    const totalSelectedCount = uniqueSelectedPermissions.length;

    const extraPermissionsCount = rolePermissionsLoaded
        ? uniqueSelectedPermissions.filter(
              (permission) => !rolePermissionsSet.has(permission),
          ).length
        : 0;

    const isPermissionFromRole = (permissionName: string) =>
        rolePermissionsSet.has(permissionName);

    const getPermissionDetails = (
        permissionName: string,
    ): Permission | null => {
        for (const perms of Object.values(permissions)) {
            const match = perms.find((perm) => perm.name === permissionName);
            if (match) return match;
        }
        return null;
    };

    const handleTogglePermission = (
        permissionName: string,
        options?: { forceRemove?: boolean },
    ) => {
        if (permissionName === '*') {
            setSelectedPermissions((prev) => {
                const alreadySelected = prev.includes('*');

                if (alreadySelected) {
                    const isFromRole = rolePermissionsSet.has('*');
                    if (isFromRole && !options?.forceRemove) {
                        setPendingRoleRemoval('*');
                        return prev;
                    }
                    return prev.filter((permission) => permission !== '*');
                }

                return ['*'];
            });
            return;
        }

        setSelectedPermissions((prev) => {
            if (prev.includes(permissionName)) {
                const isFromRole = rolePermissionsSet.has(permissionName);

                if (isFromRole && !options?.forceRemove) {
                    setPendingRoleRemoval(permissionName);
                    return prev;
                }

                if (permissionName.endsWith('.view')) {
                    const [category] = permissionName.split('.');
                    let filtered = prev.filter(
                        (permission) =>
                            !permission.startsWith(`${category}.`),
                    );

                    const dependentPermissions =
                        PERMISSION_DEPENDENCIES[permissionName] || [];
                    filtered = filtered.filter(
                        (permission) =>
                            !dependentPermissions.includes(permission),
                    );

                    return filtered;
                }
                return prev.filter(
                    (permission) => permission !== permissionName,
                );
            }

            const sanitizedPrev = prev.filter(
                (permission) => permission !== '*',
            );
            return [
                ...sanitizedPrev,
                ...expandPermission(sanitizedPrev, permissionName),
            ];
        });
    };

    const applyGroup = (names: string[], mode: 'all' | 'none') => {
        if (hasWildcard) return;

        if (mode === 'all') {
            if (names.includes('*')) {
                setSelectedPermissions(['*']);
                return;
            }
            setSelectedPermissions((prev) => {
                let next = prev.filter((permission) => permission !== '*');
                for (const name of names) {
                    next = [...next, ...expandPermission(next, name)];
                }
                return Array.from(new Set(next));
            });
            return;
        }

        setSelectedPermissions((prev) => {
            let next = prev.filter(
                (permission) =>
                    permission !== '*' && !names.includes(permission),
            );
            for (const name of names) {
                if (name.endsWith('.view')) {
                    const dependents = PERMISSION_DEPENDENCIES[name] || [];
                    next = next.filter(
                        (permission) => !dependents.includes(permission),
                    );
                }
            }
            return next;
        });
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError('');

            const response = await fetch(
                `/api/admin/users/${user.id}/permissions`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roleId: selectedRoleId || null,
                        customPermissions: selectedPermissions,
                        vereinId: selectedVereinId || null,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Failed to update permissions');
            }

            onSuccess();
            onClose();
        } catch (saveError) {
            console.error('Error saving permissions:', saveError);
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

    const query = search.trim().toLowerCase();

    const visibleGroups = useMemo(() => {
        return Object.entries(permissions)
            .map(([category, perms]) => ({
                category,
                perms: perms.filter(
                    (permission) =>
                        !query ||
                        permission.name.toLowerCase().includes(query) ||
                        permission.displayName
                            .toLowerCase()
                            .includes(query) ||
                        (permission.description ?? '')
                            .toLowerCase()
                            .includes(query) ||
                        (CATEGORY_NAMES[category] ?? category)
                            .toLowerCase()
                            .includes(query),
                ),
            }))
            .filter((group) => group.perms.length > 0);
    }, [permissions, query]);

    const pendingPermissionDetails = pendingRoleRemoval
        ? getPermissionDetails(pendingRoleRemoval)
        : null;

    if (!isOpen) return null;

    return (
        <>
            <dialog
                ref={dialogRef}
                className={`dialog ${styles.dialogWide}`}
                aria-labelledby={titleId}
                onKeyDown={trapDialogTab}
                onCancel={(event) => {
                    event.preventDefault();
                    if (!isSaving) onClose();
                }}
                onClick={(event) => {
                    if (event.target === dialogRef.current && !isSaving) {
                        onClose();
                    }
                }}
            >
                <div className="dialog-head">
                    <div>
                        <h2 id={titleId}>Benutzer und Berechtigungen</h2>
                        <p className={styles.dialogSub}>
                            {user.username}
                            {user.roleDisplayName
                                ? ` · Rolle: ${user.roleDisplayName}`
                                : ''}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="dialog-close"
                        aria-label="Dialog schließen"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        ×
                    </button>
                </div>

                <div className={`dialog-body ${styles.dialogBody}`}>
                    <div className="form-row">
                        <div className="field">
                            <label htmlFor="permissions-role">Rolle</label>
                            {isLoadingRoles ? (
                                <p className={styles.sub}>
                                    Rollen werden geladen …
                                </p>
                            ) : (
                                <select
                                    className="select"
                                    id="permissions-role"
                                    value={selectedRoleId ?? ''}
                                    onChange={(event) =>
                                        setSelectedRoleId(
                                            event.target.value
                                                ? Number(event.target.value)
                                                : undefined,
                                        )
                                    }
                                >
                                    <option value="">Keine Rolle</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.displayName}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <p className="hint">
                                Die Rolle ist eine Vorlage und vergibt keine
                                Rechte von selbst.
                            </p>
                        </div>
                        <div className="field">
                            <label htmlFor="permissions-verein">Verein</label>
                            <select
                                className="select"
                                id="permissions-verein"
                                value={selectedVereinId}
                                onChange={(event) =>
                                    setSelectedVereinId(event.target.value)
                                }
                            >
                                <option value="">Kein Verein</option>
                                {VEREINE.map((verein) => (
                                    <option key={verein.id} value={verein.id}>
                                        {verein.name}
                                    </option>
                                ))}
                            </select>
                            <p className="hint">
                                Bindet Vereinsrechte an einen Verein.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div
                            className="notice notice--error"
                            role="alert"
                            style={{ marginTop: 'var(--s4)' }}
                        >
                            <strong>Nicht gespeichert</strong>
                            <span>{error}</span>
                        </div>
                    )}

                    {loadError && (
                        <div
                            className="notice notice--error"
                            role="alert"
                            style={{ marginTop: 'var(--s4)' }}
                        >
                            <strong>Berechtigungen nicht geladen</strong>
                            <span>
                                Der Katalog konnte nicht abgerufen werden.
                            </span>
                        </div>
                    )}

                    <div
                        className="notice"
                        style={{ marginTop: 'var(--s4)' }}
                    >
                        <strong>Standard der Rolle</strong>
                        <span>
                            Mit „Standard“ markierte Rechte gehören zur Rolle.
                            Sie können sie einzeln entfernen oder zusätzliche
                            Rechte setzen. „Alle Berechtigungen“ schaltet den
                            gesamten Katalog frei.
                        </span>
                    </div>

                    <div className={styles.searchRow} style={{ marginTop: 'var(--s4)' }}>
                        <div className="field" style={{ flex: '1 1 240px' }}>
                            <label htmlFor="permissions-search">
                                Berechtigungen durchsuchen
                            </label>
                            <input
                                className="input"
                                id="permissions-search"
                                type="search"
                                placeholder="Name, Schlüssel oder Gruppe"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>
                        {search && (
                            <button
                                type="button"
                                className="btn btn--sm btn--quiet"
                                onClick={() => setSearch('')}
                            >
                                Zurücksetzen
                            </button>
                        )}
                        <p className={styles.permCount} role="status">
                            {hasWildcard
                                ? 'Alle Berechtigungen gesetzt'
                                : `${totalSelectedCount} ${
                                      totalSelectedCount === 1
                                          ? 'Berechtigung'
                                          : 'Berechtigungen'
                                  } gesetzt`}
                        </p>
                    </div>

                    {isLoading ? (
                        <p className="muted">
                            Berechtigungen werden geladen …
                        </p>
                    ) : loadError ? (
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={loadPermissions}
                        >
                            Erneut laden
                        </button>
                    ) : visibleGroups.length === 0 ? (
                        <div className="admin-empty">
                            <p>Keine Berechtigung passt zu dieser Suche.</p>
                            <button
                                type="button"
                                className="btn btn--sm btn--quiet"
                                onClick={() => setSearch('')}
                            >
                                Suche zurücksetzen
                            </button>
                        </div>
                    ) : (
                        visibleGroups.map(({ category, perms }) => {
                            const names = perms.map(
                                (permission) => permission.name,
                            );
                            const chosen = hasWildcard
                                ? perms.length
                                : names.filter((name) =>
                                      uniqueSelectedPermissions.includes(name),
                                  ).length;

                            return (
                                <section
                                    className={styles.permGroup}
                                    key={category}
                                    aria-labelledby={`permission-group-${category}`}
                                >
                                    <div className={styles.permGroupHead}>
                                        <h3
                                            className={styles.permGroupTitle}
                                            id={`permission-group-${category}`}
                                        >
                                            {CATEGORY_NAMES[category] ??
                                                category}
                                        </h3>
                                        <div className={styles.permTools}>
                                            <span className={styles.permCount}>
                                                {chosen} von {perms.length}
                                            </span>
                                            <button
                                                type="button"
                                                className="btn btn--sm btn--quiet"
                                                onClick={() =>
                                                    applyGroup(names, 'all')
                                                }
                                                disabled={hasWildcard}
                                                aria-label={`Alle Berechtigungen der Gruppe ${
                                                    CATEGORY_NAMES[category] ??
                                                    category
                                                } setzen`}
                                            >
                                                Alle
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn--sm btn--quiet"
                                                onClick={() =>
                                                    applyGroup(names, 'none')
                                                }
                                                disabled={hasWildcard}
                                                aria-label={`Alle Berechtigungen der Gruppe ${
                                                    CATEGORY_NAMES[category] ??
                                                    category
                                                } entfernen`}
                                            >
                                                Keine
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.permList}>
                                        {perms.map((permission) => {
                                            const isFromRole =
                                                isPermissionFromRole(
                                                    permission.name,
                                                );
                                            const isWildcardPermission =
                                                permission.name === '*';
                                            const isDisabled =
                                                hasWildcard &&
                                                !isWildcardPermission;

                                            return (
                                                <div
                                                    className={styles.permRow}
                                                    key={permission.id}
                                                >
                                                    <label
                                                        className="check"
                                                        htmlFor={`permission-${permission.id}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id={`permission-${permission.id}`}
                                                            checked={
                                                                isWildcardPermission
                                                                    ? hasWildcard
                                                                    : hasWildcard ||
                                                                      uniqueSelectedPermissions.includes(
                                                                          permission.name,
                                                                      )
                                                            }
                                                            disabled={isDisabled}
                                                            onChange={() =>
                                                                handleTogglePermission(
                                                                    permission.name,
                                                                )
                                                            }
                                                        />
                                                        <span
                                                            className={
                                                                styles.permText
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    styles.permName
                                                                }
                                                            >
                                                                {
                                                                    permission.displayName
                                                                }
                                                                {isFromRole && (
                                                                    <span className="stamp stamp--draft">
                                                                        Standard
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <span
                                                                className={
                                                                    styles.permKey
                                                                }
                                                            >
                                                                {permission.name}
                                                            </span>
                                                            {permission.description && (
                                                                <span
                                                                    className={
                                                                        styles.permDesc
                                                                    }
                                                                >
                                                                    {
                                                                        permission.description
                                                                    }
                                                                </span>
                                                            )}
                                                        </span>
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            );
                        })
                    )}
                </div>

                <div
                    className="dialog-foot"
                    style={{ justifyContent: 'space-between' }}
                >
                    <span className={styles.sub}>
                        {hasWildcard
                            ? 'Alle Berechtigungen sind gesetzt.'
                            : `${totalSelectedCount} gesetzt · ${extraPermissionsCount} zusätzlich zur Rolle`}
                    </span>
                    <span
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 'var(--s2)',
                        }}
                    >
                        <button
                            type="button"
                            className="btn btn--quiet"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Abbrechen
                        </button>
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={handleSave}
                            disabled={isSaving || isLoading}
                        >
                            {isSaving ? 'Speichern …' : 'Speichern'}
                        </button>
                    </span>
                </div>
            </dialog>

            <ConfirmDialog
                open={Boolean(pendingRoleRemoval)}
                title="Standard-Berechtigung entfernen?"
                description={`„${
                    pendingPermissionDetails?.displayName ??
                    pendingRoleRemoval ??
                    ''
                }“ gehört zu den Standardrechten der Rolle ${
                    user.roleDisplayName || user.roleName
                }. Wirklich entfernen?`}
                confirmLabel="Entfernen"
                cancelLabel="Behalten"
                danger
                onConfirm={handleConfirmRoleRemoval}
                onCancel={() => setPendingRoleRemoval(null)}
            />
        </>
    );
}
