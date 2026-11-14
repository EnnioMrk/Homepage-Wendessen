# Redesign — the village register

## The world

The old site was a village portal: an illustrated banner, green gradient bands,
white cards with soft shadows, a carousel of club cards, seven top-level
sections that each began again with a hero. It could have belonged to any
village, club or small municipality.

The new site is **the village chronicle, open at today's leaf**. Wendessen keeps
one register. Every date, notice, club, person and photo is an entry in it: the
entry carries a number and a date in a ruled margin, and it carries a stamp
that says what state it is in — open, new, decided, cancelled. The page is a
sheet of the book, not a landing page.

That world is not decoration. It comes from the product's mechanism:

- the village's own record begins in 1170 (`Winedissen`) and is still being
  written, so chronology is the spine of the site;
- the content is institutional as well as social — Ortsrat notices, club dates,
  the contact directory, the archive — so the interface owes the reader
  accountability: a number, a date, a stamp, a keeper;
- the most important state in the product is **cancelled**, and a register can
  say "cancelled" without deleting the row.

## What carries the world (and what deliberately does not)

| Carrier | Decision |
|---|---|
| Palette | Buckram pine `#1B2F27` shell with a foil hairline `#B08A4B`; cool bone paper `#E9EBE6`; iron ink `#161A17`; ledger blue `#23476B` for structure and links; rubric red `#9E2B25` only for state and attention. No gradient, no extra hue. |
| Type | Archivo (variable width and weight, self-hosted) for the interface, headings and every figure; Literata only for long reading. One number form, tabular, on a fixed integer ramp from 11 px margin tally to the 88 px day number. |
| Density | Ruled rows, hairline rules, a fixed margin column. Entries tile; they do not float. |
| Signature move | **The register margin and the stamp.** Today's date stands at 88 px in the margin with the register's tallies under it; every dated row is stamped, and a cancelled row is struck through with an askew `Abgesagt` stamp that stays in place. The year rail re-scopes the leaf. |
| Refused | Cards with shadows, rounded corners, gradients, icon tiles, emoji, hero images, carousels, "glass". The illustrated banner is retired; the Wappen stays as the identity mark. |

## What changed

**Information architecture.** Seven top-level entries became five:
`Termine · Nachrichten · Dorfleben · Wohnen & Bauen · Kontakt`, with Geschichte,
Impressionen, Wir Wendesser, Karte, Wetter and Archiv inside Dorfleben, where
they belong. Four routes that used to 404 (`/dorfleben`, `/neuigkeiten`,
`/wohnen-bauen`, `/kontakt`) are now real hub pages. `/suche` is new and
searches news, dates, clubs and people. `sitemap.xml` and `robots.txt` are new.

**Interaction model.**
- The home page is a leaf of the register: today's date and tallies in the
  margin, five upcoming entries, the newest notices, the club index, the
  village figure, portraits, building dossiers.
- Events: month grid and agenda share one page, with a year rail, category and
  club filters, search, deep links (`?event=`) and cancellation that survives
  every view.
- The admin is a keeper's desk: a pine rail of sections with pending counts,
  permission-aware, a top strip that leads back to the public site, and screens
  that read as ruled registers instead of dashboards of cards.
- The public site keeps the PWA, the push subscription, the WhatsApp channel,
  the contact form, the photo submission flows and every admin capability.

**Stack.** Next.js 16 App Router stays (it serves the same routes, the same
`/api` contracts and the same server rendering the product needs). Tailwind
stays only as a compiler for legacy utility markup; the theme is remapped to
the register (radius 0, shadows none, register palette, Archivo/Literata), and
every new surface is written with the semantic class system in `app/design/`.
Fonts are self-hosted. No new runtime service, no new database.

## Assumptions (delegated decisions)

The user delegated every decision and forbade questions. These were decided and
are recorded here:

1. **The illustrated banner is retired.** It was the incumbent's identity, not
   a brand commitment; the Wappen is kept. Reverting is one file.
2. **Geschichte and Impressionen move under Dorfleben** in the top navigation.
   Their URLs do not change and the footer still links them directly.
3. **The admin keeps the public spine hidden** and uses its own top strip.
4. **`/impressum` and `/datenschutz` become canonical**; the shorter
   `/kontakt/*` variants stay reachable for old links.
5. **Cards and carousels are removed everywhere**, including screens the
   redesign did not otherwise rewrite: the theme maps radius to 0 and shadows
   to none, so the old markup cannot reintroduce the old look.
6. **Tailwind is kept as a compiler** rather than removed, because removing it
   in the same run would mean rewriting 39,000 lines of admin logic and would
   risk the parity requirement. This is a deliberate trade, recorded as a risk.
7. **One temporary admin account** (`redesign-review`) exists only to capture
   authenticated screenshots and is deleted at the end of the run.
8. **`SESSION_SECRET` is required in production** but was missing; the redesign
   documents it and does not invent a value.

## Risks

- **Unrewritten admin interiors.** The largest admin clients (shared gallery
  moderation, the events calendar editor, the news editor) are re-skinned by
  tokens and shell, and their list surfaces were rebuilt, but some inner
  markup still uses utility classes. They inherit the register's geometry but
  not always its composition. This is the main gap and is listed in PARITY.md.
- **The notice-board direction was not taken.** It is the category default and
  would have been the safe choice; the register is harder to keep legible when
  content is thin. Empty states therefore carry real guidance.
- **Density and older readers.** The register is denser than the old cards. The
  base size is 17 px, the margin collapses on phones, and contrast is held
  above 4.5:1; the trade is fewer, larger entries per screen rather than a
  wall of rows.
- **Font weight.** Two variable families add roughly 200 KB of woff2. They are
  preloaded and cacheable; the alternative (system fonts) would have cost the
  world its voice.
- **The year rail** assumes data across years. In a year with no entries the
  rail must still show a truthful empty state.
