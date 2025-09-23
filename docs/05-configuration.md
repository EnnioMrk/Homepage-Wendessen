# Configuration

## 🔧 Environment Variables

### Required Environment Variables

#### `.env.local` (Development)

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@ep-example.us-east-1.aws.neon.tech/neondb"

# Admin Authentication
ADMIN_PASSWORD="your_secure_admin_password"
```

#### `.env.production` (Production)

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@ep-example.us-east-1.aws.neon.tech/neondb"

# Admin Authentication
ADMIN_PASSWORD="production_secure_password"

# Analytics (Optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your_analytics_id"

# Security Settings
NODE_ENV="production"
```

### Environment Variable Details

#### `DATABASE_URL`

-   **Purpose**: PostgreSQL connection string for Neon database
-   **Format**: `postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&...]`
-   **Required**: Yes
-   **Example**: `postgresql://user:pass@ep-example.us-east-1.aws.neon.tech/neondb`

#### `ADMIN_PASSWORD`

-   **Purpose**: Password for admin panel authentication
-   **Security**: Should be strong, unique password
-   **Required**: Yes
-   **Recommendation**: Use password manager generated password

#### `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`

-   **Purpose**: Vercel Analytics tracking ID
-   **Required**: No (optional for analytics)
-   **Public**: Yes (prefixed with NEXT*PUBLIC*)

### Environment File Structure

```
project-root/
├── .env.local          # Local development (git-ignored)
├── .env.example        # Template file (committed)
├── .env.production     # Production (deployment only)
└── .gitignore          # Excludes .env.local
```

## ⚙️ Configuration Files

### Next.js Configuration (`next.config.ts`)

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Image optimization for external sources
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
                port: '',
                pathname: '/**',
            },
        ],
    },

    // Optional: Additional configurations
    experimental: {
        // Enable if using React 19 features
        reactCompiler: false,
    },

    // Performance optimizations
    compress: true,
    poweredByHeader: false,

    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
```

### Tailwind Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Village-themed color palette
                primary: {
                    DEFAULT: '#7FB069', // Fresh green
                    light: '#9BC88A',
                    dark: '#4D7639',
                    foreground: '#FFFFFF',
                },
                secondary: {
                    DEFAULT: '#2B5F75', // Deep blue-gray
                    light: '#3D7A94',
                    dark: '#1A4A5C',
                    foreground: '#FFFFFF',
                },
                accent: {
                    DEFAULT: '#E8B96C', // Warm gold
                    light: '#F5D4A3',
                    dark: '#D4A04A',
                    foreground: '#1A1A1A',
                },

                // Semantic colors
                background: {
                    DEFAULT: '#FFFFFF',
                    secondary: '#F8F9FA',
                    muted: '#F3F4F6',
                },
                foreground: {
                    DEFAULT: '#1A1A1A',
                    muted: '#4B5563',
                    subtle: '#6B7280',
                },
                border: {
                    DEFAULT: '#E5E7EB',
                    strong: '#D1D5DB',
                    subtle: '#F3F4F6',
                },

                // Status colors
                success: {
                    DEFAULT: '#4CAF50',
                    light: '#81C784',
                    dark: '#388E3C',
                },
                warning: {
                    DEFAULT: '#FFC107',
                    light: '#FFD54F',
                    dark: '#FFA000',
                },
                error: {
                    DEFAULT: '#F44336',
                    light: '#E57373',
                    dark: '#D32F2F',
                },
            },

            // Custom border radius
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },

            // Custom spacing for consistent design
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
            },

            // Custom typography
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
```

### TypeScript Configuration (`tsconfig.json`)

```json
{
    "compilerOptions": {
        "lib": ["dom", "dom.iterable", "es6"],
        "allowJs": true,
        "skipLibCheck": true,
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "module": "esnext",
        "moduleResolution": "bundler",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "jsx": "preserve",
        "incremental": true,
        "plugins": [
            {
                "name": "next"
            }
        ],
        "baseUrl": ".",
        "paths": {
            "@/*": ["./*"]
        },
        "forceConsistentCasingInFileNames": true
    },
    "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    "exclude": ["node_modules"]
}
```

### ESLint Configuration (`eslint.config.mjs`)

```javascript
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('next/core-web-vitals'),
    {
        rules: {
            // Custom rules for the project
            '@next/next/no-html-link-for-pages': 'off',
            'react/no-unescaped-entities': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },
];

export default eslintConfig;
```

### PostCSS Configuration (`postcss.config.mjs`)

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};

export default config;
```

## 🛡️ Middleware Configuration (`middleware.ts`)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export function middleware(request: NextRequest) {
    // Protect admin routes except login
    if (
        request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login')
    ) {
        const authResult = requireAuth(request);
        if (authResult) {
            return authResult;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
```

## 🗄️ Database Configuration

### Connection Setup

Database connection is configured in `lib/database.ts`:

```typescript
import { neon } from '@neondatabase/serverless';

// Connection instance
const sql = neon(process.env.DATABASE_URL!);

// Connection pooling and caching
export const getEvents = unstable_cache(
    async (): Promise<CalendarEvent[]> => {
        // Database operations
    },
    ['all-events'],
    {
        tags: ['events'],
        revalidate: 3600, // 1 hour cache
    }
);
```

### Caching Strategy

```typescript
// Tag-based cache invalidation
export const config = {
    revalidate: 3600, // 1 hour fallback
    tags: ['events', 'news'], // Cache tags
};

// Manual cache invalidation
revalidateTag('events');
revalidatePath('/');
```

## 🎨 Design System Configuration

### Color Categories

```javascript
// Primary: Village identity
primary: '#7FB069'          // Nature, growth, community

// Secondary: Stability
secondary: '#2B5F75'        // Trust, reliability, official

// Accent: Warmth
accent: '#E8B96C'           // Friendliness, welcoming

// Event categories
eventColors: {
    sitzung: 'blue',        // Official meetings
    veranstaltung: 'green', // Community events
    sport: 'orange',        // Sports activities
    kultur: 'purple',       // Cultural events
    notfall: 'red',         // Emergency/important
    sonstiges: 'gray'       // Other/miscellaneous
}
```

### Component Styling Patterns

```css
/* Card components */
.card-base {
    @apply rounded-2xl shadow-2xl hover:shadow-3xl;
    @apply transition-all duration-500;
    @apply transform hover:-translate-y-2;
    @apply border border-gray-200;
}

/* Button variants */
.btn-primary {
    @apply bg-primary text-white hover:bg-primary-dark;
    @apply px-6 py-3 rounded-lg font-semibold;
    @apply transition-colors duration-200;
}

/* Responsive patterns */
.container-responsive {
    @apply px-4 sm:px-6 lg:px-8;
    @apply max-w-7xl mx-auto;
}
```

## 📱 Responsive Configuration

### Breakpoint Strategy

```javascript
// Tailwind breakpoints
screens: {
    'sm': '640px',   // Mobile landscape
    'md': '768px',   // Tablet portrait
    'lg': '1024px',  // Tablet landscape / small desktop
    'xl': '1280px',  // Desktop
    '2xl': '1536px'  // Large desktop
}

// Usage patterns
'hidden md:block'    // Hide on mobile, show on tablet+
'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'  // Responsive grid
'text-lg md:text-xl lg:text-2xl'  // Responsive typography
```

### Image Optimization

```typescript
// Next.js Image component configuration
<Image
    src="/path/to/image.jpg"
    alt="Description"
    width={800}
    height={600}
    priority={false} // Only for above-fold images
    placeholder="blur" // Loading state
    blurDataURL="data:..." // Base64 blur
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## 🔐 Security Configuration

### Authentication Settings

```typescript
// Session configuration
const SESSION_CONFIG = {
    cookieName: 'admin-session',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true, // Security
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // CSRF protection
};

// Password requirements
const ADMIN_REQUIREMENTS = {
    minLength: 12, // Minimum password length
    requireSpecialChars: true, // Special characters
    requireNumbers: true, // Numeric characters
    requireUppercase: true, // Capital letters
};
```

### Content Security Policy

```typescript
// Headers configuration in next.config.ts
const securityHeaders = [
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY',
    },
    {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
    },
];
```

## 🚀 Performance Configuration

### Build Optimization

```javascript
// next.config.ts optimizations
const nextConfig = {
    compress: true, // Gzip compression
    poweredByHeader: false, // Remove X-Powered-By header
    generateEtags: true, // HTTP caching

    // Bundle optimization
    experimental: {
        optimizeCss: true, // CSS optimization
        scrollRestoration: true, // Preserve scroll position
    },
};
```

### Cache Configuration

```typescript
// Database cache settings
const CACHE_CONFIG = {
    events: {
        duration: 3600, // 1 hour
        tags: ['events'],
        revalidateOnMutate: true,
    },
    news: {
        duration: 1800, // 30 minutes
        tags: ['news'],
        revalidateOnMutate: true,
    },
    contacts: {
        duration: 7200, // 2 hours (changes less frequently)
        tags: ['contacts'],
        revalidateOnMutate: false,
    },
};
```

---

**Next:** [Code Walkthrough](./06-code-walkthrough.md)
