Startup helpers

To ensure a default admin user exists automatically before starting the Next.js server, use the provided wrapper scripts.

-   Development (dev server):

    ```bash
    ./scripts/start-dev-with-admin.sh
    ```

-   Production (start):

    ```bash
    ./scripts/start-with-admin.sh
    ```

These wrappers load `.env` (if present), run `scripts/ensure-admin-startup.ts` to create an admin if none exists, and then start Next.

If you want the behavior embedded into the Next process itself, it is fragile in dev with Turbopack; the wrappers are the most reliable and portable approach.
