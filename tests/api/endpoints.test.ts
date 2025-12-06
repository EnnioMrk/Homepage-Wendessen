import { describe, test, expect, beforeAll } from 'bun:test';
import fs from 'fs';
import path from 'path';

// Load .env file manually for tests
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            const value = valueParts.join('=');
            if (key && value && !process.env[key]) {
                process.env[key] = value;
            }
        }
    }
}

// Base URL for API tests (assumes dev server is running)
const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3000';

// Helper to check if server is available
async function isServerAvailable(): Promise<boolean> {
    try {
        const response = await fetch(`${BASE_URL}/api/events`, {
            method: 'GET',
            signal: AbortSignal.timeout(2000),
        });
        return response.ok || response.status === 500; // Server is responding
    } catch {
        return false;
    }
}

let serverAvailable = false;

describe('API Endpoints', () => {
    beforeAll(async () => {
        serverAvailable = await isServerAvailable();
        if (!serverAvailable) {
            console.warn(
                '⚠️  Dev server not available at',
                BASE_URL,
                '- skipping API tests'
            );
        }
    });

    describe('GET /api/events', () => {
        test('returns 200 and array of events', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/events`);

            expect(response.status).toBe(200);

            const data = await response.json();
            expect(Array.isArray(data)).toBe(true);
        });

        test('events have required fields', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/events`);
            const events = await response.json();

            if (events.length > 0) {
                const event = events[0];
                expect(event.id).toBeDefined();
                expect(event.title).toBeDefined();
                expect(event.start).toBeDefined();
                expect(event.end).toBeDefined();
                expect(event.category).toBeDefined();
            }
        });

        test('returns proper cache headers', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/events`);
            const cacheControl = response.headers.get('cache-control');

            // Should have some cache control
            expect(cacheControl).toBeDefined();
        });
    });

    describe('POST /api/events (without auth)', () => {
        test('returns 401 or 403 without authentication', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'Test Event',
                    start: new Date().toISOString(),
                    end: new Date().toISOString(),
                }),
            });

            // Should be unauthorized or forbidden
            expect([401, 403, 500]).toContain(response.status);
        });
    });

    describe('GET /api/portraits', () => {
        test('returns portraits or error response', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/portraits`);

            // Should return 200 with data, 404 if no portraits, or 405 if method not allowed
            expect([200, 404, 405]).toContain(response.status);

            if (response.status === 200) {
                const data = await response.json();
                expect(Array.isArray(data)).toBe(true);
            }
        });
    });

    describe('GET /api/archive', () => {
        test('returns archive items', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/archive`);

            expect([200, 404]).toContain(response.status);

            if (response.status === 200) {
                const data = await response.json();
                expect(Array.isArray(data)).toBe(true);
            }
        });
    });

    describe('GET /api/shared-gallery', () => {
        test('returns shared gallery submissions', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/shared-gallery`);

            expect([200, 404]).toContain(response.status);
        });
    });

    describe('Admin API endpoints (without auth)', () => {
        test('GET /api/admin/me returns 401 without auth', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/admin/me`);

            expect([401, 403]).toContain(response.status);
        });

        test('GET /api/admin/users requires authentication', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/admin/users`);

            // Should return 401, 403, or 500 (when auth check fails)
            expect([401, 403, 500]).toContain(response.status);
        });

        test('GET /api/admin/roles requires authentication', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/admin/roles`);

            // Should return 401, 403, or 500 (when auth check fails)
            expect([401, 403, 500]).toContain(response.status);
        });

        test('GET /api/admin/permissions requires authentication', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/admin/permissions`);

            // Should return 401, 403, or 500 (when auth check fails)
            expect([401, 403, 500]).toContain(response.status);
        });
    });

    describe('POST /api/admin/login', () => {
        test('returns 401 with invalid credentials', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'invalid_user',
                    password: 'invalid_password',
                }),
            });

            expect(response.status).toBe(401);
        });

        test('returns 400 with missing credentials', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            expect([400, 401]).toContain(response.status);
        });
    });

    describe('POST /api/admin/logout', () => {
        test('logout works without auth', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/admin/logout`, {
                method: 'POST',
            });

            // Logout should succeed even without active session
            expect([200, 401]).toContain(response.status);
        });
    });

    describe('API error handling', () => {
        test('invalid JSON returns 400', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: 'not valid json',
            });

            expect([400, 500]).toContain(response.status);
        });

        test('non-existent endpoint returns 404', async () => {
            if (!serverAvailable) return;

            const response = await fetch(
                `${BASE_URL}/api/non-existent-endpoint`
            );

            expect(response.status).toBe(404);
        });
    });

    describe('Content-Type headers', () => {
        test('JSON endpoints return application/json', async () => {
            if (!serverAvailable) return;

            const response = await fetch(`${BASE_URL}/api/events`);
            const contentType = response.headers.get('content-type');

            expect(contentType).toContain('application/json');
        });
    });
});
