import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import AdminSettings from './AdminSettings';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';

export default function SettingsPage() {
    return (
        <Suspense
            fallback={<p className="admin-empty">Einstellungen werden geladen …</p>}
        >
            <SettingsContent />
        </Suspense>
    );
}

async function SettingsContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canViewSettings = hasPermission(currentUser, 'settings.view');
    const canEditSettings = hasPermission(currentUser, 'settings.edit');

    if (!canViewSettings) {
        return (
            <div>
                <AdminHead title="Einstellungen" />
                <Panel title="Keine Berechtigung">
                    <p className="admin-empty">
                        Sie haben keine Berechtigung, die Einstellungen
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

    return <AdminSettings canEdit={canEditSettings} />;
}
