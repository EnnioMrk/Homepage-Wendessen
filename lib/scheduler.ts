/**
 * Background Scheduler for periodic tasks
 * 
 * This module runs periodic background tasks like sending reminder notifications.
 * It uses setInterval and includes measures to keep the scheduler running reliably.
 */

import { sendAllPendingReminders } from './push-notifications';

const ONE_HOUR_MS = 60 * 60 * 1000;

let isRunning = false;
let intervalId: ReturnType<typeof setInterval> | null = null;
let lastRunTime: Date | null = null;
let runCount = 0;

/**
 * Run the pending reminders check
 */
async function runReminderCheck(): Promise<void> {
    const timestamp = new Date().toISOString();
    runCount++;
    
    console.log(`[Scheduler] [${timestamp}] Running reminder check #${runCount}...`);
    
    try {
        const results = await sendAllPendingReminders();
        lastRunTime = new Date();
        
        console.log(`[Scheduler] [${timestamp}] Reminder check complete:`);
        console.log(`  Portraits: ${results.portraits.sent}/${results.portraits.checked} sent`);
        console.log(`  Shared Gallery: ${results.sharedGallery.sent}/${results.sharedGallery.checked} sent`);
    } catch (error) {
        console.error(`[Scheduler] [${timestamp}] Error running reminder check:`, error);
    }
}

/**
 * Schedule the next run using setTimeout for more reliable execution
 */
function scheduleNextRun(): void {
    if (!isRunning) return;
    
    // Use setTimeout instead of setInterval for more control
    intervalId = setTimeout(async () => {
        await runReminderCheck();
        scheduleNextRun(); // Schedule the next run after completion
    }, ONE_HOUR_MS);
    
    // Prevent the timeout from blocking process exit in development
    if (intervalId.unref) {
        intervalId.unref();
    }
}

/**
 * Start the background scheduler
 */
export function startScheduler(): void {
    if (isRunning) {
        console.log('[Scheduler] Already running, skipping start');
        return;
    }
    
    // Only run in production to avoid duplicate runs in development (hot reload)
    if (process.env.NODE_ENV !== 'production') {
        console.log('[Scheduler] Skipping scheduler start in development mode');
        return;
    }
    
    isRunning = true;
    console.log('[Scheduler] Starting background scheduler (1 hour interval)');
    
    // Run immediately on startup, then schedule hourly
    runReminderCheck().then(() => {
        scheduleNextRun();
    });
}

/**
 * Stop the background scheduler
 */
export function stopScheduler(): void {
    if (!isRunning) return;
    
    isRunning = false;
    if (intervalId) {
        clearTimeout(intervalId);
        intervalId = null;
    }
    console.log('[Scheduler] Stopped background scheduler');
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus(): {
    isRunning: boolean;
    lastRunTime: Date | null;
    runCount: number;
    nextRunIn: number | null;
} {
    return {
        isRunning,
        lastRunTime,
        runCount,
        nextRunIn: isRunning ? ONE_HOUR_MS : null,
    };
}
