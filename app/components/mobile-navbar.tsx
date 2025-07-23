'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const dorflebenItems = [
    {
        title: 'Ortsrat',
        items: [
            { title: 'Die Mitglieder', href: '/dorfleben/ortsrat/mitglieder' },
            {
                title: 'Der Ortsbürgermeister berichtet',
                href: '/dorfleben/ortsrat/bericht',
            },
        ],
    },
    {
        title: 'Vereinsleben',
        items: [
            { title: 'IDW', href: '/dorfleben/vereine/idw' },
            {
                title: 'Freiwillige Feuerwehr',
                href: '/dorfleben/vereine/feuerwehr',
            },
            {
                title: 'Initiative Spritzenhaus',
                href: '/dorfleben/vereine/spritzenhaus',
            },
            {
                title: 'Jugendfeuerwehr',
                href: '/dorfleben/vereine/jugendfeuerwehr',
            },
            {
                title: 'Kirchbauverein',
                href: '/dorfleben/vereine/kirchbauverein',
            },
            {
                title: 'Kleingärtnerverein',
                href: '/dorfleben/vereine/kleingaertner',
            },
            {
                title: 'Schützenverein',
                href: '/dorfleben/vereine/schuetzenverein',
            },
            { title: 'SV Wendessen', href: '/dorfleben/vereine/sv-wendessen' },
        ],
    },
    { title: 'Kirche', href: '/dorfleben/kirche' },
    { title: 'Wir Wendesser', href: '/dorfleben/wir-wendesser' },
    { title: 'Wetter', href: '/dorfleben/wetter' },
    { title: 'Archiv', href: '/dorfleben/archiv' },
];

const wohnenBauenItems = [
    {
        title: 'Neubaugebiet Leipziger Allee',
        href: '/wohnen-bauen/neubaugebiet',
    },
    {
        title: 'Feuerwehrgerätehaus',
        href: '/wohnen-bauen/feuerwehrgeraetehaus',
    },
    { title: 'Das Hospiz', href: '/wohnen-bauen/hospiz' },
];

const kontaktItems = [
    { title: 'Impressum', href: '/kontakt/impressum' },
    { title: 'Datenschutz', href: '/kontakt/datenschutz' },
    { title: 'Kontaktformular', href: '/kontakt/formular' },
];

export default function MobileNavbar() {
    const [open, setOpen] = useState(false);

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
                    <Menu size={28} className="text-foreground" />
                )}
            </button>
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/40"
                    onClick={() => setOpen(false)}
                />
            )}
            <nav
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-background shadow-lg transform transition-transform duration-300 ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
                aria-label="Mobile Navigation"
            >
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <span className="font-bold text-lg text-foreground">
                        Menü
                    </span>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Menü schließen"
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
                                                        <Link
                                                            href={subItem.href}
                                                            className="block py-1 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                                            onClick={() =>
                                                                setOpen(false)
                                                            }
                                                        >
                                                            {subItem.title}
                                                        </Link>
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
                                        <Link
                                            href={item.href}
                                            className="block py-1 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                            onClick={() => setOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
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
                            <span className="block py-2 px-2 font-semibold text-foreground">
                                KONTAKT
                            </span>
                            <ul className="pl-4">
                                {kontaktItems.map((item) => (
                                    <li key={item.title}>
                                        <Link
                                            href={item.href}
                                            className="block py-1 px-2 rounded text-foreground hover:bg-primary/20 hover:text-primary-dark"
                                            onClick={() => setOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
