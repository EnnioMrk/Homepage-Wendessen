export interface Verein {
    id: string;
    title: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
    buttonText: string;
    buttonHref: string;
    buttonColor:
        | "green"
        | "red"
        | "blue"
        | "orange"
        | "lime"
        | "pink"
        | "indigo"
        | "emerald"
        | "violet"
        | "teal"
        | "cyan"
        | "yellow";
}

export const ASSOCIATIONS: Verein[] = [
    {
        id: "sv-wendessen",
        title: "SV Wendessen",
        description: "Mittendrin statt nur dabei!",
        imageSrc: "/images/Vereinsleben/sv-wendessen.jpg",
        imageAlt: "SV Wendessen Sportangebot",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/sv-wendessen",
        buttonColor: "blue",
    },
    {
        id: "idw",
        title: "IDW",
        description: "Initiative Dorfgemeinschaft Wendessen e.V.",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/idw",
        buttonColor: "cyan",
    },
    {
        id: "feuerwehr",
        title: "Freiwillige Feuerwehr",
        description: "Wir geben dem Roten Hahn keine Chance!",
        imageSrc: "/images/Vereinsleben/freiwillige-feuerwehr.jpg",
        imageAlt: "Freiwillige Feuerwehr Wendessen",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/feuerwehr",
        buttonColor: "red",
    },
    {
        id: "jugendfeuerwehr",
        title: "Jugendfeuerwehr",
        description:
            "Spaß, Action und feuerwehrtechnisches Wissen für Kinder und Jugendliche.",
        imageSrc: "/images/Vereinsleben/jugendfeuerwehr.jpeg",
        imageAlt: "Jugendfeuerwehr Wendessen in Aktion",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/jugendfeuerwehr",
        buttonColor: "orange",
    },
    {
        id: "kleingaertner",
        title: "Kleingärtner-Verein",
        description: "Erholung im Grünen!",
        imageSrc: "/images/Vereinsleben/kleingarten.jpeg",
        imageAlt: "Kleingärtner-Verein Wendessen",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/kleingaertner",
        buttonColor: "lime",
    },
    {
        id: "kirchbauverein",
        title: "Kirchbauverein",
        description:
            "Konzerte und Lesungen - Verein für den Erhalt der Wendesser Kirche",
        imageSrc: "/images/Vereinsleben/kirche.webp",
        imageAlt: "Kirchbauverein Wendessen",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/kirchbauverein",
        buttonColor: "indigo",
    },
    {
        id: "initiative-spritzenhaus",
        title: "Initiative Spritzenhaus",
        description: "Erhaltung unseres historischen Erbes!",
        imageSrc: "/images/Vereinsleben/spritzenhaus.webp",
        imageAlt: "Initiative Spritzenhaus Wendessen",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/spritzenhaus",
        buttonColor: "teal",
    },
    {
        id: "schuetzenverein",
        title: "Schützenverein",
        description: "Tradition, Gemeinschaft und sportliches Schießen.",
        imageSrc: "/images/Vereinsleben/schuetzenverein.jpg",
        imageAlt: "Schützenverein Wendessen",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/schuetzenverein",
        buttonColor: "violet",
    },
    {
        id: "seniorenkreis",
        title: "Evang. Seniorenkreis",
        description: "Auch im Alter in geselliger Runde etwas unternehmen!",
        imageSrc: "/images/Vereinsleben/seniorenkreis.jpg",
        imageAlt: "Evangelischer Seniorenkreis Atzum-Wendessen",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/seniorenkreis",
        buttonColor: "emerald",
    },
    {
        id: "frauenhilfe",
        title: "Evang. Frauenhilfe",
        description:
            "Frauen auf dem Boden christlichen Glaubens zusammenführen.",
        imageSrc: "/images/Vereinsleben/frauenhilfe.jpg",
        imageAlt: "Evangelische Frauenhilfe Wendessen",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/frauenhilfe",
        buttonColor: "pink",
    },
    {
        id: "hospiz-verein",
        title: "Hospizverein Wolfenbüttel",
        description:
            "Begleitung schwerstkranker und sterbender Menschen sowie deren Angehörige.",
        imageSrc: "/images/hospiz.jpg",
        imageAlt: "Hospizverein Wolfenbüttel",
        buttonText: "Mehr erfahren",
        buttonHref: "/dorfleben/vereine/hospiz",
        buttonColor: "green",
    },
];

export const ASSOCIATIONS_MAP: Record<string, string> = Object.fromEntries(
    ASSOCIATIONS.map((assoc) => [assoc.id, assoc.title]),
);

export const VEREINE_OPTIONS = ASSOCIATIONS.map((assoc) => ({
    id: assoc.id,
    label: assoc.title,
}));
