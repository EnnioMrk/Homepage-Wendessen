import { sql } from '../lib/sql';

async function setupReportsTable() {
    try {
        console.log('Creating shared_gallery_reports table...');

        await sql`
            CREATE TABLE IF NOT EXISTS shared_gallery_reports (
                id SERIAL PRIMARY KEY,
                submission_id INTEGER NOT NULL REFERENCES shared_gallery_submissions(id) ON DELETE CASCADE,
                reason TEXT NOT NULL,
                reporter_info TEXT,
                status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
                reviewed_at TIMESTAMP,
                reviewed_by VARCHAR(255),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('✓ shared_gallery_reports table created');

        console.log('Creating indexes...');
        await sql`
            CREATE INDEX IF NOT EXISTS idx_reports_submission_id 
            ON shared_gallery_reports(submission_id)
        `;
        await sql`
            CREATE INDEX IF NOT EXISTS idx_reports_status 
            ON shared_gallery_reports(status)
        `;
        await sql`
            CREATE INDEX IF NOT EXISTS idx_reports_created_at 
            ON shared_gallery_reports(created_at DESC)
        `;

        console.log('✓ Indexes created');
        console.log('\n✅ Reports table setup completed successfully!');
    } catch (error) {
        console.error('Error setting up reports table:', error);
        throw error;
    }
}

setupReportsTable();
