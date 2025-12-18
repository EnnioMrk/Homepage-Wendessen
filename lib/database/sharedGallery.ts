import { unstable_cache } from 'next/cache';
import { sql, pool } from '../sql';

// Shared Gallery (Impressionen) types and functions
export interface SharedGallerySubmission {
    id: string;
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterName?: string;
    submitterEmail?: string;
    imageUrl: string;
    imageStoragePath?: string;
    imageMimeType: string;
    imageFilename?: string;
    dateTaken?: Date;
    location?: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
    rejectionReason?: string;
}

export interface SharedGallerySubmissionGroup {
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterNames: string[];
    submitterEmail?: string;
    images: SharedGallerySubmission[];
    submittedAt: Date;
    totalCount: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
}

function convertToSharedGallerySubmission(
    row: Record<string, unknown>
): SharedGallerySubmission {
    const imageUrl = row.image_url ? String(row.image_url) : '';

    return {
        id: String(row.id),
        submissionGroupId: String(row.submission_group_id),
        title: String(row.title),
        description: row.description ? String(row.description) : undefined,
        submitterName: row.submitter_name
            ? String(row.submitter_name)
            : undefined,
        submitterEmail: row.submitter_email
            ? String(row.submitter_email)
            : undefined,
        imageUrl,
        imageStoragePath: row.image_storage_path
            ? String(row.image_storage_path)
            : undefined,
        imageMimeType: String(row.image_mime_type),
        imageFilename: row.image_filename
            ? String(row.image_filename)
            : undefined,
        dateTaken: row.date_taken
            ? new Date(String(row.date_taken))
            : undefined,
        location: row.location ? String(row.location) : undefined,
        status: String(row.status) as 'pending' | 'approved' | 'rejected',
        submittedAt: new Date(String(row.submitted_at)),
        reviewedAt: row.reviewed_at
            ? new Date(String(row.reviewed_at))
            : undefined,
        reviewedBy: row.reviewed_by ? String(row.reviewed_by) : undefined,
        rejectionReason: row.rejection_reason
            ? String(row.rejection_reason)
            : undefined,
    };
}

export async function createSharedGallerySubmission(
    submission: Omit<
        SharedGallerySubmission,
        | 'id'
        | 'submittedAt'
        | 'status'
        | 'reviewedAt'
        | 'reviewedBy'
        | 'rejectionReason'
    >
): Promise<SharedGallerySubmission> {
    try {
        const result = await sql`
            INSERT INTO shared_gallery_submissions (
                submission_group_id, title, description, submitter_name, submitter_email, 
                image_url, image_storage_path, image_mime_type, image_filename, date_taken, location, status
            )
            VALUES (
                ${submission.submissionGroupId},
                ${submission.title},
                ${submission.description || null},
                ${submission.submitterName || null},
                ${submission.submitterEmail || null},
                ${submission.imageUrl},
                ${submission.imageStoragePath || null},
                ${submission.imageMimeType},
                ${submission.imageFilename || null},
                ${submission.dateTaken || null},
                ${submission.location || null},
                'pending'
            )
            RETURNING *
        `;
        return convertToSharedGallerySubmission(result[0]);
    } catch (error) {
        console.error('Error creating shared gallery submission:', error);
        throw new Error('Failed to create shared gallery submission');
    }
}

export async function getSharedGallerySubmissionGroups(
    status?: 'pending' | 'approved' | 'rejected',
    limit?: number,
    offset?: number
): Promise<{ groups: SharedGallerySubmissionGroup[]; total: number }> {
    try {
        const limitValue = limit ?? 25;
        const offsetValue = offset ?? 0;
        const params: unknown[] = [];

        let whereClause = '';
        if (status) {
            params.push(status);
            whereClause = `WHERE status = $${params.length}`;
        }

        params.push(limitValue);
        const limitIndex = params.length;
        params.push(offsetValue);
        const offsetIndex = params.length;

        const query = `
            WITH filtered AS (
                SELECT *
                FROM shared_gallery_submissions
                ${whereClause}
            ),
            grouped AS (
                SELECT submission_group_id, MIN(submitted_at) AS first_submitted
                FROM filtered
                GROUP BY submission_group_id
            ),
            ordered AS (
                SELECT
                    submission_group_id,
                    first_submitted,
                    COUNT(*) OVER () AS total_groups
                FROM grouped
                ORDER BY first_submitted DESC
            ),
            paged AS (
                SELECT *
                FROM ordered
                LIMIT $${limitIndex} OFFSET $${offsetIndex}
            )
            SELECT
                paged.total_groups,
                filtered.id,
                filtered.submission_group_id,
                filtered.title,
                filtered.description,
                filtered.submitter_name,
                filtered.submitter_email,
                filtered.image_url,
                filtered.image_storage_path,
                filtered.image_mime_type,
                filtered.image_filename,
                filtered.date_taken,
                filtered.location,
                filtered.status,
                filtered.submitted_at,
                filtered.reviewed_at,
                filtered.reviewed_by,
                filtered.rejection_reason
            FROM filtered
            JOIN paged ON filtered.submission_group_id = paged.submission_group_id
            ORDER BY paged.first_submitted DESC, filtered.submitted_at DESC;
        `;

        const { rows } = await pool.query(query, params);

        if (rows.length === 0) {
            const countResult = status
                ? await sql`SELECT COUNT(DISTINCT submission_group_id)::int as count FROM shared_gallery_submissions WHERE status = ${status}`
                : await sql`SELECT COUNT(DISTINCT submission_group_id)::int as count FROM shared_gallery_submissions`;
            const totalWhenEmpty = countResult[0]?.count || 0;
            return { groups: [], total: totalWhenEmpty };
        }

        const total = Number(rows[0].total_groups || 0);
        const groups = new Map<string, SharedGallerySubmissionGroup>();

        for (const row of rows) {
            const submission = convertToSharedGallerySubmission(row);

            if (!groups.has(submission.submissionGroupId)) {
                groups.set(submission.submissionGroupId, {
                    submissionGroupId: submission.submissionGroupId,
                    title: submission.title,
                    description: submission.description,
                    submitterNames: [],
                    submitterEmail: submission.submitterEmail,
                    images: [],
                    submittedAt: submission.submittedAt,
                    totalCount: 0,
                    pendingCount: 0,
                    approvedCount: 0,
                    rejectedCount: 0,
                });
            }

            const group = groups.get(submission.submissionGroupId)!;
            group.images.push(submission);
            group.totalCount++;

            if (
                submission.submitterName &&
                !group.submitterNames.includes(submission.submitterName)
            ) {
                group.submitterNames.push(submission.submitterName);
            }

            if (submission.status === 'pending') group.pendingCount++;
            else if (submission.status === 'approved') group.approvedCount++;
            else if (submission.status === 'rejected') group.rejectedCount++;
        }

        // Ensure group-level title/description come from the earliest submission in the group
        const finalGroups = Array.from(groups.values()).map((g) => {
            if (g.images.length === 0) return g;
            // Find earliest submission by submittedAt
            let earliest = g.images[0];
            for (const img of g.images) {
                if (img.submittedAt < earliest.submittedAt) earliest = img;
            }
            return {
                ...g,
                title: earliest.title || g.title,
                description: earliest.description || g.description,
                submitterEmail: g.submitterEmail || earliest.submitterEmail,
                submittedAt: new Date(
                    Math.min(...g.images.map((i) => i.submittedAt.getTime()))
                ),
            } as SharedGallerySubmissionGroup;
        });
        // Legacy: gallery mapping table removed — skip merging external gallery metadata for groups.

        return { groups: finalGroups, total };
    } catch (error) {
        console.error(
            'Error fetching shared gallery submission groups:',
            error
        );
        throw new Error('Failed to fetch shared gallery submission groups');
    }
}

export const getSharedGallerySubmissions = unstable_cache(
    async (
        status?: 'pending' | 'approved' | 'rejected'
    ): Promise<SharedGallerySubmission[]> => {
        try {
            // Legacy image_data payloads are excluded; URL is enough for rendering
            const result = status
                ? await sql`
                    SELECT id, submission_group_id, title, description, submitter_name, 
                          submitter_email, image_url, image_storage_path, image_mime_type, image_filename, date_taken, 
                           location, status, submitted_at, reviewed_at, reviewed_by, rejection_reason
                    FROM shared_gallery_submissions 
                    WHERE status = ${status}
                    ORDER BY submitted_at DESC
                  `
                : await sql`
                    SELECT id, submission_group_id, title, description, submitter_name, 
                          submitter_email, image_url, image_storage_path, image_mime_type, image_filename, date_taken, 
                           location, status, submitted_at, reviewed_at, reviewed_by, rejection_reason
                    FROM shared_gallery_submissions 
                    ORDER BY submitted_at DESC
                  `;
            return result.map(convertToSharedGallerySubmission);
        } catch (error) {
            console.error('Error fetching shared gallery submissions:', error);
            throw new Error('Failed to fetch shared gallery submissions');
        }
    },
    ['shared-gallery-submissions'],
    { tags: ['shared-gallery'], revalidate: 300 }
);

export const getApprovedSharedGalleryGroups = unstable_cache(
    async (): Promise<SharedGallerySubmissionGroup[]> => {
        try {
            // Get all approved submissions
            const result = await sql`
                SELECT * FROM shared_gallery_submissions 
                WHERE status = 'approved'
                ORDER BY submitted_at DESC
            `;

            const submissions = result.map(convertToSharedGallerySubmission);

            // Group by submission_group_id
            const groups = new Map<string, SharedGallerySubmissionGroup>();

            for (const submission of submissions) {
                if (!groups.has(submission.submissionGroupId)) {
                    groups.set(submission.submissionGroupId, {
                        submissionGroupId: submission.submissionGroupId,
                        title: submission.title,
                        description: submission.description,
                        submitterNames: [],
                        submitterEmail: submission.submitterEmail,
                        images: [],
                        submittedAt: submission.submittedAt,
                        totalCount: 0,
                        pendingCount: 0,
                        approvedCount: 0,
                        rejectedCount: 0,
                    });
                }

                const group = groups.get(submission.submissionGroupId)!;
                group.images.push(submission);
                group.totalCount++;
                group.approvedCount++;

                // Collect unique submitter names
                if (
                    submission.submitterName &&
                    !group.submitterNames.includes(submission.submitterName)
                ) {
                    group.submitterNames.push(submission.submitterName);
                }
            }

            const final = Array.from(groups.values());

            // Legacy: gallery mapping table removed — skip merging external gallery metadata.

            return final;
        } catch (error) {
            console.error(
                'Error fetching approved shared gallery groups:',
                error
            );
            throw new Error('Failed to fetch approved shared gallery groups');
        }
    },
    ['approved-shared-gallery-groups'],
    { tags: ['shared-gallery'], revalidate: 300 }
);

export const getSharedGalleryImageCount = unstable_cache(
    async (): Promise<number> => {
        try {
            const result = await sql`
                SELECT COUNT(*) as count FROM shared_gallery_submissions 
                WHERE status = 'approved'
            `;
            return Number(result[0].count) || 0;
        } catch (error) {
            console.error('Error fetching shared gallery image count:', error);
            throw new Error('Failed to fetch shared gallery image count');
        }
    },
    ['shared-gallery-image-count'],
    { tags: ['shared-gallery'], revalidate: 300 }
);

export async function getSharedGallerySubmissionById(
    id: string
): Promise<SharedGallerySubmission | null> {
    try {
        const result = await sql`
            SELECT * FROM shared_gallery_submissions 
            WHERE id = ${id}
        `;
        if (result.length === 0) return null;
        return convertToSharedGallerySubmission(result[0]);
    } catch (error) {
        console.error('Error fetching shared gallery submission:', error);
        throw new Error('Failed to fetch shared gallery submission');
    }
}

export async function approveSharedGallerySubmission(
    id: string,
    reviewedBy: string
): Promise<SharedGallerySubmission> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'approved',
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            throw new Error('Submission not found');
        }
        return convertToSharedGallerySubmission(result[0]);
    } catch (error) {
        console.error('Error approving shared gallery submission:', error);
        throw new Error('Failed to approve shared gallery submission');
    }
}

export async function approveAllInGroup(
    submissionGroupId: string,
    reviewedBy: string
): Promise<number> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'approved',
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy},
                updated_at = CURRENT_TIMESTAMP
            WHERE submission_group_id = ${submissionGroupId}
            AND status = 'pending'
            RETURNING *
        `;
        return result.length;
    } catch (error) {
        console.error('Error approving all submissions in group:', error);
        throw new Error('Failed to approve all submissions in group');
    }
}

export async function rejectAllInGroup(
    submissionGroupId: string,
    reviewedBy: string,
    reason?: string
): Promise<number> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'rejected',
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy},
                rejection_reason = ${reason || null},
                updated_at = CURRENT_TIMESTAMP
            WHERE submission_group_id = ${submissionGroupId}
            AND status = 'pending'
            RETURNING *
        `;
        return result.length;
    } catch (error) {
        console.error('Error rejecting all submissions in group:', error);
        throw new Error('Failed to reject all submissions in group');
    }
}

export async function rejectSharedGallerySubmission(
    id: string,
    reviewedBy: string,
    reason?: string
): Promise<SharedGallerySubmission> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'rejected',
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy},
                rejection_reason = ${reason || null},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            throw new Error('Submission not found');
        }
        return convertToSharedGallerySubmission(result[0]);
    } catch (error) {
        console.error('Error rejecting shared gallery submission:', error);
        throw new Error('Failed to reject shared gallery submission');
    }
}

export async function resetSharedGallerySubmissionToPending(
    id: string
): Promise<SharedGallerySubmission> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'pending',
                reviewed_at = NULL,
                reviewed_by = NULL,
                rejection_reason = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            throw new Error('Submission not found');
        }
        return convertToSharedGallerySubmission(result[0]);
    } catch (error) {
        console.error(
            'Error resetting shared gallery submission to pending:',
            error
        );
        throw new Error('Failed to reset shared gallery submission to pending');
    }
}

export async function resetAllInGroupToPending(
    submissionGroupId: string
): Promise<number> {
    try {
        const result = await sql`
            UPDATE shared_gallery_submissions 
            SET status = 'pending',
                reviewed_at = NULL,
                reviewed_by = NULL,
                rejection_reason = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE submission_group_id = ${submissionGroupId}
            AND status != 'pending'
            RETURNING *
        `;
        return result.length;
    } catch (error) {
        console.error(
            'Error resetting all submissions in group to pending:',
            error
        );
        throw new Error('Failed to reset all submissions in group to pending');
    }
}

export async function deleteSharedGallerySubmission(id: string): Promise<void> {
    try {
        // First delete any associated reports due to foreign key if exists, 
        // or just to maintain clean state if no FK. 
        // Based on the schema inferred, it's better to do it explicitly or rely on CASCADE if configured.
        // Assuming we should be explicit for safety.
        await sql`
            DELETE FROM shared_gallery_reports 
            WHERE submission_id = ${id}
        `;

        await sql`
            DELETE FROM shared_gallery_submissions 
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Error deleting shared gallery submission:', error);
        throw new Error('Failed to delete shared gallery submission');
    }
}

export async function deleteSharedGallerySubmissionGroup(
    submissionGroupId: string
): Promise<void> {
    try {
        // Delete all reports for all submissions in the group
        await sql`
            DELETE FROM shared_gallery_reports 
            WHERE submission_id IN (
                SELECT id FROM shared_gallery_submissions 
                WHERE submission_group_id = ${submissionGroupId}
            )
        `;

        // Delete all submissions in the group
        await sql`
            DELETE FROM shared_gallery_submissions 
            WHERE submission_group_id = ${submissionGroupId}
        `;
    } catch (error) {
        console.error('Error deleting shared gallery submission group:', error);
        throw new Error('Failed to delete shared gallery submission group');
    }
}

export async function getSubmissionsInGroup(
    submissionGroupId: string
): Promise<SharedGallerySubmission[]> {
    try {
        const result = await sql`
            SELECT * FROM shared_gallery_submissions 
            WHERE submission_group_id = ${submissionGroupId}
        `;
        return result.map(convertToSharedGallerySubmission);
    } catch (error) {
        console.error('Error fetching submissions in group:', error);
        throw new Error('Failed to fetch submissions in group');
    }
}

// Gallery Reports
export interface GalleryReport {
    id: string;
    submissionId: string;
    reason: string;
    reporterInfo?: string;
    status: 'pending' | 'reviewed' | 'dismissed';
    reviewedAt?: Date;
    reviewedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    // Joined data from submission
    imageUrl?: string;
    title?: string;
    submitterName?: string;
}

function convertToGalleryReport(row: Record<string, unknown>): GalleryReport {
    return {
        id: String(row.id),
        submissionId: String(row.submission_id),
        reason: String(row.reason),
        reporterInfo: row.reporter_info ? String(row.reporter_info) : undefined,
        status: String(row.status) as 'pending' | 'reviewed' | 'dismissed',
        reviewedAt: row.reviewed_at
            ? new Date(String(row.reviewed_at))
            : undefined,
        reviewedBy: row.reviewed_by ? String(row.reviewed_by) : undefined,
        createdAt: new Date(String(row.created_at)),
        updatedAt: new Date(String(row.updated_at)),
        imageUrl: row.image_url ? String(row.image_url) : undefined,
        title: row.title ? String(row.title) : undefined,
        submitterName: row.submitter_name
            ? String(row.submitter_name)
            : undefined,
    };
}

export async function createGalleryReport(
    submissionId: string,
    reason: string,
    reporterInfo?: string
): Promise<GalleryReport> {
    try {
        const result = await sql`
            INSERT INTO shared_gallery_reports (submission_id, reason, reporter_info)
            VALUES (${submissionId}, ${reason}, ${reporterInfo || null})
            RETURNING *
        `;
        return convertToGalleryReport(result[0]);
    } catch (error) {
        console.error('Error creating gallery report:', error);
        throw new Error('Failed to create gallery report');
    }
}

export const getGalleryReports = unstable_cache(
    async (
        status?: 'pending' | 'reviewed' | 'dismissed'
    ): Promise<GalleryReport[]> => {
        try {
            // Image data stays out of this query; admins fetch the URL lazily when needed
            const result = status
                ? await sql`
                                                                                SELECT r.*, s.title, s.submitter_name, s.image_url, s.image_storage_path
                                        FROM shared_gallery_reports r
                                        JOIN shared_gallery_submissions s ON r.submission_id = s.id
                                        WHERE r.status = ${status}
                                        ORDER BY r.created_at DESC
                                    `
                : await sql`
                                                                                SELECT r.*, s.title, s.submitter_name, s.image_url, s.image_storage_path
                                        FROM shared_gallery_reports r
                                        JOIN shared_gallery_submissions s ON r.submission_id = s.id
                                        ORDER BY r.created_at DESC
                                    `;
            return result.map(convertToGalleryReport);
        } catch (error) {
            console.error('Error fetching gallery reports:', error);
            throw new Error('Failed to fetch gallery reports');
        }
    },
    ['gallery-reports'],
    { tags: ['gallery-reports'], revalidate: 60 }
);

export async function updateGalleryReportStatus(
    id: string,
    status: 'reviewed' | 'dismissed',
    reviewedBy: string
): Promise<GalleryReport> {
    try {
        const result = await sql`
            UPDATE shared_gallery_reports
            SET status = ${status},
                reviewed_at = CURRENT_TIMESTAMP,
                reviewed_by = ${reviewedBy},
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (result.length === 0) {
            throw new Error('Report not found');
        }
        return convertToGalleryReport(result[0]);
    } catch (error) {
        console.error('Error updating gallery report status:', error);
        throw new Error('Failed to update gallery report status');
    }
}
export async function deleteGalleryReport(id: string): Promise<void> {
    try {
        await sql`
            DELETE FROM shared_gallery_reports 
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Error deleting gallery report:', error);
        throw new Error('Failed to delete gallery report');
    }
}
