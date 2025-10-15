import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/permissions';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

// Generate a random 6-digit number
function generateInitialPassword(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
    try {
        await requirePermission('users.create');

        const { username, roleId } = await request.json();

        if (!username || typeof username !== 'string') {
            return NextResponse.json(
                { error: 'Username is required' },
                { status: 400 }
            );
        }

        // Validate username format (alphanumeric, underscore, dash)
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return NextResponse.json(
                { error: 'Username can only contain letters, numbers, underscores, and dashes' },
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

        // If no roleId provided, get the default 'admin' role
        let finalRoleId = roleId;
        if (!finalRoleId) {
            const defaultRole = await sql`
                SELECT id FROM roles WHERE name = 'admin' LIMIT 1
            `;
            if (defaultRole.length > 0) {
                finalRoleId = Number(defaultRole[0].id);
            }
        }

        // Generate initial password
        const initialPassword = generateInitialPassword();
        const hashedPassword = await bcrypt.hash(initialPassword, 10);

        // Create the admin user
        const result = await sql`
            INSERT INTO admin_users (username, password_hash, must_change_password, role_id)
            VALUES (${username}, ${hashedPassword}, true, ${finalRoleId || null})
            RETURNING id, username, must_change_password, created_at, role_id
        `;

        const newUser = result[0];

        return NextResponse.json({
            user: {
                id: Number(newUser.id),
                username: String(newUser.username),
                mustChangePassword: Boolean(newUser.must_change_password),
                createdAt: new Date(String(newUser.created_at)),
                roleId: newUser.role_id ? Number(newUser.role_id) : undefined,
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
