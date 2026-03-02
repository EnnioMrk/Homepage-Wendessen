import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { sql } from '@/lib/sql';

export interface PendingTask {
    type: 'portrait' | 'shared_gallery';
    count: number;
    label: string;
    href: string;
}

export interface PendingTasksResponse {
    tasks: PendingTask[];
    totalCount: number;
}

export async function GET() {
    await connection();
    try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const currentUser = await getCurrentAdminUser();
        const tasks: PendingTask[] = [];

        // Check pending portraits if user has permission
        if (hasPermission(currentUser, 'portraits.view')) {
            const portraitResult = await sql`
                SELECT COUNT(*) as count 
                FROM portraits 
                WHERE status = 'pending'
            `;
            const pendingPortraits = Number(portraitResult[0]?.count) || 0;

            if (pendingPortraits > 0) {
                tasks.push({
                    type: 'portrait',
                    count: pendingPortraits,
                    label:
                        pendingPortraits === 1
                            ? '1 Portrait wartet auf Freigabe'
                            : `${pendingPortraits} Portraits warten auf Freigabe`,
                    href: '/admin/portraits',
                });
            }
        }

        // Check pending shared gallery submissions if user has permission
        // Count distinct submission groups, not individual images
        if (hasPermission(currentUser, 'shared_gallery.view')) {
            const galleryResult = await sql`
                SELECT COUNT(DISTINCT submission_group_id) as count 
                FROM shared_gallery_submissions 
                WHERE status = 'pending'
            `;
            const pendingGallery = Number(galleryResult[0]?.count) || 0;

            if (pendingGallery > 0) {
                tasks.push({
                    type: 'shared_gallery',
                    count: pendingGallery,
                    label:
                        pendingGallery === 1
                            ? '1 Impression wartet auf Freigabe'
                            : `${pendingGallery} Impressionen warten auf Freigabe`,
                    href: '/admin/shared-gallery',
                });
            }
        }

        const totalCount = tasks.reduce((sum, task) => sum + task.count, 0);

        return NextResponse.json({
            tasks,
            totalCount,
        } as PendingTasksResponse);
    } catch (error) {
        console.error('Error fetching pending tasks:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
