import { describe, test, expect } from 'bun:test';
import { cn } from '../../app/lib/utils';

describe('Utils', () => {
    describe('cn (classNames utility)', () => {
        test('merges single class', () => {
            expect(cn('foo')).toBe('foo');
        });

        test('merges multiple classes', () => {
            expect(cn('foo', 'bar')).toBe('foo bar');
        });

        test('handles conditional classes', () => {
            expect(cn('foo', true && 'bar')).toBe('foo bar');
            expect(cn('foo', false && 'bar')).toBe('foo');
        });

        test('handles undefined and null', () => {
            expect(cn('foo', undefined, 'bar', null)).toBe('foo bar');
        });

        test('handles arrays', () => {
            expect(cn(['foo', 'bar'])).toBe('foo bar');
        });

        test('handles objects', () => {
            expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
        });

        test('merges Tailwind classes correctly (removes conflicts)', () => {
            // twMerge should handle conflicting classes
            expect(cn('px-2', 'px-4')).toBe('px-4');
            expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
        });

        test('handles complex combinations', () => {
            const result = cn(
                'base-class',
                true && 'conditional-true',
                false && 'conditional-false',
                { 'object-true': true, 'object-false': false },
                ['array-class-1', 'array-class-2']
            );
            expect(result).toContain('base-class');
            expect(result).toContain('conditional-true');
            expect(result).not.toContain('conditional-false');
            expect(result).toContain('object-true');
            expect(result).not.toContain('object-false');
            expect(result).toContain('array-class-1');
            expect(result).toContain('array-class-2');
        });

        test('handles empty input', () => {
            expect(cn()).toBe('');
            expect(cn('')).toBe('');
        });

        test('preserves important modifier', () => {
            expect(cn('!text-red-500')).toBe('!text-red-500');
        });

        test('handles responsive prefixes', () => {
            expect(cn('sm:px-4', 'md:px-6', 'lg:px-8')).toBe(
                'sm:px-4 md:px-6 lg:px-8'
            );
        });

        test('handles hover/focus states', () => {
            expect(cn('hover:bg-blue-500', 'focus:outline-none')).toBe(
                'hover:bg-blue-500 focus:outline-none'
            );
        });
    });
});
