import { ASSOCIATIONS } from '@/lib/constants/associations';
import { EVENT_CATEGORIES } from '@/lib/constants/categories';
import type { CalendarEvent } from '@/lib/database';
import {
    clock,
    dateLong,
    dateShort,
    isoDay,
    monthLong,
    timeRange,
    weekdayLong,
    yearOf,
} from '@/app/lib/register-format';
import styles from './calendar.module.css';

const DAY_MS = 24 * 60 * 60 * 1000;

export type CategoryId = CalendarEvent['category'];

/** The register's category names, in the order the filter offers them. */
export const CATEGORIES: { id: CategoryId; label: string }[] =
    EVENT_CATEGORIES.map((category) => ({
        id: category.id as CategoryId,
        label: category.label,
    }));

export function categoryLabel(category?: string): string {
    return (
        CATEGORIES.find((entry) => entry.id === category)?.label ?? 'Sonstiges'
    );
}

/** 2px left rule colour for a category: the printed key, never colour alone. */
export function categoryRule(category?: string): string {
    switch (category) {
        case 'sitzung':
            return styles['rule-sitzung'];
        case 'veranstaltung':
            return styles['rule-veranstaltung'];
        case 'sport':
            return styles['rule-sport'];
        case 'kultur':
            return styles['rule-kultur'];
        case 'notfall':
            return styles['rule-notfall'];
        default:
            return styles['rule-sonstiges'];
    }
}

/** Paper tint behind a calendar chip. */
export function categoryTint(category?: string): string {
    switch (category) {
        case 'sitzung':
            return styles['tint-sitzung'];
        case 'veranstaltung':
            return styles['tint-veranstaltung'];
        case 'sport':
            return styles['tint-sport'];
        case 'kultur':
            return styles['tint-kultur'];
        case 'notfall':
            return styles['tint-notfall'];
        default:
            return styles['tint-sonstiges'];
    }
}

/* ---------------------------------------------------------------- clubs */

/**
 * Older rows store the Frauenhilfe under its former id. Keep the lookup
 * honest instead of printing a raw database key.
 */
const VEREIN_ALIASES: Record<string, string> = {
    'frauenhilfe-wendessen': 'frauenhilfe',
};

export interface Club {
    id: string;
    title: string;
    href: string;
}

export function clubFor(vereinId?: string): Club | null {
    if (!vereinId) return null;
    const id = VEREIN_ALIASES[vereinId] ?? vereinId;
    const club = ASSOCIATIONS.find((entry) => entry.id === id);
    if (!club) return null;
    return { id: club.id, title: club.title, href: club.buttonHref };
}

/** Normalised club id, used by the Verein filter. */
export function clubKey(vereinId?: string): string | undefined {
    if (!vereinId) return undefined;
    return VEREIN_ALIASES[vereinId] ?? vereinId;
}

/* ---------------------------------------------------------------- dates */

function noonUtc(year: number, monthIndex: number, day: number): Date {
    // Noon UTC is the same calendar day in Berlin all year round.
    return new Date(Date.UTC(year, monthIndex, day, 12));
}

export function berlinYearMonth(date: Date): { year: number; month: number } {
    const [year, month] = isoDay(date).split('-').map(Number);
    return { year, month };
}

export function monthStart(date: Date): Date {
    const { year, month } = berlinYearMonth(date);
    return noonUtc(year, month - 1, 1);
}

export function addMonths(date: Date, delta: number): Date {
    const { year, month } = berlinYearMonth(date);
    return noonUtc(year, month - 1 + delta, 1);
}

export function withYear(date: Date, year: number): Date {
    const { month } = berlinYearMonth(date);
    return noonUtc(year, month - 1, 1);
}

export function monthKey(date: Date): string {
    return isoDay(date).slice(0, 7);
}

export function monthLabel(date: Date): string {
    return `${monthLong(date)} ${yearOf(date)}`;
}

/** Six ruled weeks, Monday first. */
export function monthGrid(cursor: Date): Date[] {
    const first = monthStart(cursor);
    const offset = (first.getUTCDay() + 6) % 7;
    const start = new Date(first.getTime() - offset * DAY_MS);
    return Array.from(
        { length: 42 },
        (_, index) => new Date(start.getTime() + index * DAY_MS),
    );
}

/** Every Berlin day an event covers, so a long entry sits in each cell. */
export function eventDayKeys(event: CalendarEvent): string[] {
    const first = isoDay(event.start);
    const last = isoDay(event.end);
    if (last <= first) return [first];

    const keys = [first];
    let cursor = Date.parse(`${first}T12:00:00Z`);
    const end = Date.parse(`${last}T12:00:00Z`);
    while (cursor < end && keys.length < 14) {
        cursor += DAY_MS;
        keys.push(new Date(cursor).toISOString().slice(0, 10));
    }
    return keys;
}

export function eventsByDay(
    events: CalendarEvent[],
): Map<string, CalendarEvent[]> {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
        for (const key of eventDayKeys(event)) {
            const list = map.get(key);
            if (list) list.push(event);
            else map.set(key, [event]);
        }
    }
    for (const list of map.values()) {
        list.sort((a, b) => a.start.getTime() - b.start.getTime());
    }
    return map;
}

export function isAllDay(event: CalendarEvent): boolean {
    if (isoDay(event.start) !== isoDay(event.end)) return false;
    return event.end.getTime() - event.start.getTime() >= 20 * 60 * 60 * 1000;
}

export function eventTimeText(event: CalendarEvent): string {
    if (event.end.getTime() <= event.start.getTime()) {
        return clock(event.start);
    }
    if (isAllDay(event)) return 'ganztägig';
    if (isoDay(event.start) === isoDay(event.end)) {
        return timeRange(event.start, event.end);
    }
    return `${clock(event.start)} – ${dateShort(event.end)} ${clock(event.end)}`;
}

export function eventWhenText(event: CalendarEvent): string {
    const start = `${weekdayLong(event.start)}, ${dateLong(event.start)}`;
    if (event.end.getTime() <= event.start.getTime()) {
        return `${start} · ${clock(event.start)}`;
    }
    if (isoDay(event.start) === isoDay(event.end)) {
        return `${start} · ${eventTimeText(event)}`;
    }
    return `${start} ${clock(event.start)} – ${weekdayLong(event.end)}, ${dateLong(event.end)} ${clock(event.end)}`;
}

/** "042" for event 42 — the register number, not a new fact. */
export function registerNumber(event: CalendarEvent): string {
    const value = Number(event.id);
    if (!Number.isFinite(value)) return event.id;
    return String(value).padStart(3, '0');
}

/** Cancelled-by is stored as a login name; print it as a person. */
export function personName(login: string): string {
    return login
        .split(/[-_.]/)
        .filter(Boolean)
        .map((part) => part[0].toUpperCase() + part.slice(1))
        .join(' ');
}

export function nextEventMonth(
    events: CalendarEvent[],
    after: Date,
): Date | null {
    const key = monthKey(after);
    const later = events
        .map((event) => monthKey(event.start))
        .filter((candidate) => candidate > key)
        .sort();
    if (later.length === 0) return null;
    const [year, month] = later[0].split('-').map(Number);
    return noonUtc(year, month - 1, 1);
}

export function previousEventMonth(
    events: CalendarEvent[],
    before: Date,
): Date | null {
    const key = monthKey(before);
    const earlier = events
        .map((event) => monthKey(event.start))
        .filter((candidate) => candidate < key)
        .sort()
        .reverse();
    if (earlier.length === 0) return null;
    const [year, month] = earlier[0].split('-').map(Number);
    return noonUtc(year, month - 1, 1);
}

/** The next upcoming entry, for the margin. */
export function nextUpcoming(events: CalendarEvent[], now: Date): CalendarEvent | null {
    return (
        events
            .filter((event) => event.start.getTime() >= now.getTime())
            .sort((a, b) => a.start.getTime() - b.start.getTime())[0] ?? null
    );
}

/* ------------------------------------------------------------- api rows */

export function parseEvents(payload: unknown): CalendarEvent[] | null {
    if (!Array.isArray(payload)) return null;
    return payload.map((row) => {
        const record = row as Record<string, unknown>;
        return {
            id: String(record.id),
            title: String(record.title),
            start: new Date(String(record.start)),
            end: new Date(String(record.end)),
            description: record.description
                ? String(record.description)
                : undefined,
            location: record.location ? String(record.location) : undefined,
            category: (record.category
                ? String(record.category)
                : 'sonstiges') as CategoryId,
            organizer: record.organizer ? String(record.organizer) : undefined,
            imageUrl: record.imageUrl ? String(record.imageUrl) : undefined,
            imageCropData: record.imageCropData
                ? (record.imageCropData as CalendarEvent['imageCropData'])
                : undefined,
            isCancelled: record.isCancelled ? true : undefined,
            cancelledAt: record.cancelledAt
                ? new Date(String(record.cancelledAt))
                : undefined,
            cancelledBy: record.cancelledBy
                ? String(record.cancelledBy)
                : undefined,
            vereinId: record.vereinId ? String(record.vereinId) : undefined,
        };
    });
}
