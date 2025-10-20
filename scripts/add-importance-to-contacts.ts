import { calculateImportance } from '../lib/importance-utils';
import { sql } from '../lib/sql';

async function addImportanceToContacts() {
    try {
        console.log('🚀 Starting importance migration...');

        // Step 1: Add importance column to contacts table
        console.log('📊 Adding importance column to contacts table...');
        await sql`
            ALTER TABLE contacts 
            ADD COLUMN IF NOT EXISTS importance INTEGER DEFAULT 0;
        `;
        console.log('✅ Importance column added successfully');

        // Step 2: Fetch all existing contacts
        console.log('📋 Fetching existing contacts...');
        const contacts = await sql`
            SELECT id, name, affiliations 
            FROM contacts;
        `;
        console.log(`📊 Found ${contacts.length} contacts to process`);

        // Step 3: Calculate and update importance for each contact
        console.log('🔄 Calculating importance for each contact...');

        for (const contact of contacts) {
            const affiliations = Array.isArray(contact.affiliations)
                ? contact.affiliations
                : JSON.parse(contact.affiliations ?? '[]');

            const importance = calculateImportance(affiliations);

            await sql`
                UPDATE contacts 
                SET importance = ${importance}
                WHERE id = ${contact.id};
            `;

            console.log(
                `✅ Updated ${contact.name}: importance = ${importance}`
            );
        }

        // Step 4: Show summary of importance distribution
        console.log('\n📈 Importance distribution summary:');
    const summary = await sql`
            SELECT 
                CASE 
                    WHEN importance >= 1000 THEN 'Government/Administrative (1000+)'
                    WHEN importance >= 600 THEN 'Emergency Services Leadership (600-999)'
                    WHEN importance >= 400 THEN 'Organization Leadership (400-599)'
                    WHEN importance >= 200 THEN 'Specialized Roles (200-399)'
                    WHEN importance >= 100 THEN 'General Members (100-199)'
                    ELSE 'Other/Unknown Roles (0-99)'
                END as category,
                COUNT(*) as count
            FROM contacts 
            GROUP BY 
                CASE 
                    WHEN importance >= 1000 THEN 'Government/Administrative (1000+)'
                    WHEN importance >= 600 THEN 'Emergency Services Leadership (600-999)'
                    WHEN importance >= 400 THEN 'Organization Leadership (400-599)'
                    WHEN importance >= 200 THEN 'Specialized Roles (200-399)'
                    WHEN importance >= 100 THEN 'General Members (100-199)'
                    ELSE 'Other/Unknown Roles (0-99)'
                END
            ORDER BY MIN(importance) DESC;
        `;

        console.log('\n📊 Distribution:');
        (summary as Array<{ category: string; count: number }>).forEach((row) => {
            console.log(`   ${row.category}: ${row.count} contacts`);
        });

        // Step 5: Show top 10 most important contacts
        console.log('\n👑 Top 10 most important contacts:');
        const topContacts = await sql`
            SELECT name, importance 
            FROM contacts 
            ORDER BY importance DESC, name ASC 
            LIMIT 10;
        `;

        (topContacts as Array<{ name: string; importance: number }>).forEach((contact, index) => {
            console.log(
                `   ${index + 1}. ${contact.name} (${contact.importance})`
            );
        });

        console.log('\n🎉 Importance migration completed successfully!');
    } catch (error) {
        console.error('❌ Error during importance migration:', error);
        process.exit(1);
    }
}

// Run the migration
addImportanceToContacts();
