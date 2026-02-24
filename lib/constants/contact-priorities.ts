export interface ContactPriorityStop {
    value: number;
    label: string;
    example: string;
}

// 8 stops based on the current importance distribution in contacts.
export const CONTACT_PRIORITY_STOPS: ContactPriorityStop[] = [
    { value: 0, label: 'Standard', example: 'z.B. Mitglied' },
    { value: 1, label: 'Fachkontakt', example: 'z.B. Pfarrer' },
    { value: 2, label: 'Vorstand', example: 'z.B. Kassenwart' },
    { value: 3, label: 'Vorsitz', example: 'z.B. 1. Vorsitzender' },
    { value: 4, label: 'Erweitert', example: 'z.B. Jugendfeuerwehrwart' },
    { value: 5, label: 'Einsatzleitung', example: 'z.B. Ortsbrandmeister' },
    { value: 6, label: 'Ortsrat', example: 'z.B. Ortsratsmitglied' },
    { value: 7, label: 'Spitze', example: 'z.B. Ortsbürgermeister' },
];

export const CONTACT_PRIORITY_MIN = CONTACT_PRIORITY_STOPS[0].value;
export const CONTACT_PRIORITY_MAX =
    CONTACT_PRIORITY_STOPS[CONTACT_PRIORITY_STOPS.length - 1].value;

export function normalizeLegacyImportance(importance: number): number {
    // Keep already migrated slider values as-is.
    if (importance >= CONTACT_PRIORITY_MIN && importance <= CONTACT_PRIORITY_MAX) {
        return importance;
    }

    if (importance >= 900) return 7;
    if (importance >= 700) return 6;
    if (importance >= 550) return 5;
    if (importance >= 450) return 4;
    if (importance >= 350) return 3;
    if (importance >= 250) return 2;
    if (importance >= 200) return 1;
    return 0;
}

export function getContactPriorityStop(value: number): ContactPriorityStop {
    const normalized = normalizeLegacyImportance(value);
    return (
        CONTACT_PRIORITY_STOPS.find((stop) => stop.value === normalized) ??
        CONTACT_PRIORITY_STOPS[0]
    );
}
