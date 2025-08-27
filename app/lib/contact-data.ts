// Contact data for all Ortsrat members
export interface ContactData {
    slug: string;
    name: string;
    title: string;
    subtitle: string;
    birthYear: number;
    profession: string;
    imageSrc: string;
    imageAlt: string;
    contactInfo: {
        address: string;
        phone?: string;
        mobile: string;
        email: string;
    };
}

export const contactData: ContactData[] = [
    {
        slug: 'andreas-rink',
        name: 'Andreas Rink',
        title: 'Ortsbürgermeister',
        subtitle: 'Ihr Ansprechpartner für alle Belange der Gemeinde Wendessen',
        birthYear: 1956,
        profession: 'Marketingberater',
        imageSrc: '/images/Ortsrat/Andreas_Rink.JPG',
        imageAlt: 'Andreas Rink - Ortsbürgermeister von Wendessen',
        contactInfo: {
            address: 'Am Gute 2R, 38300 Wendessen',
            phone: '05331/7107733',
            mobile: '0171/2741258',
            email: 'rink@wendessen.de',
        },
    },
    {
        slug: 'christina-balder',
        name: 'Christina Balder',
        title: 'stellv. Ortsbürgermeisterin',
        subtitle:
            'Ihre stellvertretende Ansprechpartnerin für die Gemeinde Wendessen',
        birthYear: 1984,
        profession: 'Fraktionsgeschäftsführerin',
        imageSrc: '/images/Ortsrat/Christina_Balder.jpg',
        imageAlt:
            'Christina Balder - stellvertretende Ortsbürgermeisterin von Wendessen',
        contactInfo: {
            address: 'Lindenblick 12, 38300 Wendessen',
            phone: '05331/859860',
            mobile: '0176/23589921',
            email: 'christina.balder@fdp-wf.de',
        },
    },
    {
        slug: 'renate-huebner',
        name: 'Renate Hübner',
        title: 'Ortsratsmitglied',
        subtitle: 'Engagiert für die Entwicklung und Zukunft von Wendessen',
        birthYear: 1955,
        profession: 'Geschäftsführende Gesellschafterin Ing.-Büro',
        imageSrc: '/images/Ortsrat/Renate_Hübner.jpg',
        imageAlt: 'Renate Hübner - Ortsratsmitglied',
        contactInfo: {
            address: 'Am Gute 2M, 38300 Wendessen',
            mobile: '0173/2157758',
            email: 'renate.huebner@bub-umwelt.de',
        },
    },
    {
        slug: 'klaus-martin-jungkurth',
        name: 'Klaus-Martin Jungkurth',
        title: 'Ortsratsmitglied',
        subtitle: 'Mit Expertise und Engagement für unsere Gemeinde',
        birthYear: 1954,
        profession: 'Diplom-Bauingenieur',
        imageSrc: '/images/Ortsrat/Klaus-Martin_Jungkurth.JPG',
        imageAlt: 'Klaus-Martin Jungkurth - Ortsratsmitglied',
        contactInfo: {
            address: 'Dorfstraße 18, 38300 Wendessen',
            phone: '05331/68680',
            mobile: '0176/34356130',
            email: 'klausmartinjungkurth@gmail.com',
        },
    },
    {
        slug: 'reiner-asche',
        name: 'Reiner Asche',
        title: 'Ortsratsmitglied',
        subtitle: 'Erfahrung und Weitsicht für die Belange von Wendessen',
        birthYear: 1956,
        profession: 'Beamter im Ruhestand',
        imageSrc: '/images/Ortsrat/Reiner_Asche.JPG',
        imageAlt: 'Reiner Asche - Ortsratsmitglied',
        contactInfo: {
            address: 'Vor den Wiesen 12, 38300 Wendessen',
            phone: '05331/9969400',
            mobile: '0157/35349073',
            email: 'reiner.asche@freenet.de',
        },
    },
    {
        slug: 'femmke-brandl',
        name: 'Femmke Brandl',
        title: 'Ortsratsmitglied',
        subtitle: 'Soziales Engagement und frische Perspektiven für Wendessen',
        birthYear: 1978,
        profession: 'Krankenschwester',
        imageSrc: '/images/Ortsrat/Femmke_Brandl.jpeg',
        imageAlt: 'Femmke Brandl - Ortsratsmitglied',
        contactInfo: {
            address: 'In den Äckern 25, 38300 Wendessen',
            mobile: '0151/41476516',
            email: 'f.brandl@gruene-wf.de',
        },
    },
    {
        slug: 'marc-both',
        name: 'Marc Both',
        title: 'Ortsratsmitglied',
        subtitle: 'Junges Engagement für eine moderne Gemeinde',
        birthYear: 1988,
        profession: 'Vertriebsleiter',
        imageSrc: '/images/Ortsrat/Marc_Both.JPG',
        imageAlt: 'Marc Both - Ortsratsmitglied',
        contactInfo: {
            address: 'Dorfstraße 24, 38300 Wendessen',
            mobile: '0171/8640666',
            email: 'marc.both@wolfenbuettel.de',
        },
    },
];

export function getContactBySlug(slug: string): ContactData | undefined {
    return contactData.find((contact) => contact.slug === slug);
}

export function getAllContactSlugs(): string[] {
    return contactData.map((contact) => contact.slug);
}
