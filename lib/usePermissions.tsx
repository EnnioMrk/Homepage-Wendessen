'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import type { AdminAuthUser } from './admin-auth-context';
import { useAdminAuth } from './useAdminAuth';

interface PermissionsContextType {
    user: AdminAuthUser | null;
    loading: boolean;
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
    hasAllPermissions: (permissions: string[]) => boolean;
    refresh: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
    undefined
);

/**
 * Check if a user has a specific permission
 * Now purely permission-based - roles are just for organizing/grouping
 */
function checkPermission(
    user: AdminAuthUser | null,
    permission: string
): boolean {
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
        if (
            permission.endsWith('.view') &&
            user.customPermissions.some((p) =>
                p.startsWith(`verein.${category}.`)
            )
        ) {
            return true;
        }
    }

    return false;
}

export function PermissionsProvider({ children }: { children: ReactNode }) {
    const { user, isLoading, refresh } = useAdminAuth();

    const value = useMemo<PermissionsContextType>(
        () => ({
            user,
            loading: isLoading,
            hasPermission: (permission: string) =>
                checkPermission(user, permission),
            hasAnyPermission: (permissions: string[]) =>
                permissions.some((p) => checkPermission(user, p)),
            hasAllPermissions: (permissions: string[]) =>
                permissions.every((p) => checkPermission(user, p)),
            refresh,
        }),
        [user, isLoading, refresh]
    );

    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    );
}

export function usePermissions() {
    const context = useContext(PermissionsContext);
    if (context === undefined) {
        throw new Error(
            'usePermissions must be used within a PermissionsProvider'
        );
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
    children,
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
    children,
}: {
    permissions: string[];
    fallback?: ReactNode;
    children: ReactNode;
}) {
    const { hasAnyPermission } = usePermissions();
    return hasAnyPermission(permissions) ? <>{children}</> : <>{fallback}</>;
}
