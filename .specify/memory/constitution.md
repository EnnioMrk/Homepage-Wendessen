# Wendessen Village Website Constitution

## Core Principles

### I. Community-First Design (NON-NEGOTIABLE)

Every feature MUST serve the village community of Wendessen, Germany. All design decisions prioritize:

-   German language and cultural conventions (de-DE locale, European patterns)
-   Accessibility for all age groups and technical skill levels
-   Mobile-first responsive design for common usage patterns
-   Content clarity over technical complexity
-   Village traditions and local terminology

### II. Simplicity Over Engineering Excellence

Avoid over-engineering solutions. Technology choices MUST be justified by community needs:

-   Use built-in Next.js features before adding external dependencies
-   Prefer readable, maintainable code over clever optimizations
-   Raw SQL with type-safe interfaces over heavy ORMs
-   Direct database connections over complex abstraction layers
-   Clear, documented patterns over framework magic

### III. TypeScript Strict Compliance (NON-NEGOTIABLE)

All code MUST use TypeScript with strict type checking:

-   Interface definitions required for all data structures
-   No `any` types except for proven external library integration
-   Database transformation functions MUST include type converters
-   Component props require inline interface definitions
-   Error handling with typed exceptions mandatory

### IV. Performance & Caching Strategy

Every data operation MUST consider caching and performance:

-   Use `unstable_cache` with tag-based invalidation for database queries
-   Server-side rendering (SSR) for SEO-critical pages
-   Static generation where content is predictable
-   Image optimization with Next.js Image component required
-   Cache invalidation on data mutations (`revalidatePath`, `revalidateTag`)

### V. German Localization Standards

All user-facing content MUST follow German conventions:

-   Date formatting: `.toLocaleDateString('de-DE')`
-   German terminology for village concepts (Vereine, Ortsrat, etc.)
-   Cultural color associations (green for nature/community, red for emergencies)
-   European design patterns and expectations
-   Proper German grammar and formal address where appropriate

## Technical Constraints

### Runtime & Development Environment

-   **Bun REQUIRED**: All commands use `bun` (dev, build, install)
-   **Next.js 15 App Router**: No Pages Router patterns allowed
-   **React 19**: Use latest concurrent features where beneficial
-   **PostgreSQL**: Database is PostgreSQL-compatible and accessed via the `lib/sql.ts` helper (driver: `pg`)
-   **Tailwind CSS**: Utility-first styling, no custom CSS files

### Database Operations

-   Raw SQL queries with proper TypeScript typing
-   Database transformation functions for all entity types
-   Consistent error handling with descriptive messages
-   Connection management through single `sql` instance
-   No ORM dependencies - direct control over queries

### Component Architecture

-   Functional components with React hooks only
-   Props interfaces defined inline with components
-   Default exports for components, named exports for utilities
-   Lucide React for all icons (consistency requirement)
-   Card-based layouts with consistent shadow and hover patterns

### Authentication & Security

-   Custom session-based authentication (no external auth providers)
-   Environment variable password protection
-   HTTP-only cookies for session management
-   Middleware-based route protection for admin areas
-   No user registration - single admin access model

## Development Workflow

### Code Quality Gates

-   ESLint compliance required for all commits
-   TypeScript compilation must pass without warnings
-   Manual testing on mobile and desktop viewports required
-   Accessibility considerations documented for new components
-   German localization verified for user-facing content

### Database Changes

-   Setup scripts in `/scripts/` directory for schema changes
-   Database migration scripts must be idempotent
-   Test data setup separated from production schema
-   Backup considerations documented for destructive changes

### Documentation Standards

-   README updates required for new features
-   API documentation in `/docs/` for significant changes
-   Component props documented with JSDoc where complex
-   German translations provided for user-facing error messages
-   Architecture decisions recorded in PROJECT_OVERVIEW.md

### Performance Requirements

-   Page load times under 2 seconds on 3G connections
-   Image optimization mandatory (WebP where supported)
-   Core Web Vitals compliance required
-   Database query performance monitoring
-   Caching strategy documented for new data patterns

## Content Management Principles

### Admin Interface Standards

-   Single password authentication (ADMIN_PASSWORD env var)
-   All admin routes protected by middleware
-   Content approval workflows for user-generated content
-   Audit trail for content changes (created_at, updated_at)
-   Error handling with user-friendly German messages

### Data Integrity

-   Required fields clearly marked in interfaces
-   Input validation on both client and server
-   Graceful degradation for optional data
-   Consistent date handling (ISO strings in database, Date objects in code)
-   Image storage with fallback handling

### Village-Specific Business Rules

-   Event categories: `sitzung`, `veranstaltung`, `sport`, `kultur`, `notfall`, `sonstiges`
-   Portrait approval system with status tracking
-   Contact importance scoring for directory priority
-   News categorization reflecting village needs
-   Gallery organization by community events

## Governance

### Constitution Authority

This constitution supersedes all other development practices. Conflicts require resolution through:

1. Constitution amendment (explicit process)
2. Architectural adjustment to comply
3. Feature redesign to meet principles

### Compliance Verification

-   All feature development must reference applicable principles
-   Code reviews verify constitutional compliance
-   Performance requirements validated before deployment
-   Community needs assessment for major changes

### Amendment Process

Constitution changes require:

1. Documented justification for the change
2. Impact assessment on existing codebase
3. Migration plan if breaking changes required
4. Explicit approval before implementation

**Version**: 1.0.0 | **Ratified**: September 24, 2025 | **Last Amended**: September 24, 2025
