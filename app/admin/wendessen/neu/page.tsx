import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import EditLayoutClient from '../EditLayoutClient';

export default function CreateWendessenLayoutPage() {
    return (
        <Suspense
            fallback={<p className="admin-empty">Layout wird vorbereitet …</p>}
        >
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

    return <EditLayoutClient />;
}
