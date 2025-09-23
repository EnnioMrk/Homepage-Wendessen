# Project Structure

## 📁 Directory Overview

```
Homepage-Wendessen/
├── 📁 app/                    # Next.js App Router directory
├── 📁 docs/                   # Project documentation
├── 📁 lib/                    # Shared utilities and configurations
├── 📁 public/                 # Static assets
├── 📁 scripts/                # Database and setup scripts
├── 📄 package.json            # Dependencies and scripts
├── 📄 next.config.ts          # Next.js configuration
├── 📄 tailwind.config.js      # Tailwind CSS configuration
├── 📄 middleware.ts           # Next.js middleware for auth
└── 📄 tsconfig.json           # TypeScript configuration
```

## 🎯 Core Directories

### `/app` - Next.js App Router

```
app/
├── 📄 layout.tsx              # Root layout component
├── 📄 page.tsx                # Homepage
├── 📄 globals.css             # Global styles
├── 📄 not-found.tsx           # 404 page
├── 📁 admin/                  # Admin panel pages
├── 📁 api/                    # API routes
├── 📁 components/             # Reusable UI components
└── 📁 [feature-pages]/        # Feature-specific pages
```

#### Admin Panel Structure

```
app/admin/
├── 📄 page.tsx                # Admin redirect page
├── 📁 dashboard/              # Main admin dashboard
├── 📁 events/                 # Event management
├── 📁 gallery/                # Gallery management
├── 📁 login/                  # Authentication
├── 📁 news/                   # News management
└── 📁 portraits/              # Portrait management
```

#### API Routes Structure

```
app/api/
├── 📁 admin/                  # Admin-only endpoints
│   ├── 📁 gallery/            # Gallery CRUD operations
│   ├── 📁 login/              # Authentication endpoints
│   ├── 📁 logout/             # Session management
│   ├── 📁 news/               # News CRUD operations
│   ├── 📁 portraits/          # Portrait management
│   └── 📁 status/             # Admin status check
├── 📁 events/                 # Public event endpoints
│   ├── 📄 route.ts            # Events CRUD
│   └── 📁 [id]/               # Individual event operations
└── 📁 portraits/              # Public portrait endpoints
    ├── 📄 route.ts            # Portrait submissions
    └── 📁 approved/           # Approved portraits
```

#### Components Directory

```
app/components/
├── 📄 BackButton.tsx          # Navigation component
├── 📄 BackgroundElements.tsx  # Decorative elements
├── 📄 ContactPersonCard.tsx   # Contact display
├── 📄 EventCard.tsx           # Event display component
├── 📄 EventModal.tsx          # Event detail modal
├── 📄 EventsSection.tsx       # Events list section
├── 📄 FeatureCard.tsx         # Feature showcase
├── 📄 Footer.tsx              # Site footer
├── 📄 HeroTitle.tsx           # Homepage hero
├── 📄 HomeBanner.tsx          # Homepage banner
├── 📄 ImagePicker.tsx         # Image upload component
├── 📄 LoadingSpinner.tsx      # Loading indicator
├── 📄 NewsCard.tsx            # News display component
├── 📄 NewsModal.tsx           # News detail modal
├── 📄 NewsSection.tsx         # News list section
├── 📄 OptimizedImage.tsx      # Image optimization wrapper
├── 📄 OrtsratMemberCard.tsx   # Council member display
├── 📄 PlaygroundsSection.tsx  # Playground information
├── 📄 PortraitSubmissionModal.tsx # Portrait submission
├── 📄 WirSindWendessenSection.tsx # Community section
├── 📄 WirWendesserContent.tsx # Community content
├── 📄 menubar.tsx             # Desktop navigation
└── 📄 mobile-navbar.tsx       # Mobile navigation
```

### `/lib` - Shared Libraries

```
lib/
├── 📄 auth.ts                 # Authentication utilities
├── 📄 blob-utils.ts           # File upload utilities
├── 📄 database.ts             # Database functions and types
├── 📄 event-utils.ts          # Event-related utilities
├── 📄 importance-utils.ts     # Contact importance scoring
├── 📄 news-utils.ts           # News-related utilities
├── 📄 portrait-config.ts      # Portrait configuration
├── 📄 useAdminAuth.ts         # Admin authentication hook
├── 📄 utils.ts                # General utilities
├── 📄 contact-data.ts         # Contact management
├── 📄 image-utils.ts          # Image processing
└── 📄 combined-contacts.json  # Contact data file
```

### `/public` - Static Assets

```
public/
├── 📁 images/                 # Image assets
│   ├── 📁 Features/           # Feature showcase images
│   ├── 📁 Ortsrat/            # Council member photos
│   └── 📁 Vereinsleben/       # Club and community images
└── 📁 pdfs/                   # PDF documents
```

### `/scripts` - Database & Setup Scripts

```
scripts/
├── 📄 setup-database.ts      # Main database initialization
├── 📄 create-gallery-table.ts # Gallery table setup
├── 📄 setup-contacts.ts      # Contact data initialization
├── 📄 setup-portraits-table.ts # Portrait table setup
├── 📄 add-events-image-column.ts # Schema migration
├── 📄 add-importance-to-contacts.ts # Contact enhancement
└── 📄 test-portrait-cleanup.ts # Portrait cleanup testing
```

## 🔍 Key Files Explained

### Configuration Files

#### `package.json`

Defines project dependencies, scripts, and metadata:

```json
{
    "scripts": {
        "dev": "bun run --bun next dev --turbopack",
        "build": "bun run --bun next build",
        "setup-gallery": "bun run --bun scripts/create-gallery-table.ts"
    }
}
```

#### `next.config.ts`

Next.js configuration for image optimization:

```typescript
const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
            },
        ],
    },
};
```

#### `tailwind.config.js`

Tailwind CSS customization with village-themed colors:

```javascript
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: '#7FB069', // Fresh green
                secondary: '#2B5F75', // Deep blue-gray
                accent: '#E8B96C', // Warm gold
            },
        },
    },
};
```

#### `middleware.ts`

Route protection for admin areas:

```typescript
export function middleware(request: NextRequest) {
    if (
        request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login')
    ) {
        return requireAuth(request);
    }
}
```

### Core Application Files

#### `app/layout.tsx`

Root layout with global providers and metadata:

-   Global CSS imports
-   Font configuration
-   Analytics integration
-   Metadata configuration

#### `app/page.tsx`

Homepage component structure:

-   Hero section
-   Featured content
-   Event previews
-   News highlights
-   Community sections

#### `lib/database.ts`

Central database layer with:

-   Database connection setup
-   Type definitions for all models
-   CRUD operations for each entity
-   Caching with `unstable_cache`
-   Data transformation functions

## 🎨 Component Patterns

### Component Categories

#### 1. Layout Components

-   **Purpose**: Structure and navigation
-   **Examples**: `menubar.tsx`, `Footer.tsx`, `mobile-navbar.tsx`
-   **Pattern**: Consistent styling, responsive design

#### 2. Content Components

-   **Purpose**: Display data from database
-   **Examples**: `EventCard.tsx`, `NewsCard.tsx`, `ContactPersonCard.tsx`
-   **Pattern**: Props-based configuration, hover effects, responsive

#### 3. Modal Components

-   **Purpose**: Detailed views and forms
-   **Examples**: `EventModal.tsx`, `NewsModal.tsx`, `PortraitSubmissionModal.tsx`
-   **Pattern**: Overlay, close handlers, form validation

#### 4. Admin Components

-   **Purpose**: Content management
-   **Location**: `app/admin/*/` directories
-   **Pattern**: CRUD operations, authentication required

### Styling Conventions

#### Color System

```typescript
// Primary: Village green theme
primary: '#7FB069'; // Buttons, accents
secondary: '#2B5F75'; // Headers, navigation
accent: '#E8B96C'; // Highlights, call-to-action

// Semantic colors
success: '#4CAF50'; // Success states
warning: '#FFC107'; // Warning states
error: '#F44336'; // Error states
```

#### Typography Scale

-   **Headers**: Bold, village green or dark blue
-   **Body**: Clean, readable fonts
-   **Captions**: Smaller, muted colors
-   **Interactive**: Hover states and transitions

#### Responsive Breakpoints

```css
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
```

## 🗄️ Database Schema

### Core Tables

#### Events Table

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  category VARCHAR(50) DEFAULT 'sonstiges',
  organizer VARCHAR(255),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### News Table

```sql
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  content TEXT,
  category VARCHAR(50) NOT NULL,
  published_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Gallery Images Table

```sql
CREATE TABLE gallery_images (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Portraits Table

```sql
CREATE TABLE portraits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  email VARCHAR(255),
  image_data TEXT NOT NULL,
  image_mime_type VARCHAR(100) NOT NULL,
  image_filename VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Contacts Table

```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  emails JSONB DEFAULT '[]',
  phones JSONB DEFAULT '[]',
  addresses JSONB DEFAULT '[]',
  affiliations JSONB DEFAULT '[]',
  sources JSONB DEFAULT '[]',
  importance INTEGER DEFAULT 0
);
```

## 📱 Feature Page Structure

### Page Organization

Each feature has its own directory under `/app`:

#### `/was-steht-an` - Events Calendar

-   Full calendar view
-   Event filtering by category
-   Mobile-responsive design

#### `/dorfleben` - Village Life

-   `/kirche` - Church information
-   `/ortsrat` - Local council
-   `/vereine` - Local clubs and organizations
-   `/wetter` - Weather information
-   `/wir-wendesser` - Community portraits

#### `/geschichte` - Village History

-   Historical information and timeline

#### `/kontakt` - Contact Information

-   Contact directory
-   Forms and legal pages
-   Privacy policy and impressum

#### `/wohnen-bauen` - Living & Building

-   Housing information
-   Building projects
-   Community facilities

---

**Next:** [Dependencies](./04-dependencies.md)
