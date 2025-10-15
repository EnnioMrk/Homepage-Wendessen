import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSharedGallery from './AdminSharedGalleryNew';

export default async function AdminSharedGalleryPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    return <AdminSharedGallery />;
}
