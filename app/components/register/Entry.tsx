import Link from 'next/link';

import {
    dateLong,
    dayOf,
    monthShort,
    timeRange,
    weekday,
} from '@/app/lib/register-format';

export type EntryState = 'open' | 'cancelled' | 'new' | 'decided' | 'draft';

export interface EntryProps {
    date: Date;
    endDate?: Date;
    title: string;
    href: string;
    meta?: (string | undefined | null)[];
    description?: string;
    state?: EntryState;
    stamp?: string;
    index?: number;
    /** The register number: the row's permanent id in the record. */
    number?: string | number;
    /** Show the clock range in the date column (dates and times). */
    showClock?: boolean;
    /** Override the small line under the weekday (e.g. a year for notices). */
    timeText?: string;
}

const stateStamp: Record<EntryState, string | null> = {
    open: null,
    cancelled: 'Abgesagt',
    new: 'Neu',
    decided: 'Beschlossen',
    draft: 'Entwurf',
};

const stateClass: Record<EntryState, string> = {
    open: 'stamp--info',
    cancelled: 'stamp--cancelled',
    new: 'stamp--new',
    decided: 'stamp--decided',
    draft: 'stamp--draft',
};

/** One dated row in the register. */
export function Entry({
    date,
    endDate,
    title,
    href,
    meta,
    description,
    state = 'open',
    stamp,
    index,
    number,
    showClock = true,
    timeText,
}: EntryProps) {
    const facts = (meta ?? []).filter(Boolean) as string[];
    const label = stateStamp[state];
    const clock = timeText ?? (showClock ? timeRange(date, endDate) : null);
    // What a screen reader hears for the date: the long date plus a real time
    // range only (never the year that `timeText` shows for notices).
    const spokenTime = showClock ? timeRange(date, endDate) : null;
    const spokenDate = `${dateLong(date)}${spokenTime ? `, ${spokenTime}` : ''}`;
    const numberLabel =
        number !== undefined
            ? `Nr. ${String(number).padStart(3, '0')}`
            : typeof index === 'number'
              ? `Nr. ${String(index).padStart(3, '0')}`
              : null;
    const stampClass = stamp === 'Angeheftet' ? 'stamp--pinned' : stateClass[state];

    return (
        <Link className="entry" href={href} data-state={state}>
            <span className="entry-date" aria-hidden="true">
                <span className="d">{dayOf(date)}</span>
                <span className="m">{monthShort(date)}</span>
                <span className="w">{weekday(date)}</span>
                {clock && <span className="time num">{clock}</span>}
            </span>
            <span className="visually-hidden">{spokenDate}</span>
            <span className="entry-body">
                <span className="entry-title">{title}</span>
                {facts.length > 0 && (
                    <span className="entry-meta">
                        {facts.map((fact) => (
                            <span key={fact}>{fact}</span>
                        ))}
                    </span>
                )}
                {description && (
                    <span className="entry-desc">{description}</span>
                )}
            </span>
            <span className="entry-state">
                {stamp ? (
                    <>
                        <span className={`stamp ${stampClass}`}>{stamp}</span>
                        {number !== undefined && (
                            <span
                                className="entry-index"
                                style={{ display: 'block', marginTop: 4 }}
                            >
                                Nr. {String(number).padStart(3, '0')}
                            </span>
                        )}
                    </>
                ) : label ? (
                    <>
                        <span className={`stamp ${stateClass[state]}`}>
                            {label}
                        </span>
                        {numberLabel && (
                            <span
                                className="entry-index"
                                style={{ display: 'block', marginTop: 4 }}
                            >
                                {numberLabel}
                            </span>
                        )}
                    </>
                ) : numberLabel ? (
                    <span className="entry-index">{numberLabel}</span>
                ) : null}
            </span>
        </Link>
    );
}
