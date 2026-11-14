import { Suspense } from 'react';
import Link from 'next/link';
import type { CalendarEvent, ContactListItem, NewsItem } from '@/lib/database';
import { getContacts, getEvents, getNews } from '@/lib/database';
import { ASSOCIATIONS } from '@/lib/constants/associations';
import {
    Empty,
    Leaf,
    Margin,
    Notice,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';
import { Entry } from '@/app/components/register/Entry';
import { dateLong, yearOf } from '@/app/lib/register-format';

export const metadata = {
    title: 'Suche',
    description:
        'Termine, Nachrichten, Ansprechpartner und Vereine in Wendessen durchsuchen.',
    robots: { index: false, follow: true },
};

const LIMIT = 12;

const categoryLabels: Record<CalendarEvent['category'], string> = {
    sitzung: 'Sitzung',
    veranstaltung: 'Veranstaltung',
    sport: 'Sport',
    kultur: 'Kultur',
    notfall: 'Notfall',
    sonstiges: 'Sonstiges',
};

interface SearchParams {
    q?: string | string[];
}

function normalize(value: string | string[] | undefined): string {
    const raw = Array.isArray(value) ? value[0] : value;
    return (raw ?? '').trim();
}

function has(needle: string, ...fields: (string | undefined | null)[]) {
    return fields.some(
        (field) => typeof field === 'string' && field.toLowerCase().includes(needle),
    );
}

function phoneHref(value: string): string {
    return `tel:${value.replace(/[^\d+]/g, '')}`;
}

function SearchForm({ value }: { value: string }) {
    return (
        <form className="filterbar" action="/suche" method="get" role="search">
            <div className="field grow">
                <label htmlFor="suche-q">Suchbegriff</label>
                <input
                    id="suche-q"
                    name="q"
                    type="search"
                    className="input"
                    defaultValue={value}
                    placeholder="Verein, Person, Termin, Ort"
                    autoComplete="off"
                />
                <span className="hint">
                    Durchsucht Termine, Nachrichten, Ansprechpartner und Vereine.
                </span>
            </div>
            <button type="submit" className="btn btn--primary">
                Suchen
            </button>
        </form>
    );
}

function SucheLaden() {
    return (
        <Leaf full>
            <div className="skeleton" style={{ minHeight: '240px' }}>
                <p
                    className="muted small"
                    style={{ padding: 'var(--s4)' }}
                    role="status"
                >
                    Suche läuft …
                </p>
            </div>
        </Leaf>
    );
}

async function Suche({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const query = normalize((await searchParams).q);
    const needle = query.toLowerCase();
    const today = await pageToday();

    let news: NewsItem[] = [];
    let events: CalendarEvent[] = [];
    let contacts: ContactListItem[] = [];
    const errors: string[] = [];

    if (needle.length > 0) {
        try {
            news = await getNews();
        } catch (error) {
            console.error('Suche: Nachrichten nicht geladen', error);
            errors.push('Nachrichten');
        }
        try {
            events = await getEvents();
        } catch (error) {
            console.error('Suche: Termine nicht geladen', error);
            errors.push('Termine');
        }
        try {
            contacts = await getContacts();
        } catch (error) {
            console.error('Suche: Kontakte nicht geladen', error);
            errors.push('Ansprechpartner');
        }
    }

    const matchedNews = news.filter((item) =>
        has(needle, item.title, item.category),
    );

    const matchedEvents = events
        .filter((event) =>
            has(
                needle,
                event.title,
                event.description,
                event.location,
                event.organizer,
                categoryLabels[event.category],
            ),
        )
        .sort((a, b) => {
            const now = today.getTime();
            const aPast = a.start.getTime() < now;
            const bPast = b.start.getTime() < now;
            if (aPast !== bPast) return aPast ? 1 : -1;
            return aPast
                ? b.start.getTime() - a.start.getTime()
                : a.start.getTime() - b.start.getTime();
        });

    const matchedContacts = contacts
        .filter((contact) =>
            has(
                needle,
                contact.name,
                ...contact.emails,
                ...contact.phones.map((phone) => phone.value),
                ...contact.addresses,
                ...contact.affiliations.flatMap((affiliation) => [
                    affiliation.org,
                    affiliation.role,
                ]),
            ),
        )
        .sort((a, b) => a.name.localeCompare(b.name, 'de'));

    const matchedClubs = ASSOCIATIONS.filter((club) =>
        has(needle, club.title, club.description),
    );

    const total =
        matchedEvents.length +
        matchedNews.length +
        matchedContacts.length +
        matchedClubs.length;

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    note={
                        <>
                            Gesucht wird in Terminen, Nachrichten,
                            Ansprechpartnern und Vereinen. Die Suche läuft auf
                            dem Server; es werden keine Suchbegriffe gespeichert.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Register · Suche"
                title="Suche"
                lede="Ein Begriff, vier Register: Termine, Nachrichten, Ansprechpartner und Vereine. Jeder Treffer führt zu seinem Eintrag."
            />

            <SearchForm value={query} />

            {query.length === 0 ? (
                <div style={{ marginTop: 'var(--s5)' }}>
                    <Notice tone="info" title="Noch kein Suchbegriff">
                        Geben Sie einen Namen, ein Stichwort oder einen Ort ein.
                        Gesucht wird in allen vier Teilen des Registers.
                    </Notice>
                    <div className="pill-row" style={{ marginTop: 'var(--s4)' }}>
                        <Link className="btn btn--quiet btn--sm" href="/was-steht-an">
                            Termine
                        </Link>
                        <Link className="btn btn--quiet btn--sm" href="/neuigkeiten">
                            Nachrichten
                        </Link>
                        <Link className="btn btn--quiet btn--sm" href="/kontakt/verzeichnis">
                            Verzeichnis
                        </Link>
                        <Link className="btn btn--quiet btn--sm" href="/dorfleben">
                            Dorfleben
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    {errors.length > 0 ? (
                        <div style={{ marginTop: 'var(--s4)' }}>
                            <Notice
                                tone="warn"
                                title="Teil des Registers nicht lesbar"
                            >
                                Nicht gelesen werden konnten:{' '}
                                {errors.join(', ')}. Die übrigen Treffer stehen
                                unten.{' '}
                                <Link
                                    className="link"
                                    href={`/suche?q=${encodeURIComponent(query)}`}
                                >
                                    Erneut suchen
                                </Link>
                            </Notice>
                        </div>
                    ) : null}

                    <p
                        className="muted small"
                        role="status"
                        style={{ margin: 'var(--s4) 0 0' }}
                    >
                        {total} Treffer für „{query}“ · Stand {dateLong(today)}
                    </p>

                    {total === 0 ? (
                        <div style={{ marginTop: 'var(--s5)' }}>
                            <Empty
                                title="Keine Treffer"
                                action={
                                    <Link className="btn" href="/suche">
                                        Suche leeren
                                    </Link>
                                }
                            >
                                Für „{query}“ ist im Register nichts
                                verzeichnet. Prüfen Sie die Schreibweise oder
                                suchen Sie nach einem Verein, einer Person oder
                                einem Ort.
                            </Empty>
                        </div>
                    ) : null}

                    {matchedEvents.length > 0 ? (
                        <section className="block" aria-labelledby="treffer-termine">
                            <SectionHead
                                title={`Termine (${matchedEvents.length})`}
                                id="treffer-termine"
                            />
                            <div className="entries">
                                {matchedEvents.slice(0, LIMIT).map((event) => (
                                    <Entry
                                        key={event.id}
                                        date={event.start}
                                        endDate={event.end}
                                        title={event.title}
                                        href={`/was-steht-an?event=${event.id}`}
                                        number={event.id}
                                        meta={[event.location, event.organizer]}
                                        description={event.description}
                                        state={
                                            event.isCancelled
                                                ? 'cancelled'
                                                : 'open'
                                        }
                                    />
                                ))}
                            </div>
                            {matchedEvents.length > LIMIT ? (
                                <div className="pill-row" style={{ marginTop: 'var(--s4)' }}>
                                    <Link className="arrow-link" href="/was-steht-an">
                                        Alle Termine im Register
                                    </Link>
                                </div>
                            ) : null}
                        </section>
                    ) : null}

                    {matchedNews.length > 0 ? (
                        <section className="block" aria-labelledby="treffer-nachrichten">
                            <SectionHead
                                title={`Nachrichten (${matchedNews.length})`}
                                id="treffer-nachrichten"
                            />
                            <div className="entries">
                                {matchedNews.slice(0, LIMIT).map((item) => (
                                    <Entry
                                        key={item.id}
                                        date={item.publishedDate}
                                        title={item.title}
                                        href={`/neuigkeiten/${item.articleId}`}
                                        meta={[item.category]}
                                        number={item.id}
                                        showClock={false}
                                        timeText={String(yearOf(item.publishedDate))}
                                    />
                                ))}
                            </div>
                            {matchedNews.length > LIMIT ? (
                                <div className="pill-row" style={{ marginTop: 'var(--s4)' }}>
                                    <Link className="arrow-link" href="/neuigkeiten">
                                        Alle Nachrichten
                                    </Link>
                                </div>
                            ) : null}
                        </section>
                    ) : null}

                    {matchedContacts.length > 0 ? (
                        <section className="block" aria-labelledby="treffer-personen">
                            <SectionHead
                                title={`Ansprechpartner (${matchedContacts.length})`}
                                id="treffer-personen"
                            />
                            <div className="dir">
                                {matchedContacts.slice(0, LIMIT).map((contact) => (
                                    <div className="dir-person" key={contact.id}>
                                        <div>
                                            <p className="dir-name">
                                                <Link
                                                    href={`/kontakt/verzeichnis#kontakt-${contact.id}`}
                                                >
                                                    {contact.name}
                                                </Link>
                                            </p>
                                            <p className="dir-affil">
                                                {contact.affiliations.length > 0
                                                    ? contact.affiliations
                                                          .map(
                                                              (affiliation) =>
                                                                  `${affiliation.role} · ${affiliation.org}`,
                                                          )
                                                          .join(' / ')
                                                    : 'Ohne Zuordnung'}
                                            </p>
                                        </div>
                                        <div className="dir-contacts">
                                            {contact.emails.slice(0, 2).map((email) => (
                                                <a key={email} href={`mailto:${email}`}>
                                                    {email}
                                                </a>
                                            ))}
                                            {contact.phones.slice(0, 1).map((phone) => (
                                                <a
                                                    key={`${phone.type}-${phone.value}`}
                                                    href={phoneHref(phone.value)}
                                                >
                                                    {phone.value}
                                                </a>
                                            ))}
                                            {contact.emails.length === 0 &&
                                            contact.phones.length === 0 ? (
                                                <span className="muted">
                                                    Keine Kontaktdaten hinterlegt
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className="dir-importance">Verzeichnis</p>
                                    </div>
                                ))}
                            </div>
                            {matchedContacts.length > LIMIT ? (
                                <div className="pill-row" style={{ marginTop: 'var(--s4)' }}>
                                    <Link className="arrow-link" href="/kontakt/verzeichnis">
                                        Ganzes Verzeichnis
                                    </Link>
                                </div>
                            ) : null}
                        </section>
                    ) : null}

                    {matchedClubs.length > 0 ? (
                        <section className="block" aria-labelledby="treffer-vereine">
                            <SectionHead
                                title={`Vereine (${matchedClubs.length})`}
                                id="treffer-vereine"
                            />
                            <div className="club-index">
                                {matchedClubs.map((club, index) => (
                                    <Link
                                        key={club.id}
                                        href={club.buttonHref}
                                        className="club-line"
                                    >
                                        <span className="club-num">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="club-name">
                                            {club.title}
                                        </span>
                                        <span className="club-desc">
                                            {club.description}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </>
            )}
        </Leaf>
    );
}

export default async function SuchePage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    return (
        <Suspense fallback={<SucheLaden />}>
            <Suche searchParams={searchParams} />
        </Suspense>
    );
}
