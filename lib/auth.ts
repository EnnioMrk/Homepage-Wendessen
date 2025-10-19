import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
// lib/sql provides the database helper
const SESSION_COOKIE_NAME = 'admin-session';

export interface AdminUser {
    id: number;
    username: string;
    mustChangePassword: boolean;
    createdAt: Date;
    lastLogin?: Date;
    roleId?: number;
    roleName?: string;
    roleDisplayName?: string;
    customPermissions?: string[];
    vereinId?: string;
}

export interface SessionData {
    userId: number;
    username: string;
    mustChangePassword: boolean;
    roleId?: number;
    roleName?: string;
    vereinId?: string;
    timestamp: number;
}

// Simple session token generation with user data
function generateSessionToken(sessionData: SessionData): string {
    return Buffer.from(JSON.stringify(sessionData)).toString('base64');
}

function decodeSessionToken(token: string): SessionData | null {
    try {
        const decoded = Buffer.from(token, 'base64').toString();
        return JSON.parse(decoded) as SessionData;
    } catch {
        return null;
    }
}

// Get admin user by username
export async function getAdminUserByUsername(username: string): Promise<AdminUser | null> {
    try {
        const { sql } = await import('./sql');
        const result = await sql`
            SELECT 
                u.id, 
                u.username, 
                u.must_change_password, 
                u.created_at, 
                u.last_login,
                u.role_id,
                u.verein_id,
                u.custom_permissions,
                r.name as role_name,
                r.display_name as role_display_name
            FROM admin_users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.username = ${username}
        `;
        
        if (result.length === 0) return null;
        
        const row = result[0];
        return {
            id: Number(row.id),
            username: String(row.username),
            mustChangePassword: Boolean(row.must_change_password),
            createdAt: new Date(String(row.created_at)),
            lastLogin: row.last_login ? new Date(String(row.last_login)) : undefined,
            roleId: row.role_id ? Number(row.role_id) : undefined,
            roleName: row.role_name ? String(row.role_name) : undefined,
            roleDisplayName: row.role_display_name ? String(row.role_display_name) : undefined,
            vereinId: row.verein_id ? String(row.verein_id) : undefined,
            customPermissions: normalizePermissions(row.custom_permissions),
        };
    } catch (error) {
        console.error('Error fetching admin user:', error);
        return null;
    }
}

// Verify username and password
export async function verifyCredentials(username: string, password: string): Promise<AdminUser | null> {
    try {
        const { sql } = await import('./sql');
        const result = await sql`
            SELECT 
                u.id, 
                u.username, 
                u.password_hash, 
                u.must_change_password, 
                u.created_at, 
                u.last_login,
                u.role_id,
                u.custom_permissions,
                r.name as role_name,
                r.display_name as role_display_name
            FROM admin_users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.username = ${username}
        `;
        
        if (result.length === 0) return null;
        
        const row = result[0];
        const passwordHash = String(row.password_hash);
        const isValid = await bcrypt.compare(password, passwordHash);
        
        if (!isValid) return null;
        
        // Update last login
        await sql`
            UPDATE admin_users
            SET last_login = CURRENT_TIMESTAMP
            WHERE id = ${row.id}
        `;
        
        return {
            id: Number(row.id),
            username: String(row.username),
            mustChangePassword: Boolean(row.must_change_password),
            createdAt: new Date(String(row.created_at)),
            lastLogin: new Date(),
            roleId: row.role_id ? Number(row.role_id) : undefined,
            roleName: row.role_name ? String(row.role_name) : undefined,
            roleDisplayName: row.role_display_name ? String(row.role_display_name) : undefined,
            customPermissions: normalizePermissions(row.custom_permissions),
        };
    } catch (error) {
        console.error('Error verifying credentials:', error);
        return null;
    }
}

// Create session for a user
export async function createSession(user: AdminUser): Promise<string> {
    const sessionData: SessionData = {
        userId: user.id,
        username: user.username,
        mustChangePassword: user.mustChangePassword,
        roleId: user.roleId,
        roleName: user.roleName,
        vereinId: user.vereinId,
        timestamp: Date.now(),
    };
    
    const token = generateSessionToken(sessionData);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    return token;
}

// Get current session data
export async function getSessionData(): Promise<SessionData | null> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionToken?.value) {
        return null;
    }

    const sessionData = decodeSessionToken(sessionToken.value);
    
    if (!sessionData) {
        return null;
    }

    // Check if token is expired (7 days)
    const tokenAge = Date.now() - sessionData.timestamp;
    if (tokenAge >= 7 * 24 * 60 * 60 * 1000) {
        return null;
    }

    return sessionData;
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    const sessionData = await getSessionData();
    return sessionData !== null;
}

// Get current admin user
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
    const sessionData = await getSessionData();
    if (!sessionData) return null;
    
    return getAdminUserByUsername(sessionData.username);
}

/**
 * Normalize permissions stored in DB (JSONB or array) into a trimmed string array.
 * Ensures values like '*' with whitespace are recognized and comparisons are stable.
 */
export function normalizePermissions(raw: unknown): string[] {
    if (!raw) return [];

    try {
        const arr: unknown[] = Array.isArray(raw) ? raw : JSON.parse(String(raw));
        return arr
            .filter((p: unknown) => p !== null && p !== undefined)
            .map((p: unknown) => String(p).trim())
            .filter((p: string) => p.length > 0);
    } catch {
        // If parsing fails, try coercing to a single string permission
        try {
            const single = String(raw).trim();
            return single.length > 0 ? [single] : [];
        } catch {
            return [];
        }
    }
}

// Clear session
export async function clearSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

// Middleware helper for protecting admin routes
export function requireAuth(request: NextRequest): NextResponse | null {
    const sessionToken = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionToken?.value) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const sessionData = decodeSessionToken(sessionToken.value);
    
    if (!sessionData) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if token is expired
    const tokenAge = Date.now() - sessionData.timestamp;
    if (tokenAge >= 7 * 24 * 60 * 60 * 1000) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if user must change password (but allow access to change-password page)
    if (sessionData.mustChangePassword && !request.nextUrl.pathname.startsWith('/admin/change-password')) {
        return NextResponse.redirect(new URL('/admin/change-password', request.url));
    }

    return null; // User is authenticated
}

// Password strength validation
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
        return { valid: false, message: 'Passwort muss mindestens 8 Zeichen lang sein' };
    }
    
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Passwort muss mindestens einen Kleinbuchstaben enthalten' };
    }
    
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Passwort muss mindestens einen Großbuchstaben enthalten' };
    }
    
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Passwort muss mindestens eine Zahl enthalten' };
    }
    
    return { valid: true };
}

// Change password
export async function changePassword(userId: number, newPassword: string): Promise<boolean> {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const { sql } = await import('./sql');

        await sql`
            UPDATE admin_users
            SET password_hash = ${hashedPassword},
                must_change_password = false,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${userId}
        `;
        
        return true;
    } catch (error) {
        console.error('Error changing password:', error);
        return false;
    }
}
