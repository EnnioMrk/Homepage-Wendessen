# Database Setup Scripts

This directory contains scripts for setting up and managing the database schema for the Wendessen website.

## 📁 Available Scripts

### Core Setup Scripts

#### `setup-database.ts`

One-stop initialization for the public-facing data model.

```bash
bun run scripts/setup-database.ts
```

**Highlights**:

-   Creates/updates `events`, `news`, and `gallery_images`
-   Bundles all historical migrations (image URLs, Verein metadata, cancellation flags, article IDs, JSON content)
-   Seeds demo events/news for local testing

#### `setup-admin-users.ts`

Creates the authentication table and seeds the fallback administrator.

```bash
bun run setup-admin-users
```

**Highlights**:

-   Ensures `admin_users` exists with indexes on `username` + `verein_id`
-   Inserts `admin` / `admin123` (forces password change on login)

#### `setup-roles-permissions.ts`

Authoritative definition of every role and permission.

```bash
bun run setup-roles-permissions
```

**Highlights**:

-   Creates `roles`, `permissions`, and augments `admin_users`
-   Upserts all roles (Super Admin, Admin, Editor, Moderator, Vereinsverwalter, No Permissions)
-   Upserts every permission category (users, events, news, gallery, shared_gallery, portraits, archive, settings, verein)
-   Keeps `default_permissions` JSON in sync with the definitions here

### Content & Feature Scripts

#### `setup-contacts.ts`

```bash
bun run setup-contacts
```

-   Creates the JSONB-heavy `contacts` table plus indexes
-   Loads `app/lib/combined-contacts.json`
-   Computes the `importance` score via `lib/importance-utils`

#### `setup-shared-gallery.ts`

```bash
bun run setup-shared-gallery
```

-   Creates both `shared_gallery_submissions` and `shared_gallery_reports`
-   Adds metadata columns (`date_taken`, `location`) and all moderation indexes
-   Ensures MinIO URL + storage path columns exist and the legacy base64 column is nullable

#### `setup-portraits-table.ts`

```bash
bun run scripts/setup-portraits-table.ts
```

-   Sets up the `portraits` moderation workflow with constraints and indexes

### Utility Scripts

#### `run-full-setup.ts`

Convenience wrapper that runs the core scripts sequentially (with `.env` loading) so onboarded contributors can provision everything with a single command.

```bash
bun scripts/run-full-setup.ts
```

#### `migrate-shared-gallery-images-to-minio.ts`

Converts existing base64 stored gallery submissions to MinIO files and updates the database with their URLs/paths.

```bash
bun scripts/migrate-shared-gallery-images-to-minio.ts
```

## 🚀 Quick Start Sequence

For a **fresh database setup**, run scripts in this order:

1. **Core Database Setup**

    ```bash
    bun run scripts/setup-database.ts
    ```

2. **Admin User System**

    ```bash
    bun run setup-admin-users
    ```

3. **Roles & Permissions** (with database-stored permissions)

    ```bash
    bun run setup-roles-permissions
    ```

4. **Verein Roles** ⭐ NEW

    ```bash
    bun run setup-verein-roles
    ```

5. **Additional Features** (as needed)
    ```bash
    bun run setup-gallery
    bun run setup-contacts
    bun run setup-shared-gallery
    bun run scripts/setup-portraits-table.ts
    ```

## 📊 Database Schema Overview

After running all setup scripts, you'll have:

### Core Tables

-   `admin_users` - Admin user accounts with roles and custom permissions
-   `roles` - System and Verein roles (11 total) with **database-stored default permissions**
-   `permissions` - Granular permissions (33 total)

### Permission System Architecture

**Role Permissions** (stored in `roles.default_permissions` JSONB):

-   Each role has its default permissions stored directly in the database
-   System loads permissions from DB with in-memory caching for performance
-   Cached data refreshed via `clearRolePermissionsCache()` after updates

**User Permissions** (stored in `admin_users.custom_permissions` JSONB):

-   Users inherit their role's default permissions
-   Can have additional custom permissions added individually
-   Permission checks combine role defaults + custom permissions

**Benefits**:

-   ✅ No code changes needed to modify role permissions
-   ✅ Potential for future admin UI to manage permissions
-   ✅ Single source of truth in database
-   ✅ Performance optimized with caching layer

### Content Tables

-   `events` - Calendar events
-   `news` - News articles
-   `gallery` - Photo gallery
-   `shared_gallery_reports` - User photo submissions
-   `portraits` - "Wir Wendesser" portraits

### Reference Tables

-   `contacts` - Community contact directory

## 🔧 Environment Requirements

All scripts require:

```env
DATABASE_URL=postgresql://user:password@host/database
```

## 💡 Script Behavior

### Idempotent Scripts

Most scripts are **idempotent** - safe to run multiple times:

-   ✅ `setup-roles-permissions.ts` - Checks for existing data
-   ✅ `setup-verein-roles.ts` - Skips existing roles
-   ✅ `create-gallery-table.ts` - Uses `CREATE TABLE IF NOT EXISTS`

### One-Time Scripts

Some scripts should only run once:

-   ⚠️ `setup-admin-users.ts` - Creates default admin (may create duplicates)
-   ⚠️ `add-sample-events.ts` - Adds test data every time

## 🐛 Troubleshooting

### "Database URL not found"

```
Error: Database URL is required
```

**Solution**: Set `DATABASE_URL` environment variable in `.env.local`

### "Table already exists"

```
Error: relation "roles" already exists
```

**Solution**: This is usually fine - script skips existing tables

### "Permission denied"

```
Error: permission denied for table roles
```

**Solution**: Check database user has CREATE/INSERT permissions

### "Cannot create duplicate"

```
Error: duplicate key value violates unique constraint
```

**Solution**: Script is idempotent - this is expected behavior

## 📝 Creating New Setup Scripts

When adding new features that require database changes:

1. **Create script file**: `scripts/setup-{feature}.ts`
2. **Use Neon client**:
    ```typescript
    import { sql } from '../lib/sql';
    ```
3. **Make it idempotent**: Use `IF NOT EXISTS` or check for existing data
4. **Add to package.json**:
    ```json
    "setup-{feature}": "bun run --bun scripts/setup-{feature}.ts"
    ```
5. **Document it here**: Add entry to this README
6. **Test it**: Run multiple times to ensure idempotency

## 🔐 Security Notes

-   Never commit database credentials
-   Use environment variables for sensitive data
-   Review scripts before running in production
-   Backup database before running migration scripts
-   Test scripts in development first

## 📚 Related Documentation

-   [Permission Security System](../docs/PERMISSION_SECURITY.md)
-   [Verein Roles Guide](../docs/VEREIN_ROLES.md)
-   [Role Comparison Matrix](../docs/ROLE_COMPARISON.md)
-   [Quick Admin Guide](../docs/QUICK_ADMIN_GUIDE.md)

---

**Last Updated**: February 2026  
**Total Scripts**: 8 (automated migrations)  
**Required Scripts**: 3 (setup-database, setup-admin-users, setup-roles-permissions)
