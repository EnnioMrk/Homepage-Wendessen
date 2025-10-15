# Permission Security System - Implementation Guide

## ✅ System Status: **ACTIVE**

The permission checking system is now **fully implemented and enforced** across all admin routes and UI components.

## Overview

A comprehensive role-based access control (RBAC) system with additional custom permissions per user. All admin actions are now protected by permission checks both on the server and client side.

## Architecture

### Server-Side (lib/permissions.ts)
- Permission checking functions
- Role-permission mappings
- Middleware helpers for API routes
- Error handling for unauthorized access

### Client-Side (lib/usePermissions.tsx)
- React hooks for permission checking
- Context provider for user permissions
- Component wrappers for conditional rendering
- Real-time permission status

## Permission Structure

### Permission Naming Convention
Permissions follow the pattern: `{category}.{action}`

Examples:
- `events.create` - Create events
- `users.delete` - Delete users
- `gallery.upload` - Upload to gallery

### Categories
1. **users** - User management
2. **events** - Event management
3. **news** - News management  
4. **gallery** - Gallery management
5. **shared_gallery** - Impressionen/submissions
6. **portraits** - Portrait submissions
7. **settings** - System settings
8. **verein** - Verein-specific content management

## Role Permissions

### Super Admin (`super_admin`)
- **Wildcard access**: `*` (all permissions)
- Full system access
- Cannot be restricted

### Administrator (`admin`)
- All standard CRUD operations
- User management
- Content management
- Approval permissions
- Settings access

### Redakteur/Editor (`editor`)
- Content creation and editing
- Events, News, Gallery management
- **Cannot**: Manage users, delete content, change settings

### Moderator (`moderator`)
- View content
- Approve/reject submissions
- **Cannot**: Create/edit content, manage users

### Verein Roles (`verein_*`)
- **Pattern**: `verein_{verein-id}` (e.g., `verein_sv-wendessen`, `verein_feuerwehr`)
- Manage their own Verein's content:
  - Events (create, edit, delete)
  - News (create, edit, delete)
  - Gallery images (upload, edit, delete)
- **Cannot**: Manage other Vereine's content, manage users, access system settings
- **Available Vereine**:
  - `verein_sv-wendessen` - SV Wendessen
  - `verein_feuerwehr` - Freiwillige Feuerwehr
  - `verein_jugendfeuerwehr` - Jugendfeuerwehr
  - `verein_kleingaertner` - Kleingärtner-Verein
  - `verein_kirchbauverein` - Kirchbauverein
  - `verein_initiative-spritzenhaus` - Initiative Spritzenhaus
  - `verein_schuetzenverein` - Schützenverein

## Server-Side Usage

### Basic Permission Check

```typescript
import { requirePermission } from '@/lib/permissions';

export async function POST(request: NextRequest) {
    try {
        // Will throw error if user doesn't have permission
        await requirePermission('events.create');
        
        // User has permission, continue...
        const data = await request.json();
        // ... create event
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message.includes('Unauthorized') ? 401 : 403 }
        );
    }
}
```

### Multiple Permission Checks

```typescript
import { requireAnyPermission, requireAllPermissions } from '@/lib/permissions';

// User needs at least ONE of these permissions
await requireAnyPermission(['events.edit', 'events.delete']);

// User needs ALL of these permissions
await requireAllPermissions(['users.view', 'users.edit']);
```

### Using Middleware Helper

```typescript
import { withPermission } from '@/lib/permissions';

export async function DELETE(request: NextRequest) {
    return withPermission('events.delete', async (user) => {
        // user is guaranteed to have permission here
        await deleteEvent(id);
        return NextResponse.json({ success: true });
    });
}
```

### Soft Permission Check

```typescript
import { canPerformAction } from '@/lib/permissions';

// Returns boolean, doesn't throw
const canDelete = await canPerformAction('events.delete');
if (canDelete) {
    // Show delete button
}
```

## Client-Side Usage

### Setup Provider

Wrap your admin layout with the PermissionsProvider:

```typescript
import { PermissionsProvider } from '@/lib/usePermissions';

export default function AdminLayout({ children }) {
    return (
        <PermissionsProvider>
            {children}
        </PermissionsProvider>
    );
}
```

### Using the Hook

```typescript
import { usePermissions, useHasPermission } from '@/lib/usePermissions';

function MyComponent() {
    const { hasPermission, user, loading } = usePermissions();
    
    if (loading) return <div>Loading...</div>;
    
    return (
        <div>
            {hasPermission('events.create') && (
                <button>Create Event</button>
            )}
            
            {hasPermission('events.delete') && (
                <button>Delete Event</button>
            )}
        </div>
    );
}

// Or use the convenience hook
function SimpleComponent() {
    const canCreate = useHasPermission('events.create');
    
    return canCreate ? <CreateButton /> : null;
}
```

### Component Wrappers

```typescript
import { WithPermission, WithAnyPermission } from '@/lib/usePermissions';

function MyComponent() {
    return (
        <>
            <WithPermission permission="events.create">
                <CreateEventButton />
            </WithPermission>
            
            <WithPermission 
                permission="events.delete"
                fallback={<p>No permission to delete</p>}
            >
                <DeleteEventButton />
            </WithPermission>
            
            <WithAnyPermission permissions={['events.edit', 'events.delete']}>
                <AdminControls />
            </WithAnyPermission>
        </>
    );
}
```

## Protected Routes

All admin API routes are now protected:

### Events
- `POST /api/events` → `events.create`
- `PUT /api/events/[id]` → `events.edit`
- `DELETE /api/events/[id]` → `events.delete`

### Users
- `GET /api/admin/users` → `users.view`
- `POST /api/admin/users/create` → `users.create`
- `DELETE /api/admin/users/[id]` → `users.delete`
- `PATCH /api/admin/users/[id]/permissions` → `users.edit`

### Roles & Permissions
- `GET /api/admin/roles` → `users.view`
- `GET /api/admin/permissions` → `users.view`

## Custom Permissions

Users can have custom permissions in addition to their role permissions:

```typescript
// In database: custom_permissions column stores JSON array
custom_permissions: ["events.delete", "users.view"]

// These are checked alongside role permissions
hasPermission(user, 'events.delete') // true (from custom)
hasPermission(user, 'events.create') // depends on role
```

## Error Handling

### Server-Side Errors

```typescript
try {
    await requirePermission('events.create');
} catch (error) {
    if (error.message.includes('Unauthorized')) {
        // User not logged in (401)
    } else if (error.message.includes('Forbidden')) {
        // User logged in but lacks permission (403)
    }
}
```

### Client-Side Errors

The client-side hooks gracefully handle missing permissions:
- `hasPermission()` returns `false` if user lacks permission
- No errors thrown
- UI simply doesn't render protected elements

## Testing Permissions

### Test Different Roles

1. Create test users with different roles
2. Log in as each user
3. Try accessing protected routes
4. Verify appropriate access/denial

### Test Custom Permissions

1. Assign custom permission to user
2. Verify access to that specific action
3. Verify role permissions still work

### Test Permission Denial

1. Log in as user without permission
2. Try accessing protected route
3. Should receive 403 Forbidden error
4. UI elements should be hidden

## Environment Variables

```env
# Enable/disable permission checking (default: enabled)
ENABLE_PERMISSION_CHECKING=true

# Set to false during development to disable checks
ENABLE_PERMISSION_CHECKING=false
```

## Security Best Practices

### ✅ Do's
- Always check permissions on the server
- Use client-side checks only for UI
- Check permissions as early as possible
- Use specific permissions, not wildcards
- Log permission denials for security audits

### ❌ Don'ts
- Don't rely only on client-side checks
- Don't use wildcards except for super admin
- Don't bypass checks in production
- Don't expose sensitive data before permission check
- Don't hardcode permission checks in multiple places

## Migration from Old System

The old `isAuthenticated()` checks have been replaced with `requirePermission()`:

### Before
```typescript
const authenticated = await isAuthenticated();
if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### After
```typescript
await requirePermission('events.create');
```

## Troubleshooting

### User Can't Perform Action

1. Check user's role: `console.log(user.roleName)`
2. Check custom permissions: `console.log(user.customPermissions)`
3. Verify permission name matches exactly
4. Check role-permission mappings in `lib/permissions.ts`

### Permission Check Always Fails

1. Verify user is authenticated
2. Check role is assigned to user
3. Verify permission exists in role mapping
4. Check for typos in permission names

### Client-Side Hook Not Working

1. Ensure PermissionsProvider wraps components
2. Check `/api/admin/me` endpoint is accessible
3. Verify user session is valid
4. Check browser console for errors

## Performance Considerations

- Permission checks are fast (in-memory lookups)
- User permissions loaded once per session
- Client-side permissions cached in React context
- No database queries for permission checks
- Role mappings are hardcoded for performance

## Future Enhancements

Possible improvements:
- Database-driven role-permission mappings
- Permission inheritance
- Resource-level permissions (e.g., only edit own events)
- Time-based permissions
- Permission groups/templates
- Audit logging for permission changes

## API Reference

### Server Functions

- `hasPermission(user, permission)` - Check single permission
- `hasAnyPermission(user, permissions)` - Check if user has any
- `hasAllPermissions(user, permissions)` - Check if user has all
- `requirePermission(permission)` - Throw if missing
- `requireAnyPermission(permissions)` - Throw if missing any
- `requireAllPermissions(permissions)` - Throw if missing all
- `withPermission(permission, handler)` - Middleware wrapper
- `canPerformAction(permission)` - Soft check (boolean)
- `isVereinUser(user)` - Check if user belongs to a Verein
- `getVereinIdFromRole(roleName)` - Extract Verein ID from role name

### Client Hooks

- `usePermissions()` - Get full permissions context
- `useHasPermission(permission)` - Check single permission
- `useHasAnyPermission(permissions)` - Check any permissions
- `<WithPermission>` - Conditional render component
- `<WithAnyPermission>` - Conditional render component

---

**Status**: ✅ Fully implemented and active  
**Version**: 1.0  
**Last Updated**: October 15, 2025
