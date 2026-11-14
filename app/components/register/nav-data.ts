export interface RegisterNavItem {
    label: string;
    href: string;
    note?: string;
}

export interface RegisterNavSection {
    label: string;
    href: string;
    children?: RegisterNavItem[];
    /** Columns of children, grouped under an editorial label. */
    groups?: { label: string; items: RegisterNavItem[] }[];
}

const vereine: RegisterNavItem[] = [
    { label: 'Feuerwehr', href: '/dorfleben/vereine/feuerwehr' },
    { label: 'Jugendfeuerwehr', href: '/dorfleben/vereine/jugendfeuerwehr' },
    {
        label: 'Einsatzabteilung',
        href: '/dorfleben/vereine/feuerwehr/einsatzabteilung',
    },
    { label: 'SV Wendessen', href: '/dorfleben/vereine/sv-wendessen' },
    { label: 'Schützenverein', href: '/dorfleben/vereine/schuetzenverein' },
    { label: 'Kirchbauverein', href: '/dorfleben/vereine/kirchbauverein' },
    { label: 'Kleingärtnerverein', href: '/dorfleben/vereine/kleingaertner' },
    { label: 'IDW', href: '/dorfleben/vereine/idw' },
    {
        label: 'Initiative Spritzenhaus',
        href: '/dorfleben/vereine/spritzenhaus',
    },
    { label: 'Seniorenkreis', href: '/dorfleben/vereine/seniorenkreis' },
    { label: 'Frauenhilfe', href: '/dorfleben/vereine/frauenhilfe' },
    { label: 'Hospizverein', href: '/dorfleben/vereine/hospiz' },
    { label: 'Feuerwehr-Portal', href: '/dorfleben/vereine/feuerwehr-portal' },
];

export const REGISTER_NAV: RegisterNavSection[] = [
    {
        label: 'Termine',
        href: '/was-steht-an',
    },
    {
        label: 'Nachrichten',
        href: '/neuigkeiten',
    },
    {
        label: 'Dorfleben',
        href: '/dorfleben',
        groups: [
            {
                label: 'Ortsrat',
                items: [
                    {
                        label: 'Die Mitglieder',
                        href: '/dorfleben/ortsrat/mitglieder',
                    },
                    {
                        label: 'Bericht des Ortsbürgermeisters',
                        href: '/dorfleben/ortsrat/bericht',
                    },
                ],
            },
            { label: 'Vereine', items: vereine },
            {
                label: 'Institutionen',
                items: [
                    { label: 'St. Georg', href: '/dorfleben/institutionen/kirche' },
                    { label: 'Hospiz', href: '/dorfleben/institutionen/hospiz' },
                ],
            },
            {
                label: 'Weiteres',
                items: [
                    { label: 'Wir Wendesser', href: '/dorfleben/wir-wendesser' },
                    { label: 'Geschichte', href: '/geschichte' },
                    { label: 'Impressionen', href: '/impressionen' },
                    { label: 'Karte', href: '/dorfleben/karte' },
                    { label: 'Wetter', href: '/dorfleben/wetter' },
                    { label: 'Archiv', href: '/dorfleben/archiv' },
                ],
            },
        ],
    },
    {
        label: 'Wohnen & Bauen',
        href: '/wohnen-bauen',
        groups: [
            {
                label: 'Baugebiete',
                items: [
                    {
                        label: 'Neubaugebiet Leipziger Allee',
                        href: '/wohnen-bauen/neubaugebiet',
                    },
                    {
                        label: 'Feuerwehrgerätehaus',
                        href: '/wohnen-bauen/feuerwehrgeraetehaus',
                    },
                ],
            },
        ],
    },
    {
        label: 'Kontakt',
        href: '/kontakt',
        groups: [
            {
                label: 'Menschen',
                items: [
                    { label: 'Verzeichnis', href: '/kontakt/verzeichnis' },
                    { label: 'Redaktionsteam', href: '/kontakt/redaktionsteam' },
                    { label: 'WhatsApp-Kanal', href: '/kontakt/whatsapp' },
                    { label: 'Kontaktformular', href: '/kontakt/formular' },
                ],
            },
            {
                label: 'Rechtliches',
                items: [
                    { label: 'Impressum', href: '/impressum' },
                    { label: 'Datenschutz', href: '/datenschutz' },
                ],
            },
        ],
    },
];

/** Flat list for the mobile menu and the sitemap. */
export const REGISTER_LINKS: RegisterNavItem[] = REGISTER_NAV.flatMap(
    (section) => [
        { label: section.label, href: section.href },
        ...(section.groups ?? []).flatMap((group) => group.items),
        ...(section.children ?? []),
    ],
);
