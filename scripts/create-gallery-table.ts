import { sql } from '../lib/sql';

async function createGalleryTable() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS gallery_images (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                original_name VARCHAR(255) NOT NULL,
                display_name VARCHAR(255) NOT NULL,
                url TEXT NOT NULL,
                size INTEGER NOT NULL,
                mime_type VARCHAR(100) NOT NULL,
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('Gallery images table created successfully');
    } catch (error) {
        console.error('Error creating gallery table:', error);
    }
}

// Run the migration
createGalleryTable();
