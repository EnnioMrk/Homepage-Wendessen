import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import CreateNewsForm from './CreateNewsForm';
import { AdminHead } from '@/app/components/admin/AdminPage';
import { Suspense } from 'react';

export default function CreateNewsPage() {
    return (
        <Suspense
            fallback={
                <div>
                    <AdminHead
                        title="Neue Nachricht"
                        sub="Register der Nachrichten"
                    />
                    <div className="panel">
                        <div className="panel-body">
                            <p className="muted">Lade Editor …</p>
                        </div>
                    </div>
                </div>
            }
        >
            <CreateNewsContent />
        </Suspense>
    );
}

async function CreateNewsContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canCreateNews = hasPermission(currentUser, 'news.create');

    if (!canCreateNews) {
        return (
            <div>
                <AdminHead
                    title="Neue Nachricht"
                    sub="Register der Nachrichten"
                />
                <div className="empty">
                    <h3>Keine Berechtigung</h3>
                    <p>
                        Sie haben keine Berechtigung, Nachrichten zu erstellen.
                        Wenden Sie sich an die Redaktionsleitung.
                    </p>
                    <Link className="btn btn--quiet" href="/admin/news">
                        Zurück zur Übersicht
                    </Link>
                </div>
            </div>
        );
    }

    return <CreateNewsForm />;
}
