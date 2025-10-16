# Permission-Based System Migration

## Overview

The system has been successfully migrated from a **role-based** permission system to a **permission-based** system. This change makes the system more dynamic and flexible for future role creation.

## Key Changes

### Before (Role-Based System)
- Roles defined fixed permissions that couldn't be removed
- Users had role permissions + custom permissions
- Permission checks looked at both role and custom permissions
- Adding/removing permissions was complex

### After (Permission-Based System)
- **Roles are now templates** that define default permissions
- At user creation, role default permissions are copied to `custom_permissions`
- All permission checks only look at `custom_permissions`
- Users can have any combination of permissions
- Extra permissions calculated as: `total permissions - role defaults`

## How It Works

### 1. User Creation
When creating a new user:
1. Select a role (admin, editor, moderator, vereinsverwalter, etc.)
2. System copies role's default permissions to user's `custom_permissions`
3. User now has all permissions from the role template
4. Additional permissions can be added or removed freely

### 2. Permission Checking
```typescript
// Only checks custom_permissions field
hasPermission(user, 'events.create')
// Returns true if 'events.create' is in user.customPermissions
```

### 3. Extra Permissions Calculation
```typescript
// Calculate additional permissions beyond role defaults
const roleDefaults = getRoleDefaultPermissions(user.roleName);
const extraPerms = user.customPermissions.filter(p => !roleDefaults.includes(p));
```

## Benefits

1. **Dynamic Role Creation**: Create new roles by defining default permission templates
2. **Full Flexibility**: Any user can have any permission combination
3. **Clear Tracking**: Easy to see which permissions are "extra" beyond role defaults
4. **Simplified Logic**: Single source of truth (custom_permissions)
5. **Better UX**: Users can remove role-default permissions if needed

## Migration Results

✅ **2 users migrated successfully**
- `admin` (super_admin): 1 permission (wildcard *)
- `test` (vereinsverwalter): 6 permissions (verein events + gallery)

All existing users now have their role's default permissions assigned to `custom_permissions`, with any previous custom permissions preserved.

## Role Templates

Current role default permissions:

### super_admin
- `*` (wildcard - all permissions)

### admin
- All user, event, news, gallery, shared_gallery, portrait, and settings permissions

### editor
- Events: view, create, edit, cancel
- News: view, create, edit
- Gallery: view, upload, edit

### moderator
- Events: view
- News: view
- Gallery: view
- Shared Gallery: view, approve, reject
- Portraits: view, edit

### vereinsverwalter
- Verein Events: create, edit, cancel
- Gallery: view, upload, edit

### no_permissions
- No default permissions (empty template)

## UI Changes

### Permissions Modal
- ✅ Shield icon (🛡️) shows permissions that are role defaults
- ✅ Can now remove role-default permissions
- ✅ Footer shows: "X additional permissions" beyond role defaults
- ✅ Highlighted permissions are from role template (informational)

## Files Changed

1. **lib/permissions.ts** - Server-side permission checking
2. **lib/usePermissions.tsx** - Client-side permission checking
3. **app/api/admin/users/create/route.ts** - Assigns role defaults at creation
4. **app/components/PermissionsModal.tsx** - Updated UI and logic
5. **scripts/migrate-to-permission-based-system.ts** - Migration script

## Future: Adding New Roles

To add a new role:

1. Create role in `roles` table (if UI-driven)
2. Add default permissions to `ROLE_DEFAULT_PERMISSIONS` in:
   - `lib/permissions.ts`
   - `lib/usePermissions.tsx`
3. That's it! New users with this role will get the template permissions

No code changes needed for permission checks - everything is permission-based now.
