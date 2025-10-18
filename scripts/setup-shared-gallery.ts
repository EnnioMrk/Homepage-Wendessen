import { sql } from '../lib/sql';

async function setupSharedGallery() {
    try {
        console.log('Dropping old table if exists...');
        await sql`DROP TABLE IF EXISTS shared_gallery_submissions CASCADE`;

        console.log('Creating shared_gallery_submissions table...');

        await sql`
            CREATE TABLE IF NOT EXISTS shared_gallery_submissions (
                id SERIAL PRIMARY KEY,
                submission_group_id VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                submitter_name VARCHAR(255),
                submitter_email VARCHAR(255),
                image_data TEXT NOT NULL,
                image_mime_type VARCHAR(100) NOT NULL,
                image_filename VARCHAR(255),
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                reviewed_at TIMESTAMP,
                reviewed_by VARCHAR(255),
                rejection_reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
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

        console.log('\n✅ Shared gallery setup completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Users can submit photos at /impressionen/einreichen');
        console.log('2. Admins can review at /admin/shared-gallery');
        console.log('3. Approved photos appear at /impressionen');
    } catch (error) {
        console.error('❌ Error setting up shared gallery:', error);
        throw error;
    }
}

setupSharedGallery();
