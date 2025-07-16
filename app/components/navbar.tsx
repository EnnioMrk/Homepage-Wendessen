"use client"

import * as React from "react"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import { cn } from "../lib/utils"

const dorflebenItems = [
  {
    title: "Ortsrat",
    items: [
      { 
        title: "Die Mitglieder", 
        href: "/dorfleben/ortsrat/mitglieder",
        items: [
          { title: "Aktuelle Mitglieder", href: "/dorfleben/ortsrat/mitglieder/aktuell" },
          { title: "Mitglied werden", href: "/dorfleben/ortsrat/mitglieder/werden" },
        ]
      },
      { 
        title: "Der Ortsbürgermeister berichtet", 
        href: "/dorfleben/ortsrat/bericht",
        items: [
          { title: "Aktuelle Berichte", href: "/dorfleben/ortsrat/bericht/aktuell" },
          { title: "Archiv", href: "/dorfleben/ortsrat/bericht/archiv" },
        ]
      },
    ],
  },
  {
    title: "Vereinsleben",
    items: [
      { 
        title: "IDW", 
        href: "/dorfleben/vereine/idw",
        items: [
          { title: "Über uns", href: "/dorfleben/vereine/idw/ueber-uns" },
          { title: "Veranstaltungen", href: "/dorfleben/vereine/idw/veranstaltungen" },
        ]
      },
      { 
        title: "Freiwillige Feuerwehr", 
        href: "/dorfleben/vereine/feuerwehr",
        items: [
          { title: "Über uns", href: "/dorfleben/vereine/feuerwehr/ueber-uns" },
          { title: "Einsätze", href: "/dorfleben/vereine/feuerwehr/einsaetze" },
        ]
      },
      { title: "Initiative Spritzenhaus", href: "/dorfleben/vereine/spritzenhaus" },
      { title: "Jugendfeuerwehr", href: "/dorfleben/vereine/jugendfeuerwehr" },
      { title: "Kirchbauverein", href: "/dorfleben/vereine/kirchbauverein" },
      { title: "Kleingärtnerverein", href: "/dorfleben/vereine/kleingaertner" },
      { title: "Schützenverein", href: "/dorfleben/vereine/schuetzenverein" },
      { title: "SV Wendessen", href: "/dorfleben/vereine/sv-wendessen" },
    ],
  },
  {
    title: "Kirche",
    href: "/dorfleben/kirche",
  },
  {
    title: "Wir Wendesser",
    href: "/dorfleben/wir-wendesser",
  },
  {
    title: "Wetter",
    href: "/dorfleben/wetter",
  },
  {
    title: "Archiv",
    href: "/dorfleben/archiv",
  },
]

const wohnenBauenItems = [
  { 
    title: "Neubaugebiet Leipziger Allee", 
    href: "/wohnen-bauen/neubaugebiet",
    items: [
      { title: "Übersicht", href: "/wohnen-bauen/neubaugebiet/uebersicht" },
      { title: "Baufortschritt", href: "/wohnen-bauen/neubaugebiet/fortschritt" },
    ]
  },
  { 
    title: "Feuerwehrgerätehaus", 
    href: "/wohnen-bauen/feuerwehrgeraetehaus",
    items: [
      { title: "Planung", href: "/wohnen-bauen/feuerwehrgeraetehaus/planung" },
      { title: "Baufortschritt", href: "/wohnen-bauen/feuerwehrgeraetehaus/fortschritt" },
    ]
  },
  { 
    title: "Das Hospiz", 
    href: "/wohnen-bauen/hospiz",
    items: [
      { title: "Über uns", href: "/wohnen-bauen/hospiz/ueber-uns" },
      { title: "Spenden", href: "/wohnen-bauen/hospiz/spenden" },
    ]
  },
]

const kontaktItems = [
  { title: "Impressum", href: "/kontakt/impressum" },
  { title: "Datenschutz", href: "/kontakt/datenschutz" },
  { title: "Kontaktformular", href: "/kontakt/formular" },
]

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export function Navbar() {
  return (
    <NavigationMenu className="max-w-full bg-white shadow-md border-b">
      <NavigationMenuList className="flex flex-wrap justify-center p-4">
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-semibold")}>
              HOME
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-semibold">DORFLEBEN</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {dorflebenItems.map((item) => (
                <li key={item.title} className="row-span-3">
                  {item.href ? (
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full")}>
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  ) : (
                    <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">{item.title}</div>
                      {item.items && (
                        <div className="mt-2 space-y-2">
                          {item.items.map((subItem) => (
                            <div key={subItem.title} className="space-y-1">
                              <Link
                                href={subItem.href}
                                className="block text-sm leading-none text-muted-foreground hover:text-foreground font-medium"
                              >
                                {subItem.title}
                              </Link>
                              {subItem.items && (
                                <div className="ml-4 space-y-1">
                                  {subItem.items.map((subSubItem) => (
                                    <Link
                                      key={subSubItem.title}
                                      href={subSubItem.href}
                                      className="block text-sm leading-none text-muted-foreground hover:text-foreground"
                                    >
                                      {subSubItem.title}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-semibold">WOHNEN & BAUEN</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              {wohnenBauenItems.map((item) => (
                <li key={item.title} className="space-y-1">
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full")}>
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                  {item.items && (
                    <div className="ml-4 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="block text-sm leading-none text-muted-foreground hover:text-foreground"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/was-steht-an" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-semibold")}>
              WAS STEHT AN?
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/geschichte" legacyBehavior passHref>
            <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-semibold")}>
              GESCHICHTE
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="font-semibold">KONTAKT</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4">
              {kontaktItems.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "w-full")}>
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
} 