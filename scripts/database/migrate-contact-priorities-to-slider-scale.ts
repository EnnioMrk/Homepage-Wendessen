import { sql } from '../../lib/sql';

async function migrateContactPrioritiesToSliderScale() {
    console.log('Migrating contact importance values to slider scale (0-7)...');

    const before = await sql`
        SELECT importance, COUNT(*)::int AS count
        FROM contacts
        GROUP BY importance
        ORDER BY importance DESC;
    `;
    console.log('Before migration:', before);

    await sql`
        UPDATE contacts
        SET importance = CASE
            WHEN importance BETWEEN 0 AND 7 THEN importance
            WHEN importance >= 900 THEN 7
            WHEN importance >= 700 THEN 6
            WHEN importance >= 550 THEN 5
            WHEN importance >= 450 THEN 4
            WHEN importance >= 350 THEN 3
            WHEN importance >= 250 THEN 2
            WHEN importance >= 200 THEN 1
            ELSE 0
        END;
    `;

    const after = await sql`
        SELECT importance, COUNT(*)::int AS count
        FROM contacts
        GROUP BY importance
        ORDER BY importance DESC;
    `;
    console.log('After migration:', after);

    console.log('Done.');
}

migrateContactPrioritiesToSliderScale()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });
