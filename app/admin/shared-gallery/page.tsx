import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import AdminSharedGallery from './AdminSharedGalleryNew';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';

export default function AdminSharedGalleryPage() {
    return (
        <Suspense
            fallback={
                <p className="admin-empty">Einreichungen werden geladen …</p>
            }
        >
            <AdminSharedGalleryAuthWrapper />
        </Suspense>
    );
}

async function AdminSharedGalleryAuthWrapper() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canView = hasPermission(currentUser, 'shared_gallery.view');
    const canEdit = hasPermission(currentUser, 'shared_gallery.edit');
    const canDelete = hasPermission(currentUser, 'shared_gallery.delete');

    if (!canView) {
        return (
            <div>
                <AdminHead title="Impressionen" />
                <Panel title="Keine Berechtigung">
                    <p className="admin-empty">
                        Sie haben keine Berechtigung, Impressionen zu verwalten.
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

    return <AdminSharedGallery canEdit={canEdit} canDelete={canDelete} />;
}
