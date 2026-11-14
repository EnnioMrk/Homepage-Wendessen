'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminHead, Panel, Stat } from '@/app/components/admin/AdminPage';
import PermissionsModal from '@/app/components/PermissionsModal';
import ConfirmDialog from '@/app/admin/contacts/components/ConfirmDialog';
import CreateUserDialog from './components/CreateUserDialog';
import PasswordDialog from './components/PasswordDialog';
import styles from './users.module.css';
import { AdminUserRecord } from '@/lib/database';
import { usePermissions } from '@/lib/usePermissions';
import { ASSOCIATIONS_MAP } from '@/lib/constants/associations';
import { dateShort } from '@/app/lib/register-format';

const VEREINE_MAP: Record<string, string> = ASSOCIATIONS_MAP;

export default function AdminUsersClient() {
    const { hasPermission, loading: permissionsLoading } = usePermissions();
    const [users, setUsers] = useState<AdminUserRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [createOpen, setCreateOpen] = useState(false);
    const [permissionsUser, setPermissionsUser] =
        useState<AdminUserRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminUserRecord | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const [resetTarget, setResetTarget] = useState<AdminUserRecord | null>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [passwordData, setPasswordData] = useState<{
        username: string;
        password: string;
    } | null>(null);

    const canCreate = !permissionsLoading && hasPermission('users.create');
    const canEdit = !permissionsLoading && hasPermission('users.edit');
    const canDelete = !permissionsLoading && hasPermission('users.delete');

    const loadUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/users');

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.users);
            setError('');
        } catch (loadError) {
            console.error('Error loading users:', loadError);
            setError('Die Benutzer konnten nicht geladen werden.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const vereinName = (vereinId?: string) =>
        vereinId ? VEREINE_MAP[vereinId] || vereinId : '';

    const getExtraPermissionsCount = (user: AdminUserRecord): number => {
        const defaults = user.roleDefaultPermissions;
        if (!defaults) return 0;

        const defaultSet = new Set(defaults);
        const uniqueCustom = Array.from(new Set(user.customPermissions || []));
        return uniqueCustom.filter((permission) => !defaultSet.has(permission))
            .length;
    };

    const filteredUsers = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return [...users]
            .filter(
                (user) =>
                    !query ||
                    user.username.toLowerCase().includes(query) ||
                    (user.roleDisplayName ?? '')
                        .toLowerCase()
                        .includes(query) ||
                    (user.roleName ?? '').toLowerCase().includes(query) ||
                    (user.vereinId ?? '').toLowerCase().includes(query) ||
                    (VEREINE_MAP[user.vereinId ?? ''] ?? '')
                        .toLowerCase()
                        .includes(query),
            )
            .sort((a, b) => a.username.localeCompare(b.username, 'de'));
    }, [users, searchQuery]);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        setIsDeleting(true);
        try {
            const response = await fetch(
                `/api/admin/users/${deleteTarget.id}`,
                { method: 'DELETE' },
            );

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                const message: string = data.error || '';
                throw new Error(
                    /last admin/i.test(message)
                        ? 'Der letzte Admin kann nicht gelöscht werden.'
                        : message ||
                              'Fehler beim Löschen des Benutzers',
                );
            }

            setNotice(
                `Der Benutzer „${deleteTarget.username}“ wurde gelöscht.`,
            );
            setDeleteTarget(null);
            await loadUsers();
        } catch (deleteError) {
            console.error('Error deleting user:', deleteError);
            setError(
                deleteError instanceof Error
                    ? deleteError.message
                    : 'Fehler beim Löschen des Benutzers',
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleResetConfirm = async () => {
        if (!resetTarget) return;

        setIsResetting(true);
        try {
            const response = await fetch('/api/admin/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: resetTarget.id }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to reset password');
            }

            setPasswordData({
                password: data.initialPassword,
                username: data.username,
            });
            setResetTarget(null);
            await loadUsers();
        } catch (resetError) {
            console.error('Error resetting password:', resetError);
            setError(
                resetError instanceof Error
                    ? resetError.message
                    : 'Fehler beim Zurücksetzen des Passworts',
            );
        } finally {
            setIsResetting(false);
        }
    };

    const mustChangeCount = users.filter(
        (user) => user.mustChangePassword,
    ).length;
    const vereinBoundCount = users.filter((user) => user.vereinId).length;

    const head = (
        <AdminHead
            title="Benutzer"
            sub="Zugänge, Rollen und Berechtigungen der Redaktion"
            actions={
                canCreate ? (
                    <button
                        type="button"
                        className="btn btn--sm btn--primary"
                        onClick={() => setCreateOpen(true)}
                    >
                        Neuer Admin
                    </button>
                ) : null
            }
        />
    );

    if (isLoading) {
        return (
            <div>
                {head}
                <div className="panel">
                    <div className="panel-body">
                        <p className="muted">Benutzer werden geladen …</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {head}

            <div className="stat-grid">
                <Stat label="Benutzer" value={users.length} note="Zugänge" />
                <Stat
                    label="Wechsel offen"
                    value={mustChangeCount}
                    note="Passwort beim nächsten Login"
                />
                <Stat
                    label="Vereinsgebunden"
                    value={vereinBoundCount}
                    note="mit Vereinsbezug"
                />
            </div>

            {notice && (
                <div
                    className="notice notice--ok"
                    role="status"
                    style={{ marginTop: 'var(--s4)' }}
                >
                    <strong>Ausgeführt</strong>
                    <span>{notice}</span>
                </div>
            )}

            {error && (
                <div
                    className="notice notice--error"
                    role="alert"
                    style={{ marginTop: 'var(--s4)' }}
                >
                    <strong>Benutzer nicht vollständig verfügbar</strong>
                    <span>{error}</span>
                    <span>
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={loadUsers}
                        >
                            Erneut laden
                        </button>
                    </span>
                </div>
            )}

            <div className="admin-filter">
                <div className="field" style={{ flex: '1 1 260px' }}>
                    <label htmlFor="user-search">Suche</label>
                    <input
                        className="input"
                        id="user-search"
                        type="search"
                        placeholder="Benutzername, Rolle, Verein"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(event.target.value)
                        }
                    />
                </div>
                {searchQuery && (
                    <button
                        type="button"
                        className="btn btn--sm btn--quiet"
                        onClick={() => setSearchQuery('')}
                    >
                        Zurücksetzen
                    </button>
                )}
            </div>

            <Panel
                title="Zugänge"
                flush
                actions={
                    filteredUsers.length === users.length ? undefined : (
                        <span className={styles.sub}>
                            {filteredUsers.length} von {users.length}
                        </span>
                    )
                }
            >
                {filteredUsers.length === 0 ? (
                    <p className="admin-empty">
                        {users.length === 0
                            ? 'Noch kein Benutzer verzeichnet.'
                            : 'Kein Benutzer passt zu dieser Suche.'}
                    </p>
                ) : (
                    <div className={styles.scroll}>
                        <table
                            className={`data ${styles.table}`}
                            aria-label="Admin-Benutzer"
                        >
                            <thead>
                                <tr>
                                    <th scope="col">Benutzer</th>
                                    <th scope="col" className={styles.colRole}>
                                        Rolle
                                    </th>
                                    <th scope="col" className={styles.colVerein}>
                                        Verein
                                    </th>
                                    <th scope="col" className={styles.colLogin}>
                                        Letzter Login
                                    </th>
                                    <th scope="col" className={styles.colStatus}>
                                        Status
                                    </th>
                                    {(canEdit || canDelete) && (
                                        <th scope="col" className="right">
                                            Aktionen
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => {
                                    const extra = getExtraPermissionsCount(user);
                                    return (
                                        <tr key={user.id}>
                                            <td>
                                                <div
                                                    className={styles.nameCell}
                                                >
                                                    <span
                                                        className={
                                                            styles.nameMain
                                                        }
                                                    >
                                                        {user.username}
                                                    </span>
                                                    <span
                                                        className={styles.meta}
                                                    >
                                                        <span>
                                                            Angelegt am{' '}
                                                            {dateShort(
                                                                new Date(
                                                                    user.createdAt,
                                                                ),
                                                            )}
                                                        </span>
                                                        {extra > 0 && (
                                                            <span>
                                                                {extra}{' '}
                                                                {extra === 1
                                                                    ? 'eigene Berechtigung'
                                                                    : 'eigene Berechtigungen'}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`${styles.inlineMeta} ${styles.roleInline}`}
                                                    >
                                                        Rolle:{' '}
                                                        {user.roleDisplayName ||
                                                            user.roleName ||
                                                            'Keine'}
                                                    </span>
                                                    <span
                                                        className={`${styles.inlineMeta} ${styles.vereinInline}`}
                                                    >
                                                        Verein:{' '}
                                                        {vereinName(
                                                            user.vereinId,
                                                        ) || 'Keiner'}
                                                    </span>
                                                    <span
                                                        className={`${styles.inlineMeta} ${styles.loginInline}`}
                                                    >
                                                        Letzter Login:{' '}
                                                        {user.lastLogin
                                                            ? dateShort(
                                                                  new Date(
                                                                      user.lastLogin,
                                                                  ),
                                                              )
                                                            : 'nie'}
                                                    </span>
                                                    <span
                                                        className={
                                                            styles.statusInline
                                                        }
                                                    >
                                                        {user.mustChangePassword ? (
                                                            <span className="stamp stamp--new">
                                                                Wechsel offen
                                                            </span>
                                                        ) : (
                                                            <span className="stamp">
                                                                Passwort gesetzt
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className={styles.colRole}>
                                                {user.roleDisplayName ||
                                                    user.roleName || (
                                                        <span
                                                            className={
                                                                styles.sub
                                                            }
                                                        >
                                                            —
                                                        </span>
                                                    )}
                                            </td>
                                            <td className={styles.colVerein}>
                                                {user.vereinId ? (
                                                    vereinName(user.vereinId)
                                                ) : (
                                                    <span
                                                        className={
                                                            styles.sub
                                                        }
                                                    >
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className={styles.colLogin}>
                                                {user.lastLogin ? (
                                                    dateShort(
                                                        new Date(
                                                            user.lastLogin,
                                                        ),
                                                    )
                                                ) : (
                                                    <span
                                                        className={
                                                            styles.sub
                                                        }
                                                    >
                                                        noch nie
                                                    </span>
                                                )}
                                            </td>
                                            <td className={styles.colStatus}>
                                                {user.mustChangePassword ? (
                                                    <span className="stamp stamp--new">
                                                        Wechsel offen
                                                    </span>
                                                ) : (
                                                    <span className="stamp">
                                                        Passwort gesetzt
                                                    </span>
                                                )}
                                            </td>
                                            {(canEdit || canDelete) && (
                                                <td className="right">
                                                    <div
                                                        className={
                                                            styles.actions
                                                        }
                                                    >
                                                        {canEdit && (
                                                            <button
                                                                type="button"
                                                                className="btn btn--sm btn--quiet"
                                                                onClick={() =>
                                                                    setPermissionsUser(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                Bearbeiten
                                                            </button>
                                                        )}
                                                        {canEdit && (
                                                            <button
                                                                type="button"
                                                                className="btn btn--sm btn--quiet"
                                                                onClick={() =>
                                                                    setResetTarget(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                Passwort
                                                            </button>
                                                        )}
                                                        {canDelete && (
                                                            <button
                                                                type="button"
                                                                className="btn btn--sm btn--danger"
                                                                onClick={() =>
                                                                    setDeleteTarget(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                Löschen
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            <p className={styles.sub} style={{ marginTop: 'var(--s4)' }}>
                Rollen sind Vorlagen. Wirksam sind allein die einzeln gesetzten
                Berechtigungen.{' '}
                <Link className="link" href="/admin/logs">
                    Änderungen im Protokoll
                </Link>
            </p>

            {createOpen && (
                <CreateUserDialog
                    onClose={() => setCreateOpen(false)}
                    onSuccess={() => {
                        setNotice('Der neue Admin wurde angelegt.');
                        loadUsers();
                    }}
                />
            )}

            {permissionsUser && (
                <PermissionsModal
                    user={permissionsUser}
                    isOpen={!!permissionsUser}
                    onClose={() => setPermissionsUser(null)}
                    onSuccess={() => {
                        setNotice(
                            `Die Berechtigungen von „${permissionsUser.username}“ wurden gespeichert.`,
                        );
                        loadUsers();
                    }}
                />
            )}

            <ConfirmDialog
                open={!!deleteTarget}
                title="Benutzer löschen?"
                description={`Der Zugang „${deleteTarget?.username ?? ''}“ wird dauerhaft entfernt. Der letzte Admin kann nicht gelöscht werden.`}
                confirmLabel="Benutzer löschen"
                danger
                busy={isDeleting}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />

            <ConfirmDialog
                open={!!resetTarget}
                title="Passwort zurücksetzen?"
                description={`Für „${resetTarget?.username ?? ''}“ wird ein neues 6-stelliges Passwort erzeugt. Es wird einmal angezeigt, und der Benutzer muss es beim nächsten Login ändern.`}
                confirmLabel="Passwort zurücksetzen"
                busy={isResetting}
                onConfirm={handleResetConfirm}
                onCancel={() => setResetTarget(null)}
            />

            {passwordData && (
                <PasswordDialog
                    title="Passwort zurückgesetzt"
                    username={passwordData.username}
                    password={passwordData.password}
                    onClose={() => setPasswordData(null)}
                />
            )}
        </div>
    );
}
