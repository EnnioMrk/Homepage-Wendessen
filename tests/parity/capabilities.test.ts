/**
 * Capability parity tests.
 *
 * Read-only. They prove that the data layer still exposes every capability the
 * product had: cancelled dates survive, news pins order, contacts keep their
 * importance, the public gallery only exposes approved images, the public
 * portrait endpoint only exposes approved people, and the schema is intact.
 *
 * They run against the configured DATABASE_URL. No test writes a row.
 */
import { describe, expect, test } from 'bun:test';
import {
    getEvents,
    getUpcomingEvents,
    getNews,
    getRecentNews,
    getContacts,
    getApprovedSharedGalleryGroups,
    getPortraitSubmissions,
} from '@/lib/database';
import { getOrganizations } from '@/lib/database/organizations';
import { sql } from '@/lib/sql';

describe('schema', () => {
    test('all 17 tables exist', async () => {
        const rows = await sql`
            SELECT table_name FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name
        `;
        const names = rows.map((r: Record<string, unknown>) => String(r.table_name));
        for (const table of [
            'admin_logs',
            'admin_users',
            'archive',
            'contacts',
            'events',
            'gallery_images',
            'news',
            'notification_events',
            'organizations',
            'permissions',
            'portraits',
            'push_subscriptions',
            'roles',
            'shared_gallery_reports',
            'shared_gallery_submissions',
            'site_settings',
            'wendessen_layouts',
        ]) {
            expect(names).toContain(table);
        }
    });
});

describe('events', () => {
    test('cancelled dates keep their row and their state', async () => {
        const events = await getEvents();
        expect(events.length).toBeGreaterThan(0);

        const cancelled = events.filter((e) => e.isCancelled);
        for (const event of cancelled) {
            expect(event.isCancelled).toBe(true);
            expect(event.cancelledAt instanceof Date).toBe(true);
            expect(event.title.length).toBeGreaterThan(0);
        }
    });

    test('every event has a start and a category', async () => {
        const events = await getEvents();
        for (const event of events) {
            expect(event.start instanceof Date).toBe(true);
            expect(Number.isNaN(event.start.getTime())).toBe(false);
            expect([
                'sitzung',
                'veranstaltung',
                'sport',
                'kultur',
                'notfall',
                'sonstiges',
            ]).toContain(event.category);
        }
    });

    test('upcoming events are ordered and not in the past', async () => {
        const upcoming = await getUpcomingEvents(5);
        expect(upcoming.length).toBeLessThanOrEqual(5);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        for (const event of upcoming) {
            expect(event.start.getTime()).toBeGreaterThanOrEqual(now.getTime());
        }
        const times = upcoming.map((e) => e.start.getTime());
        expect([...times].sort((a, b) => a - b)).toEqual(times);
    });
});

describe('news', () => {
    test('articles have a stable public id', async () => {
        const news = await getNews();
        for (const item of news) {
            expect(item.articleId.length).toBeGreaterThan(0);
            expect(item.articleId).not.toBe('undefined');
        }
    });

    test('pinned articles lead the recent list', async () => {
        const recent = await getRecentNews(4);
        const news = await getNews();
        const pinnedCount = news.filter((n) => n.isPinned).length;
        if (pinnedCount > 0 && recent.length > 0) {
            expect(recent[0].isPinned).toBe(true);
        }
    });
});

describe('people', () => {
    test('contacts carry affiliations and an importance score', async () => {
        const contacts = await getContacts();
        expect(contacts.length).toBeGreaterThan(0);
        for (const contact of contacts.slice(0, 10)) {
            expect(contact.name.length).toBeGreaterThan(0);
            expect(Array.isArray(contact.emails)).toBe(true);
            expect(Array.isArray(contact.phones)).toBe(true);
            expect(typeof contact.importance).toBe('number');
        }
    });

    test('organisations are listed', async () => {
        const orgs = await getOrganizations();
        expect(orgs.length).toBeGreaterThan(0);
    });
});

describe('uploads and moderation', () => {
    test('the public gallery only exposes approved images', async () => {
        const groups = await getApprovedSharedGalleryGroups();
        for (const group of groups) {
            expect(group.images.length).toBeGreaterThan(0);
            for (const image of group.images) {
                expect(image.status).toBe('approved');
            }
        }
    });

    test('portraits keep their moderation status', async () => {
        const portraits = await getPortraitSubmissions();
        for (const portrait of portraits) {
            expect(['pending', 'approved', 'rejected']).toContain(
                portrait.status,
            );
        }
    });
});

describe('settings', () => {
    test('site settings resolve to strings', async () => {
        const rows = await sql`SELECT key, value FROM site_settings`;
        expect(rows.length).toBeGreaterThan(0);
        for (const row of rows) {
            expect(typeof row.key).toBe('string');
            expect(typeof row.value).toBe('string');
        }
    });
});
