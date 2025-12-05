# GitHub Copilot Instructions - Wendessen Village Website

## Project Overview

This is a Next.js 15 community website for the village of Wendessen, Germany. It serves as a digital hub for local events, news, gallery, and contact information. The site features both public content and an admin management system.

## Tech Stack & Architecture

-   **Framework**: Next.js 15 with App Router, React 19
-   **Runtime**: Bun (preferred for all commands: `bun dev`, `bun run build`)
    **Database**: PostgreSQL via `pg` (node-postgres) and a shared helper `lib/sql.ts`
-   **Styling**: Tailwind CSS with custom component patterns
-   **Authentication**: Custom session-based auth (see `lib/auth.ts`)
-   **Caching**: Next.js `unstable_cache` with tags for data revalidation

### Database Layer Patterns

### Core Data Models

-   **Events**: Events calendar with categories (`sitzung`, `veranstaltung`, `sport`, `kultur`, `notfall`, `sonstiges`)
-   **News**: Village news with categorization
-   **Gallery**: Image management system
-   **Contacts**: Community contact directory with importance scoring

### Database Connection Pattern

```typescript
import { sql } from '@/lib/sql';
// use tagged-template sql`SELECT ...` throughout the codebase
```

### Data Transformation Convention

All database functions follow a consistent pattern:

1. Raw database query returns `Record<string, unknown>`
2. Convert to strongly-typed interfaces via converter functions (e.g., `convertToCalendarEvent`)
3. Use `unstable_cache` with tags for performance and revalidation

Example:

```typescript
export const getEvents = unstable_cache(
    async (): Promise<CalendarEvent[]> => {
        const events = await sql`SELECT * FROM events ORDER BY start_date ASC`;
        return events.map(convertToCalendarEvent);
    },
    ['all-events'],
    { tags: ['events'], revalidate: 3600 }
);
```

## Component Patterns

### File Organization

-   Components are in `app/components/` directory
-   Use TypeScript with strict typing
-   Props interfaces are defined inline with components

### UI Component Structure

1. **Card Components**: Use consistent shadow, hover, and transform patterns
2. **Gradient Backgrounds**: Extensive use of Tailwind gradient utilities
3. **Responsive Design**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
4. **Icon Integration**: Lucide React icons throughout

### Modal Pattern

Modals follow this structure:

-   `isOpen` boolean prop for visibility
-   `onClose` callback for closing
-   `onSuccess` callback for data refreshing
-   Always include backdrop click handling

## Admin System

### Authentication Flow

-   Simple password-based auth (environment variable `ADMIN_PASSWORD`)
-   Session tokens stored in HTTP-only cookies
-   Middleware protects `/admin/*` routes except `/admin/login`
-   No database storage - tokens are self-contained with timestamps

### Admin Route Structure

```
/admin/
  /login - Authentication page
  /dashboard - Overview with quick actions
  /events - Event management with calendar
  /news - News article management
  /gallery - Image upload and management
```

### Data Mutations

-   All admin actions require authentication check via `isAuthenticated()`
-   Use `revalidatePath('/')` and `revalidateTag('events')` after mutations
-   API routes follow REST conventions in `app/api/admin/`

## Database Scripts & Migrations

### Setup Commands

-   `bun run setup-gallery` - Creates gallery table
-   `bun run setup-contacts` - Initializes contact data
-   Direct script execution: `bun run scripts/setup-database.ts`

### Migration Pattern

Scripts use direct SQL execution with error handling:

```typescript
await sql`CREATE TABLE IF NOT EXISTS table_name (...);`;
await sql`CREATE INDEX IF NOT EXISTS idx_name ON table(column);`;
```

## Development Workflow

### Local Development

1. **Development Server**: Assume `bun dev` is always running in the background on port 3000 with Turbopack (never start a new develiopment server)
2. Environment variables required: `DATABASE_URL`, `ADMIN_PASSWORD`
3. Database setup: Run `setup-database.ts` script first
4. Local URL: `http://localhost:3000` for testing changes

### Styling Conventions

-   Use Tailwind utility classes, avoid custom CSS
-   Color scheme: `primary`, `secondary`, `accent` classes defined in config
-   Responsive breakpoints: Mobile-first design approach
-   Component-specific color mappings (e.g., event categories have specific badge colors)
-   **IMPORTANT**: Always use `text-gray-900` for input values and `text-gray-700` for labels to ensure proper contrast and readability. Never use light gray colors (`text-gray-400`, `text-gray-500`) for user input text

## Common Patterns to Follow

### Error Handling

-   Wrap database calls in try-catch with descriptive error messages
-   Return meaningful HTTP status codes in API routes
-   Use loading states in client components

### Date Handling

-   Store dates as ISO strings in database
-   Convert to Date objects in converter functions
-   Use German locale formatting: `.toLocaleDateString('de-DE')`

### Image Handling

-   Next.js Image component with `fill` prop for responsive containers
-   Optimized images in `public/images/` with organized subdirectories
-   Fallback patterns for missing images

### Cache Invalidation

-   Tag-based caching: `['events']`, `['contacts']`, `['news']`
-   Revalidate after mutations with `revalidatePath()` and `revalidateTag()`
-   1-hour fallback revalidation for most cached functions

When contributing to this project, follow these established patterns for consistency and maintainability.
