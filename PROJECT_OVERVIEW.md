# 🏘️ Wendessen Village Website - Complete Project Overview

## 📖 Project Summary

The **Wendessen Village Website** is a modern, community-focused digital platform built for the village of Wendessen, Germany. It serves as the central hub for village life, providing residents and visitors with essential information about local events, news, community organizations, and village services.

## 🎯 Core Purpose & Vision

### Primary Goals

-   **Community Engagement**: Strengthen village connections through digital presence
-   **Information Hub**: Centralize village news, events, and important contacts
-   **Cultural Preservation**: Document and celebrate local history and traditions
-   **Administrative Efficiency**: Streamline village communication and event management
-   **Accessibility**: Ensure all community members can access vital information

### Target Audience

-   **Primary**: Village residents of all ages
-   **Secondary**: Visitors, potential residents, local businesses
-   **Administrative**: Village officials and organization leaders

## 🏗️ Technical Architecture

### Core Technology Stack

#### Frontend Framework

```typescript
- Next.js 15 (App Router) - Modern React framework with SSR/SSG
- React 19 - Latest React version with concurrent features
- TypeScript 5 - Type safety and enhanced developer experience
```

#### Runtime & Package Management

```bash
- Bun - Ultra-fast JavaScript runtime and package manager
- Preferred for all commands: bun dev, bun build, bun install
```

#### Database & Backend

```typescript
- PostgreSQL (self-hosted or managed) - Standard PostgreSQL database
- `pg` (node-postgres) used via a centralized helper at `lib/sql.ts`
- Raw SQL queries with type-safe interfaces
- No ORM - Direct control over database interactions
```

#### Styling & UI

```css
- Tailwind CSS - Utility-first CSS framework
- Custom design system with German localization
- Responsive design (mobile-first)
- Lucide React - Consistent icon system
```

#### Authentication & Security

```typescript
- Custom session-based authentication
- Environment variable password protection
- HTTP-only cookies for session management
- Middleware-based route protection
```

#### Performance & Analytics

```javascript
- Next.js unstable_cache with tag-based invalidation
- Vercel Analytics - User behavior tracking
- Vercel Speed Insights - Performance monitoring
- Image optimization with Next.js Image component
```

### Architecture Principles

#### 1. **Simplicity Over Complexity**

-   Avoid over-engineering solutions
-   Use built-in Next.js features where possible
-   Minimal external dependencies
-   Clear, readable code structure

#### 2. **Community-First Design**

-   German language and cultural conventions
-   Accessible to all age groups and technical levels
-   Mobile-optimized for common usage patterns
-   Content-focused user experience

#### 3. **Performance & Reliability**

-   Server-side rendering for SEO and speed
-   Aggressive caching strategies
-   Graceful error handling
-   Offline-friendly progressive enhancement

#### 4. **Maintainability**

-   Comprehensive TypeScript typing
-   Consistent code patterns
-   Clear separation of concerns
-   Extensive documentation

## 🚀 Core Features

### Public Features

#### 🏠 Homepage

```typescript
Components:
- HomeBanner: Welcome message and village branding
- NewsSection: Latest village news and announcements
- HeroTitle: Dynamic village greeting
- EventsSection: Upcoming events preview
- WirSindWendessenSection: Community portraits
- FullWidthServicesSection: Village organizations carousel
```

#### 📅 Events Management

```sql
Database Schema:
- events table with categories: sitzung, veranstaltung, sport, kultur, notfall, sonstiges
- Full CRUD operations via admin panel
- Calendar integration with react-big-calendar
- Image attachments support
- Location and organizer information
```

#### 📰 News System

```typescript
Features:
- Categorized news articles
- Rich text content support
- Automatic date management
- Admin-controlled publishing
- Responsive card-based display
```

#### 🖼️ Gallery & Portraits

```typescript
Systems:
- Community photo gallery
- "Wir Wendesser" portrait submissions
- Admin approval workflow
- Automatic image optimization
- MinIO-backed storage for shared gallery uploads (portraits remain base64 for now)
```

#### 📞 Contact Directory

```json
Data Structure:
- Comprehensive contact database
- Importance scoring system
- Multiple contact methods (email, phone, address)
- Organizational affiliations
- Search and filtering capabilities
```

#### 🏛️ Village Information

```
Content Areas:
- Village history and traditions
- Local government (Ortsrat) information
- Community organizations (Vereine)
- Local services and amenities
- Weather integration
```

### Administrative Features

#### 🔐 Admin Dashboard

```typescript
Components:
- Secure login system
- Overview with quick actions
- Content management interfaces
- Analytics and insights
- Portrait approval system
```

#### 📊 Content Management

```
Capabilities:
- Event creation and editing
- News article management
- Image upload and organization
- Contact directory maintenance
- User submission moderation
```

## 🎨 Design Philosophy

### User Experience Principles

#### **Accessibility First**

```css
implementation: -Semantic HTML structure - ARIA attributes where needed - High
    contrast color schemes - Keyboard navigation support - Screen reader
    compatibility;
```

#### **Mobile-Responsive Design**

```css
Breakpoint Strategy:
- sm: 640px (small tablets)
- md: 768px (tablets)
- lg: 1024px (desktops)
- xl: 1280px (large screens)
```

#### **German Localization**

```typescript
Conventions:
- German date formatting (de-DE locale)
- Cultural color associations
- Local terminology and phrases
- European design patterns
```

### Visual Design System

#### **Color Palette**

```css
Primary Colors:
- Village Green: Various shades for nature/community
- Heritage Blue: Official/government content
- Warm Red: Emergency/important notices
- Neutral Grays: Text and backgrounds
```

#### **Typography**

```css
Font Stack:
- Geist: Modern, readable font family
- Responsive sizing with Tailwind utilities
- Clear hierarchy (h1-h6, body text)
```

#### **Component Patterns**

```typescript
Consistent Elements:
- Card-based layouts with shadows
- Gradient backgrounds for visual depth
- Hover effects with smooth transitions
- Loading states and error handling
```

## 📊 Data Flow & Architecture

### Database Schema Overview

```sql
Core Tables:
- events: Village events and meetings
- news: News articles and announcements
- contacts: Community contact directory
- portraits: Community member submissions
- gallery_images: Photo gallery content
```

### Caching Strategy

```typescript
Layers:
1. Next.js Static Generation (build time)
2. unstable_cache with tags (runtime)
3. Browser caching (client side)
4. CDN caching (Vercel Edge)

Cache Tags:
- 'events': All event-related data
- 'news': News articles and content
- 'contacts': Contact directory
- 'portraits': Community submissions
```

### API Structure

```typescript
RESTful Endpoints:
- GET /api/events - Fetch events
- POST /api/admin/events - Create event
- PUT /api/admin/events/[id] - Update event
- DELETE /api/admin/events/[id] - Delete event
- Similar patterns for news, portraits, gallery
```

## 🔧 Development Principles

### Code Organization

```
Directory Structure:
app/                    # Next.js app directory
├── components/        # Reusable UI components
├── api/              # API routes
├── admin/            # Admin panel pages
├── [feature]/        # Feature-specific pages
lib/                   # Utility libraries and configurations
├── database.ts       # Database operations
├── auth.ts           # Authentication logic
├── utils.ts          # Helper functions
scripts/              # Database setup and maintenance
docs/                 # Comprehensive documentation
```

### Coding Standards

#### **TypeScript Usage**

```typescript
Principles:
- Strict type checking enabled
- Interface definitions for all data structures
- Generic types for reusable components
- Proper error handling with typed exceptions
```

#### **Component Patterns**

```typescript
Standards:
- Functional components with hooks
- Props interfaces defined inline
- Default exports for components
- Named exports for utilities
- Clear prop documentation
```

#### **Database Operations**

```typescript
Patterns:
- Raw SQL with type-safe transformations
- Consistent error handling
- Transaction support where needed
- Proper connection management
- Cache invalidation strategies
```

### Testing & Quality Assurance

```typescript
Approaches:
- TypeScript compile-time checking
- ESLint for code quality
- Manual testing workflows
- Performance monitoring with Vercel
- Error logging and monitoring
```

## 🚀 Deployment & Operations

### Hosting & Infrastructure

```yaml
Platform: Vercel
- Automatic deployments from Git
- Edge network optimization
- Built-in analytics and monitoring
- Environment variable management
- SSL certificates and security
```

### Environment Configuration

```bash
- DATABASE_URL: PostgreSQL connection string (used by `lib/sql.ts`)
- ADMIN_PASSWORD: Administrative access password

Optional Variables:
- NEXT_PUBLIC_VERCEL_ANALYTICS_ID: Analytics tracking
```

### Performance Optimizations

```typescript
Strategies:
- Static generation where possible
- Image optimization and lazy loading
- Component-level code splitting
- Database query optimization
- CDN caching for static assets
```

## 📈 Future Development Roadmap

### Short-term Enhancements (3-6 months)

-   [ ] Multi-user admin system with roles
-   [ ] Email notification system for events
-   [ ] Enhanced search functionality
-   [ ] Mobile app-like PWA features
-   [ ] Social media integration

### Medium-term Goals (6-12 months)

-   [ ] Multi-language support (English/German)
-   [ ] Advanced content management features
-   [ ] Community forum or discussion boards
-   [ ] Integration with local government systems
-   [ ] Enhanced analytics and reporting

### Long-term Vision (1-2 years)

-   [ ] Regional expansion to nearby villages
-   [ ] E-commerce for local businesses
-   [ ] Event booking and payment processing
-   [ ] Advanced community engagement features
-   [ ] Mobile application development

## 🤝 Contributing Guidelines

### Development Workflow

```bash
Setup:
1. Clone repository
2. Install dependencies: bun install
3. Set up environment variables
4. Run database setup scripts
5. Start development server: bun dev
```

### Code Contribution Standards

```typescript
Requirements:
- Follow existing TypeScript patterns
- Maintain German localization
- Update documentation for changes
- Test on mobile and desktop
- Consider accessibility implications
```

### Feature Development Process

```markdown
Process:

1. Create feature branch
2. Implement with tests
3. Update documentation
4. Submit pull request
5. Code review and approval
6. Deployment via Vercel
```

## 📞 Support & Maintenance

### Regular Maintenance Tasks

```bash
Weekly:
- Monitor application performance
- Review error logs and user feedback
- Update content as needed
- Check database performance

Monthly:
- Update dependencies
- Review security configurations
- Backup database
- Performance optimization review
```

### Troubleshooting Resources

```typescript
Common Issues:
- Database connection problems
- Image upload failures
- Cache invalidation issues
- Authentication problems
- Performance degradation
```

---

## 📋 Quick Reference

### Key Commands

```bash
# Development
bun dev                    # Start development server
bun build                  # Build for production
bun start                  # Start production server

# Database
bun run setup-gallery      # Create gallery table
bun run setup-contacts     # Initialize contact data
```

### Important Files

```
- app/page.tsx            # Homepage component
- lib/database.ts         # Database operations
- lib/auth.ts             # Authentication logic
- middleware.ts           # Route protection
- tailwind.config.js      # Styling configuration
```

### Contact Information

-   **Repository**: GitHub - Homepage-Wendessen
-   **Owner**: EnnioMrk
-   **Documentation**: `/docs/` directory
-   **Last Updated**: September 2025

---

_This overview serves as a comprehensive guide to understanding, maintaining, and extending the Wendessen Village Website. It reflects the current state of the project and should be updated as the system evolves._
