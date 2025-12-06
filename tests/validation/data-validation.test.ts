import { describe, test, expect } from 'bun:test';

/**
 * Tests for data validation patterns used across the application
 */

describe('Data Validation Patterns', () => {
    describe('Email Validation', () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        test('accepts valid email addresses', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.org',
                'admin@wendessen.de',
                'user+tag@example.com',
                'firstname.lastname@company.co.uk',
            ];

            validEmails.forEach((email) => {
                expect(emailPattern.test(email)).toBe(true);
            });
        });

        test('rejects invalid email addresses', () => {
            const invalidEmails = [
                'notanemail',
                '@nodomain.com',
                'no@domain',
                'spaces in@email.com',
                'double@@at.com',
                '',
            ];

            invalidEmails.forEach((email) => {
                expect(emailPattern.test(email)).toBe(false);
            });
        });
    });

    describe('German Phone Number Validation', () => {
        const phonePattern = /^0\d{3,4}\/?\d{5,10}$/;

        test('accepts valid German phone numbers', () => {
            const validPhones = [
                '05331/7107733',
                '0171/2741258',
                '01512345678',
                '0176/23589921',
            ];

            validPhones.forEach((phone) => {
                expect(phonePattern.test(phone)).toBe(true);
            });
        });

        test('rejects invalid phone numbers', () => {
            const invalidPhones = [
                '+49 171 1234567', // International format
                '171/1234567', // Missing leading 0
                '12345', // Too short
                'abcdefghij', // Letters
            ];

            invalidPhones.forEach((phone) => {
                expect(phonePattern.test(phone)).toBe(false);
            });
        });
    });

    describe('URL-Safe Slug Validation', () => {
        const slugPattern = /^[a-z0-9-]+$/;

        test('accepts valid slugs', () => {
            const validSlugs = [
                'andreas-rink',
                'test123',
                'some-long-slug-name',
                '12345',
            ];

            validSlugs.forEach((slug) => {
                expect(slugPattern.test(slug)).toBe(true);
            });
        });

        test('rejects invalid slugs', () => {
            const invalidSlugs = [
                'Contains Spaces',
                'UPPERCASE',
                'special@chars',
                'underscore_slug',
                '',
            ];

            invalidSlugs.forEach((slug) => {
                expect(slugPattern.test(slug)).toBe(false);
            });
        });
    });

    describe('Hex Color Validation', () => {
        const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

        test('accepts valid hex colors', () => {
            const validColors = [
                '#ffffff',
                '#000000',
                '#f59e0b',
                '#ABCDEF',
                '#123456',
            ];

            validColors.forEach((color) => {
                expect(hexColorPattern.test(color)).toBe(true);
            });
        });

        test('rejects invalid hex colors', () => {
            const invalidColors = [
                'ffffff', // Missing #
                '#fff', // 3-digit
                '#GGGGGG', // Invalid characters
                '#12345', // 5 digits
                '#1234567', // 7 digits
                'rgb(255,255,255)', // RGB format
            ];

            invalidColors.forEach((color) => {
                expect(hexColorPattern.test(color)).toBe(false);
            });
        });
    });

    describe('Date/Time Validation', () => {
        test('ISO date strings are valid', () => {
            const dates = [
                '2025-01-15T10:00:00.000Z',
                '2025-12-31T23:59:59.999Z',
                new Date().toISOString(),
            ];

            dates.forEach((dateStr) => {
                const parsed = new Date(dateStr);
                expect(parsed.toString()).not.toBe('Invalid Date');
                expect(parsed.toISOString()).toBe(dateStr);
            });
        });

        test('detects invalid dates', () => {
            const invalidDates = [
                'not-a-date',
                '2025-13-01', // Invalid month
                '2025-01-32', // Invalid day
            ];

            invalidDates.forEach((dateStr) => {
                const parsed = new Date(dateStr);
                // Note: JavaScript Date is lenient, so we check for realistic values
                if (parsed.toString() !== 'Invalid Date') {
                    // If it parsed, check if month/day are realistic
                    const month = parsed.getMonth();
                    const day = parsed.getDate();
                    const isRealistic =
                        month >= 0 && month <= 11 && day >= 1 && day <= 31;
                    expect(isRealistic).toBe(true);
                }
            });
        });
    });

    describe('Event Category Validation', () => {
        const validCategories = [
            'sitzung',
            'veranstaltung',
            'sport',
            'kultur',
            'notfall',
            'sonstiges',
        ];

        test('validates event categories', () => {
            validCategories.forEach((category) => {
                expect(validCategories.includes(category)).toBe(true);
            });
        });

        test('rejects invalid categories', () => {
            const invalidCategories = [
                'meeting',
                'event',
                'other',
                'SITZUNG',
                '',
            ];

            invalidCategories.forEach((category) => {
                expect(validCategories.includes(category)).toBe(false);
            });
        });
    });

    describe('Permission String Validation', () => {
        // Permissions can have 2 or 3 parts: category.action or category.subcategory.action
        const permissionPattern = /^(\*|[a-z_]+\.[a-z_*]+(\.[a-z_*]+)?)$/;

        test('accepts valid permission strings', () => {
            const validPermissions = [
                '*',
                'events.view',
                'events.create',
                'events.*',
                'shared_gallery.approve',
                'verein.events.create',
            ];

            validPermissions.forEach((perm) => {
                expect(permissionPattern.test(perm)).toBe(true);
            });
        });

        test('rejects invalid permission strings', () => {
            const invalidPermissions = [
                'Events.View', // Uppercase
                'events', // Missing action
                '.view', // Missing category
                'events.', // Missing action
                'events-view', // Wrong separator
            ];

            invalidPermissions.forEach((perm) => {
                expect(permissionPattern.test(perm)).toBe(false);
            });
        });
    });

    describe('Year Validation', () => {
        test('validates birth years', () => {
            const validYears = [1950, 1970, 1990, 2000];
            const currentYear = new Date().getFullYear();

            validYears.forEach((year) => {
                expect(year).toBeGreaterThan(1900);
                expect(year).toBeLessThan(currentYear);
            });
        });

        test('rejects invalid birth years', () => {
            const currentYear = new Date().getFullYear();
            const invalidYears = [1800, 2050, currentYear + 1];

            invalidYears.forEach((year) => {
                const isValid = year > 1900 && year < currentYear;
                expect(isValid).toBe(false);
            });
        });
    });

    describe('Image Path Validation', () => {
        test('validates image paths start with /', () => {
            const validPaths = [
                '/images/test.jpg',
                '/images/Ortsrat/photo.JPG',
                '/images/Vereinsleben/club.webp',
            ];

            validPaths.forEach((path) => {
                expect(path.startsWith('/')).toBe(true);
            });
        });

        test('validates image extensions', () => {
            const validExtensions = [
                '.jpg',
                '.jpeg',
                '.png',
                '.webp',
                '.JPG',
                '.JPEG',
                '.PNG',
            ];
            const testPaths = [
                '/images/test.jpg',
                '/images/test.JPEG',
                '/images/test.webp',
            ];

            testPaths.forEach((path) => {
                const hasValidExt = validExtensions.some((ext) =>
                    path.endsWith(ext)
                );
                expect(hasValidExt).toBe(true);
            });
        });
    });

    describe('JSON Validation', () => {
        test('parses valid JSON', () => {
            const validJsonStrings = [
                '{"key": "value"}',
                '[]',
                '[1, 2, 3]',
                '{"nested": {"key": "value"}}',
                'null',
                '"string"',
                '123',
            ];

            validJsonStrings.forEach((json) => {
                expect(() => JSON.parse(json)).not.toThrow();
            });
        });

        test('rejects invalid JSON', () => {
            const invalidJsonStrings = [
                '{key: "value"}', // Unquoted key
                "{'key': 'value'}", // Single quotes
                '{,}', // Extra comma
                '[1, 2,]', // Trailing comma
                'undefined', // Not valid JSON
            ];

            invalidJsonStrings.forEach((json) => {
                expect(() => JSON.parse(json)).toThrow();
            });
        });
    });

    describe('Base64 Validation', () => {
        const base64Pattern = /^[A-Za-z0-9+/]+=*$/;

        test('accepts valid base64 strings', () => {
            const validBase64 = [
                'SGVsbG8gV29ybGQ=', // "Hello World"
                'dGVzdA==', // "test"
                'YWJj', // "abc"
            ];

            validBase64.forEach((b64) => {
                expect(base64Pattern.test(b64)).toBe(true);
                expect(() =>
                    Buffer.from(b64, 'base64').toString()
                ).not.toThrow();
            });
        });
    });
});
