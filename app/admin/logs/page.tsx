import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import AdminLogs from './AdminLogs';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';

export default function LogsPage() {
    return (
        <Suspense fallback={<p className="admin-empty">Log wird geladen …</p>}>
            <LogsContent />
        </Suspense>
    );
}

async function LogsContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canViewLogs = hasPermission(currentUser, 'logs.view');

    if (!canViewLogs) {
        return (
            <div>
                <AdminHead title="Aktivitätslog" />
                <Panel title="Keine Berechtigung">
                    <p className="admin-empty">
                        Sie haben keine Berechtigung, das Aktivitätslog
                        anzusehen.
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

    return <AdminLogs />;
}
