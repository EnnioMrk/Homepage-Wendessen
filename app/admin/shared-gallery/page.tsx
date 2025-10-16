import { isAuthenticated, getCurrentAdminUser } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import { redirect } from 'next/navigation';
import AdminSharedGallery from './AdminSharedGalleryNew';
import { Warning, ArrowLeft } from '@phosphor-icons/react/dist/ssr';

export default async function AdminSharedGalleryPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    // Check permissions
    const currentUser = await getCurrentAdminUser();
    const canViewSharedGallery = hasPermission(currentUser, 'shared_gallery.view');

    if (!canViewSharedGallery) {
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
                        Sie haben keine Berechtigung, Impressionen zu verwalten.
                    </p>
                    <a
                        href="/admin/dashboard"
                        className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 inline mr-2" />
                        Zurück zum Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return <AdminSharedGallery />;
}
