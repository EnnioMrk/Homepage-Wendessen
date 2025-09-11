import { isAuthenticated } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import AdminGallery from './AdminGallery';

export default async function GalleryPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    return <AdminGallery />;
}
