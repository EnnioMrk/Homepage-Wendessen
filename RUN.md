# Run log — redesign of wendessen.de

Branch: `v2` (fast-forwarded to `staging` at 82cf307 before work started, so no
content was lost). Old world remains runnable on `staging` and `main`.

Working principle: the main thread holds the visual world, the direction
contract and every gate. Independent work is delegated with a complete packet.

---

## 1. Context and baseline

| Step | Command / action | Result |
|---|---|---|
| 1 | `impeccable context` | `NO_PRODUCT_MD`, incumbent visual implementation present, no platform, no design hook → manual detector required at the end. |
| 2 | `impeccable concept-seed --scope direction --mode operate` (first run, key `fc8879ec…`) | Dealt a hand, assigned index 3. Re-run for the mode rules produced a second key (`9ff1d5cb…`) with a different dealt hand; the second run is the binding one (seed reference `seed:aeab3ce915cb7ef3`). |
| 3 | `impeccable concept-seed --from seed:aeab3ce915cb7ef3` | Reproduced the binding roll: assigned index 3; challengers: orienteering map, bitmap specimen, doujin event catalog, centre-rail reference setting, midnight transit diagram, exposure-record zone sheets. |
| 4 | `/impeccable init` equivalent | PRODUCT.md written from repository evidence, the running product and the data. The user delegates every decision and forbade questions, so no interview round was held; every inferred fact is marked in PRODUCT.md. **Substitution disclosed.** |
| 5 | Incumbent baseline | Dev server on :3001 (port 3000 is OpenChamber). Screenshots: `/tmp/opencode/shots/inc-home.png`, `inc-events.png`, `inc-admin-login.png`. |
| 6 | Capability inventory (parallel subagents) | `docs/redesign/inventory/public-surfaces.md` (42 public surfaces), `docs/redesign/inventory/admin-and-auth.md` (admin routes, 40 permissions, 5 roles, session mechanics, audit log, push, scheduler, settings). |
| 7 | Database census | 17 tables; 60 events, 5 news, 38 contacts, 14 organisations, 25 gallery images, 11 shared-gallery groups, 4 archive entries, 14 admin users, 11 settings. |
| 8 | `impeccable detect --json` | Deferred to the gate step, as the tool instructs (run once on the changed UI). |

## 2. Direction

- **Round served:** `impeccable serve-question --start --payload .impeccable/questions/direction.json`
  → `http://127.0.0.1:44061/`, key `88e7ebf7`. Opened in the user's browser
  through the forced headless path (`IMPECCABLE_QUESTION_FORCE=1`); no answer
  was awaited, per the brief.
- **Assigned direction built:** **Dorfchronik** — the village chronicle open at
  today's leaf: ruled margin with today's date and register tallies, numbered
  entries, stamped states, pine buckram spine, iron ink on cool bone paper, one
  rubric red for state.
- **Pick card (not built):** Anschlagtafel — the notice-board cliché, shown with
  its honest risk line.
- **Verdicts:** reference setting (competitive), doujin hall catalogue
  (competitive), orienteering sheet (competitive), transit diagram (declined,
  kept strict sequence), exposure record (declined, kept state without colour),
  bitmap specimen (declined, kept the integer size ramp).
- **Raises written into the direction:** a real one-pixel ruling discipline and
  printed state marks; whole-cell density at stamp size; a ranked symbol
  legend; grayscale-legible states; a fixed year sequence; one number form on
  an integer ramp.
- **Surface brief:** `.impeccable/surfaces/app-page-tsx.md`
  (`surface-brief write app/page.tsx … app/admin/dashboard/page.tsx`), all six
  blocks + `seed:aeab3ce915cb7ef3` verified by reading the file back.
- Build path: **code-led** (Operate surface; no comp gates).

## 3. Build

Design system written in the main thread:

- `app/design/tokens.css` — palette, type ramp, spacing, margin column.
- `app/design/base.css` — self-hosted Archivo + Literata, base type, focus ring,
  reduced motion.
- `app/design/components.css` — spine, nav, sheet, margin, entry, stamp, buttons,
  fields, notices, data table, rails, prose, plates, colophon.
- `app/design/admin.css` — keeper's desk rail, panels, stats, dialogs.
- `app/design/pages.css` — calendar, agenda, article, directory, gallery,
  forms, hubs, timeline, map, weather, legal, club pages.
- `app/layout.tsx` — new shell (spine + colophon), metadata, font preload.
- `app/page.tsx` — new home: today's leaf, five dated entries, register news,
  club index, village figure, portraits, building dossiers.
- `app/components/register/*` — nav data, spine nav, mobile menu, entry,
  layout primitives (Leaf, Margin, PageHead, SectionHead, Empty, Notice),
  colophon.
- `app/lib/register-format.ts` — Berlin-time German date formatting.
- Admin shell: `app/components/admin/AdminFrame.tsx` (permission-aware rail,
  pending counts, push + task controls, logout), `AdminPage.tsx`, login and
  change-password rebuilt, dashboard rebuilt as the desk.
- `app/sitemap.ts`, `app/robots.ts` — new; the old world shipped neither.
- `scripts/db-backup.ts`, `scripts/db-restore.ts` — reversible data safety.

## 4. Subagents

| # | Agent | Packet | Files owned | Result |
|---|---|---|---|---|
| 1 | explore | Public capability inventory | `docs/redesign/inventory/public-surfaces.md` | 42-row route table, dead links, integrations, privacy defects. |
| 2 | explore | Admin + auth inventory | `docs/redesign/inventory/admin-and-auth.md` | 501 lines: routes, 40 permissions, role matrix, session mechanics, audit log, push, scheduler. |
| 3 | general | Events rebuild (`/was-steht-an`) | `app/was-steht-an/**`, `app/components/events/**` | see §5 |
| 4 | general | News rebuild | `app/neuigkeiten/**`, `app/components/news/**` | see §5 |
| 5 | general | Dorfleben rebuild | `app/dorfleben/{ortsrat,vereine,institutionen}/**`, `app/dorfleben/page.tsx` | see §5 |
| 6 | general | Contact, legal, search, 404 | `app/kontakt/**`, `app/impressum`, `app/datenschutz`, `app/suche/**`, `app/not-found.tsx` | see §5 |

Concurrency capped at four. Each packet names the owned files, the forbidden
files, the design contract path, acceptance criteria and the evidence required.

## 5. Subagent results

**#3 Events (general, `ses_e28ad039…`)** — rebuilt `app/was-steht-an/**` into
server page + client leaf: year rail (signature interaction), month grid,
agenda, search, category and club filters, deep link `?event=` with the 500 ms
note, register numbers (`Nr. 063`), cancellation stamp in all three views,
refresh with `?fresh=1`, real margin tallies. `tsc` 0, `eslint` 0, browser
checks at 1440/390, console clean. Deleted `CalendarClient.tsx` and
`CalendarClientNoSSR.tsx`. Flagged the phone-width spine overlap (fixed in the
main thread: `.spine-admin`/`.spine-tools` hidden below 760 px).

**#4 News (general, `ses_e28ad0397…`)** — rebuilt `app/neuigkeiten/**` and
`app/components/news/**`: index with category rail, per-category route with its
own canonical, article page with `.prose`, related entries, 404, parser for
Slate/HTML/plain/broken content plus an allowlist sanitiser, article zoom
lightbox restyled. `tsc` 0, `eslint` 0, all 5 stored articles render, isolated
production build of the segment passed. Trade-off recorded: no `loading.tsx`
because it made `notFound()` answer 200.

**#5 Dorfleben (general, `ses_e28ac968…`)** — rebuilt the hub (new route), the
Ortsrat pages, all 13 club routes and both institutions; added
`ClubContacts` (DB-driven contact cards) and a facts module. `eslint` 0,
`tsc` 0, every route 200, one h1 each, no Tailwind in the new markup. Reported
two orphan files; both deleted in the main thread. The institution-hospiz image
zoom was dropped by the agent and restored in the main thread with
`ZoomableImage`.

**#6 Contact, legal, search, 404 (general, `ses_e28ac968b…`)** — new `/kontakt`
hub, rebuilt directory (38 rows, search, affiliation filter, sort, `/` shortcut,
priority label), contact form (same endpoint and states, no invented
protection), editorial team, WhatsApp page gated by site settings, person
pages, `/impressum` + `/datenschutz` with the legal text kept verbatim and
placeholders marked, `/kontakt/impressum` and `/kontakt/datenschutz` now
308-redirect to the canonical pages, new `/suche` (news, dates, clubs, people)
and a real 404. `tsc` 0, `eslint` 0, every internal href resolves.

**#7 Gallery (general, `ses_e287c174…`)** — rebuilt `/impressionen` and both
submission flows: ruled group sections with plate grids, a dark plate lightbox
with download, prev/next, keyboard trap and a report sheet (same payload), the
add-photos dialog, the new-collection form (same fields, consents and payload)
and the add-to-existing flow. `tsc` 0, `eslint` 0, browser audit at 1440/390
(h1, alt, labels, overflow, console), 12 MB file rejected client-side. Two
pre-existing API gaps kept and reported, not papered over: the `my-groups`
endpoint is unscoped and the submit route still drops `socialConsent` /
`dateTakenRangeEnd`.
**#8 Admin register (general, `ses_e2878c95…`)** — rebuilt Termine, Nachrichten,
Bilder and Porträts: `AdminHead` + counts, tabs, filterbars, agenda as a data
table, month/week/day in the register surface, ruled create/edit dialogs,
pinned stamps, reorder panel, plate grids, moderation rows with decide/reset/
delete, same endpoints and permission gates. `tsc`/`eslint` clean; Playwright at
1440/390 with no console errors and no overflow; no production rows changed.
Removed the dead legacy inline news editor and the import of the old calendar
CSS.

**#9 Map, weather, archive, portraits, building projects (general,
`ses_e2875c3d…`)** — rebuilt Karte (legend counts, loading/partial/error, retry,
45 s Overpass deadline), Wetter (polling kept, manual refresh, timestamp,
decoded forecast, stale-data warning, retry), Archiv (Fuse search, filters,
sort, synthetic 2023 entry, real 404 for unknown ids), Wir Wendesser (approved
portraits, detail dialog, submission dialog with the same rules and inline
notices), Neubaugebiet and Feuerwehrgerätehaus (all facts, zoomable plans, ruled
Baufortschritt without invented percentages). `tsc`/`eslint` clean, routes 200,
unknown archive id 404, no overflow at 390.

**#10 Admin people (general, `ses_e287574e…`)** — rebuilt Kontakte (38 rows,
search/filters/sort, ruled form with the priority slider and repeatable rows),
Organisationen (table + inline editor), Benutzer (table, create with one-time
password, reset, delete with last-admin guard) and the 40-key permissions
dialog in a native `<dialog>` with grouped ruled checkboxes, search, group
select/clear and role defaults. Verified: 38 contacts, 14 organisations, 15
users, 41 checkboxes (40 + `*`), permissions unchanged save, focus trap through
80 Tab presses, throwaway contact created and deleted. `tsc`/`eslint` clean.

**#11 Admin management (general, `ses_e283886e…`)** — rebuilt Einstellungen (all
11 keys, typed, boolean as `"true"`/`"false"`), Protokolle (read-only table,
filters, pagination), Archiv (list + create/edit wizard, plus the missing
`/admin/archiv/bearbeiten/[id]`), Dorfwissen (layout list, three card
fieldsets, image picker, theme as legacy data, ruled preview) and Geteilte
Galerie + Meldungen (group and selection moderation, detail dialog, report
queue). Verified settings save/revert, archive create/edit/delete, layout
create/edit/duplicate/delete; no real report or submission was resolved or
deleted. Repaired a pre-existing sequence defect (`archive_id_seq` behind the
rows) that made archive create fail for everyone. `tsc`/`eslint` clean.

## 5a. Main-thread verification tools

- `/tmp/opencode/a11y.mjs` — Playwright audit: status, `h1` count, unlabeled
  inputs, images without `alt`, unnamed buttons/links, horizontal overflow and
  console errors, at 1440 and 390 px over 19 routes.
- `/tmp/opencode/contrast.mjs` — walks visible text, resolves the effective
  background, reports every node under WCAG AA (4.5:1 / 3:1 large).

Results at this point: **38/38 a11y checks clean**, **0 low-contrast nodes**
across the 11 audited routes (after raising `--ink-faint` to 4.5:1 and the
hidden menu label to the foil), and the `.rbc-*` calendar skin added.

## 5a. Deployment fix (container build)

The first container build (Nixpacks, no runtime secrets in the build) failed:
`lib/sql.ts` threw at import when `DATABASE_URL` was absent, and the prerender
step then tried to read PostgreSQL. Fixes:

- The pg pool is created on first query (`getPool()`), so importing a route
  during build never throws.
- `scripts/build.mjs` (the `build` script) checks `DATABASE_URL` — including the
  value in `.env`, which it reads the way Next does. Without a database it
  builds in compile mode: **no page is prerendered** (0 HTML files), every route
  renders on demand against the runtime database. With a database it runs the
  normal build and prerenders 50 pages.
- A build-time-only guard returns empty rows instead of throwing when Next
  evaluates a route during data collection in that mode; it cannot bake empty
  pages because compile mode emits none.
- `.next-*` build directories are ignored by ESLint and git.
- Verified: database-less build succeeds (0 HTML), `next start` with the runtime
  env serves real data and correct 404s; a normal build still prerenders.

## 5b. Ship record

- Branch `v2`, commit `b101fee`, pushed to `origin/v2`.
- Production build from the same tree: 132 routes, `tsc`/`eslint` clean.
- Served for inspection on `http://127.0.0.1:3004`
  (`NEXT_DIST_DIR=.next-build PORT=3004 bun run start`).
- Temporary reviewer account `redesign-review` deleted; its password file
  removed. The database contains no test rows from this run (contacts, archive
  entries and layouts created during verification were deleted; `archive_id_seq`
  was repaired to match the existing rows).
- Extra evidence kept with the review set: `.impeccable/review/extra/agenda-july-cancelled.png`
  (cancelled agenda rows struck and stamped in July 2026, the only month with
  cancelled entries).

## 6. Gates

### Production build (interim, before the last admin wave)

`NEXT_DIST_DIR=.next-build bun run build` → **compiled, TypeScript clean, 132
routes generated**. Four real blockers were found and fixed in the main thread:

1. `new Date()` during prerender on 24 pages → `app/lib/page-today.ts`, a short
   `'use cache'` entry (60 s) so today's date is never frozen at build time and
   the page still prerenders.
2. `usePathname()` in the spine → the nav markup was split into a pure
   `NavMarkup` and wrapped in `<Suspense fallback={<NavMarkup/>}>` in the root
   layout.
3. `/dorfleben/archiv/[id]` had no `generateStaticParams` → added from the four
   archived entries.
4. `/admin/news/bearbeiten/[id]` carried an in-flight `force-dynamic` stub from
   a subagent; the agent replaced it.

Also fixed at the gate: `.next-build/` added to the ESLint ignores (a side build
was flooding lint with generated types), and the unauthenticated admin API now
answers **401** from the proxy instead of reaching a handler that returned 500.
Permission denials for authenticated users still surface as 500 from the legacy
`requirePermission` throw; recorded as a known limitation, not a regression.

Interim route parity against the production server: **70 of 71 passed**; the one
failure was the admin-API status (fixed above, verified 401 on the dev server).

### Accessibility and contrast

- `a11y` audit (status, one `h1`, labels, alt, unnamed controls, horizontal
  overflow, console errors) at 1440 and 390 over 19 routes: **38/38 clean**.
- Contrast audit over 11 routes: **0 nodes below WCAG AA** after raising
  `--ink-faint` to a 4.5:1 value and the hidden menu label to foil.
- Keyboard: event dialog closes on Escape; the year rail, filters and tabs are
  operable; the gallery lightbox traps Tab and restores focus.

### Finish review, round 1

A fresh reviewer (no browser, `ses_e27e57c0…`) judged the built app against the
packet, the contract and the craft floor. **Disposition: `fix`** — the world was
committed and coherent; the defects were execution inside it. Every material
finding and its disposition:

| # | Finding | Disposition |
|---|---|---|
| 1 | Five tokens were self-referential (`--pine-line: var(--pine-line)`), silently voiding borders and a primary-button hover at 1.09:1 | Fixed: real values restored; a new test (`tests/design/tokens.test.ts`) asserts every `var()` resolves and no token refers to itself |
| 2 | Register numbers rendered on the calendar only | Fixed: `Entry` takes a `number`; home, news list, search and archive rows pass their real ids |
| 3 | `aria-label` on an entry replaced its date, place and state for screen readers | Fixed: label removed; the visible row is the accessible name |
| 4 | Home tallies were page slice lengths (5, 4) presented as register totals | Fixed: `getRegisterCounts()`; the margin shows 60 dates / 5 notices / 11 clubs and the live year |
| 5 | Gallery grids painted empty tracks as grey blocks | Fixed: gutters come from item borders; empty tracks are paper |
| 6 | Directory and dossier links were hover-only | Fixed: channels underlined in ledger, cards carry a visible arrow and an underlined title |
| 7 | 34 px admin controls | Fixed: `.btn--sm` is 44 px; the dialog close is 44 px |
| 8 | Cancelled state differed between agenda, grid, row and dialog | Fixed: agenda strikes, dialog stamps and strikes; one treatment everywhere |
| 9 | Contact priority off by one between editor and public page | Fixed: one displayed scale (1–8), storage unchanged |
| 10 | Invented "Antwortzeit 2–3 Tage" on the contact form page | Fixed: replaced with the factual "Zuständig: Ortsrat" |
| 11 | Phone time ranges wrapped; tablet tally crossed the margin rule | Fixed: wider date column, smaller non-breaking clock, wrapping tallies |
| 12 | Kicker repeated the margin date or the breadcrumb | Fixed: home kicker is "Wendessen · Register"; 13 club pages drop the duplicate kicker |
| 13 | Seven leaves had an undated margin | Fixed: every public leaf passes today's date |
| 14 | Admin Termine printed raw club ids | Fixed: resolved by key, then prefix, then a readable fallback |
| — | Pinned stamp differed between list and article | Fixed: one foil-filled `stamp--pinned` |
| — | "Freigegeben" stamped on every approved thumbnail | Fixed: only rejected images carry a thumb stamp |
| — | `1100` / `850+` in the history figures | Fixed: `1.100`, `850` |
| — | Map kept OpenLayers' rounded white chrome and OSM's full palette | Fixed: square paper controls, muted raster, restyled attribution |
| — | Declared image size 1200×800 for a 1920×1164 asset | Fixed |
| — | No raster provenance record | Fixed: `docs/redesign/RASTER-PROVENANCE.md` |
| — | Foil value drifted between brief and DESIGN.md | Fixed: `#C2A24B` everywhere |
| — | Home margin's "Jahrgang" was a hardcoded year with no action | Fixed: replaced with the real contact count, linked to the directory |
| — | Lazy images were captured as empty boxes (evidence defect, not a product defect) | Fixed in the capture script: images are forced eager and the viewport grows to the document height before the shot; every plate now renders in the evidence |
| — | The two building dossiers had no visible affordance | Fixed: a "Zum Vorhaben →" label, suppressed where the card already carries its own arrow |

Tests after the fixes: unit + capability + token guard **66 pass**, route parity
**71/71** against the production build, build **132/132** pages. The screenshots
were recaptured (with a scroll pass so lazy images are never caught as
fallbacks) and the reviewer was asked for a verdict pass over the fixes.

### Finish review, round 2 (verdict pass)

The same reviewer scored the fixes against the build. **Disposition: still
`fix`**, with two blockers and a list of finish work. Their claimed blockers and
what the build actually showed:

- **`/dorfleben/ortsrat/mitglieder` overflowed at 834 px** (31 px, clipped
  cards). Real: the two-column grid held until 560 px. Fixed: the member grid is
  one column below 1000 px and card text wraps.
- **Directory channels looked like plain text** on touch. Real: my earlier edit
  did not apply. Fixed: `mailto:`/`tel:` links are underlined in ledger at rest.
- Nine findings were scored partial. Four were coding misses on my side and were
  fixed: the home kicker (still printed the margin's date), the dialog close
  (still 34 px), the news article's margin (no date), the map controls (the
  module selector was scoped to a hashed class and never matched).
- The admin gallery still painted empty grid tracks grey: it uses the global
  `.plates`, which I had only fixed in the module. Fixed globally.
- The reviewer judged the agenda strike unresolved by reading `Agenda.tsx` and
  `calendar.module.css`; the rule lives in the global `pages.css` and matches.
  Verified in the browser on July 2026: struck titles and `Abgesagt` stamps on
  both cancelled rows (`/tmp/opencode/shots/agenda-july.png`). Evidence gap, not
  a build defect.
- Finish work applied in the same batch: register numbers on archive and
  related-entry rows, the phone number now sits under the date instead of
  orphaning a row, the rubric rail sizes to its content, the image-less Dorfwissen
  card centres its text, and the "Jahrgang 2026" that remained in the home note
  was removed.

### Finish review, round 3 (final)

Both round-2 blockers were confirmed closed (Ortsrat at 834 px, directory
channels). Eight of eleven finish items were resolved; the reviewer then carried
one finding it had scored partial and then dropped: **every dated row hid its
date from assistive technology** (`aria-hidden` on the date block, no
equivalent). That is a WCAG 1.3.1 failure on the site's core datum, and it was
right to block.

Fixed in the main thread:

- `Entry` and `Agenda` keep the visual date block hidden and expose a real date
  string to assistive technology (`4. Dezember 2026, 09:30 – 11:30`, plus
  ", abgesagt" for cancelled rows). Verified in the served HTML: the row's
  accessible text now begins with the long date.
- `Entry` renders a register number **and** a stamp when both exist (archive
  rows keep their `DOKUMENT` stamp and their number).
- `.rail` is `width: max-content`, so the news rubric rail no longer leaves an
  empty outlined strip after the last tab.
- Map zoom controls are 44 px.

The reviewer's remaining notes are cosmetic and recorded, not blocking: the
three Dorfwissen CTAs no longer share a baseline (one card is centred), and the
map buttons, while in-world, were 34 px before this last batch.

### Finish review, final disposition

The reviewer's last pass returned **`ship`**, conditioned on the record telling
the truth about the remaining accessibility detail. Its three residues were
one-liners in the same two components; all three were fixed before the build
that is committed:

- The spoken date no longer appends the notice year as a clock
  (`4. Dezember 2026, 09:30 – 11:30`, not `7. Januar 2026, 2026`).
- The comma is inside one template string, so the spoken text has no stray space.
- The visual `Abgesagt` stamp is read once; the hidden text no longer repeats it.
- Agenda rows now announce their register number alongside the date, and `Entry`
  shows the number under a default state label too.

Verified in the built HTML: the home row reads `4. Dezember 2026, 09:30 – 11:30`
and the agenda row `11. November 2026, 15:00 – 17:00, Nr. 074`.

The capture set is from the build immediately before these text-only changes;
no captured screen changes visually because the only new visible element is the
number under a cancelled row's label, and no cancelled entry is in the upcoming
list.

### Detector — final result

`impeccable detect --json app lib` → **`[]`**. It took three passes: the first
run found 180 findings (mostly legacy palette and off-ramp sizes), the second
21, and the last one had a single advisory (a 12 px phone clock), now a token
(`--clock-sm`) documented in DESIGN.md.

Final automated results

| Check | Result |
|---|---|
| `bun run build` (prod, `.next-build`) | 132 routes, TypeScript clean, lint clean |
| `bun test` unit + capability + design | 66 pass, 0 fail (406 assertions) |
| `bun test tests/parity/routes.test.ts` (prod server) | 71 pass, 0 fail |
| a11y + overflow audit, 19 routes × 2 widths | 38/38 clean |
| contrast audit, 11 routes | 0 nodes below AA |
| hover-state contrast (primary button, links) | 14.46:1 / 8.55:1 |
| `impeccable detect` | `[]` |



