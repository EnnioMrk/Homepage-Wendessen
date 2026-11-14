// Capture the register at three widths into .impeccable/review/.
//
//   node scripts/capture-review.mjs [base-url]
//
// Needs a running server. Signs in once with the credentials in
// /tmp/opencode/temp-admin-pw.txt when it exists, and reuses that session for
// the admin screens. One browser, sequential pages, closed at the end.
import { chromium, devices } from '/home/openchamber/.config/opencode/skills/web-playtest/scripts/node_modules/playwright-core/index.mjs';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:3002';
const OUT = '.impeccable/review';

const PUBLIC = [
    '/',
    '/was-steht-an',
    '/was-steht-an?event=77',
    '/neuigkeiten',
    '/neuigkeiten/e39666f1',
    '/dorfleben',
    '/dorfleben/ortsrat/mitglieder',
    '/dorfleben/vereine/schuetzenverein',
    '/dorfleben/institutionen/hospiz',
    '/dorfleben/karte',
    '/dorfleben/wetter',
    '/dorfleben/archiv',
    '/dorfleben/wir-wendesser',
    '/geschichte',
    '/impressionen',
    '/impressionen/einreichen',
    '/wohnen-bauen',
    '/wohnen-bauen/neubaugebiet',
    '/kontakt',
    '/kontakt/verzeichnis',
    '/kontakt/formular',
    '/kontakt/redaktionsteam',
    '/impressum',
    '/datenschutz',
    '/suche?q=verein',
    '/gibt-es-nicht',
];

const ADMIN = [
    '/admin/login',
    '/admin/dashboard',
    '/admin/events',
    '/admin/news',
    '/admin/news/erstellen',
    '/admin/gallery',
    '/admin/portraits',
    '/admin/contacts',
    '/admin/organizations',
    '/admin/users',
    '/admin/settings',
    '/admin/logs',
    '/admin/archiv',
    '/admin/shared-gallery',
    '/admin/shared-gallery/meldungen',
    '/admin/wendessen',
];

const VIEWPORTS = [
    { tag: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 },
    { tag: 'tablet', width: 834, height: 1112, deviceScaleFactor: 1 },
    { tag: 'phone', width: 390, height: 844, deviceScaleFactor: 1 },
];

const passwordFile = '/tmp/opencode/temp-admin-pw.txt';
const password = existsSync(passwordFile)
    ? readFileSync(passwordFile, 'utf8').trim()
    : null;

const browser = await chromium.launch({
    executablePath: process.env.WEB_PLAYTEST_CHROMIUM || '/usr/bin/chromium',
    args: ['--no-sandbox'],
});

let shots = 0;
let failures = [];

for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
        ...devices['Desktop Chrome'],
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.deviceScaleFactor,
        reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const dir = `${OUT}/${viewport.tag}`;
    mkdirSync(dir, { recursive: true });

    const shot = async (route, suffix = '') => {
        const name = (route === '/' ? 'home' : route.replace(/^\//, '').replace(/[/?=&]/g, '_')) + suffix;
        try {
            await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 45000 });
            // Signed object URLs resolve after the page's own data, and
            // next/image only loads what enters the viewport. Scroll the page
            // once, then return to the top, so no plate is captured in its
            // fallback state.
            await page.evaluate(async () => {
                // Lazy images below the fold must be requested before a
                // full-page capture, or the shot shows empty boxes.
                document.querySelectorAll('img').forEach((img) => {
                    img.loading = 'eager';
                    img.decoding = 'sync';
                });
                const step = window.innerHeight * 0.8;
                for (let y = 0; y < document.body.scrollHeight; y += step) {
                    window.scrollTo(0, y);
                    await new Promise((r) => setTimeout(r, 120));
                }
                window.scrollTo(0, 0);
            });
            await page.waitForTimeout(1200);
            // Full-page captures can paint lazy images as empty boxes when they
            // sit outside the composited viewport. Grow the viewport to the
            // document height first, let the browser paint, then capture.
            const height = await page.evaluate(() =>
                Math.min(document.documentElement.scrollHeight, 16000),
            );
            await page.setViewportSize({
                width: viewport.width,
                height: Math.max(viewport.height, height),
            });
            await page.waitForTimeout(1400);
            await page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
            await page.setViewportSize({
                width: viewport.width,
                height: viewport.height,
            });
            shots++;
        } catch (error) {
            failures.push(`${viewport.tag} ${route}: ${String(error).slice(0, 90)}`);
        }
    };

    for (const route of PUBLIC) await shot(route);

    if (password) {
        try {
            await page.goto(BASE + '/admin/login', { waitUntil: 'domcontentloaded', timeout: 45000 });
            await page.fill('#username', 'redesign-review');
            await page.fill('#password', password);
            await page.click('button[type=submit]');
            await page.waitForURL('**/admin/dashboard', { timeout: 30000 });
            for (const route of ADMIN) await shot(route);
        } catch (error) {
            failures.push(`${viewport.tag} admin login: ${String(error).slice(0, 120)}`);
        }
    }

    await context.close();
}

await browser.close();
console.log(`captured ${shots} screenshots into ${OUT}`);
if (failures.length) {
    console.log('failures:');
    for (const f of failures) console.log(' -', f);
    process.exit(1);
}
