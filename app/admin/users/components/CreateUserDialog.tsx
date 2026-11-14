'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from '../users.module.css';
import { trapDialogTab } from '@/app/admin/contacts/components/dialog-focus';
import { ASSOCIATIONS } from '@/lib/constants/associations';

interface Role {
    id: number;
    name: string;
    displayName: string;
    description?: string;
}

const VEREINE = ASSOCIATIONS.map((association) => ({
    id: association.id,
    name: association.title,
}));

/**
 * Create a keeper account. The generated 6-digit password is shown once,
 * in the same dialog, and never again.
 */
export default function CreateUserDialog({
    onClose,
    onSuccess,
}: {
    onClose: () => void;
    onSuccess: () => void;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    const [username, setUsername] = useState('');
    const [selectedRoleId, setSelectedRoleId] = useState<number | undefined>(
        undefined,
    );
    const [selectedVereinId, setSelectedVereinId] = useState('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [rolesError, setRolesError] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [initialPassword, setInitialPassword] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const dialog = ref.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const response = await fetch('/api/admin/roles');
                if (response.ok) {
                    const data = await response.json();
                    setRoles(data.roles);
                    const defaultRole = data.roles.find(
                        (role: Role) => role.name === 'admin',
                    );
                    if (defaultRole) {
                        setSelectedRoleId(defaultRole.id);
                    }
                } else {
                    setRolesError(true);
                }
            } catch (loadError) {
                console.error('Error loading roles:', loadError);
                setRolesError(true);
            } finally {
                setIsLoadingRoles(false);
            }
        };
        loadRoles();
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsCreating(true);
        setError('');

        try {
            const response = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        } catch (createError) {
            console.error('Error creating user:', createError);
            setError(
                createError instanceof Error
                    ? createError.message
                    : 'Fehler beim Erstellen des Benutzers',
            );
        } finally {
            setIsCreating(false);
        }
    };

    const close = () => {
        if (initialPassword) {
            onSuccess();
        }
        onClose();
    };

    return (
        <dialog
            ref={ref}
            className="dialog"
            aria-labelledby={titleId}
            onKeyDown={trapDialogTab}
            onCancel={(event) => {
                event.preventDefault();
                if (!isCreating) close();
            }}
        >
            <div className="dialog-head">
                <div>
                    <h2 id={titleId}>
                        {initialPassword ? 'Admin angelegt' : 'Neuer Admin'}
                    </h2>
                    <p className={styles.dialogSub}>
                        {initialPassword
                            ? 'Zugangsdaten einmalig notieren'
                            : 'Benutzername, Rolle und Verein festlegen'}
                    </p>
                </div>
                <button
                    type="button"
                    className="dialog-close"
                    aria-label="Dialog schließen"
                    onClick={close}
                >
                    ×
                </button>
            </div>

            {initialPassword ? (
                <>
                    <div className="dialog-body">
                        <div className="notice notice--ok" role="status">
                            <strong>Der Admin-Benutzer wurde angelegt</strong>
                            <span>
                                Das Anfangspasswort wird nur jetzt angezeigt.
                                Beim ersten Login muss es geändert werden.
                            </span>
                        </div>
                        <div className={styles.secret} style={{ marginTop: 'var(--s4)' }}>
                            <span className={styles.sub}>Benutzername</span>
                            <span className={styles.secretValue}>
                                {username}
                            </span>
                            <span className={styles.sub}>
                                Anfangspasswort (6-stellig)
                            </span>
                            <div className={styles.secretRow}>
                                <span className={styles.secretValue}>
                                    {initialPassword}
                                </span>
                                <button
                                    type="button"
                                    className="btn btn--sm btn--quiet"
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(
                                            initialPassword,
                                        );
                                        setCopied(true);
                                    }}
                                >
                                    {copied ? 'Kopiert' : 'Kopieren'}
                                </button>
                            </div>
                        </div>
                        <div
                            className="notice notice--warn"
                            style={{ marginTop: 'var(--s4)' }}
                        >
                            <strong>Weitergabe</strong>
                            <span>
                                Geben Sie die Zugangsdaten auf einem sicheren
                                Weg weiter. Nach dem Schließen dieses Dialogs
                                ist das Passwort nicht mehr abrufbar.
                            </span>
                        </div>
                    </div>
                    <div className="dialog-foot">
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={close}
                        >
                            Schließen
                        </button>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="dialog-body">
                        {error && (
                            <div
                                className="notice notice--error"
                                role="alert"
                                style={{ marginBottom: 'var(--s4)' }}
                            >
                                <strong>Nicht angelegt</strong>
                                <span>{error}</span>
                            </div>
                        )}

                        {rolesError && (
                            <div
                                className="notice notice--warn"
                                style={{ marginBottom: 'var(--s4)' }}
                            >
                                <strong>Rollen nicht geladen</strong>
                                <span>
                                    Der Benutzer wird ohne Rolle angelegt und
                                    erhält keine Berechtigungen.
                                </span>
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="new-username">
                                    Benutzername *
                                </label>
                                <input
                                    className="input"
                                    id="new-username"
                                    type="text"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(event.target.value)
                                    }
                                    required
                                    pattern="[a-zA-Z0-9_-]+"
                                    autoComplete="off"
                                    placeholder="z. B. max.mustermann"
                                />
                                <p className="hint">
                                    Nur Buchstaben, Zahlen, Unterstriche und
                                    Bindestriche.
                                </p>
                            </div>

                            <div className="form-row">
                                <div className="field">
                                    <label htmlFor="new-role">Rolle</label>
                                    {isLoadingRoles ? (
                                        <p className={styles.sub}>
                                            Rollen werden geladen …
                                        </p>
                                    ) : (
                                        <select
                                            className="select"
                                            id="new-role"
                                            value={selectedRoleId ?? ''}
                                            onChange={(event) =>
                                                setSelectedRoleId(
                                                    event.target.value
                                                        ? Number(
                                                              event.target.value,
                                                          )
                                                        : undefined,
                                                )
                                            }
                                        >
                                            <option value="">Keine Rolle</option>
                                            {roles.map((role) => (
                                                <option
                                                    key={role.id}
                                                    value={role.id}
                                                >
                                                    {role.displayName}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    <p className="hint">
                                        Bestimmt die Grundberechtigungen des
                                        Benutzers.
                                    </p>
                                </div>

                                <div className="field">
                                    <label htmlFor="new-verein">
                                        Verein (optional)
                                    </label>
                                    <select
                                        className="select"
                                        id="new-verein"
                                        value={selectedVereinId}
                                        onChange={(event) =>
                                            setSelectedVereinId(
                                                event.target.value,
                                            )
                                        }
                                    >
                                        <option value="">Kein Verein</option>
                                        {VEREINE.map((verein) => (
                                            <option
                                                key={verein.id}
                                                value={verein.id}
                                            >
                                                {verein.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="hint">
                                        Bindet Vereinsrechte an diesen Verein.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div
                            className="notice"
                            style={{ marginTop: 'var(--s4)' }}
                        >
                            <strong>Anfangspasswort</strong>
                            <span>
                                Ein 6-stelliges Passwort wird automatisch
                                erzeugt und nach dem Anlegen einmal angezeigt.
                            </span>
                        </div>
                    </div>

                    <div className="dialog-foot">
                        <button
                            type="button"
                            className="btn btn--quiet"
                            onClick={close}
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={isCreating}
                        >
                            {isCreating ? 'Anlegen …' : 'Admin anlegen'}
                        </button>
                    </div>
                </form>
            )}
        </dialog>
    );
}
