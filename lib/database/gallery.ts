import { sql } from '../sql';

// Get gallery images count
export async function getGalleryImageCount(): Promise<number> {
    try {
        const result = await sql`
            SELECT COUNT(*) as count 
            FROM gallery_images
        `;

        return Number(result[0].count);
    } catch (error) {
        console.error('Error fetching gallery image count:', error);
        throw new Error('Failed to fetch gallery image count from database');
    }
}
