import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import EditContactClient from '../EditContactClient';
import { Suspense } from 'react';

export default function EditContactPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    return (
        <Suspense fallback={<div>Laden...</div>}>
            <EditContactContent params={params} />
        </Suspense>
    );
}

async function EditContactContent({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    if (!hasPermission(currentUser, 'contacts.edit')) {
        redirect('/admin/contacts');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-xl font-bold text-gray-900">Kontakt bearbeiten</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <EditContactClient contactId={id} />
            </main>
        </div>
    );
}
