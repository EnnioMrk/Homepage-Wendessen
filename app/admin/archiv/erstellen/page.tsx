import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import ArchiveForm from '../ArchiveForm';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';

export default function CreateArchivePage() {
    return (
        <Suspense
            fallback={
                <p className="admin-empty">Archiveintrag wird vorbereitet …</p>
            }
        >
            <CreateArchiveContent />
        </Suspense>
    );
}

async function CreateArchiveContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();

    if (!hasPermission(currentUser, 'archive.create')) {
        return (
            <div>
                <AdminHead title="Neuer Archiveintrag" />
                <Panel title="Keine Berechtigung">
                    <p className="admin-empty">
                        Für neue Archiveinträge fehlt die Berechtigung
                        „Archiv Einträge erstellen“.
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

    return <ArchiveForm />;
}
