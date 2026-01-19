'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { List, X } from '@phosphor-icons/react/dist/ssr';
import { useAdminAuth } from '@/lib/useAdminAuth';

import { DORFLEBEN_NAV, WOHNEN_BAUEN_NAV, KONTAKT_NAV } from '@/lib/constants/navigation';

const dorflebenItems = DORFLEBEN_NAV;
const wohnenBauenItems = WOHNEN_BAUEN_NAV;
const kontaktItems = KONTAKT_NAV;

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
                    <ul className="flex flex-col gap-2 p-4">
                        <li>
                            <Link
                                href="/"
                                className="block py-2 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                onClick={() => setOpen(false)}
                            >
                                HOME
                            </Link>
                        </li>
                        <li>
                            <span className="block py-2 px-2 font-semibold text-foreground">
                                DORFLEBEN
                            </span>
                            <ul className="pl-4">
                                {dorflebenItems.map((item) => (
                                    <React.Fragment key={item.title}>
                                        {item.href ? (
                                            <li>
                                                <Link
                                                    href={item.href}
                                                    className="block py-1 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                                    onClick={() =>
                                                        setOpen(false)
                                                    }
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ) : (
                                            <li className="font-medium py-1 text-foreground">
                                                {item.title}
                                            </li>
                                        )}
                                        {item.items && (
                                            <ul className="pl-4">
                                                {item.items.map((subItem) => (
                                                    <li key={subItem.title}>
                                                        {subItem.href ? (
                                                            <Link
                                                                href={subItem.href}
                                                                className="block py-1 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                                                onClick={() =>
                                                                    setOpen(false)
                                                                }
                                                            >
                                                                {subItem.title}
                                                            </Link>
                                                        ) : (
                                                            <span className="block py-1 px-2 text-foreground font-medium">
                                                                {subItem.title}
                                                            </span>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </React.Fragment>
                                ))}
                            </ul>
                        </li>
                        <li>
                            <span className="block py-2 px-2 font-semibold text-foreground">
                                WOHNEN & BAUEN
                            </span>
                            <ul className="pl-4">
                                {wohnenBauenItems.map((item) => (
                                    <li key={item.title}>
                                        {item.href && (
                                            <Link
                                                href={item.href}
                                                className="block py-1 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                                onClick={() => setOpen(false)}
                                            >
                                                {item.title}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li>
                            <Link
                                href="/was-steht-an"
                                className="block py-2 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                onClick={() => setOpen(false)}
                            >
                                WAS STEHT AN?
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/geschichte"
                                className="block py-2 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                onClick={() => setOpen(false)}
                            >
                                GESCHICHTE
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/impressionen"
                                className="block py-2 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                onClick={() => setOpen(false)}
                            >
                                IMPRESSIONEN
                            </Link>
                        </li>
                        <li>
                            <span className="block py-2 px-2 font-semibold text-foreground">
                                KONTAKT
                            </span>
                            <ul className="pl-4">
                                {kontaktItems.map((item) => (
                                    <li key={item.title}>
                                        {item.href && (
                                            <Link
                                                href={item.href}
                                                className="block py-1 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                                onClick={() => setOpen(false)}
                                            >
                                                {item.title}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
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
