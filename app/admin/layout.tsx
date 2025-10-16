import { PermissionsProvider } from '@/lib/usePermissions';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <PermissionsProvider>{children}</PermissionsProvider>;
}
