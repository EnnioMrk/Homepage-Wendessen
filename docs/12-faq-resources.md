# FAQ & Resources

## ❓ Frequently Asked Questions

### General Questions

#### Q: What is the Wendessen Village Website?

**A:** The Wendessen Village Website is a community platform built with Next.js 15 that serves as the digital hub for the village of Wendessen, Germany. It provides information about local events, news, community services, and village life.

#### Q: Who can use this codebase?

**A:** This codebase is designed for:

-   Developers working on the Wendessen Village Website
-   Community organizations looking for a similar platform
-   Developers learning Next.js and modern web development
-   Contributors to open-source community projects

#### Q: What makes this project unique?

**A:** Key features include:

-   German-localized content and date formatting
-   Village-specific color scheme and design
-   Simple admin panel for non-technical users
-   Community portrait submission system
-   Integration with modern deployment platforms

### Technical Questions

#### Q: Why use Bun instead of Node.js/npm?

**A:** Bun offers several advantages:

-   **Faster package installation**: 2-3x faster than npm
-   **Better performance**: Optimized JavaScript runtime
-   **Built-in bundler**: Reduces tooling complexity
-   **TypeScript support**: Native TypeScript execution
-   **Modern features**: Latest ECMAScript support

However, the project works fine with Node.js if preferred.

#### Q: Why Next.js 15 and React 19?

**A:** These versions provide:

-   **App Router stability**: Mature routing system
-   **Server Components**: Better performance and SEO
-   **React 19 features**: Latest React capabilities
-   **TypeScript integration**: Excellent developer experience
-   **Vercel optimization**: Best deployment performance

#### Q: Why Neon over other databases?

**A:** Neon PostgreSQL offers:

-   **Maturity and stability**: battle-tested relational database
-   **Full SQL feature set**: rich functionality for queries and indexes
-   **Extensibility**: stored procedures, extensions, and advanced types
-   **Strong tooling**: client libraries like `pg` and ecosystem support

#### Q: Can I use this with a different database?

**A:** Yes, you can adapt it to other databases:

```typescript
// For traditional PostgreSQL
import { Pool } from 'pg';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// For SQLite
import Database from 'better-sqlite3';
const db = new Database('database.db');

// For MySQL
import mysql from 'mysql2/promise';
const connection = mysql.createConnection(process.env.DATABASE_URL);
```

You'll need to update the SQL queries and connection logic in `lib/database.ts`.

### Setup and Installation Issues

#### Q: "Bun command not found" after installation

**A:** Try these solutions:

```bash
# Restart your terminal first
# Then check if Bun is in your PATH
echo $PATH

# If not found, manually add to PATH
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Or for zsh
echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
bun --version
```

#### Q: Database connection fails in development

**A:** Check these common issues:

1. **Environment variables**:

```bash
# Verify .env.local exists and has correct values
cat .env.local

# Check format
DATABASE_URL="postgresql://username:password@host:port/database"
```

2. **Network connectivity**:

```bash
# Test database host reachability
ping your-database-host.com

# Test specific port
telnet your-database-host.com 5432
```

3. **Neon-specific issues**:

-   Check Neon console for database status
-   Verify connection string format
-   Ensure database isn't paused (free tier limitation)

#### Q: Build fails with TypeScript errors

**A:** Common solutions:

```bash
# Clear Next.js cache
rm -rf .next

# Regenerate lock file
rm bun.lockb
bun install

# Check TypeScript configuration
npx tsc --noEmit

# Update TypeScript if needed
bun add -D typescript@latest
```

#### Q: Images not loading properly

**A:** Verify Next.js image configuration:

```typescript
// next.config.ts
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
            },
            // Add your image domains here
        ],
    },
};
```

### Development Questions

#### Q: How do I add a new page?

**A:** Follow these steps:

1. **Create page directory**:

```bash
mkdir -p app/new-feature
```

2. **Create page component**:

```typescript
// app/new-feature/page.tsx
export default function NewFeaturePage() {
    return <div>New Feature Content</div>;
}
```

3. **Add navigation link**:

```typescript
// app/components/menubar.tsx
const menuItems = [
    // ... existing items
    { label: 'New Feature', href: '/new-feature' },
];
```

#### Q: How do I modify the database schema?

**A:** Create a migration script:

```typescript
// scripts/migrations/004_add_new_table.ts
import { sql } from '@/lib/sql';

async function migrate() {
        await sql`
        CREATE TABLE IF NOT EXISTS new_table (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `;

        console.log('Migration completed');
}

migrate();
```

#### Q: How do I add authentication for regular users?

**A:** The current system only supports admin authentication. For user authentication, consider:

1. **NextAuth.js**:

```bash
bun add next-auth
```

2. **Clerk**:

```bash
bun add @clerk/nextjs
```

3. **Custom solution** extending the existing auth system

#### Q: How do I customize the design/colors?

**A:** Modify the Tailwind configuration:

```javascript
// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: '#YOUR_PRIMARY_COLOR',
                secondary: '#YOUR_SECONDARY_COLOR',
                accent: '#YOUR_ACCENT_COLOR',
            },
        },
    },
};
```

Update component classes to use new colors:

```typescript
<button className="bg-primary hover:bg-primary-dark">Button</button>
```

### Deployment Questions

#### Q: How do I deploy to a different platform than Vercel?

**A:** The application can be deployed to various platforms:

**Netlify**:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
bun run build
netlify deploy --prod --dir=.next
```

**Railway**:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway link
railway up
```

**Self-hosted with Docker**:

```dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build

FROM oven/bun:1-slim
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["bun", "start"]
```

#### Q: How do I set up automatic deployments?

**A:** Use GitHub Actions (already configured) or:

**Vercel Git Integration**:

1. Connect repository to Vercel
2. Configure environment variables
3. Automatic deployments on push

**Custom CI/CD**:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
    push:
        branches: [main]
jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: oven-sh/setup-bun@v1
        import { Pool } from 'pg';
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            - run: bun run deploy # Your deployment script
```

### Performance Questions

#### Q: How can I improve page load times?

**A:** Several optimization strategies:

1. **Image optimization**:
        Yes, you can adapt it to other databases. The project uses a centralized helper (`lib/sql.ts`) and the `sql` tagged-template; swapping drivers requires updating that helper and any provider-specific connection details.
```typescript
// Use Next.js Image component with proper sizing
<Image
    src="/image.jpg"
    alt="Description"
    width={800}
    height={600}
    priority={isAboveFold}
    sizes="(max-width: 768px) 100vw, 50vw"
/>
```

2. **Code splitting**:

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
    loading: () => <div>Loading...</div>,
});
```

3. **Database optimization**:

```typescript
// Add database indexes
await sql`CREATE INDEX idx_events_date ON events(start_date);`;

// Use database-level caching
export const getEvents = unstable_cache(
    async () => {
        /* query */
    },
    ['events'],
    { revalidate: 3600 }
);
```

#### Q: How do I monitor performance?

**A:** Use built-in tools:

1. **Vercel Analytics** (already integrated)
2. **Core Web Vitals**:

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                {children}
                <SpeedInsights />
            </body>
        </html>
    );
}
```

3. **Custom performance monitoring**:

```typescript
// Monitor API response times
export async function GET() {
    const start = performance.now();
    const data = await fetchData();
    const duration = performance.now() - start;

    console.log(`API call took ${duration}ms`);
    return NextResponse.json(data);
}
```

### Security Questions

#### Q: How secure is the admin authentication?

**A:** The current authentication is basic but functional:

**Current security measures**:

-   HTTP-only cookies prevent XSS
-   Session tokens with expiration
-   Password verification
-   HTTPS in production

**Recommended improvements for production**:

-   Password hashing with bcrypt
-   Rate limiting on login attempts
-   Two-factor authentication
-   Session rotation
-   CSRF tokens

#### Q: How do I secure file uploads?

**A:** Implement these measures:

```typescript
// File validation
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5MB

function validateFile(file: File) {
    if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type');
    }
    if (file.size > maxSize) {
        throw new Error('File too large');
    }
}

// Virus scanning (production)
import ClamScan from 'clamscan';
const clamscan = await new ClamScan().init();
const scanResult = await clamscan.scanBuffer(fileBuffer);
```

#### Q: How do I prevent SQL injection?

**A:** Always use parameterized queries:

```typescript
// Safe - parameterized query
const events = await sql`
  SELECT * FROM events 
  WHERE category = ${userInput}
`;

// Unsafe - never do this
const events = await sql`
  SELECT * FROM events 
  WHERE category = '${userInput}'
`;
```

## 🔗 Useful Resources

### Official Documentation

#### Framework Documentation

-   **[Next.js 15 Documentation](https://nextjs.org/docs)** - Complete Next.js guide
-   **[React 19 Documentation](https://react.dev)** - React concepts and API
-   **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript reference
-   **[Tailwind CSS](https://tailwindcss.com/docs)** - Utility-first CSS framework

-#### Database & Deployment

-   **PostgreSQL Docs**: https://www.postgresql.org/docs/ - Official PostgreSQL documentation
-   **[Vercel Documentation](https://vercel.com/docs)** - Deployment platform
-   **[Bun Documentation](https://bun.sh/docs)** - JavaScript runtime and toolkit

### Development Tools

#### VS Code Extensions

```json
{
    "recommendations": [
        "bradlc.vscode-tailwindcss", // Tailwind CSS IntelliSense
        "ms-vscode.vscode-typescript-next", // TypeScript support
        "esbenp.prettier-vscode", // Code formatting
        "ms-vscode.vscode-eslint", // Linting
        "formulahendry.auto-rename-tag", // HTML tag renaming
        "christian-kohler.path-intellisense" // Path autocompletion
    ]
}
```

#### Browser Extensions

-   **[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)** - React debugging
-   **[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)** - State management debugging

### Learning Resources

#### Next.js & React

-   **[Next.js Learn Course](https://nextjs.org/learn)** - Interactive tutorial
-   **[React Tutorial](https://react.dev/learn)** - Official React tutorial
-   **[TypeScript for Beginners](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)** - Quick TypeScript intro

#### Database & Backend

-   **[PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)** - SQL fundamentals
-   **[API Design Best Practices](https://restfulapi.net/)** - RESTful API guidelines

#### Deployment & DevOps

-   **[Vercel Guides](https://vercel.com/guides)** - Deployment tutorials
-   **[GitHub Actions Documentation](https://docs.github.com/en/actions)** - CI/CD workflows

### Community & Support

#### Forums & Communities

-   **[Next.js Discord](https://discord.gg/nextjs)** - Official Next.js community
-   **[React Community](https://reactjs.org/community/support.html)** - React support channels
-   **[Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)** - Technical questions

#### German Developer Communities

-   **[React Berlin](https://www.meetup.com/React-Berlin/)** - Local React meetup
-   **[JavaScript User Group München](https://www.meetup.com/Munich-Frontend-Developers/)** - Frontend community
-   **[WebDev Hamburg](https://www.meetup.com/webdev-hamburg/)** - Web development meetup

### Code Examples & Templates

#### Similar Projects

-   **[Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)** - Official examples
-   **[Taxonomy](https://github.com/shadcn-ui/taxonomy)** - Modern Next.js template
-   **[T3 Stack](https://create.t3.gg/)** - Full-stack TypeScript template

#### Component Libraries

-   **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable components
-   **[Headless UI](https://headlessui.com/)** - Unstyled UI components
-   **[Radix UI](https://www.radix-ui.com/)** - Low-level UI primitives

### Design Resources

#### Icons & Graphics

-   **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library (used in project)
-   **[Heroicons](https://heroicons.com/)** - Free SVG icons
-   **[Unsplash](https://unsplash.com/)** - Free stock photos

#### Design Systems

-   **[Tailwind UI](https://tailwindui.com/)** - Tailwind component examples
-   **[Material Design](https://material.io/design)** - Google's design system
-   **[Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)** - Apple's design principles

## 🛠️ Development Tips

### Productivity Tips

#### VS Code Snippets

Create custom snippets for common patterns:

```json
// .vscode/snippets/react.json
{
    "Next.js Page Component": {
        "prefix": "npage",
        "body": [
            "import { Metadata } from 'next';",
            "",
            "export const metadata: Metadata = {",
            "  title: '$1',",
            "  description: '$2',",
            "};",
            "",
            "export default function $3Page() {",
            "  return (",
            "    <main className=\"min-h-screen\">",
            "      <div className=\"container mx-auto px-4 py-8\">",
            "        <h1 className=\"text-4xl font-bold text-primary mb-8\">$1</h1>",
            "        $0",
            "      </div>",
            "    </main>",
            "  );",
            "}"
        ]
    }
}
```

#### Git Workflow

```bash
# Feature development workflow
git checkout main
git pull origin main
git checkout -b feature/new-feature

# Work on feature...
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

#### Database Management

```bash
# Development database commands
bun run scripts/setup-database.ts     # Initialize
bun run scripts/migrate.ts            # Run migrations
bun run scripts/seed.ts              # Add sample data
bun run scripts/backup.ts            # Backup data
```

### Code Quality

#### Pre-commit Hooks

```bash
# Install husky for git hooks
bun add -D husky lint-staged

# Setup pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
    "lint-staged": {
        "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
        "*.{json,md}": ["prettier --write"]
    }
}
```

#### Code Reviews

-   Check TypeScript compilation
-   Verify responsive design
-   Test admin functionality
-   Review security implications
-   Ensure documentation updates

## 🚨 Known Limitations

### Current Limitations

1. **Single Admin User**: Only one admin password supported
2. **Basic Authentication**: No multi-factor authentication
3. **Limited File Types**: Only images supported for uploads
4. **No Email Notifications**: Manual content moderation required
5. **German Only**: Interface currently German-language only
6. **Basic SEO**: Limited metadata customization per page

### Planned Improvements

1. **Multi-user Admin System**: Role-based access control
2. **Enhanced Security**: 2FA, session management
3. **Email Integration**: Notifications and newsletters
4. **Multi-language Support**: English and other languages
5. **Advanced SEO**: Dynamic metadata, sitemaps
6. **Performance Optimization**: Better caching, CDN integration

### Browser Compatibility

#### Supported Browsers

-   **Chrome**: 90+
-   **Firefox**: 88+
-   **Safari**: 14+
-   **Edge**: 90+

#### Known Issues

-   Internet Explorer: Not supported
-   Safari 13: Some CSS grid issues
-   Chrome 89: Minor animation glitches

---

**🎉 Congratulations!** You've reached the end of the comprehensive Wendessen Village Website documentation. This should provide you with everything needed to understand, debug, and extend the project successfully.

**Happy coding! 🚀**
