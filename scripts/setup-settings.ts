import { sql } from '../lib/sql';

async function setupSettings() {
    console.log('Setting up site_settings table...');

    // Create the site_settings table
    await sql`
        CREATE TABLE IF NOT EXISTS site_settings (
            id SERIAL PRIMARY KEY,
            key VARCHAR(100) UNIQUE NOT NULL,
            value TEXT,
            display_name VARCHAR(255) NOT NULL,
            description TEXT,
            type VARCHAR(50) DEFAULT 'text',
            category VARCHAR(100) DEFAULT 'general',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;

    console.log('Created site_settings table');

    // Insert default settings
    const defaultSettings = [
        // General settings
        {
            key: 'site_name',
            value: 'Wendessen',
            display_name: 'Website Name',
            description: 'Der Name der Website',
            type: 'text',
            category: 'general',
        },
        {
            key: 'site_tagline',
            value: 'Ein Ortsteil von Wolfenbüttel',
            display_name: 'Untertitel',
            description: 'Der Untertitel/Slogan der Website',
            type: 'text',
            category: 'general',
        },
        // Footer settings
        {
            key: 'copyright_text',
            value: '© 2025 Ennio Marke/Ortsrat Wendessen',
            display_name: 'Copyright Text',
            description: 'Der Copyright-Text im Footer',
            type: 'text',
            category: 'footer',
        },
        {
            key: 'whatsapp_channel_url',
            value: 'https://whatsapp.com/channel/0029VaFPwF496H4KMB87my1z',
            display_name: 'WhatsApp Kanal URL',
            description: 'Link zum WhatsApp-Kanal',
            type: 'url',
            category: 'footer',
        },
        {
            key: 'whatsapp_channel_enabled',
            value: 'true',
            display_name: 'WhatsApp Kanal anzeigen',
            description: 'WhatsApp-Kanal Button im Footer anzeigen',
            type: 'boolean',
            category: 'footer',
        },
        // Contact settings
        {
            key: 'contact_email',
            value: '',
            display_name: 'Kontakt E-Mail',
            description: 'Allgemeine Kontakt-E-Mail-Adresse',
            type: 'email',
            category: 'contact',
        },
        {
            key: 'contact_phone',
            value: '',
            display_name: 'Kontakt Telefon',
            description: 'Allgemeine Kontakt-Telefonnummer',
            type: 'text',
            category: 'contact',
        },
        // Social Media
        {
            key: 'facebook_url',
            value: '',
            display_name: 'Facebook URL',
            description: 'Link zur Facebook-Seite',
            type: 'url',
            category: 'social',
        },
        {
            key: 'instagram_url',
            value: '',
            display_name: 'Instagram URL',
            description: 'Link zum Instagram-Profil',
            type: 'url',
            category: 'social',
        },
        // SEO settings
        {
            key: 'meta_description',
            value: 'Offizielle Website des Ortsteils Wendessen in Wolfenbüttel. Aktuelle Neuigkeiten, Termine und Informationen aus dem Dorfleben.',
            display_name: 'Meta Beschreibung',
            description: 'SEO Meta-Beschreibung für Suchmaschinen',
            type: 'textarea',
            category: 'seo',
        },
        {
            key: 'meta_keywords',
            value: 'Wendessen, Wolfenbüttel, Ortsteil, Dorf, Niedersachsen',
            display_name: 'Meta Keywords',
            description: 'SEO Keywords (kommagetrennt)',
            type: 'text',
            category: 'seo',
        },
    ];

    for (const setting of defaultSettings) {
        await sql`
            INSERT INTO site_settings (key, value, display_name, description, type, category)
            VALUES (${setting.key}, ${setting.value}, ${setting.display_name}, ${setting.description}, ${setting.type}, ${setting.category})
            ON CONFLICT (key) DO NOTHING
        `;
    }

    console.log('Inserted default settings');

    // Add settings permission
    await sql`
        INSERT INTO permissions (name, display_name, description, category)
        VALUES ('settings.view', 'Einstellungen ansehen', 'Kann Website-Einstellungen ansehen', 'settings')
        ON CONFLICT (name) DO NOTHING
    `;

    await sql`
        INSERT INTO permissions (name, display_name, description, category)
        VALUES ('settings.edit', 'Einstellungen bearbeiten', 'Kann Website-Einstellungen bearbeiten', 'settings')
        ON CONFLICT (name) DO NOTHING
    `;

    console.log('Added settings permissions');

    // Verify
    const settings =
        await sql`SELECT key, value, category FROM site_settings ORDER BY category, key`;
    console.log('Current settings:', settings);

    process.exit(0);
}

setupSettings().catch((error) => {
    console.error('Error setting up settings:', error);
    process.exit(1);
});
