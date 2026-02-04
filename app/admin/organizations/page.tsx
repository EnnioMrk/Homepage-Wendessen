import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { Warning, ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import AdminOrganizationsClient from './AdminOrganizationsClient';

export default async function AdminOrganizationsPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    // Reuse contact permissions for now, as organizations are tightly coupled with contacts
    const currentUser = await getCurrentAdminUser();
    const canView = hasPermission(currentUser, 'contacts.view');

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
                                href="/admin/contacts"
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Organisationen
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Vereine und Institutionen verwalten
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <AdminOrganizationsClient />
            </main>
        </div>
    );
}
