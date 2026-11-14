'use client';

import { useEffect, useId, useRef } from 'react';
import { trapDialogTab } from './dialog-focus';

/**
 * A native dialog for destructive confirmations. showModal keeps the focus
 * inside, Escape cancels, and the click on the backdrop closes it.
 */
export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Bestätigen',
    cancelLabel = 'Abbrechen',
    danger = false,
    busy = false,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={ref}
            className="dialog"
            aria-labelledby={titleId}
            onKeyDown={trapDialogTab}
            onCancel={(event) => {
                event.preventDefault();
                if (!busy) onCancel();
            }}
            onClick={(event) => {
                if (event.target === ref.current && !busy) onCancel();
            }}
        >
            <div className="dialog-head">
                <h2 id={titleId}>{title}</h2>
            </div>
            <div className="dialog-body">
                <p>{description}</p>
            </div>
            <div className="dialog-foot">
                <button
                    type="button"
                    className="btn btn--quiet"
                    onClick={onCancel}
                    disabled={busy}
                >
                    {cancelLabel}
                </button>
                <button
                    type="button"
                    className={danger ? 'btn btn--danger' : 'btn btn--primary'}
                    onClick={onConfirm}
                    disabled={busy}
                >
                    {busy ? 'Einen Moment …' : confirmLabel}
                </button>
            </div>
        </dialog>
    );
}
