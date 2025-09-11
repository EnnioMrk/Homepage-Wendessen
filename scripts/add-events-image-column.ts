#!/usr/bin/env bun

/**
 * Add image_url column to events table
 * This script adds support for images in events by adding an image_url column
 */

import { neon } from '@neondatabase/serverless';

// Database connection
const sql = neon(process.env.DATABASE_URL!);

async function addImageUrlColumn() {
    try {
        console.log('🔄 Adding image_url column to events table...');

        // Add image_url column to events table
        await sql`
            ALTER TABLE events 
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        `;

        console.log('✅ Successfully added image_url column to events table');
        console.log('');
        console.log('Migration completed! Events can now have associated images from the gallery.');

    } catch (error) {
        console.error('❌ Error adding image_url column:', error);
        throw error;
    }
}

// Run migration
addImageUrlColumn()
    .then(() => {
        console.log('🎉 Image URL migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    });