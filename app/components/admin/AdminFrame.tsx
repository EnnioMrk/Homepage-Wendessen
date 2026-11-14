'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePermissions } from '@/lib/usePermissions';
import NotificationBell from '@/app/components/NotificationBell';
import PushNotificationToggle from '@/app/components/PushNotificationToggle';

interface PendingTask {
    type: string;
    count: number;
    label: string;
    href: string;
}

interface NavEntry {
    label: string;
    href: string;
    permission?: string;
    pendingKey?: string;
}

const NAV: { group: string; entries: NavEntry[] }[] = [
    {
        group: 'Übersicht',
        entries: [{ label: 'Schreibtisch', href: '/admin/dashboard' }],
    },
    {
        group: 'Register',
        entries: [
            { label: 'Termine', href: '/admin/events', permission: 'events.view' },
            { label: 'Nachrichten', href: '/admin/news', permission: 'news.view' },
            { label: 'Bilder', href: '/admin/gallery', permission: 'gallery.view' },
            {
                label: 'Porträts',
                href: '/admin/portraits',
                permission: 'portraits.view',
                pendingKey: 'portrait',
            },
            {
                label: 'Geteilte Galerie',
                href: '/admin/shared-gallery',
                permission: 'shared_gallery.view',
                pendingKey: 'shared_gallery',
            },
            {
                label: 'Meldungen',
                href: '/admin/shared-gallery/meldungen',
                permission: 'shared_gallery.view',
                pendingKey: 'report',
            },
            { label: 'Archiv', href: '/admin/archiv', permission: 'archive.view' },
            {
                label: 'Dorfwissen',
                href: '/admin/wendessen',
                permission: 'wendessen.view',
            },
        ],
    },
    {
        group: 'Menschen',
        entries: [
            {
                label: 'Kontakte',
                href: '/admin/contacts',
                permission: 'contacts.view',
            },
            {
                label: 'Organisationen',
                href: '/admin/organizations',
                permission: 'contacts.view',
            },
        ],
    },
    {
        group: 'Verwaltung',
        entries: [
            { label: 'Benutzer', href: '/admin/users', permission: 'users.view' },
            {
                label: 'Einstellungen',
                href: '/admin/settings',
                permission: 'settings.view',
            },
            { label: 'Protokolle', href: '/admin/logs', permission: 'logs.view' },
        ],
    },
];

/**
 * The keeper's desk: a pine rail with the register's sections, permission-aware,
 * plus the notification controls that used to sit on the dashboard. Below
 * 900 px the rail becomes a collapsible menu so the work area keeps its width.
 */
export function AdminFrame({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() ?? '';
    const router = useRouter();
    const { user, loading, hasPermission } = usePermissions();
    const [pending, setPending] = useState<PendingTask[]>([]);

    const bare =
        pathname.startsWith('/admin/login') ||
        pathname.startsWith('/admin/change-password');

    useEffect(() => {
        if (bare || !user) return;
        let cancelled = false;
        fetch('/api/admin/pending-tasks')
            .then((r) => (r.ok ? r.json() : { tasks: [] }))
            .then((data) => {
                if (!cancelled) setPending(data.tasks ?? []);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [bare, user, pathname]);

    async function logout() {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    }

    if (bare) return <>{children}</>;

    if (loading) {
        return (
            <div className="wrap" style={{ paddingBlock: 'var(--s8)' }}>
                <p className="muted">Schreibtisch wird geöffnet …</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="admin-login">
                <div className="admin-login-card">
                    <h1>Nicht angemeldet</h1>
                    <p className="lede">
                        Für den Schreibtisch ist eine Anmeldung nötig.
                    </p>
                    <Link className="btn btn--primary" href="/admin/login">
                        Zur Anmeldung
                    </Link>
                </div>
            </div>
        );
    }

    const pendingFor = (key?: string) =>
        key ? pending.find((t) => t.type === key)?.count : undefined;

    const nav = (
        <nav className="admin-nav" aria-label="Redaktion">
            {NAV.map((group) => {
                const entries = group.entries.filter(
                    (entry) =>
                        !entry.permission || hasPermission(entry.permission),
                );
                if (entries.length === 0) return null;
                return (
                    <div key={group.group}>
                        <p className="admin-nav-group">{group.group}</p>
                        {entries.map((entry) => {
                            const count = pendingFor(entry.pendingKey);
                            const current =
                                pathname === entry.href ||
                                pathname.startsWith(entry.href + '/');
                            return (
                                <Link
                                    key={entry.href}
                                    href={entry.href}
                                    aria-current={current ? 'page' : undefined}
                                >
                                    <span>{entry.label}</span>
                                    {count ? (
                                        <span className="count">{count}</span>
                                    ) : null}
                                </Link>
                            );
                        })}
                    </div>
                );
            })}
        </nav>
    );

    const tools = (
        <div className="admin-rail-tools">
            <PushNotificationToggle />
            <NotificationBell />
            <button
                type="button"
                className="btn btn--sm"
                style={{
                    background: 'transparent',
                    color: 'var(--pine-ink)',
                    borderColor: '#3a5446',
                }}
                onClick={logout}
            >
                Abmelden
            </button>
        </div>
    );

    return (
        <div className="admin-shell">
            <aside className="admin-rail">
                <div className="admin-rail-head">
                    <p className="who">{user.username}</p>
                    <p className="role">
                        {user.roleDisplayName || user.roleName}
                    </p>
                    {user.vereinId ? (
                        <p className="verein">Verein: {user.vereinId}</p>
                    ) : null}
                </div>
                {nav}
                {tools}
            </aside>

            <div className="admin-main">
                <div className="admin-topbar">
                    <span>
                        <strong>Wendessen</strong> · Redaktionsschreibtisch
                    </span>
                    <span style={{ display: 'flex', gap: 'var(--s4)' }}>
                        <Link href="/">Zur Website</Link>
                        <Link href="/admin/dashboard">Schreibtisch</Link>
                    </span>
                </div>

                <details className="admin-mobile-menu">
                    <summary>
                        Bereiche · {user.username} ·{' '}
                        {user.roleDisplayName || user.roleName}
                    </summary>
                    <div
                        onClick={(event) => {
                            if (
                                (event.target as HTMLElement).closest('a')
                            ) {
                                (
                                    event.currentTarget.closest(
                                        'details',
                                    ) as HTMLDetailsElement | null
                                )?.removeAttribute('open');
                            }
                        }}
                    >
                        {nav}
                    </div>
                    {tools}
                </details>

                {children}
            </div>
        </div>
    );
}
