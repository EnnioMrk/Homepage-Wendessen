import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function updatePortraitPermissions() {
    try {
        console.log('🔄 Updating portrait permissions...');

        // Delete old approve and reject permissions
        await sql`
            DELETE FROM permissions 
            WHERE name IN ('portraits.approve', 'portraits.reject');
        `;
        console.log('✓ Removed old portrait approve/reject permissions');

        // Add new edit and delete permissions if they don't exist
        await sql`
            INSERT INTO permissions (name, display_name, description, category)
            VALUES 
                ('portraits.edit', 'Portraits bearbeiten', 'Kann Portraits bearbeiten und genehmigen/ablehnen', 'portraits'),
                ('portraits.delete', 'Portraits löschen', 'Kann Portraits löschen', 'portraits')
            ON CONFLICT (name) DO UPDATE SET
                display_name = EXCLUDED.display_name,
                description = EXCLUDED.description;
        `;
        console.log('✓ Added/updated portraits.edit and portraits.delete permissions');

        // Update custom permissions in admin_users table
        // Replace portraits.approve and portraits.reject with portraits.edit
        const usersToUpdate = await sql`
            SELECT id, custom_permissions 
            FROM admin_users 
            WHERE custom_permissions IS NOT NULL 
                AND (
                    custom_permissions @> '["portraits.approve"]'::jsonb
                    OR custom_permissions @> '["portraits.reject"]'::jsonb
                );
        `;

        for (const user of usersToUpdate) {
            let permissions = user.custom_permissions as string[];
            
            // Check if user has approve or reject permission
            const hasApproveOrReject = permissions.includes('portraits.approve') || permissions.includes('portraits.reject');
            
            if (hasApproveOrReject) {
                // Remove old permissions
                permissions = permissions.filter(p => p !== 'portraits.approve' && p !== 'portraits.reject');
                
                // Add new edit permission if not already present
                if (!permissions.includes('portraits.edit')) {
                    permissions.push('portraits.edit');
                }
                
                // Update the user
                await sql`
                    UPDATE admin_users 
                    SET custom_permissions = ${permissions}
                    WHERE id = ${user.id};
                `;
            }
        }
        
        console.log(`✓ Updated custom permissions for ${usersToUpdate.length} user(s)`);

        console.log('✅ Portrait permissions migration completed successfully!');
    } catch (error) {
        console.error('❌ Error updating portrait permissions:', error);
        throw error;
    }
}

updatePortraitPermissions();
