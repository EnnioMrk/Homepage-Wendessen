import Link from 'next/link';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { AdminHead } from '@/app/components/admin/AdminPage';
import AdminUsersClient from './AdminUsersClient';

export default function AdminUsersPage() {
    return (
        <Suspense
            fallback={
                <div>
                    <AdminHead
                        title="Benutzer"
                        sub="Zugänge, Rollen und Berechtigungen der Redaktion"
                    />
                    <div className="panel">
                        <div className="panel-body">
                            <p className="muted">Benutzer werden geladen …</p>
                        </div>
                    </div>
                </div>
            }
        >
            <AdminUsersContent />
        </Suspense>
    );
}

async function AdminUsersContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canViewUsers = hasPermission(currentUser, 'users.view');

    if (!canViewUsers) {
        return (
            <div>
                <AdminHead
                    title="Benutzer"
                    sub="Zugänge, Rollen und Berechtigungen der Redaktion"
                />
                <div className="empty">
                    <h3>Keine Berechtigung</h3>
                    <p>
                        Sie haben keine Berechtigung, Benutzer und Rechte zu
                        verwalten. Wenden Sie sich an die Redaktionsleitung.
                    </p>
                    <Link className="btn btn--quiet" href="/admin/dashboard">
                        Zurück zum Schreibtisch
                    </Link>
                </div>
            </div>
        );
    }

    return <AdminUsersClient />;
}
