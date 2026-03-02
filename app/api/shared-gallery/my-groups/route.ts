import { NextResponse } from 'next/server';
import { connection } from 'next/server';
import { getSharedGallerySubmissionGroups } from '@/lib/database';

export async function GET(request: Request) {
    await connection();
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        // Get all groups (pending and approved)
        const result = await getSharedGallerySubmissionGroups();
        const allGroups = result.groups;

        // Filter by email if provided, otherwise return all
        const filteredGroups = email
            ? allGroups.filter((group) => group.submitterEmail === email)
            : allGroups;

        // Return unique groups with basic info
        const uniqueGroups = filteredGroups.map((group) => ({
            submissionGroupId: group.submissionGroupId,
            title: group.title,
            description: group.description,
            submitterNames: group.submitterNames,
            totalCount: group.totalCount,
            pendingCount: group.pendingCount,
            approvedCount: group.approvedCount,
        }));

        return NextResponse.json({ groups: uniqueGroups });
    } catch (error) {
        console.error('Error fetching my groups:', error);
        return NextResponse.json(
            { error: 'Failed to fetch groups' },
            { status: 500 },
        );
    }
}
