'use client';

import type { CalendarEvent } from '@/lib/database';
import { clock, dayOf, isoDay, weekday } from '@/app/lib/register-format';
import {
    categoryLabel,
    categoryRule,
    categoryTint,
    eventTimeText,
    isAllDay,
    monthKey,
    registerNumber,
} from './calendar-utils';
import styles from './calendar.module.css';

interface MonthGridProps {
    cursor: Date;
    days: Date[];
    byDay: Map<string, CalendarEvent[]>;
    todayIso: string;
    onOpen: (event: CalendarEvent) => void;
}

export default function MonthGrid({
    cursor,
    days,
    byDay,
    todayIso,
    onOpen,
}: MonthGridProps) {
    const activeMonth = monthKey(cursor);
    const today = todayIso;
    const weekdays = days.slice(0, 7);

    return (
        <>
            <div className="cal-weekdays" aria-hidden="true">
                {weekdays.map((day) => (
                    <span key={isoDay(day)}>{weekday(day)}</span>
                ))}
            </div>
            <div className="cal-grid">
                {days.map((day) => {
                    const key = isoDay(day);
                    const outside = key.slice(0, 7) !== activeMonth;
                    const isToday = key === today;
                    const entries = byDay.get(key) ?? [];
                    const cellClass = [
                        'cal-cell',
                        outside ? 'cal-cell--out' : '',
                        isToday ? 'cal-cell--today' : '',
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return (
                        <div key={key} className={cellClass}>
                            <span className="cal-daynum num">
                                {dayOf(day)}
                                {isToday && (
                                    <span className="visually-hidden">
                                        {' '}
                                        (heute)
                                    </span>
                                )}
                            </span>
                            {entries.map((entry) => {
                                const cancelled = Boolean(entry.isCancelled);
                                const chipClass = cancelled
                                    ? 'cal-chip cal-chip--cancelled'
                                    : `cal-chip ${categoryRule(entry.category)} ${categoryTint(entry.category)}`;

                                return (
                                    <button
                                        key={`${entry.id}-${key}`}
                                        type="button"
                                        className={chipClass}
                                        title={`Nr. ${registerNumber(entry)} · ${entry.title}`}
                                        aria-label={`${categoryLabel(entry.category)}: ${entry.title}, ${eventTimeText(entry)}${
                                            cancelled ? ', abgesagt' : ''
                                        }, Nr. ${registerNumber(entry)}`}
                                        onClick={() => onOpen(entry)}
                                    >
                                        {cancelled ? (
                                            <span className={styles.chipHead}>
                                                <span
                                                    className={styles.chipState}
                                                >
                                                    Abgesagt
                                                </span>
                                            </span>
                                        ) : (
                                            <span className={styles.chipHead}>
                                                <span className={styles.chipCat}>
                                                    {categoryLabel(
                                                        entry.category,
                                                    )}
                                                </span>
                                                {!isAllDay(entry) && (
                                                    <span
                                                        className={
                                                            styles.chipTime
                                                        }
                                                    >
                                                        {clock(entry.start)}
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                        <span
                                            className={`${styles.chipTitle}${
                                                cancelled
                                                    ? ` ${styles.struck}`
                                                    : ''
                                            }`}
                                        >
                                            {entry.title}
                                        </span>
                                        {cancelled && (
                                            <span className="visually-hidden">
                                                abgesagt, Nr.{' '}
                                                {registerNumber(entry)}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
