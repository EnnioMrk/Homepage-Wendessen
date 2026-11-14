---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/admin/dashboard/page.tsx"]
---

# Surface: the village register (public shell, home, and dated surfaces)

Mode: **Operate** (a working village register; navigation and controls are standard web controls, the world supplies type, palette, density, and one signature move).

## Audience and job

Residents on a phone in daylight, club officers publishing once a season, Ortsrat members correcting a notice, visitors reading the village. The job on the first screen: **what is on, what changed, and who do I ask**. Second job: reach a club, a person, a photo, a piece of history, or the admin area.

## Constraints

- German only, Europe/Berlin dates, real data from PostgreSQL; no invented numbers, quotes, or prices.
- Every current capability stays (see PARITY.md). Existing URLs keep working.
- WCAG 2.2 AA: large default type, 4.5:1 text contrast, visible focus, keyboard-operable, reduced-motion respected.
- Mobile-first: 360–430 px is the primary width; the margin column collapses to a date tab.
- Performance: server-rendered HTML, no client JS for reading pages, self-hosted fonts, no layout shift, LCP < 2.5 s on 4G.

## Direction contract

**THESIS** — The village keeps one register, and the site is that register open at today's leaf: every date, club, person and photo is a numbered entry, dated in a fixed left margin and stamped with its state. It refuses the category's hero-plus-card-grid village portal and the separated "section" silos.

**OWN-WORLD** — Buckram pine shell (`#1B2F27`) with a foil hairline (`#C2A24B`) carrying a condensed uppercase spine label; content on cool bone paper (`#E9EBE6`); iron ink (`#171A16`); ledger ruling blue (`#23476B`) for structure and links; rubric red (`#9E2B25`) reserved for state and attention. One-pixel rules everywhere, no corner radius anywhere, one tabular number form (Archivo, tabular figures) scaled on a fixed ramp (11/13/15/18/24/34/56/88). Literata only for article prose. The component language is ruled rows, margin tallies, stamped states, and bold spine tabs; nothing floats, nothing casts a shadow.

**STORY** — The visitor sees today's date in the margin, the next dated entries with their states, and the newest notices; understands that this is the village's continuous record, not a brochure; then opens one entry, finds the club or the person, or goes to the calendar. The visitor believes the record is kept by someone accountable because every entry carries a number, a date and a stamp.

**FIRST VIEWPORT** — A full-width pine spine (56 px desktop, 48 px phone) with the Wappen at 28 px, "WENDESSEN" in condensed caps, and "Dorfchronik seit 1170" in small foil caps; under it a ruled tab row of the five sections plus a search field. The page below is a two-column ruled sheet: a 168 px margin column (today's day number at 88 px, weekday and month in caps, then the register tally: dates, clubs, notices, people) and a 1 px-rule content column holding "Was steht an" as five ruled entries with date tab, title, place and a stamp, then "Aus dem Register" as three notice rows and the newest photos as a stamp grid. Primary action: the first entry row, and a spine tab "Termine". Signature interaction: **the year rail** — a ruled row of years (2023–2027) above the entries; choosing a year re-scopes the whole leaf, and the margin tally and entries redraw in place.

**FORM** — Grounded candidate 3 of 7 (1 Anschlagtafel, 2 Katasterblatt, 3 Dorfchronik, 4 Vereinskalender, 5 Schießscheibe, 6 Einsatztafel, 7 Ortstafel). `seed:aeab3ce915cb7ef3`.

**FINISH** — unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
