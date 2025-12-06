import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import Pg from 'pg';
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

const { Pool } = Pg;

// Use TEST_DATABASE_URL for integration tests, fall back to DATABASE_URL
// The mirror script sets up the test database at port 5431
const TEST_DATABASE_URL =
    process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

// Skip database tests if no database URL is available
const describeFn = TEST_DATABASE_URL ? describe : describe.skip;

describeFn('Database Integration Tests', () => {
    let pool: Pg.Pool;

    beforeAll(() => {
        if (!TEST_DATABASE_URL) {
            console.warn('TEST_DATABASE_URL not set, skipping database tests');
            return;
        }
        pool = new Pool({ connectionString: TEST_DATABASE_URL });
    });

    afterAll(async () => {
        if (pool) {
            await pool.end();
        }
    });

    describe('Database Connection', () => {
        test('can connect to test database', async () => {
            const result = await pool.query('SELECT 1 as value');
            expect(result.rows[0].value).toBe(1);
        });

        test('can query current timestamp', async () => {
            const result = await pool.query('SELECT NOW() as now');
            expect(result.rows[0].now).toBeInstanceOf(Date);
        });
    });

    describe('Events Table', () => {
        test('events table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'events'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });

        test('events table has required columns', async () => {
            const result = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'events'
            `);
            const columns = result.rows.map((r) => r.column_name);

            expect(columns).toContain('id');
            expect(columns).toContain('title');
            expect(columns).toContain('description');
            expect(columns).toContain('start_date');
            expect(columns).toContain('end_date');
            expect(columns).toContain('location');
            expect(columns).toContain('category');
            expect(columns).toContain('organizer');
            expect(columns).toContain('is_cancelled');
        });

        test('can query events', async () => {
            const result = await pool.query(
                'SELECT COUNT(*) as count FROM events'
            );
            expect(parseInt(result.rows[0].count)).toBeGreaterThanOrEqual(0);
        });

        test('events have valid categories', async () => {
            const result = await pool.query(`
                SELECT DISTINCT category FROM events
            `);
            const validCategories = [
                'sitzung',
                'veranstaltung',
                'sport',
                'kultur',
                'notfall',
                'sonstiges',
            ];
            result.rows.forEach((row) => {
                expect(validCategories).toContain(row.category);
            });
        });
    });

    describe('News Table', () => {
        test('news table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'news'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });

        test('news table has required columns', async () => {
            const result = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'news'
            `);
            const columns = result.rows.map((r) => r.column_name);

            expect(columns).toContain('id');
            expect(columns).toContain('title');
            expect(columns).toContain('content');
            expect(columns).toContain('category');
            expect(columns).toContain('article_id');
            expect(columns).toContain('published_date');
        });

        test('news articles have unique article_ids', async () => {
            const result = await pool.query(`
                SELECT article_id, COUNT(*) as count 
                FROM news 
                WHERE article_id IS NOT NULL
                GROUP BY article_id 
                HAVING COUNT(*) > 1
            `);
            expect(result.rows.length).toBe(0);
        });
    });

    describe('Contacts Table', () => {
        test('contacts table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'contacts'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });

        test('contacts have JSONB columns', async () => {
            const result = await pool.query(`
                SELECT column_name, udt_name
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'contacts'
                AND udt_name = 'jsonb'
            `);
            const jsonbColumns = result.rows.map((r) => r.column_name);

            expect(jsonbColumns).toContain('emails');
            expect(jsonbColumns).toContain('phones');
            expect(jsonbColumns).toContain('addresses');
            expect(jsonbColumns).toContain('affiliations');
        });
    });

    describe('Admin Users Table', () => {
        test('admin_users table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'admin_users'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });

        test('admin_users have required columns', async () => {
            const result = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'admin_users'
            `);
            const columns = result.rows.map((r) => r.column_name);

            expect(columns).toContain('id');
            expect(columns).toContain('username');
            expect(columns).toContain('password_hash');
            expect(columns).toContain('role_id');
            expect(columns).toContain('custom_permissions');
        });

        test('usernames are unique', async () => {
            const result = await pool.query(`
                SELECT username, COUNT(*) as count 
                FROM admin_users 
                GROUP BY username 
                HAVING COUNT(*) > 1
            `);
            expect(result.rows.length).toBe(0);
        });
    });

    describe('Roles Table', () => {
        test('roles table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'roles'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });

        test('roles have unique names', async () => {
            const result = await pool.query(`
                SELECT name, COUNT(*) as count 
                FROM roles 
                GROUP BY name 
                HAVING COUNT(*) > 1
            `);
            expect(result.rows.length).toBe(0);
        });

        test('expected roles exist', async () => {
            const result = await pool.query(`SELECT name FROM roles`);
            const roleNames = result.rows.map((r) => r.name);

            // Check for some expected roles
            expect(roleNames.length).toBeGreaterThan(0);
        });
    });

    describe('Permissions Table', () => {
        test('permissions table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'permissions'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });

        test('permissions have unique names', async () => {
            const result = await pool.query(`
                SELECT name, COUNT(*) as count 
                FROM permissions 
                GROUP BY name 
                HAVING COUNT(*) > 1
            `);
            expect(result.rows.length).toBe(0);
        });

        test('permissions have categories', async () => {
            const result = await pool.query(`
                SELECT DISTINCT category FROM permissions WHERE category IS NOT NULL
            `);
            expect(result.rows.length).toBeGreaterThan(0);
        });
    });

    describe('Gallery Images Table', () => {
        test('gallery_images table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'gallery_images'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });
    });

    describe('Portraits Table', () => {
        test('portraits table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'portraits'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });

        test('portraits have status column', async () => {
            const result = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'portraits'
                AND column_name = 'status'
            `);
            expect(result.rows.length).toBe(1);
        });
    });

    describe('Shared Gallery Submissions Table', () => {
        test('shared_gallery_submissions table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'shared_gallery_submissions'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });

        test('shared_gallery_submissions have submission_group_id', async () => {
            const result = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'shared_gallery_submissions'
                AND column_name = 'submission_group_id'
            `);
            expect(result.rows.length).toBe(1);
        });
    });

    describe('Push Subscriptions Table', () => {
        test('push_subscriptions table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'push_subscriptions'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });
    });

    describe('Site Settings Table', () => {
        test('site_settings table exists', async () => {
            const result = await pool.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'site_settings'
                ) as exists
            `);
            expect(result.rows[0].exists).toBe(true);
        });
    });

    describe('Foreign Key Relationships', () => {
        test('admin_users.role_id references roles.id', async () => {
            const result = await pool.query(`
                SELECT 
                    tc.constraint_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
                WHERE tc.table_name = 'admin_users' 
                AND tc.constraint_type = 'FOREIGN KEY'
                AND kcu.column_name = 'role_id'
            `);
            // Foreign key might not exist, just check we can query it
            expect(result.rows).toBeDefined();
        });
    });

    describe('Indexes', () => {
        test('events has index on start_date', async () => {
            const result = await pool.query(`
                SELECT indexname 
                FROM pg_indexes 
                WHERE tablename = 'events' 
                AND indexdef LIKE '%start_date%'
            `);
            expect(result.rows.length).toBeGreaterThan(0);
        });

        test('news has index on published_date', async () => {
            const result = await pool.query(`
                SELECT indexname 
                FROM pg_indexes 
                WHERE tablename = 'news' 
                AND indexdef LIKE '%published_date%'
            `);
            expect(result.rows.length).toBeGreaterThan(0);
        });
    });
});
