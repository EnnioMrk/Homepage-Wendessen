import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import EditContactClient from '../EditContactClient';

export default function EditContactPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense fallback={<p className="admin-empty">Kontakt wird geladen …</p>}>
            <EditContactContent params={params} />
        </Suspense>
    );
}

async function EditContactContent({
    params,
}: {
    params: Promise<{ id: string }>;
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

    return <EditContactClient contactId={id} />;
}
