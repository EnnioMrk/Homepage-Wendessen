'use client';

import { useState, useEffect } from 'react';

export function useAdminAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch('/api/admin/status');
                const data = await response.json();
                setIsAuthenticated(data.authenticated);
            } catch {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, []);

    return { isAuthenticated, isLoading };
}
