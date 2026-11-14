import Link from 'next/link';
import type { ReactNode } from 'react';
import { dayOf, monthShort, weekday } from '@/app/lib/register-format';

/** The page sheet: a ruled margin and the leaf. */
export function Leaf({
    margin,
    children,
    full = false,
}: {
    margin?: ReactNode;
    children: ReactNode;
    full?: boolean;
}) {
    return (
        <div className="wrap">
            <div className={`sheet${full || !margin ? ' sheet--full' : ''}`}>
                {!full && margin ? (
                    <aside className="margin" aria-label="Randspalte">
                        {margin}
                    </aside>
                ) : null}
                <div className="leaf-main">{children}</div>
            </div>
        </div>
    );
}

export interface Tally {
    label: string;
    value: string | number;
    href?: string;
}

export function Margin({
    date,
    tallies,
    note,
    label,
}: {
    date?: Date;
    tallies?: Tally[];
    note?: ReactNode;
    label?: string;
}) {
    return (
        <div>
            {date && (
                <p className="margin-day num">
                    <span>{dayOf(date)}</span>
                    <span className="month">{monthShort(date)}</span>
                    <span className="weekday">{weekday(date)}</span>
                </p>
            )}
            {label && <p className="margin-label">{label}</p>}
            {date && tallies?.length ? <div className="margin-rule" /> : null}
            {tallies?.length ? (
                <div className="margin-totals">
                    {tallies.map((t) =>
                        t.href ? (
                            <Link className="tally" key={t.label} href={t.href}>
                                <span>{t.label}</span>
                                <strong>{t.value}</strong>
                            </Link>
                        ) : (
                            <div className="tally" key={t.label}>
                                <span>{t.label}</span>
                                <strong>{t.value}</strong>
                            </div>
                        ),
                    )}
                </div>
            ) : null}
            {note && (
                <>
                    <div className="margin-rule" />
                    <div className="margin-note">{note}</div>
                </>
            )}
        </div>
    );
}

export function PageHead({
    kicker,
    title,
    lede,
    actions,
    as = 'h1',
}: {
    kicker?: string;
    title: string;
    lede?: ReactNode;
    actions?: ReactNode;
    as?: 'h1' | 'h2';
}) {
    const Heading = as;
    return (
        <header className="page-head">
            {kicker && <p className="kicker">{kicker}</p>}
            <Heading>{title}</Heading>
            {lede && <div className="lede">{lede}</div>}
            {actions && <div style={{ marginTop: 'var(--s4)' }}>{actions}</div>}
        </header>
    );
}

export function SectionHead({
    title,
    more,
    moreLabel = 'Alle ansehen',
    id,
}: {
    title: string;
    more?: string;
    moreLabel?: string;
    id?: string;
}) {
    return (
        <div className="section-head">
            <h2 id={id}>{title}</h2>
            {more && (
                <Link className="more" href={more}>
                    {moreLabel}
                </Link>
            )}
        </div>
    );
}

export function Empty({
    title,
    children,
    action,
}: {
    title: string;
    children?: ReactNode;
    action?: ReactNode;
}) {
    return (
        <div className="empty">
            <h3>{title}</h3>
            {children && <p>{children}</p>}
            {action}
        </div>
    );
}

export function Notice({
    tone = 'info',
    title,
    children,
}: {
    tone?: 'info' | 'warn' | 'error' | 'ok';
    title?: string;
    children?: ReactNode;
}) {
    const cls =
        tone === 'info' ? 'notice' : `notice notice--${tone}`;
    return (
        <div className={cls} role={tone === 'error' ? 'alert' : undefined}>
            {title && <strong>{title}</strong>}
            {children && <span>{children}</span>}
        </div>
    );
}
