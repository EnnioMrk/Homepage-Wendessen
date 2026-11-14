import { describe, expect, test } from 'bun:test';
import {
    dayOf,
    monthShort,
    weekday,
    clock,
    timeRange,
    dateLong,
    dateShort,
    isoDay,
    yearOf,
} from '@/app/lib/register-format';

// Fixed instants, Berlin renders them in CET/CEST. The register never formats
// dates in the server's local zone.
const winter = new Date('2026-11-14T08:30:00Z'); // 09:30 Berlin (CET)
const summer = new Date('2026-07-01T22:30:00Z'); // 00:30 Berlin, 2 July (CEST)

describe('register date format', () => {
    test('day numbers are zero padded', () => {
        expect(dayOf(new Date('2026-01-05T12:00:00Z'))).toBe('05');
    });

    test('month abbreviations are German and uppercase, without a dot', () => {
        expect(monthShort(winter)).toBe('NOV');
        expect(monthShort(summer)).toBe('JUL');
    });

    test('weekdays are German', () => {
        expect(weekday(winter)).toBe('SA');
    });

    test('clock and range use Berlin time', () => {
        expect(clock(winter)).toBe('09:30');
        expect(timeRange(winter, new Date('2026-11-14T10:30:00Z'))).toBe(
            '09:30 – 11:30',
        );
    });

    test('a zero-length range shows one time', () => {
        expect(timeRange(winter, winter)).toBe('09:30');
    });

    test('long dates are German', () => {
        expect(dateLong(winter)).toBe('14. November 2026');
        expect(dateShort(winter)).toBe('14.11.2026');
    });

    test('summer time crosses midnight in Berlin', () => {
        expect(dayOf(summer)).toBe('02');
        expect(clock(summer)).toBe('00:30');
    });

    test('isoDay is a stable machine date in Berlin', () => {
        expect(isoDay(summer)).toBe('2026-07-02');
    });

    test('yearOf uses the Berlin year', () => {
        expect(yearOf(new Date('2026-12-31T23:30:00Z'))).toBe(2027);
    });
});
