import Link from 'next/link';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { AdminHead } from '@/app/components/admin/AdminPage';
import AdminContactsClient from './AdminContactsClient';

export default function AdminContactsPage() {
    return (
        <Suspense
            fallback={
                <div>
                    <AdminHead
                        title="Kontakte"
                        sub="Ansprechpartner, Adressen und Vereinsfunktionen"
                    />
                    <div className="panel">
                        <div className="panel-body">
                            <p className="muted">Kontakte werden geladen …</p>
                        </div>
                    </div>
                </div>
            }
        >
            <ContactsContent />
        </Suspense>
    );
}

async function ContactsContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canView = hasPermission(currentUser, 'contacts.view');
    const canCreate = hasPermission(currentUser, 'contacts.create');
    const canEdit = hasPermission(currentUser, 'contacts.edit');
    const canDelete = hasPermission(currentUser, 'contacts.delete');

    if (!canView) {
        return (
            <div>
                <AdminHead
                    title="Kontakte"
                    sub="Ansprechpartner, Adressen und Vereinsfunktionen"
                />
                <div className="empty">
                    <h3>Keine Berechtigung</h3>
                    <p>
                        Sie haben keine Berechtigung, das Kontaktverzeichnis zu
                        sehen. Wenden Sie sich an die Redaktionsleitung, wenn
                        Sie Kontakte pflegen sollen.
                    </p>
                    <Link className="btn btn--quiet" href="/admin/dashboard">
                        Zurück zum Schreibtisch
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <AdminContactsClient
            canCreate={canCreate}
            canEdit={canEdit}
            canDelete={canDelete}
        />
    );
}
