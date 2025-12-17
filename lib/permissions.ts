import { getCurrentAdminUser, AdminUser } from './auth';

// Define role default permissions (used as templates at user creation)
export const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
    super_admin: ['*'], // Super admin has all permissions
    admin: [
        // Users
        'users.view',
        'users.create',
        'users.edit',
        'users.delete',
        // Events
        'events.view',
        'events.create',
        'events.edit',
        'events.delete',
        'events.cancel',
        // News
        'news.view',
        'news.create',
        'news.edit',
        'news.delete',
        // Gallery
        'gallery.view',
        'gallery.upload',
        'gallery.edit',
        'gallery.delete',
        // Shared Gallery
        'shared_gallery.view',
        'shared_gallery.edit',
        'shared_gallery.delete',
        // Portraits
        'portraits.view',
        'portraits.edit',
        'portraits.delete',
        // Archive
        'archive.view',
        'archive.create',
        'archive.edit',
        'archive.delete',
        // Settings
        'settings.view',
        'settings.edit',
        // Wendessen Layouts
        'wendessen.view',
        'wendessen.manage',
        // log
        'logs.view',
    ],
    editor: [
        // Events
        'events.view',
        'events.create',
        'events.edit',
        'events.cancel',
        // News
        'news.view',
        'news.create',
        'news.edit',
        // Gallery
        'gallery.view',
        'gallery.upload',
        'gallery.edit',
        // Archive
        'archive.view',
        'archive.create',
        'archive.edit',
    ],
    moderator: [
        // View only for content
        'events.view',
        'news.view',
        'gallery.view',
        // Approval / moderation permissions consolidated into edit
        'shared_gallery.view',
        'shared_gallery.edit',
        'portraits.view',
        'portraits.edit',
    ],
    vereinsverwalter: [
        // Verein-specific permissions
        'verein.events.create',
        'verein.events.edit',
        'verein.events.cancel',
        // Gallery permissions
        'gallery.view',
        'gallery.upload',
        'gallery.edit',
    ],
    no_permissions: [
        // No permissions - for testing permission restrictions
    ],
};

/**
 * Get default permissions for a role (used as template)
 */
export function getRoleDefaultPermissions(roleName: string): string[] {
    return ROLE_DEFAULT_PERMISSIONS[roleName] || [];
}

/**
 * Check if a user has a specific permission
 * Now purely permission-based - roles are just for organizing/grouping
 */
export function hasPermission(
    user: AdminUser | null,
    permission: string
): boolean {
    if (!user) return false;

    const perms = user.customPermissions || [];

    // Check if user has wildcard permission
    if (perms.includes('*')) {
        return true;
    }

    // Check for exact permission match
    if (perms.includes(permission)) {
        return true;
    }

    // Check for category-level wildcard (e.g., 'events.*' allows 'events.create')
    if (user.customPermissions) {
        const [category] = permission.split('.');
        if (perms.includes(`${category}.*`)) {
            return true;
        }
        // Check if user has verein.* permission for the general permission
        // Only grant .view permissions automatically if user has verein permissions in that category
        if (
            permission.endsWith('.view') &&
            perms.some((p) => p.startsWith(`verein.${category}.`))
        ) {
            return true;
        }
    }

    return false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
    user: AdminUser | null,
    permissions: string[]
): boolean {
    return permissions.some((permission) => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
    user: AdminUser | null,
    permissions: string[]
): boolean {
    return permissions.every((permission) => hasPermission(user, permission));
}

/**
 * Require a specific permission - throws error if not authorized
 */
export async function requirePermission(
    permission: string
): Promise<AdminUser> {
    const user = await getCurrentAdminUser();

    if (!user) {
        throw new Error('Unauthorized: Not authenticated');
    }

    if (!hasPermission(user, permission)) {
        // Diagnostic log to help track down permission mismatches (will show user's normalized permissions)
        try {
            console.error(
                `Permission denied: user=${user.username} (id=${user.id}) missing '${permission}' - user.perms=`,
                user.customPermissions || []
            );
        } catch {
            // swallow logging errors
        }

        throw new Error(`Forbidden: Missing permission '${permission}'`);
    }

    return user;
}

/**
 * Require any of the specified permissions - throws error if not authorized
 */
export async function requireAnyPermission(
    permissions: string[]
): Promise<AdminUser> {
    const user = await getCurrentAdminUser();

    if (!user) {
        throw new Error('Unauthorized: Not authenticated');
    }

    if (!hasAnyPermission(user, permissions)) {
        throw new Error(
            `Forbidden: Missing one of permissions: ${permissions.join(', ')}`
        );
    }

    return user;
}

/**
 * Require all of the specified permissions - throws error if not authorized
 */
export async function requireAllPermissions(
    permissions: string[]
): Promise<AdminUser> {
    const user = await getCurrentAdminUser();

    if (!user) {
        throw new Error('Unauthorized: Not authenticated');
    }

    if (!hasAllPermissions(user, permissions)) {
        throw new Error(
            `Forbidden: Missing required permissions: ${permissions.join(', ')}`
        );
    }

    return user;
}

/**
 * Get default permissions for a user's role (used for calculating extras)
 */
export function getRoleDefaultPermissionsForUser(
    user: AdminUser | null
): string[] {
    if (!user || !user.roleName) return [];
    return getRoleDefaultPermissions(user.roleName);
}

/**
 * Get all permissions for the current user
 * Now stored directly in customPermissions (no more role-based inheritance)
 */
export function getUserPermissions(user: AdminUser | null): string[] {
    if (!user) return [];
    return user.customPermissions || [];
}

/**
 * Calculate extra permissions beyond role defaults
 * Used for UI display to show which permissions are additional
 */
export function getExtraPermissions(user: AdminUser | null): string[] {
    if (!user) return [];

    const userPerms = new Set(user.customPermissions || []);
    const defaultPerms = new Set(
        getRoleDefaultPermissions(user.roleName || '')
    );

    // Wildcard permissions are always considered extra
    if (userPerms.has('*')) {
        return ['*'];
    }

    // Return permissions that are not in the default set
    return Array.from(userPerms).filter((perm) => !defaultPerms.has(perm));
}

/**
 * Permission categories for UI organization
 */
export const PERMISSION_CATEGORIES = {
    users: 'Benutzerverwaltung',
    events: 'Termine',
    news: 'Neuigkeiten',
    gallery: 'Galerie',
    shared_gallery: 'Impressionen',
    portraits: 'Portraits',
    archive: 'Archiv',
    settings: 'Einstellungen',
    verein: 'Vereinsverwaltung',
} as const;

/**
 * Get category for a permission
 */
export function getPermissionCategory(
    permission: string
): keyof typeof PERMISSION_CATEGORIES | 'other' {
    const [category] = permission.split('.');
    return category in PERMISSION_CATEGORIES
        ? (category as keyof typeof PERMISSION_CATEGORIES)
        : 'other';
}

/**
 * Middleware helper for API routes
 */
export async function withPermission<T>(
    permission: string,
    handler: (user: AdminUser) => Promise<T>
): Promise<T> {
    const user = await requirePermission(permission);
    return handler(user);
}

/**
 * Middleware helper for API routes requiring any permission
 */
export async function withAnyPermission<T>(
    permissions: string[],
    handler: (user: AdminUser) => Promise<T>
): Promise<T> {
    const user = await requireAnyPermission(permissions);
    return handler(user);
}

/**
 * Check if permission checking is enabled
 */
export function isPermissionCheckingEnabled(): boolean {
    return process.env.ENABLE_PERMISSION_CHECKING !== 'false';
}

/**
 * Soft permission check (returns boolean, doesn't throw)
 */
export async function canPerformAction(permission: string): Promise<boolean> {
    if (!isPermissionCheckingEnabled()) {
        return true; // Allow all actions if checking is disabled
    }

    const user = await getCurrentAdminUser();
    return hasPermission(user, permission);
}
