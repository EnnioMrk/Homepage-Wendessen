# Deployment & CI/CD

## 🚀 Deployment Overview

### Deployment Strategy

The Wendessen Village Website uses **Vercel** as the primary deployment platform, leveraging its seamless integration with Next.js and automatic deployments from Git repositories.

### Deployment Environments

1. **Development**: Local development server (`localhost:3000`)
2. **Preview**: Vercel preview deployments for pull requests
3. **Production**: Live website accessible to users

## 🏗️ Production Deployment

### Vercel Deployment Setup

#### 1. Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link
```

#### 2. Environment Variables Configuration

Set these in Vercel Dashboard > Settings > Environment Variables:

```bash
# Production Environment Variables
DATABASE_URL="postgresql://username:password@ep-prod.us-east-1.aws.neon.tech/neondb"
ADMIN_PASSWORD="secure_production_password"
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your_analytics_id"
NODE_ENV="production"
```

#### 3. Build Configuration

Vercel automatically detects Next.js projects. Custom build settings:

```json
// vercel.json (optional)
{
    "framework": "nextjs",
    "buildCommand": "bun run build",
    "installCommand": "bun install",
    "devCommand": "bun run dev",
    "regions": ["fra1"],
    "functions": {
        "app/api/**/*.ts": {
            "maxDuration": 10
        }
    }
}
```

### Manual Deployment Process

#### 1. Pre-deployment Checklist

```bash
# Run tests
bun test

# Check build
bun run build

# Lint code
bun run lint

# Check TypeScript
npx tsc --noEmit

# Verify environment variables
echo $DATABASE_URL
echo $ADMIN_PASSWORD
```

#### 2. Deploy to Production

```bash
# Deploy current branch
vercel --prod

# Deploy specific commit
vercel --prod --force

# Deploy with specific name
vercel --prod --name wendessen-village-website
```

#### 3. Post-deployment Verification

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Test critical paths
curl https://your-domain.com/api/health
curl https://your-domain.com/
```

## 🔄 Continuous Integration/Continuous Deployment (CI/CD)

### GitHub Actions Workflow

#### Main CI/CD Pipeline (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to Vercel

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

env:
    VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
    VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Setup Bun
              uses: oven-sh/setup-bun@v1
              with:
                  bun-version: latest

            - name: Install dependencies
              run: bun install

            - name: Run linting
              run: bun run lint

            - name: Run type checking
              run: npx tsc --noEmit

            - name: Run tests
              run: bun test --coverage
              env:
                  DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
                  ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}

            - name: Build application
              run: bun run build
              env:
                  DATABASE_URL: ${{ secrets.DATABASE_URL }}
                  ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}

    deploy-preview:
        needs: test
        runs-on: ubuntu-latest
        if: github.event_name == 'pull_request'
        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Setup Bun
              uses: oven-sh/setup-bun@v1

            - name: Install dependencies
              run: bun install

            - name: Install Vercel CLI
              run: npm install --global vercel@latest

            - name: Pull Vercel Environment Information
              run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}

            - name: Build Project Artifacts
              run: vercel build --token=${{ secrets.VERCEL_TOKEN }}

            - name: Deploy Project Artifacts to Vercel
              run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}

    deploy-production:
        needs: test
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main' && github.event_name == 'push'
        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Setup Bun
              uses: oven-sh/setup-bun@v1

            - name: Install dependencies
              run: bun install

            - name: Install Vercel CLI
              run: npm install --global vercel@latest

            - name: Pull Vercel Environment Information
              run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

            - name: Build Project Artifacts
              run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

            - name: Deploy Project Artifacts to Vercel
              run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}

            - name: Post-deployment health check
              run: |
                  sleep 30
                  curl -f https://your-domain.com/api/health || exit 1
```

#### Quality Assurance Workflow (`.github/workflows/qa.yml`)

```yaml
name: Quality Assurance

on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main]

jobs:
    code-quality:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - uses: oven-sh/setup-bun@v1
              with:
                  bun-version: latest

            - name: Install dependencies
              run: bun install

            - name: ESLint
              run: bun run lint

            - name: TypeScript Check
              run: npx tsc --noEmit

            - name: Format Check
              run: bunx prettier --check .

    security-audit:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - uses: oven-sh/setup-bun@v1

            - name: Security Audit
              run: bun audit

            - name: Check for vulnerabilities
              run: bunx audit-ci --config audit-ci.json

    e2e-tests:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - uses: oven-sh/setup-bun@v1

            - name: Install dependencies
              run: bun install

            - name: Install Playwright
              run: bunx playwright install

            - name: Run E2E tests
              run: bun test:e2e
              env:
                  DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
                  ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}

            - name: Upload test results
              uses: actions/upload-artifact@v3
              if: failure()
              with:
                  name: playwright-report
                  path: playwright-report/
```

### Required GitHub Secrets

Set these in GitHub Repository > Settings > Secrets and Variables > Actions:

```bash
# Vercel Configuration
VERCEL_TOKEN="your_vercel_token"
VERCEL_ORG_ID="your_org_id"
VERCEL_PROJECT_ID="your_project_id"

# Database Configuration
DATABASE_URL="production_database_url"
TEST_DATABASE_URL="test_database_url"

# Authentication
ADMIN_PASSWORD="production_admin_password"
TEST_ADMIN_PASSWORD="test_admin_password"

# Analytics (Optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your_analytics_id"
```

## 🔄 Rollback & Versioning

### Vercel Rollback Process

#### Quick Rollback

```bash
# List recent deployments
vercel ls

# Promote previous deployment to production
vercel promote [deployment-url] --scope=your-team

# Rollback via Vercel Dashboard
# Visit vercel.com/dashboard → Project → Deployments → Promote
```

#### Git-based Rollback

```bash
# Create rollback branch
git checkout main
git checkout -b rollback-to-stable

# Reset to previous stable commit
git reset --hard [stable-commit-hash]

# Force push to trigger new deployment
git push origin rollback-to-stable --force

# Create PR to main branch
```

### Version Tagging Strategy

#### Semantic Versioning

```bash
# Tag stable releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Tag format: v[MAJOR].[MINOR].[PATCH]
# MAJOR: Breaking changes
# MINOR: New features (backward compatible)
# PATCH: Bug fixes
```

#### Release Process

```bash
# 1. Prepare release
git checkout main
git pull origin main

# 2. Update version in package.json
npm version patch  # or minor/major

# 3. Create release tag
git tag -a v1.0.1 -m "Release v1.0.1: Bug fixes and improvements"

# 4. Push changes
git push origin main --tags

# 5. Create GitHub release
gh release create v1.0.1 --notes "Release notes here"
```

## 🏗️ Infrastructure as Code

### Vercel Configuration

```json
// vercel.json
{
    "version": 2,
    "framework": "nextjs",
    "regions": ["fra1"],
    "build": {
        "env": {
            "NODE_ENV": "production"
        }
    },
    "functions": {
        "app/api/**/*.ts": {
            "maxDuration": 10,
            "memory": 512
        }
    },
    "headers": [
        {
            "source": "/(.*)",
            "headers": [
                {
                    "key": "X-Content-Type-Options",
                    "value": "nosniff"
                },
                {
                    "key": "X-Frame-Options",
                    "value": "DENY"
                },
                {
                    "key": "Referrer-Policy",
                    "value": "origin-when-cross-origin"
                }
            ]
        }
    ],
    "redirects": [
        {
            "source": "/admin",
            "destination": "/admin/dashboard",
            "permanent": false
        }
    ]
}
```

### Database Migration Strategy

#### Migration Scripts

```bash
# Create migration script
# scripts/migrations/001_add_image_column.ts
import { neon } from '@neondatabase/serverless';

async function migrate() {
    const sql = neon(process.env.DATABASE_URL!);

    try {
        await sql`
            ALTER TABLE events
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        `;

        console.log('Migration 001 completed successfully');
    } catch (error) {
        console.error('Migration 001 failed:', error);
        throw error;
    }
}

migrate();
```

#### Migration Workflow

```bash
# 1. Create migration script
touch scripts/migrations/002_new_feature.ts

# 2. Test migration locally
bun run scripts/migrations/002_new_feature.ts

# 3. Include in deployment
# Add to package.json scripts:
# "migrate": "bun run scripts/run-migrations.ts"

# 4. Run during deployment
# Add to CI/CD pipeline before build
```

## 📊 Monitoring & Observability

### Health Checks

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
    try {
        const sql = neon(process.env.DATABASE_URL!);

        // Test database connection
        const dbHealth = await sql`SELECT 1 as health`;

        // Check critical tables
        const eventsCount = await sql`SELECT COUNT(*) FROM events`;
        const newsCount = await sql`SELECT COUNT(*) FROM news`;

        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            database: 'connected',
            tables: {
                events: Number(eventsCount[0].count),
                news: Number(newsCount[0].count),
            },
            version: process.env.npm_package_version || 'unknown',
        };

        return NextResponse.json(health);
    } catch (error) {
        const health = {
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
        };

        return NextResponse.json(health, { status: 503 });
    }
}
```

### Vercel Analytics Integration

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="de">
            <body>
                {children}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
```

### Performance Monitoring

```bash
# Monitor Core Web Vitals
# Automatically tracked with Vercel Speed Insights

# Custom performance tracking
# In production, monitor:
# - Page load times
# - Database query performance
# - API response times
# - Error rates
```

## 🚨 Incident Response

### Deployment Failure Recovery

#### 1. Immediate Response

```bash
# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Quick rollback if needed
vercel promote [previous-deployment-url] --scope=team
```

#### 2. Investigation

```bash
# Check build logs
vercel logs --follow

# Test locally with production environment
DATABASE_URL=$PROD_DATABASE_URL bun run build
DATABASE_URL=$PROD_DATABASE_URL bun run start

# Check database connectivity
psql $DATABASE_URL -c "SELECT 1;"
```

#### 3. Resolution Steps

```bash
# Fix issue locally
git checkout -b hotfix/deployment-issue

# Make necessary changes
# Test thoroughly
bun test
bun run build

# Deploy fix
git commit -m "Fix: Resolve deployment issue"
git push origin hotfix/deployment-issue

# Create PR and merge
# Automatic deployment will trigger
```

### Database Issues

#### Connection Problems

```bash
# Check Neon database status
# Visit neon.tech console

# Test connection
curl -X GET "https://your-domain.com/api/health"

# Verify environment variables
echo $DATABASE_URL
```

#### Data Recovery

```bash
# Neon provides automatic backups
# Access via Neon console > Backups

# Point-in-time recovery available
# Contact Neon support if needed
```

## 📋 Deployment Checklist

### Pre-deployment

-   [ ] All tests passing
-   [ ] Build successful locally
-   [ ] Environment variables configured
-   [ ] Database migrations applied
-   [ ] Security audit passed
-   [ ] Performance acceptable

### Deployment

-   [ ] CI/CD pipeline successful
-   [ ] Health check endpoint responding
-   [ ] Admin panel accessible
-   [ ] Database connectivity verified
-   [ ] Analytics tracking active

### Post-deployment

-   [ ] Core functionality tested
-   [ ] Performance monitoring active
-   [ ] Error tracking configured
-   [ ] Team notified of deployment
-   [ ] Documentation updated

### Rollback Plan

-   [ ] Previous stable deployment identified
-   [ ] Rollback procedure documented
-   [ ] Database backup verified
-   [ ] Team notification plan ready

---

**Next:** [Extending the Project](./10-extending-project.md)
