import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import AdminArchive from './AdminArchive';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';

export default function ArchivePage() {
    return (
        <Suspense fallback={<p className="admin-empty">Archiv wird geladen …</p>}>
            <ArchiveContent />
        </Suspense>
    );
}

async function ArchiveContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canView = hasPermission(currentUser, 'archive.view');

    if (!canView) {
        return (
            <div>
                <AdminHead title="Dorfarchiv" />
                <Panel title="Keine Berechtigung">
                    <p className="admin-empty">
                        Sie haben keine Berechtigung, das Dorfarchiv anzusehen.
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
        <AdminArchive
            canCreate={hasPermission(currentUser, 'archive.create')}
            canEdit={hasPermission(currentUser, 'archive.edit')}
            canDelete={hasPermission(currentUser, 'archive.delete')}
        />
    );
}
