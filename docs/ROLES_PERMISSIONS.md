# Roles and Permissions System

## Overview

The admin system now includes a comprehensive roles and permissions framework. While permissions are **not yet enforced** in the application logic, the infrastructure is in place for future implementation.

## Database Structure

### Tables Created

1. **`roles`** - Predefined user roles
   - `id` - Primary key
   - `name` - Unique role identifier (e.g., 'super_admin', 'admin')
   - `display_name` - Human-readable name (e.g., 'Super Admin')
   - `description` - Role description
   - `created_at`, `updated_at` - Timestamps

2. **`permissions`** - Individual permissions
   - `id` - Primary key
   - `name` - Unique permission identifier (e.g., 'events.create')
   - `display_name` - Human-readable name
   - `description` - Permission description
   - `category` - Groups permissions (e.g., 'events', 'news', 'users')
   - `created_at`, `updated_at` - Timestamps

3. **`admin_users` (updated)** - Added columns:
   - `role_id` - Foreign key to roles table
   - `custom_permissions` - JSONB array of additional permission names

## Default Roles

Four roles are created automatically:

1. **Super Admin** (`super_admin`)
   - Full access to everything
   - Intended for system administrators

2. **Administrator** (`admin`)
   - Content and user management
   - Default role for new users

3. **Redakteur** (`editor`)
   - Content editing only (events, news, gallery)
   - Cannot manage users

4. **Moderator** (`moderator`)
   - Review and approve submissions
   - Cannot create or edit content directly

## Permission Categories

Permissions are organized into categories:

### Users Management (`users`)
- `users.view` - View user list
- `users.create` - Create new users
- `users.edit` - Edit user details
- `users.delete` - Delete users

### Events Management (`events`)
- `events.view` - View events
- `events.create` - Create events
- `events.edit` - Edit events
- `events.delete` - Delete events

### News Management (`news`)
- `news.view` - View news
- `news.create` - Create news
- `news.edit` - Edit news
- `news.delete` - Delete news

### Gallery Management (`gallery`)
- `gallery.view` - View gallery
- `gallery.upload` - Upload images
- `gallery.edit` - Edit images
- `gallery.delete` - Delete images

### Shared Gallery / Impressionen (`shared_gallery`)
- `shared_gallery.view` - View submissions
- `shared_gallery.approve` - Approve submissions
- `shared_gallery.reject` - Reject submissions

### Portraits Management (`portraits`)
- `portraits.view` - View portrait submissions
- `portraits.approve` - Approve portraits
- `portraits.reject` - Reject portraits

### Settings & Configuration (`settings`)
- `settings.view` - View settings
- `settings.edit` - Edit settings

## How It Works

### Role-Based Permissions
Each admin user is assigned a **role** that determines their base permissions. In the future, you can define which permissions each role has access to.

### Custom Permissions
In addition to role-based permissions, each user can have **custom permissions** - additional permissions granted specifically to that user, stored as a JSON array in the `custom_permissions` column.

### Permission Storage in Session
When a user logs in, their role and permissions are stored in the session token, making them easily accessible throughout the application.

## Current Implementation Status

### ✅ What's Implemented
- Database tables for roles and permissions
- UI to assign roles to users
- UI to grant custom permissions to users
- API endpoints to manage roles and permissions
- Display of roles and permissions in admin user list
- Session storage of role information

### ❌ What's NOT Implemented (Yet)
- **Permission checking** - No actual enforcement of permissions
- **Route protection** based on permissions
- **UI element hiding** based on permissions
- **API authorization** checks based on permissions

## Usage

### Assigning Roles

When creating a new admin user:
1. Select a role from the dropdown (defaults to "Administrator")
2. The role is saved with the user

### Granting Custom Permissions

1. Navigate to `/admin/users`
2. Click the gear icon (⚙️) next to a user
3. Check/uncheck permissions in the modal
4. Click "Speichern" to save

Permissions are organized by category for easy browsing.

### Viewing User Permissions

In the user list:
- Role is displayed as a blue badge
- Custom permission count shows as "+X spezielle Berechtigung(en)"

## Future Implementation

To actually enforce permissions, you'll need to:

1. **Create a Permission Helper**
   ```typescript
   // lib/permissions.ts
   export function hasPermission(user: AdminUser, permission: string): boolean {
       // Check role permissions + custom permissions
       return user.customPermissions?.includes(permission) || false;
   }
   ```

2. **Protect API Routes**
   ```typescript
   // In API routes
   const user = await getCurrentAdminUser();
   if (!hasPermission(user, 'events.create')) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
   }
   ```

3. **Conditionally Render UI**
   ```typescript
   // In components
   {hasPermission(currentUser, 'events.create') && (
       <button>Create Event</button>
   )}
   ```

## Setup

Run the setup script to create tables and seed default data:

```bash
bun run setup-roles-permissions
```

This will:
- Create `roles` and `permissions` tables
- Add `role_id` and `custom_permissions` columns to `admin_users`
- Insert default roles and permissions
- Assign existing users to the "Super Admin" role

## API Endpoints

- `GET /api/admin/roles` - List all roles
- `GET /api/admin/permissions` - List all permissions (grouped by category)
- `PATCH /api/admin/users/[id]/permissions` - Update user's role and custom permissions

## Notes

- The system is designed to be flexible and extensible
- Permissions are stored by name (e.g., 'events.create') for easy checking
- Custom permissions are stored as a JSON array for efficient storage
- All existing admin users are automatically assigned "Super Admin" role during setup
- You cannot delete the last admin user (existing safeguard still applies)

## Migration Path

The system is fully backward compatible:
- Existing admin users continue to work
- They're automatically assigned "Super Admin" role
- No changes needed to existing code
- Permissions can be added gradually

---

**Status**: Infrastructure complete, enforcement pending implementation
**Version**: 1.0
**Last Updated**: October 15, 2025
