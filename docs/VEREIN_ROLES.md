# Verein Roles - Setup & Usage Guide

## Overview

The system now includes dedicated roles for each Verein (club/association) in Wendessen. Each Verein can have their own administrators who can manage their Verein's content independently.

## Available Verein Roles

The following Verein roles have been created:

| Verein                  | Role Name                        | Display Name                               |
| ----------------------- | -------------------------------- | ------------------------------------------ |
| SV Wendessen            | `verein_sv-wendessen`            | SV Wendessen - Vereinsverwalter            |
| Freiwillige Feuerwehr   | `verein_feuerwehr`               | Freiwillige Feuerwehr - Vereinsverwalter   |
| Jugendfeuerwehr         | `verein_jugendfeuerwehr`         | Jugendfeuerwehr - Vereinsverwalter         |
| Kleingärtner-Verein     | `verein_kleingaertner`           | Kleingärtner-Verein - Vereinsverwalter     |
| Kirchbauverein          | `verein_kirchbauverein`          | Kirchbauverein - Vereinsverwalter          |
| Initiative Spritzenhaus | `verein_initiative-spritzenhaus` | Initiative Spritzenhaus - Vereinsverwalter |
| Schützenverein          | `verein_schuetzenverein`         | Schützenverein - Vereinsverwalter          |

## Default Permissions

Each Verein role has the following default permissions:

### Events Management

-   `verein.events.create` - Create events for their Verein
-   `verein.events.edit` - Edit their Verein's events
-   `verein.events.delete` - Delete their Verein's events

### Gallery Management

-   `verein.gallery.upload` - Upload images for their Verein
-   `verein.gallery.edit` - Edit their Verein's images
-   `verein.gallery.delete` - Delete their Verein's images

## What Verein Users CAN Do

✅ Manage their own Verein's events
✅ Upload and manage gallery images for their Verein
✅ View all public content on the website

## What Verein Users CANNOT Do

❌ Manage other Vereine's content
❌ Create or edit news articles
❌ View or manage admin users
❌ Access system settings
❌ Approve/reject submissions from other users
❌ Delete content from other Vereine

## Creating a Verein Admin User

### Via Admin Panel

1. Log in as Super Admin or Administrator
2. Go to **Admin Dashboard** → **Admin-Benutzer**
3. Click **Neuer Admin**
4. Fill in the form:
    - **Username**: Choose a username (e.g., `sv-wendessen-admin`)
    - **Role**: Select the appropriate Verein role from dropdown
5. Click **Erstellen**
6. Share the generated 6-digit password with the Verein contact
7. User must change password on first login

### Example Usernames

Good username conventions:

-   `sv-wendessen-admin`
-   `feuerwehr-admin`
-   `jugendfeuerwehr-admin`
-   `kleingaertner-admin`

## Technical Implementation

### Database Setup

Run the setup script to create all Verein roles and permissions:

```bash
bun run setup-verein-roles
```

This script:

1. Creates 9 new permissions in the `verein` category
2. Creates 7 roles (one for each Verein)
3. Links roles to the Verein IDs from `lib/vereine-data.ts`

### Permission Checking

The system automatically recognizes Verein roles by the `verein_` prefix:

```typescript
// Server-side (lib/permissions.ts)
import { isVereinUser, getVereinIdFromRole } from '@/lib/permissions';

const user = await getCurrentAdminUser();
if (isVereinUser(user)) {
    const vereinId = getVereinIdFromRole(user.roleName!);
    // vereinId = 'sv-wendessen', 'feuerwehr', etc.
}
```

### Role Recognition

The permission system automatically detects Verein roles:

```typescript
function isVereinRole(roleName: string): boolean {
    return roleName.startsWith('verein_');
}
```

Any role starting with `verein_` automatically gets the default Verein permissions.

## Content Filtering (Future Implementation)

### Recommended Implementation

When implementing content filtering, use the Verein ID to filter:

```typescript
// Example: Get events for a specific Verein
const user = await getCurrentAdminUser();

if (isVereinUser(user)) {
    const vereinId = getVereinIdFromRole(user.roleName!);
    // Filter events by vereinId
    const events = await getEventsByVerein(vereinId);
}
```

### Database Schema Extension

To enable Verein-specific content, add a `verein_id` column to tables:

```sql
ALTER TABLE events ADD COLUMN verein_id VARCHAR(100);
ALTER TABLE news ADD COLUMN verein_id VARCHAR(100);
ALTER TABLE gallery ADD COLUMN verein_id VARCHAR(100);

CREATE INDEX idx_events_verein ON events(verein_id);
CREATE INDEX idx_news_verein ON news(verein_id);
CREATE INDEX idx_gallery_verein ON gallery(verein_id);
```

### Content Creation with Verein Context

```typescript
// In API route for creating event
import {
    requirePermission,
    getVereinIdFromRole,
    isVereinUser,
} from '@/lib/permissions';

export async function POST(request: NextRequest) {
    const user = await requirePermission('verein.events.create');
    const data = await request.json();

    // If user is a Verein admin, automatically set verein_id
    if (isVereinUser(user)) {
        data.verein_id = getVereinIdFromRole(user.roleName!);
    }

    // Create event with verein_id
    await createEvent(data);
}
```

## UI Customization

### Show/Hide Based on Verein Role

```tsx
import { usePermissions } from '@/lib/usePermissions';
import { WithPermission } from '@/lib/usePermissions';

function EventManager() {
    const { user, hasPermission } = usePermissions();

    return (
        <div>
            {/* Only show to Verein users */}
            <WithPermission permission="verein.events.create">
                <CreateEventButton />
            </WithPermission>

            {/* Show different UI for Verein vs global admins */}
            {user?.roleName?.startsWith('verein_') ? (
                <VereinEventsList
                    vereinId={user.roleName.replace('verein_', '')}
                />
            ) : (
                <AllEventsList />
            )}
        </div>
    );
}
```

## Adding New Vereine

If a new Verein is added to the system:

1. **Update `lib/vereine-data.ts`**: Add the new Verein to the `vereineData` array
2. **Update Setup Script**: Add the Verein to `scripts/setup-verein-roles.ts`
3. **Run Setup**: Execute `bun run setup-verein-roles`
4. **Create Admin User**: Create a new admin user with the new Verein role

## Security Considerations

### Verein Isolation

⚠️ **Important**: Currently, Verein users have permissions to manage "their" content, but **content filtering by Verein is not yet enforced** at the database level.

**Recommended Implementation**:

1. Add `verein_id` column to content tables
2. Filter queries by `verein_id` for Verein users
3. Prevent Verein users from accessing other Vereine's content
4. Validate `verein_id` matches user's role on create/update/delete

### Permission Escalation Prevention

✅ Verein users cannot:

-   Change their own role
-   Grant themselves additional permissions
-   Access user management
-   Create other admin users

## Testing Verein Roles

### Test Checklist

-   [ ] Create a test user with a Verein role
-   [ ] Log in as that user
-   [ ] Verify they can create events (with `verein.events.create`)
-   [ ] Verify they can edit events (with `verein.events.edit`)
-   [ ] Verify they cannot access user management
-   [ ] Verify they cannot access other Vereine's content (when filtering is implemented)
-   [ ] Test password change on first login
-   [ ] Test permission denial for unauthorized actions

## Troubleshooting

### User Can't Access Verein Features

1. Check user's role: Should be `verein_{verein-id}`
2. Verify permissions are set correctly
3. Check if user needs to log out/in after role assignment
4. Verify the Verein role exists in database

### Wrong Verein Content Showing

1. Ensure content has `verein_id` set correctly
2. Check filtering logic in API routes
3. Verify `getVereinIdFromRole()` returns correct ID
4. Check database queries include `WHERE verein_id = ?`

## Future Enhancements

Possible improvements:

-   [ ] Multi-Verein users (one user can manage multiple Vereine)
-   [ ] Verein hierarchy (parent-child relationships)
-   [ ] Verein-specific settings and customization
-   [ ] Delegation (Verein admin can create sub-admins)
-   [ ] Content approval workflow for Vereine
-   [ ] Analytics per Verein

---

**Setup Status**: ✅ Roles and permissions created  
**Database Schema**: ⚠️ Requires `verein_id` column in content tables  
**Content Filtering**: ⚠️ Not yet implemented  
**Last Updated**: October 15, 2025
