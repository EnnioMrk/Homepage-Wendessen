# Extending the Project

## 🎯 Development Guidelines

### Code Style & Conventions

#### TypeScript Standards

```typescript
// Use explicit types for function parameters and returns
export async function createEvent(
    event: Omit<CalendarEvent, 'id'>
): Promise<CalendarEvent> {
    // Implementation
}

// Use interfaces for object types
interface EventFormData {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    category: EventCategory;
}

// Use enums for fixed sets of values
enum EventCategory {
    SITZUNG = 'sitzung',
    VERANSTALTUNG = 'veranstaltung',
    SPORT = 'sport',
    KULTUR = 'kultur',
    NOTFALL = 'notfall',
    SONSTIGES = 'sonstiges',
}
```

> ℹ️ Import icon components from `@phosphor-icons/react/dist/ssr` to guarantee server components render safely in the App Router.

#### Component Patterns

```typescript
// Use consistent prop interface naming
interface ComponentNameProps {
    // Required props first
    title: string;
    children: React.ReactNode;

    // Optional props after
    className?: string;
    onClick?: () => void;
}

// Use default parameters for optional props
export default function ComponentName({
    title,
    children,
    className = '',
    onClick,
}: ComponentNameProps) {
    return (
        <div className={`base-styles ${className}`}>
            <h2>{title}</h2>
            {children}
        </div>
    );
}
```

#### File Naming Conventions

```bash
# Components: PascalCase
EventCard.tsx
NewsModal.tsx
AdminDashboard.tsx

# Utilities: camelCase
database.ts
event-utils.ts
image-utils.ts

# Pages: lowercase with hyphens
was-steht-an/
wohnen-bauen/
```

### Database Modifications

#### Adding New Tables

```typescript
// 1. Create migration script
// scripts/migrations/003_add_comments_table.ts
import { neon } from '@neondatabase/serverless';

async function createCommentsTable() {
    const sql = neon(process.env.DATABASE_URL!);

    try {
        await sql`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
                author_name VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                approved BOOLEAN DEFAULT FALSE
            );
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_comments_event_id 
            ON comments(event_id);
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_comments_approved 
            ON comments(approved);
        `;

        console.log('Comments table created successfully');
    } catch (error) {
        console.error('Failed to create comments table:', error);
        throw error;
    }
}

createCommentsTable();
```

#### Adding Database Functions

```typescript
// 2. Add TypeScript interfaces in lib/database.ts
export interface DatabaseComment {
    id: number;
    event_id: number;
    author_name: string;
    content: string;
    created_at: string;
    approved: boolean;
}

export interface Comment {
    id: string;
    eventId: string;
    authorName: string;
    content: string;
    createdAt: Date;
    approved: boolean;
}

// 3. Add converter function
function convertToComment(dbComment: Record<string, unknown>): Comment {
    return {
        id: String(dbComment.id),
        eventId: String(dbComment.event_id),
        authorName: String(dbComment.author_name),
        content: String(dbComment.content),
        createdAt: new Date(String(dbComment.created_at)),
        approved: Boolean(dbComment.approved),
    };
}

// 4. Add CRUD operations
export async function getCommentsByEventId(
    eventId: string
): Promise<Comment[]> {
    try {
        const comments = await sql`
            SELECT * FROM comments 
            WHERE event_id = ${eventId} AND approved = true
            ORDER BY created_at DESC
        `;

        return comments.map(convertToComment);
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw new Error('Failed to fetch comments from database');
    }
}

export async function createComment(
    comment: Omit<Comment, 'id' | 'createdAt'>
): Promise<Comment> {
    try {
        const result = await sql`
            INSERT INTO comments (event_id, author_name, content)
            VALUES (${comment.eventId}, ${comment.authorName}, ${comment.content})
            RETURNING *
        `;

        return convertToComment(result[0]);
    } catch (error) {
        console.error('Error creating comment:', error);
        throw new Error('Failed to create comment in database');
    }
}
```

### Adding New Features

#### Example: Event Comments System

#### 1. Create API Routes

```typescript
// app/api/events/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByEventId, createComment } from '@/lib/database';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const comments = await getCommentsByEventId(params.id);
        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { authorName, content } = await request.json();

        const comment = await createComment({
            eventId: params.id,
            authorName,
            content,
            approved: false, // Requires admin approval
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}
```

#### 2. Create React Components

```typescript
// app/components/CommentForm.tsx
'use client';

import { useState } from 'react';

interface CommentFormProps {
    eventId: string;
    onCommentAdded: () => void;
}

export default function CommentForm({
    eventId,
    onCommentAdded,
}: CommentFormProps) {
    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/events/${eventId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ authorName, content }),
            });

            if (response.ok) {
                setAuthorName('');
                setContent('');
                onCommentAdded();
            }
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Name
                </label>
                <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Kommentar
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary disabled:opacity-50"
            >
                {isSubmitting ? 'Wird gesendet...' : 'Kommentar senden'}
            </button>
        </form>
    );
}
```

#### 3. Add Admin Management

```typescript
// app/admin/comments/AdminComments.tsx
'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/lib/database';

export default function AdminComments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const response = await fetch('/api/admin/comments');
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const approveComment = async (commentId: string) => {
        try {
            await fetch(`/api/admin/comments/${commentId}/approve`, {
                method: 'POST',
            });
            fetchComments(); // Refresh list
        } catch (error) {
            console.error('Failed to approve comment:', error);
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            await fetch(`/api/admin/comments/${commentId}`, {
                method: 'DELETE',
            });
            fetchComments(); // Refresh list
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    if (loading) return <div>Loading comments...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">
                Kommentare verwalten
            </h2>

            {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium">{comment.authorName}</p>
                            <p className="text-gray-600">{comment.content}</p>
                            <p className="text-sm text-gray-400">
                                {comment.createdAt.toLocaleDateString('de-DE')}
                            </p>
                        </div>

                        <div className="space-x-2">
                            {!comment.approved && (
                                <button
                                    onClick={() => approveComment(comment.id)}
                                    className="btn-primary text-sm"
                                >
                                    Freigeben
                                </button>
                            )}
                            <button
                                onClick={() => deleteComment(comment.id)}
                                className="btn-error text-sm"
                            >
                                Löschen
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
```

### Adding New Pages

#### 1. Create Page Structure

```bash
# Create new feature directory
mkdir -p app/vereinsleben/sportverein

# Create page file
touch app/vereinsleben/sportverein/page.tsx

# Create layout if needed
touch app/vereinsleben/layout.tsx
```

#### 2. Implement Page Component

```typescript
// app/vereinsleben/sportverein/page.tsx
import { Metadata } from 'next';
import BackButton from '@/app/components/BackButton';

export const metadata: Metadata = {
    title: 'Sportverein Wendessen',
    description: 'Informationen über den Sportverein Wendessen',
};

export default function SportvereinPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-light to-secondary-light">
            <div className="container mx-auto px-4 py-8">
                <BackButton />

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-8 text-center">
                        Sportverein Wendessen
                    </h1>

                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-primary mb-4">
                                Über uns
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Der Sportverein Wendessen wurde 1950 gegründet
                                und ist ein wichtiger Teil der
                                Dorfgemeinschaft...
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-primary mb-4">
                                Abteilungen
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold text-secondary mb-2">
                                        Fußball
                                    </h3>
                                    <p className="text-gray-600">
                                        Training jeden Dienstag 18:30 Uhr
                                    </p>
                                </div>
                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold text-secondary mb-2">
                                        Turnen
                                    </h3>
                                    <p className="text-gray-600">
                                        Training jeden Donnerstag 19:00 Uhr
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
```

#### 3. Add Navigation Link

```typescript
// app/components/menubar.tsx
const menuItems = [
    // ... existing items
    {
        label: 'Vereinsleben',
        submenu: [
            { label: 'Feuerwehr', href: '/dorfleben/vereine/feuerwehr' },
            { label: 'Sportverein', href: '/vereinsleben/sportverein' }, // Add new link
            // ... other items
        ],
    },
];
```

### Component Development

#### Creating Reusable Components

#### 1. Base Component Template

````typescript
// app/components/FeatureCard.tsx
import { ElementType, ReactNode } from 'react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: ElementType<{ className?: string }>;
    href?: string;
    onClick?: () => void;
    children?: ReactNode;
    variant?: 'default' | 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
}

export default function FeatureCard({
    title,
    description,
    icon: Icon,
    href,
    onClick,
    children,
    variant = 'default',
    size = 'md'
}: FeatureCardProps) {
    const variantClasses = {
        default: 'bg-white border-gray-200 hover:border-primary',
        primary: 'bg-primary text-white border-primary-dark',
        secondary: 'bg-secondary text-white border-secondary-dark'
    };

    const sizeClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    const Component = href ? 'a' : 'div';
    const componentProps = {
        ...(href && { href }),
        ...(onClick && { onClick }),
        className: `
            group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl
            transition-all duration-300 transform hover:-translate-y-1 border-2
            ${variantClasses[variant]} ${sizeClasses[size]}
        `.trim()
    };

    return (
        <Component {...componentProps}>
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <Icon className="h-8 w-8" />
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                        {title}
                    </h3>
                    <p className="opacity-90">{description}</p>
                    {children && <div className="mt-4">{children}</div>}
                </div>
            </div>

    // Usage
    // import { UsersThree } from '@phosphor-icons/react/dist/ssr';
    //
    // <FeatureCard
    //     title="Engagierte Wendesser"
    //     description="Eine starke Gemeinschaft mit vielen Initiativen"
    //     icon={UsersThree}
    // />
        </Component>
    );
}\n```\n\n#### 2. Hook Development\n```typescript\n// lib/hooks/useLocalStorage.ts\nimport { useState, useEffect } from 'react';\n\nexport function useLocalStorage<T>(\n    key: string,\n    initialValue: T\n): [T, (value: T) => void] {\n    const [storedValue, setStoredValue] = useState<T>(initialValue);\n    \n    useEffect(() => {\n        try {\n            const item = window.localStorage.getItem(key);\n            if (item) {\n                setStoredValue(JSON.parse(item));\n            }\n        } catch (error) {\n            console.error(`Error reading localStorage key \"${key}\":`, error);\n        }\n    }, [key]);\n    \n    const setValue = (value: T) => {\n        try {\n            setStoredValue(value);\n            window.localStorage.setItem(key, JSON.stringify(value));\n        } catch (error) {\n            console.error(`Error setting localStorage key \"${key}\":`, error);\n        }\n    };\n    \n    return [storedValue, setValue];\n}\n\n// Usage in components\nexport default function SomeComponent() {\n    const [preferences, setPreferences] = useLocalStorage('user-preferences', {\n        theme: 'light',\n        language: 'de'\n    });\n    \n    return (\n        <div>\n            <button onClick={() => setPreferences({...preferences, theme: 'dark'})}>\n                Toggle Theme\n            </button>\n        </div>\n    );\n}\n```\n\n### Performance Optimization\n\n#### Image Optimization\n```typescript\n// app/components/OptimizedImage.tsx\nimport Image from 'next/image';\nimport { useState } from 'react';\n\ninterface OptimizedImageProps {\n    src: string;\n    alt: string;\n    width?: number;\n    height?: number;\n    className?: string;\n    priority?: boolean;\n}\n\nexport default function OptimizedImage({\n    src,\n    alt,\n    width,\n    height,\n    className = '',\n    priority = false\n}: OptimizedImageProps) {\n    const [isLoading, setIsLoading] = useState(true);\n    const [hasError, setHasError] = useState(false);\n    \n    return (\n        <div className={`relative overflow-hidden ${className}`}>\n            {isLoading && (\n                <div className=\"absolute inset-0 bg-gray-200 animate-pulse\" />\n            )}\n            \n            {hasError ? (\n                <div className=\"absolute inset-0 bg-gray-100 flex items-center justify-center\">\n                    <span className=\"text-gray-400\">Bild nicht verfügbar</span>\n                </div>\n            ) : (\n                <Image\n                    src={src}\n                    alt={alt}\n                    width={width}\n                    height={height}\n                    priority={priority}\n                    className={`transition-opacity duration-300 ${\n                        isLoading ? 'opacity-0' : 'opacity-100'\n                    }`}\n                    onLoadingComplete={() => setIsLoading(false)}\n                    onError={() => {\n                        setIsLoading(false);\n                        setHasError(true);\n                    }}\n                    sizes=\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\"\n                />\n            )}\n        </div>\n    );\n}\n```\n\n#### Lazy Loading Components\n```typescript\n// app/components/LazySection.tsx\nimport { lazy, Suspense } from 'react';\nimport LoadingSpinner from './LoadingSpinner';\n\n// Lazy load heavy components\nconst HeavyGallery = lazy(() => import('./HeavyGallery'));\nconst ComplexChart = lazy(() => import('./ComplexChart'));\n\ninterface LazySectionProps {\n    type: 'gallery' | 'chart';\n    fallback?: React.ReactNode;\n}\n\nexport default function LazySection({ \n    type, \n    fallback = <LoadingSpinner /> \n}: LazySectionProps) {\n    const ComponentMap = {\n        gallery: HeavyGallery,\n        chart: ComplexChart\n    };\n    \n    const Component = ComponentMap[type];\n    \n    return (\n        <Suspense fallback={fallback}>\n            <Component />\n        </Suspense>\n    );\n}\n```\n\n### Testing New Features\n\n#### Component Testing Template\n```typescript\n// __tests__/components/NewComponent.test.tsx\nimport { render, screen, fireEvent } from '@testing-library/react';\nimport NewComponent from '@/app/components/NewComponent';\n\ndescribe('NewComponent', () => {\n    const defaultProps = {\n        title: 'Test Title',\n        onAction: jest.fn()\n    };\n    \n    beforeEach(() => {\n        jest.clearAllMocks();\n    });\n    \n    it('renders correctly', () => {\n        render(<NewComponent {...defaultProps} />);\n        \n        expect(screen.getByText('Test Title')).toBeInTheDocument();\n    });\n    \n    it('handles user interactions', () => {\n        render(<NewComponent {...defaultProps} />);\n        \n        const button = screen.getByRole('button');\n        fireEvent.click(button);\n        \n        expect(defaultProps.onAction).toHaveBeenCalledTimes(1);\n    });\n    \n    it('handles edge cases', () => {\n        render(<NewComponent {...defaultProps} title=\"\" />);\n        \n        // Test behavior with empty title\n        expect(screen.queryByText('Test Title')).not.toBeInTheDocument();\n    });\n});\n```\n\n### Documentation Updates\n\nWhen adding new features:\n\n1. **Update API Documentation** (if applicable)\n2. **Add Component Documentation**\n```typescript\n/**\n * EventCard component displays event information in a card format\n * \n * @param title - The event title\n * @param location - Event location\n * @param time - Event time in HH:MM format\n * @param date - Event date in DD.MM.YYYY format\n * @param imageSrc - Optional image URL\n * @param hasImage - Whether to show image layout\n * \n * @example\n * ```tsx\n * <EventCard \n *   title=\"Dorffest\" \n *   location=\"Dorfplatz\" \n *   time=\"14:00\" \n *   date=\"25.09.2025\"\n *   imageSrc=\"/images/dorffest.jpg\"\n * />\n * ```\n */\n```\n\n3. **Update README if needed**\n4. **Add to Storybook** (if using)\n\n### Security Considerations\n\n#### Input Validation\n```typescript\n// lib/validation.ts\nimport { z } from 'zod';\n\nexport const EventSchema = z.object({\n    title: z.string().min(1).max(255),\n    description: z.string().max(1000).optional(),\n    startDate: z.date(),\n    endDate: z.date(),\n    location: z.string().max(255).optional(),\n    category: z.enum(['sitzung', 'veranstaltung', 'sport', 'kultur', 'notfall', 'sonstiges'])\n});\n\n// Use in API routes\nexport async function POST(request: NextRequest) {\n    try {\n        const body = await request.json();\n        const validatedData = EventSchema.parse(body);\n        \n        // Proceed with validated data\n        const event = await createEvent(validatedData);\n        return NextResponse.json(event);\n    } catch (error) {\n        if (error instanceof z.ZodError) {\n            return NextResponse.json(\n                { error: 'Validation failed', details: error.errors },\n                { status: 400 }\n            );\n        }\n        // Handle other errors\n    }\n}\n```\n\n#### SQL Injection Prevention\n```typescript\n// Always use parameterized queries with Neon\n// Good:\nconst events = await sql`\n    SELECT * FROM events \n    WHERE category = ${userCategory} \n    AND start_date > ${userDate}\n`;\n\n// Bad - Never do this:\n// const events = await sql`\n//     SELECT * FROM events \n//     WHERE category = '${userCategory}'\n// `;\n```\n\n---\n\n**Next:** [API Documentation](./11-api-documentation.md)", "oldString": ""}]
````
