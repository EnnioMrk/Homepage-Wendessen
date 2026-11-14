import { PermissionsProvider } from '@/lib/usePermissions';
import { AdminAuthProvider } from '@/lib/admin-auth-context';
import { AdminFrame } from '@/app/components/admin/AdminFrame';
import { Suspense } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense
            fallback={
                <div className="wrap" style={{ paddingBlock: 'var(--s8)' }}>
                    <p className="muted">Redaktion wird geladen …</p>
                </div>
            }
        >
            <AdminAuthProvider>
                <PermissionsProvider>
                    <AdminFrame>{children}</AdminFrame>
                </PermissionsProvider>
            </AdminAuthProvider>
        </Suspense>
    );
}
