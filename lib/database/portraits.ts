import { unstable_cache } from 'next/cache';
import { sql } from '../sql';

export interface DatabasePortrait {
    id: number;
    name: string;
    description: string;
    email?: string;
    image_url: string;
    image_storage_path?: string;
    image_mime_type: string;
    image_filename?: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    created_at: string;
    updated_at: string;
}

export interface PortraitSubmission {
    id: string;
    name: string;
    description: string;
    email?: string;
    imageUrl: string;
    imageStoragePath?: string;
    imageMimeType: string;
    imageFilename?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
}

function convertToPortraitSubmission(
    row: Record<string, unknown>
): PortraitSubmission {
    return {
        id: String(row.id),
        name: String(row.name),
        description: String(row.description),
        email: row.email ? String(row.email) : undefined,
        imageUrl: String(row.image_url),
        imageStoragePath: row.image_storage_path
            ? String(row.image_storage_path)
            : undefined,
        imageMimeType: String(row.image_mime_type),
        imageFilename: row.image_filename
            ? String(row.image_filename)
            : undefined,
        status: String(row.status) as 'pending' | 'approved' | 'rejected',
        submittedAt: new Date(String(row.submitted_at)),
        reviewedAt: row.reviewed_at
            ? new Date(String(row.reviewed_at))
            : undefined,
        reviewedBy: row.reviewed_by ? String(row.reviewed_by) : undefined,
    };
}

export const getPortraitSubmissions = unstable_cache(
    async (): Promise<PortraitSubmission[]> => {
        try {
            const result = await sql`
                SELECT * FROM portraits 
                ORDER BY submitted_at DESC
            `;
            return result.map(convertToPortraitSubmission);
        } catch (error) {
            console.error('Error fetching portrait submissions:', error);
            throw new Error(
                'Failed to fetch portrait submissions from database'
            );
        }
    },
    ['portraits-all'],
    { tags: ['portraits'], revalidate: 3600 }
);

export const getApprovedPortraits = unstable_cache(
    async (): Promise<PortraitSubmission[]> => {
        try {
            const result = await sql`
                SELECT * FROM portraits 
                WHERE status = 'approved'
                ORDER BY submitted_at DESC
            `;
            return result.map(convertToPortraitSubmission);
        } catch (error) {
            console.error('Error fetching approved portraits:', error);
            throw new Error('Failed to fetch approved portraits from database');
        }
    },
    ['portraits-approved'],
    { tags: ['portraits'], revalidate: 3600 }
);

export async function createPortraitSubmission(
    name: string,
    description: string,
    imageUrl: string,
    imageStoragePath: string,
    imageMimeType: string,
    imageFilename?: string,
    email?: string
): Promise<PortraitSubmission> {
    try {
        const result = await sql`
            INSERT INTO portraits (name, description, image_url, image_storage_path, image_mime_type, image_filename, email)
            VALUES (${name}, ${description}, ${imageUrl}, ${imageStoragePath}, ${imageMimeType}, ${
            imageFilename || null
        }, ${email})
            RETURNING *
        `;
        return convertToPortraitSubmission(result[0]);
    } catch (error) {
        console.error('Error creating portrait submission:', error);
        throw new Error('Failed to create portrait submission');
    }
}

export async function updatePortraitStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected',
    reviewedBy?: string
): Promise<PortraitSubmission> {
    try {
        const result = await sql`
            UPDATE portraits 
            SET status = ${status}, 
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy || null},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${parseInt(id)}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Portrait submission not found');
        }

        return convertToPortraitSubmission(result[0]);
    } catch (error) {
        console.error('Error updating portrait status:', error);
        throw new Error('Failed to update portrait status');
    }
}

export async function deletePortraitSubmission(
    id: string
): Promise<PortraitSubmission> {
    try {
        const result = await sql`
            DELETE FROM portraits 
            WHERE id = ${parseInt(id)}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Portrait submission not found');
        }

        return convertToPortraitSubmission(result[0]);
    } catch (error) {
        console.error('Error deleting portrait submission:', error);
        throw new Error('Failed to delete portrait submission');
    }
}

export async function cleanupOldRejectedPortraits(
    maxRejectedPortraits: number
): Promise<PortraitSubmission[]> {
    try {
        const countResult = await sql`
            SELECT COUNT(*) as count 
            FROM portraits 
            WHERE status = 'rejected'
        `;

        const rejectedCount = parseInt(countResult[0].count as string);

        if (rejectedCount <= maxRejectedPortraits) {
            return [];
        }

        const toDelete = rejectedCount - maxRejectedPortraits;

        const toDeleteResult = await sql`
            SELECT id, image_storage_path FROM portraits 
            WHERE status = 'rejected'
            ORDER BY reviewed_at ASC, submitted_at ASC
            LIMIT ${toDelete}
        `;

        if (toDeleteResult.length === 0) {
            return [];
        }

        const idsToDelete = toDeleteResult.map(
            (row: Record<string, unknown>) => row.id
        );
        const deleteResult = await sql`
            DELETE FROM portraits 
            WHERE id = ANY(${idsToDelete})
            RETURNING *
        `;

        console.log(
            `Cleaned up ${deleteResult.length} old rejected portraits (limit: ${maxRejectedPortraits}, was: ${rejectedCount})`
        );

        return deleteResult.map(convertToPortraitSubmission);
    } catch (error) {
        console.error('Error cleaning up rejected portraits:', error);
        throw new Error('Failed to cleanup rejected portraits');
    }
}
