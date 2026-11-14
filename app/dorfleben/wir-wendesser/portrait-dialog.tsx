'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import styles from './portrait.module.css';

/**
 * A native <dialog> in the register's clothes. The platform supplies the
 * focus trap, the Escape key and the backdrop; we only lock the page scroll
 * and hand the close request back to the page.
 */
export default function PortraitDialog({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
        }
        if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const previous = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = previous;
        };
    }, [open]);

    if (!open) return null;

    return (
        <dialog
            ref={ref}
            className={styles.dialog}
            aria-label={title}
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className={styles.dialogHead}>
                <h2>{title}</h2>
                <button
                    type="button"
                    className="btn btn--quiet btn--sm"
                    onClick={onClose}
                >
                    Schließen
                </button>
            </div>
            <div className={styles.dialogBody}>{children}</div>
        </dialog>
    );
}
