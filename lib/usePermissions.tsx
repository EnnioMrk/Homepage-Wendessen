'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AdminUser {
    id: number;
    username: string;
    roleName?: string;
    roleDisplayName?: string;
    customPermissions: string[];
    vereinId?: string | null;
}

interface PermissionsContextType {
    user: AdminUser | null;
    loading: boolean;
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    refresh: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// Role default permissions (same as server-side, used as templates)
export const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
    super_admin: ['*'],
    admin: [
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'events.view', 'events.create', 'events.edit', 'events.delete',
        'news.view', 'news.create', 'news.edit', 'news.delete',
        'gallery.view', 'gallery.upload', 'gallery.edit', 'gallery.delete',
        'shared_gallery.view', 'shared_gallery.approve', 'shared_gallery.reject',
        'portraits.view', 'portraits.edit', 'portraits.delete',
        'settings.view', 'settings.edit',
    ],
    editor: [
        'events.view', 'events.create', 'events.edit', 'events.cancel',
        'news.view', 'news.create', 'news.edit',
        'gallery.view', 'gallery.upload', 'gallery.edit',
    ],
    moderator: [
        'events.view', 'news.view', 'gallery.view',
        'shared_gallery.view', 'shared_gallery.approve', 'shared_gallery.reject',
        'portraits.view', 'portraits.edit',
    ],
    vereinsverwalter: [
        'verein.events.create',
        'verein.events.edit',
        'verein.events.cancel',
        'gallery.view',
        'gallery.upload',
        'gallery.edit',
    ],
    no_permissions: [],
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
function checkPermission(user: AdminUser | null, permission: string): boolean {
    if (!user) return false;
    
    // Check if user has wildcard permission
    if (user.customPermissions && user.customPermissions.includes('*')) {
        return true;
    }
    
    // Check for exact permission match
    if (user.customPermissions && user.customPermissions.includes(permission)) {
        return true;
    }
    
    // Check for category-level wildcard (e.g., 'events.*' allows 'events.create')
    if (user.customPermissions) {
        const [category] = permission.split('.');
        if (user.customPermissions.includes(`${category}.*`)) {
            return true;
        }

        // Check if user has verein.* permission for the general permission
        // Only grant .view permissions automatically if user has verein permissions in that category
        if (permission.endsWith('.view') && user.customPermissions.some(p => p.startsWith(`verein.${category}.`))) {
            return true;
        }
    }
    
    return false;
}

export function PermissionsProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        try {
            const response = await fetch('/api/admin/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error loading user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const value: PermissionsContextType = {
        user,
        loading,
        hasPermission: (permission: string) => checkPermission(user, permission),
        hasAnyPermission: (permissions: string[]) => 
            permissions.some(p => checkPermission(user, p)),
        hasAllPermissions: (permissions: string[]) => 
            permissions.every(p => checkPermission(user, p)),
        refresh: loadUser,
    };

    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    );
}

export function usePermissions() {
    const context = useContext(PermissionsContext);
    if (context === undefined) {
        throw new Error('usePermissions must be used within a PermissionsProvider');
    }
    return context;
}

// Convenience hook for checking a single permission
export function useHasPermission(permission: string): boolean {
    const { hasPermission } = usePermissions();
    return hasPermission(permission);
}

// Convenience hook for checking multiple permissions
export function useHasAnyPermission(permissions: string[]): boolean {
    const { hasAnyPermission } = usePermissions();
    return hasAnyPermission(permissions);
}

// Component wrapper for conditional rendering
export function WithPermission({ 
    permission, 
    fallback = null, 
    children 
}: { 
    permission: string; 
    fallback?: ReactNode; 
    children: ReactNode;
}) {
    const { hasPermission } = usePermissions();
    return hasPermission(permission) ? <>{children}</> : <>{fallback}</>;
}

// Component wrapper for conditional rendering with any permission
export function WithAnyPermission({ 
    permissions, 
    fallback = null, 
    children 
}: { 
    permissions: string[]; 
    fallback?: ReactNode; 
    children: ReactNode;
}) {
    const { hasAnyPermission } = usePermissions();
    return hasAnyPermission(permissions) ? <>{children}</> : <>{fallback}</>;
}
