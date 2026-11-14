'use client';

import { useEffect, useId, useRef, useState } from 'react';
import styles from '../users.module.css';
import { trapDialogTab } from '@/app/admin/contacts/components/dialog-focus';

/**
 * One-time display of a freshly generated admin password.
 */
export default function PasswordDialog({
    title,
    username,
    password,
    onClose,
}: {
    title: string;
    username: string;
    password: string;
    onClose: () => void;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const dialog = ref.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    return (
        <dialog
            ref={ref}
            className="dialog"
            aria-labelledby={titleId}
            onKeyDown={trapDialogTab}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
        >
            <div className="dialog-head">
                <div>
                    <h2 id={titleId}>{title}</h2>
                    <p className={styles.dialogSub}>
                        Zugangsdaten einmalig notieren
                    </p>
                </div>
                <button
                    type="button"
                    className="dialog-close"
                    aria-label="Dialog schließen"
                    onClick={onClose}
                >
                    ×
                </button>
            </div>

            <div className="dialog-body">
                <div className="notice notice--ok" role="status">
                    <strong>Das Passwort wurde zurückgesetzt</strong>
                    <span>
                        Der Benutzer muss es beim nächsten Login ändern.
                    </span>
                </div>

                <div className={styles.secret} style={{ marginTop: 'var(--s4)' }}>
                    <span className={styles.sub}>Benutzername</span>
                    <span className={styles.secretValue}>{username}</span>
                    <span className={styles.sub}>
                        Neues temporäres Passwort (6-stellig)
                    </span>
                    <div className={styles.secretRow}>
                        <span className={styles.secretValue}>{password}</span>
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={async () => {
                                await navigator.clipboard.writeText(password);
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
                        Geben Sie das Passwort auf einem sicheren Weg weiter.
                        Nach dem Schließen dieses Dialogs ist es nicht mehr
                        abrufbar.
                    </span>
                </div>
            </div>

            <div className="dialog-foot">
                <button type="button" className="btn btn--primary" onClick={onClose}>
                    Schließen
                </button>
            </div>
        </dialog>
    );
}
