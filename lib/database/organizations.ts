import { unstable_cache } from 'next/cache';
import { sql } from '../sql';

export interface Organization {
    id: string;
    title: string;
    alt_title: string | null;
    description: string | null;
}

export interface OrganizationInput {
    id: string; // ID/Slug is required now
    title: string;
    alt_title?: string | null;
    description?: string | null;
}

function convertToOrganization(row: Record<string, unknown>): Organization {
    return {
        id: String(row.id),
        title: String(row.title),
        alt_title: row.alt_title ? String(row.alt_title) : null,
        description: row.description ? String(row.description) : null,
    };
}

export const getOrganizations = unstable_cache(
    async (): Promise<Organization[]> => {
        try {
            const result = await sql`SELECT * FROM organizations ORDER BY title ASC;`;
            return result.map(convertToOrganization);
        } catch (error) {
            console.error('Error fetching organizations:', error);
            throw new Error('Failed to fetch organizations');
        }
    },
    ['organizations-all'],
    { tags: ['organizations'], revalidate: 3600 }
);

export async function createOrganization(org: OrganizationInput): Promise<Organization> {
    try {
        const result = await sql`
            INSERT INTO organizations (id, title, alt_title, description)
            VALUES (${org.id}, ${org.title}, ${org.alt_title ?? null}, ${org.description ?? null})
            RETURNING *;
        `;
        return convertToOrganization(result[0]);
    } catch (error) {
        console.error('Error creating organization:', error);
        throw new Error('Failed to create organization');
    }
}

export async function updateOrganization(id: string, org: OrganizationInput): Promise<Organization> {
    try {
        const result = await sql`
            UPDATE organizations
            SET title = ${org.title}, 
                alt_title = ${org.alt_title ?? null}, 
                description = ${org.description ?? null}, 
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *;
        `;
        if (result.length === 0) throw new Error('Organization not found');
        return convertToOrganization(result[0]);
    } catch (error) {
        console.error(`Error updating organization ${id}:`, error);
        throw new Error('Failed to update organization');
    }
}

export async function deleteOrganization(id: string): Promise<void> {
    try {
        await sql`DELETE FROM organizations WHERE id = ${id}`;
    } catch (error) {
        console.error(`Error deleting organization ${id}:`, error);
        throw new Error('Failed to delete organization');
    }
}
