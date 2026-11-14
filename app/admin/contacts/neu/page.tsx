import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import EditContactClient from '../EditContactClient';

export default function NewContactPage() {
    return (
        <Suspense
            fallback={<p className="admin-empty">Kontakt wird vorbereitet …</p>}
        >
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

    return <EditContactClient />;
}
