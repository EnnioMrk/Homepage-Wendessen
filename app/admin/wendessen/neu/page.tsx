import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import EditLayoutClient from '../EditLayoutClient';
import { Suspense } from 'react';

export default function CreateWendessenLayoutPage() {
    return (
        <Suspense fallback={<div>Laden...</div>}>
            <CreateWendessenLayoutContent />
        </Suspense>
    );
}

async function CreateWendessenLayoutContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    if (!hasPermission(currentUser, 'wendessen.manage')) {
        redirect('/admin/wendessen');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <h1 className="text-xl font-bold text-gray-900">Neues Layout</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <EditLayoutClient />
            </main>
        </div>
    );
}
