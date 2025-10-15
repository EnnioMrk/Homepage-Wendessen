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
        | 'emerald'
        | 'violet'
        | 'teal'
        | 'cyan'
        | 'yellow';
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
        // Updated to an existing image in the repository
        imageSrc: '/images/Vereinsleben/Freiwillige_Feuerwehr.jpg',
        imageAlt: 'Freiwillige Feuerwehr Wendessen',
        buttonText: 'Mehr erfahren',
        buttonHref: '/dorfleben/vereine/feuerwehr',
        buttonColor: 'red',
    },
    {
        id: 'jugendfeuerwehr',
        title: 'Jugendfeuerwehr',
        description: 'Spaß, Action und feuerwehrtechnisches Wissen für Kinder und Jugendliche.',
        imageSrc: '/images/Vereinsleben/Jugendfeuerwehr.jpeg',
        imageAlt: 'Jugendfeuerwehr Wendessen in Aktion',
        buttonText: 'Mehr erfahren',
        buttonHref: '/dorfleben/vereine/jugendfeuerwehr',
        buttonColor: 'orange',
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
        buttonColor: 'teal',
    },
    {
        id: 'schuetzenverein',
        title: 'Schützenverein',
        description: 'Tradition, Gemeinschaft und sportliches Schießen.',
        imageSrc: '/images/Vereinsleben/schuetzenverein.jpg',
        imageAlt: 'Schützenverein Wendessen',
        buttonText: 'Mehr erfahren',
        buttonHref: '/dorfleben/vereine/schuetzenverein',
        buttonColor: 'violet',
    },
];