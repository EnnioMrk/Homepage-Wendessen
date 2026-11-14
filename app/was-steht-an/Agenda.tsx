'use client';

import type { CalendarEvent } from '@/lib/database';
import { dateLong, dayOf, monthShort, weekday } from '@/app/lib/register-format';
import {
    categoryLabel,
    categoryRule,
    eventTimeText,
    registerNumber,
} from './calendar-utils';
import styles from './calendar.module.css';

interface AgendaProps {
    events: CalendarEvent[];
    onOpen: (event: CalendarEvent) => void;
}

/** Ruled rows, one per entry. The number sits under the date, the state right. */
export default function Agenda({ events, onOpen }: AgendaProps) {
    return (
        <ul className="agenda">
            {events.map((entry) => {
                const cancelled = Boolean(entry.isCancelled);
                const organizer = entry.organizer;

                return (
                    <li key={entry.id}>
                        <button
                            type="button"
                            className={`agenda-item ${styles.row}`}
                            data-cancelled={cancelled}
                            onClick={() => onOpen(entry)}
                        >
                            <span className={styles.date} aria-hidden="true">
                                <span className={styles.day}>
                                    {dayOf(entry.start)}
                                </span>
                                <span className={styles.month}>
                                    {monthShort(entry.start)}
                                </span>
                                <span className={styles.weekday}>
                                    {weekday(entry.start)}
                                </span>
                                <span className={styles.number}>
                                    Nr. {registerNumber(entry)}
                                </span>
                            </span>
                            <span className="visually-hidden">
                                {`${dateLong(entry.start)}${
                                    eventTimeText(entry)
                                        ? `, ${eventTimeText(entry)}`
                                        : ''
                                }, Nr. ${registerNumber(entry)}`}
                            </span>
                            <span className={styles.rowBody}>
                                <span className={styles.top}>
                                    <span
                                        className={`${styles.cat} ${categoryRule(entry.category)}`}
                                    >
                                        {categoryLabel(entry.category)}
                                    </span>
                                    {cancelled && (
                                        <span className="stamp stamp--cancelled">
                                            Abgesagt
                                        </span>
                                    )}
                                </span>
                                <span className="agenda-title">
                                    {entry.title}
                                </span>
                                <span className={styles.meta}>
                                    <span className="num">
                                        {eventTimeText(entry)}
                                    </span>
                                    {entry.location && (
                                        <span>{entry.location}</span>
                                    )}
                                    {organizer && <span>{organizer}</span>}
                                </span>
                                <span className="visually-hidden">
                                    Details öffnen
                                </span>
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
