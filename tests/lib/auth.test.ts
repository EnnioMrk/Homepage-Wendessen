import { describe, test, expect } from 'bun:test';
import { validatePasswordStrength, normalizePermissions } from '../../lib/auth';

describe('Auth Utils', () => {
    describe('validatePasswordStrength', () => {
        test('rejects passwords shorter than 8 characters', () => {
            const result = validatePasswordStrength('Abc123');
            expect(result.valid).toBe(false);
            expect(result.message).toBe(
                'Passwort muss mindestens 8 Zeichen lang sein'
            );
        });

        test('rejects passwords without lowercase letters', () => {
            const result = validatePasswordStrength('ABCDEFGH1');
            expect(result.valid).toBe(false);
            expect(result.message).toBe(
                'Passwort muss mindestens einen Kleinbuchstaben enthalten'
            );
        });

        test('rejects passwords without uppercase letters', () => {
            const result = validatePasswordStrength('abcdefgh1');
            expect(result.valid).toBe(false);
            expect(result.message).toBe(
                'Passwort muss mindestens einen Großbuchstaben enthalten'
            );
        });

        test('rejects passwords without numbers', () => {
            const result = validatePasswordStrength('Abcdefghi');
            expect(result.valid).toBe(false);
            expect(result.message).toBe(
                'Passwort muss mindestens eine Zahl enthalten'
            );
        });

        test('accepts valid password with all requirements', () => {
            const result = validatePasswordStrength('Abcdefg1');
            expect(result.valid).toBe(true);
            expect(result.message).toBeUndefined();
        });

        test('accepts complex valid password', () => {
            const result = validatePasswordStrength('MySecureP@ssw0rd123');
            expect(result.valid).toBe(true);
        });

        test('accepts password with special characters', () => {
            const result = validatePasswordStrength('Test123!@#');
            expect(result.valid).toBe(true);
        });

        test('accepts exactly 8 character password meeting requirements', () => {
            const result = validatePasswordStrength('Abc12345');
            expect(result.valid).toBe(true);
        });

        test('rejects empty password', () => {
            const result = validatePasswordStrength('');
            expect(result.valid).toBe(false);
        });
    });

    describe('normalizePermissions', () => {
        test('returns empty array for null', () => {
            expect(normalizePermissions(null)).toEqual([]);
        });

        test('returns empty array for undefined', () => {
            expect(normalizePermissions(undefined)).toEqual([]);
        });

        test('returns empty array for empty array', () => {
            expect(normalizePermissions([])).toEqual([]);
        });

        test('passes through string array', () => {
            const perms = ['events.view', 'news.create'];
            expect(normalizePermissions(perms)).toEqual(perms);
        });

        test('trims whitespace from permissions', () => {
            const perms = ['  events.view  ', 'news.create '];
            expect(normalizePermissions(perms)).toEqual([
                'events.view',
                'news.create',
            ]);
        });

        test('filters out null values', () => {
            const perms = ['events.view', null, 'news.create'];
            expect(normalizePermissions(perms)).toEqual([
                'events.view',
                'news.create',
            ]);
        });

        test('filters out undefined values', () => {
            const perms = ['events.view', undefined, 'news.create'];
            expect(normalizePermissions(perms)).toEqual([
                'events.view',
                'news.create',
            ]);
        });

        test('filters out empty strings after trim', () => {
            const perms = ['events.view', '   ', 'news.create'];
            expect(normalizePermissions(perms)).toEqual([
                'events.view',
                'news.create',
            ]);
        });

        test('parses JSON string array', () => {
            const permsJson = '["events.view", "news.create"]';
            expect(normalizePermissions(permsJson)).toEqual([
                'events.view',
                'news.create',
            ]);
        });

        test('handles single string permission', () => {
            const perm = 'events.view';
            expect(normalizePermissions(perm)).toEqual(['events.view']);
        });

        test('handles wildcard permission', () => {
            expect(normalizePermissions(['*'])).toEqual(['*']);
        });

        test('trims wildcard with whitespace', () => {
            expect(normalizePermissions([' * '])).toEqual(['*']);
        });
    });
});
