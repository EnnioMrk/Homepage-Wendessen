'use client';

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import type { KeyboardEvent } from 'react';
import { ASSOCIATIONS } from '@/lib/constants/associations';
import type { CalendarEvent } from '@/lib/database';
import {
    Empty,
    Leaf,
    Margin,
    Notice,
    PageHead,
} from '@/app/components/register/Layout';
import { clock, dateLong, dateShort, isoDay, yearOf } from '@/app/lib/register-format';
import Agenda from './Agenda';
import EventDialog from './EventDialog';
import MonthGrid from './MonthGrid';
import {
    CATEGORIES,
    addMonths,
    categoryRule,
    categoryTint,
    clubKey,
    eventsByDay,
    monthGrid,
    monthKey,
    monthLabel,
    monthStart,
    nextEventMonth,
    nextUpcoming,
    parseEvents,
    previousEventMonth,
    withYear,
} from './calendar-utils';
import styles from './calendar.module.css';

type View = 'agenda' | 'month';
type RefreshState = 'idle' | 'loading' | 'ok' | 'error';

const VIEWS: View[] = ['agenda', 'month'];

export default function CalendarLeaf({
    initialEvents,
    today,
}: {
    initialEvents: CalendarEvent[];
    today: Date;
}) {
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [verein, setVerein] = useState('all');
    const [view, setView] = useState<View>('agenda');
    const [cursor, setCursor] = useState<Date>(() => monthStart(today));
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [refreshState, setRefreshState] = useState<RefreshState>('idle');
    const [refreshAt, setRefreshAt] = useState<Date | null>(null);
    const [autoSelecting, setAutoSelecting] = useState(false);
    const [missingLink, setMissingLink] = useState(false);
    const now = today;

    const activeYear = yearOf(cursor);
    const hasFilters =
        query.trim() !== '' || category !== 'all' || verein !== 'all';

    /* ---------------------------------------------------- deep link */
    const handledDeepLink = useRef(false);
    const openTimer = useRef<number | null>(null);

    useEffect(
        () => () => {
            if (openTimer.current !== null) {
                window.clearTimeout(openTimer.current);
            }
        },
        [],
    );

    useEffect(() => {
        if (handledDeepLink.current) return;
        if (events.length === 0) return;

        const deepLinkId = new URLSearchParams(window.location.search).get(
            'event',
        );
        if (!deepLinkId) return;

        const entry = events.find((candidate) => candidate.id === deepLinkId);
        handledDeepLink.current = true;

        if (!entry) {
            setMissingLink(true);
            return;
        }

        setAutoSelecting(true);
        openTimer.current = window.setTimeout(() => {
            openTimer.current = null;
            setSelectedId(entry.id);
            setCursor(monthStart(entry.start));
            setView('agenda');
            setAutoSelecting(false);
        }, 500);
    }, [events]);

    /* ------------------------------------------------------ filters */
    const filtered = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return events
            .filter((entry) => {
                if (needle) {
                    const haystack = [
                        entry.title,
                        entry.description,
                        entry.location,
                        entry.organizer,
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();
                    if (!haystack.includes(needle)) return false;
                }
                if (category !== 'all' && entry.category !== category) {
                    return false;
                }
                if (
                    verein !== 'all' &&
                    clubKey(entry.vereinId) !== verein
                ) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => a.start.getTime() - b.start.getTime());
    }, [events, query, category, verein]);

    const yearFiltered = useMemo(
        () => filtered.filter((entry) => yearOf(entry.start) === activeYear),
        [filtered, activeYear],
    );

    const monthRows = useMemo(
        () =>
            yearFiltered.filter(
                (entry) => monthKey(entry.start) === monthKey(cursor),
            ),
        [yearFiltered, cursor],
    );

    const byDay = useMemo(() => eventsByDay(yearFiltered), [yearFiltered]);
    const days = useMemo(() => monthGrid(cursor), [cursor]);

    /* ------------------------------------------------------- years */
    const years = useMemo(() => {
        const set = new Set<number>();
        for (const entry of events) set.add(yearOf(entry.start));
        set.add(yearOf(today));
        set.add(activeYear);
        return [...set].sort((a, b) => a - b);
    }, [events, activeYear, today]);

    const yearButtons = useRef<Record<number, HTMLButtonElement | null>>({});

    const chooseYear = (year: number) => setCursor(withYear(cursor, year));

    const onYearKeyDown = (keyEvent: KeyboardEvent<HTMLDivElement>) => {
        const index = years.indexOf(activeYear);
        let next = -1;
        if (keyEvent.key === 'ArrowRight') next = (index + 1) % years.length;
        else if (keyEvent.key === 'ArrowLeft') {
            next = (index - 1 + years.length) % years.length;
        } else if (keyEvent.key === 'Home') next = 0;
        else if (keyEvent.key === 'End') next = years.length - 1;
        if (next < 0) return;
        keyEvent.preventDefault();
        const year = years[next];
        chooseYear(year);
        yearButtons.current[year]?.focus();
    };

    /* ------------------------------------------------------ counts */
    const yearEvents = useMemo(
        () => events.filter((entry) => yearOf(entry.start) === activeYear),
        [events, activeYear],
    );
    const yearCancelled = yearEvents.filter(
        (entry) => entry.isCancelled,
    ).length;
    const nextInYear = nextUpcoming(yearEvents, now);

    const monthName = new Intl.DateTimeFormat('de-DE', {
        month: 'long',
        timeZone: 'Europe/Berlin',
    }).format(cursor);
    const countLabel = hasFilters
        ? `${monthRows.length} von ${filtered.length} Treffern`
        : `${monthRows.length} ${monthRows.length === 1 ? 'Eintrag' : 'Einträge'} im ${monthName}`;

    /* -------------------------------------------------- navigation */
    const goMonth = (delta: number) => setCursor(addMonths(cursor, delta));
    const goToday = () => setCursor(monthStart(today));

    const resetFilters = () => {
        setQuery('');
        setCategory('all');
        setVerein('all');
    };

    const jumpMonth = nextEventMonth(filtered, cursor) ??
        previousEventMonth(filtered, cursor);

    /* ------------------------------------------------------ dialog */
    const openEvent = useCallback((entry: CalendarEvent) => {
        setMissingLink(false);
        setSelectedId(entry.id);
    }, []);

    const closeDialog = useCallback(() => setSelectedId(null), []);

    const selectedEvent = useMemo(
        () =>
            selectedId
                ? (events.find((entry) => entry.id === selectedId) ?? null)
                : null,
        [events, selectedId],
    );

    /* ----------------------------------------------------- refresh */
    const refresh = useCallback(async () => {
        setRefreshState('loading');
        try {
            const response = await fetch('/api/events?fresh=1', {
                cache: 'no-store',
            });
            if (!response.ok) throw new Error(String(response.status));
            const payload: unknown = await response.json();
            const parsed = parseEvents(payload);
            if (parsed === null) throw new Error('ungültige Antwort');
            setEvents(parsed);
            setRefreshAt(new Date());
            setRefreshState('ok');
        } catch {
            setRefreshState('error');
        }
    }, []);

    /* ---------------------------------------------------- calendar */
    const emptyTitle = hasFilters
        ? 'Keine Treffer'
        : `Kein Termin im ${monthLabel(cursor)}`;

    const emptyBody = hasFilters
        ? filtered.length === 0
            ? 'Zu dieser Suche und dieser Auswahl ist im Register nichts verzeichnet.'
            : yearFiltered.length === 0
              ? `Im Jahrgang ${activeYear} passt kein Treffer. ${filtered.length} Treffer stehen in anderen Jahrgängen.`
              : `Für ${monthLabel(cursor)} passt kein Treffer. ${yearFiltered.length} Treffer stehen in anderen Monaten dieses Jahres.`
        : 'Für diesen Monat ist im Register nichts eingetragen.';

    return (
        <Leaf
            margin={
                <Margin
                    date={now}
                    label={`Jahrgang ${activeYear}`}
                    tallies={[
                        { label: 'Einträge', value: yearEvents.length },
                        { label: 'Abgesagt', value: yearCancelled },
                        {
                            label: 'Nächster',
                            value: nextInYear
                                ? dateShort(nextInYear.start)
                                : '–',
                        },
                    ]}
                    note={
                        <>
                            Abgesagte Termine bleiben im Register und tragen
                            den Stempel. Die Zahlen gelten für den gewählten
                            Jahrgang.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker={`Register · Termine · ${dateLong(now)}`}
                title="Was steht an"
                lede="Der Terminkalender des Dorfes: Sitzungen, Feste, Sport und Kultur, dazu Hinweise aus den Vereinen. Abgesagte Einträge bleiben stehen und sind gekennzeichnet."
            />

            {missingLink && (
                <div className={styles.status}>
                    <Notice
                        tone="warn"
                        title="Termin nicht gefunden."
                    >
                        Der verlinkte Eintrag steht nicht mehr im Register.
                    </Notice>
                </div>
            )}

            {autoSelecting && (
                <div className={styles.status} aria-live="polite">
                    <Notice title="Termin wird geladen …">
                        Der verlinkte Eintrag wird geöffnet.
                    </Notice>
                </div>
            )}

            {refreshState === 'ok' && refreshAt && (
                <div className={styles.status} aria-live="polite">
                    <Notice tone="ok" title="Termine neu geladen.">
                        {clock(refreshAt)} Uhr · {events.length} Einträge im
                        Register.
                    </Notice>
                </div>
            )}

            {refreshState === 'error' && (
                <div className={styles.status}>
                    <Notice
                        tone="error"
                        title="Termine konnten nicht neu geladen werden."
                    >
                        Der Server hat nicht geantwortet. Die zuletzt geladenen
                        Einträge bleiben sichtbar.{' '}
                        <button
                            type="button"
                            className="btn btn--quiet btn--sm"
                            onClick={refresh}
                        >
                            Erneut laden
                        </button>
                    </Notice>
                </div>
            )}

            <div className={styles.yearRail}>
                <div>
                    <p className="rail-label" id="jahrgang-label">
                        Jahrgang
                    </p>
                    <div
                        className="rail"
                        role="group"
                        aria-labelledby="jahrgang-label"
                        onKeyDown={onYearKeyDown}
                    >
                        {years.map((year) => (
                            <button
                                key={year}
                                type="button"
                                ref={(element) => {
                                    yearButtons.current[year] = element;
                                }}
                                aria-current={
                                    year === activeYear ? 'true' : undefined
                                }
                                onClick={() => chooseYear(year)}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <form
                className="filterbar"
                role="search"
                onSubmit={(submitEvent) => submitEvent.preventDefault()}
            >
                <div className="field grow">
                    <label htmlFor="termin-suche">Suche</label>
                    <input
                        id="termin-suche"
                        className="input"
                        type="search"
                        value={query}
                        placeholder="Titel, Ort, Veranstalter"
                        autoComplete="off"
                        onChange={(changeEvent) =>
                            setQuery(changeEvent.target.value)
                        }
                    />
                </div>
                <div className="field">
                    <label htmlFor="termin-kategorie">Kategorie</label>
                    <select
                        id="termin-kategorie"
                        className="select"
                        value={category}
                        onChange={(changeEvent) =>
                            setCategory(changeEvent.target.value)
                        }
                    >
                        <option value="all">Alle Kategorien</option>
                        {CATEGORIES.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                                {entry.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="termin-verein">Verein</label>
                    <select
                        id="termin-verein"
                        className="select"
                        value={verein}
                        onChange={(changeEvent) =>
                            setVerein(changeEvent.target.value)
                        }
                    >
                        <option value="all">Alle Vereine</option>
                        {ASSOCIATIONS.map((entry) => (
                            <option key={entry.id} value={entry.id}>
                                {entry.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.filterFoot}>
                    <p className={styles.count} aria-live="polite">
                        {countLabel}
                    </p>
                    <button
                        type="button"
                        className="btn btn--quiet"
                        onClick={resetFilters}
                        disabled={!hasFilters}
                    >
                        Zurücksetzen
                    </button>
                </div>
            </form>

            <div className={styles.bar}>
                <div
                    className="tabs"
                    role="tablist"
                    aria-label="Darstellung"
                    onKeyDown={(keyEvent) => {
                        const index = VIEWS.indexOf(view);
                        let next = -1;
                        if (keyEvent.key === 'ArrowRight') {
                            next = (index + 1) % VIEWS.length;
                        } else if (keyEvent.key === 'ArrowLeft') {
                            next =
                                (index - 1 + VIEWS.length) % VIEWS.length;
                        } else if (keyEvent.key === 'Home') next = 0;
                        else if (keyEvent.key === 'End') {
                            next = VIEWS.length - 1;
                        }
                        if (next < 0) return;
                        keyEvent.preventDefault();
                        setView(VIEWS[next]);
                        document
                            .getElementById(`tab-${VIEWS[next]}`)
                            ?.focus();
                    }}
                >
                    <button
                        type="button"
                        role="tab"
                        id="tab-agenda"
                        aria-selected={view === 'agenda'}
                        aria-controls="kalender-panel"
                        tabIndex={view === 'agenda' ? 0 : -1}
                        onClick={() => setView('agenda')}
                    >
                        Agenda
                    </button>
                    <button
                        type="button"
                        role="tab"
                        id="tab-month"
                        aria-selected={view === 'month'}
                        aria-controls="kalender-panel"
                        tabIndex={view === 'month' ? 0 : -1}
                        onClick={() => setView('month')}
                    >
                        Monat
                    </button>
                </div>
                <div className={styles.barActions}>
                    <button
                        type="button"
                        className="btn btn--quiet"
                        onClick={refresh}
                        disabled={refreshState === 'loading'}
                    >
                        {refreshState === 'loading'
                            ? 'Lädt …'
                            : 'Aktualisieren'}
                    </button>
                </div>
            </div>

            <div
                id="kalender-panel"
                role="tabpanel"
                aria-labelledby={
                    view === 'agenda' ? 'tab-agenda' : 'tab-month'
                }
                tabIndex={0}
                className={styles.panel}
            >
                <section
                    className="cal"
                    aria-label={`Termine ${monthLabel(cursor)}`}
                >
                    <div className="cal-head">
                        <h2 className="cal-title" aria-live="polite">
                            {monthLabel(cursor)}
                        </h2>
                        <div className="cal-nav">
                            <button
                                type="button"
                                onClick={() => goMonth(-1)}
                                aria-label="Vorheriger Monat"
                            >
                                Zurück
                            </button>
                            <button type="button" onClick={goToday}>
                                Heute
                            </button>
                            <button
                                type="button"
                                onClick={() => goMonth(1)}
                                aria-label="Nächster Monat"
                            >
                                Weiter
                            </button>
                        </div>
                    </div>

                    {view === 'month' ? (
                        <MonthGrid
                            cursor={cursor}
                            days={days}
                            byDay={byDay}
                            todayIso={isoDay(today)}
                            onOpen={openEvent}
                        />
                    ) : monthRows.length > 0 ? (
                        <div className={styles.body}>
                            <Agenda events={monthRows} onOpen={openEvent} />
                        </div>
                    ) : null}

                    {monthRows.length === 0 && (
                        <div className={styles.calEmpty}>
                            <Empty
                                title={emptyTitle}
                                action={
                                    <div className={styles.emptyActions}>
                                        {hasFilters && (
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={resetFilters}
                                            >
                                                Filter zurücksetzen
                                            </button>
                                        )}
                                        {jumpMonth && (
                                            <button
                                                type="button"
                                                className="btn btn--quiet"
                                                onClick={() => {
                                                    setCursor(jumpMonth);
                                                    setView('agenda');
                                                }}
                                            >
                                                Zum {monthLabel(jumpMonth)}
                                            </button>
                                        )}
                                    </div>
                                }
                            >
                                {emptyBody}
                            </Empty>
                        </div>
                    )}
                </section>

                <div className={styles.key}>
                    <p className={styles.keyLabel}>Zeichen</p>
                    <ul className={styles.keyList}>
                        {CATEGORIES.map((entry) => (
                            <li key={entry.id}>
                                <span
                                    className={`${styles.swatch} ${categoryRule(entry.id)} ${categoryTint(entry.id)}`}
                                    aria-hidden="true"
                                />
                                {entry.label}
                            </li>
                        ))}
                        <li>
                            <span
                                className={`${styles.swatch} ${categoryRule('notfall')}`}
                                aria-hidden="true"
                            />
                            abgesagt: Stempel, durchgestrichen
                        </li>
                    </ul>
                </div>
            </div>

            <EventDialog event={selectedEvent} onClose={closeDialog} />
        </Leaf>
    );
}
