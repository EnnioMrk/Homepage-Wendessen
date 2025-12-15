import { sql } from '../../../lib/sql';

async function setupWendessenSection() {
    console.log('Setting up wendessen_layouts table...');

    // Create the wendessen_layouts table
    await sql`
        CREATE TABLE IF NOT EXISTS wendessen_layouts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            is_active BOOLEAN DEFAULT false,
            card_1 JSONB NOT NULL,
            card_2 JSONB NOT NULL,
            card_3 JSONB NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    console.log('Created wendessen_layouts table');

    // Create unique index to ensure only one active layout (partially supported by conditional index)
    // We will handle the "one active" logic in the application layer or with a trigger if needed,
    // but for simplicity/robustness, a conditional unique index works well in Postgres.
    try {
        await sql`
            CREATE UNIQUE INDEX IF NOT EXISTS one_active_layout_idx 
            ON wendessen_layouts (is_active) 
            WHERE is_active = true;
        `;
        console.log('Created unique index for active layout');
    } catch (e) {
        console.log('Index might already exist or error:', e);
    }

    // Add permissions
    await sql`
        INSERT INTO permissions (name, display_name, description, category)
        VALUES ('wendessen.view', 'Wendessen Bereich ansehen', 'Kann den Wendessen Bereich im Admin ansehen', 'wendessen')
        ON CONFLICT (name) DO NOTHING
    `;

    await sql`
        INSERT INTO permissions (name, display_name, description, category)
        VALUES ('wendessen.manage', 'Wendessen Bereich verwalten', 'Kann den Wendessen Bereich bearbeiten und verwalten', 'wendessen')
        ON CONFLICT (name) DO NOTHING
    `;

    console.log('Added wendessen permissions');

    // Insert a default initial layout if none exists
    const count = await sql`SELECT count(*) FROM wendessen_layouts`;
    if (count[0].count === '0') {
        const defaultCardTheme = {
            highlight: 'bg-primary',
            background: 'bg-white',
            button: 'primary'
        };

        await sql`
            INSERT INTO wendessen_layouts (name, is_active, card_1, card_2, card_3)
            VALUES (
                'Standard Layout',
                true,
                ${{
                    title: "SPIELPLÄTZE IN WENDESSEN",
                    subtitle: "HIER KÖNNEN KINDER SPIELEN UND TOBEN",
                    description: "Wendessen bietet mehrere Spielplätze für verschiedene Altersgruppen.",
                    button_text: "Zur Karte",
                    button_href: "/karte?category=playground",
                    theme: defaultCardTheme,
                    // Use placeholders or empty if no image yet
                }},
                ${{
                    title: "Lesefutter in Wendessen",
                    subtitle: "Bücherbus kommt jetzt auch regelmäßig!",
                    description: "Wendessen hat jetzt eine Bücherzelle, die mit einer üppigen Erstausstattung versehen wurde. Und es gibt eine weitere gute Nachricht für Leseratten.",
                    button_text: "Mehr erfahren",
                    button_href: "/lesefutter",
                    theme: { ...defaultCardTheme, button: "green" }
                }},
                ${{
                    title: "HERZ AM RICHTIGEN FLECK",
                    subtitle: "HOSPIZ WENDESSEN",
                    description: "In der Natur & in der historischen Mitte von Wendessen",
                    button_text: "Mehr erfahren",
                    button_href: "/hospiz",
                    theme: { ...defaultCardTheme, button: "red" },
                    // Placeholder path based on existing usage
                     image_url: "/images/Features/Hospiz.jpeg"
                }}
            )
        `;
        console.log('Inserted default layout');
    }

    // Verify
    const layouts = await sql`SELECT id, name, is_active FROM wendessen_layouts`;
    console.log('Current layouts:', layouts);

    process.exit(0);
}

setupWendessenSection().catch((error) => {
    console.error('Error setting up wendessen section:', error);
    process.exit(1);
});
