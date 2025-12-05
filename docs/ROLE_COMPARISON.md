# Role Comparison Matrix

Quick reference for all roles in the system.

## Role Overview

| Role              | Type   | Users   | Events         | News           | Gallery        | Submissions | Settings |
| ----------------- | ------ | ------- | -------------- | -------------- | -------------- | ----------- | -------- |
| **Super Admin**   | System | ✅ Full | ✅ Full        | ✅ Full        | ✅ Full        | ✅ Approve  | ✅ Full  |
| **Administrator** | System | ✅ Full | ✅ Full        | ✅ Full        | ✅ Full        | ✅ Approve  | ✅ Edit  |
| **Redakteur**     | System | ❌      | ✅ Create/Edit | ✅ Create/Edit | ✅ Upload/Edit | ❌          | ❌       |
| **Moderator**     | System | ❌      | 👁️ View        | 👁️ View        | 👁️ View        | ✅ Approve  | ❌       |
| **Verein Admin**  | Verein | ❌      | ✅ Own only    | ✅ Own only    | ✅ Own only    | ❌          | ❌       |

### Legend

-   ✅ **Full** - Complete CRUD access (Create, Read, Update, Delete)
-   ✅ **Create/Edit** - Can create and edit, cannot delete
-   ✅ **Own only** - Can manage only their Verein's content
-   ✅ **Approve** - Can approve/reject submissions
-   👁️ **View** - Read-only access
-   ❌ - No access

## Detailed Permissions Matrix

### User Management

| Permission     | Super Admin | Administrator | Redakteur | Moderator | Verein Admin |
| -------------- | ----------- | ------------- | --------- | --------- | ------------ |
| `users.view`   | ✅          | ✅            | ❌        | ❌        | ❌           |
| `users.create` | ✅          | ✅            | ❌        | ❌        | ❌           |
| `users.edit`   | ✅          | ✅            | ❌        | ❌        | ❌           |
| `users.delete` | ✅          | ✅            | ❌        | ❌        | ❌           |

### Events Management

| Permission             | Super Admin | Administrator | Redakteur | Moderator | Verein Admin |
| ---------------------- | ----------- | ------------- | --------- | --------- | ------------ |
| `events.view`          | ✅          | ✅            | ✅        | ✅        | ✅\*         |
| `events.create`        | ✅          | ✅            | ✅        | ❌        | ⚠️†          |
| `events.edit`          | ✅          | ✅            | ✅        | ❌        | ⚠️†          |
| `events.delete`        | ✅          | ✅            | ❌        | ❌        | ⚠️†          |
| `verein.events.create` | ✅          | ❌            | ❌        | ❌        | ✅           |
| `verein.events.edit`   | ✅          | ❌            | ❌        | ❌        | ✅           |
| `verein.events.delete` | ✅          | ❌            | ❌        | ❌        | ✅           |

\* Can view all events  
† Uses `verein.*` permissions for own content only

### News Management

| Permission    | Super Admin | Administrator | Redakteur | Moderator | Verein Admin |
| ------------- | ----------- | ------------- | --------- | --------- | ------------ |
| `news.view`   | ✅          | ✅            | ✅        | ✅        | ✅\*         |
| `news.create` | ✅          | ✅            | ✅        | ❌        | ❌           |
| `news.edit`   | ✅          | ✅            | ✅        | ❌        | ❌           |
| `news.delete` | ✅          | ✅            | ❌        | ❌        | ❌           |

\* Can view all news

### Gallery Management

| Permission              | Super Admin | Administrator | Redakteur | Moderator | Verein Admin |
| ----------------------- | ----------- | ------------- | --------- | --------- | ------------ |
| `gallery.view`          | ✅          | ✅            | ✅        | ✅        | ✅\*         |
| `gallery.upload`        | ✅          | ✅            | ✅        | ❌        | ⚠️†          |
| `gallery.edit`          | ✅          | ✅            | ✅        | ❌        | ⚠️†          |
| `gallery.delete`        | ✅          | ✅            | ❌        | ❌        | ⚠️†          |
| `verein.gallery.upload` | ✅          | ❌            | ❌        | ❌        | ✅           |
| `verein.gallery.edit`   | ✅          | ❌            | ❌        | ❌        | ✅           |
| `verein.gallery.delete` | ✅          | ❌            | ❌        | ❌        | ✅           |

\* Can view all gallery  
† Uses `verein.*` permissions for own content only

### Submissions Management

| Permission               | Super Admin | Administrator | Redakteur | Moderator | Verein Admin |
| ------------------------ | ----------- | ------------- | --------- | --------- | ------------ |
| `shared_gallery.view`    | ✅          | ✅            | ❌        | ✅        | ❌           |
| `shared_gallery.approve` | ✅          | ✅            | ❌        | ✅        | ❌           |
| `shared_gallery.reject`  | ✅          | ✅            | ❌        | ✅        | ❌           |
| `portraits.view`         | ✅          | ✅            | ❌        | ✅        | ❌           |
| `portraits.approve`      | ✅          | ✅            | ❌        | ✅        | ❌           |
| `portraits.reject`       | ✅          | ✅            | ❌        | ✅        | ❌           |

### Settings Management

| Permission      | Super Admin | Administrator | Redakteur | Moderator | Verein Admin |
| --------------- | ----------- | ------------- | --------- | --------- | ------------ |
| `settings.view` | ✅          | ✅            | ❌        | ❌        | ❌           |
| `settings.edit` | ✅          | ✅            | ❌        | ❌        | ❌           |

## Role Use Cases

### Super Admin

**When to use**: System owner, technical administrator

-   Complete control over everything
-   Can override any restriction
-   Typically 1-2 users maximum
-   **Example**: Website developer, IT administrator

### Administrator

**When to use**: Trusted content and user manager

-   Manages all content across all Vereine
-   Can create and manage other admin users
-   Can configure system settings
-   **Example**: Village council member, website manager

### Redakteur (Editor)

**When to use**: Content creators and maintainers

-   Can create and edit all public content
-   Cannot delete content or manage users
-   Ideal for regular content updates
-   **Example**: Newsletter editor, event coordinator

### Moderator

**When to use**: Quality control and approval

-   Reviews and approves user submissions
-   Cannot create original content
-   Cannot manage administrative functions
-   **Example**: Community manager, submission reviewer

### Verein Admin

**When to use**: Individual club/association management

-   Each Verein gets their own dedicated admin
-   Can only manage their Verein's content
-   Independent from other Vereine
-   **Example**: SV Wendessen board member, Feuerwehr Wehrführer

## Permission Inheritance

```
Super Admin (*)
    └── All permissions automatically

Administrator
    ├── All content permissions
    ├── User management
    └── Settings (edit only)

Redakteur
    └── Content creation/editing (no delete)

Moderator
    ├── Content viewing
    └── Submission approval

Verein Admin (verein_*)
    └── Own Verein content only
        ├── Events (create/edit/delete)
        ├── News (create/edit/delete)
        └── Gallery (upload/edit/delete)
```

## Custom Permissions

All roles (except Super Admin) can be extended with custom permissions:

```typescript
// Example: Give a Moderator delete permissions
customPermissions: ['events.delete', 'news.delete'];

// Example: Give a Verein Admin additional permissions
customPermissions: ['shared_gallery.view', 'portraits.view'];

// Example: Restrict an Administrator
customPermissions: []; // Cannot add restrictions, only additions
```

## Common Combinations

### Multi-Verein Manager

**Role**: Verein Admin + Custom Permissions

```json
{
    "role": "verein_sv-wendessen",
    "customPermissions": ["verein.feuerwehr.*", "verein.jugendfeuerwehr.*"]
}
```

### Power Editor

**Role**: Redakteur + Custom Permissions

```json
{
    "role": "editor",
    "customPermissions": ["events.delete", "news.delete", "gallery.delete"]
}
```

### Limited Administrator

**Role**: Administrator (inherent permissions cannot be removed)

-   Administrators always have full permissions
-   Cannot restrict an Administrator without changing their role

## Quick Decision Guide

**Choose Super Admin if:**

-   ✅ User needs complete system access
-   ✅ User handles technical configuration
-   ✅ User is the ultimate authority

**Choose Administrator if:**

-   ✅ User manages content across all Vereine
-   ✅ User needs to create other admins
-   ✅ User configures system settings

**Choose Redakteur if:**

-   ✅ User creates/edits content regularly
-   ✅ User should not delete content
-   ✅ User does not need user management

**Choose Moderator if:**

-   ✅ User only reviews submissions
-   ✅ User does not create original content
-   ✅ User provides quality control

**Choose Verein Admin if:**

-   ✅ User represents a specific Verein
-   ✅ User should only manage their Verein's content
-   ✅ User should not access other Vereine's data

---

**Last Updated**: October 15, 2025  
**Total Roles**: 11 (4 system + 7 Verein)  
**Total Permissions**: 33 (24 system + 9 Verein)
