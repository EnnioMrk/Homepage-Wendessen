# Migration — data, environment, deployment, rollback

The redesign keeps the database schema, the admin API contracts and every
published URL. There is no destructive schema change, so there is no data
migration step; the migration is a **deployment of a new frontend and new
server components on top of the same data**.

## 1. Data

- **Schema:** unchanged. The 17 tables (`events`, `news`, `contacts`,
  `organizations`, `gallery_images`, `shared_gallery_submissions`,
  `shared_gallery_reports`, `portraits`, `archive`, `wendessen_layouts`,
  `site_settings`, `admin_users`, `roles`, `permissions`, `admin_logs`,
  `push_subscriptions`, `notification_events`) keep their columns, types and
  foreign keys.
- **Backup before any deploy** (required step, not optional):

  ```bash
  bun run scripts/db-backup.ts            # writes backups/prod-<timestamp>.json
  ```

  The file contains personal data (contacts, e-mail addresses). `backups/` is
  gitignored. Keep the file off the repository and outside the web root.
- **Restore / rollback of data:**

  ```bash
  bun run scripts/db-restore.ts backups/prod-<timestamp>.json --dry-run
  bun run scripts/db-restore.ts backups/prod-<timestamp>.json --yes
  ```

  The restore runs in one transaction, deletes the current rows in reverse
  dependency order and reinserts the snapshot with explicit column lists, so it
  also works after a column was added. Take a fresh backup before a restore.
- **Photo storage:** MinIO buckets `admin-gallery`, `portraits`, `impressions`
  are untouched. No object is moved or renamed.
- **Reversible step taken in this branch:** one temporary admin account
  (`redesign-review`, id 24) was created to capture authenticated screenshots.
  It is deleted at the end of the run:

  ```sql
  DELETE FROM admin_users WHERE username = 'redesign-review';
  ```

## 2. Environment

Every variable the application reads. Values live in `.env` (gitignored) or in
the host's environment; never in source.

| Variable | Required | Used by | Purpose |
|---|---|---|---|
| `DATABASE_URL` | yes | `lib/sql.ts` | PostgreSQL connection string |
| `SESSION_SECRET` | **yes in production** | `lib/session-utils.ts` | HMAC key for the `admin-session` cookie. **Currently missing**; the code falls back to a hardcoded development secret. Set a 32+ character random value before deploying. Rotating it signs every editor out. |
| `NEXT_PUBLIC_SITE_URL` | recommended | `app/layout.tsx` | Canonical origin for metadata (`metadataBase`), e.g. `https://wendessen.de`. Falls back to `https://wendessen.de`. |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | yes for push | `lib/push-notifications.ts`, client | Web-push public key |
| `VAPID_PRIVATE_KEY` | yes for push | `lib/push-notifications.ts` | Web-push private key |
| `VAPID_SUBJECT` | yes for push | `lib/push-notifications.ts` | `mailto:` contact for the push service |
| `MINIO_ENDPOINT` | yes | `lib/minio-init.ts`, `lib/utils/blob-utils.ts` | S3-compatible endpoint |
| `MINIO_PORT` | yes | MinIO client | Endpoint port |
| `MINIO_ACCESS_KEY` | yes | MinIO client | Access key |
| `MINIO_SECRET_KEY` | yes | MinIO client | Secret key |
| `MINIO_USE_SSL` | yes | MinIO client | `true`/`false` |
| `MINIO_BUCKET_GALLERY` | yes | gallery upload | Bucket for admin gallery images |
| `MINIO_BUCKET_PORTRAITS` | yes | portrait upload | Bucket for portraits |
| `MINIO_BUCKET_IMPRESSIONS` | yes | shared gallery | Bucket for resident photo submissions |
| `SMTP_HOST` | yes for contact mail | `app/api/contact/route.ts` | Mail relay |
| `SMTP_PORT` | optional | contact mail | Defaults to 587 |
| `SMTP_USER` / `SMTP_PASS` | yes for contact mail | contact mail | Relay credentials |
| `SMTP_ALLOW_SELF_SIGNED` | optional | contact mail | Accept a self-signed relay certificate |
| `CONTACT_FROM_EMAIL` | yes for contact mail | contact mail | Envelope sender |
| `CONTACT_TO_EMAIL` | optional | contact mail | Recipient of the contact form; defaults to `info@wendessen.de` |
| `ENABLE_PERMISSION_CHECKING` | optional | `lib/permissions.ts` | `false` disables every permission check. Emergency only; leave unset in production |
| `FORCE_HTTPS` | optional | `lib/auth.ts` | Marks the session cookie `Secure` when set to `true`; use only behind guaranteed HTTPS |
| `PROD_DATABASE_URL` | dev scripts only | `scripts/mirror-to-staging.ts` | Source database when mirroring production data into staging |
| `VERIFY_DB_ON_STARTUP` | optional | `instrumentation.ts` | Run the table verification suite on boot |
| `MINIO_HOST`, `NEXT_PUBLIC_MINIO_HOST`, `NEXT_PUBLIC_MINIO_HOSTNAME`, `NEXT_PUBLIC_MINIO_ENDPOINT` | optional | `lib/utils/blob-utils*.ts` | Extra host names recognised as object-storage URLs when the endpoint differs from the public host |

`.env` stays at mode 600 and out of git. The repository contains `.env` only on
the server; there is no committed sample with secrets. `docs/redesign/` records
the variable names, never the values.

## 3. Deployment

- Same Next.js 16 application, same build command:

  ```bash
  bun install --frozen-lockfile
  bun run build          # lint + next build (scripts/build.mjs)
  bun run start          # or the host's Next runtime
  ```

- **The build does not require the database.** `scripts/build.mjs` checks for
  `DATABASE_URL`; when it is absent (a container build has no runtime secrets)
  it builds in compile mode: no page is prerendered, every route renders on
  demand and reads PostgreSQL at runtime, where the env is available. Nothing
  is baked with empty data. When `DATABASE_URL` is present the normal build runs
  and 50 pages are prerendered. The PostgreSQL pool is created on first query,
  so importing a route module during the build never throws.
- The container command is `bun run start`; the platform provides `PORT` and the
  runtime environment.

- No new service, no new port, no new database. The redesign adds routes and
  CSS only; `next.config.ts` keeps the MinIO image patterns.
- The branch is `v2` (fast-forwarded to `staging` first, so no content is
  lost). The previous world remains runnable on `staging`/`main` until this
  branch is merged.
- Fonts are self-hosted in `public/fonts/` (Archivo, Literata, both OFL). No
  request leaves the origin for type, so there is no new third-party
  dependency and no consent question.
- First deploy checklist:
  1. set `SESSION_SECRET` and `NEXT_PUBLIC_SITE_URL`;
  2. run the backup script against the production database;
  3. deploy;
  4. check `/`, `/was-steht-an`, `/neuigkeiten`, `/dorfleben`,
     `/kontakt/verzeichnis`, `/admin/login`, `/sitemap.xml`, `/robots.txt`;
  5. sign in as an editor and open one screen per permission group.

## 4. Rollback

1. **Code:** redeploy `staging` (or the last release tag) — the previous world
   is unchanged and runs against the same database.
2. **Data:** only needed if a deploy wrote bad rows. Restore with
   `scripts/db-restore.ts` from the backup taken before the deploy.
3. **Objects:** no bucket was touched; nothing to roll back in MinIO.
4. **Sessions:** rotating or removing `SESSION_SECRET` invalidates editor
   sessions without touching data.

## 5. External contracts

- Every public URL that existed keeps answering; `/impressum` and
  `/datenschutz` are now canonical, the older `/kontakt/impressum` and
  `/kontakt/datenschutz` stay reachable.
- The REST endpoints under `/api/**` keep their paths, methods and response
  shapes. Admin endpoints stay session-protected.
- The web app manifest, service worker (`/sw.js`), push subscription flow and
  the PWA install prompt are unchanged.
