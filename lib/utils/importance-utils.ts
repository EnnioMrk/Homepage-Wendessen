/**
 * Utility functions for calculating contact importance based on roles
 */

type Affiliation = {
    org: string;
    role: string;
};

/**
 * Role importance hierarchy (higher number = more important)
 * This creates a "secret" sorting system that appears as "Keine" to users
 */
const ROLE_IMPORTANCE: Record<string, number> = {
    // Government/Administrative roles (highest importance)
    'Ortsbürgermeister': 1000,
    'stellv. Ortsbürgermeisterin': 900,
    'stellv. Ortsbürgermeister': 900,
    'Herausgeber (Impressum)': 850,
    'Ansprechperson Datenschutz': 800,

    // Council members
    'Ortsratsmitglied': 700,
    'Vakanzvertretung': 650,

    // Emergency services leadership
    'Ortsbrandmeister': 600,
    'stellv. Ortsbrandmeister': 550,
    'Jugendfeuerwehrwart': 500,
    'stellv. Jugendfeuerwehrwart': 450,

    // Organization leadership
    '1. Vorsitzender': 400,
    '1. Vorsitzende': 400,
    '2. Vorsitzender': 350,
    '2. Vorsitzende': 350,
    'Kassenführer': 300,
    'Kassiererin': 300,
    'Schriftführer': 250,
    'Schriftführerin': 250,

    // Specialized roles
    'Kirchenbüro': 200,
    'Pfarrer': 180,
    'Pastor': 180,

    // General members and other roles
    'Mitglied': 100,
    'Vereinsmitglied': 100,
};

/**
 * Calculate importance score for a contact based on their roles
 * @param affiliations Array of organization and role pairs
 * @returns Importance score (higher = more important)
 */
export function calculateImportance(affiliations: Affiliation[]): number {
    if (!affiliations || affiliations.length === 0) {
        return 0;
    }

    // Get the highest importance score from all roles
    let maxImportance = 0;

    for (const affiliation of affiliations) {
        const roleImportance = ROLE_IMPORTANCE[affiliation.role] || 50; // Default low importance for unknown roles
        maxImportance = Math.max(maxImportance, roleImportance);
    }

    return maxImportance;
}

/**
 * Check if a role has high importance (for potential special handling)
 * @param role Role string to check
 * @returns True if role has high importance (>= 500)
 */
export function isHighImportanceRole(role: string): boolean {
    const importance = ROLE_IMPORTANCE[role] || 0;
    return importance >= 500;
}
