import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSharedGalleryReports from './AdminSharedGalleryReports';

export default async function AdminSharedGalleryReportsPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    return <AdminSharedGalleryReports />;
}
