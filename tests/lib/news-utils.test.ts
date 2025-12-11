import { describe, test, expect } from 'bun:test';
import { getCategoryColorClasses } from '../../lib/utils/news-utils';

describe('News Utils', () => {
    describe('getCategoryColorClasses', () => {
        const validCategories = [
            'Bildung',
            'Gemeinschaft',
            'Feuerwehr',
            'Digital',
            'Sport',
            'Kultur',
            'Verwaltung',
        ];

        test.each(validCategories)(
            'returns color object for category "%s"',
            (category) => {
                const colors = getCategoryColorClasses(category);

                expect(colors).toBeDefined();
                expect(colors.borderColor).toBeDefined();
                expect(colors.dotColor).toBeDefined();
                expect(colors.hoverColor).toBeDefined();
                expect(typeof colors.borderColor).toBe('string');
                expect(typeof colors.dotColor).toBe('string');
                expect(typeof colors.hoverColor).toBe('string');
            }
        );

        test('returns correct colors for Bildung', () => {
            const colors = getCategoryColorClasses('Bildung');
            expect(colors.borderColor).toBe('#f59e0b');
            expect(colors.dotColor).toBe('#f59e0b');
        });

        test('returns correct colors for Feuerwehr', () => {
            const colors = getCategoryColorClasses('Feuerwehr');
            expect(colors.borderColor).toBe('#dc2626');
            expect(colors.dotColor).toBe('#dc2626');
        });

        test('returns correct colors for Digital', () => {
            const colors = getCategoryColorClasses('Digital');
            expect(colors.borderColor).toBe('#6366f1');
            expect(colors.dotColor).toBe('#6366f1');
        });

        test('returns default gray colors for unknown category', () => {
            const colors = getCategoryColorClasses('UnknownCategory');
            expect(colors.borderColor).toBe('#6b7280');
            expect(colors.dotColor).toBe('#6b7280');
            expect(colors.hoverColor).toBe('#6b7280');
        });

        test('borderColor and dotColor should match for each category', () => {
            validCategories.forEach((category) => {
                const colors = getCategoryColorClasses(category);
                expect(colors.borderColor).toBe(colors.dotColor);
            });
        });

        test('all colors are valid hex colors', () => {
            const hexColorRegex = /^#[0-9a-fA-F]{6}$/;

            validCategories.forEach((category) => {
                const colors = getCategoryColorClasses(category);
                expect(colors.borderColor).toMatch(hexColorRegex);
                expect(colors.dotColor).toMatch(hexColorRegex);
                expect(colors.hoverColor).toMatch(hexColorRegex);
            });
        });
    });
});
