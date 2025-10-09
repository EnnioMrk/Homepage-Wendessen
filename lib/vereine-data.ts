export interface Verein {
    id: string;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    buttonText: string;
    buttonHref: string;
    buttonColor:
        | 'green'
        | 'red'
        | 'blue'
        | 'orange'
        | 'lime'
        | 'pink'
        | 'indigo'
        | 'emerald';
}

export const vereineData: Verein[] = [
    {
        id: 'sv-wendessen',
        title: 'SV Wendessen',
        description: 'Mittendrin statt nur dabei!',
        imageSrc: '/images/Vereinsleben/SV_Wendessen.JPG',
        imageAlt: 'SV Wendessen Sportangebot',
        buttonText: 'Mehr erfahren',
        buttonHref: '/dorfleben/vereine/sv-wendessen',
        buttonColor: 'blue',
    },
    {
        id: 'feuerwehr',
        title: 'Freiwillige Feuerwehr',
        description: 'Wir geben dem Roten Hahn keine Chance!',
        imageSrc: '/images/Vereinsleben/Freiwillige_Feuerwehr.jpeg',
        imageAlt: 'Freiwillige Feuerwehr Wendessen',
        buttonText: 'Mehr erfahren',
        buttonHref: '/dorfleben/vereine/feuerwehr',
        buttonColor: 'red',
    },
    {
        id: 'kleingaertner',
        title: 'Kleingärtner-Verein',
        description: 'Erholung im Grünen!',
        imageSrc: '/images/Vereinsleben/Kleingärten.jpeg',
        imageAlt: 'Kleingärtner-Verein Wendessen',
        buttonText: 'Mehr erfahren',
        buttonHref: '/dorfleben/vereine/kleingaertner',
        buttonColor: 'lime',
    },
    {
        id: 'kirchbauverein',
        title: 'Kirchbauverein',
        description: 'Gemeinsam für unser Gotteshaus!',
        imageSrc: '/images/Vereinsleben/Kirche.webp',
        imageAlt: 'Kirchbauverein Wendessen',
        buttonText: 'Mehr erfahren',
        buttonHref: '/dorfleben/vereine/kirchbauverein',
        buttonColor: 'indigo',
    },
    {
        id: 'initiative-spritzenhaus',
        title: 'Initiative Spritzenhaus',
        description: 'Erhaltung unseres historischen Erbes!',
        imageSrc: '/images/Vereinsleben/Spritzenhaus.webp',
        imageAlt: 'Initiative Spritzenhaus Wendessen',
        buttonText: 'Mehr erfahren',
        buttonHref: '/dorfleben/vereine/spritzenhaus',
        buttonColor: 'emerald',
    },
];
