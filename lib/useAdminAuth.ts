'use client';

import { useAdminAuthContext } from './admin-auth-context';

export function useAdminAuth() {
    return useAdminAuthContext();
}
