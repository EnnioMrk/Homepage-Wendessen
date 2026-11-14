import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import EditLayoutClient from '../EditLayoutClient';

export default function EditWendessenLayoutPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense fallback={<p className="admin-empty">Layout wird geladen …</p>}>
            <EditWendessenLayoutContent params={params} />
        </Suspense>
    );
}

async function EditWendessenLayoutContent({
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
    if (!hasPermission(currentUser, 'wendessen.manage')) {
        redirect('/admin/wendessen');
    }

    return <EditLayoutClient layoutId={id} />;
}
