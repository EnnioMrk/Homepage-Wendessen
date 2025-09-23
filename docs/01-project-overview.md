# Project Overview

## 🎯 Project Purpose

The Wendessen Village Website is a Next.js-based community platform designed to serve as the digital hub for the village of Wendessen, Germany. It provides residents and visitors with essential information about local events, news, community services, and village life.

## 🌟 Core Features

### Public Features

-   **📅 Events Calendar**: Interactive calendar displaying village events, meetings, and activities
-   **📰 News Section**: Latest village news and announcements
-   **🖼️ Photo Gallery**: Community image gallery showcasing village life
-   **👥 Community Portraits**: "Wir Wendesser" section featuring community member submissions
-   **📞 Contact Directory**: Important contacts and services in the village
-   **🏛️ Village Information**: History, local government, clubs, and services

### Administrative Features

-   **🔐 Admin Dashboard**: Secure admin panel for content management
-   **📝 Content Management**: Create, edit, and delete events, news, and gallery images
-   **👨‍💼 Portrait Management**: Review and approve community portrait submissions
-   **📊 Analytics Integration**: Vercel Analytics and Speed Insights

## 🏗️ High-Level Architecture

### Technology Stack

-   **Frontend Framework**: Next.js 15 with React 19
-   **Runtime**: Bun (preferred for all operations)
-   **Database**: Neon PostgreSQL with serverless driver
-   **Styling**: Tailwind CSS with custom design system
-   **Authentication**: Custom session-based authentication
-   **Deployment**: Vercel platform

### Architecture Patterns

#### 1. App Router Structure

```
app/
├── page.tsx                 # Homepage
├── layout.tsx              # Root layout
├── components/             # Reusable UI components
├── api/                    # API routes
├── admin/                  # Admin dashboard pages
└── [feature-pages]/        # Feature-specific pages
```

#### 2. Database Layer

-   **Connection**: Neon serverless PostgreSQL
-   **ORM**: Raw SQL queries with type-safe interfaces
-   **Caching**: Next.js `unstable_cache` with tag-based invalidation
-   **Data Models**: Events, News, Gallery, Contacts, Portraits

#### 3. Component Architecture

-   **Atomic Design**: Reusable components with consistent patterns
-   **TypeScript**: Strict typing throughout the application
-   **Responsive Design**: Mobile-first approach with Tailwind breakpoints
-   **Accessibility**: Semantic HTML and ARIA attributes

#### 4. Authentication Flow

-   **Simple Password-Based**: Environment variable configuration
-   **Session Management**: HTTP-only cookies with token validation
-   **Route Protection**: Middleware-based authentication for admin routes
-   **No External Dependencies**: Self-contained authentication system

## 🎨 Design Philosophy

### User Experience

-   **Community-Focused**: Designed for village residents and local engagement
-   **Accessibility**: Ensuring the site is usable by all community members
-   **Mobile-First**: Optimized for mobile devices common in the community
-   **German Localization**: Content and formatting tailored for German users

### Technical Approach

-   **Simplicity**: Avoiding over-engineering while maintaining functionality
-   **Performance**: Leveraging Next.js optimizations and caching strategies
-   **Maintainability**: Clear code organization and documentation
-   **Scalability**: Architecture that can grow with community needs

## 🚀 Core Functionality

### Content Management System

1. **Events Management**

    - Create recurring and one-time events
    - Categorize by type (meetings, celebrations, sports, culture, etc.)
    - Location and organizer information
    - Optional image attachments

2. **News System**

    - Categorized news articles
    - Rich text content support
    - Publication date management
    - Category-based filtering

3. **Gallery Management**

    - Image upload and storage
    - Automatic optimization
    - Metadata management
    - Admin-controlled content

4. **Community Portraits**
    - Public submission system
    - Admin review workflow
    - Approval/rejection process
    - Automatic cleanup of old submissions

### Data Flow

```
User Request → Next.js Route → Database Query → Data Transformation → Cache → Response
```

### Caching Strategy

-   **Page-Level**: Next.js static generation where appropriate
-   **Data-Level**: `unstable_cache` with 1-hour revalidation
-   **Tag-Based Invalidation**: Targeted cache clearing on content updates
-   **CDN Caching**: Vercel edge network optimization

## 🔗 Integration Points

### External Services

-   **Vercel Analytics**: User behavior tracking
-   **Vercel Speed Insights**: Performance monitoring
-   **Neon Database**: Serverless PostgreSQL hosting
-   **Vercel Blob Storage**: Image and file storage

### Internal APIs

-   **RESTful Endpoints**: Standard HTTP methods for CRUD operations
-   **Type-Safe Interfaces**: Consistent data contracts between frontend and backend
-   **Error Handling**: Comprehensive error responses and logging

## 📈 Scalability Considerations

### Current Limitations

-   Single admin user (password-based authentication)
-   Limited role-based access control
-   Basic image optimization
-   Manual content moderation

### Future Enhancement Opportunities

-   Multi-user admin system
-   Advanced role permissions
-   Automated content moderation
-   Email notification system
-   Social media integration
-   Multi-language support

---

**Next:** [Setup & Installation](./02-setup-installation.md)
