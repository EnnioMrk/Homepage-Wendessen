'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AdminUser {
    id: number;
    username: string;
    roleName?: string;
    roleDisplayName?: string;
    customPermissions: string[];
}

interface PermissionsContextType {
    user: AdminUser | null;
    loading: boolean;
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    hasRole: (roleName: string) => boolean;
    refresh: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

// Role-permission mappings (same as server-side)
const ROLE_PERMISSIONS: Record<string, string[]> = {
    super_admin: ['*'],
    admin: [
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'events.view', 'events.create', 'events.edit', 'events.delete',
        'news.view', 'news.create', 'news.edit', 'news.delete',
        'gallery.view', 'gallery.upload', 'gallery.edit', 'gallery.delete',
        'shared_gallery.view', 'shared_gallery.approve', 'shared_gallery.reject',
        'portraits.view', 'portraits.approve', 'portraits.reject',
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
        'portraits.view', 'portraits.approve', 'portraits.reject',
    ],
};

// Default permissions for Verein roles
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

function isVereinRole(roleName: string): boolean {
    return roleName.startsWith('verein_');
}

function getRolePermissions(roleName: string): string[] {
    if (ROLE_PERMISSIONS[roleName]) {
        return ROLE_PERMISSIONS[roleName];
    }
    
    if (isVereinRole(roleName)) {
        return VEREIN_DEFAULT_PERMISSIONS;
    }
    
    return [];
}

function checkPermission(user: AdminUser | null, permission: string): boolean {
    if (!user) return false;
    
    if (user.roleName === 'super_admin') {
        return true;
    }
    
    if (user.customPermissions && user.customPermissions.includes(permission)) {
        return true;
    }
    
    if (user.roleName) {
        const rolePermissions = getRolePermissions(user.roleName);
        if (rolePermissions.includes('*') || rolePermissions.includes(permission)) {
            return true;
        }
        
        const [category] = permission.split('.');
        if (rolePermissions.includes(`${category}.*`)) {
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
        hasRole: (roleName: string) => user?.roleName === roleName,
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
