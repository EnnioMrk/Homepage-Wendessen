import { redirect } from 'next/navigation';
import { isAuthenticated, getSessionData } from '@/lib/auth';

export default async function AdminPage() {
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
}
