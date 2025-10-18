# Testing

## 🧪 Testing Strategy

### Testing Pyramid

```
                    E2E Tests (Few)
                   /              \
              Integration Tests (Some)
             /                        \
        Unit Tests (Many)              \
       /                                \
  Component Tests (Many)                 Manual Tests
```

### Testing Categories

#### 1. Unit Tests

-   **Purpose**: Test individual functions and utilities
-   **Coverage**: Database functions, utilities, helpers
-   **Tools**: Jest, Testing Library
-   **Frequency**: Run on every commit

#### 2. Component Tests

-   **Purpose**: Test React components in isolation
-   **Coverage**: UI components, forms, modals
-   **Tools**: React Testing Library, Jest
-   **Frequency**: Run during development

#### 3. Integration Tests

-   **Purpose**: Test API endpoints and database interactions
-   **Coverage**: API routes, authentication flow
-   **Tools**: Jest, Supertest
-   **Frequency**: Run before deployment

#### 4. End-to-End Tests

-   **Purpose**: Test complete user workflows
-   **Coverage**: Critical user paths
-   **Tools**: Playwright or Cypress
-   **Frequency**: Run before releases

## 🛠️ Testing Setup

### Install Testing Dependencies

```bash
# Core testing libraries
bun add -D jest @testing-library/react @testing-library/jest-dom

# Additional utilities
bun add -D @testing-library/user-event jest-environment-jsdom

# API testing
bun add -D supertest @types/supertest

# E2E testing (optional)
bun add -D @playwright/test
```

### Jest Configuration (`jest.config.js`)

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files
    dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    collectCoverageFrom: [
        'app/**/*.{js,jsx,ts,tsx}',
        'lib/**/*.{js,jsx,ts,tsx}',
        '!**/*.d.ts',
        '!**/node_modules/**',
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
```

### Jest Setup (`jest.setup.js`)

```javascript
import '@testing-library/jest-dom';

// Mock Next.js features
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        };
    },
    useSearchParams() {
        return new URLSearchParams();
    },
    usePathname() {
        return '/';
    },
}));

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.ADMIN_PASSWORD = 'test-password';

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
```

### Package.json Scripts

```json
{
    "scripts": {
        "test": "jest",
        "test:watch": "jest --watch",
        "test:coverage": "jest --coverage",
        "test:e2e": "playwright test",
        "test:api": "jest --testPathPattern=api"
    }
}
```

## 🔧 Unit Testing

### Database Functions Testing

```typescript
// __tests__/lib/database.test.ts
import { getEvents, createEvent, deleteEvent } from '@/lib/database';

// Mock the shared sql helper
jest.mock('@/lib/sql', () => ({
    sql: jest.fn(),
}));

describe('Database Functions', () => {
    const mockSql = require('@/lib/sql').sql;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSql.mockReset();
    });

    describe('getEvents', () => {
        it('should return formatted events', async () => {
            const mockEvents = [
                {
                    id: 1,
                    title: 'Test Event',
                    start_date: '2025-09-25T10:00:00Z',
                    end_date: '2025-09-25T12:00:00Z',
                    category: 'veranstaltung',
                },
            ];

            mockSql.mockResolvedValue(mockEvents);

            const events = await getEvents();

            expect(events).toHaveLength(1);
            expect(events[0]).toMatchObject({
                id: '1',
                title: 'Test Event',
                start: expect.any(Date),
                end: expect.any(Date),
                category: 'veranstaltung',
            });
        });

        it('should handle database errors', async () => {
            mockSql.mockRejectedValue(new Error('Database connection failed'));

            await expect(getEvents()).rejects.toThrow(
                'Failed to fetch events from database'
            );
        });
    });

    describe('createEvent', () => {
        it('should create and return new event', async () => {
            const newEvent = {
                title: 'New Event',
                start: new Date('2025-09-25T10:00:00Z'),
                end: new Date('2025-09-25T12:00:00Z'),
                category: 'veranstaltung' as const,
                location: 'Test Location',
            };

            const mockResult = [
                {
                    id: 1,
                    title: 'New Event',
                    start_date: '2025-09-25T10:00:00Z',
                    end_date: '2025-09-25T12:00:00Z',
                    category: 'veranstaltung',
                    location: 'Test Location',
                },
            ];

            mockSql.mockResolvedValue(mockResult);

            const result = await createEvent(newEvent);

            expect(result.id).toBe('1');
            expect(result.title).toBe('New Event');
            expect(mockSql).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.stringContaining('INSERT INTO events'),
                ])
            );
        });
    });
});
```

### Utility Functions Testing

```typescript
// __tests__/lib/utils.test.ts
import { formatGermanDate, formatGermanTime } from '@/lib/utils';

describe('Date Utilities', () => {
    describe('formatGermanDate', () => {
        it('should format date in German locale', () => {
            const date = new Date('2025-09-25T10:00:00Z');
            const formatted = formatGermanDate(date);

            expect(formatted).toMatch(/\d{1,2}\.\d{1,2}\.\d{4}/);
        });
    });

    describe('formatGermanTime', () => {
        it('should format time in German locale', () => {
            const date = new Date('2025-09-25T14:30:00Z');
            const formatted = formatGermanTime(date);

            expect(formatted).toMatch(/\d{1,2}:\d{2}/);
        });
    });
});
```

## ⚛️ Component Testing

### EventCard Component Testing

```typescript
// __tests__/components/EventCard.test.tsx
import { render, screen } from '@testing-library/react';
import EventCard from '@/app/components/EventCard';

describe('EventCard', () => {
    const defaultProps = {
        title: 'Test Event',
        location: 'Test Location',
        time: '14:00',
        date: '25.09.2025',
        imageAlt: 'Test event image',
    };

    it('renders event information correctly', () => {
        render(<EventCard {...defaultProps} />);

        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('Test Location')).toBeInTheDocument();
        expect(screen.getByText('14:00')).toBeInTheDocument();
        expect(screen.getByText('25.09.2025')).toBeInTheDocument();
    });

    it('renders with image when imageSrc is provided', () => {
        render(
            <EventCard
                {...defaultProps}
                imageSrc="/test-image.jpg"
                hasImage={true}
            />
        );

        const image = screen.getByAltText('Test event image');
        expect(image).toBeInTheDocument();
    });

    it('renders fallback layout when no image', () => {
        render(<EventCard {...defaultProps} hasImage={false} />);

        // Should render fallback content
        expect(screen.getByText('📅')).toBeInTheDocument();
    });

    it('applies hover styles correctly', () => {
        render(<EventCard {...defaultProps} />);

        const card = screen.getByText('Test Event').closest('div');
        expect(card).toHaveClass(
            'group',
            'hover:shadow-3xl',
            'hover:-translate-y-2'
        );
    });
});
```

### Modal Component Testing

```typescript
// __tests__/components/EventModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import EventModal from '@/app/components/EventModal';

describe('EventModal', () => {
    const mockEvent = {
        id: '1',
        title: 'Test Event',
        start: new Date('2025-09-25T10:00:00Z'),
        end: new Date('2025-09-25T12:00:00Z'),
        description: 'Test description',
        location: 'Test location',
        category: 'veranstaltung' as const,
    };

    const defaultProps = {
        event: mockEvent,
        isOpen: true,
        onClose: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders modal when open', () => {
        render(<EventModal {...defaultProps} />);

        expect(screen.getByText('Test Event')).toBeInTheDocument();
        expect(screen.getByText('Test description')).toBeInTheDocument();
        expect(screen.getByText('Test location')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<EventModal {...defaultProps} isOpen={false} />);

        expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
    });

    it('calls onClose when backdrop is clicked', () => {
        render(<EventModal {...defaultProps} />);

        const backdrop = screen.getByTestId('modal-backdrop');
        fireEvent.click(backdrop);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when close button is clicked', () => {
        render(<EventModal {...defaultProps} />);

        const closeButton = screen.getByLabelText('Close modal');
        fireEvent.click(closeButton);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
});
```

## 🔌 Integration Testing

### API Route Testing

```typescript
// __tests__/api/events.test.ts
import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/events/route';

// Mock database functions
jest.mock('@/lib/database', () => ({
    getEvents: jest.fn(),
    createEvent: jest.fn(),
}));

// Mock authentication
jest.mock('@/lib/auth', () => ({
    isAuthenticated: jest.fn(),
}));

describe('/api/events', () => {
    describe('GET', () => {
        it('should return events list', async () => {
            const { getEvents } = require('@/lib/database');
            const mockEvents = [
                { id: '1', title: 'Event 1' },
                { id: '2', title: 'Event 2' },
            ];

            getEvents.mockResolvedValue(mockEvents);

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockEvents);
        });

        it('should handle database errors', async () => {
            const { getEvents } = require('@/lib/database');
            getEvents.mockRejectedValue(new Error('Database error'));

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Failed to fetch events');
        });
    });

    describe('POST', () => {
        it('should create new event when authenticated', async () => {
            const { createEvent } = require('@/lib/database');
            const { isAuthenticated } = require('@/lib/auth');

            isAuthenticated.mockResolvedValue(true);
            createEvent.mockResolvedValue({ id: '1', title: 'New Event' });

            const { req } = createMocks({
                method: 'POST',
                body: {
                    title: 'New Event',
                    start: '2025-09-25T10:00:00Z',
                    end: '2025-09-25T12:00:00Z',
                    category: 'veranstaltung',
                },
            });

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data.title).toBe('New Event');
        });

        it('should reject unauthenticated requests', async () => {
            const { isAuthenticated } = require('@/lib/auth');
            isAuthenticated.mockResolvedValue(false);

            const { req } = createMocks({
                method: 'POST',
                body: { title: 'New Event' },
            });

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe('Unauthorized');
        });
    });
});
```

### Authentication Flow Testing

```typescript
// __tests__/lib/auth.test.ts
import { verifyPassword, createSession, isAuthenticated } from '@/lib/auth';
import { cookies } from 'next/headers';

// Mock Next.js cookies
jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

describe('Authentication', () => {
    const mockCookies = {
        set: jest.fn(),
        get: jest.fn(),
        delete: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockResolvedValue(mockCookies);
    });

    describe('verifyPassword', () => {
        it('should return true for correct password', () => {
            process.env.ADMIN_PASSWORD = 'test-password';

            expect(verifyPassword('test-password')).toBe(true);
        });

        it('should return false for incorrect password', () => {
            process.env.ADMIN_PASSWORD = 'test-password';

            expect(verifyPassword('wrong-password')).toBe(false);
        });
    });

    describe('createSession', () => {
        it('should create session cookie', async () => {
            await createSession();

            expect(mockCookies.set).toHaveBeenCalledWith(
                'admin-session',
                expect.any(String),
                expect.objectContaining({
                    httpOnly: true,
                    maxAge: 604800,
                    path: '/',
                })
            );
        });
    });

    describe('isAuthenticated', () => {
        it('should return true for valid session', async () => {
            const validToken = Buffer.from(`${Date.now()}-random`).toString(
                'base64'
            );
            mockCookies.get.mockReturnValue({ value: validToken });

            const result = await isAuthenticated();

            expect(result).toBe(true);
        });

        it('should return false for missing session', async () => {
            mockCookies.get.mockReturnValue(null);

            const result = await isAuthenticated();

            expect(result).toBe(false);
        });

        it('should return false for expired session', async () => {
            const expiredToken = Buffer.from(
                `${Date.now() - 10 * 24 * 60 * 60 * 1000}-random`
            ).toString('base64');
            mockCookies.get.mockReturnValue({ value: expiredToken });

            const result = await isAuthenticated();

            expect(result).toBe(false);
        });
    });
});
```

## 🎭 End-to-End Testing

### Playwright Setup (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],
    webServer: {
        command: 'bun run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});
```

### Homepage E2E Tests

```typescript
// e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test('should load homepage correctly', async ({ page }) => {
        await page.goto('/');

        // Check main elements
        await expect(page.locator('h1')).toContainText('Wendessen');
        await expect(
            page.locator('[data-testid="events-section"]')
        ).toBeVisible();
        await expect(
            page.locator('[data-testid="news-section"]')
        ).toBeVisible();
    });

    test('should navigate to events page', async ({ page }) => {
        await page.goto('/');

        await page.click('text=Was steht an?');
        await expect(page).toHaveURL('/was-steht-an');
        await expect(page.locator('.rbc-calendar')).toBeVisible();
    });

    test('should be responsive', async ({ page }) => {
        await page.goto('/');

        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 812 });
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

        // Test desktop viewport
        await page.setViewportSize({ width: 1280, height: 720 });
        await expect(
            page.locator('[data-testid="desktop-menu"]')
        ).toBeVisible();
    });
});
```

### Admin Panel E2E Tests

```typescript
// e2e/admin.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
    test('should login successfully', async ({ page }) => {
        await page.goto('/admin/login');

        await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD!);
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/admin/dashboard');
        await expect(page.locator('h1')).toContainText('Admin Dashboard');
    });

    test('should create new event', async ({ page }) => {
        // Login first
        await page.goto('/admin/login');
        await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD!);
        await page.click('button[type="submit"]');

        // Navigate to events
        await page.goto('/admin/events');
        await page.click('text=Neues Event');

        // Fill form
        await page.fill('input[name="title"]', 'Test Event');
        await page.fill('textarea[name="description"]', 'Test description');
        await page.fill('input[name="location"]', 'Test location');

        // Submit
        await page.click('button[type="submit"]');

        // Verify creation
        await expect(page.locator('text=Test Event')).toBeVisible();
    });

    test('should prevent unauthorized access', async ({ page }) => {
        await page.goto('/admin/dashboard');

        // Should redirect to login
        await expect(page).toHaveURL('/admin/login');
    });
});
```

## 📊 Testing Best Practices

### Test Organization

```
__tests__/
├── components/          # Component tests
│   ├── EventCard.test.tsx
│   └── NewsCard.test.tsx
├── lib/                # Utility tests
│   ├── database.test.ts
│   └── auth.test.ts
├── pages/              # Page tests
│   └── api/            # API route tests
└── utils/              # Test utilities
    └── test-utils.tsx
```

### Test Utilities

```typescript
// __tests__/utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Mock providers if needed
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
};

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Common test data
export const mockEvent = {
    id: '1',
    title: 'Test Event',
    start: new Date('2025-09-25T10:00:00Z'),
    end: new Date('2025-09-25T12:00:00Z'),
    category: 'veranstaltung' as const,
};

export const mockNews = {
    id: '1',
    title: 'Test News',
    content: 'Test content',
    category: 'General',
    publishedDate: new Date('2025-09-25T10:00:00Z'),
};
```

### Test Data Factory

```typescript
// __tests__/utils/factories.ts
export const createMockEvent = (overrides = {}) => ({
    id: '1',
    title: 'Mock Event',
    start: new Date('2025-09-25T10:00:00Z'),
    end: new Date('2025-09-25T12:00:00Z'),
    category: 'veranstaltung' as const,
    location: 'Mock Location',
    organizer: 'Mock Organizer',
    ...overrides,
});

export const createMockNews = (overrides = {}) => ({
    id: '1',
    title: 'Mock News',
    content: 'Mock content',
    category: 'General',
    publishedDate: new Date('2025-09-25T10:00:00Z'),
    ...overrides,
});
```

## 🚀 Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v4

            - uses: oven-sh/setup-bun@v1
              with:
                  bun-version: latest

            - name: Install dependencies
              run: bun install

            - name: Run tests
              run: bun test --coverage

            - name: Upload coverage reports
              uses: codecov/codecov-action@v3
              with:
                  file: ./coverage/lcov.info

    e2e:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - uses: oven-sh/setup-bun@v1
              with:
                  bun-version: latest

            - name: Install dependencies
              run: bun install

            - name: Install Playwright
              run: bunx playwright install

            - name: Run E2E tests
              run: bun test:e2e
              env:
                  DATABASE_URL: ${{ secrets.DATABASE_URL }}
                  ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
```

## 📈 Test Coverage

### Coverage Goals

-   **Statements**: 80%+
-   **Branches**: 75%+
-   **Functions**: 80%+
-   **Lines**: 80%+

### Coverage Reports

```bash
# Generate coverage report
bun test --coverage

# View HTML report
open coverage/lcov-report/index.html

# Check specific files
bun test --coverage --collectCoverageFrom="lib/database.ts"
```

### Excluding Files from Coverage

```javascript
// jest.config.js
collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
];
```

---

**Next:** [Deployment & CI/CD](./09-deployment-cicd.md)
