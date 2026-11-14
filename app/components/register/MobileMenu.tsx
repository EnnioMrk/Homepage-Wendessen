'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { REGISTER_NAV } from './nav-data';

/**
 * Mobile navigation: a native <details> panel, no JavaScript required to open.
 * JS only closes the panel after a navigation and keeps the page from scrolling
 * behind it.
 */
export function MobileMenu() {
    const detailsRef = useRef<HTMLDetailsElement>(null);

    useEffect(() => {
        const el = detailsRef.current;
        if (!el) return;

        const close = () => {
            el.open = false;
            document.body.style.overflow = '';
        };

        const onToggle = () => {
            document.body.style.overflow = el.open ? 'hidden' : '';
        };

        el.addEventListener('toggle', onToggle);
        el.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));

        return () => {
            el.removeEventListener('toggle', onToggle);
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <details className="spine-menu" ref={detailsRef}>
            <summary>Register</summary>
            <div className="mobile-menu">
                <div className="wrap">
                    <form
                        className="mobile-search"
                        action="/suche"
                        method="get"
                        role="search"
                    >
                        <label className="visually-hidden" htmlFor="q-mobile">
                            Im Register suchen
                        </label>
                        <input
                            id="q-mobile"
                            name="q"
                            type="search"
                            placeholder="Im Register suchen …"
                            autoComplete="off"
                        />
                    </form>
                    <Link href="/">Startseite</Link>
                    {REGISTER_NAV.map((section) => (
                        <div key={section.href}>
                            <Link href={section.href}>{section.label}</Link>
                            {section.groups?.map((group) =>
                                group.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        style={{ paddingLeft: 16 }}
                                    >
                                        {item.label}
                                    </Link>
                                )),
                            )}
                        </div>
                    ))}
                    <Link href="/admin">Redaktion</Link>
                </div>
            </div>
        </details>
    );
}
