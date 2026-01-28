import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { Warning, ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import AdminContactsClient from './AdminContactsClient';
import Link from 'next/link';
import { Suspense } from 'react';

export default function AdminContactsPage() {
    return (
        <Suspense fallback={<div>Kontakte laden...</div>}>
            <ContactsContent />
        </Suspense>
    );
}

async function ContactsContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    // Check permissions
    const currentUser = await getCurrentAdminUser();
    const canView = hasPermission(currentUser, 'contacts.view');
    const canCreate = hasPermission(currentUser, 'contacts.create');
    const canEdit = hasPermission(currentUser, 'contacts.edit');
    const canDelete = hasPermission(currentUser, 'contacts.delete');

    if (!canView) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Warning className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Keine Berechtigung
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Sie haben keine Berechtigung, diesen Bereich zu verwalten.
                    </p>
                    <Link
                        href="/admin/dashboard"
                        className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 inline mr-2" />
                        Zurück zum Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <Link
                                href="/admin/dashboard"
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Kontakte
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Ansprechpartner und Adressen verwalten
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <AdminContactsClient
                    canCreate={canCreate}
                    canEdit={canEdit}
                    canDelete={canDelete}
                />
            </main>
        </div>
    );
}
