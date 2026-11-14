import Link from 'next/link';
import type { ReactNode } from 'react';

export function AdminHead({
    title,
    sub,
    actions,
}: {
    title: string;
    sub?: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <header className="admin-head">
            <div>
                <h1>{title}</h1>
                {sub && <p className="admin-sub">{sub}</p>}
            </div>
            {actions && <div className="admin-actions">{actions}</div>}
        </header>
    );
}

export function Panel({
    title,
    actions,
    children,
    flush = false,
}: {
    title: string;
    actions?: ReactNode;
    children: ReactNode;
    flush?: boolean;
}) {
    return (
        <section className="panel">
            <div className="panel-head">
                <h2>{title}</h2>
                {actions}
            </div>
            <div className={flush ? 'panel-body panel-body--flush' : 'panel-body'}>
                {children}
            </div>
        </section>
    );
}

export function Stat({
    label,
    value,
    note,
    href,
}: {
    label: string;
    value: number | string;
    note?: string;
    href?: string;
}) {
    const content = (
        <>
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
            {note && <span className="stat-note">{note}</span>}
        </>
    );
    return href ? (
        <Link className="stat" href={href}>
            {content}
        </Link>
    ) : (
        <div className="stat">{content}</div>
    );
}
