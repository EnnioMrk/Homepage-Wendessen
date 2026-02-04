
import { sql } from '../../../lib/sql';

async function verifyOrganizations() {
    try {
        const result = await sql`SELECT COUNT(*) as count FROM organizations`;
        const count = Number(result[0].count);
        
        if (count === 0) {
            console.error('❌ Verification failed: "organizations" table is empty.');
            process.exit(1);
        }
        
        console.log(`✅ Verification passed: Found ${count} organizations.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Verification failed: Error querying organizations table.', error);
        process.exit(1);
    }
}

verifyOrganizations();
