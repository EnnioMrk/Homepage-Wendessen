import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import AdminSharedGalleryReports from './AdminSharedGalleryReports';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';

export default function AdminSharedGalleryReportsPage() {
    return (
        <Suspense fallback={<p className="admin-empty">Meldungen werden geladen …</p>}>
            <AdminSharedGalleryReportsContent />
        </Suspense>
    );
}

async function AdminSharedGalleryReportsContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canView = hasPermission(currentUser, 'shared_gallery.view');

    if (!canView) {
        return (
            <div>
                <AdminHead title="Meldungen" />
                <Panel title="Keine Berechtigung">
                    <p className="admin-empty">
                        Sie haben keine Berechtigung, gemeldete Impressionen
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

    return <AdminSharedGalleryReports />;
}
