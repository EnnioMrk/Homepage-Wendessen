# Setup & Installation

## 📋 System Requirements

### Hardware Requirements

-   **CPU**: Any modern processor (Intel/AMD/ARM)
-   **RAM**: Minimum 4GB, recommended 8GB+
-   **Storage**: At least 1GB free space for dependencies
-   **Network**: Stable internet connection for database and deployment

### Software Requirements

-   **Operating System**: macOS, Linux, or Windows 10/11
-   **Node.js**: Version 18.17+ (LTS recommended)
-   **Bun**: Latest stable version (preferred runtime)
-   **Git**: For version control
-   **VS Code**: Recommended editor with TypeScript support

### Browser Support

-   **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
-   **Mobile Browsers**: iOS Safari 14+, Android Chrome 90+

## 🛠️ Environment Setup

### 1. Install Bun (Recommended)

```bash
# macOS and Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version
```

### 2. Alternative: Node.js Setup

If you prefer Node.js over Bun:

```bash
# Install Node.js (via nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

### 3. Clone the Repository

```bash
# Clone the project
git clone https://github.com/EnnioMrk/Homepage-Wendessen.git
cd Homepage-Wendessen

# Verify structure
ls -la
```

## 🔧 Local Development Setup

### 1. Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 2. Environment Configuration

Create environment files in the project root:

#### `.env.local` (for local development)

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# Admin Authentication
ADMIN_PASSWORD="your_secure_admin_password"

# Optional: Analytics (for production)
# NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your_analytics_id"
```

#### Environment Variables Explained

-   `DATABASE_URL`: Neon PostgreSQL connection string
-   `ADMIN_PASSWORD`: Password for admin panel access
-   `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`: (Optional) Vercel Analytics ID

### 3. Database Setup

#### Option A: Use Neon Database (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `.env.local`
4. Run database setup:

```bash
# Initialize database schema and sample data
bun run scripts/setup-database.ts

# Setup additional tables
bun run setup-gallery
bun run setup-contacts
```

#### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database named `wendessen`
3. Update `DATABASE_URL` with local connection string
4. Run the same setup scripts

### 4. Verify Database Connection

```bash
# Test database connection
bun run scripts/setup-database.ts
```

Expected output:

```
✅ Events table created successfully
✅ News table created successfully
✅ Sample events inserted successfully
✅ Sample news inserted successfully
📊 Total events in database: 6
📊 Total news in database: 4
🎉 Database setup completed successfully!
```

## 🚀 Running the Application

### Development Server

```bash
# Start development server with Bun
bun run dev

# Or with npm
npm run dev
```

The application will be available at:

-   **Frontend**: http://localhost:3000
-   **Admin Panel**: http://localhost:3000/admin

### Building for Production

```bash
# Build the application
bun run build

# Start production server
bun run start
```

### Available Scripts

```bash
# Development
bun run dev          # Start development server with Turbopack
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint

# Database Management
bun run setup-gallery    # Create gallery table
bun run setup-contacts   # Setup contact data

# Direct script execution
bun run scripts/setup-database.ts
bun run scripts/create-gallery-table.ts
bun run scripts/setup-contacts.ts
```

## 🔍 Verification Steps

### 1. Frontend Verification

Visit http://localhost:3000 and verify:

-   [ ] Homepage loads correctly
-   [ ] Events section displays sample events
-   [ ] News section shows sample articles
-   [ ] Navigation works properly
-   [ ] Mobile responsive design

### 2. Admin Panel Verification

Visit http://localhost:3000/admin and verify:

-   [ ] Login page loads
-   [ ] Can login with `ADMIN_PASSWORD`
-   [ ] Dashboard displays correctly
-   [ ] Can create/edit events
-   [ ] Can manage news articles

### 3. Database Verification

Check database tables:

```bash
# Connect to your database and verify tables exist:
# - events
# - news
# - gallery_images
# - contacts
# - portraits
```

## 🐛 Common Setup Issues

### Issue: "DATABASE_URL not found"

**Solution**: Ensure `.env.local` file exists in project root with correct database URL.

### Issue: "Bun command not found"

**Solution**: Restart terminal after Bun installation or add to PATH manually.

### Issue: "Port 3000 already in use"

**Solution**:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
bun run dev -- -p 3001
```

### Issue: Database connection fails

**Solution**:

1. Verify database URL format
2. Check network connectivity
3. Ensure database exists
4. Verify credentials

### Issue: TypeScript errors

**Solution**:

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Install @types packages if missing
bun add -D @types/node @types/react @types/react-dom
```

## 🔄 Development Workflow

### Recommended Development Setup

1. **Terminal 1**: Run `bun run dev` (keep running)
2. **Terminal 2**: For git commands and scripts
3. **VS Code**: Main development with TypeScript support
4. **Browser**: http://localhost:3000 with dev tools open

### Hot Reload Testing

-   Make changes to any file
-   Verify auto-reload works
-   Check console for errors
-   Test admin functionality

### Database Changes

When modifying database schema:

1. Update TypeScript interfaces in `lib/database.ts`
2. Create migration script in `scripts/` directory
3. Test locally before deploying
4. Update documentation if needed

---

**Next:** [Project Structure](./03-project-structure.md)
