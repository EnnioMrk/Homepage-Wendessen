import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import AdminWendessenClient from './AdminWendessenClient';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';

export default function AdminWendessenPage() {
    return (
        <Suspense fallback={<p className="admin-empty">Layouts werden geladen …</p>}>
            <AdminWendessenContent />
        </Suspense>
    );
}

async function AdminWendessenContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canView = hasPermission(currentUser, 'wendessen.view');
    const canCreate = hasPermission(currentUser, 'wendessen.create');
    const canManage = hasPermission(currentUser, 'wendessen.manage');

    if (!canView) {
        return (
            <div>
                <AdminHead title="Dorfwissen" />
                <Panel title="Keine Berechtigung">
                    <p className="admin-empty">
                        Sie haben keine Berechtigung, diesen Bereich zu
                        verwalten.
                    </p>
                    <p style={{ marginTop: 'var(--s4)' }}>
                        <Link className="btn" href="/admin/dashboard">
                            Zum Schreibtisch
                        </Link>
                    </p>
                </Panel>
            </div>
        );
    }

    return (
        <AdminWendessenClient
            canManage={canManage}
            canCreate={canCreate || canManage}
        />
    );
}
