# Default Permissions Migration to Database

## Overview

The default permissions for each role have been migrated from hardcoded constants to the database. This provides better flexibility and maintainability for managing role permissions.

## What Changed

### Before

-   Default permissions were hardcoded in `lib/permissions.ts` in the `ROLE_DEFAULT_PERMISSIONS` constant
-   The same hardcoded permissions were duplicated in `lib/usePermissions.tsx` for client-side use
-   Any changes to role permissions required code changes and deployment

### After

-   Default permissions are stored in the `default_permissions` column of the `roles` table
-   Permissions are loaded from the database with caching for performance
-   Role permissions can be updated via database without code changes

## Database Schema

The `roles` table has a `default_permissions` column of type JSONB:

```sql
ALTER TABLE roles
ADD COLUMN IF NOT EXISTS default_permissions JSONB DEFAULT '[]'::jsonb;
```

Example data:

```json
{
    "name": "admin",
    "default_permissions": [
        "users.view",
        "users.create",
        "users.edit",
        "events.view"
        // ... more permissions
    ]
}
```

## Migration Process

### 1. Migration Script

Run the migration script to populate the database with current default permissions:

```bash
bun run scripts/migrate-default-permissions-to-db.ts
```

This script:

-   Reads default permissions from the previous hardcoded values
-   Updates each role in the database with its default permissions
-   Displays a summary of the migration

### 2. Code Changes

#### `lib/permissions.ts`

-   ✅ Removed `ROLE_DEFAULT_PERMISSIONS` constant
-   ✅ Removed `getRoleDefaultPermissionsSync()` deprecated function
-   ✅ Updated `getAllRolePermissions()` to load only from database (removed hardcoded fallback)
-   ✅ Kept `getRoleDefaultPermissions()` - now loads from database

#### `lib/usePermissions.tsx`

-   ✅ Removed `ROLE_DEFAULT_PERMISSIONS` constant
-   ✅ Removed `getRoleDefaultPermissions()` function
-   ✅ No functional changes - still works the same way for clients

#### Scripts Updated

-   `setup-roles-permissions.ts` - Now uses inline permissions definition
-   `migrate-role-permissions-to-db.ts` - Now uses inline permissions definition
-   `migrate-default-permissions-to-db.ts` - New script with inline permissions

## How It Works Now

### Permission Loading

1. First request: `getRoleDefaultPermissions()` loads all role permissions from database
2. Permissions are cached in memory (`rolePermissionsCache`)
3. Subsequent requests use cached data
4. Cache can be cleared with `clearRolePermissionsCache()` for fresh load

### Performance

-   Database query happens once per application restart
-   Results are cached in memory for fast access
-   No performance impact on permission checks

### Updating Permissions

To update default permissions for a role:

```sql
UPDATE roles
SET default_permissions = '["events.view", "events.create", "news.view"]'::jsonb,
    updated_at = CURRENT_TIMESTAMP
WHERE name = 'editor';
```

After updating, you may want to clear the cache:

```typescript
import { clearRolePermissionsCache } from '@/lib/permissions';
clearRolePermissionsCache();
```

Or restart the application to pick up new values.

## Current Role Permissions

### Super Admin

-   `*` (wildcard - all permissions)

### Administrator (29 permissions)

-   Users: view, create, edit, delete
-   Events: view, create, edit, delete, cancel
-   News: view, create, edit, delete
-   Gallery: view, upload, edit, delete
-   Shared Gallery: view, approve, reject
-   Portraits: view, edit, delete
-   Archive: view, create, edit, delete
-   Settings: view, edit

### Redakteur/Editor (13 permissions)

-   Events: view, create, edit, cancel
-   News: view, create, edit
-   Gallery: view, upload, edit
-   Archive: view, create, edit

### Moderator (8 permissions)

-   Events: view
-   News: view
-   Gallery: view
-   Shared Gallery: view, approve, reject
-   Portraits: view, edit

### Vereinsverwalter (6 permissions)

-   Verein Events: create, edit, cancel
-   Gallery: view, upload, edit

### No Permissions (0 permissions)

-   Empty array - for testing permission restrictions

## Testing

Run the test script to verify permissions are loading correctly:

```bash
bun run scripts/test-permission-loading.ts
```

This will:

-   Clear the cache
-   Load permissions for each role from database
-   Display the number of permissions loaded
-   Verify everything is working correctly

## Benefits

1. **Flexibility**: Role permissions can be updated via database without code changes
2. **Maintainability**: Single source of truth in the database
3. **Auditing**: Permission changes can be tracked with `updated_at` timestamp
4. **Migration Ready**: Easy to add/remove permissions or create new roles
5. **No Code Duplication**: Removed duplicated permission definitions

## Future Enhancements

Potential improvements that could be built on this foundation:

1. **Admin UI**: Create an admin interface to manage role permissions
2. **Permission Audit Log**: Track when permissions change and who changed them
3. **Dynamic Roles**: Allow creating custom roles with custom permission sets
4. **Permission Groups**: Group related permissions for easier management
5. **Time-based Permissions**: Temporary permission grants with expiration

## Rollback

If needed to rollback to hardcoded permissions:

1. The migration script `migrate-default-permissions-to-db.ts` contains all the original permission definitions
2. Restore the `ROLE_DEFAULT_PERMISSIONS` constant in `lib/permissions.ts`
3. Update `getAllRolePermissions()` to merge hardcoded with database values
4. Restore the constant in `lib/usePermissions.tsx`

However, this should not be necessary as the database now contains the same permissions that were previously hardcoded.

## Related Files

-   `lib/permissions.ts` - Permission checking logic
-   `lib/usePermissions.tsx` - Client-side permission hooks
-   `scripts/migrate-default-permissions-to-db.ts` - Migration script
-   `scripts/test-permission-loading.ts` - Test script
-   `scripts/setup-roles-permissions.ts` - Initial role setup
-   Database table: `roles` with `default_permissions` column

## Migration Date

Completed: November 24, 2025
