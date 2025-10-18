# Code Walkthrough

## 🏗️ Application Architecture

### High-Level Data Flow

```
User Request → Middleware → Page Component → Database Layer → Response
     ↓             ↓            ↓              ↓           ↓
Browser ← Middleware ← Layout ← Component ← Cache ← Database
```

### Request Lifecycle

1. **Browser Request**: User navigates to page
2. **Middleware**: Authentication check for admin routes
3. **Layout**: Root layout wraps page content
4. **Page Component**: Renders page-specific content
5. **Data Fetching**: Server components fetch data
6. **Database Query**: Cache-first database operations
7. **Response**: Rendered HTML sent to browser

## 📊 Database Layer (`lib/database.ts`)

### Connection Pattern

```typescript
// The project uses a shared `sql` helper (see `lib/sql.ts`) that wraps `pg`.
import { unstable_cache } from 'next/cache';

// Singleton connection
import { sql } from '@/lib/sql';

// Cached query pattern
export const getEvents = unstable_cache(
    async (): Promise<CalendarEvent[]> => {
        try {
            const events = await sql`
                SELECT * FROM events 
                ORDER BY start_date ASC
            `;
            return events.map(convertToCalendarEvent);
        } catch (error) {
            console.error('Error fetching events:', error);
            throw new Error('Failed to fetch events from database');
        }
    },
    ['all-events'],
    {
        tags: ['events'],
        revalidate: 3600, // 1 hour fallback
    }
);
```

### Data Transformation Pattern

```typescript
// Database record (unknown types from SQL)
interface DatabaseEvent {
    id: number;
    title: string;
    start_date: string;
    // ... other fields
}

// Application model (strongly typed)
interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    // ... other fields
}

// Converter function
function convertToCalendarEvent(
    dbEvent: Record<string, unknown>
): CalendarEvent {
    return {
        id: String(dbEvent.id),
        title: String(dbEvent.title),
        start: new Date(String(dbEvent.start_date)),
        end: new Date(String(dbEvent.end_date)),
        // Safe type conversion with fallbacks
    };
}
```

### CRUD Operations Pattern

```typescript
// CREATE
export async function createEvent(
    event: Omit<CalendarEvent, 'id'>
): Promise<CalendarEvent> {
    try {
        const result = await sql`
            INSERT INTO events (title, start_date, end_date, ...)
            VALUES (${event.title}, ${event.start.toISOString()}, ...)
            RETURNING *
        `;
        return convertToCalendarEvent(result[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        throw new Error('Failed to create event in database');
    }
}

// READ with caching
export const getEvents = unstable_cache(/* implementation above */);

// UPDATE
export async function updateEvent(
    id: string,
    updates: Partial<CalendarEvent>
): Promise<CalendarEvent> {
    // Implementation with conditional updates
}

// DELETE
export async function deleteEvent(id: string): Promise<boolean> {
    // Implementation with error handling
}
```

## 🔐 Authentication System (`lib/auth.ts`)

### Session Management

```typescript
// Simple token-based authentication
function generateSessionToken(): string {
    return Buffer.from(
        `${Date.now()}-${Math.random().toString(36).substring(2)}`
    ).toString('base64');
}

// Create session after successful login
export async function createSession(): Promise<string> {
    const token = generateSessionToken();
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true, // Security
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: 'lax', // CSRF protection
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    return token;
}
```

### Authentication Flow

```typescript
// 1. Password verification
export function verifyPassword(password: string): boolean {
    return password === ADMIN_PASSWORD;
}

// 2. Session validation
export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionToken?.value) return false;

    try {
        const decoded = Buffer.from(sessionToken.value, 'base64').toString();
        const [timestamp] = decoded.split('-');
        const tokenAge = Date.now() - parseInt(timestamp);

        return tokenAge < 7 * 24 * 60 * 60 * 1000; // 7 days
    } catch {
        return false;
    }
}

// 3. Route protection (middleware)
export function requireAuth(request: NextRequest): NextResponse | null {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionToken?.value || !isValidToken(sessionToken.value)) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return null; // Allow access
}
```

## 🎨 Component Architecture

### Component Hierarchy

```
Layout (app/layout.tsx)
├── Navigation (menubar.tsx, mobile-navbar.tsx)
├── Page Content
│   ├── Hero Section (HeroTitle.tsx)
│   ├── Features (FeatureCard.tsx)
│   ├── Events (EventsSection.tsx)
│   │   └── Event Cards (EventCard.tsx)
│   ├── News (NewsSection.tsx)
│   │   └── News Cards (NewsCard.tsx)
│   └── Community (WirSindWendessenSection.tsx)
└── Footer (Footer.tsx)
```

### Event Card Component Example

```typescript
interface EventCardProps {
    title: string;
    location: string;
    time: string;
    date: string;
    imageSrc?: string;
    imageAlt: string;
    hasImage?: boolean;
}

export default function EventCard({
    title,
    location,
    time,
    date,
    imageSrc,
    imageAlt,
    hasImage = true,
}: EventCardProps) {
    return (
        <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200">
            {hasImage && imageSrc ? (
                // Image layout with overlay
                <>
                    <div className="relative h-64 overflow-hidden">
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        {/* Content overlay */}
                    </div>
                </>
            ) : (
                // Fallback layout without image
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {/* Fallback content */}
                </div>
            )}
        </div>
    );
}
```

### Modal Pattern

```typescript
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal content */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                    {children}
                </div>
            </div>
        </div>
    );
}
```

## 🛣️ API Routes Structure

### Events API (`app/api/events/route.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getEvents, createEvent } from '@/lib/database';
import { revalidateTag } from 'next/cache';

export async function GET() {
    try {
        const events = await getEvents();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Authentication check for admin routes
        const isAuth = await isAuthenticated();
        if (!isAuth) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const eventData = await request.json();
        const newEvent = await createEvent(eventData);

        // Invalidate cache
        revalidateTag('events');

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}
```

### Admin Authentication API (`app/api/admin/login/route.ts`)

```typescript
export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!verifyPassword(password)) {
            return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
            );
        }

        await createSession();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
```

## 📱 Page Components

### Homepage (`app/page.tsx`)

```typescript
import { getUpcomingEvents, getRecentNews } from '@/lib/database';
import HeroTitle from './components/HeroTitle';
import EventsSection from './components/EventsSection';
import NewsSection from './components/NewsSection';

export default async function HomePage() {
    // Server-side data fetching
    const [upcomingEvents, recentNews] = await Promise.all([
        getUpcomingEvents(6),
        getRecentNews(4),
    ]);

    return (
        <main className="min-h-screen">
            {/* Hero section */}
            <HeroTitle />

            {/* Feature sections */}
            <FullWidthServicesSection />

            {/* Dynamic content */}
            <EventsSection events={upcomingEvents} />
            <NewsSection news={recentNews} />

            {/* Community sections */}
            <WirSindWendessenSection />
            <PlaygroundsSection />
        </main>
    );
}
```

### Admin Dashboard (`app/admin/dashboard/AdminDashboard.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        events: 0,
        news: 0,
        portraits: 0,
    });
    const router = useRouter();

    useEffect(() => {
        // Check authentication status
        fetch('/api/admin/status')
            .then((res) => {
                if (!res.ok) {
                    router.push('/admin/login');
                    return;
                }
                return res.json();
            })
            .then((data) => {
                if (data) setStats(data);
            })
            .catch(() => {
                router.push('/admin/login');
            });
    }, [router]);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-primary mb-8">
                Admin Dashboard
            </h1>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Events" value={stats.events} />
                <StatCard title="News" value={stats.news} />
                <StatCard title="Portraits" value={stats.portraits} />
            </div>

            {/* Quick actions */}
            <QuickActions />
        </div>
    );
}
```

## 🔄 Data Flow Patterns

### Server Component Data Flow

```typescript
// 1. Page component (Server Component)
export default async function EventsPage() {
    // Direct database call on server
    const events = await getEvents();

    return <EventsList events={events} />;
}

// 2. Database layer with caching
export const getEvents = unstable_cache(
    async () => {
        const events = await sql`SELECT * FROM events`;
        return events.map(convertToCalendarEvent);
    },
    ['events'],
    { tags: ['events'], revalidate: 3600 }
);

// 3. Cache invalidation on mutations
export async function createEvent(data) {
    const result = await sql`INSERT INTO events...`;
    revalidateTag('events'); // Clear cache
    return result;
}
```

### Client Component Data Flow

```typescript
// 1. Client component with state
'use client';

export default function EventForm() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Fetch data via API
    useEffect(() => {
        fetch('/api/events')
            .then((res) => res.json())
            .then((data) => {
                setEvents(data);
                setLoading(false);
            });
    }, []);

    // 3. Mutation via API
    const handleSubmit = async (eventData) => {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
        });

        if (response.ok) {
            // Refresh data
            const newEvent = await response.json();
            setEvents((prev) => [...prev, newEvent]);
        }
    };

    return <form onSubmit={handleSubmit}>...</form>;
}
```

## 🎯 Key Design Patterns

### 1. Repository Pattern

```typescript
// Database layer abstraction
class EventRepository {
    async findAll(): Promise<CalendarEvent[]> {
        return getEvents();
    }

    async findById(id: string): Promise<CalendarEvent | null> {
        return getEventById(id);
    }

    async create(data: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
        return createEvent(data);
    }
}
```

### 2. Factory Pattern

```typescript
// Component factory for different card types
function createCard(type: 'event' | 'news' | 'feature', data: any) {
    switch (type) {
        case 'event':
            return <EventCard {...data} />;
        case 'news':
            return <NewsCard {...data} />;
        case 'feature':
            return <FeatureCard {...data} />;
        default:
            throw new Error(`Unknown card type: ${type}`);
    }
}
```

### 3. Provider Pattern

```typescript
// Authentication context
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}
```

### 4. Hook Pattern

```typescript
// Custom hook for admin authentication
export function useAdminAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/admin/status')
            .then((res) => {
                setIsAuthenticated(res.ok);
                if (!res.ok) {
                    router.push('/admin/login');
                }
            })
            .catch(() => {
                setIsAuthenticated(false);
                router.push('/admin/login');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [router]);

    return { isAuthenticated, loading };
}
```

## 🔧 Utility Functions

### Date Formatting

```typescript
// German date formatting utility
export function formatGermanDate(date: Date): string {
    return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function formatGermanTime(date: Date): string {
    return date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
    });
}
```

### Image Optimization

```typescript
// Image utility for responsive images
export function getOptimizedImageProps(src: string, alt: string) {
    return {
        src,
        alt,
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        quality: 85,
        priority: false,
        placeholder: 'blur' as const,
    };
}
```

### Error Handling

```typescript
// Centralized error handling
export function handleApiError(error: unknown): {
    message: string;
    status: number;
} {
    if (error instanceof Error) {
        return {
            message: error.message,
            status: 500,
        };
    }

    return {
        message: 'An unexpected error occurred',
        status: 500,
    };
}
```

---

**Next:** [Debugging Guide](./07-debugging-guide.md)
