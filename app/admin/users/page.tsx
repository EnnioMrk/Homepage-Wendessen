import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    return <AdminUsersClient />;
}
