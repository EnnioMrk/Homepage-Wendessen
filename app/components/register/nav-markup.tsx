import Link from 'next/link';
import { REGISTER_NAV } from './nav-data';

function isCurrent(pathname: string, href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
}

/**
 * The spine's tab row. Pure markup so it can render as the Suspense fallback
 * (without a current tab) and inside the client wrapper (with one).
 */
export function NavMarkup({ pathname }: { pathname?: string }) {
    return (
        <nav className="spine-nav" aria-label="Hauptnavigation">
            {REGISTER_NAV.map((section) => {
                if (!section.groups?.length) {
                    return (
                        <Link
                            key={section.href}
                            href={section.href}
                            aria-current={
                                pathname && isCurrent(pathname, section.href)
                                    ? 'page'
                                    : undefined
                            }
                        >
                            {section.label}
                        </Link>
                    );
                }

                const current = pathname
                    ? isCurrent(pathname, section.href)
                    : false;
                return (
                    <details
                        key={section.href}
                        className="nav-group"
                        data-current={current ? 'true' : 'false'}
                    >
                        <summary
                            aria-current={current ? 'page' : undefined}
                            aria-label={`${section.label} — Untermenü`}
                        >
                            {section.label}
                        </summary>
                        <div className="nav-panel">
                            <Link href={section.href} className="nav-el">
                                {section.label} — Übersicht
                            </Link>
                            {section.groups.map((group) => (
                                <div key={group.label}>
                                    <p className="nav-el">{group.label}</p>
                                    {group.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            aria-current={
                                                pathname === item.href
                                                    ? 'page'
                                                    : undefined
                                            }
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </details>
                );
            })}
        </nav>
    );
}
