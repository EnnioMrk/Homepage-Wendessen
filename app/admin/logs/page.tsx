import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import AdminLogs from './AdminLogs';
import { Warning, ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { Suspense } from 'react';

export default function LogsPage() {
    return (
        <Suspense fallback={<div>Logs laden...</div>}>
            <LogsContent />
        </Suspense>
    );
}

async function LogsContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    const currentUser = await getCurrentAdminUser();
    const canViewLogs = hasPermission(currentUser, 'logs.view');

    if (!canViewLogs) {
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
                        Sie haben keine Berechtigung, das Aktivitätslog
                        anzusehen.
                    </p>
                    <a
                        href="/admin/dashboard"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück zum Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return <AdminLogs />;
}
