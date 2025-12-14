import { sql } from '../../../lib/sql';

async function setupSharedGallery() {
    try {
        console.log('Creating shared_gallery_submissions table...');

        await sql`
            CREATE TABLE IF NOT EXISTS shared_gallery_submissions (
                id SERIAL PRIMARY KEY,
                submission_group_id VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                submitter_name VARCHAR(255),
                submitter_email VARCHAR(255),
                image_url TEXT,
                image_storage_path TEXT,
                image_mime_type VARCHAR(100) NOT NULL,
                image_filename VARCHAR(255),
                date_taken TIMESTAMP,
                location VARCHAR(100),
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                reviewed_at TIMESTAMP,
                reviewed_by VARCHAR(255),
                rejection_reason TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            ALTER TABLE shared_gallery_submissions
            ADD COLUMN IF NOT EXISTS date_taken TIMESTAMP,
            ADD COLUMN IF NOT EXISTS location VARCHAR(100),
            ADD COLUMN IF NOT EXISTS image_url TEXT,
            ADD COLUMN IF NOT EXISTS image_storage_path TEXT;
        `;

        console.log('✓ shared_gallery_submissions table created');

        console.log('Creating indexes...');

        await sql`
            CREATE INDEX IF NOT EXISTS idx_shared_gallery_group 
            ON shared_gallery_submissions(submission_group_id);
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_shared_gallery_status 
            ON shared_gallery_submissions(status);
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_shared_gallery_submitted_at 
            ON shared_gallery_submissions(submitted_at DESC);
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_shared_gallery_approved 
            ON shared_gallery_submissions(status, submitted_at DESC) 
            WHERE status = 'approved';
        `;

        console.log('✓ Indexes created');

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

        await sql`
            CREATE INDEX IF NOT EXISTS idx_reports_submission_id 
            ON shared_gallery_reports(submission_id);
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_reports_status 
            ON shared_gallery_reports(status);
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_reports_created_at 
            ON shared_gallery_reports(created_at DESC);
        `;

        console.log('✓ shared_gallery_reports table created');

        console.log('\n✅ Shared gallery setup completed successfully!');
    } catch (error) {
        console.error('❌ Error setting up shared gallery:', error);
        throw error;
    }
}

setupSharedGallery();
