const TIME_ZONE = 'Europe/Berlin';

const dayFmt = new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    timeZone: TIME_ZONE,
});

const monthFmt = new Intl.DateTimeFormat('de-DE', {
    month: 'short',
    timeZone: TIME_ZONE,
});

const monthLongFmt = new Intl.DateTimeFormat('de-DE', {
    month: 'long',
    timeZone: TIME_ZONE,
});

const weekdayFmt = new Intl.DateTimeFormat('de-DE', {
    weekday: 'short',
    timeZone: TIME_ZONE,
});

const weekdayLongFmt = new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    timeZone: TIME_ZONE,
});

const timeFmt = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE,
});

const dateLongFmt = new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: TIME_ZONE,
});

const dateShortFmt = new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: TIME_ZONE,
});

export function dayOf(date: Date): string {
    return dayFmt.format(date);
}

export function monthShort(date: Date): string {
    return monthFmt.format(date).replace('.', '').toUpperCase();
}

export function monthLong(date: Date): string {
    return monthLongFmt.format(date);
}

export function weekday(date: Date): string {
    return weekdayFmt.format(date).replace('.', '').toUpperCase();
}

export function weekdayLong(date: Date): string {
    return weekdayLongFmt.format(date);
}

export function clock(date: Date): string {
    return timeFmt.format(date);
}

export function dateLong(date: Date): string {
    return dateLongFmt.format(date);
}

export function dateShort(date: Date): string {
    return dateShortFmt.format(date);
}

/** "09:30 – 11:30" or "09:30" for zero-length ranges. */
export function timeRange(start: Date, end?: Date): string {
    const from = clock(start);
    if (!end) return from;
    const to = clock(end);
    if (from === to) return from;
    return `${from} – ${to}`;
}

/** Same calendar day in Berlin? */
export function sameDay(a: Date, b: Date): boolean {
    return (
        dayOf(a) === dayOf(b) &&
        monthShort(a) === monthShort(b) &&
        a.getFullYear() === b.getFullYear()
    );
}

export function berlinNow(): Date {
    // A Date is an instant; formatting functions above render it in Berlin.
    return new Date();
}

export function yearOf(date: Date): number {
    return Number(
        new Intl.DateTimeFormat('de-DE', {
            year: 'numeric',
            timeZone: TIME_ZONE,
        }).format(date),
    );
}

export function isoDay(date: Date): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: TIME_ZONE,
    }).format(date);
    return parts;
}

export function plural(
    count: number,
    one: string,
    many: string,
): string {
    return count === 1 ? one : many;
}
