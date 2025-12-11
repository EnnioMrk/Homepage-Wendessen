import { unstable_cache } from 'next/cache';
import { sql } from '../sql';

export interface ContactRecord {
    id: number;
    name: string;
    emails: string[];
    phones: { type: string; value: string }[];
    addresses: string[];
    affiliations: { org: string; role: string }[];
    sources: string[];
    importance: number;
}

export type ContactListItem = Omit<ContactRecord, 'id'> & { id: string };

function convertToContactItem(row: Record<string, unknown>): ContactListItem {
    return {
        id: String(row.id),
        name: String(row.name),
        emails: Array.isArray(row.emails)
            ? row.emails
            : JSON.parse((row.emails as string) ?? '[]'),
        phones: Array.isArray(row.phones)
            ? row.phones
            : JSON.parse((row.phones as string) ?? '[]'),
        addresses: Array.isArray(row.addresses)
            ? row.addresses
            : JSON.parse((row.addresses as string) ?? '[]'),
        affiliations: Array.isArray(row.affiliations)
            ? row.affiliations
            : JSON.parse((row.affiliations as string) ?? '[]'),
        sources: Array.isArray(row.sources)
            ? row.sources
            : JSON.parse((row.sources as string) ?? '[]'),
        importance: Number(row.importance ?? 0),
    };
}

export const getContacts = unstable_cache(
    async (): Promise<ContactListItem[]> => {
        try {
            const result = await sql`SELECT * FROM contacts ORDER BY name ASC;`;
            return result.map(convertToContactItem);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw new Error('Failed to fetch contacts from database');
        }
    },
    ['contacts-all'],
    { tags: ['contacts'], revalidate: 3600 }
);

export async function searchContacts(
    query: string
): Promise<ContactListItem[]> {
    const q = `%${query.toLowerCase()}%`;
    try {
        const result = await sql`
            SELECT * FROM contacts
            WHERE LOWER(name) LIKE ${q}
               OR EXISTS (
                    SELECT 1 FROM jsonb_array_elements_text(emails) e
                    WHERE LOWER(e) LIKE ${q}
               )
               OR EXISTS (
                    SELECT 1 FROM jsonb_array_elements(phones) p
                    WHERE LOWER(p->>'value') LIKE ${q}
               )
               OR EXISTS (
                    SELECT 1 FROM jsonb_array_elements(affiliations) a
                    WHERE LOWER(a->>'org') LIKE ${q} OR LOWER(a->>'role') LIKE ${q}
               )
            ORDER BY name ASC;
        `;
        return result.map(convertToContactItem);
    } catch (error) {
        console.error('Error searching contacts:', error);
        throw new Error('Failed to search contacts');
    }
}
