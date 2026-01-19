import { describe, test, expect } from 'bun:test';
import { ASSOCIATIONS as vereineData, type Verein } from '../../lib/constants/associations';

describe('Vereine Data', () => {
    describe('vereineData array', () => {
        test('contains at least 5 Vereine', () => {
            expect(vereineData.length).toBeGreaterThanOrEqual(5);
        });

        test('all Vereine have required fields', () => {
            vereineData.forEach((verein: Verein) => {
                expect(verein.id).toBeDefined();
                expect(typeof verein.id).toBe('string');
                expect(verein.id.length).toBeGreaterThan(0);

                expect(verein.title).toBeDefined();
                expect(typeof verein.title).toBe('string');
                expect(verein.title.length).toBeGreaterThan(0);

                expect(verein.description).toBeDefined();
                expect(typeof verein.description).toBe('string');

                expect(verein.imageSrc).toBeDefined();
                expect(typeof verein.imageSrc).toBe('string');
                expect(verein.imageSrc.startsWith('/')).toBe(true);

                expect(verein.imageAlt).toBeDefined();
                expect(typeof verein.imageAlt).toBe('string');

                expect(verein.buttonText).toBeDefined();
                expect(typeof verein.buttonText).toBe('string');

                expect(verein.buttonHref).toBeDefined();
                expect(typeof verein.buttonHref).toBe('string');
                expect(verein.buttonHref.startsWith('/')).toBe(true);

                expect(verein.buttonColor).toBeDefined();
            });
        });

        test('all Vereine have unique IDs', () => {
            const ids = vereineData.map((v) => v.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });

        test('all buttonColors are valid', () => {
            const validColors = [
                'green',
                'red',
                'blue',
                'orange',
                'lime',
                'pink',
                'indigo',
                'emerald',
                'violet',
                'teal',
                'cyan',
                'yellow',
            ];
            vereineData.forEach((verein) => {
                expect(validColors).toContain(verein.buttonColor);
            });
        });

        test('buttonHref matches expected pattern', () => {
            vereineData.forEach((verein) => {
                expect(verein.buttonHref).toMatch(
                    /^\/dorfleben\/vereine\/[a-z-]+$/
                );
            });
        });

        test('contains expected Vereine', () => {
            const ids = vereineData.map((v) => v.id);
            expect(ids).toContain('sv-wendessen');
            expect(ids).toContain('feuerwehr');
            expect(ids).toContain('kleingaertner');
        });
    });

    describe('specific Vereine data', () => {
        test('SV Wendessen has correct data', () => {
            const sv = vereineData.find((v) => v.id === 'sv-wendessen');
            expect(sv).toBeDefined();
            expect(sv?.title).toBe('SV Wendessen');
            expect(sv?.buttonColor).toBe('blue');
        });

        test('Feuerwehr has correct data', () => {
            const feuerwehr = vereineData.find((v) => v.id === 'feuerwehr');
            expect(feuerwehr).toBeDefined();
            expect(feuerwehr?.title).toBe('Freiwillige Feuerwehr');
            expect(feuerwehr?.buttonColor).toBe('red');
        });

        test('Jugendfeuerwehr has correct data', () => {
            const jf = vereineData.find((v) => v.id === 'jugendfeuerwehr');
            expect(jf).toBeDefined();
            expect(jf?.title).toBe('Jugendfeuerwehr');
            expect(jf?.buttonColor).toBe('orange');
        });
    });

    describe('image paths', () => {
        test('all imageSrc paths point to images directory', () => {
            vereineData.forEach((verein) => {
                expect(verein.imageSrc).toMatch(/^\/images\//);
            });
        });

        test('imageSrc paths have valid extensions', () => {
            const validExtensions = [
                '.jpg',
                '.jpeg',
                '.png',
                '.webp',
                '.JPG',
                '.JPEG',
                '.PNG',
            ];
            vereineData.forEach((verein) => {
                const hasValidExtension = validExtensions.some((ext) =>
                    verein.imageSrc.endsWith(ext)
                );
                expect(hasValidExtension).toBe(true);
            });
        });
    });
});
