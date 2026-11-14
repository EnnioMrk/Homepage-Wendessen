'use client';

import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE =
    'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Modal behaviour for the gallery dialogs: focus moves into the dialog, Tab
 * cycles inside it, Escape closes, and focus returns to the element that
 * opened it. The element with `data-autofocus` (or the first control) gets the
 * focus on mount.
 */
export function useDialog(
    containerRef: RefObject<HTMLElement | null>,
    onClose: () => void,
) {
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        const container = containerRef.current;
        const previous = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const focusables = () =>
            Array.from(
                container?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
            ).filter((element) => !element.closest('[inert]'));

        const initial =
            container?.querySelector<HTMLElement>('[data-autofocus]') ??
            focusables()[0];
        initial?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onCloseRef.current();
                return;
            }

            if (event.key !== 'Tab') return;

            const items = focusables();
            if (items.length === 0) {
                event.preventDefault();
                return;
            }

            const first = items[0];
            const last = items[items.length - 1];
            const active = document.activeElement;

            if (event.shiftKey) {
                if (active === first || !container?.contains(active)) {
                    event.preventDefault();
                    last.focus();
                }
            } else if (active === last || !container?.contains(active)) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previous?.focus?.();
        };
    }, [containerRef]);
}
