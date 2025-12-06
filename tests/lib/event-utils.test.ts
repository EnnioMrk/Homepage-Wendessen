import { describe, test, expect } from 'bun:test';
import {
    getCategoryColors,
    getCategoryBackgroundColor,
    getCategoryBadgeClasses,
    getCategoryDisplayName,
    getCategoryIconEmoji,
    type EventCategory,
} from '../../lib/event-utils';

describe('Event Utils', () => {
    describe('getCategoryColors', () => {
        const categories: EventCategory[] = [
            'sitzung',
            'veranstaltung',
            'sport',
            'kultur',
            'notfall',
            'sonstiges',
        ];

        test.each(categories)(
            'returns color object for category "%s"',
            (category) => {
                const colors = getCategoryColors(category);

                expect(colors).toBeDefined();
                expect(colors.bg).toBeDefined();
                expect(colors.bgLight).toBeDefined();
                expect(colors.text).toBeDefined();
                expect(colors.textDark).toBeDefined();
                expect(colors.border).toBeDefined();
                expect(colors.hover).toBeDefined();
            }
        );

        test('returns correct colors for sitzung', () => {
            const colors = getCategoryColors('sitzung');
            expect(colors.bg).toBe('bg-blue-500');
            expect(colors.text).toBe('text-blue-600');
        });

        test('returns correct colors for notfall', () => {
            const colors = getCategoryColors('notfall');
            expect(colors.bg).toBe('bg-red-500');
            expect(colors.text).toBe('text-red-600');
        });

        test('returns sonstiges colors for unknown category', () => {
            const colors = getCategoryColors('unknown' as EventCategory);
            const sonstigesColors = getCategoryColors('sonstiges');
            expect(colors).toEqual(sonstigesColors);
        });
    });

    describe('getCategoryBackgroundColor', () => {
        test('returns bg class for valid category', () => {
            expect(getCategoryBackgroundColor('sport')).toBe('bg-orange-500');
            expect(getCategoryBackgroundColor('kultur')).toBe('bg-purple-500');
        });

        test('returns sonstiges bg for unknown category', () => {
            expect(getCategoryBackgroundColor('invalid')).toBe('bg-gray-500');
        });
    });

    describe('getCategoryBadgeClasses', () => {
        test('returns combined bgLight and text classes', () => {
            const result = getCategoryBadgeClasses('veranstaltung');
            expect(result).toContain('bg-green-100');
            expect(result).toContain('text-green-600');
        });

        test('returns sonstiges classes for unknown category', () => {
            const result = getCategoryBadgeClasses('invalid');
            expect(result).toContain('bg-gray-100');
            expect(result).toContain('text-gray-600');
        });
    });

    describe('getCategoryDisplayName', () => {
        test('returns German display names for all categories', () => {
            expect(getCategoryDisplayName('sitzung')).toBe('Sitzung');
            expect(getCategoryDisplayName('veranstaltung')).toBe(
                'Veranstaltung'
            );
            expect(getCategoryDisplayName('sport')).toBe('Sport');
            expect(getCategoryDisplayName('kultur')).toBe('Kultur');
            expect(getCategoryDisplayName('notfall')).toBe('Notfall');
            expect(getCategoryDisplayName('sonstiges')).toBe('Sonstiges');
        });

        test('returns "Sonstiges" for unknown category', () => {
            expect(getCategoryDisplayName('invalid')).toBe('Sonstiges');
        });
    });

    describe('getCategoryIconEmoji', () => {
        test('returns correct emojis for all categories', () => {
            expect(getCategoryIconEmoji('sitzung')).toBe('📋');
            expect(getCategoryIconEmoji('veranstaltung')).toBe('🎉');
            expect(getCategoryIconEmoji('sport')).toBe('⚽');
            expect(getCategoryIconEmoji('kultur')).toBe('🎭');
            expect(getCategoryIconEmoji('notfall')).toBe('🚨');
            expect(getCategoryIconEmoji('sonstiges')).toBe('📅');
        });

        test('returns default emoji for unknown category', () => {
            expect(getCategoryIconEmoji('invalid')).toBe('📅');
        });
    });
});
