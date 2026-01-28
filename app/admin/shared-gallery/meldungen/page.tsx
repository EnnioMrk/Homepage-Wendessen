import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSharedGalleryReports from './AdminSharedGalleryReports';
import { Suspense } from 'react';

export default function AdminSharedGalleryReportsPage() {
    return (
        <Suspense fallback={<div>Laden...</div>}>
            <AdminSharedGalleryReportsContent />
        </Suspense>
    );
}

async function AdminSharedGalleryReportsContent() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    return <AdminSharedGalleryReports />;
}
