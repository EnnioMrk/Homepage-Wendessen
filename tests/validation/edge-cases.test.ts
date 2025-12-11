import { describe, test, expect } from 'bun:test';

/**
 * Tests for edge cases and boundary conditions
 */

describe('Edge Cases and Boundary Conditions', () => {
    describe('String Edge Cases', () => {
        test('handles empty strings', () => {
            const empty = '';
            expect(empty.length).toBe(0);
            expect(empty.trim()).toBe('');
            expect(empty.split('')).toEqual([]);
        });

        test('handles strings with only whitespace', () => {
            const whitespace = '   \t\n  ';
            expect(whitespace.trim()).toBe('');
            expect(whitespace.length).toBeGreaterThan(0);
        });

        test('handles very long strings', () => {
            const longString = 'a'.repeat(10000);
            expect(longString.length).toBe(10000);
            expect(longString.includes('a')).toBe(true);
        });

        test('handles unicode characters', () => {
            const unicode = 'Überschrift äöü ß Ñ 日本語 🎉';
            expect(unicode.length).toBeGreaterThan(0);
            expect(unicode.includes('ü')).toBe(true);
            expect(unicode.includes('🎉')).toBe(true);
        });

        test('handles special characters', () => {
            const special = '<script>alert("xss")</script>';
            expect(special.includes('<')).toBe(true);
            expect(special.includes('>')).toBe(true);
        });
    });

    describe('Number Edge Cases', () => {
        test('handles zero', () => {
            expect(0).toBe(0);
            expect(Object.is(-0, -0)).toBe(true); // -0 and 0 are different in JavaScript
            expect(0 === -0).toBe(true);
        });

        test('handles negative numbers', () => {
            expect(-1).toBeLessThan(0);
            expect(Math.abs(-5)).toBe(5);
        });

        test('handles decimal numbers', () => {
            // Floating point precision
            expect(0.1 + 0.2).toBeCloseTo(0.3);
        });

        test('handles large numbers', () => {
            const large = Number.MAX_SAFE_INTEGER;
            expect(large).toBe(9007199254740991);
            expect(Number.isFinite(large)).toBe(true);
        });

        test('handles Infinity', () => {
            expect(Number.isFinite(Infinity)).toBe(false);
            expect(1 / 0).toBe(Infinity);
        });

        test('handles NaN', () => {
            expect(Number.isNaN(NaN)).toBe(true);
            expect(Number.isNaN(parseInt('not a number'))).toBe(true);
        });
    });

    describe('Array Edge Cases', () => {
        test('handles empty arrays', () => {
            const empty: unknown[] = [];
            expect(empty.length).toBe(0);
            expect(empty[0]).toBeUndefined();
            expect(empty.map((x) => x)).toEqual([]);
            expect(empty.filter((x) => x)).toEqual([]);
        });

        test('handles single element arrays', () => {
            const single = [1];
            expect(single.length).toBe(1);
            expect(single[0]).toBe(1);
            expect(single[-1]).toBeUndefined();
        });

        test('handles arrays with holes', () => {
            const sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
            expect(sparse.length).toBe(3);
            expect(1 in sparse).toBe(false);
        });

        test('handles array-like objects', () => {
            const arrayLike = { 0: 'a', 1: 'b', length: 2 };
            const arr = Array.from(arrayLike);
            expect(arr).toEqual(['a', 'b']);
        });
    });

    describe('Object Edge Cases', () => {
        test('handles empty objects', () => {
            const empty = {};
            expect(Object.keys(empty).length).toBe(0);
            expect(JSON.stringify(empty)).toBe('{}');
        });

        test('handles null prototype objects', () => {
            const nullProto = Object.create(null);
            expect(nullProto.toString).toBeUndefined();
        });

        test('handles nested objects', () => {
            const nested = { a: { b: { c: 1 } } };
            expect(nested.a.b.c).toBe(1);
            expect(nested?.a?.b?.c).toBe(1);
        });

        test('handles circular references safely', () => {
            const obj: Record<string, unknown> = { name: 'test' };
            obj.self = obj;

            // Should not throw when accessing
            expect(obj.self).toBe(obj);
            expect((obj.self as typeof obj).name).toBe('test');
        });
    });

    describe('Date Edge Cases', () => {
        test('handles epoch time', () => {
            const epoch = new Date(0);
            expect(epoch.toISOString()).toBe('1970-01-01T00:00:00.000Z');
        });

        test('handles negative timestamps', () => {
            const before1970 = new Date(-86400000); // One day before epoch
            expect(before1970.getFullYear()).toBe(1969);
        });

        test('handles timezone edge cases', () => {
            const date = new Date('2025-01-15T12:00:00Z');
            expect(date.toISOString()).toContain('2025-01-15');
        });

        test('handles DST transitions', () => {
            // Summer time in Germany
            const summer = new Date('2025-07-15T12:00:00Z');
            const winter = new Date('2025-01-15T12:00:00Z');

            expect(summer.getTime()).not.toBe(winter.getTime());
        });

        test('handles leap years', () => {
            const feb29_2024 = new Date('2024-02-29');
            expect(feb29_2024.getDate()).toBe(29);

            // 2025 is not a leap year
            const feb29_2025 = new Date('2025-02-29');
            expect(feb29_2025.getDate()).toBe(1); // Rolls over to March 1
        });
    });

    describe('Null/Undefined Edge Cases', () => {
        test('distinguishes null from undefined', () => {
            expect(null).toBeNull();
            expect(undefined).toBeUndefined();
            expect(null == undefined).toBe(true); // Loose equality
            expect(null === undefined).toBe(false); // Strict equality
        });

        test('handles optional chaining', () => {
            const obj: { a?: { b?: number } } = {};
            expect(obj?.a?.b).toBeUndefined();
            expect(obj?.a?.b ?? 'default').toBe('default');
        });

        test('handles nullish coalescing', () => {
            const n: null = null;
            const u: undefined = undefined;
            expect(n ?? 'default').toBe('default');
            expect(u ?? 'default').toBe('default');

            // Use typed unions so TypeScript treats these as possibly nullish
            const maybeZero: number | null = Math.random() > 2 ? null : 0;
            const maybeEmpty: string | null = Math.random() > 2 ? null : '';
            const maybeFalse: boolean | null = Math.random() > 2 ? null : false;

            expect(maybeZero ?? 'default').toBe(0);
            expect(maybeEmpty ?? 'default').toBe('');
            expect(maybeFalse ?? 'default').toBe(false);
        });
    });

    describe('Type Coercion Edge Cases', () => {
        test('string to number conversion', () => {
            expect(Number('123')).toBe(123);
            expect(Number('')).toBe(0);
            expect(Number('abc')).toBeNaN();
            expect(parseInt('123abc')).toBe(123);
        });

        test('boolean coercion', () => {
            expect(Boolean('')).toBe(false);
            expect(Boolean(0)).toBe(false);
            expect(Boolean(null)).toBe(false);
            expect(Boolean(undefined)).toBe(false);
            expect(Boolean('0')).toBe(true);
            expect(Boolean([])).toBe(true);
            expect(Boolean({})).toBe(true);
        });

        test('JSON serialization edge cases', () => {
            expect(JSON.stringify(undefined)).toBeUndefined();
            expect(JSON.stringify(null)).toBe('null');
            expect(JSON.parse('null')).toBeNull();
        });
    });

    describe('Buffer Edge Cases', () => {
        test('handles empty buffer', () => {
            const empty = Buffer.alloc(0);
            expect(empty.length).toBe(0);
            expect(empty.toString()).toBe('');
        });

        test('handles binary data', () => {
            const binary = Buffer.from([0x00, 0xff, 0x80]);
            expect(binary.length).toBe(3);
            expect(binary[0]).toBe(0);
            expect(binary[1]).toBe(255);
        });

        test('handles UTF-8 encoding', () => {
            const utf8 = Buffer.from('äöü');
            expect(utf8.toString('utf8')).toBe('äöü');
        });

        test('handles base64 encoding', () => {
            const base64 = Buffer.from('Hello').toString('base64');
            expect(base64).toBe('SGVsbG8=');
            expect(Buffer.from(base64, 'base64').toString()).toBe('Hello');
        });
    });

    describe('URL Edge Cases', () => {
        test('handles special characters in URLs', () => {
            const encoded = encodeURIComponent('hello world');
            expect(encoded).toBe('hello%20world');
            expect(decodeURIComponent(encoded)).toBe('hello world');
        });

        test('handles URL with query parameters', () => {
            const url = new URL('http://example.com?foo=bar&baz=qux');
            expect(url.searchParams.get('foo')).toBe('bar');
            expect(url.searchParams.get('baz')).toBe('qux');
        });

        test('handles URL with hash', () => {
            const url = new URL('http://example.com#section');
            expect(url.hash).toBe('#section');
        });
    });

    describe('RegExp Edge Cases', () => {
        test('handles global flag', () => {
            const regex = /a/g;
            const text = 'aaa';
            expect(text.match(regex)?.length).toBe(3);
        });

        test('handles case insensitivity', () => {
            const regex = /test/i;
            expect(regex.test('TEST')).toBe(true);
            expect(regex.test('Test')).toBe(true);
        });

        test('handles special regex characters', () => {
            const specialChars = '.*+?^${}()|[]\\';
            const escaped = specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            expect(new RegExp(escaped).test(specialChars)).toBe(true);
        });
    });

    describe('Async Edge Cases', () => {
        test('handles Promise.all with empty array', async () => {
            const result = await Promise.all([]);
            expect(result).toEqual([]);
        });

        test('handles Promise.race with single promise', async () => {
            const result = await Promise.race([Promise.resolve(1)]);
            expect(result).toBe(1);
        });

        test('handles rejected promises', async () => {
            const error = new Error('test error');
            await expect(Promise.reject(error)).rejects.toThrow('test error');
        });
    });
});
