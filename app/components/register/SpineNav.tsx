'use client';

import { usePathname } from 'next/navigation';
import { NavMarkup } from './nav-markup';

/**
 * Client island for one thing only: which tab is current. The markup is shared
 * with the static fallback so the nav never disappears while it resolves.
 */
export function SpineNav() {
    const pathname = usePathname() ?? undefined;
    return <NavMarkup pathname={pathname} />;
}
