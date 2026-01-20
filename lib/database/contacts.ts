import { unstable_cache } from 'next/cache';
import { sql } from '../sql';

export interface ContactRecord {
    id: number;
    name: string;
    emails: string[];
    phones: { type: string; value: string }[];
    addresses: string[];
    affiliations: { org: string; role: string }[];
    importance: number;
}

export type ContactListItem = Omit<ContactRecord, 'id'> & { id: string };

export type ContactInput = Omit<ContactRecord, 'id'>;

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

export const getContactByName = unstable_cache(
    async (name: string): Promise<ContactListItem | null> => {
        try {
            const result = await sql`SELECT * FROM contacts WHERE LOWER(name) = ${name.toLowerCase()}`;
            if (result.length === 0) return null;
            return convertToContactItem(result[0]);
        } catch (error) {
            console.error(`Error fetching contact by name ${name}:`, error);
            throw new Error('Failed to fetch contact');
        }
    },
    ['contact-by-name'],
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

export async function getContactById(id: number): Promise<ContactListItem | null> {
    try {
        const result = await sql`SELECT * FROM contacts WHERE id = ${id}`;
        if (result.length === 0) return null;
        return convertToContactItem(result[0]);
    } catch (error) {
        console.error(`Error fetching contact ${id}:`, error);
        throw new Error('Failed to fetch contact');
    }
}

export async function createContact(contact: ContactInput): Promise<ContactListItem> {
    try {
        const result = await sql`
            INSERT INTO contacts (
                name, emails, phones, addresses, affiliations, importance
            ) VALUES (
                ${contact.name},
                ${JSON.stringify(contact.emails)}::jsonb,
                ${JSON.stringify(contact.phones)}::jsonb,
                ${JSON.stringify(contact.addresses)}::jsonb,
                ${JSON.stringify(contact.affiliations)}::jsonb,
                ${contact.importance}
            )
            RETURNING *;
        `;
        return convertToContactItem(result[0]);
    } catch (error) {
        console.error('Error creating contact:', error);
        throw new Error('Failed to create contact');
    }
}

export async function updateContact(id: number, contact: ContactInput): Promise<ContactListItem> {
    try {
        const result = await sql`
            UPDATE contacts SET
                name = ${contact.name},
                emails = ${JSON.stringify(contact.emails)}::jsonb,
                phones = ${JSON.stringify(contact.phones)}::jsonb,
                addresses = ${JSON.stringify(contact.addresses)}::jsonb,
                affiliations = ${JSON.stringify(contact.affiliations)}::jsonb,
                importance = ${contact.importance}
            WHERE id = ${id}
            RETURNING *;
        `;
        if (result.length === 0) throw new Error('Contact not found');
        return convertToContactItem(result[0]);
    } catch (error) {
        console.error(`Error updating contact ${id}:`, error);
        throw new Error('Failed to update contact');
    }
}

export async function deleteContact(id: number): Promise<void> {
    try {
        await sql`DELETE FROM contacts WHERE id = ${id}`;
    } catch (error) {
        console.error(`Error deleting contact ${id}:`, error);
        throw new Error('Failed to delete contact');
    }
}
