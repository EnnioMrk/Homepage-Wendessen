import { describe, test, expect } from 'bun:test';
import {
    calculateImportance,
    isHighImportanceRole,
} from '../../lib/utils/importance-utils';

describe('Importance Utils', () => {
    describe('calculateImportance', () => {
        test('returns 0 for empty affiliations array', () => {
            expect(calculateImportance([])).toBe(0);
        });

        test('returns 0 for null/undefined affiliations', () => {
            expect(
                calculateImportance(
                    null as unknown as { org: string; role: string }[]
                )
            ).toBe(0);
            expect(
                calculateImportance(
                    undefined as unknown as { org: string; role: string }[]
                )
            ).toBe(0);
        });

        test('returns highest importance from multiple roles', () => {
            const affiliations = [
                { org: 'Ortsrat', role: 'Ortsratsmitglied' },
                { org: 'Wendessen', role: 'Ortsbürgermeister' },
            ];
            expect(calculateImportance(affiliations)).toBe(1000);
        });

        test('returns correct importance for Ortsbürgermeister', () => {
            const affiliations = [
                { org: 'Wendessen', role: 'Ortsbürgermeister' },
            ];
            expect(calculateImportance(affiliations)).toBe(1000);
        });

        test('returns correct importance for stellv. Ortsbürgermeisterin', () => {
            const affiliations = [
                { org: 'Wendessen', role: 'stellv. Ortsbürgermeisterin' },
            ];
            expect(calculateImportance(affiliations)).toBe(900);
        });

        test('returns correct importance for stellv. Ortsbürgermeister', () => {
            const affiliations = [
                { org: 'Wendessen', role: 'stellv. Ortsbürgermeister' },
            ];
            expect(calculateImportance(affiliations)).toBe(900);
        });

        test('returns correct importance for Ortsratsmitglied', () => {
            const affiliations = [{ org: 'Ortsrat', role: 'Ortsratsmitglied' }];
            expect(calculateImportance(affiliations)).toBe(700);
        });

        test('returns correct importance for Ortsbrandmeister', () => {
            const affiliations = [
                { org: 'Feuerwehr', role: 'Ortsbrandmeister' },
            ];
            expect(calculateImportance(affiliations)).toBe(600);
        });

        test('returns correct importance for 1. Vorsitzender', () => {
            const affiliations = [{ org: 'Verein', role: '1. Vorsitzender' }];
            expect(calculateImportance(affiliations)).toBe(400);
        });

        test('returns correct importance for 1. Vorsitzende', () => {
            const affiliations = [{ org: 'Verein', role: '1. Vorsitzende' }];
            expect(calculateImportance(affiliations)).toBe(400);
        });

        test('returns default importance (50) for unknown role', () => {
            const affiliations = [
                { org: 'Organization', role: 'Unknown Role' },
            ];
            expect(calculateImportance(affiliations)).toBe(50);
        });

        test('returns correct importance for Mitglied', () => {
            const affiliations = [{ org: 'Verein', role: 'Mitglied' }];
            expect(calculateImportance(affiliations)).toBe(100);
        });

        test('handles multiple affiliations with same importance', () => {
            const affiliations = [
                { org: 'Verein A', role: 'Mitglied' },
                { org: 'Verein B', role: 'Vereinsmitglied' },
            ];
            expect(calculateImportance(affiliations)).toBe(100);
        });
    });

    describe('isHighImportanceRole', () => {
        test('returns true for Ortsbürgermeister (1000)', () => {
            expect(isHighImportanceRole('Ortsbürgermeister')).toBe(true);
        });

        test('returns true for stellv. Ortsbürgermeisterin (900)', () => {
            expect(isHighImportanceRole('stellv. Ortsbürgermeisterin')).toBe(
                true
            );
        });

        test('returns true for Ortsratsmitglied (700)', () => {
            expect(isHighImportanceRole('Ortsratsmitglied')).toBe(true);
        });

        test('returns true for Ortsbrandmeister (600)', () => {
            expect(isHighImportanceRole('Ortsbrandmeister')).toBe(true);
        });

        test('returns true for stellv. Ortsbrandmeister (550)', () => {
            expect(isHighImportanceRole('stellv. Ortsbrandmeister')).toBe(true);
        });

        test('returns true for Jugendfeuerwehrwart (500)', () => {
            expect(isHighImportanceRole('Jugendfeuerwehrwart')).toBe(true);
        });

        test('returns false for stellv. Jugendfeuerwehrwart (450)', () => {
            expect(isHighImportanceRole('stellv. Jugendfeuerwehrwart')).toBe(
                false
            );
        });

        test('returns false for 1. Vorsitzender (400)', () => {
            expect(isHighImportanceRole('1. Vorsitzender')).toBe(false);
        });

        test('returns false for Mitglied (100)', () => {
            expect(isHighImportanceRole('Mitglied')).toBe(false);
        });

        test('returns false for unknown role (0)', () => {
            expect(isHighImportanceRole('Unknown Role')).toBe(false);
        });
    });
});
