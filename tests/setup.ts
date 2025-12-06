/**
 * Test setup file for Bun tests
 * This file is preloaded before all tests run
 */

import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const equalIndex = trimmed.indexOf('=');
            if (equalIndex > 0) {
                const key = trimmed.substring(0, equalIndex);
                const value = trimmed.substring(equalIndex + 1);
                if (key && !process.env[key]) {
                    process.env[key] = value;
                }
            }
        }
    }
}

// Set test environment
process.env.NODE_ENV = 'test';

// Suppress console.log in tests unless DEBUG is set
if (!process.env.DEBUG) {
    const originalConsoleLog = console.log;
    const originalConsoleWarn = console.warn;

    console.log = (...args: unknown[]) => {
        // Only suppress in non-error scenarios
        if (process.env.TEST_VERBOSE === 'true') {
            originalConsoleLog(...args);
        }
    };

    console.warn = (...args: unknown[]) => {
        // Keep warnings visible but prefixed
        if (process.env.TEST_VERBOSE === 'true') {
            originalConsoleWarn('[WARN]', ...args);
        }
    };
}

// Global test utilities
declare global {
    var testUtils: {
        sleep: (ms: number) => Promise<void>;
        randomString: (length: number) => string;
        randomEmail: () => string;
    };
}

globalThis.testUtils = {
    sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
    randomString: (length: number) => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    randomEmail: () =>
        `test-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}@example.com`,
};

export {};
