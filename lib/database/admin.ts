import { sql } from '../sql';

export interface Role {
    id: number;
    name: string;
    displayName: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Permission {
    id: number;
    name: string;
    displayName: string;
    description?: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
}

function convertToRole(row: Record<string, unknown>): Role {
    return {
        id: Number(row.id),
        name: String(row.name),
        displayName: String(row.display_name),
        description: row.description ? String(row.description) : undefined,
        createdAt: new Date(String(row.created_at)),
        updatedAt: new Date(String(row.updated_at)),
    };
}

function convertToPermission(row: Record<string, unknown>): Permission {
    return {
        id: Number(row.id),
        name: String(row.name),
        displayName: String(row.display_name),
        description: row.description ? String(row.description) : undefined,
        category: row.category ? String(row.category) : undefined,
        createdAt: new Date(String(row.created_at)),
        updatedAt: new Date(String(row.updated_at)),
    };
}

export interface AdminUserRecord {
    id: number;
    username: string;
    mustChangePassword: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
    roleId?: number;
    roleName?: string;
    roleDisplayName?: string;
    customPermissions: string[];
    roleDefaultPermissions?: string[];
    vereinId?: string;
}

function convertToAdminUserRecord(
    row: Record<string, unknown>
): AdminUserRecord {
    const rawCustomPermissions = row.custom_permissions
        ? Array.isArray(row.custom_permissions)
            ? row.custom_permissions
            : JSON.parse(String(row.custom_permissions))
        : [];

    const rawRoleDefaultPermissions = row.role_default_permissions
        ? Array.isArray(row.role_default_permissions)
            ? row.role_default_permissions
            : JSON.parse(String(row.role_default_permissions))
        : undefined;

    return {
        id: Number(row.id),
        username: String(row.username),
        mustChangePassword: Boolean(row.must_change_password),
        createdAt: new Date(String(row.created_at)),
        updatedAt: new Date(String(row.updated_at)),
        lastLogin: row.last_login
            ? new Date(String(row.last_login))
            : undefined,
        roleId: row.role_id ? Number(row.role_id) : undefined,
        roleName: row.role_name ? String(row.role_name) : undefined,
        roleDisplayName: row.role_display_name
            ? String(row.role_display_name)
            : undefined,
        vereinId: row.verein_id ? String(row.verein_id) : undefined,
        customPermissions: removeExcludedPermissions(
            rawCustomPermissions as string[]
        ),
        roleDefaultPermissions: rawRoleDefaultPermissions
            ? removeExcludedPermissions(rawRoleDefaultPermissions as string[])
            : undefined,
    };
}

export async function getAllAdminUsers(): Promise<AdminUserRecord[]> {
    try {
        const result = await sql`
            SELECT 
                u.id, 
                u.username, 
                u.must_change_password, 
                u.created_at, 
                u.updated_at, 
                u.last_login,
                u.role_id,
                u.verein_id,
                u.custom_permissions,
                r.name as role_name,
                r.display_name as role_display_name,
                r.default_permissions as role_default_permissions
            FROM admin_users u
            LEFT JOIN roles r ON u.role_id = r.id
            ORDER BY u.created_at DESC
        `;
        return result.map(convertToAdminUserRecord);
    } catch (error) {
        console.error('Error fetching admin users:', error);
        throw new Error('Failed to fetch admin users');
    }
}

export async function getAdminUserById(
    id: number
): Promise<AdminUserRecord | null> {
    try {
        const result = await sql`
            SELECT 
                u.id, 
                u.username, 
                u.must_change_password, 
                u.created_at, 
                u.updated_at, 
                u.last_login,
                u.role_id,
                u.verein_id,
                u.custom_permissions,
                r.name as role_name,
                r.display_name as role_display_name,
                r.default_permissions as role_default_permissions
            FROM admin_users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.id = ${id}
        `;
        if (result.length === 0) return null;
        return convertToAdminUserRecord(result[0]);
    } catch (error) {
        console.error('Error fetching admin user:', error);
        throw new Error('Failed to fetch admin user');
    }
}

export async function deleteAdminUser(id: number): Promise<void> {
    try {
        const countResult = await sql`
            SELECT COUNT(*) as count FROM admin_users
        `;
        const adminCount = Number(countResult[0].count);

        if (adminCount <= 1) {
            throw new Error('Cannot delete the last admin user');
        }

        await sql`
            DELETE FROM admin_users
            WHERE id = ${id}
        `;
    } catch (error) {
        console.error('Error deleting admin user:', error);
        throw error;
    }
}

export async function getAllRoles(): Promise<Role[]> {
    try {
        const result = await sql`
            SELECT * FROM roles
            ORDER BY name ASC
        `;
        return result.map(convertToRole);
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw new Error('Failed to fetch roles');
    }
}

export async function getRoleById(id: number): Promise<Role | null> {
    try {
        const result = await sql`
            SELECT * FROM roles
            WHERE id = ${id}
        `;
        if (result.length === 0) return null;
        return convertToRole(result[0]);
    } catch (error) {
        console.error('Error fetching role:', error);
        throw new Error('Failed to fetch role');
    }
}

export async function getAllPermissions(): Promise<Permission[]> {
    try {
        const result = await sql`
            SELECT * FROM permissions
            ORDER BY category, name ASC
        `;
        return result.map(convertToPermission);
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw new Error('Failed to fetch permissions');
    }
}

const EXCLUDED_PERMISSION_PREFIXES = ['verein.news.'];

export async function getPermissionsByCategory(): Promise<
    Record<string, Permission[]>
> {
    try {
        const permissions = await getAllPermissions();
        const filteredPermissions = permissions.filter(
            (perm) =>
                !EXCLUDED_PERMISSION_PREFIXES.some((prefix) =>
                    perm.name.startsWith(prefix)
                )
        );
        const grouped: Record<string, Permission[]> = {};

        filteredPermissions.forEach((perm) => {
            const category = perm.category || 'other';
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(perm);
        });

        const wildcardPermission: Permission = {
            id: -1,
            name: '*',
            displayName: 'Alle Berechtigungen',
            description:
                'Gewährt Zugriff auf jede einzelne Berechtigung des Systems',
            category: 'system',
            createdAt: new Date(0),
            updatedAt: new Date(0),
        };

        if (!grouped.system) {
            grouped.system = [];
        }

        const alreadyHasWildcard = grouped.system.some(
            (perm) => perm.name === '*'
        );

        if (!alreadyHasWildcard) {
            grouped.system.unshift(wildcardPermission);
        }

        return grouped;
    } catch (error) {
        console.error('Error grouping permissions:', error);
        throw new Error('Failed to group permissions');
    }
}

export async function updateAdminUserRoleAndPermissions(
    id: number,
    roleId?: number,
    customPermissions?: string[],
    vereinId?: string | null
): Promise<AdminUserRecord> {
    try {
        const normalizedPermissions =
            normalizeCustomPermissions(customPermissions);

        const result = await sql`
            UPDATE admin_users
            SET role_id = ${roleId || null},
                custom_permissions = ${
                    normalizedPermissions !== null
                        ? JSON.stringify(normalizedPermissions)
                        : sql`custom_permissions`
                },
                verein_id = ${
                    vereinId === undefined ? sql`verein_id` : vereinId
                },
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;

        if (result.length === 0) {
            throw new Error('Admin user not found');
        }

        const updatedUser = await getAdminUserById(id);
        if (!updatedUser) {
            throw new Error('Failed to fetch updated user');
        }

        return updatedUser;
    } catch (error) {
        console.error('Error updating admin user role and permissions:', error);
        throw error;
    }
}

function removeExcludedPermissions(permissions: string[]): string[] {
    return permissions.filter(
        (permission) =>
            !EXCLUDED_PERMISSION_PREFIXES.some((prefix) =>
                permission.startsWith(prefix)
            )
    );
}

function normalizeCustomPermissions(permissions?: string[]): string[] | null {
    if (!Array.isArray(permissions)) {
        return null;
    }

    const uniquePermissions = Array.from(
        new Set(
            permissions
                .map((permission) => permission?.trim())
                .filter((permission): permission is string =>
                    Boolean(permission)
                )
        )
    );

    const filteredPermissions = removeExcludedPermissions(uniquePermissions);

    if (filteredPermissions.includes('*')) {
        return ['*'];
    }

    return filteredPermissions;
}
