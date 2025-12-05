import { sql } from './sql';

export type AdminAction =
    // Events
    | 'event.create'
    | 'event.update'
    | 'event.delete'
    | 'event.cancel'
    | 'event.uncancel'
    // News
    | 'news.create'
    | 'news.update'
    | 'news.delete'
    | 'news.pin'
    | 'news.unpin'
    // Gallery
    | 'gallery.upload'
    | 'gallery.edit'
    | 'gallery.delete'
    | 'shared_gallery.approve'
    | 'shared_gallery.reject'
    | 'shared_gallery.delete'
    // Portraits
    | 'portrait.approve'
    | 'portrait.reject'
    | 'portrait.reset'
    | 'portrait.delete'
    // Users
    | 'user.create'
    | 'user.update'
    | 'user.delete'
    | 'user.password_reset'
    // Settings
    | 'settings.update'
    // Auth
    | 'auth.login'
    | 'auth.logout'
    | 'auth.password_change'
    // Archive
    | 'archive.create'
    | 'archive.update'
    | 'archive.delete';

export interface LogEntry {
    userId?: number | null;
    username?: string;
    action: AdminAction;
    resourceType?: string;
    resourceId?: string | number;
    resourceTitle?: string;
    details?: Record<string, unknown>;
    ipAddress?: string | null;
    userAgent?: string | null;
}

/**
 * Log an admin action to the database (fire-and-forget, non-blocking)
 * This function does not await the database insert to avoid affecting response times
 */
export function logAdminAction(entry: LogEntry): void {
    // Fire and forget - don't await
    sql`
        INSERT INTO admin_logs (
            user_id,
            username,
            action,
            resource_type,
            resource_id,
            resource_title,
            details,
            ip_address,
            user_agent
        ) VALUES (
            ${entry.userId || null},
            ${entry.username || null},
            ${entry.action},
            ${entry.resourceType || null},
            ${entry.resourceId?.toString() || null},
            ${entry.resourceTitle || null},
            ${entry.details ? JSON.stringify(entry.details) : null},
            ${entry.ipAddress || null},
            ${entry.userAgent || null}
        )
    `.catch((error) => {
        // Don't throw - logging should not break the main operation
        console.error('Failed to log admin action:', error);
    });
}

/**
 * Extract IP address and user agent from request headers
 * Use this in API routes to pass to logAdminAction
 */
export function getRequestInfo(request: Request): {
    ipAddress: string | null;
    userAgent: string | null;
} {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress =
        forwardedFor?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        null;
    const userAgent = request.headers.get('user-agent') || null;
    return { ipAddress, userAgent };
}

export interface AdminLogEntry {
    id: number;
    userId: number | null;
    username: string | null;
    action: string;
    resourceType: string | null;
    resourceId: string | null;
    resourceTitle: string | null;
    details: Record<string, unknown> | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
}

/**
 * Get admin logs with pagination and filters
 */
export async function getAdminLogs(
    options: {
        page?: number;
        limit?: number;
        userId?: number;
        action?: string;
        resourceType?: string;
        startDate?: Date;
        endDate?: Date;
    } = {}
): Promise<{ logs: AdminLogEntry[]; total: number }> {
    const {
        page = 1,
        limit = 50,
        userId,
        action,
        resourceType,
        startDate,
        endDate,
    } = options;

    const offset = (page - 1) * limit;

    // Build dynamic query conditions
    let logs;
    let countResult;

    if (userId && action && resourceType && startDate && endDate) {
        logs = await sql`
            SELECT * FROM admin_logs 
            WHERE user_id = ${userId} 
              AND action = ${action}
              AND resource_type = ${resourceType}
              AND created_at >= ${startDate}
              AND created_at <= ${endDate}
            ORDER BY created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
        `;
        countResult = await sql`
            SELECT COUNT(*) as count FROM admin_logs 
            WHERE user_id = ${userId} 
              AND action = ${action}
              AND resource_type = ${resourceType}
              AND created_at >= ${startDate}
              AND created_at <= ${endDate}
        `;
    } else if (userId) {
        logs = await sql`
            SELECT * FROM admin_logs 
            WHERE user_id = ${userId}
            ORDER BY created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
        `;
        countResult = await sql`
            SELECT COUNT(*) as count FROM admin_logs 
            WHERE user_id = ${userId}
        `;
    } else if (action) {
        logs = await sql`
            SELECT * FROM admin_logs 
            WHERE action LIKE ${action + '%'}
            ORDER BY created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
        `;
        countResult = await sql`
            SELECT COUNT(*) as count FROM admin_logs 
            WHERE action LIKE ${action + '%'}
        `;
    } else if (resourceType) {
        logs = await sql`
            SELECT * FROM admin_logs 
            WHERE resource_type = ${resourceType}
            ORDER BY created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
        `;
        countResult = await sql`
            SELECT COUNT(*) as count FROM admin_logs 
            WHERE resource_type = ${resourceType}
        `;
    } else {
        logs = await sql`
            SELECT * FROM admin_logs 
            ORDER BY created_at DESC 
            LIMIT ${limit} OFFSET ${offset}
        `;
        countResult = await sql`SELECT COUNT(*) as count FROM admin_logs`;
    }

    return {
        logs: logs.map((row) => ({
            id: row.id as number,
            userId: row.user_id as number | null,
            username: row.username as string | null,
            action: row.action as string,
            resourceType: row.resource_type as string | null,
            resourceId: row.resource_id as string | null,
            resourceTitle: row.resource_title as string | null,
            details: row.details as Record<string, unknown> | null,
            ipAddress: row.ip_address as string | null,
            userAgent: row.user_agent as string | null,
            createdAt: new Date(row.created_at as string),
        })),
        total: Number(countResult[0].count),
    };
}

// Re-export client-safe utilities for backwards compatibility
export { getActionDescription, getActionColor } from './admin-log-utils';
