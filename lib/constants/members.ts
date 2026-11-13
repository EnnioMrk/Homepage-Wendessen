export interface TeamMember {
    name: string;
    role: string;
    area?: string;
    imageSrc?: string;
    imageAlt?: string;
    party?: string;
    contactSlug?: string;
    position?: string;

    // Detailed bio fields (for contact person pages)
    birthYear?: number;
    profession?: string;
    subtitle?: string;
    contactInfo?: {
        address: string;
        phone?: string;
        mobile: string;
        email: string;
    };
}

/**
 * Ortsrat Wendessen, konstituiert am 13.11.2026.
 * Reihenfolge: Ortsbürgermeisterin, stellvertretender Ortsbürgermeister,
 * danach die Mitglieder alphabetisch.
 */
export const ORTSRAT_MEMBERS: TeamMember[] = [
    {
        name: "Christina Balder",
        position: "Ortsbürgermeisterin",
        party: "FDP",
        imageSrc: "/images/Ortsrat/christina-balder.jpg",
        imageAlt: "Christina Balder - Ortsbürgermeisterin von Wendessen",
        contactSlug: "christina-balder",
        role: "Ortsrat",
        birthYear: 1984,
        profession: "Fraktionsgeschäftsführerin",
        contactInfo: {
            address: "Lindenblick 12, 38300 Wendessen",
            phone: "05331/859860",
            mobile: "0176/23589921",
            email: "christina.balder@fdp-wf.de",
        },
    },
    {
        name: "Reiner Asche",
        position: "stellv. Ortsbürgermeister",
        party: "SPD",
        imageSrc: "/images/Ortsrat/reiner-asche.jpg",
        imageAlt: "Reiner Asche - stellvertretender Ortsbürgermeister",
        contactSlug: "reiner-asche",
        role: "Ortsrat",
        birthYear: 1956,
        profession: "Beamter im Ruhestand",
        contactInfo: {
            address: "Vor den Wiesen 12, 38300 Wendessen",
            phone: "05331/9969400",
            mobile: "0157/35349073",
            email: "reiner.asche@freenet.de",
        },
    },
    {
        name: "Marc Both",
        position: "Ortsratsmitglied",
        party: "parteilos (aufgestellt für CDU)",
        imageSrc: "/images/Ortsrat/marc-both.jpg",
        imageAlt: "Marc Both - Ortsratsmitglied",
        contactSlug: "marc-both",
        role: "Ortsrat",
        birthYear: 1988,
        profession: "Vertriebsleiter",
        contactInfo: {
            address: "Dorfstraße 24, 38300 Wendessen",
            mobile: "0171/8640666",
            email: "marc.both@wolfenbuettel.de",
        },
    },
    {
        name: "Femmke Brandl",
        position: "Ortsratsmitglied",
        party: "parteilos (aufgestellt für B'90)",
        imageSrc: "/images/Ortsrat/femmke-brandl.jpeg",
        imageAlt: "Femmke Brandl - Ortsratsmitglied",
        contactSlug: "femmke-brandl",
        role: "Ortsrat",
        birthYear: 1978,
        profession: "Krankenschwester",
        contactInfo: {
            address: "In den Äckern 25, 38300 Wendessen",
            mobile: "0151/41476516",
            email: "f.brandl@gruene-wf.de",
        },
    },
    {
        name: "Klaus-Martin Jungkurth",
        position: "Ortsratsmitglied",
        party: "parteilos",
        imageSrc: "/images/Ortsrat/klaus-martin-jungkurth.jpg",
        imageAlt: "Klaus-Martin Jungkurth - Ortsratsmitglied",
        contactSlug: "klaus-martin-jungkurth",
        role: "Ortsrat",
        birthYear: 1954,
        profession: "Diplom-Bauingenieur",
        contactInfo: {
            address: "Dorfstraße 18, 38300 Wendessen",
            phone: "05331/68680",
            mobile: "0176/34356130",
            email: "klausmartinjungkurth@gmail.com",
        },
    },
    {
        name: "Andreas Rink",
        position: "Ortsratsmitglied",
        party: "SPD",
        imageSrc: "/images/Ortsrat/andreas-rink.jpg",
        imageAlt: "Andreas Rink - Ortsratsmitglied",
        contactSlug: "andreas-rink",
        role: "Ortsrat",
        birthYear: 1956,
        profession: "Marketingberater",
        contactInfo: {
            address: "Am Gute 2R, 38300 Wendessen",
            phone: "05331/7107733",
            mobile: "0171/2741258",
            email: "rink@wendessen.de",
        },
    },
    {
        name: "Julian Stache",
        position: "Ortsratsmitglied",
        party: "AfD",
        role: "Ortsrat",
        imageSrc: "/images/Ortsrat/julian-stache.png",
        imageAlt: "Julian Stache - Ortsratsmitglied (Platzhalterbild)",
    },
];

export const REDAKTIONSTEAM_KERNTEAM: TeamMember[] = [
    { name: "Ennio Marke", role: "Entwicklung" },
    { name: "Christina Balder", role: "Ortsrat" },
    { name: "Marc Both", role: "Ortsrat" },
];

export const REDAKTIONSTEAM_BEREICHSVERANTWORTLICHE: TeamMember[] = [
    {
        name: "Achim Cirkensa",
        role: "Verantwortlicher",
        area: "Kirchbauverein",
    },
    {
        name: "Andrea Brackmann",
        role: "Verantwortliche",
        area: "Schützenverein",
    },
    { name: "Lothar Lange", role: "Verantwortlicher", area: "Schützenverein" },
    {
        name: "Christoph Schmegner",
        role: "Verantwortlicher",
        area: "Jugendfeuerwehr",
    },
    {
        name: "Jessice Schulz",
        role: "Verantwortliche",
        area: "Freiwillige Feuerwehr",
    },
    {
        name: "Kai Brackmann",
        role: "Verantwortlicher",
        area: "Freiwillige Feuerwehr",
    },
    {
        name: "Peter Dorn",
        role: "Verantwortlicher",
        area: "Initiative Spritzenhaus",
    },
    { name: "Ulrike Jürgens", role: "Verantwortliche", area: "Hospizverein" },
    { name: "Marc Both", role: "Verantwortliche/r", area: "IDW" },
    { name: "N.N.", role: "Verantwortliche/r", area: "SV Wendessen" },
];

export function getMemberBySlug(slug: string): TeamMember | undefined {
    return ORTSRAT_MEMBERS.find((m) => m.contactSlug === slug);
}

export function getAllMemberSlugs(): string[] {
    return ORTSRAT_MEMBERS.map((m) => m.contactSlug).filter(
        Boolean,
    ) as string[];
}
