# Finish review packet — the village register

You are the finish reviewer. You have no browser. Judge only from the files and
screenshots named here. Be specific: cite the screenshot path and the region you
mean, and quote the code line when you judge behavior.

## The request

Replace the full-stack village website of Wendessen (Germany) end to end: new
visual world, interaction model and information architecture, on the existing
data and stack, with every capability preserved, verified, documented.

## Product truth

Read `PRODUCT.md`. Key facts: residents (about 1,100, per the village's own
chronicle), club officers, Ortsrat, visitors, a volunteer editorial team.
Operate surface. German only. Real data only; no invented numbers, quotes,
prices or capabilities.

## The direction contract (approved and built)

Read `.impeccable/surfaces/app-page-tsx.md` and `DESIGN.md`.

- **THESIS** — the village keeps one register, and the site is that register
  open at today's leaf: numbered, dated entries in a ruled margin, stamped with
  their state. It refuses the category's hero-plus-card-grid village portal.
- **OWN-WORLD** — pine buckram shell, bone paper, iron ink, ledger blue, one
  rubric red for state; one-pixel rules, zero radius, zero shadow; one number
  form on a fixed integer ramp; the register margin and the stamp as the
  signature.
- **STORY** — today's date and the register's tallies in the margin, the next
  dated entries with their states, then the newest notices; the visitor opens
  an entry, finds a club or a person, or goes to the calendar.
- **FIRST VIEWPORT** — pine spine with the Wappen and the foil-stamped name; a
  ruled tab row; a 168 px margin with the 88 px day number and tallies; five
  dated entries in the leaf.
- **SIGNATURE** — the year rail re-scopes the leaf; every entry carries a
  register number; a cancelled entry keeps its place, is struck through and
  stamped `Abgesagt` at −1.6°.

## What was built (for orientation)

Read `RUN.md` (commands, subagents, gates) and `PARITY.md` (capability inventory
and old→new mapping). The stack stays Next.js 16 + PostgreSQL + MinIO + SMTP +
web push; Tailwind remains only as a compiler and its theme is remapped to the
register (radius 0, shadow none, register palette); every new surface uses the
semantic class system in `app/design/`.

## Evidence you must judge

Screenshots: `.impeccable/review/{desktop,tablet,phone}/<route>.png` — full-page
captures of every public route and every admin screen at 1440, 834 and 390 px,
plus `/was-steht-an?event=77` (event dialog open) and `/gibt-es-nicht` (404).

Automated evidence already collected:

- Detector: `impeccable detect --json app lib` → `[]` (no slop findings).
- Contrast: 0 text nodes below WCAG AA across 11 routes at 1440.
- A11y/overflow: 38/38 checks clean (one h1, labelled inputs, alt text, named
  controls, no horizontal overflow, no console errors) at 1440 and 390.
- Route parity: 71/71 tests pass against the production build.
- Unit + capability tests: 62 pass (Berlin date formatting, schema, events
  cancellation, news pins, contacts, moderation, settings).
- Production build: `bun run build` green, 132 routes.

Known limitations, already disclosed (judge whether they are acceptable, do not
re-discover them):

1. `notFound()` inside a dynamic segment (`/dorfleben/archiv/[id]`,
   `/neuigkeiten/[id]`) returns a correct 404 status but the styled 404 body is
   streamed as an RSC payload: visible after hydration, empty without JS.
2. Permission denials for an authenticated but unauthorised user still return
   HTTP 500 from the legacy `requirePermission` throw (the proxy now answers 401
   for unauthenticated calls). Pre-existing behaviour.
3. `/api/shared-gallery/my-groups` still returns all collections, and
   `/api/shared-gallery/submit` still drops `socialConsent` and
   `dateTakenRangeEnd`. Pre-existing; the UI sends the fields and claims nothing.
4. Overpass (map POI data) is unreachable from the build machine; the map shows
   an honest error and retry. The basemap was switched to keyless OpenStreetMap
   tiles because CARTO now demands an API key.
5. The contact form still has no captcha or rate limit; no copy claims one.

## The quality bar

Read `/home/openchamber/.config/opencode/skills/impeccable/reference/craft-floor.md`.
Judge against it: contrast, depth, spacing, type, motion, states, browser
surfaces, copy, coverage. Note that this world deliberately has **no shadows
and no radius** (the floor allows a flat system that derives depth from tones
and rules), and that the kicker above the h1 is part of the world's rubric —
judge whether it earns its place, not whether it exists.

## Return exactly these five sections

1. **Disposition** — one word: `ship`, `fix`, `rebuild`, or `recapture`, with a
   one-paragraph justification. `recapture` only if the evidence itself is
   invalid; `rebuild` only if the world fails wholesale.
2. **Material findings** — numbered, each with: what is wrong, where (screenshot
   path + region, or file:line), why it matters against the contract or the
   floor, and the concrete fix. No finding without evidence.
3. **Contract compliance** — a short verdict per block (thesis, own-world,
   story, first viewport, signature, finish line) with the evidence you used.
4. **Parity spot-check** — pick five rows of `PARITY.md` and say whether the
   screenshots and code support the claimed status.
5. **What is unfinished** — anything a shipping decision must know.

Do not soften a failure into a compliment. Do not invent evidence. If a claim
cannot be checked from what you were given, say so and name what would check it.
