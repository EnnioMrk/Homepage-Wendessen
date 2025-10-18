# Database Setup Scripts

This directory contains scripts for setting up and managing the database schema for the Wendessen website.

## 📁 Available Scripts

### Core Setup Scripts

#### `setup-database.ts`
Main database initialization script.
```bash
bun run scripts/setup-database.ts
```
**Purpose**: Sets up the core database tables and schema  
**Tables Created**: Events, News, Gallery (primary content tables)  
**When to run**: Initial database setup

---

#### `setup-admin-users.ts`
Creates the admin_users table and initial admin account.
```bash
bun run setup-admin-users
```
**Purpose**: Initialize admin user system  
**Creates**:
- `admin_users` table
- Default admin user (username: `admin`)
- 6-digit temporary password (displayed in console)

**First run output**:
```
✓ admin_users table created
✓ Created default admin user
   Username: admin
   Password: 123456 (change on first login!)
```

---

#### `setup-roles-permissions.ts`
Creates roles and permissions tables with default system roles.
```bash
bun run setup-roles-permissions
```
**Purpose**: Set up role-based permission system  
**Creates**:
- `roles` table
- `permissions` table
- 4 system roles (Super Admin, Administrator, Redakteur, Moderator)
- 24 system permissions across 7 categories

**Tables**: `roles`, `permissions`  
**Modifies**: `admin_users` (adds role_id and custom_permissions columns)

---

#### `setup-verein-roles.ts` ⭐ NEW
Creates roles for each Verein (club/association).
```bash
bun run setup-verein-roles
```
**Purpose**: Create Verein-specific admin roles  
**Creates**:
- 7 Verein roles (one per Verein)
- 9 Verein-specific permissions
- Role-permission mappings

**Verein Roles Created**:
1. `verein_sv-wendessen` - SV Wendessen
2. `verein_feuerwehr` - Freiwillige Feuerwehr
3. `verein_jugendfeuerwehr` - Jugendfeuerwehr
4. `verein_kleingaertner` - Kleingärtner-Verein
5. `verein_kirchbauverein` - Kirchbauverein
6. `verein_initiative-spritzenhaus` - Initiative Spritzenhaus
7. `verein_schuetzenverein` - Schützenverein

---

### Content & Feature Scripts

#### `create-gallery-table.ts`
Sets up the main gallery table.
```bash
bun run setup-gallery
```
**Purpose**: Initialize gallery/photo management  
**Table**: `gallery`

---

#### `setup-shared-gallery.ts`
Creates table for user-submitted photos (Impressionen).
```bash
bun run setup-shared-gallery
```
**Purpose**: Enable public photo submissions  
**Table**: `shared_gallery_reports`

---

#### `setup-contacts.ts`
Initializes contact directory.
```bash
bun run setup-contacts
```
**Purpose**: Set up community contact database  
**Table**: `contacts`

---

#### `setup-portraits-table.ts`
Creates table for portrait submissions.
```bash
bun run scripts/setup-portraits-table.ts
```
**Purpose**: Enable "Wir Wendesser" portrait feature  
**Table**: `portraits`

---

### Utility Scripts

#### `add-events-image-column.ts`
Migration script to add image support to events.
```bash
bun run scripts/add-events-image-column.ts
```
**Purpose**: Adds `image_url` column to events table  
**Type**: Schema migration

---

#### `add-gallery-metadata.ts`
Adds EXIF and metadata fields to gallery.
```bash
bun run scripts/add-gallery-metadata.ts
```
**Purpose**: Enhance gallery with photo metadata  
**Adds**: EXIF data columns to gallery table

---

#### `add-importance-to-contacts.ts`
Adds importance scoring to contacts.
```bash
bun run scripts/add-importance-to-contacts.ts
```
**Purpose**: Enable contact prioritization  
**Adds**: `importance` column to contacts table

---

#### `add-sample-events.ts`
Populates database with sample event data.
```bash
bun run scripts/add-sample-events.ts
```
**Purpose**: Testing and development  
**Creates**: Sample events for testing

---

#### `setup-gallery-reports.ts`
Sets up reporting for gallery submissions.
```bash
bun run scripts/setup-gallery-reports.ts
```
**Purpose**: Enable content moderation  
**Table**: Gallery report tracking

---

#### `test-portrait-cleanup.ts`
Tests portrait cleanup functionality.
```bash
bun run scripts/test-portrait-cleanup.ts
```
**Purpose**: Development/testing tool  
**Type**: Test utility

---

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

3. **Roles & Permissions**
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
- `admin_users` - Admin user accounts with roles
- `roles` - System and Verein roles (11 total)
- `permissions` - Granular permissions (33 total)

### Content Tables
- `events` - Calendar events
- `news` - News articles
- `gallery` - Photo gallery
- `shared_gallery_reports` - User photo submissions
- `portraits` - "Wir Wendesser" portraits

### Reference Tables
- `contacts` - Community contact directory

## 🔧 Environment Requirements

All scripts require:
```env
DATABASE_URL=postgresql://user:password@host/database
```

## 💡 Script Behavior

### Idempotent Scripts
Most scripts are **idempotent** - safe to run multiple times:
- ✅ `setup-roles-permissions.ts` - Checks for existing data
- ✅ `setup-verein-roles.ts` - Skips existing roles
- ✅ `create-gallery-table.ts` - Uses `CREATE TABLE IF NOT EXISTS`

### One-Time Scripts
Some scripts should only run once:
- ⚠️ `setup-admin-users.ts` - Creates default admin (may create duplicates)
- ⚠️ `add-sample-events.ts` - Adds test data every time

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

- Never commit database credentials
- Use environment variables for sensitive data
- Review scripts before running in production
- Backup database before running migration scripts
- Test scripts in development first

## 📚 Related Documentation

- [Permission Security System](../docs/PERMISSION_SECURITY.md)
- [Verein Roles Guide](../docs/VEREIN_ROLES.md)
- [Role Comparison Matrix](../docs/ROLE_COMPARISON.md)
- [Quick Admin Guide](../docs/QUICK_ADMIN_GUIDE.md)

---

**Last Updated**: October 15, 2025  
**Total Scripts**: 14  
**Required Scripts**: 4 (setup-database, setup-admin-users, setup-roles-permissions, setup-verein-roles)
