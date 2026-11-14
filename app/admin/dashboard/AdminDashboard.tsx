'use client';

import Link from 'next/link';
import { CalendarEvent, NewsItem } from '@/lib/database';
import { AdminHead, Panel, Stat } from '@/app/components/admin/AdminPage';
import {
    dayOf,
    monthShort,
    timeRange,
    dateLong,
    dateShort,
    weekday,
} from '@/app/lib/register-format';

interface AdminDashboardProps {
    events: CalendarEvent[];
    news: NewsItem[];
    galleryCount: number;
    portraitsCount?: number;
    eventsError?: string;
    newsError?: string;
    galleryError?: string;
    portraitsError?: string;
    canViewEvents: boolean;
    canViewNews: boolean;
    canViewAdminGallery: boolean;
    canViewSharedGallery: boolean;
    canViewPortraits: boolean;
    canViewArchive: boolean;
    canManageEvents: boolean;
    canManageNews: boolean;
    canManageUsers: boolean;
    canViewSettings: boolean;
    canViewLogs: boolean;
    canViewWendessen: boolean;
    canViewContacts: boolean;
}

export default function AdminDashboard({
    events,
    news,
    galleryCount,
    portraitsCount = 0,
    eventsError,
    newsError,
    galleryError,
    portraitsError,
    canViewEvents,
    canViewNews,
    canViewAdminGallery,
    canViewSharedGallery,
    canViewPortraits,
    canViewArchive,
    canManageEvents,
    canManageNews,
    canManageUsers,
    canViewSettings,
    canViewLogs,
    canViewWendessen,
    canViewContacts,
}: AdminDashboardProps) {
    const now = new Date();
    const upcoming = events
        .filter((e) => e.start >= new Date(now.toDateString()))
        .slice(0, 6);
    const cancelledSoon = upcoming.filter((e) => e.isCancelled).length;
    const recentNews = news.slice(0, 5);

    return (
        <div>
            <AdminHead
                title="Schreibtisch"
                sub={`${dateLong(now)} · ${weekday(now).toLowerCase()} · Register der Redaktion`}
                actions={
                    <>
                        {canManageEvents && (
                            <Link className="btn btn--sm" href="/admin/events">
                                Termin anlegen
                            </Link>
                        )}
                        {canManageNews && (
                            <Link className="btn btn--sm" href="/admin/news/erstellen">
                                Nachricht schreiben
                            </Link>
                        )}
                    </>
                }
            />

            <div className="stat-grid">
                {canViewEvents && (
                    <Stat
                        label="Termine"
                        value={events.length}
                        note={`${upcoming.length} stehen an`}
                        href="/admin/events"
                    />
                )}
                {canViewNews && (
                    <Stat
                        label="Nachrichten"
                        value={news.length}
                        note={`${news.filter((n) => n.isPinned).length} angeheftet`}
                        href="/admin/news"
                    />
                )}
                {(canViewAdminGallery || canViewSharedGallery) && (
                    <Stat
                        label="Bilder"
                        value={galleryCount}
                        note="freigegeben"
                        href={canViewSharedGallery ? '/admin/shared-gallery' : '/admin/gallery'}
                    />
                )}
                {canViewPortraits && (
                    <Stat
                        label="Porträts"
                        value={portraitsCount}
                        note="eingereicht"
                        href="/admin/portraits"
                    />
                )}
            </div>

            {eventsError && (
                <div className="notice notice--error" style={{ marginTop: 'var(--s4)' }}>
                    <strong>Termine nicht geladen</strong>
                    <span>{eventsError}</span>
                </div>
            )}
            {(galleryError || portraitsError) && (
                <div className="notice notice--error" style={{ marginTop: 'var(--s4)' }}>
                    <strong>Bestand nicht vollständig geladen</strong>
                    <span>
                        {[galleryError, portraitsError].filter(Boolean).join(' · ')}
                    </span>
                </div>
            )}
            {newsError && (
                <div className="notice notice--error" style={{ marginTop: 'var(--s4)' }}>
                    <strong>Nachrichten nicht geladen</strong>
                    <span>{newsError}</span>
                </div>
            )}

            {cancelledSoon > 0 && (
                <div className="notice notice--warn" style={{ marginTop: 'var(--s4)' }}>
                    <strong>
                        {cancelledSoon === 1
                            ? 'Ein kommender Termin ist abgesagt'
                            : `${cancelledSoon} kommende Termine sind abgesagt`}
                    </strong>
                    <span>
                        Abgesagte Termine bleiben im Register sichtbar. Prüfen Sie,
                        ob Ersatz nötig ist.
                    </span>
                </div>
            )}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--s5)',
                    marginTop: 'var(--s6)',
                    alignItems: 'start',
                }}
            >
                {canViewEvents && (
                    <Panel
                        title="Nächste Termine"
                        flush
                        actions={
                            <Link className="arrow-link" href="/admin/events">
                                Alle
                            </Link>
                        }
                    >
                        {upcoming.length === 0 ? (
                            <p className="admin-empty">
                                Keine kommenden Termine eingetragen.
                            </p>
                        ) : (
                            <div>
                                {upcoming.map((event) => (
                                    <Link
                                        key={event.id}
                                        href="/admin/events"
                                        className="entry"
                                        data-state={
                                            event.isCancelled ? 'cancelled' : 'open'
                                        }
                                        style={{
                                            paddingInline: 'var(--s4)',
                                            gridTemplateColumns: '64px minmax(0, 1fr) auto',
                                        }}
                                    >
                                        <span className="entry-date" aria-hidden="true">
                                            <span className="d">{dayOf(event.start)}</span>
                                            <span className="m">{monthShort(event.start)}</span>
                                        </span>
                                        <span className="entry-body">
                                            <span className="entry-title" style={{ fontSize: 'var(--label)' }}>
                                                {event.title}
                                            </span>
                                            <span className="entry-meta">
                                                <span>{timeRange(event.start, event.end)}</span>
                                                {event.location && <span>{event.location}</span>}
                                            </span>
                                        </span>
                                        <span className="entry-state">
                                            {event.isCancelled ? (
                                                <span className="stamp stamp--cancelled">Abgesagt</span>
                                            ) : null}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </Panel>
                )}

                <div style={{ display: 'grid', gap: 'var(--s5)' }}>
                    {canViewNews && (
                        <Panel
                            title="Zuletzt verzeichnet"
                            flush
                            actions={
                                <Link className="arrow-link" href="/admin/news">
                                    Alle
                                </Link>
                            }
                        >
                            {recentNews.length === 0 ? (
                                <p className="admin-empty">Noch keine Nachricht.</p>
                            ) : (
                                <div>
                                    {recentNews.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/admin/news/bearbeiten/${item.id}`}
                                            className="entry"
                                            style={{
                                                paddingInline: 'var(--s4)',
                                                gridTemplateColumns: '56px minmax(0, 1fr)',
                                            }}
                                        >
                                            <span className="entry-date" aria-hidden="true">
                                                <span className="d" style={{ fontSize: 'var(--small)' }}>
                                                    {dayOf(item.publishedDate)}
                                                </span>
                                                <span className="m">{monthShort(item.publishedDate)}</span>
                                            </span>
                                            <span className="entry-body">
                                                <span className="entry-title" style={{ fontSize: 'var(--small)' }}>
                                                    {item.title}
                                                </span>
                                                <span className="entry-meta">
                                                    <span>{item.category}</span>
                                                    <span>{dateShort(item.publishedDate)}</span>
                                                </span>
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </Panel>
                    )}

                    <Panel title="Wege">
                        <div style={{ display: 'grid', gap: 0 }}>
                            {canManageUsers && (
                                <Link className="tally" href="/admin/users">
                                    <span>Benutzer und Rechte</span>
                                    <strong>→</strong>
                                </Link>
                            )}
                            {canViewContacts && (
                                <Link className="tally" href="/admin/contacts">
                                    <span>Kontakte</span>
                                    <strong>→</strong>
                                </Link>
                            )}
                            {canViewArchive && (
                                <Link className="tally" href="/admin/archiv">
                                    <span>Archiv</span>
                                    <strong>→</strong>
                                </Link>
                            )}
                            {canViewWendessen && (
                                <Link className="tally" href="/admin/wendessen">
                                    <span>Dorfwissen</span>
                                    <strong>→</strong>
                                </Link>
                            )}
                            {canViewSettings && (
                                <Link className="tally" href="/admin/settings">
                                    <span>Einstellungen</span>
                                    <strong>→</strong>
                                </Link>
                            )}
                            {canViewLogs && (
                                <Link className="tally" href="/admin/logs">
                                    <span>Protokolle</span>
                                    <strong>→</strong>
                                </Link>
                            )}
                        </div>
                    </Panel>
                </div>
            </div>
        </div>
    );
}
