'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';

export interface AdminAuthUser {
    id: number;
    username: string;
    roleName?: string;
    roleDisplayName?: string;
    customPermissions: string[];
    vereinId?: string | null;
}

interface AdminAuthContextValue {
    user: AdminAuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    refresh: (options?: { silent?: boolean }) => Promise<void>;
}

interface FetchResult {
    user: AdminAuthUser | null;
    isAuthenticated: boolean;
    error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
    undefined
);

async function safeParseJson<T>(response: Response): Promise<T | null> {
    try {
        return (await response.json()) as T;
    } catch {
        return null;
    }
}

function normalizeUser(raw: Record<string, unknown>): AdminAuthUser | null {
    if (!raw || typeof raw.id === 'undefined' || !raw.username) {
        return null;
    }

    const permissions = Array.isArray(raw.customPermissions)
        ? raw.customPermissions.map((permission: unknown) => String(permission))
        : [];

    return {
        id: Number(raw.id),
        username: String(raw.username),
        roleName: typeof raw.roleName === 'string' ? raw.roleName : undefined,
        roleDisplayName:
            typeof raw.roleDisplayName === 'string'
                ? raw.roleDisplayName
                : undefined,
        customPermissions: permissions,
        vereinId:
            raw.vereinId === null || typeof raw.vereinId === 'undefined'
                ? null
                : String(raw.vereinId),
    };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminAuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const isMountedRef = useRef(true);
    const initialLoadRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const applyResult = useCallback((result: FetchResult) => {
        if (!isMountedRef.current) return;
        setUser(result.user);
        setIsAuthenticated(result.isAuthenticated);
        setError(result.error);
    }, []);

    const setLoadingSafe = useCallback((value: boolean) => {
        if (isMountedRef.current) {
            setIsLoading(value);
        }
    }, []);

    const fetchAdminStatus = useCallback(async (): Promise<FetchResult> => {
        try {
            const response = await fetch('/api/admin/me', {
                method: 'GET',
                credentials: 'same-origin',
                cache: 'no-store',
            });

            if (!response.ok) {
                const errorPayload = await safeParseJson<{ error?: string }>(
                    response
                );
                return {
                    user: null,
                    isAuthenticated: false,
                    error:
                        response.status === 401
                            ? null
                            : errorPayload?.error ||
                              'Fehler beim Prüfen des Admin-Status',
                };
            }

            const payload = await safeParseJson<{ user?: unknown }>(response);
            const userObj = payload?.user;
            const normalizedUser =
                userObj &&
                typeof userObj === 'object' &&
                !Array.isArray(userObj)
                    ? normalizeUser(userObj as Record<string, unknown>)
                    : null;

            if (!normalizedUser) {
                return {
                    user: null,
                    isAuthenticated: false,
                    error: 'Unerwartete Serverantwort',
                };
            }

            return {
                user: normalizedUser,
                isAuthenticated: true,
                error: null,
            };
        } catch (err) {
            console.error('Failed to load admin session', err);
            return {
                user: null,
                isAuthenticated: false,
                error: 'Verbindung zum Server fehlgeschlagen',
            };
        }
    }, []);

    const refresh = useCallback(
        async (options?: { silent?: boolean }) => {
            if (!options?.silent) {
                setLoadingSafe(true);
            }

            const result = await fetchAdminStatus();
            applyResult(result);

            if (!options?.silent) {
                setLoadingSafe(false);
            }
        },
        [applyResult, fetchAdminStatus, setLoadingSafe]
    );

    useEffect(() => {
        const isInitialLoad = initialLoadRef.current;
        const isAdminPath = pathname.startsWith('/admin');

        // Use an async function to avoid synchronous setState in the effect body
        const initAuth = async () => {
            await Promise.resolve();
            await refresh(isInitialLoad ? undefined : { silent: true });
        };

        // Only refresh on mount OR when navigating to/within admin routes.
        // This avoids unnecessary API calls on every public page navigation
        // while ensuring admin session data is fresh when performing admin tasks.
        if (isInitialLoad || isAdminPath) {
            initAuth();
        }

        if (isInitialLoad) {
            initialLoadRef.current = false;
        }
    }, [pathname, refresh]);

    useEffect(() => {
        const handleFocus = () => {
            refresh({ silent: true });
        };

        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [refresh]);

    const value = useMemo<AdminAuthContextValue>(
        () => ({
            user,
            isAuthenticated,
            isLoading,
            error,
            refresh,
        }),
        [user, isAuthenticated, isLoading, error, refresh]
    );

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuthContext() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error(
            'useAdminAuth must be used within an AdminAuthProvider'
        );
    }
    return context;
}
