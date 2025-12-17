import { describe, test, expect } from 'bun:test';
import {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getRoleDefaultPermissions,
    getUserPermissions,
    getExtraPermissions,
    getPermissionCategory,
    ROLE_DEFAULT_PERMISSIONS,
    PERMISSION_CATEGORIES,
} from '../../lib/permissions';
import type { AdminUser } from '../../lib/auth';

// Helper to create mock admin users
function createMockUser(overrides: Partial<AdminUser> = {}): AdminUser {
    return {
        id: 1,
        username: 'testuser',
        mustChangePassword: false,
        createdAt: new Date(),
        ...overrides,
    };
}

describe('Permissions', () => {
    describe('ROLE_DEFAULT_PERMISSIONS', () => {
        test('super_admin has wildcard permission', () => {
            expect(ROLE_DEFAULT_PERMISSIONS.super_admin).toContain('*');
        });

        test('admin has comprehensive permissions', () => {
            const adminPerms = ROLE_DEFAULT_PERMISSIONS.admin;
            expect(adminPerms).toContain('users.view');
            expect(adminPerms).toContain('events.create');
            expect(adminPerms).toContain('news.edit');
            expect(adminPerms).toContain('gallery.upload');
            expect(adminPerms).toContain('settings.edit');
        });

        test('editor has content management permissions', () => {
            const editorPerms = ROLE_DEFAULT_PERMISSIONS.editor;
            expect(editorPerms).toContain('events.view');
            expect(editorPerms).toContain('events.create');
            expect(editorPerms).toContain('news.create');
            expect(editorPerms).not.toContain('users.create');
            expect(editorPerms).not.toContain('settings.edit');
        });

        test('moderator has approval permissions', () => {
            const modPerms = ROLE_DEFAULT_PERMISSIONS.moderator;
            expect(modPerms).toContain('shared_gallery.edit');
            expect(modPerms).toContain('portraits.view');
            expect(modPerms).not.toContain('events.create');
        });

        test('vereinsverwalter has verein-specific permissions', () => {
            const vereinPerms = ROLE_DEFAULT_PERMISSIONS.vereinsverwalter;
            expect(vereinPerms).toContain('verein.events.create');
            expect(vereinPerms).toContain('verein.events.edit');
            expect(vereinPerms).toContain('gallery.view');
        });

        test('no_permissions has empty array', () => {
            expect(ROLE_DEFAULT_PERMISSIONS.no_permissions).toEqual([]);
        });
    });

    describe('getRoleDefaultPermissions', () => {
        test('returns permissions for valid role', () => {
            expect(getRoleDefaultPermissions('admin')).toEqual(
                ROLE_DEFAULT_PERMISSIONS.admin
            );
        });

        test('returns empty array for unknown role', () => {
            expect(getRoleDefaultPermissions('unknown_role')).toEqual([]);
        });

        test('returns empty array for empty string', () => {
            expect(getRoleDefaultPermissions('')).toEqual([]);
        });
    });

    describe('hasPermission', () => {
        test('returns false for null user', () => {
            expect(hasPermission(null, 'events.view')).toBe(false);
        });

        test('returns true for wildcard permission', () => {
            const user = createMockUser({ customPermissions: ['*'] });
            expect(hasPermission(user, 'events.view')).toBe(true);
            expect(hasPermission(user, 'any.permission')).toBe(true);
        });

        test('returns true for exact permission match', () => {
            const user = createMockUser({
                customPermissions: ['events.view', 'events.create'],
            });
            expect(hasPermission(user, 'events.view')).toBe(true);
            expect(hasPermission(user, 'events.create')).toBe(true);
        });

        test('returns false for missing permission', () => {
            const user = createMockUser({ customPermissions: ['events.view'] });
            expect(hasPermission(user, 'events.create')).toBe(false);
        });

        test('returns true for category wildcard permission', () => {
            const user = createMockUser({ customPermissions: ['events.*'] });
            expect(hasPermission(user, 'events.view')).toBe(true);
            expect(hasPermission(user, 'events.create')).toBe(true);
            expect(hasPermission(user, 'events.delete')).toBe(true);
        });

        test('category wildcard does not affect other categories', () => {
            const user = createMockUser({ customPermissions: ['events.*'] });
            expect(hasPermission(user, 'news.view')).toBe(false);
        });

        test('handles user with empty permissions array', () => {
            const user = createMockUser({ customPermissions: [] });
            expect(hasPermission(user, 'events.view')).toBe(false);
        });

        test('handles user with undefined permissions', () => {
            const user = createMockUser({ customPermissions: undefined });
            expect(hasPermission(user, 'events.view')).toBe(false);
        });

        test('verein permissions grant view access to that category', () => {
            const user = createMockUser({
                customPermissions: ['verein.events.create'],
            });
            expect(hasPermission(user, 'events.view')).toBe(true);
        });
    });

    describe('hasAnyPermission', () => {
        test('returns false for null user', () => {
            expect(hasAnyPermission(null, ['events.view', 'news.view'])).toBe(
                false
            );
        });

        test('returns true if user has any of the permissions', () => {
            const user = createMockUser({ customPermissions: ['events.view'] });
            expect(hasAnyPermission(user, ['events.view', 'news.view'])).toBe(
                true
            );
        });

        test('returns true if user has all permissions', () => {
            const user = createMockUser({
                customPermissions: ['events.view', 'news.view'],
            });
            expect(hasAnyPermission(user, ['events.view', 'news.view'])).toBe(
                true
            );
        });

        test('returns false if user has none of the permissions', () => {
            const user = createMockUser({
                customPermissions: ['gallery.view'],
            });
            expect(hasAnyPermission(user, ['events.view', 'news.view'])).toBe(
                false
            );
        });

        test('returns true for empty permissions array', () => {
            const user = createMockUser({ customPermissions: ['events.view'] });
            expect(hasAnyPermission(user, [])).toBe(false);
        });
    });

    describe('hasAllPermissions', () => {
        test('returns false for null user', () => {
            expect(hasAllPermissions(null, ['events.view', 'news.view'])).toBe(
                false
            );
        });

        test('returns true if user has all permissions', () => {
            const user = createMockUser({
                customPermissions: ['events.view', 'news.view'],
            });
            expect(hasAllPermissions(user, ['events.view', 'news.view'])).toBe(
                true
            );
        });

        test('returns false if user is missing any permission', () => {
            const user = createMockUser({ customPermissions: ['events.view'] });
            expect(hasAllPermissions(user, ['events.view', 'news.view'])).toBe(
                false
            );
        });

        test('returns true for empty permissions array', () => {
            const user = createMockUser({ customPermissions: ['events.view'] });
            expect(hasAllPermissions(user, [])).toBe(true);
        });

        test('wildcard grants all permissions', () => {
            const user = createMockUser({ customPermissions: ['*'] });
            expect(
                hasAllPermissions(user, [
                    'events.view',
                    'news.view',
                    'users.create',
                ])
            ).toBe(true);
        });
    });

    describe('getUserPermissions', () => {
        test('returns empty array for null user', () => {
            expect(getUserPermissions(null)).toEqual([]);
        });

        test('returns customPermissions array', () => {
            const user = createMockUser({
                customPermissions: ['events.view', 'news.view'],
            });
            expect(getUserPermissions(user)).toEqual([
                'events.view',
                'news.view',
            ]);
        });

        test('returns empty array for user without permissions', () => {
            const user = createMockUser({ customPermissions: undefined });
            expect(getUserPermissions(user)).toEqual([]);
        });
    });

    describe('getExtraPermissions', () => {
        test('returns empty array for null user', () => {
            expect(getExtraPermissions(null)).toEqual([]);
        });

        test('returns wildcard as extra if user has it', () => {
            const user = createMockUser({
                roleName: 'editor',
                customPermissions: ['*'],
            });
            expect(getExtraPermissions(user)).toEqual(['*']);
        });

        test('returns permissions not in role defaults', () => {
            const user = createMockUser({
                roleName: 'editor',
                customPermissions: [
                    'events.view',
                    'events.create',
                    'users.view',
                ],
            });
            // users.view is not in editor defaults
            expect(getExtraPermissions(user)).toContain('users.view');
        });

        test('returns empty array if all permissions are from role', () => {
            const user = createMockUser({
                roleName: 'moderator',
                customPermissions: ['events.view', 'news.view'],
            });
            expect(getExtraPermissions(user)).toEqual([]);
        });
    });

    describe('getPermissionCategory', () => {
        test('returns correct category for known permissions', () => {
            expect(getPermissionCategory('users.view')).toBe('users');
            expect(getPermissionCategory('events.create')).toBe('events');
            expect(getPermissionCategory('news.edit')).toBe('news');
            expect(getPermissionCategory('gallery.upload')).toBe('gallery');
            expect(getPermissionCategory('shared_gallery.edit')).toBe(
                'shared_gallery'
            );
            expect(getPermissionCategory('portraits.view')).toBe('portraits');
            expect(getPermissionCategory('archive.create')).toBe('archive');
            expect(getPermissionCategory('settings.edit')).toBe('settings');
            expect(getPermissionCategory('verein.events.create')).toBe(
                'verein'
            );
        });

        test('returns "other" for unknown category', () => {
            expect(getPermissionCategory('unknown.permission')).toBe('other');
            expect(getPermissionCategory('custom.action')).toBe('other');
        });
    });

    describe('PERMISSION_CATEGORIES', () => {
        test('contains all expected categories', () => {
            expect(PERMISSION_CATEGORIES.users).toBe('Benutzerverwaltung');
            expect(PERMISSION_CATEGORIES.events).toBe('Termine');
            expect(PERMISSION_CATEGORIES.news).toBe('Neuigkeiten');
            expect(PERMISSION_CATEGORIES.gallery).toBe('Galerie');
            expect(PERMISSION_CATEGORIES.shared_gallery).toBe('Impressionen');
            expect(PERMISSION_CATEGORIES.portraits).toBe('Portraits');
            expect(PERMISSION_CATEGORIES.archive).toBe('Archiv');
            expect(PERMISSION_CATEGORIES.settings).toBe('Einstellungen');
            expect(PERMISSION_CATEGORIES.verein).toBe('Vereinsverwaltung');
        });
    });
});
