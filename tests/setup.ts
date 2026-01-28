// Bun test setup file
import { mock } from "bun:test";

// Mock Next.js headers/cookies if needed
mock.module("next/headers", () => ({
  cookies: () => ({
    get: () => undefined,
    set: () => {},
    delete: () => {},
    has: () => false,
  }),
  headers: () => new Map(),
}));

// Mock process.env for tests
process.env.SESSION_SECRET = 'test-secret-12345678901234567890123456789012';
process.env.ADMIN_PASSWORD = 'test-password';
