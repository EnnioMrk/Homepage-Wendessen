export interface OrganizationContactLookup {
    id: string;
    title: string;
    altTitle: string | null;
}

type OrganizationLookupLike = {
    id: string;
    title: string;
    alt_title?: string | null;
    altTitle?: string | null;
};

const ORGANIZATION_CONTACT_LOOKUP_LIST: OrganizationContactLookup[] = [
    {
        id: 'frauenhilfe-wendessen',
        title: 'Frauenhilfe Wendessen',
        altTitle: 'Frauenhilfe',
    },
    {
        id: 'freiwillige-feuerwehr-wendessen',
        title: 'Freiwillige Feuerwehr Wendessen',
        altTitle: 'Freiwillige Feuerwehr',
    },
    {
        id: 'hospizverein-wolfenbuettel-ev',
        title: 'Hospizverein Wolfenbüttel e.V.',
        altTitle: 'Hospizverein',
    },
    {
        id: 'hospiz-institution-wendessen',
        title: 'Hospiz Wendessen',
        altTitle: 'Hospiz',
    },
    {
        id: 'idw',
        title: 'Initiative Dorfgemeinschaft Wendessen e.V',
        altTitle: 'IDW',
    },
    {
        id: 'initiative-wendesser-spritzenhaus-ev',
        title: 'Initiative Wendesser Spritzenhaus e.V.',
        altTitle: 'Spritzenhaus',
    },
    {
        id: 'jugendfeuerwehr-wendessen',
        title: 'Jugendfeuerwehr Wendessen',
        altTitle: 'Jugendfeuerwehr',
    },
    {
        id: 'kirchbauverein-wendessen',
        title: 'Kirchbauverein Wendessen',
        altTitle: 'Kirchbauverein',
    },
    {
        id: 'kirchengemeinde-ahlum-atzum-wendessen',
        title: 'Kirchengemeinde Ahlum-Atzum-Wendessen',
        altTitle: 'Kirchengemeinde',
    },
    {
        id: 'kleingartnerverein-wendessen',
        title: 'Kleingärtnerverein Wendessen',
        altTitle: 'Kleingärtnerverein',
    },
    {
        id: 'ortsrat-wendessen',
        title: 'Ortsrat Wendessen',
        altTitle: 'Ortsrat',
    },
    {
        id: 'schutzenverein-wendessen-ev',
        title: 'Schützenverein Wendessen e.V.',
        altTitle: 'Schützenverein',
    },
    {
        id: 'seniorenkreis-wendessen',
        title: 'Seniorenkreis Wendessen',
        altTitle: 'Seniorenkreis',
    },
    {
        id: 'sv-wendessen',
        title: 'SV Wendessen',
        altTitle: 'SV Wendessen',
    },
];

export const ORGANIZATION_CONTACT_LOOKUP = Object.fromEntries(
    ORGANIZATION_CONTACT_LOOKUP_LIST.map((organization) => [organization.id, organization])
) as Record<string, OrganizationContactLookup>;

export function getFallbackOrganizationById(
    organizationId: string
): OrganizationContactLookup | null {
    return ORGANIZATION_CONTACT_LOOKUP[organizationId] ?? null;
}

export function getOrganizationLookupValues(
    organization: OrganizationLookupLike | null
): string[] {
    if (!organization) {
        return [];
    }

    const altTitle = organization.alt_title ?? organization.altTitle ?? null;

    return [
        ...new Set(
            [organization.id, organization.title, altTitle].filter(
                (value): value is string => Boolean(value)
            )
        ),
    ];
}
