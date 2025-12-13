import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';

declare global {
    // Use a global promise guard so multiple imports/callers in the same
    // process won't execute the logic more than once.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    var __ensureAdminPromise: Promise<void> | undefined;
}

export async function ensureAdmin(): Promise<void> {
    if (typeof window !== 'undefined') return;

    // If already running or completed in this process, return the same promise.
    if (globalThis.__ensureAdminPromise) return globalThis.__ensureAdminPromise;

    globalThis.__ensureAdminPromise = (async () => {
        if (!process.env.DATABASE_URL) {
            console.warn('[EnsureAdmin] DATABASE_URL not set — skipping');
            return;
        }

        try {
            console.log('[EnsureAdmin] starting');
            const { sql } = await import('./sql');

            console.log('[EnsureAdmin] connected helper imported, running query');
            const rows = await sql`SELECT COUNT(*)::int AS count FROM admin_users;`;
            const count = rows?.[0]?.count ?? 0;

            if (Number(count) === 0) {
                const password = randomBytes(12).toString('base64url');
                const hash = await bcrypt.hash(password, 10);

                // Create the admin user
                const inserted = await sql`
                    INSERT INTO admin_users (username, password_hash, must_change_password)
                    VALUES ('admin', ${hash}, true)
                    RETURNING id, username
                `;

                console.log(
                    '[EnsureAdmin] DEFAULT ADMIN CREATED — username=admin password=' +
                        password
                );

                try {
                    // Find super_admin role id
                    const roleRows = await sql`
                        SELECT id FROM roles WHERE name = 'super_admin' LIMIT 1
                    `;
                    const superRoleId = roleRows?.[0]?.id;

                    // Fetch all permission names to grant explicitly
                    const permRows = await sql`SELECT name FROM permissions`;
                    const permNames = (permRows || [])
                        .map((r: { name?: string }) => r.name)
                        .filter(
                            (v: unknown): v is string =>
                                typeof v === 'string' && v.length > 0
                        );

                    // Assign role_id and custom_permissions to the created admin
                    if (inserted && inserted[0]) {
                        const adminId = inserted[0].id;

                        if (superRoleId) {
                            await sql`
                                UPDATE admin_users SET role_id = ${superRoleId} WHERE id = ${adminId}
                            `;
                            console.log(
                                '[EnsureAdmin] assigned role super_admin to admin user'
                            );
                        } else {
                            console.warn(
                                '[EnsureAdmin] super_admin role not found; skipping role assignment'
                            );
                        }

                        if (permNames.length > 0) {
                            await sql`
                                UPDATE admin_users SET custom_permissions = ${JSON.stringify(
                                    permNames
                                )}::jsonb WHERE id = ${adminId}
                            `;
                            console.log(
                                '[EnsureAdmin] granted all permissions to admin via custom_permissions'
                            );
                        } else {
                            console.warn(
                                '[EnsureAdmin] no permissions found to grant'
                            );
                        }

                        // Admin created and permissions assigned; no marker file.
                    }
                } catch (innerErr) {
                    console.error(
                        '[EnsureAdmin] failed to assign role/permissions',
                        innerErr
                    );
                }
            } else {
                console.log('[EnsureAdmin] admin users exist, skipping');
            }
        } catch (err) {
            console.error('[EnsureAdmin] failed to ensure default admin user', err);
        }
    })();

    return globalThis.__ensureAdminPromise;
}

export default ensureAdmin;

// Note: do NOT auto-run on import. The caller (for example `minio-init.ts`)
// should explicitly import and invoke `ensureAdmin()` during visible startup
// so logs are printed in the main startup output and to avoid double runs.
