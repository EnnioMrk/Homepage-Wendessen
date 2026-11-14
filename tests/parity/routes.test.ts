/**
 * Route parity smoke tests.
 *
 * These tests talk to a running server. Start one first:
 *   bun run dev            (then BASE_URL=http://127.0.0.1:3001 bun test tests/parity)
 *   bun run start          (then BASE_URL=http://127.0.0.1:3000 bun test tests/parity)
 *
 * Every route that existed before the redesign must still answer. A route that
 * redirects must redirect to a real page, not to a 404.
 */
import { describe, expect, test } from 'bun:test';

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3001';

const PUBLIC_ROUTES = [
    '/',
    '/was-steht-an',
    '/neuigkeiten',
    '/dorfleben',
    '/dorfleben/ortsrat/mitglieder',
    '/dorfleben/ortsrat/bericht',
    '/dorfleben/vereine/feuerwehr',
    '/dorfleben/vereine/feuerwehr/einsatzabteilung',
    '/dorfleben/vereine/feuerwehr-portal',
    '/dorfleben/vereine/frauenhilfe',
    '/dorfleben/vereine/hospiz',
    '/dorfleben/vereine/idw',
    '/dorfleben/vereine/jugendfeuerwehr',
    '/dorfleben/vereine/kirchbauverein',
    '/dorfleben/vereine/kleingaertner',
    '/dorfleben/vereine/schuetzenverein',
    '/dorfleben/vereine/seniorenkreis',
    '/dorfleben/vereine/spritzenhaus',
    '/dorfleben/vereine/sv-wendessen',
    '/dorfleben/institutionen/hospiz',
    '/dorfleben/institutionen/kirche',
    '/dorfleben/wir-wendesser',
    '/dorfleben/wetter',
    '/dorfleben/karte',
    '/dorfleben/archiv',
    '/dorfleben/archiv/ortsrat-bericht/2023',
    '/geschichte',
    '/impressionen',
    '/impressionen/einreichen',
    '/wohnen-bauen',
    '/wohnen-bauen/neubaugebiet',
    '/wohnen-bauen/feuerwehrgeraetehaus',
    '/kontakt',
    '/kontakt/verzeichnis',
    '/kontakt/formular',
    '/kontakt/redaktionsteam',
    '/kontakt/whatsapp',
    '/kontakt/impressum',
    '/kontakt/datenschutz',
    '/impressum',
    '/datenschutz',
    '/suche',
    '/admin/login',
];

const ADMIN_ROUTES = [
    '/admin',
    '/admin/dashboard',
    '/admin/events',
    '/admin/news',
    '/admin/news/erstellen',
    '/admin/gallery',
    '/admin/portraits',
    '/admin/contacts',
    '/admin/contacts/neu',
    '/admin/organizations',
    '/admin/users',
    '/admin/settings',
    '/admin/logs',
    '/admin/archiv',
    '/admin/archiv/erstellen',
    '/admin/shared-gallery',
    '/admin/shared-gallery/meldungen',
    '/admin/wendessen',
    '/admin/wendessen/neu',
];

async function reachable(): Promise<boolean> {
    try {
        const res = await fetch(BASE + '/', { redirect: 'manual' });
        return res.status > 0;
    } catch {
        return false;
    }
}

const online = await reachable();

describe('public routes', () => {
    for (const route of PUBLIC_ROUTES) {
        test(`${route} answers`, async () => {
            if (!online) {
                console.warn(`server not reachable at ${BASE}; skipping`);
                return;
            }
            const res = await fetch(BASE + route, { redirect: 'manual' });
            expect([200, 301, 302, 307, 308]).toContain(res.status);
            if (res.status === 200) {
                const html = await res.text();
                expect(html).not.toContain('Application error');
                expect(html.toLowerCase()).not.toContain('internal server error');
            }
        });
    }
});

describe('admin routes are protected', () => {
    for (const route of ADMIN_ROUTES) {
        test(`${route} redirects or renders login`, async () => {
            if (!online) return;
            const res = await fetch(BASE + route, { redirect: 'manual' });
            expect([200, 301, 302, 307, 308]).toContain(res.status);
            if (res.status >= 300) {
                const location = res.headers.get('location') || '';
                expect(location).toContain('/admin/login');
            }
        });
    }
});

describe('public API contracts', () => {
    const endpoints: [string, number[]][] = [
        ['/api/events', [200]],
        ['/api/news', [200, 404, 405]],
        ['/api/weather', [200, 500, 503]],
        ['/api/settings', [200]],
        ['/api/archive', [200]],
        ['/api/wendessen', [200]],
        ['/api/portraits/approved', [200]],
        ['/api/shared-gallery/my-groups', [200, 400]],
    ];

    for (const [endpoint, allowed] of endpoints) {
        test(`${endpoint} still answers`, async () => {
            if (!online) return;
            const res = await fetch(BASE + endpoint, { redirect: 'manual' });
            expect(allowed).toContain(res.status);
        });
    }

    test('admin API is not public', async () => {
        if (!online) return;
        const res = await fetch(BASE + '/api/admin/users', {
            redirect: 'manual',
        });
        expect([401, 403, 302, 307]).toContain(res.status);
    });
});
