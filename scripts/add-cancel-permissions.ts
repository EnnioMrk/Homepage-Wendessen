import { sql } from '../lib/sql';

async function addCancelPermissions() {
    console.log('Adding event cancellation permissions...\n');

    try {
        // Add events.cancel permission
        const eventsCancelExists = await sql`
            SELECT id FROM permissions WHERE name = 'events.cancel' LIMIT 1;
        `;

        if (eventsCancelExists.length === 0) {
            await sql`
                INSERT INTO permissions (name, display_name, description, category)
                VALUES (
                    'events.cancel',
                    'Termine absagen',
                    'Kann Termine absagen (aber nicht dauerhaft löschen)',
                    'events'
                );
            `;
            console.log('✓ Created permission: events.cancel');
        } else {
            console.log('  Permission events.cancel already exists');
        }

        // Add verein.events.cancel permission
        const vereinCancelExists = await sql`
            SELECT id FROM permissions WHERE name = 'verein.events.cancel' LIMIT 1;
        `;

        if (vereinCancelExists.length === 0) {
            await sql`
                INSERT INTO permissions (name, display_name, description, category)
                VALUES (
                    'verein.events.cancel',
                    'Vereinstermine absagen',
                    'Kann Termine des eigenen Vereins absagen',
                    'verein'
                );
            `;
            console.log('✓ Created permission: verein.events.cancel');
        } else {
            console.log('  Permission verein.events.cancel already exists');
        }

        // Remove verein.events.delete permission (Verein users should use cancel instead)
        const deleteRemoved = await sql`
            DELETE FROM permissions WHERE name = 'verein.events.delete'
            RETURNING name;
        `;

        if (deleteRemoved.length > 0) {
            console.log('✓ Removed permission: verein.events.delete (replaced with cancel)');
        }

        console.log('\n✅ Event cancellation permissions added successfully!');
        console.log('\nPermission Summary:');
        console.log('  - events.cancel: Editors can cancel events');
        console.log('  - verein.events.cancel: Verein users can cancel their events');
        console.log('  - events.delete: Only Administrators can permanently delete events');
        console.log('\nNote: Cancelled events remain visible but are marked as cancelled.');
        
    } catch (error) {
        console.error('❌ Error adding cancellation permissions:', error);
        throw error;
    }
}

addCancelPermissions()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
