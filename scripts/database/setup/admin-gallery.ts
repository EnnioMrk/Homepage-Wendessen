import { sql } from '../../../lib/sql';

async function setupGalleryImagesTable() {
    try {
        console.log('Creating gallery_images table...');

        await sql`
            CREATE TABLE IF NOT EXISTS gallery_images (
                id SERIAL PRIMARY KEY,
                filename TEXT NOT NULL,
                original_name VARCHAR(255) NOT NULL,
                display_name VARCHAR(255) NOT NULL,
                url TEXT NOT NULL,
                size INTEGER,
                mime_type VARCHAR(100),
                uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Add indexes commonly used by the app
        await sql`
            CREATE INDEX IF NOT EXISTS idx_gallery_uploaded_at ON gallery_images(uploaded_at DESC);
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_gallery_filename ON gallery_images(filename);
        `;

        console.log('✓ gallery_images table created');
    } catch (error) {
        console.error('Error creating gallery_images table:', error);
        throw error;
    }
}

// Run if executed directly
if (require.main === module) {
    setupGalleryImagesTable()
        .then(() => {
            console.log('Gallery table setup completed');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Gallery table setup failed:', err);
            process.exit(1);
        });
}

export default setupGalleryImagesTable;
