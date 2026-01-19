export interface NavItem {
    title: string;
    href?: string;
    items?: NavItem[];
}

export const DORFLEBEN_NAV: NavItem[] = [
    {
        title: 'Ortsrat',
        items: [
            {
                title: 'Die Mitglieder',
                href: '/dorfleben/ortsrat/mitglieder',
                items: [
                    { title: 'Aktuelle Mitglieder', href: '/dorfleben/ortsrat/mitglieder/aktuell' },
                    { title: 'Mitglied werden', href: '/dorfleben/ortsrat/mitglieder/werden' },
                ],
            },
            {
                title: 'Der Ortsbürgermeister berichtet',
                href: '/dorfleben/ortsrat/bericht',
                items: [
                    { title: 'Aktuelle Berichte', href: '/dorfleben/ortsrat/bericht/aktuell' },
                    { title: 'Archiv', href: '/dorfleben/ortsrat/bericht/archiv' },
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
                    { title: 'Über uns', href: '/dorfleben/vereine/idw/ueber-uns' },
                    { title: 'Veranstaltungen', href: '/dorfleben/vereine/idw/veranstaltungen' },
                ],
            },
            {
                title: 'Freiwillige Feuerwehr',
                href: '/dorfleben/vereine/feuerwehr',
                items: [
                    { title: 'Über uns', href: '/dorfleben/vereine/feuerwehr/ueber-uns' },
                    { title: 'Einsätze', href: '/dorfleben/vereine/feuerwehr/einsaetze' },
                ],
            },
            { title: 'Initiative Spritzenhaus', href: '/dorfleben/vereine/spritzenhaus' },
            { title: 'Jugendfeuerwehr', href: '/dorfleben/vereine/jugendfeuerwehr' },
            { title: 'Kirchbauverein', href: '/dorfleben/vereine/kirchbauverein' },
            { title: 'Kleingärtnerverein', href: '/dorfleben/vereine/kleingaertner' },
            { title: 'Schützenverein', href: '/dorfleben/vereine/schuetzenverein' },
            { title: 'SV Wendessen', href: '/dorfleben/vereine/sv-wendessen' },
            { title: 'Evang. Seniorenkreis', href: '/dorfleben/vereine/seniorenkreis' },
            { title: 'Evang. Frauenhilfe', href: '/dorfleben/vereine/frauenhilfe' },
            { title: 'Hospizverein', href: '/dorfleben/vereine/hospiz' },
        ],
    },
    {
        title: 'Institutionen',
        items: [
            { title: 'Kirche', href: '/dorfleben/institutionen/kirche' },
            { title: 'Das Hospiz', href: '/dorfleben/institutionen/hospiz' },
        ],
    },
    { title: 'Wir Wendesser', href: '/dorfleben/wir-wendesser' },
    { title: 'Wetter', href: '/dorfleben/wetter' },
    { title: 'Archiv', href: '/dorfleben/archiv' },
];

export const WOHNEN_BAUEN_NAV: NavItem[] = [
    {
        title: 'Neubaugebiet Leipziger Allee',
        href: '/wohnen-bauen/neubaugebiet',
        items: [
            { title: 'Übersicht', href: '/wohnen-bauen/neubaugebiet/uebersicht' },
            { title: 'Baufortschritt', href: '/wohnen-bauen/neubaugebiet/fortschritt' },
        ],
    },
    {
        title: 'Feuerwehrgerätehaus',
        href: '/wohnen-bauen/feuerwehrgeraetehaus',
        items: [
            { title: 'Planung', href: '/wohnen-bauen/feuerwehrgeraetehaus/planung' },
            { title: 'Baufortschritt', href: '/wohnen-bauen/feuerwehrgeraetehaus/fortschritt' },
        ],
    },
];

export const KONTAKT_NAV: NavItem[] = [
    { title: 'Verzeichnis', href: '/kontakt/verzeichnis' },
    { title: 'Redaktionsteam', href: '/kontakt/redaktionsteam' },
    { title: 'WhatsApp-Kanal', href: '/kontakt/whatsapp' },
    { title: 'Kontaktformular', href: '/kontakt/formular' },
    { title: 'Impressum', href: '/kontakt/impressum' },
    { title: 'Datenschutz', href: '/kontakt/datenschutz' },
];

export const MAIN_NAV = [
    { title: 'HOME', href: '/' },
    { title: 'DORFLEBEN', items: DORFLEBEN_NAV },
    { title: 'WOHNEN & BAUEN', items: WOHNEN_BAUEN_NAV },
    { title: 'WAS STEHT AN?', href: '/was-steht-an' },
    { title: 'GESCHICHTE', href: '/geschichte' },
    { title: 'IMPRESSIONEN', href: '/impressionen' },
    { title: 'KONTAKT', items: KONTAKT_NAV },
];
