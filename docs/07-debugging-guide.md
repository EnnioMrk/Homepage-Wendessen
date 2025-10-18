# Debugging Guide

## 🐛 Common Issues & Solutions

### Database Connection Issues

#### Issue: "Database connection failed"

**Symptoms:**

-   Error: `Failed to fetch events from database`
-   500 errors on API endpoints
-   Empty data sections on homepage

**Solutions:**

```bash
# 1. Check environment variables
echo $DATABASE_URL

# 2. Test database connection
bun run scripts/setup-database.ts

# 3. Verify Neon database status
# Visit neon.tech console and check database status

# 4. Check network connectivity
ping ep-example.us-east-1.aws.neon.tech
```

**Root Causes:**

-   Missing or incorrect `DATABASE_URL` in `.env.local`
-   Database server downtime
-   Network connectivity issues
-   Invalid credentials in connection string

#### Issue: "Connection pool exhausted"

**Solution:**

```typescript
// Implement connection retry logic
// Use the shared helper instead of neon: import { sql } from '@/lib/sql';
// The helper reads DATABASE_URL from env and uses pg.Pool under the hood.
// const sql = /* use the shared helper: import { sql } from '@/lib/sql' */ null;
    pool: {
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    },
});
```

### Authentication Problems

#### Issue: "Cannot access admin panel"

**Symptoms:**

-   Redirected to login page repeatedly
-   "Invalid password" with correct password
-   Session expires immediately

**Debugging Steps:**

```bash
# 1. Check admin password
echo $ADMIN_PASSWORD

# 2. Clear browser cookies
# In browser dev tools: Application > Cookies > Clear all

# 3. Check middleware logs
# Add console.log in middleware.ts
```

**Solutions:**

```typescript
// Add debugging to auth.ts
export async function isAuthenticated(): Promise<boolean> {
    console.log('Checking authentication...');
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME);

    console.log('Session token:', sessionToken?.value ? 'exists' : 'missing');

    if (!sessionToken?.value) {
        console.log('No session token found');
        return false;
    }

    // ... rest of function
}
```

### Build & Deployment Errors

#### Issue: "Type errors during build"

**Common TypeScript errors:**

```bash
# Error: Property 'id' does not exist on type 'unknown'
# Solution: Add proper type assertions
const id = String(dbRecord.id);

# Error: Cannot find module '@/lib/database'
# Solution: Check tsconfig.json paths configuration
```

**Fix TypeScript issues:**

```bash
# Check types without building
npx tsc --noEmit

# Fix missing type definitions
bun add -D @types/package-name
```

#### Issue: "Out of memory during build"

**Solution:**

```bash
# Increase Node.js memory limit
NODE_OPTIONS='--max_old_space_size=4096' bun run build

# Or use Bun's memory management
bun run build --heap-size=4096
```

### Runtime Errors

#### Issue: "Hydration errors"

**Symptoms:**

-   Text content mismatch warnings
-   Components not interactive
-   Console errors about hydration

**Common causes & fixes:**

```typescript
// 1. Date formatting differences between server/client
// Bad:
const dateString = new Date().toLocaleDateString();

// Good:
const dateString = new Date().toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});

// 2. Conditional rendering based on client state
// Bad:
const [mounted, setMounted] = useState(false);
if (!mounted) return null;

// Good:
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return <div>Loading...</div>;
```

## 🔍 Debugging Tools

### Browser Developer Tools

#### Network Tab

```javascript
// - 500 errors (server issues)
// - Slow requests (performance)
// - Failed requests (network issues)
```

#### Console Debugging

```typescript
# Run a quick script that uses the shared helper (requires DATABASE_URL in env)
# Example: `bunx tsx scripts/setup-database.ts`
// Add debug logging
const DEBUG = process.env.NODE_ENV === 'development';

function debugLog(message: string, data?: any) {
    if (DEBUG) {
        console.log(`[DEBUG] ${message}`, data);
    }
    debugLog('EventCard rendered', { title, props });
    return <div>...</div>;
}
```

#### Application Tab

```javascript
// Check stored data:
// const sql = /* use the shared helper: import { sql } from '@/lib/sql' */ null;
// - Cookies (admin session)
// - Local Storage
// - Session Storage
// - Cache Storage
```

### Server-Side Debugging

#### Database Query Debugging

```typescript
// Add query logging
// const sql = /* use the shared helper: import { sql } from '@/lib/sql' */ null;
    debug: process.env.NODE_ENV === 'development',
export async function debugQuery() {
    try {
        const result = await sql`SELECT NOW()`;
        console.log('Database connection test:', result);
        return result;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}
```

#### API Route Debugging

```typescript
// Add request/response logging
export async function POST(request: NextRequest) {
    console.log('API Request:', {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries()),
    });

    try {
        const body = await request.json();
        console.log('Request body:', body);

        const result = await processRequest(body);
        console.log('Response:', result);

        return NextResponse.json(result);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
```

### Performance Debugging

#### Slow Database Queries

```sql
-- Check query performance in database console
EXPLAIN ANALYZE SELECT * FROM events WHERE start_date > NOW();

-- Add database indexes for better performance
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_category ON events(category);
```

#### Large Bundle Size

```bash
# Analyze bundle
npx @next/bundle-analyzer

# Check for large dependencies
npx bundlesize

# Tree-shake unused code
# Ensure imports are specific:
// Bad: import * as icons from '@phosphor-icons/react'
// Good: import { Calendar, User } from '@phosphor-icons/react/dist/ssr'
```

#### Memory Leaks

```typescript
// Check for memory leaks in useEffect
useEffect(() => {
    const interval = setInterval(() => {
        // Do something
    }, 1000);

    // Always cleanup
    return () => clearInterval(interval);
}, []);

// Monitor component renders
useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
}, []);
```

## 🚨 Error Monitoring

### Error Boundary Implementation

```typescript
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error boundary caught error:', error, errorInfo);

        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
            // logErrorToService(error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-error mb-4">
                        Something went wrong
                    </h2>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="btn-primary"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
```

### Global Error Handler

```typescript
// Add to app/layout.tsx
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        // Log to monitoring service
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        // Log to monitoring service
    });
}
```

## 🔧 Development Tools

### VS Code Extensions

```json
// .vscode/extensions.json
{
    "recommendations": [
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-typescript-next",
        "esbenp.prettier-vscode",
        "ms-vscode.vscode-eslint"
    ]
}
```

### Debug Configuration

```json
// .vscode/launch.json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Debug Next.js",
            "type": "node",
            "request": "attach",
            "port": 9229,
            "skipFiles": ["<node_internals>/**"]
        }
    ]
}
```

### Environment-Specific Debugging

#### Development

```bash
# Start with debugging
NODE_OPTIONS='--inspect' bun run dev

# Enable detailed logging
DEBUG=* bun run dev

# Check environment variables
bun run --print process.env
```

#### Production

```bash
# Check production build
bun run build
bun run start

# Monitor logs
tail -f /var/log/application.log

# Check performance
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
```

## 📊 Monitoring & Logging

### Custom Logging Utility

```typescript
enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
}

class Logger {
    private static log(level: LogLevel, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            data,
            url:
                typeof window !== 'undefined' ? window.location.href : 'server',
        };

        console[level](JSON.stringify(logEntry));

        // Send to external service in production
        if (process.env.NODE_ENV === 'production') {
            // sendToLoggingService(logEntry);
        }
    }

    static error(message: string, data?: any) {
        this.log(LogLevel.ERROR, message, data);
    }

    static warn(message: string, data?: any) {
        this.log(LogLevel.WARN, message, data);
    }

    static info(message: string, data?: any) {
        this.log(LogLevel.INFO, message, data);
    }

    static debug(message: string, data?: any) {
        if (process.env.NODE_ENV === 'development') {
            this.log(LogLevel.DEBUG, message, data);
        }
    }
}

// Usage
Logger.error('Database connection failed', { error: error.message });
Logger.info('Event created successfully', { eventId: newEvent.id });
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/sql';

export async function GET() {
    try {
        // Test database connection using shared helper
        await sql`SELECT 1`;

        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
            environment: process.env.NODE_ENV,
        };

        return NextResponse.json(health);
    } catch (error) {
        const health = {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
            error: error instanceof Error ? error.message : 'Unknown error',
        };

        return NextResponse.json(health, { status: 503 });
    }
}
```

## 🔍 Testing Debugging

### Manual Testing Checklist

```markdown
## Homepage Tests

-   [ ] Page loads without errors
-   [ ] Events section displays data
-   [ ] News section displays data
-   [ ] Navigation works
-   [ ] Mobile responsive

## Admin Panel Tests

-   [ ] Login with correct password
-   [ ] Dashboard loads
-   [ ] Can create events
-   [ ] Can edit events
-   [ ] Can delete events
-   [ ] Logout works

## Database Tests

-   [ ] Events CRUD operations
-   [ ] News CRUD operations
-   [ ] Gallery operations
-   [ ] Portrait submissions
```

### Automated Testing Setup

```bash
# Add testing dependencies
bun add -D jest @testing-library/react @testing-library/jest-dom

# Run tests
bun test

# Watch mode
bun test --watch
```

---

**Next:** [Testing](./08-testing.md)
