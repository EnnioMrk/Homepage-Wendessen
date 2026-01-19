import { sql } from '../../lib/sql';
import { contactData } from '../../app/lib/contact-data';
import { calculateImportance } from '../../lib/utils/importance-utils';

async function migrate() {
    console.log('Starting migration...');

    // 1. Remove sources column if it exists
    try {
        await sql`ALTER TABLE contacts DROP COLUMN IF EXISTS sources;`;
        console.log('Checked/Removed sources column.');
    } catch (e) {
        console.error('Error removing sources column:', e);
    }

    // 2. Insert missing contacts from contact-data.ts
    for (const contact of contactData) {
        // Check if contact already exists by name
        const existing = await sql`SELECT id FROM contacts WHERE name = ${contact.name}`;
        
        if (existing.length === 0) {
            console.log(`Inserting missing contact: ${contact.name}`);
            
            const phones = [];
            if (contact.contactInfo.phone) {
                phones.push({ type: 'phone', value: contact.contactInfo.phone });
            }
            if (contact.contactInfo.mobile) {
                phones.push({ type: 'mobile', value: contact.contactInfo.mobile });
            }

            const importance = calculateImportance([{ org: 'Ortsrat', role: contact.title }]);

            await sql`
                INSERT INTO contacts (name, emails, phones, addresses, affiliations, importance)
                VALUES (
                    ${contact.name},
                    ${JSON.stringify([contact.contactInfo.email])}::jsonb,
                    ${JSON.stringify(phones)}::jsonb,
                    ${JSON.stringify([contact.contactInfo.address])}::jsonb,
                    ${JSON.stringify([{ org: 'Ortsrat', role: contact.title }])}::jsonb,
                    ${importance}
                )
            `;
        } else {
            console.log(`Contact already exists: ${contact.name}`);
        }
    }

    console.log('Migration completed.');
}

migrate().catch(console.error);
