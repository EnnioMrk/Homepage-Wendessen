import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import ArchiveForm from '../../ArchiveForm';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';

export default function EditArchivePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense
            fallback={
                <p className="admin-empty">Archiveintrag wird geladen …</p>
            }
        >
            <EditArchiveContent params={params} />
        </Suspense>
    );
}

async function EditArchiveContent({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();

    if (!hasPermission(currentUser, 'archive.edit')) {
        return (
            <div>
                <AdminHead title="Archiveintrag bearbeiten" />
                <Panel title="Keine Berechtigung">
                    <p className="admin-empty">
                        Für das Bearbeiten fehlt die Berechtigung
                        „Archiv Einträge bearbeiten“.
                    </p>
                    <p style={{ marginTop: 'var(--s4)' }}>
                        <Link className="btn" href="/admin/archiv">
                            Zurück zum Archiv
                        </Link>
                    </p>
                </Panel>
            </div>
        );
    }

    return <ArchiveForm itemId={id} />;
}
