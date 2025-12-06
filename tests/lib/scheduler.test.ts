import { describe, test, expect } from 'bun:test';
import { getSchedulerStatus } from '../../lib/scheduler';

describe('Scheduler', () => {
    describe('getSchedulerStatus', () => {
        test('returns status object with required fields', () => {
            const status = getSchedulerStatus();

            expect(status).toBeDefined();
            expect(typeof status.isRunning).toBe('boolean');
            expect(
                status.lastRunTime === null ||
                    status.lastRunTime instanceof Date
            ).toBe(true);
            expect(typeof status.runCount).toBe('number');
            expect(
                status.nextRunIn === null ||
                    typeof status.nextRunIn === 'number'
            ).toBe(true);
        });

        test('runCount is non-negative', () => {
            const status = getSchedulerStatus();
            expect(status.runCount).toBeGreaterThanOrEqual(0);
        });

        test('nextRunIn is null when not running', () => {
            const status = getSchedulerStatus();
            // In test environment, scheduler shouldn't be running
            if (!status.isRunning) {
                expect(status.nextRunIn).toBeNull();
            }
        });
    });

    // Note: startScheduler and stopScheduler are not tested here
    // because they modify global state and have side effects.
    // In production, they should be tested with proper mocking/isolation.
});
