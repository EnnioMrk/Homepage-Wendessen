# Dependencies

## 📦 Core Dependencies

### Runtime & Framework

```json
{
    "next": "15.3.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
}
```

**Next.js 15** serves as the foundation with:

-   **App Router**: Latest routing system with layout support
-   **React 19**: Latest React features and improvements
-   **Turbopack**: Ultra-fast bundler for development
-   **Server Components**: Optimized rendering and performance

### Database & Storage

```json
{
    "@neondatabase/serverless": "^1.0.1"
}
```

**Neon Serverless Driver** provides:

-   **PostgreSQL**: Serverless database connection
-   **Edge Runtime**: Compatible with Vercel Edge Functions
-   **Connection Pooling**: Automatic connection management
-   **Type Safety**: Works seamlessly with TypeScript

### UI Components & Styling

```json
{
    "tailwindcss": "^3.3.0",
    "tailwind-merge": "^3.3.0",
    "clsx": "^2.1.1",
    "@phosphor-icons/react": "^2.1.10",
    "@radix-ui/react-menubar": "^1.1.15"
}
```

**Tailwind CSS** ecosystem:

-   **Core**: Utility-first CSS framework
-   **Merge**: Intelligent class merging utility
-   **clsx**: Conditional class name utility

**Icon System**:

-   **Phosphor Icons**: SSR-friendly icon library using `@phosphor-icons/react/dist/ssr`
-   **Radix UI**: Accessible, unstyled UI primitives

### Calendar & Date Handling

```json
{
    "react-big-calendar": "^1.19.4",
    "@types/react-big-calendar": "^1.16.2",
    "moment": "^2.30.1"
}
```

**Calendar Features**:

-   **React Big Calendar**: Full-featured calendar component
-   **Moment.js**: Date manipulation and formatting
-   **German Localization**: Date formats for German users

### Analytics & Monitoring

```json
{
    "@vercel/analytics": "^1.5.0",
    "@vercel/speed-insights": "^1.2.0"
}
```

**Vercel Analytics**:

-   **Web Analytics**: Privacy-focused user tracking
-   **Speed Insights**: Core Web Vitals monitoring
-   **Performance Metrics**: Real-time performance data

### Utility Libraries

```json
{
    "minimatch": "^10.0.3"
}
```

**Minimatch**: File path pattern matching for image utilities

## 🛠️ Development Dependencies

### TypeScript & Type Definitions

```json
{
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/minimatch": "^6.0.0"
}
```

**Type Safety**:

-   **TypeScript 5**: Latest TypeScript features
-   **React Types**: Complete type definitions for React 19
-   **Node Types**: Node.js runtime type definitions

### Code Quality & Linting

```json
{
    "eslint": "^9",
    "eslint-config-next": "15.3.2",
    "@eslint/eslintrc": "^3"
}
```

**ESLint Configuration**:

-   **Next.js Rules**: Optimized rules for Next.js projects
-   **React Rules**: Best practices for React development
-   **TypeScript Integration**: Type-aware linting

### Build Tools & CSS Processing

```json
{
    "postcss": "^8",
    "autoprefixer": "^10.0.1"
}
```

**CSS Processing**:

-   **PostCSS**: CSS transformation toolkit
-   **Autoprefixer**: Automatic vendor prefix addition

## 🔄 Version Compatibility

### Next.js 15 Features Used

-   **App Router**: Stable routing system
-   **Server Components**: Default rendering mode
-   **Server Actions**: Form handling and mutations
-   **Middleware**: Route protection and authentication
-   **Image Optimization**: Automatic image optimization
-   **Caching**: Built-in data caching with tags

### React 19 Features Used

-   **Server Components**: RSC architecture
-   **Suspense Boundaries**: Loading states
-   **Hooks**: useState, useEffect, custom hooks
-   **TypeScript Integration**: Full type safety

### Bun Runtime Compatibility

All dependencies are compatible with Bun runtime:

-   **Package Installation**: `bun install` works with all packages
-   **Script Execution**: All scripts run with `bun run`
-   **Build Process**: Compatible with Next.js build system

## 📚 Dependency Categories

### 1. Essential Dependencies (Cannot Remove)

-   **next**: Core framework
-   **react**, **react-dom**: UI library
-   **@neondatabase/serverless**: Database connection
-   **tailwindcss**: Styling system

### 2. Feature Dependencies (Can Replace)

-   **react-big-calendar**: Could use alternative calendar
-   **moment**: Could migrate to date-fns or dayjs
-   **@phosphor-icons/react**: Could swap for a different icon set if SSR support remains intact

### 3. Development Dependencies (Build-time only)

-   **typescript**: Could use JavaScript
-   **eslint**: Code quality tooling
-   **postcss**: CSS processing

### 4. Analytics Dependencies (Optional)

-   **@vercel/analytics**: Could be removed for privacy
-   **@vercel/speed-insights**: Optional performance monitoring

## 🚀 Dependency Management

### Installing Dependencies

```bash
# Install all dependencies
bun install

# Install specific dependency
bun add package-name

# Install development dependency
bun add -D package-name

# Install exact version
bun add package-name@1.0.0
```

### Updating Dependencies

```bash
# Check outdated packages
bun outdated

# Update all dependencies
bun update

# Update specific package
bun update package-name

# Update to latest major version
bun add package-name@latest
```

### Dependency Security

```bash
# Audit dependencies for vulnerabilities
bun audit

# Fix security vulnerabilities
bun audit --fix
```

## ⚠️ Known Compatibility Issues

### React 19 + Big Calendar

**Issue**: Type compatibility between React 19 and react-big-calendar
**Solution**: Type assertions used in calendar components
**Status**: Functional, no runtime issues

### Moment.js Deprecation

**Issue**: Moment.js is in maintenance mode
**Future Action**: Consider migrating to dayjs or date-fns
**Timeline**: Not urgent, working properly

### ESLint 9 Configuration

**Issue**: New flat config format in ESLint 9
**Solution**: Using compatibility layer with @eslint/eslintrc
**Status**: Stable configuration

## 🔄 Dependency Update Strategy

### Update Schedule

-   **Major Updates**: Quarterly review
-   **Minor Updates**: Monthly check
-   **Security Updates**: Immediate application
-   **Framework Updates**: Follow Next.js release cycle

### Testing After Updates

1. **Build Test**: `bun run build`
2. **Type Check**: `npx tsc --noEmit`
3. **Lint Check**: `bun run lint`
4. **Functionality Test**: Manual testing of key features
5. **Admin Panel Test**: Verify all admin functionality

### Rollback Strategy

```bash
# Lock to specific versions in package.json
{
  "dependencies": {
    "next": "15.3.2",  // Exact version
    "react": "^19.0.0" // Minor updates allowed
  }
}

# Restore from lockfile
bun install --frozen-lockfile
```

## 📊 Bundle Size Analysis

### Core Bundle Components

-   **Next.js Runtime**: ~100KB
-   **React**: ~45KB
-   **Tailwind CSS**: ~15KB (purged)
-   **Calendar Component**: ~80KB
-   **Icons**: ~20KB (tree-shaken)

### Optimization Strategies

-   **Tree Shaking**: Automatic with Next.js
-   **Code Splitting**: Page-based splitting
-   **Image Optimization**: Automatic with Next.js Image
-   **CSS Purging**: Tailwind removes unused styles

### Bundle Monitoring

```bash
# Analyze bundle size
npx @next/bundle-analyzer

# Check largest dependencies
npx bundlesize
```

## 🔧 Custom Scripts

### Database Scripts

```bash
bun run setup-gallery      # Setup gallery table
bun run setup-contacts     # Initialize contact data
bun run scripts/setup-database.ts  # Full database setup
```

### Development Scripts

```bash
bun run dev          # Development server with Turbopack
bun run build        # Production build
bun run start        # Production server
bun run lint         # ESLint checking
```

### Environment-Specific Scripts

```bash
# Production deployment
NODE_ENV=production bun run build
NODE_ENV=production bun run start

# Development with specific port
bun run dev -- -p 3001
```

---

**Next:** [Configuration](./05-configuration.md)
