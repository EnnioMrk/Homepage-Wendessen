'use client';

import * as React from 'react';
import Link from 'next/link';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { cn } from '../lib/utils';
import { useAdminAuth } from '../../lib/useAdminAuth';

const Menubar = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.Root
        ref={ref}
        className={cn(
            'flex h-14 items-center space-x-1 rounded-md bg-background p-1',
            className
        )}
        {...props}
    />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.Trigger
        ref={ref}
        className={cn(
            'flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm font-medium text-foreground outline-none transition-colors hover:bg-primary/20 hover:text-primary-dark focus:bg-primary focus:text-white data-[state=open]:bg-primary data-[state=open]:text-white',
            className
        )}
        {...props}
    />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarContent = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
    (
        {
            className,
            align = 'start',
            alignOffset = -4,
            sideOffset = 8,
            ...props
        },
        ref
    ) => (
        <MenubarPrimitive.Portal>
            <MenubarPrimitive.Content
                ref={ref}
                align={align}
                alignOffset={alignOffset}
                sideOffset={sideOffset}
                className={cn(
                    'z-50 min-w-[12rem] max-h-[70vh] overflow-y-auto rounded-md border border-border bg-background p-1 text-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    className
                )}
                {...props}
            />
        </MenubarPrimitive.Portal>
    )
);
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <MenubarPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-primary focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarSubTrigger = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
        inset?: boolean;
    }
>(({ className, inset, children, ...props }, ref) => (
    <MenubarPrimitive.SubTrigger
        ref={ref}
        className={cn(
            'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-primary focus:text-white data-[state=open]:bg-primary data-[state=open]:text-white hover:bg-primary/20 hover:text-primary-dark',
            inset && 'pl-8',
            className
        )}
        {...props}
    >
        {children}
    </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.SubContent
        ref={ref}
        className={cn(
            'z-50 min-w-[8rem] max-h-[60vh] overflow-y-auto rounded-md border border-border bg-background p-1 text-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className
        )}
        {...props}
    />
));
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarSeparator = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.Separator
        ref={ref}
        className={cn('-mx-1 my-1 h-px bg-border', className)}
        {...props}
    />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const dorflebenItems = [
    {
        title: 'Ortsrat',
        items: [
            {
                title: 'Die Mitglieder',
                href: '/dorfleben/ortsrat/mitglieder',
                items: [
                    {
                        title: 'Aktuelle Mitglieder',
                        href: '/dorfleben/ortsrat/mitglieder/aktuell',
                    },
                    {
                        title: 'Mitglied werden',
                        href: '/dorfleben/ortsrat/mitglieder/werden',
                    },
                ],
            },
            {
                title: 'Der Ortsbürgermeister berichtet',
                href: '/dorfleben/ortsrat/bericht',
                items: [
                    {
                        title: 'Aktuelle Berichte',
                        href: '/dorfleben/ortsrat/bericht/aktuell',
                    },
                    {
                        title: 'Archiv',
                        href: '/dorfleben/ortsrat/bericht/archiv',
                    },
                ],
            },
        ],
    },
    {
        title: 'Vereinsleben',
        items: [
            {
                title: 'IDW',
                href: '/dorfleben/vereine/idw',
                items: [
                    {
                        title: 'Über uns',
                        href: '/dorfleben/vereine/idw/ueber-uns',
                    },
                    {
                        title: 'Veranstaltungen',
                        href: '/dorfleben/vereine/idw/veranstaltungen',
                    },
                ],
            },
            {
                title: 'Freiwillige Feuerwehr',
                href: '/dorfleben/vereine/feuerwehr',
                items: [
                    {
                        title: 'Über uns',
                        href: '/dorfleben/vereine/feuerwehr/ueber-uns',
                    },
                    {
                        title: 'Einsätze',
                        href: '/dorfleben/vereine/feuerwehr/einsaetze',
                    },
                ],
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
            {
                title: 'Evang. Seniorenkreis',
                href: '/dorfleben/vereine/seniorenkreis',
            },
            {
                title: 'Evang. Frauenhilfe',
                href: '/dorfleben/vereine/frauenhilfe',
            },
        ],
    },
    {
        title: 'Institutionen',
        items: [
            {
                title: 'Kirche',
                href: '/dorfleben/institutionen/kirche',
            },
            {
                title: 'Das Hospiz',
                href: '/dorfleben/institutionen/hospiz',
                items: [
                    {
                        title: 'Über uns',
                        href: '/dorfleben/institutionen/hospiz/ueber-uns',
                    },
                    {
                        title: 'Spenden',
                        href: '/dorfleben/institutionen/hospiz/spenden',
                    },
                ],
            },
        ],
    },
    {
        title: 'Wir Wendesser',
        href: '/dorfleben/wir-wendesser',
    },
    {
        title: 'Wetter',
        href: '/dorfleben/wetter',
    },
    {
        title: 'Archiv',
        href: '/dorfleben/archiv',
    },
];

const wohnenBauenItems = [
    {
        title: 'Neubaugebiet Leipziger Allee',
        href: '/wohnen-bauen/neubaugebiet',
        items: [
            {
                title: 'Übersicht',
                href: '/wohnen-bauen/neubaugebiet/uebersicht',
            },
            {
                title: 'Baufortschritt',
                href: '/wohnen-bauen/neubaugebiet/fortschritt',
            },
        ],
    },
    {
        title: 'Feuerwehrgerätehaus',
        href: '/wohnen-bauen/feuerwehrgeraetehaus',
        items: [
            {
                title: 'Planung',
                href: '/wohnen-bauen/feuerwehrgeraetehaus/planung',
            },
            {
                title: 'Baufortschritt',
                href: '/wohnen-bauen/feuerwehrgeraetehaus/fortschritt',
            },
        ],
    },
];

const kontaktItems = [
    { title: 'Verzeichnis', href: '/kontakt/verzeichnis' },
    { title: 'Impressum', href: '/kontakt/impressum' },
    { title: 'Datenschutz', href: '/kontakt/datenschutz' },
    { title: 'Kontaktformular', href: '/kontakt/formular' },
];

export function MenubarDemo() {
    const { isAuthenticated } = useAdminAuth();

    return (
        <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
            <MenubarPrimitive.Menu>
                <Link href="/" passHref>
                    <MenubarTrigger className="font-semibold">
                        HOME
                    </MenubarTrigger>
                </Link>
            </MenubarPrimitive.Menu>

            <MenubarPrimitive.Menu>
                <MenubarTrigger className="font-semibold">
                    DORFLEBEN
                </MenubarTrigger>
                <MenubarContent>
                    {dorflebenItems.map((item) => (
                        <React.Fragment key={item.title}>
                            {item.href ? (
                                <Link href={item.href} passHref>
                                    <MenubarItem className="cursor-pointer hover:bg-primary/20 hover:text-primary-dark">
                                        {item.title}
                                    </MenubarItem>
                                </Link>
                            ) : (
                                <div className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm font-medium outline-none">
                                    {item.title}
                                </div>
                            )}
                            {item.items && (
                                <>
                                    {item.items.map((subItem) => (
                                        <Link
                                            key={subItem.title}
                                            href={subItem.href}
                                            passHref
                                        >
                                            <MenubarItem className="pl-4 cursor-pointer hover:bg-primary/20 hover:text-primary-dark">
                                                {subItem.title}
                                            </MenubarItem>
                                        </Link>
                                    ))}
                                    <MenubarSeparator />
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </MenubarContent>
            </MenubarPrimitive.Menu>

            <MenubarPrimitive.Menu>
                <MenubarTrigger className="font-semibold">
                    WOHNEN & BAUEN
                </MenubarTrigger>
                <MenubarContent>
                    {wohnenBauenItems.map((item) => (
                        <Link key={item.title} href={item.href} passHref>
                            <MenubarItem className="cursor-pointer hover:bg-primary/20 hover:text-primary-dark">
                                {item.title}
                            </MenubarItem>
                        </Link>
                    ))}
                </MenubarContent>
            </MenubarPrimitive.Menu>

            <MenubarPrimitive.Menu>
                <Link href="/was-steht-an" passHref>
                    <MenubarTrigger className="font-semibold">
                        WAS STEHT AN?
                    </MenubarTrigger>
                </Link>
            </MenubarPrimitive.Menu>

            <MenubarPrimitive.Menu>
                <Link href="/geschichte" passHref>
                    <MenubarTrigger className="font-semibold">
                        GESCHICHTE
                    </MenubarTrigger>
                </Link>
            </MenubarPrimitive.Menu>

            <MenubarPrimitive.Menu>
                <Link href="/impressionen" passHref>
                    <MenubarTrigger className="font-semibold">
                        IMPRESSIONEN
                    </MenubarTrigger>
                </Link>
            </MenubarPrimitive.Menu>

            <MenubarPrimitive.Menu>
                <MenubarTrigger className="font-semibold">
                    KONTAKT
                </MenubarTrigger>
                <MenubarContent>
                    {kontaktItems.map((item) => (
                        <Link key={item.title} href={item.href} passHref>
                            <MenubarItem className="cursor-pointer hover:bg-primary/20 hover:text-primary-dark">
                                {item.title}
                            </MenubarItem>
                        </Link>
                    ))}
                </MenubarContent>
            </MenubarPrimitive.Menu>

            {/* Admin Dashboard Link - Only show when authenticated */}
            {isAuthenticated && (
                <MenubarPrimitive.Menu>
                    <Link href="/admin/dashboard" passHref>
                        <MenubarTrigger className="font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300">
                            ADMIN
                        </MenubarTrigger>
                    </Link>
                </MenubarPrimitive.Menu>
            )}
        </Menubar>
    );
}

export {
    Menubar,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
    MenubarSubContent,
    MenubarSubTrigger,
};
