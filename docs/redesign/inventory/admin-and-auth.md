# Admin & Authorization Inventory

Source of truth: code in `app/admin/**`, `app/api/admin/**`, `lib/auth.ts`, `lib/permissions.ts`,
`lib/session-utils.ts`, `lib/database/admin.ts`, DB `prod` (read-only query 2026-11-13).
Docs under `docs/` (e.g. `ROLES_PERMISSIONS.md` "permissions are not yet enforced") are STALE.

Stack notes: Next.js 16 App Router, React 19, Postgres via `pg` (`lib/sql.ts`), bcryptjs, web-push,
Slate editor, MinIO/S3 storage. Admin UI is German.

---

## 1. Admin route table

### 1.1 Pages

| Route | File | Rendering / gate | Purpose | UI sections & controls | Data source | States |
|---|---|---|---|---|---|---|
| `/admin` | `app/admin/page.tsx` | Server; `isAuthenticated()` | Entry redirect hub | none (redirect only) | session cookie | redirect → `/admin/login`, `/admin/change-password` (if `mustChangePassword`), else `/admin/dashboard` |
| `/admin/login` | `app/admin/login/page.tsx` | Public (proxy whitelist) | Username/password login | username, password + eye toggle, submit (disabled while pending), error box, "Zurück zur Hauptseite" | `POST /api/admin/login` | loading ("Anmelden..."), error ("Falscher Benutzername…", network) |
| `/admin/change-password` | `app/admin/change-password/page.tsx` | Public (proxy whitelist); API requires session | Forced/voluntary password change | new password + confirm (both with eye toggles), 4 live requirement checks (≥8, lower, upper, digit), submit disabled until all pass, error | `POST /api/admin/change-password` | error, submitting, redirect to dashboard |
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` + `AdminDashboard.tsx` | Server; auth + per-permission data fetch | Admin home/navigation hub | header: `PushNotificationToggle`, `NotificationBell`, logout button; stat cards Termine/News/Impressionen/Portraits (only if view perm); "Schnellzugriff" (Neuer Termin → `EventModal`, Neue Nachricht → link); sections: "Einsendungen & Community" (Impressionen, Portraits), "Website Inhalte" (Nachrichten, Termine, Kontakte, Das ist Wendessen, Galerie, Archiv), "System & Verwaltung" (Benutzer, Einstellungen, Aktivitätslog); dev-only `NotificationTester` | `getEvents`, `getNews`, `getSharedGalleryImageCount`, `getPortraitSubmissions`; `/api/admin/me` (client context) | `Suspense` "Dashboard lädt...", per-section error flags (`eventsError` etc. render "!"), permission-based hiding (empty sections omitted) |
| `/admin/news` | `app/admin/news/page.tsx` + `AdminNews.tsx` | Server gate `news.view` (renders "Keine Berechtigung" card), client component | News list/manage | search (title/category/content), sort (Datum/Titel/Kategorie), pinned counter "n/3 angepinnt" + reorder toggle, create button (`news.create`), pin/unpin per row (`news.pin`, server-enforced max 3), view modal (`ArticleRenderer`), edit link (`news.edit`), delete (`news.delete`) with delete confirm state, pinned reorder panel (up/down arrows → reorder API), inline legacy create/edit modal (title/category/content) | `GET/POST /api/admin/news`, `PUT/DELETE /api/admin/news/[id]`, `POST/DELETE /api/admin/news/[id]/pin`, `POST /api/admin/news/reorder` | loading spinner "Lade Nachrichten...", empty state "Keine Nachrichten gefunden" (+create CTA), error banner dismissible, pin loading state |
| `/admin/news/erstellen` | `.../erstellen/page.tsx` + `CreateNewsForm.tsx` | Server gate `news.create` | 3-step news wizard | step 1: title (max 255), category select (Bildung, Gemeinschaft, Feuerwehr, Digital, Sport, Kultur, Verwaltung); step 2: `EnhancedRichTextEditor` full height; step 3: preview (`ArticleRenderer`) + "Jetzt veröffentlichen" | `POST /api/admin/news` (`contentJson`) | step machine `initial→editing→preview`, publish loading, error |
| `/admin/news/bearbeiten/[id]` | `.../bearbeiten/[id]/page.tsx` + `EditNewsForm.tsx` | Server gate `news.edit` | Edit existing article | load + editor + preview + save | `GET/PUT /api/admin/news/[id]` | loading, error, saving, `editing/preview` |
| `/admin/events` | `app/admin/events/page.tsx` + `AdminEventsCalendar.tsx` | Client; auth via `/api/admin/status`, gate `events.view` (client) | Event management calendar | "Neuer Termin" (`events.create` OR `verein.events.create`); `react-big-calendar` month/week/day/agenda; event click → detail modal with edit (`events.edit` or own-verein `verein.events.edit`), cancel (`events.cancel`/`verein.events.cancel`), restore/uncancel, delete (`events.delete`/`verein.events.delete`); `EventModal` form (title, description, start/end date+time, all-day inference, location, verein select (locked to own verein for verein-only users), category, organizer, image via `GalleryImagePicker` + `ImageCropper`) | `GET /api/events?fresh=1`; `POST /api/events`; `PUT/DELETE /api/events/[id]`; `POST/DELETE /api/events/[id]/cancel` | loading "Lade Termine...", error screen, permission screen, modal processing state |
| `/admin/gallery` | `app/admin/gallery/page.tsx` + `AdminGallery.tsx` | Server gate `gallery.view` | Central image library | upload button (`gallery.upload`): multi-file input, image-only, ≤5 MB, displayName modal (single file); grid cards with hover actions: view, rename (`gallery.edit`), delete (`gallery.delete`), download; search; sort (Datum/Name/Aktualisierung); preview modal; delete confirm | `GET/POST /api/admin/gallery`, `PUT/DELETE /api/admin/gallery/[id]`, `GET /api/admin/gallery/proxy` | loading "Lade Bilder...", empty grid, error banner dismissible, uploading state |
| `/admin/portraits` | `app/admin/portraits/page.tsx` + `AdminPortraits.tsx` | Client; auth via `/api/admin/status`; gate `portraits.view` (client) | Moderate "Wir Wendesser" portraits | header stats Wartend/Freigegeben/Abgelehnt; status filter tabs (all/pending/approved/rejected); cards grid with image, name, email, submitted date; detail `Modal`; approve / reject / reset-to-pending (`portraits.edit`); delete (`portraits.delete`) with `PromptDialog`; image display | `GET/PATCH/DELETE /api/admin/portraits` | loading "Lade Portrait-Einreichungen...", permission card, error screen, empty filter |
| `/admin/shared-gallery` | `app/admin/shared-gallery/page.tsx` + `AdminSharedGalleryNew.tsx` | Server gate `shared_gallery.view`; passes `canEdit`/`canDelete` | Moderate citizen photo submissions (grouped) | status filter all/pending/approved/rejected; counters pending/approved/rejected; group cards (submitter, date, counts, thumbnails, selectable images); select-all; approve all/selected (`shared_gallery.edit`); reset all/selected; reject all/selected via modal with free-text reason; delete image; delete whole group (`shared_gallery.delete`); image viewer modal; "load more" pagination (PAGE_SIZE 25, offset) | `GET/POST /api/admin/shared-gallery` (`action` = approve-all, reject-all, reset-all, approve-selected, reject-selected, reset-selected, approve, reject, delete, delete-group) | loading, loadingMore, error banner, per-action `processing`, empty state |
| `/admin/shared-gallery/meldungen` | `.../meldungen/page.tsx` + `AdminSharedGalleryReports.tsx` | Server: auth ONLY (no permission check) | Reports/moderation queue for reported gallery images | filter pending/all; report cards (reason, reporter, image, status badge, reviewedAt/reviewedBy); status set reviewed/dismissed/pending (`shared_gallery.edit`); disapprove image (reject submission); delete image + report; delete report (`shared_gallery.delete`); image viewer modal | `GET/POST/DELETE /api/admin/shared-gallery/reports`, `POST /api/admin/shared-gallery` (`action:'delete'`) | loading, empty, error banner, per-row processing, confirm dialogs |
| `/admin/archiv` | `app/admin/archiv/page.tsx` | Client (`usePermissions`) — no server gate | Village archive list | create link (`archive.create`), list rows (title, author, category, date), preview modal (`ArticleRenderer`), edit (`archive.edit`), delete (`archive.delete`) with `PromptDialog`, empty state | `GET /api/archive`, `DELETE /api/archive/[id]` | loading "Lade Archiv...", empty, error notification |
| `/admin/archiv/erstellen` | `.../erstellen/page.tsx` | Client — no permission gate | 3-step archive wizard | step 1 title/author/category/created_date; step 2 `EnhancedRichTextEditor`; step 3 preview + publish | `POST /api/archive` | step machine, loading, error |
| `/admin/archiv/bearbeiten/[id]` | `.../bearbeiten/[id]/page.tsx` | Client — no permission gate | Edit archive entry | same wizard, prefilled | `GET/PUT /api/archive/[id]` | loading, error |
| `/admin/contacts` | `app/admin/contacts/page.tsx` + `AdminContactsClient.tsx` | Server gate `contacts.view`; passes create/edit/delete | Contact directory | filters bar (search, organization select, importance select, reset), "Organisationen" link, "Neuer Kontakt" (`contacts.create`), contact cards/list with edit (`contacts.edit`) and delete (`contacts.delete`) + `PromptDialog` | `GET /api/admin/contacts?q=`, `GET /api/admin/organizations`, `DELETE /api/admin/contacts/[id]` | loading, empty, error, active-filter state |
| `/admin/contacts/neu` | `.../neu/page.tsx` | Server gate `contacts.create` (else redirect `/admin/contacts`) | Create contact | `ContactForm`: name, importance slider 0–7 (8 stops: Standard/Fachkontakt/Vorstand/Vorsitz/Erweitert/Einsatzleitung/Ortsrat/Spitze), dynamic emails[], phones[{type,value}], addresses[], affiliations[{org, role}] | `GET /api/admin/organizations`, `POST /api/admin/contacts` | submitting, `alert()` errors, redirect on success |
| `/admin/contacts/[id]` | `.../[id]/page.tsx` + `EditContactClient.tsx` | Server gate `contacts.edit` (else redirect `/admin/contacts`) | Edit contact | same `ContactForm`, prefilled | `GET/PUT /api/admin/contacts/[id]` | loading, error, submitting |
| `/admin/organizations` | `app/admin/organizations/page.tsx` + `AdminOrganizationsClient.tsx` | Server gate `contacts.view` (reused) | Organizations (clubs/institutions) CRUD | list, create/edit modal (id, title, alt_title, description), delete `PromptDialog` | `GET/POST /api/admin/organizations`, `PUT/DELETE /api/admin/organizations/[id]` (NO auth check server-side) | loading, empty, error, modal |
| `/admin/users` | `app/admin/users/page.tsx` + `AdminUsersClient.tsx` + `components/PermissionsModal.tsx` | Server gate `users.view` | Admin user management | list rows (username, role badge, verein badge, "Passwort ändern" badge, created, last login, extra-permission count); "Neuer Admin" (`users.create`) modal (username regex `[a-zA-Z0-9_-]+`, role select default `admin`, verein select) → success modal with 6-digit initial password + copy; permissions modal (`users.edit`): role select, verein select, permission checkbox matrix by category, role-default shield markers, wildcard `*` disables all others, auto-add `.view` + cross-deps, confirm on removing role default, save; reset password (`users.edit`) confirm + success modal with 6-digit password + copy; delete (`users.delete`) confirm | `/api/admin/users`, `/api/admin/users/create`, `/api/admin/roles`, `/api/admin/permissions`, `/api/admin/users/[id]/permissions`, `/api/admin/users/[id]/role-permissions`, `/api/admin/users/reset-password`, `DELETE /api/admin/users/[id]` | loading "Lade Benutzer...", empty, error banner, isResetting, isSaving, roles loading |
| `/admin/settings` | `app/admin/settings/page.tsx` + `AdminSettings.tsx` | Server gate `settings.view`; `canEdit` = `settings.edit` | site_settings editor | category tabs (Allgemein/Footer/Kontakt/Social Media/SEO) with icons; inputs by `type` (text, textarea, boolean toggle "Aktiviert/Deaktiviert", url, email); dirty check; Speichern (disabled unless changed/saving) + Zurücksetzen; success banner 3 s; error banner | `GET/PUT /api/admin/settings` | loading spinner "Lade Einstellungen...", empty category text, saving, success, error |
| `/admin/logs` | `app/admin/logs/page.tsx` + `AdminLogs.tsx` | Server gate `logs.view` | Audit log viewer | total count in header; client search (username/resourceTitle/action/sentence); action filter select (Alle, Termine, Neuigkeiten, Galerie, Impressionen, Portraits, Benutzer, Einstellungen, Anmeldung, Archiv); log rows with colored action badge (`getActionColor`), German sentence (`getLogSentence`), relative time, IP; pagination prev/next (limit 30, server `page`) | `GET /api/admin/logs?page&limit&action` | loading "Lade Aktivitätslog...", empty "Keine Einträge gefunden", pagination hidden if 1 page |
| `/admin/wendessen` | `app/admin/wendessen/page.tsx` + `AdminWendessenClient.tsx` | Server gate `wendessen.view` | "Das ist Wendessen" homepage layout presets | layout list (name, active badge), activate (PUT `is_active:true`), duplicate (`wendessen.create`/manage), edit link/manage, create link, delete `PromptDialog` (active layout blocked server-side) | `GET/POST /api/admin/wendessen`, `PUT/DELETE /api/admin/wendessen/[id]` | loading spinner, error, isActivating, duplicating |
| `/admin/wendessen/neu` | `.../neu/page.tsx` | Server gate `wendessen.manage` (else redirect) | Create layout | `EditLayoutClient`: 3 cards (card_1..3) each title, subtitle, description (char counter vs max), button_text, button_href (`PageSelector` grouped nav links), image (`GalleryImagePicker` incl. upload), theme via `TailwindColorPicker` (highlight/background/button presets), live card preview | `POST /api/admin/wendessen` (+ `GET /api/admin/gallery`) | loading, saving, error |
| `/admin/wendessen/[id]` | `.../[id]/page.tsx` | Server gate `wendessen.manage` | Edit layout | same editor, prefilled from list API | `PUT /api/admin/wendessen/[id]` | loading, saving, error |

Admin shell: `app/admin/layout.tsx` only wraps children in `<Suspense>` + `PermissionsProvider`.
No sidebar/global nav; navigation is the dashboard hub plus per-page back arrows.
`AdminAuthProvider` lives in the ROOT layout (`app/layout.tsx`), so `/api/admin/me` is fetched on
every page mount / on `/admin` navigations / on window focus.

### 1.2 API routes (`app/api/admin/**`)

`requirePermission()` throws `Error('Unauthorized: Not authenticated')` /
`Error("Forbidden: Missing permission 'x'")`; most routes catch everything and answer **500** on a
permission failure. Only routes that call `hasPermission()` explicitly return 401/403.

| Route | Methods | Auth / permission | Purpose | Logs? |
|---|---|---|---|---|
| `login` | POST | public | bcrypt verify, set cookie, `last_login=now` | `auth.login` (+IP/UA) |
| `logout` | POST | session | delete cookie | `auth.logout` |
| `me` | GET | session (`getCurrentAdminUser`) | returns id, username, roleName, roleDisplayName, customPermissions, vereinId; 401 if none | – |
| `status` | GET | session | `{authenticated, user}` (returns full user object incl. createdAt/lastLogin) | – |
| `change-password` | POST | session | validate strength, bcrypt hash, `must_change_password=false`, re-issue session | `auth.password_change` |
| `users` | GET | `users.view` | list admin users (+role defaults) | – |
| `users/create` | POST | `users.create` | username regex, uniqueness 409, random 6-digit password, `must_change_password=true`, role default perms copied into `custom_permissions` | `user.create` |
| `users/[id]` | DELETE | `users.delete` | deletes; blocks last user ("Cannot delete the last admin user") | `user.delete` |
| `users/[id]/permissions` | PATCH | `users.edit` | set roleId, `custom_permissions` (trim/dedupe, `*` collapses to `['*']`, drops `verein.news.*`), vereinId | `user.update` (roleChange, vereinChange, permissionsAdded/Removed) |
| `users/[id]/role-permissions` | GET | `users.view` | role default permission names for UI highlighting | – |
| `users/reset-password` | POST | `users.edit` | new 6-digit password, `must_change_password=true` | `user.password_reset` |
| `permissions` | GET | `users.view` | permissions grouped by category + synthetic `*` ("Alle Berechtigungen", category `system`) | – |
| `roles` | GET | `users.view` | all roles | – |
| `logs` | GET | auth + `logs.view` | paginated/filterable admin_logs (page, limit default 50, userId, action prefix `LIKE x%`, resourceType) | – |
| `settings` | GET/PUT | auth + `settings.view` / `settings.edit` | list / bulk update `site_settings` values | `settings.update` (`changedKeys`) |
| `news` | GET/POST | **auth only** (no `news.*` check) | list / create (8-hex `article_id`, stores Slate JSON in `content`) | `news.create` |
| `news/[id]` | GET/PUT/DELETE | **auth only** | read / update / delete | `news.update`, `news.delete` |
| `news/[id]/pin` | POST/DELETE/GET | **auth only** | pin (max 3), unpin, pinned count | `news.pin`, `news.unpin` |
| `news/reorder` | POST | **auth only** | rewrite `pinned_order` from `orderedIds` | `news.reorder` |
| `gallery` | GET/POST | `gallery.view` / `gallery.upload` | list / upload (image/*, ≤5 MB, converted to WebP, MinIO bucket `gallery`, row in `gallery_images`) | `gallery.upload` (originalName, size) |
| `gallery/[id]` | PUT/DELETE | `gallery.edit` / `gallery.delete` | rename displayName / delete blob + row | `gallery.edit`, `gallery.delete` |
| `gallery/proxy` | GET | `gallery.view` | SSRF-guarded image proxy (allowlist from `MINIO_*` env, DNS/IP checks) | – |
| `portraits` | GET/PATCH/DELETE | auth + `portraits.view` / `portraits.edit` / `portraits.delete` | list; approve/reject/reset (`status`); delete + blob; on reject runs `cleanupOldRejectedPortraits(MAX_REJECTED_PORTRAITS)` | `portrait.approve/reject/reset/delete` (+email) |
| `shared-gallery` | GET | auth only | paginated submission groups (`status`, `limit` default 25, `offset`) + total | – |
| `shared-gallery` | POST | auth + per-action `shared_gallery.edit` or `.delete` | actions: approve-all, reject-all, reset-all, approve-selected, reject-selected, reset-selected, approve, reject, delete, delete-group (blob cleanup) | `shared_gallery.approve/reject/delete` (count, type, reason) |
| `shared-gallery/reports` | GET | auth only | gallery reports by status | – |
| `shared-gallery/reports` | POST/DELETE | `shared_gallery.edit` / `shared_gallery.delete` | set report status reviewed/dismissed/pending; delete report | – |
| `shared-gallery/images` | POST | auth only | batch image metadata for up to 100 ids | – |
| `shared-gallery/image/[id]` | GET | auth only | single image url/mime | – |
| `pending-tasks` | GET | auth; per-task `portraits.view` / `shared_gallery.view` | counts of pending portraits + distinct pending gallery groups for bell badge | – |
| `push-subscribe` | GET/POST/DELETE | auth | subscription status + VAPID public key; upsert by endpoint; delete by endpoint | – |
| `test-notification` | POST | **dev only** (403 if `NODE_ENV=production`) + auth | `type` = self / permission / portrait / shared_gallery / reminders | – |
| `wendessen` | GET/POST | auth + `wendessen.view` / (`wendessen.create` OR `wendessen.manage`) | list layouts / create (inactive) | – |
| `wendessen/[id]` | PUT/DELETE | auth + `wendessen.manage` | update (activating deactivates all others in a transaction) / delete (active layout refused) | – |
| `contacts` | GET/POST | `contacts.view` / `contacts.create` (`withPermission`) | search/list, create; revalidates `contacts` + `/` | **no log** |
| `contacts/[id]` | GET/PUT/DELETE | `contacts.view` / `.edit` / `.delete` | read/update/delete; revalidates | **no log** |
| `organizations` | GET/POST | **NO AUTH** — only `ensureAdmin()` (creates default admin if table empty) | list/create organizations | **no log** |
| `organizations/[id]` | PUT/DELETE | **NO AUTH** | update/delete organizations | **no log** |

Non-`/api/admin` endpoints used by admin UI (gated separately):
`/api/events` (GET public; POST requires `events.create` or `verein.events.create`, verein scoping),
`/api/events/[id]` (`requireAnyPermission(['events.edit','verein.events.edit'])` etc.),
`/api/events/[id]/cancel` (`events.cancel` or `verein.events.cancel` + verein ownership),
`/api/archive` (POST `archive.create`), `/api/archive/[id]` (PUT `archive.edit`, DELETE `archive.delete`),
`/api/settings` (public GET of all settings), `/api/debug/admin-perms` (auth, returns own permissions),
`/api/shared-gallery/submit|report`, `/api/portraits`.

---

## 2. Permission catalogue

Storage: table `permissions` (`name` unique, `display_name`, `description`, `category`).
Effective permissions per user: `admin_users.custom_permissions` JSONB array ONLY
(roles are templates/organisation, not inherited at check time).
Matching rules (`lib/permissions.ts` `hasPermission`, mirrored client-side in `usePermissions.tsx`):
1. `*` → allow everything.
2. exact string match.
3. category wildcard `<category>.*`.
4. any `verein.<category>.*` implies `<category>.view` (e.g. `verein.events.create` ⇒ `events.view`).
`ENABLE_PERMISSION_CHECKING=false` only affects `canPerformAction()` (unused in routes).

40 permissions exist in DB `prod`; the UI adds a synthetic wildcard `*` row.

| # | Key | Category (group label) | German display name | Meaning |
|---|---|---|---|---|
| 1 | `users.view` | users (Benutzerverwaltung) | Benutzer anzeigen | See admin user list + roles/permissions catalogues |
| 2 | `users.create` | users | Benutzer erstellen | Create admin accounts |
| 3 | `users.edit` | users | Benutzer bearbeiten | Change roles, permissions, verein, reset passwords |
| 4 | `users.delete` | users | Benutzer löschen | Delete admin accounts (never the last one) |
| 5 | `events.view` | events (Termine) | Termine anzeigen | See event calendar/admin |
| 6 | `events.create` | events | Termine erstellen | Create global events |
| 7 | `events.edit` | events | Termine bearbeiten | Edit any event |
| 8 | `events.delete` | events | Termine löschen | Delete any event |
| 9 | `events.cancel` | events | Termine absagen | Cancel / restore any event |
| 10 | `verein.events.create` | verein (Vereinsverwaltung) | Vereins-Termine erstellen | Create events for own `verein_id` only |
| 11 | `verein.events.edit` | verein | Vereins-Termine bearbeiten | Edit own-verein events |
| 12 | `verein.events.delete` | verein | Vereins-Termine löschen | Delete own-verein events |
| 13 | `verein.events.cancel` | verein | Vereins-Termine absagen | Cancel/restore own-verein events |
| 14 | `news.view` | news (Neuigkeiten) | Neuigkeiten anzeigen | See news admin |
| 15 | `news.create` | news | Neuigkeiten erstellen | Create news |
| 16 | `news.edit` | news | Neuigkeiten bearbeiten | Edit news |
| 17 | `news.delete` | news | Neuigkeiten löschen | Delete news |
| – | `news.pin` | news | (label "Neuigkeiten anpinnen" only in log utils) | **Referenced by UI/API but NOT in `permissions` table** → cannot be granted via UI; only `*` users can pin |
| 18 | `gallery.view` | gallery (Galerie) | Galerie anzeigen | See image library |
| 19 | `gallery.upload` | gallery | Bilder hochladen | Upload images |
| 20 | `gallery.edit` | gallery | Bilder bearbeiten | Rename images |
| 21 | `gallery.delete` | gallery | Bilder löschen | Delete images (DB + blob) |
| 22 | `shared_gallery.view` | shared_gallery (Impressionen) | Einreichungen anzeigen | See citizen submissions / reports queue |
| 23 | `shared_gallery.edit` | shared_gallery | Einreichungen verwalten | Approve, reject, reset, edit reports |
| 24 | `shared_gallery.delete` | shared_gallery | Einreichungen löschen | Delete submissions/groups/reports |
| – | `shared_gallery.approve` / `.reject` / `.reset` | shared_gallery | (log labels only) | Legacy names present in user data + log labels; **not** in catalogue, not checked |
| 25 | `portraits.view` | portraits (Portraits) | Portraits anzeigen | See portrait submissions |
| 26 | `portraits.edit` | portraits | Portraits bearbeiten | Approve/reject/reset portraits |
| 27 | `portraits.delete` | portraits | Portraits löschen | Delete portraits |
| 28 | `settings.view` | settings (Einstellungen) | Einstellungen ansehen | See site settings |
| 29 | `settings.edit` | settings | Einstellungen bearbeiten | Change site settings |
| 30 | `archive.view` | archive (Archiv) | Archiv anzeigen | See archive admin |
| 31 | `archive.create` | archive | Archiv Einträge erstellen | Create archive entries |
| 32 | `archive.edit` | archive | Archiv Einträge bearbeiten | Edit archive entries |
| 33 | `archive.delete` | archive | Archiv Einträge löschen | Delete archive entries |
| 34 | `wendessen.view` | wendessen | Wendessen Layouts anzeigen | See homepage layout presets |
| 35 | `wendessen.manage` | wendessen | Wendessen Layouts verwalten | Create/edit/activate/delete layouts |
| – | `wendessen.create` | wendessen | (not in DB) | Checked as OR-fallback in `POST /api/admin/wendessen` and on `/admin/wendessen` (`canCreate`) |
| 36 | `contacts.view` | contacts (Kontakte) | Kontakte anzeigen | See contacts + organizations |
| 37 | `contacts.create` | contacts | Kontakte erstellen | Create contacts |
| 38 | `contacts.edit` | contacts | Kontakte bearbeiten | Edit contacts |
| 39 | `contacts.delete` | contacts | Kontakte löschen | Delete contacts |
| 40 | `logs.view` | logs (Aktivitätslog) | Aktivitätslog ansehen | See audit log |

Excluded/hidden: `getPermissionsByCategory()` filters out every `verein.news.*` permission.
`verein.view` appears in one live user's data but is not in the catalogue.

Permission → admin surface (enforcement points):

| Permission | Pages / UI | API |
|---|---|---|
| `users.view` | `/admin/users`, dashboard card | users, permissions, roles, role-permissions |
| `users.create/edit/delete` | create modal, permissions modal, reset, delete | users/create, users/[id]/permissions, users/reset-password, users/[id] |
| `events.view` | `/admin/events`, dashboard stat | – (GET public) |
| `events.create` / `verein.events.create` | "Neuer Termin", dashboard quick action | POST /api/events |
| `events.edit`/`delete`/`cancel` (+verein variants) | event detail buttons | PUT/DELETE /api/events/[id], POST/DELETE .../cancel |
| `news.view/create/edit/delete/pin` | `/admin/news*`, dashboard | news routes (server enforces **auth only**) |
| `gallery.view/upload/edit/delete` | `/admin/gallery`, pickers in events/layouts | gallery routes |
| `shared_gallery.view/edit/delete` | `/admin/shared-gallery`, dashboard, bell | shared-gallery routes |
| `portraits.view/edit/delete` | `/admin/portraits`, dashboard, bell | portraits route |
| `settings.view/edit` | `/admin/settings`, dashboard card | settings route |
| `archive.view/create/edit/delete` | `/admin/archiv*`, dashboard card | archive routes |
| `wendessen.view/manage` | `/admin/wendessen*`, dashboard card | wendessen routes |
| `contacts.view/create/edit/delete` | `/admin/contacts*`, `/admin/organizations`, dashboard card | contacts routes |
| `logs.view` | `/admin/logs`, dashboard card, dev NotificationTester | logs route |

---

## 3. Role → permission matrix

Two independent definitions exist and they DISAGREE:

A. Code template `ROLE_DEFAULT_PERMISSIONS` in `lib/permissions.ts` (used by `users/create` to seed
`custom_permissions` and by `/users/[id]/role-permissions` for UI highlighting).
B. DB table `roles.default_permissions` (used by `getAllAdminUsers()` for the "extra permissions" count
badge only).

| Role name | display_name | Code template (A) | DB default_permissions (B, prod) |
|---|---|---|---|
| `super_admin` | Super Admin | `*` | `["*"]` |
| `admin` | Administrator | users.view/create/edit/delete; events.view/create/edit/delete/cancel; news.view/create/edit/delete; gallery.view/upload/edit/delete; shared_gallery.view/edit/delete; portraits.view/edit/delete; archive.view/create/edit/delete; settings.view/edit; wendessen.view/manage; contacts.view/create/edit/delete; logs.view (36 keys) | `["contacts.view","contacts.create","contacts.edit","contacts.delete"]` only |
| `editor` | Redakteur | events.view/create/edit/cancel; news.view/create/edit; gallery.view/upload/edit; archive.view/create/edit | `[]` |
| `moderator` | Moderator | events.view; news.view; gallery.view; shared_gallery.view/edit; portraits.view/edit | `[]` |
| `vereinsverwalter` | Vereinsverwalter | verein.events.create/edit/cancel; gallery.view/upload/edit | `[]` |
| `no_permissions` | – (code only, no DB row) | `[]` | n/a |

Live admin users (prod, 14 rows; passwords never queried):

| id | username | role | verein_id | must_change | last_login | #perms |
|---|---|---|---|---|---|---|
| 1 | admin | super_admin | – | f | 2026-08-25 | 1 (`*`) |
| 4 | Marc | admin | idw | f | 2025-12-22 | 38 |
| 5 | Andreas | admin | – | f | 2026-10-23 | 32 |
| 6 | Christina | admin | – | f | 2026-09-08 | 36 |
| 13..23 | peter-dorn, achim-cirksena, kai-brackmann, lothar-lange, andrea-brackmann, jessica-schulz, hendrik-weber, marcel-doering, ulrike-juergens, test | vereinsverwalter | initiative-spritzenhaus, kirchbauverein, feuerwehr, schuetzenverein ×2, feuerwehr, sv-wendessen ×2, hospiz-verein, idw | t for kai-brackmann, jessica-schulz, hendrik-weber | – | 6 each (`verein.events.create/edit/cancel`, `gallery.view/upload/edit`) |

Effective permissions come only from `custom_permissions`, so changing a role in the modal does NOT
recompute permissions; the admin must tick boxes manually. `*` collapses the stored array to `["*"]`.

---

## 4. Auth / session mechanics

### 4.1 Admin user model (`admin_users`)

| Column | Type / default | Use |
|---|---|---|
| `id` | SERIAL PK | user id |
| `username` | VARCHAR(255) UNIQUE NOT NULL | login name; regex `^[a-zA-Z0-9_-]+$` on create |
| `password_hash` | TEXT NOT NULL | bcryptjs, cost **10** |
| `verein_id` | VARCHAR(50) NULL | scopes verein permissions; index exists |
| `custom_permissions` | JSONB default `[]` | effective permissions |
| `role_id` | INTEGER → `roles(id)` | display/grouping + template only |
| `must_change_password` | BOOLEAN default false | forces `/admin/change-password` |
| `created_at`, `updated_at` | TIMESTAMPTZ default now | timestamps |
| `last_login` | TIMESTAMPTZ NULL | updated inside `verifyCredentials()` on successful login |

There is **no** `is_active`/disabled flag, no email, no sessions table, no refresh token,
no MFA, no login rate-limiting, no failed-attempt lockout. No per-device logout.

Password flows:
- Create user: random 6-digit (`100000–999999`, `Math.random`), bcrypt 10, `must_change_password=true`,
  password returned once in the response and shown in a success modal.
- Reset password (`users.edit`): same 6-digit generation, `must_change_password=true`; existing cookie
  stays valid until expiry (mustChange only enforced at next `requireAuth`/proxy pass).
- Self change: `validatePasswordStrength` = length ≥8, ≥1 lowercase, ≥1 uppercase, ≥1 digit;
  bcrypt 10; `must_change_password=false`; session re-issued.
- Bootstrap: `ensureAdmin()` (called from `instrumentation.ts` and `minio-init.ts`) creates
  `admin` with random `base64url(12 bytes)` password if `admin_users` is empty, assigns `super_admin`
  role and `["*"]`, and **prints the password to logs**. `scripts/database/setup/admin-users.ts`
  (manual) creates `admin`/`admin123` instead.

### 4.2 Session cookie

- Name: `admin-session` (`SESSION_COOKIE_NAME` in `lib/session-utils.ts`).
- Value: `base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload_b64, SESSION_SECRET))`.
  Stateless JWT-like, not encrypted; payload readable by the holder.
- Payload (`SessionData`): `userId, username, mustChangePassword, roleId?, roleName?, vereinId?, timestamp`.
- Attributes: `httpOnly: true`, `sameSite: 'strict'`, `path: '/'`, `maxAge: 7 days`,
  `secure = NODE_ENV==='production' && (FORCE_HTTPS==='true' || URL/BASE_URL/HOME_URL starts https OR browser protocol https)`.
- Expiry: enforced twice — `signSession.timestamp` compared to now (`>= 7 days` ⇒ invalid); cookie maxAge.
- Verification is `signature !== expected` (non-constant-time string compare).
- `SESSION_SECRET` is **not present in `.env`** → falls back to hardcoded
  `'fallback-secret-for-dev-only-12345'`. Must be set before reuse.
- Session is NOT revoked on password change/reset or user deletion; `getCurrentAdminUser()` re-reads
  the user by `sessionData.username` on every request, so deleted users become unauthenticated.

### 4.3 Route protection

1. `proxy.ts` (Next 16 proxy, formerly middleware) — `config.matcher: ['/admin/:path*']`.
   Skips `/admin/login*` and `/admin/change-password*`; otherwise `requireAuth()` from
   `lib/middlewareAuth.ts` (edge-safe, imports `session-utils` only):
   no cookie ⇒ redirect `/admin/login`; bad signature ⇒ same; age ≥7 d ⇒ same;
   `mustChangePassword && !path.startsWith('/admin/change-password')` ⇒ redirect there.
   **`/api/**` is NOT matched** — every API route must self-authorize.
2. Server components repeat the check (`isAuthenticated()` + `redirect('/admin/login')`) and add
   permission checks (`hasPermission`) rendering a "Keine Berechtigung" card (not 403).
3. Client components read permissions from context (`usePermissions`), which is fed by
   `GET /api/admin/me` (`AdminAuthProvider` in root layout; refresh on mount, on `/admin` navigation,
   and on window focus; `isLoading` until first fetch).
4. API routes use `getCurrentAdminUser()` + `hasPermission()` or `requirePermission()` /
   `requireAnyPermission()` / `withPermission()`.

Authorization gaps / inconsistencies to preserve-or-fix deliberately:
- `organizations` GET/POST/PUT/DELETE: no auth at all (only `ensureAdmin()`), though `/admin/organizations`
  page gates on `contacts.view`.
- news, news pin/reorder, shared-gallery GET/reports GET/images/image/[id], pending-tasks:
  authenticated-only (no category view permission).
- `/admin/shared-gallery/meldungen` page: authenticated-only.
- `/admin/archiv*`: client-side permission checks only.
- Permission failures in most `requirePermission` routes return HTTP 500 (error caught generically).
- `/api/admin/me` and `/api/admin/status` expose permissions to the client by design (UI gating is
  cosmetic; server checks are the real boundary, and are incomplete as listed above).

---

## 5. Audit log model

Table `admin_logs`:

| Column | Type | Notes |
|---|---|---|
| `id` | SERIAL PK | |
| `user_id` | INTEGER → admin_users(id) ON DELETE SET NULL | actor id (nullable) |
| `username` | VARCHAR(255) | actor snapshot (survives deletion) |
| `action` | VARCHAR(100) NOT NULL | see enum below |
| `resource_type` | VARCHAR(100) | `event`, `news`, `gallery`, `shared_gallery`, `portrait`, `user`, `settings`, `auth`, `archive` |
| `resource_id` | VARCHAR(255) | stringified id or group id |
| `resource_title` | VARCHAR(500) | display title / submitter / username |
| `details` | JSONB | action-specific payload |
| `ip_address` | VARCHAR(45) | first `x-forwarded-for` entry, else `x-real-ip` |
| `user_agent` | TEXT | request UA |
| `created_at` | TIMESTAMPTZ default now | indexed DESC |

Indexes: `user_id`, `action`, `resource_type`, `created_at DESC`.

Writer: `logAdminAction(entry)` — fire-and-forget (no await), catches and logs errors; never blocks/fails
the request. `getRequestInfo(request)` supplies IP/UA.
Reader: `getAdminLogs({page=1, limit=50, userId, action, resourceType, startDate, endDate})` —
note the query builder only uses one filter branch at a time (userId, else action prefix, else
resourceType, else all; the all-filters branch requires every field). Returns `{logs,total}`.

Action enum (`AdminAction`, 32 values) and German label (`lib/utils/admin-log-utils.ts`):

| Action | Label |
|---|---|
| `event.create` | Termin erstellt |
| `event.update` | Termin bearbeitet |
| `event.delete` | Termin gelöscht |
| `event.cancel` | Termin abgesagt |
| `event.uncancel` | Termin wiederhergestellt |
| `news.create` | Nachricht erstellt |
| `news.update` | Nachricht bearbeitet |
| `news.delete` | Nachricht gelöscht |
| `news.pin` | Nachricht angepinnt |
| `news.unpin` | Nachricht losgelöst |
| `news.reorder` | (no label → raw key) |
| `gallery.upload` | Bild hochgeladen |
| `gallery.edit` | Bild bearbeitet |
| `gallery.delete` | Bild gelöscht |
| `shared_gallery.approve` | Impression genehmigt (also used for reset-all/reset-selected) |
| `shared_gallery.reject` | Impression abgelehnt |
| `shared_gallery.delete` | Impression gelöscht |
| `portrait.approve` | Portrait genehmigt |
| `portrait.reject` | Portrait abgelehnt |
| `portrait.reset` | Portrait zurückgesetzt |
| `portrait.delete` | Portrait gelöscht |
| `user.create` | Benutzer erstellt |
| `user.update` | Benutzer bearbeitet |
| `user.delete` | Benutzer gelöscht |
| `user.password_reset` | Passwort zurückgesetzt |
| `settings.update` | Einstellungen geändert |
| `auth.login` | Angemeldet |
| `auth.logout` | Abgemeldet |
| `auth.password_change` | Passwort geändert |
| `archive.create` | Archiv erstellt |
| `archive.update` | Archiv bearbeitet |
| `archive.delete` | Archiv gelöscht |

`details` shapes by action: events `{category}`; news `{category}`, reorder `{orderedIds}`;
gallery `{originalName, size}`; shared_gallery `{count, type, reason?}`;
portraits `{email}`; users create `{role, vereinId}`, update
`{roleChange:{from,to}, vereinChange:{from,to}, permissionsAdded[], permissionsRemoved[]}`,
password reset `{reason:'Admin password reset'}`; settings `{changedKeys[]}`.

Rendering: `getLogSentence(log)` builds a full German sentence per action (uses details + resourceTitle;
falls back to "user: Label - Title"); `getActionColor` maps prefix → Tailwind badge classes
(event blue, news green, gallery/shared_gallery purple, portrait emerald, user orange, settings gray,
auth indigo, archive amber). Labels for permission keys and setting keys exist in this file
(`getPermissionLabel`, `getSettingLabel` — the latter still names legacy keys
`site_title`, `site_description`, `contact_address`, `footer_copyright`, `maintenance_mode`).

Live data: 655 log rows, 29 distinct actions. Top: `auth.login` 178, `event.create` 73,
`user.update` 72, `auth.logout` 61, `event.update` 58, `auth.password_change` 53, `gallery.upload` 32.
Not logged at all: contacts CRUD, organizations CRUD, wendessen CRUD, gallery shared reports.

---

## 6. Push + scheduler model

### 6.1 Tables

`push_subscriptions`: `id` SERIAL, `user_id` → admin_users ON DELETE CASCADE (indexed),
`endpoint` TEXT UNIQUE, `p256dh` TEXT, `auth` TEXT, `created_at`, `updated_at`. Live rows: 3.

`notification_events`: `id` SERIAL, `event_type` TEXT, `resource_id` TEXT,
`created_at`, `UNIQUE(event_type, resource_id)` — dedupe ledger. Live rows: 92.

### 6.2 Flow

1. Subscribe (UI `PushNotificationToggle`, dashboard header): feature-detect
   `serviceWorker` + `PushManager`; register `/sw.js`; `GET /api/admin/push-subscribe` returns
   `{subscribed, vapidPublicKey}`; request `Notification.requestPermission()`;
   `registration.pushManager.subscribe({userVisibleOnly:true, applicationServerKey})`;
   `POST /api/admin/push-subscribe {subscription}` → upsert by `endpoint` (reassigns `user_id`).
   Unsubscribe: `subscription.unsubscribe()` then `DELETE` with `{endpoint}`.
2. Send: `sendPushNotification(subscription, payload)` uses `web-push` (lazy import, VAPID from
   `NEXT_PUBLIC_VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY`/`VAPID_SUBJECT`); no keys ⇒ skip (false).
   On 404/410 the subscription is deleted. Payload `{title, body, icon, badge, url, tag}`.
3. Fan-out: `notifyUsersWithPermission(permission, eventType, resourceId, payload)`:
   `hasNotificationBeenSent` check → `getSubscriptionsForPermission` (SQL `custom_permissions::jsonb ? perm OR ? '*'`)
   → `markNotificationSent` BEFORE sending → loop send → returns success count.
4. Triggers:
   - New portrait → `notifyNewPortrait(id, name)` to `portraits.view`, event `new_portrait`, url `/admin/portraits`.
   - New gallery submission → `notifyNewSharedGallery(groupId, name, count)` to `shared_gallery.view`, event `new_shared_gallery`.
   - Appended to existing group → `notifySharedGalleryAppended(...)`, event `shared_gallery_appended`.
   - Reminders: `sendPortraitReminders` / `sendSharedGalleryReminders` → event
     `portrait_reminder_<day>` / `shared_gallery_reminder_<day>`, where day ∈ {3,5,7,9,11,…}
     (`daysWaiting >= 3 && odd`), computed from `submitted_at` (`EXTRACT(DAY ...)`).
   - `sendAllPendingReminders` runs both in parallel.
5. Service worker `public/sw.js`: `push` → parse JSON, defaults icon/badge `/images/wappen.png`,
   default url `/admin/dashboard`, `showNotification(title, {body, icon, badge, data:{url, tag}})`.
   `notificationclick` → focus existing client whose url includes `/admin` and navigate, else `openWindow(url)`.
6. Test tooling: `NotificationTester` (dev-only, on dashboard when `NODE_ENV=development` && `logs.view`)
   and the "Testen" button after subscribing. `POST /api/admin/test-notification` (403 in production)
   types: `self` (own first subscription), `permission` (arbitrary permission string), `portrait`,
   `shared_gallery`, `reminders` (runs `sendAllPendingReminders`, returns checked/sent).
   Extra dev guard network: `PushNotificationToggle` is hidden if `NEXT_PUBLIC_VAPID_PUBLIC_KEY` missing.

### 6.3 Scheduler

`lib/scheduler.ts`, started from `instrumentation.ts register()` after DB verify + MinIO init +
`ensureAdmin()` (Node runtime only). Behaviour:
- production only (`NODE_ENV !== 'production'` ⇒ logs "Skipping" and returns).
- idempotent `isRunning` guard; runs `runReminderCheck()` immediately at boot, then
  `setTimeout` chain every **1 hour** (`ONE_HOUR_MS`), `.unref()` so it doesn't hold the process.
- state in memory: `lastRunTime`, `runCount`; `getSchedulerStatus()` → `{isRunning, lastRunTime, runCount, nextRunIn}`.
- Each run logs per-source `sent/checked`.
No external cron/queue (no vercel.json, no GitHub Actions cron). Multiple app replicas would each run it
(dedupe relies on `notification_events`).

### 6.4 Storage / startup side-effects

`lib/minio-init.ts` `initMinio()`: reads `MINIO_ENDPOINT/PORT/ACCESS_KEY/SECRET_KEY/USE_SSL`,
buckets `MINIO_BUCKET_GALLERY` (`admin-gallery`), `MINIO_BUCKET_PORTRAITS` (`portraits`),
`MINIO_BUCKET_IMPRESSIONS` (`impressions`); creates missing buckets and re-applies a public-read
`s3:GetObject` policy on every bucket; then calls `ensureAdmin()`. Invoked via
`initializeMinIOBuckets()` in `instrumentation.ts` (a parallel implementation in `lib/utils/blob-utils.ts`).
`lib/revalidate.ts`: `revalidatePathSafe(path, type?)` and `revalidateTagSafe(tag)` wrap Next cache
APIs with try/catch (`revalidateTag(tag, 'max')`). Tags used: `news`, `events`, `gallery`,
`shared-gallery`, `portraits`, `gallery-reports`, `contacts`, `organizations`, `settings`,
`wendessen`; paths: `/`, `/was-steht-an`, layout-wide `/`.

---

## 7. site_settings (admin-only settings)

Table `site_settings`: `id`, `key` UNIQUE, `value` TEXT, `display_name`, `description`,
`type` (default `text`), `category` (default `general`), `created_at`, `updated_at`.
Public read via `GET /api/settings` and `getSiteSettings()` (cached, tag `settings`); admin write
`PUT /api/admin/settings` requires `settings.edit` and updates only `value` (+`updated_at`).
Boolean values are the strings `"true"`/`"false"`; toggles compare `value === 'true'`.

Current values in DB `prod` (11 rows, 2026-11-13):

| Key | Category | Type | Value |
|---|---|---|---|
| `site_name` | general | text | `Wendessen` |
| `site_tagline` | general | text | `Ein Ortsteil von Wolfenbüttel` |
| `copyright_text` | footer | text | `© 2026 Ennio Marke/Ortsrat Wendessen` |
| `whatsapp_channel_url` | footer | url | `https://whatsapp.com/channel/0029VaFPwF496H4KMB87my1z` |
| `whatsapp_channel_enabled` | footer | boolean | `true` |
| `contact_email` | contact | email | `` (empty) |
| `contact_phone` | contact | text | `` (empty) |
| `facebook_url` | social | url | `` (empty) |
| `instagram_url` | social | url | `` (empty) |
| `meta_description` | seo | textarea | `Offizielle Website des Ortsteils Wendessen in Wolfenbüttel. Aktuelle Neuigkeiten, Termine und Informationen aus dem Dorfleben.` |
| `meta_keywords` | seo | text | `Wendessen, Wolfenbüttel, Ortsteil, Dorf, Niedersachsen` |

Consumers in code: only `app/components/layout/footer.tsx` uses `copyright_text`,
`whatsapp_channel_url`, `whatsapp_channel_enabled`. `site_name`, `site_tagline`,
`contact_email`, `contact_phone`, `facebook_url`, `instagram_url`, `meta_description`,
`meta_keywords` are editable but not read anywhere (SEO/metadata hardcoded elsewhere).
Legacy keys only named in `lib/utils/admin-log-utils.ts#getSettingLabel` and not present in DB:
`site_title`, `site_description`, `contact_address`, `footer_copyright`, `maintenance_mode`
(no maintenance mode exists).

Admin settings page category order comes from data: `general`, `footer`, `contact`, `social`, `seo`
(`categoryConfig` supplies label/icon; unknown categories fall back to key + Gear icon).

---

## 8. Parity checklist (behavioural contract to keep)

1. `admin-session` httpOnly sameSite=strict cookie, HMAC-SHA256 over base64url JSON, 7-day age,
   `mustChangePassword` forced redirect, `SESSION_SECRET` required in prod.
2. 40 permission keys + `*` wildcard; exact/category-wildcard/`verein.<cat>.*`-implies-`.view` matching;
   effective perms from `admin_users.custom_permissions` only (roles are templates).
3. 5 roles (`super_admin`, `admin`, `editor`, `moderator`, `vereinsverwalter`) with the code templates,
   and the create-user seeding of that template into `custom_permissions`.
4. bcrypt cost 10; 6-digit initial/reset passwords; strength rules (8+/lower/upper/digit);
   `last_login` update; `verein_id` scoping for verein users; last-admin delete guard.
5. 32 audit actions with exact names/labels, JSONB `details` shapes, IP/UA capture, fire-and-forget,
   paginated/filterable viewer.
6. Push: endpoint-unique subscription table, permission-based fan-out, `notification_events` dedupe,
   reminder schedule 3/5/7/9… days, hourly production scheduler, `/sw.js` click-through to admin URLs,
   dev-only test endpoint with 5 types.
7. 11 `site_settings` keys with their types/categories and string-boolean convention.
8. Server-side permission enforcement per route AS IT EXISTS TODAY (including the unguarded
   organizations API and auth-only news/shared-gallery routes) — decide explicitly before tightening.
