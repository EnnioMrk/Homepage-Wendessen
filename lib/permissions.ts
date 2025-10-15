import { getCurrentAdminUser, AdminUser } from './auth';

// Define role-permission mappings
const ROLE_PERMISSIONS: Record<string, string[]> = {
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
        'shared_gallery.approve',
        'shared_gallery.reject',
        // Portraits
        'portraits.view',
        'portraits.approve',
        'portraits.reject',
        // Settings
        'settings.view',
        'settings.edit',
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
    ],
    moderator: [
        // View only for content
        'events.view',
        'news.view',
        'gallery.view',
        // Approval permissions
        'shared_gallery.view',
        'shared_gallery.approve',
        'shared_gallery.reject',
        'portraits.view',
        'portraits.approve',
        'portraits.reject',
    ],
};

// Default permissions for Verein roles (roles starting with 'verein_')
const VEREIN_DEFAULT_PERMISSIONS = [
    'verein.events.create',
    'verein.events.edit',
    'verein.events.cancel',
    'verein.news.create',
    'verein.news.edit',
    'verein.news.delete',
    'verein.gallery.upload',
    'verein.gallery.edit',
    'verein.gallery.delete',
];

/**
 * Check if a role is a Verein role
 */
function isVereinRole(roleName: string): boolean {
    return roleName.startsWith('verein_');
}

/**
 * Get all permissions for a role
 */
function getRolePermissions(roleName: string): string[] {
    // Check standard roles first
    if (ROLE_PERMISSIONS[roleName]) {
        return ROLE_PERMISSIONS[roleName];
    }
    
    // Check if it's a Verein role
    if (isVereinRole(roleName)) {
        return VEREIN_DEFAULT_PERMISSIONS;
    }
    
    return [];
}

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: AdminUser | null, permission: string): boolean {
    if (!user) return false;

    // Super admin always has all permissions
    if (user.roleName === 'super_admin') {
        return true;
    }

    // Check custom permissions first
    if (user.customPermissions && user.customPermissions.includes(permission)) {
        return true;
    }

    // Check role-based permissions
    if (user.roleName) {
        const rolePermissions = getRolePermissions(user.roleName);
        
        // Check for wildcard or specific permission
        if (rolePermissions.includes('*') || rolePermissions.includes(permission)) {
            return true;
        }

        // Check for category-level wildcard (e.g., 'events.*' allows 'events.create')
        const [category] = permission.split('.');
        if (rolePermissions.includes(`${category}.*`)) {
            return true;
        }
    }

    return false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(user: AdminUser | null, permissions: string[]): boolean {
    return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(user: AdminUser | null, permissions: string[]): boolean {
    return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Require a specific permission - throws error if not authorized
 */
export async function requirePermission(permission: string): Promise<AdminUser> {
    const user = await getCurrentAdminUser();
    
    if (!user) {
        throw new Error('Unauthorized: Not authenticated');
    }

    if (!hasPermission(user, permission)) {
        throw new Error(`Forbidden: Missing permission '${permission}'`);
    }

    return user;
}

/**
 * Require any of the specified permissions - throws error if not authorized
 */
export async function requireAnyPermission(permissions: string[]): Promise<AdminUser> {
    const user = await getCurrentAdminUser();
    
    if (!user) {
        throw new Error('Unauthorized: Not authenticated');
    }

    if (!hasAnyPermission(user, permissions)) {
        throw new Error(`Forbidden: Missing one of permissions: ${permissions.join(', ')}`);
    }

    return user;
}

/**
 * Require all of the specified permissions - throws error if not authorized
 */
export async function requireAllPermissions(permissions: string[]): Promise<AdminUser> {
    const user = await getCurrentAdminUser();
    
    if (!user) {
        throw new Error('Unauthorized: Not authenticated');
    }

    if (!hasAllPermissions(user, permissions)) {
        throw new Error(`Forbidden: Missing required permissions: ${permissions.join(', ')}`);
    }

    return user;
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: AdminUser | null, roleName: string): boolean {
    if (!user) return false;
    return user.roleName === roleName;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: AdminUser | null, roleNames: string[]): boolean {
    if (!user) return false;
    return roleNames.some(roleName => hasRole(user, roleName));
}

/**
 * Check if user belongs to a Verein
 */
export function isVereinUser(user: AdminUser | null): boolean {
    if (!user || !user.roleName) return false;
    return isVereinRole(user.roleName);
}

/**
 * Get the Verein ID from a Verein role name
 * Example: 'verein_sv-wendessen' returns 'sv-wendessen'
 */
export function getVereinIdFromRole(roleName: string): string | null {
    if (!isVereinRole(roleName)) return null;
    return roleName.replace('verein_', '');
}

/**
 * Get all permissions for the current user (combined role + custom)
 */
export function getUserPermissions(user: AdminUser | null): string[] {
    if (!user) return [];

    const permissions = new Set<string>();

    // Add role permissions
    if (user.roleName) {
        const rolePerms = getRolePermissions(user.roleName);
        rolePerms.forEach(perm => permissions.add(perm));
    }

    // Add custom permissions
    if (user.customPermissions) {
        user.customPermissions.forEach(perm => permissions.add(perm));
    }

    return Array.from(permissions);
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
    settings: 'Einstellungen',
    verein: 'Vereinsverwaltung',
} as const;

/**
 * Get category for a permission
 */
export function getPermissionCategory(permission: string): keyof typeof PERMISSION_CATEGORIES | 'other' {
    const [category] = permission.split('.');
    return category in PERMISSION_CATEGORIES 
        ? category as keyof typeof PERMISSION_CATEGORIES 
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
