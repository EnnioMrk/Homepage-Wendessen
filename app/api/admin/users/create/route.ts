import { NextRequest, NextResponse } from 'next/server';
import {
    requirePermission,
    getRoleDefaultPermissions,
} from '@/lib/permissions';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/sql';
import { getCurrentAdminUser } from '@/lib/auth';
import { logAdminAction, getRequestInfo } from '@/lib/admin-log';

// Generate a random 6-digit number
function generateInitialPassword(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
    try {
        await requirePermission('users.create');

        const { username, roleId, vereinId } = await request.json();

        if (!username || typeof username !== 'string') {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        // Validate username format (alphanumeric, underscore, dash)
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return NextResponse.json(
                {
                    error: 'Username can only contain letters, numbers, underscores, and dashes',
                },
                { status: 400 }
            );
        }

        // Check if username already exists
        const existing = await sql`
            SELECT id FROM admin_users WHERE username = ${username}
        `;

        if (existing.length > 0) {
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 409 }
            );
        }

        // Generate initial password
        const initialPassword = generateInitialPassword();
        const hashedPassword = await bcrypt.hash(initialPassword, 10);

        // Get role name to assign default permissions
        let defaultPermissions: string[] = [];
        const finalRoleId = roleId || null;

        if (finalRoleId) {
            const roleResult = await sql`
                SELECT name FROM roles WHERE id = ${finalRoleId} LIMIT 1
            `;
            if (roleResult.length > 0) {
                const roleName = String(roleResult[0].name);
                defaultPermissions = await getRoleDefaultPermissions(roleName);
            }
        }
        // If no roleId provided, user gets empty permissions array

        // Create the admin user with default permissions assigned
        const result = await sql`
            INSERT INTO admin_users (username, password_hash, must_change_password, role_id, verein_id, custom_permissions)
            VALUES (${username}, ${hashedPassword}, true, ${finalRoleId}, ${
            vereinId || null
        }, ${JSON.stringify(defaultPermissions)})
            RETURNING id, username, must_change_password, created_at, role_id, verein_id
        `;

        const newUser = result[0];

        // Log the action
        const currentUser = await getCurrentAdminUser();
        const requestInfo = getRequestInfo(request);

        // Get role name for logging
        let roleName: string | undefined;
        if (finalRoleId) {
            const roleInfo =
                await sql`SELECT name, display_name FROM roles WHERE id = ${finalRoleId} LIMIT 1`;
            if (roleInfo.length > 0) {
                roleName = String(roleInfo[0].display_name || roleInfo[0].name);
            }
        }

        logAdminAction({
            userId: currentUser?.id,
            username: currentUser?.username,
            action: 'user.create',
            resourceType: 'user',
            resourceId: String(newUser.id),
            resourceTitle: String(newUser.username),
            details: {
                role: roleName,
                vereinId: vereinId || undefined,
            },
            ...requestInfo,
        });

        return NextResponse.json({
            user: {
                id: Number(newUser.id),
                username: String(newUser.username),
                mustChangePassword: Boolean(newUser.must_change_password),
                createdAt: new Date(String(newUser.created_at)),
                roleId: newUser.role_id ? Number(newUser.role_id) : undefined,
                vereinId: newUser.verein_id
                    ? String(newUser.verein_id)
                    : undefined,
            },
            initialPassword, // Return this only once for the admin to share with the new user
        });
    } catch (error) {
        console.error('Error creating admin user:', error);
        return NextResponse.json(
            { error: 'Failed to create admin user' },
            { status: 500 }
        );
    }
}
