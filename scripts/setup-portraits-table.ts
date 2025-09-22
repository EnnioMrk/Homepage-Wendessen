import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function setupPortraitsTable() {
    try {
        console.log('Creating portraits table...');
        
        await sql`
            CREATE TABLE IF NOT EXISTS portraits (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                email VARCHAR(255),
                image_data TEXT NOT NULL,
                image_mime_type VARCHAR(50) NOT NULL,
                image_filename VARCHAR(255),
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
                submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                reviewed_at TIMESTAMP WITH TIME ZONE,
                reviewed_by VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        console.log('Creating indexes for portraits table...');
        
        await sql`
            CREATE INDEX IF NOT EXISTS idx_portraits_status ON portraits(status);
        `;
        
        await sql`
            CREATE INDEX IF NOT EXISTS idx_portraits_submitted_at ON portraits(submitted_at);
        `;

        console.log('Portraits table setup completed successfully!');
        
    } catch (error) {
        console.error('Error setting up portraits table:', error);
        throw error;
    }
}

// Run the setup if this script is executed directly
if (require.main === module) {
    setupPortraitsTable()
        .then(() => {
            console.log('Database setup completed');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Database setup failed:', error);
            process.exit(1);
        });
}