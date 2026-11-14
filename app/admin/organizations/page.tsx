import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { AdminHead } from '@/app/components/admin/AdminPage';
import AdminOrganizationsClient from './AdminOrganizationsClient';

export default async function AdminOrganizationsPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    // Organizations share the contacts permission: they are the same register.
    const currentUser = await getCurrentAdminUser();
    const canView = hasPermission(currentUser, 'contacts.view');

    if (!canView) {
        return (
            <div>
                <AdminHead
                    title="Organisationen"
                    sub="Vereine und Institutionen im Verzeichnis"
                />
                <div className="empty">
                    <h3>Keine Berechtigung</h3>
                    <p>
                        Sie haben keine Berechtigung, die Organisationen zu
                        sehen. Wenden Sie sich an die Redaktionsleitung, wenn
                        Sie Vereine pflegen sollen.
                    </p>
                    <Link className="btn btn--quiet" href="/admin/dashboard">
                        Zurück zum Schreibtisch
                    </Link>
                </div>
            </div>
        );
    }

    return <AdminOrganizationsClient />;
}
