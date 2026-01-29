import { PermissionsProvider } from '@/lib/usePermissions';
import { Suspense } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<div>Laden...</div>}>
            <PermissionsProvider>
                {children}
            </PermissionsProvider>
        </Suspense>
    );
}
