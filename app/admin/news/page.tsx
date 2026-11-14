import { isAuthenticated, getCurrentAdminUser } from '../../../lib/auth';
import { hasPermission } from '../../../lib/permissions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminNews from './AdminNews';
import { AdminHead } from '@/app/components/admin/AdminPage';
import { Suspense } from 'react';

export default function NewsPage() {
    return (
        <Suspense
            fallback={
                <div>
                    <AdminHead title="Nachrichten" sub="Register der Nachrichten" />
                    <div className="panel">
                        <div className="panel-body">
                            <p className="muted">Lade Nachrichten …</p>
                        </div>
                    </div>
                </div>
            }
        >
            <NewsContent />
        </Suspense>
    );
}

async function NewsContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canViewNews = hasPermission(currentUser, 'news.view');

    if (!canViewNews) {
        return (
            <div>
                <AdminHead
                    title="Nachrichten"
                    sub="Register der Nachrichten"
                />
                <div className="empty">
                    <h3>Keine Berechtigung</h3>
                    <p>
                        Sie haben keine Berechtigung, Nachrichten zu verwalten.
                        Wenden Sie sich an die Redaktionsleitung, wenn Sie
                        Artikel pflegen sollen.
                    </p>
                    <Link className="btn btn--quiet" href="/admin/dashboard">
                        Zurück zum Schreibtisch
                    </Link>
                </div>
            </div>
        );
    }

    return <AdminNews />;
}
