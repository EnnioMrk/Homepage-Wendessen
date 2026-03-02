'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { List, X } from '@phosphor-icons/react/dist/ssr';
import { useAdminAuth } from '@/lib/useAdminAuth';

import {
    DORFLEBEN_NAV,
    WOHNEN_BAUEN_NAV,
    KONTAKT_NAV,
    type NavItem,
} from '@/lib/constants/navigation';

const dorflebenItems = DORFLEBEN_NAV;
const wohnenBauenItems = WOHNEN_BAUEN_NAV;
const kontaktItems = KONTAKT_NAV;

const sectionTitleClasses =
    'px-2 pb-1 text-xs font-semibold tracking-[0.12em] text-foreground/70';
const sectionContainerClasses = 'rounded-md border border-border p-2';
const linkClasses =
    'flex items-center justify-between rounded-md px-2 py-2 text-[15px] font-medium text-foreground hover:bg-primary/20 hover:text-primary-dark';

function renderNavTree(
    items: NavItem[],
    onNavigate: () => void,
    level = 1,
    maxDepth = Number.POSITIVE_INFINITY
) {
    const nestedListClasses =
        level === 1
            ? 'space-y-1'
            : 'mt-1 ml-2 space-y-1 border-l border-border pl-2';

    const groupLabelClasses =
        level === 1
            ? 'block rounded-md px-2 py-1 text-sm font-semibold text-foreground'
            : 'block rounded-md px-2 py-1 text-sm font-semibold text-foreground/90';

    return (
        <ul className={nestedListClasses}>
            {items.map((item, index) => {
                const key = `${item.title}-${level}-${index}`;

                return (
                    <li key={key}>
                        {item.href ? (
                            <Link
                                href={item.href}
                                className={linkClasses}
                                onClick={onNavigate}
                            >
                                <span>{item.title}</span>
                                <span
                                    aria-hidden="true"
                                    className="text-base leading-none text-foreground/60"
                                >
                                    ›
                                </span>
                            </Link>
                        ) : (
                            <span className={groupLabelClasses}>{item.title}</span>
                        )}

                        {item.items &&
                            level < maxDepth &&
                            renderNavTree(item.items, onNavigate, level + 1, maxDepth)}
                    </li>
                );
            })}
        </ul>
    );
}

export default function MobileNavbar() {
    const [open, setOpen] = useState(false);
    const { isAuthenticated } = useAdminAuth();

    return (
        <div className="lg:hidden">
            <button
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                onClick={() => setOpen(!open)}
                aria-label="Menü öffnen"
            >
                {open ? (
                    <X size={28} className="text-foreground" />
                ) : (
                    <List size={28} className="text-foreground" />
                )}
            </button>
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/40"
                    onClick={() => setOpen(false)}
                />
            )}
            <nav
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-background shadow-lg transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'
                    }`}
                aria-label="Mobile Navigation"
            >
                <div className="flex items-center justify-center p-4 border-b border-border relative">
                    <span className="font-bold text-lg text-foreground">
                        Menü
                    </span>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Menü schließen"
                        className="absolute right-4"
                    >
                        <X size={24} className="text-foreground" />
                    </button>
                </div>
                <div className="h-[calc(100%-65px)] overflow-y-auto">
                    <ul className="flex flex-col gap-3 p-4">
                        <li>
                            <Link
                                href="/"
                                className={linkClasses}
                                onClick={() => setOpen(false)}
                            >
                                <span>HOME</span>
                                <span
                                    aria-hidden="true"
                                    className="text-base leading-none text-foreground/60"
                                >
                                    ›
                                </span>
                            </Link>
                        </li>

                        <li className={sectionContainerClasses}>
                            <span className={sectionTitleClasses}>DORFLEBEN</span>
                            {renderNavTree(dorflebenItems, () => setOpen(false))}
                        </li>

                        <li className={sectionContainerClasses}>
                            <span className={sectionTitleClasses}>
                                WOHNEN & BAUEN
                            </span>
                            {renderNavTree(wohnenBauenItems, () => setOpen(false), 1, 1)}
                        </li>

                        <li>
                            <Link
                                href="/was-steht-an"
                                className={linkClasses}
                                onClick={() => setOpen(false)}
                            >
                                <span>WAS STEHT AN?</span>
                                <span
                                    aria-hidden="true"
                                    className="text-base leading-none text-foreground/60"
                                >
                                    ›
                                </span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/geschichte"
                                className={linkClasses}
                                onClick={() => setOpen(false)}
                            >
                                <span>GESCHICHTE</span>
                                <span
                                    aria-hidden="true"
                                    className="text-base leading-none text-foreground/60"
                                >
                                    ›
                                </span>
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/impressionen"
                                className={linkClasses}
                                onClick={() => setOpen(false)}
                            >
                                <span>IMPRESSIONEN</span>
                                <span
                                    aria-hidden="true"
                                    className="text-base leading-none text-foreground/60"
                                >
                                    ›
                                </span>
                            </Link>
                        </li>

                        <li className={sectionContainerClasses}>
                            <span className={sectionTitleClasses}>KONTAKT</span>
                            {renderNavTree(kontaktItems, () => setOpen(false), 1, 1)}
                        </li>

                        {/* Admin Dashboard Link - Only show when authenticated */}
                        {isAuthenticated && (
                            <li className="border-t border-border pt-2 mt-2">
                                <Link
                                    href="/admin/dashboard"
                                    className="block py-2 px-2 rounded text-amber-800 bg-amber-100 hover:bg-amber-200 font-semibold"
                                    onClick={() => setOpen(false)}
                                >
                                    ADMIN DASHBOARD
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
}
