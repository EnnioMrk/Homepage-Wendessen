import { sql } from '../lib/sql';

async function setupArchiveTable() {
    console.log('📦 Setting up archive table...\n');

    try {
        // Create archive table
        await sql`
            CREATE TABLE IF NOT EXISTS archive (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                author TEXT,
                category TEXT,
                created_date DATE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✅ Created archive table');

        // Create index for better query performance
        await sql`
            CREATE INDEX IF NOT EXISTS idx_archive_created_date 
            ON archive(created_date DESC NULLS LAST)
        `;
        console.log('✅ Created index on created_date');

        // Create index on category for filtering
        await sql`
            CREATE INDEX IF NOT EXISTS idx_archive_category 
            ON archive(category)
        `;
        console.log('✅ Created index on category');

        console.log('\n✅ Archive table setup complete!');
        console.log('\nTable schema:');
        console.log('  - id: Auto-incrementing primary key');
        console.log('  - title: Archive entry title (required)');
        console.log('  - author: Author name (optional)');
        console.log('  - category: Category/tag (optional)');
        console.log('  - created_date: Original creation date (optional)');
        console.log('  - content: Full text content (required)');
        console.log('  - created_at: When added to database');
        console.log('  - updated_at: Last modification time');

    } catch (error) {
        console.error('❌ Error setting up archive table:', error);
        throw error;
    }
}

setupArchiveTable();
