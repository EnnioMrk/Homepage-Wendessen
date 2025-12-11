# Database Tables and Columns

This document lists the main database tables used by the project and their columns/types, derived from the project's setup scripts.

-   **gallery_images**

    -   `id` - SERIAL PRIMARY KEY
    -   `filename` - VARCHAR(255) NOT NULL
    -   `original_name` - VARCHAR(255) NOT NULL
    -   `display_name` - VARCHAR(255) NOT NULL
    -   `url` - TEXT NOT NULL
    -   `size` - INTEGER NOT NULL
    -   `mime_type` - VARCHAR(100) NOT NULL
    -   `uploaded_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-   **events**

    -   `id` - SERIAL PRIMARY KEY
    -   `title` - VARCHAR(255) NOT NULL UNIQUE
    -   `description` - TEXT
    -   `start_date` - TIMESTAMP WITH TIME ZONE NOT NULL
    -   `end_date` - TIMESTAMP WITH TIME ZONE NOT NULL
    -   `location` - VARCHAR(255)
    -   `category` - VARCHAR(50) DEFAULT 'sonstiges'
    -   `organizer` - VARCHAR(255)
    -   `image_url` - TEXT
    -   `verein_id` - VARCHAR(50)
    -   `is_cancelled` - BOOLEAN NOT NULL DEFAULT FALSE
    -   `cancelled_at` - TIMESTAMP WITH TIME ZONE
    -   `cancelled_by` - VARCHAR(255)
    -   `created_at` - TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -   `updated_at` - TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -   Indexes: `idx_events_start_date`, `idx_events_category`, `idx_events_cancelled`, `idx_events_verein_id`

-   **news**

    -   `id` - SERIAL PRIMARY KEY
    -   `title` - VARCHAR(255) NOT NULL UNIQUE
    -   `content` - TEXT
    -   `content_json` - JSONB
    -   `category` - VARCHAR(50) NOT NULL
    -   `article_id` - VARCHAR(8) UNIQUE
    -   `published_date` - TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -   `created_at` - TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -   `updated_at` - TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    -   Indexes: `idx_news_published_date`, `idx_news_category`, `idx_news_article_id`

-   **contacts**

    -   `id` - SERIAL PRIMARY KEY
    -   `name` - TEXT NOT NULL
    -   `emails` - JSONB DEFAULT '[]'::jsonb
    -   `phones` - JSONB DEFAULT '[]'::jsonb
    -   `addresses` - JSONB DEFAULT '[]'::jsonb
    -   `affiliations` - JSONB DEFAULT '[]'::jsonb
    -   `sources` - JSONB DEFAULT '[]'::jsonb
    -   `importance` - INTEGER NOT NULL DEFAULT 0
    -   `created_at` - TIMESTAMPTZ DEFAULT NOW()
    -   `updated_at` - TIMESTAMPTZ DEFAULT NOW()
    -   Indexes: `idx_contacts_name`, `idx_contacts_affiliations` (GIN), `idx_contacts_importance`

-   **portraits**

    -   `id` - SERIAL PRIMARY KEY
    -   `name` - VARCHAR(255) NOT NULL
    -   `description` - TEXT NOT NULL
    -   `email` - VARCHAR(255)
    -   `image_url` - TEXT NOT NULL
    -   `image_storage_path` - TEXT
    -   `image_mime_type` - VARCHAR(50) NOT NULL
    -   `image_filename` - VARCHAR(255)
    -   `status` - VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected'))
    -   `submitted_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -   `reviewed_at` - TIMESTAMP WITH TIME ZONE
    -   `reviewed_by` - VARCHAR(255)
    -   `created_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -   `updated_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -   Indexes: `idx_portraits_status`, `idx_portraits_submitted_at`

-   **shared_gallery_submissions**

    -   `id` - SERIAL PRIMARY KEY
    -   `submission_group_id` - VARCHAR(50) NOT NULL
    -   `title` - VARCHAR(255) NOT NULL
    -   `description` - TEXT
    -   `submitter_name` - VARCHAR(255)
    -   `submitter_email` - VARCHAR(255)
    -   `image_url` - TEXT
    -   `image_storage_path` - TEXT
    -   `image_mime_type` - VARCHAR(100) NOT NULL
    -   `image_filename` - VARCHAR(255)
    -   `date_taken` - TIMESTAMP
    -   `location` - VARCHAR(100)
    -   `status` - VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected'))
    -   `submitted_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -   `reviewed_at` - TIMESTAMP
    -   `reviewed_by` - VARCHAR(255)
    -   `rejection_reason` - TEXT
    -   `updated_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    -   Indexes: `idx_shared_gallery_group`, `idx_shared_gallery_status`, `idx_shared_gallery_submitted_at`, `idx_shared_gallery_approved`

-   **shared_gallery_reports**

    -   `id` - SERIAL PRIMARY KEY
    -   `submission_id` - INTEGER NOT NULL REFERENCES shared_gallery_submissions(id) ON DELETE CASCADE
    -   `reason` - TEXT NOT NULL
    -   `reporter_info` - TEXT
    -   `status` - VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','reviewed','dismissed'))
    -   `reviewed_at` - TIMESTAMP
    -   `reviewed_by` - VARCHAR(255)
    -   `created_at` - TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    -   `updated_at` - TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    -   Indexes: `idx_reports_submission_id`, `idx_reports_status`, `idx_reports_created_at`

-   **site_settings**

    -   `id` - SERIAL PRIMARY KEY
    -   `key` - VARCHAR(100) UNIQUE NOT NULL
    -   `value` - TEXT
    -   `display_name` - VARCHAR(255) NOT NULL
    -   `description` - TEXT
    -   `type` - VARCHAR(50) DEFAULT 'text'
    -   `category` - VARCHAR(100) DEFAULT 'general'
    -   `created_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -   `updated_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

-   **admin_users**

    -   `id` - SERIAL PRIMARY KEY
    -   `username` - VARCHAR(255) UNIQUE NOT NULL
    -   `password_hash` - TEXT NOT NULL
    -   `verein_id` - VARCHAR(50)
    -   `must_change_password` - BOOLEAN DEFAULT false
    -   `created_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -   `updated_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -   `last_login` - TIMESTAMP WITH TIME ZONE
    -   `role_id` - INTEGER REFERENCES roles(id) (added by roles/permissions setup)
    -   `custom_permissions` - JSONB DEFAULT '[]'::jsonb
    -   Indexes: `idx_admin_users_username`, `idx_admin_users_verein_id`, `idx_admin_users_role_id`

-   **admin_logs**

    -   `id` - SERIAL PRIMARY KEY
    -   `user_id` - INTEGER REFERENCES admin_users(id) ON DELETE SET NULL
    -   `username` - VARCHAR(255)
    -   `action` - VARCHAR(100) NOT NULL
    -   `resource_type` - VARCHAR(100)
    -   `resource_id` - VARCHAR(255)
    -   `resource_title` - VARCHAR(500)
    -   `details` - JSONB
    -   `ip_address` - VARCHAR(45)
    -   `user_agent` - TEXT
    -   `created_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -   Indexes: `idx_admin_logs_user_id`, `idx_admin_logs_action`, `idx_admin_logs_resource_type`, `idx_admin_logs_created_at`

-   **roles**

    -   `id` - SERIAL PRIMARY KEY
    -   `name` - VARCHAR(100) UNIQUE NOT NULL
    -   `display_name` - VARCHAR(255) NOT NULL
    -   `description` - TEXT
    -   `created_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -   `updated_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

-   **permissions**
    -   `id` - SERIAL PRIMARY KEY
    -   `name` - VARCHAR(100) UNIQUE NOT NULL
    -   `display_name` - VARCHAR(255) NOT NULL
    -   `description` - TEXT
    -   `category` - VARCHAR(50)
    -   `created_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    -   `updated_at` - TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

Notes:

-   The schemas above were extracted from the project's `scripts/` setup scripts (e.g., `scripts/setup-database.ts`, `scripts/setup-contacts.ts`, `scripts/setup-portraits-table.ts`, `scripts/setup-shared-gallery.ts`, `scripts/setup-settings.ts`, and other setup scripts).
-   Some tables have additional indexes and constraints; check the corresponding setup script for details.
-   If you want this file converted into a machine-readable format (SQL DDL or a Mermaid ER diagram), tell me which format and I'll add it.
