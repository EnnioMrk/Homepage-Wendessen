import { isAuthenticated } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import AdminNews from './AdminNews';

export default async function NewsPage() {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
        redirect('/admin/login');
    }

    return <AdminNews />;
}
