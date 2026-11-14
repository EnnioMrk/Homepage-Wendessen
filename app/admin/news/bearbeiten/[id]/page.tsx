import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import EditNewsForm from './EditNewsForm';
import { AdminHead } from '@/app/components/admin/AdminPage';
import { Suspense } from 'react';

export default function EditNewsPage() {
    return (
        <Suspense
            fallback={
                <div>
                    <AdminHead
                        title="Nachricht bearbeiten"
                        sub="Register der Nachrichten"
                    />
                    <div className="panel">
                        <div className="panel-body">
                            <p className="muted">Lade Artikel …</p>
                        </div>
                    </div>
                </div>
            }
        >
            <EditNewsContent />
        </Suspense>
    );
}

async function EditNewsContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canEditNews = hasPermission(currentUser, 'news.edit');

    if (!canEditNews) {
        return (
            <div>
                <AdminHead
                    title="Nachricht bearbeiten"
                    sub="Register der Nachrichten"
                />
                <div className="empty">
                    <h3>Keine Berechtigung</h3>
                    <p>
                        Sie haben keine Berechtigung, Nachrichten zu bearbeiten.
                        Wenden Sie sich an die Redaktionsleitung.
                    </p>
                    <Link className="btn btn--quiet" href="/admin/news">
                        Zurück zur Übersicht
                    </Link>
                </div>
            </div>
        );
    }

    return <EditNewsForm />;
}
