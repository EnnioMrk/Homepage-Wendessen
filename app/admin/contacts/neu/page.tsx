import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import EditContactClient from '../EditContactClient';
import { Suspense } from 'react';

export default function NewContactPage() {
    return (
        <Suspense fallback={<div>Laden...</div>}>
            <NewContactContent />
        </Suspense>
    );
}

async function NewContactContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    if (!hasPermission(currentUser, 'contacts.create')) {
        redirect('/admin/contacts');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-xl font-bold text-gray-900">Neuer Kontakt</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <EditContactClient />
            </main>
        </div>
    );
}
