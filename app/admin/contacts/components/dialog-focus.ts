'use client';

import type { KeyboardEvent } from 'react';

const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keep Tab and Shift+Tab inside a native <dialog>. showModal already makes the
 * page inert; this closes the browser-chrome gap at both ends.
 */
export function trapDialogTab(
    event: KeyboardEvent<HTMLDialogElement>,
): void {
    if (event.key !== 'Tab') return;

    const dialog = event.currentTarget;
    const items = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((element) => element.getClientRects().length > 0);

    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const inside = active ? dialog.contains(active) : false;

    if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault();
        first.focus();
    } else if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault();
        last.focus();
    }
}
