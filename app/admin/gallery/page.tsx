import { isAuthenticated, getCurrentAdminUser } from '../../../lib/auth';
import { hasPermission } from '../../../lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminGallery from './AdminGallery';
import { AdminHead } from '@/app/components/admin/AdminPage';
import { Suspense } from 'react';

export default function GalleryPage() {
    return (
        <Suspense
            fallback={
                <div>
                    <AdminHead title="Bilder" sub="Galerie der Redaktion" />
                    <div className="panel">
                        <div className="panel-body">
                            <p className="muted">Lade Galerie …</p>
                        </div>
                    </div>
                </div>
            }
        >
            <GalleryContent />
        </Suspense>
    );
}

async function GalleryContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canViewGallery = hasPermission(currentUser, 'gallery.view');

    if (!canViewGallery) {
        return (
            <div>
                <AdminHead title="Bilder" sub="Galerie der Redaktion" />
                <div className="empty">
                    <h3>Keine Berechtigung</h3>
                    <p>
                        Sie haben keine Berechtigung, die Galerie zu verwalten.
                        Wenden Sie sich an die Redaktionsleitung.
                    </p>
                    <Link className="btn btn--quiet" href="/admin/dashboard">
                        Zurück zum Schreibtisch
                    </Link>
                </div>
            </div>
        );
    }

    return <AdminGallery />;
}
