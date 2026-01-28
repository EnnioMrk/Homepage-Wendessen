import { redirect } from 'next/navigation';
import { isAuthenticated, getSessionData } from '@/lib/auth';
import { Suspense } from 'react';

export default function AdminPage() {
    return (
        <Suspense fallback={<div>Laden...</div>}>
            <AdminPageContent />
        </Suspense>
    );
}

async function AdminPageContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    // Check if user must change password
    const sessionData = await getSessionData();
    if (sessionData?.mustChangePassword) {
        redirect('/admin/change-password');
    }

    redirect('/admin/dashboard');
    return null;
}
