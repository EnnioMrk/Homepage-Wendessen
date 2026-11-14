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

// The data layer is annotated with Next's cache primitives. Outside the Next
// runtime they are no-ops, so the capability tests can call the real queries.
mock.module("next/cache", () => ({
  cacheTag: () => {},
  revalidateTag: () => {},
  revalidatePath: () => {},
  cacheLife: () => {},
  cache: (fn: unknown) => fn,
  unstable_cache: (fn: unknown) => fn,
  unstable_noStore: () => {},
}));

// Mock process.env for tests
process.env.SESSION_SECRET = 'test-secret-12345678901234567890123456789012';
process.env.ADMIN_PASSWORD = 'test-password';
