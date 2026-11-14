# Parity — capability inventory, old → new, evidence

Rule: a row is closed only when the capability exists in the new build **and**
a test or a verified request proves it. Open rows are listed at the end.

Status legend: **done** = rebuilt and verified; **kept** = preserved unchanged
(contract, not a screen); **open** = not yet proven.

## A. Public surfaces

| # | Old capability (route) | New implementation | Status |
|---|---|---|---|
| 1 | `/` home: branding, news, events, "Das ist Wendessen" cards, club carousel | `app/page.tsx`: spine branding, today's leaf with margin tallies, 5 dated entries, 4 register notices, club index (11), Dorfwissen cards from `wendessen_layouts`, village figure, portraits call, 2 building dossiers | done |
| 2 | `/was-steht-an` calendar + list | `app/was-steht-an` rebuilt: year rail, month grid, agenda, search, category + club filters, deep link `?event=`, cancellation states, register numbers | done |
| 3 | `/neuigkeiten/[id]` article | `app/neuigkeiten/[id]` rebuilt: ruled article head, `.prose` body, related entries, not-found | done |
| 4 | — (new) news index | `app/neuigkeiten/page.tsx` with pinned ordering and category rail | done |
| 5 | `/impressionen` gallery + lightbox + report | rebuilt: ruled group sections, plate grid with 1 px gutters, dark plate lightbox (download, prev/next, Escape, focus trap) and a report sheet posting the same payload | done |
| 6 | `/impressionen/einreichen` collection form | rebuilt: three ruled form sections, 10 MB per-image validation, per-photo descriptions, both consents, unchanged payload, loading/progress/error/success | done |
| 7 | `/impressionen/einreichen/erweitern` add-to-collection | rebuilt: group select from the same endpoint (with an honest note that it lists all collections), dates, files, descriptions, states | done |
| 8 | `/dorfleben/wir-wendesser` portraits + submit modal | rebuilt: approved portraits as person plates, detail dialog, submit dialog with the same rules (≤5 MB, name, story ≥50, consent) and inline notices instead of `alert()` | done |
| 9 | `/dorfleben/ortsrat/mitglieder` | `app/dorfleben/ortsrat/mitglieder` rebuilt, 7 members, contact links | done |
| 10 | `/dorfleben/ortsrat/bericht` | rebuilt long report page with real text | done |
| 11 | `/dorfleben/vereine/feuerwehr` chooser | rebuilt club head with links to the two divisions | done |
| 12 | `/dorfleben/vereine/feuerwehr/einsatzabteilung` | rebuilt, schedule + contact block from DB | done |
| 13 | `/dorfleben/vereine/feuerwehr-portal` | rebuilt (no unbound controls) | done |
| 14 | `/dorfleben/vereine/jugendfeuerwehr` | rebuilt, external site + contact block | done |
| 15 | `/dorfleben/vereine/idw` | rebuilt | done |
| 16 | `/dorfleben/vereine/spritzenhaus` | rebuilt | done |
| 17 | `/dorfleben/vereine/kirchbauverein` | rebuilt, PDF + IBAN + contacts | done |
| 18 | `/dorfleben/vereine/kleingaertner` | rebuilt | done |
| 19 | `/dorfleben/vereine/schuetzenverein` | rebuilt, training schedule as a ruled table | done |
| 20 | `/dorfleben/vereine/sv-wendessen` | rebuilt, sports + training note | done |
| 21 | `/dorfleben/vereine/seniorenkreis` | rebuilt | done |
| 22 | `/dorfleben/vereine/frauenhilfe` | rebuilt | done |
| 23 | `/dorfleben/vereine/hospiz` | rebuilt, PDF + IBAN + contacts | done |
| 24 | `/dorfleben/institutionen/kirche` | rebuilt, service contacts | done |
| 25 | `/dorfleben/institutionen/hospiz` | rebuilt, timeline + zoom image + contacts | done |
| 26 | — (new) `/dorfleben` hub | created; Ortsrat, 11 clubs, 2 institutions, 4 further sections | done |
| 27 | `/dorfleben/karte` OpenLayers + Overpass POIs | rebuilt frame with legend counts, loading/partial/error states and retry; basemap switched from CARTO (now key-walled) to keyless OpenStreetMap tiles | done |
| 28 | `/dorfleben/wetter` station dashboard | rebuilt: 5-minute polling kept, manual refresh, visible timestamp, every measurement, decoded forecast, stale-data warning, error + retry | done |
| 29 | `/dorfleben/archiv` search/filter/sort | rebuilt: Fuse search (0.3), type/category/sort/reset as a ruled filterbar, archived news and the 2023 report entry, empty and no-result states | done |
| 30 | `/dorfleben/archiv/[id]` | rebuilt; unknown ids now return a real 404 instead of a 200 page | done |
| 31 | `/dorfleben/archiv/ortsrat-bericht/2023` | rebuilt, full report text and image kept | done |
| 32 | `/geschichte` long read + image zoom | rebuilt as a chronicle: name table, era timeline, population table, wappen note, zoom images | done |
| 33 | `/wohnen-bauen/neubaugebiet` | rebuilt: every fact, plan and contact kept; fact lists, zoomable plans, prose | done |
| 34 | `/wohnen-bauen/feuerwehrgeraetehaus` | rebuilt: planning, cost and status kept, plus a ruled Baufortschritt timeline (no invented percentage) | done |
| 35 | — (new) `/wohnen-bauen` hub | created with both dossiers and facts | done |
| 36 | `/kontakt/verzeichnis` search/filter/sort/detail | rebuilt as a ruled directory, 38 people, priority, all contact channels | done |
| 37 | `/kontakt/formular` SMTP form | rebuilt form, same endpoint and states | done |
| 38 | `/kontakt/[slug]` 6 person pages | rebuilt person pages | done |
| 39 | `/kontakt/redaktionsteam` | rebuilt | done |
| 40 | `/kontakt/whatsapp` | rebuilt, QR + channel + settings gate | done |
| 41 | — (new) `/kontakt` hub | created | done |
| 42 | `/impressum`, `/datenschutz` | rebuilt in `.legal`, full text kept | done |
| 43 | `/kontakt/impressum`, `/kontakt/datenschutz` | kept reachable, linked from the colophon | done |
| 44 | 404 | rebuilt with real links (Termine, Nachrichten, Dorfleben, Kontakt) | done |
| 45 | — (new) `/suche` | created: news, dates, clubs, contacts | done |
| 46 | — (new) `sitemap.xml`, `robots.txt` | created from the DB | done |
| 47 | PWA manifest + install prompt + service worker + push subscription | unchanged, still wired in the shell | kept |
| 48 | WhatsApp channel link (site setting) | colophon reads `whatsapp_channel_enabled` + `whatsapp_channel_url` | kept |
| 49 | Skip link, keyboard operation, focus | added (did not exist) | done |
| 50 | Sticky header, active section | spine with `aria-current` | done |

## B. Admin surfaces

| # | Old capability | New implementation | Status |
|---|---|---|---|
| 1 | `/admin` redirect + forced password change | kept (`getSessionData().mustChangePassword`) | kept |
| 2 | `/admin/login` | rebuilt login card, same API, show/hide password | done |
| 3 | `/admin/change-password` | rebuilt, 4 strength rules, same endpoint | done |
| 4 | `/admin/dashboard` | rebuilt as the keeper's desk: stats, next dates, latest notices, ways, cancellation warning | done |
| 5 | Admin shell / navigation | new permission-aware rail with pending counts, push + task controls, logout, back-to-site strip | done |
| 6 | `/admin/events` CRUD + cancel | rebuilt: AdminHead + count, tabs, filterbar, agenda as a data table, month/week/day in the register surface, ruled create/edit dialog, cancel/restore with explanation, club scoping and permissions unchanged | done |
| 7 | `/admin/news` list, create, edit, pin, reorder | rebuilt: data table with pinned stamps and actions, reorder panel, preview dialog, ruled create/edit forms with the rich editor, same endpoints | done |
| 8 | `/admin/gallery` upload/crop/delete | rebuilt: labelled upload panel, plate grid with captions, preview/rename/delete dialogs, link copy; same API calls (this gallery build has no crop/EXIF pipeline) | done |
| 9 | `/admin/portraits` moderation | rebuilt: status tabs with counts, ruled moderation rows, detail dialog, approve/reject/reset/delete, same PATCH/DELETE and permission gates | done |
| 10 | `/admin/contacts` CRUD | rebuilt: table with search/organisation/priority/sort, ruled editor with the priority slider and repeatable rows, delete confirm, same fields and audit behaviour | done |
| 11 | `/admin/organizations` | rebuilt: data table plus inline ruled editor, slug auto-build, same fields | done |
| 12 | `/admin/users` + permissions modal + reset | rebuilt: users table, create with one-time password, reset, delete with last-admin guard, and the 40-key permissions dialog in a native `<dialog>` with grouped checkboxes, search and bulk select | done |
| 13 | `/admin/settings` | rebuilt: all 11 keys, typed inputs, boolean as `"true"`/`"false"`; the values now actually drive metadata, the footer social links and the contact page | done |
| 14 | `/admin/logs` viewer + filters | rebuilt: read-only data table, action/user/entry filters, pagination, German action labels, `logs.view` | done |
| 15 | `/admin/archiv` CRUD | rebuilt: table, create/edit wizard with the Slate editor and preview, delete confirm; added the missing `/admin/archiv/bearbeiten/[id]` route; repaired `archive_id_seq` | done |
| 16 | `/admin/wendessen` layouts | rebuilt: layout table with activate/duplicate/delete, three ruled card fieldsets, image picker, theme kept as legacy data with an explicit note, ruled preview | done |
| 17 | `/admin/shared-gallery` moderation | rebuilt: group list with plates, selection and all/selected approve-reject-reset, group and image delete, detail dialog, same actions and gates | done |
| 18 | `/admin/shared-gallery/meldungen` | rebuilt: report queue with status filter, review/reset/disapprove/delete variants, detail dialog; page now gated on `shared_gallery.view` | done (code + lint; not opened in a browser, see F) |
| 19 | Audit log writes (32 actions) | unchanged (`lib/admin-log.ts`) | kept |
| 20 | Push subscribe/test + `notification_events` | unchanged; controls moved to the rail | kept |
| 21 | Scheduler (3/5/7/9-day reminders) | unchanged (`lib/scheduler.ts`) | kept |

## C. API contracts (51 route handlers)

All handlers keep their path, method and response shape. Verified by
`tests/parity/routes.test.ts` (public endpoints answer; admin endpoints are not
public). Full list in `docs/redesign/inventory/admin-and-auth.md` § admin routes
and `api/` inventory.

## D. Integrations

| Integration | Contract | Status |
|---|---|---|
| PostgreSQL (`lib/sql.ts`) | same `DATABASE_URL`, same queries | kept |
| MinIO (3 buckets) | same client, same bucket names, same object keys | kept |
| SMTP (contact form) | same `/api/contact`, same nodemailer transport | kept |
| Web push (VAPID) | same subscription API, same `/sw.js` | kept |
| OpenStreetMap / CARTO / Overpass | same map component | kept |
| Weather station scrape | same `/api/weather` | kept |

## E. Test evidence

| Evidence | Command | Result |
|---|---|---|
| Unit: Berlin date formatting | `bun test tests/lib/register-format.test.ts` | 9 pass |
| Capability: schema, events, news, people, moderation, settings | `bun test tests/parity/capabilities.test.ts` | 11 pass, 301 assertions |
| Route parity (needs a server) | `BASE_URL=… bun test tests/parity/routes.test.ts` | see RUN.md § gates |
| Legacy unit suite | `bun test` | see RUN.md § gates |
| Type check | `npx tsc --noEmit` | see RUN.md |
| Lint | `bun run lint` | see RUN.md |
| Build | `bun run build` | see RUN.md |

## F. Open rows and known limitations

No capability row is open. Three limitations remain, each disclosed rather than
papered over:

1. **404 body without JavaScript.** `notFound()` inside a dynamic segment
   (`/dorfleben/archiv/[id]`, `/neuigkeiten/[id]`) answers the correct HTTP 404,
   but Next streams the styled 404 as an RSC payload: it renders after
   hydration and is empty in the initial HTML. Unmatched URLs render the full
   server-side 404.
2. **Permission denials.** Unauthenticated admin API calls now answer 401 from
   the proxy. An authenticated user without a permission still gets 500 from
   the legacy `requirePermission` throw; the admin UI hides what a user may not
   do, so this is reachable only by calling the API directly. Pre-existing.
3. **Shared-gallery API gaps.** `/api/shared-gallery/my-groups` returns every
   collection (not only the caller's), and the submit route drops
   `socialConsent` and `dateTakenRangeEnd`. Both pre-existing; the UI keeps
   sending the fields and makes no claim that they are stored.

The Meldungen screen was type-checked, linted and shares the verified gallery
primitives, but it was not opened in a browser by the subagent that built it;
it is covered by the route parity test (200 when authenticated) and the
screenshot set.
