---
name: Wendessen
description: The village register, open at today's leaf — ruled margin, numbered entries, stamped states.
colors:
  buckram-pine: "#1B2F27"
  pine-deep: "#142420"
  pine-raised: "#243B31"
  foil: "#C2A24B"
  bone-paper: "#E9EBE6"
  paper-raised: "#F1F2EE"
  paper-sunken: "#DFE2DC"
  iron-ink: "#161A17"
  ink-secondary: "#39423B"
  ink-muted: "#5D665F"
  ink-faint: "#59615A"
  ledger-blue: "#23476B"
  ledger-soft: "#DBE3EA"
  rubric-red: "#9E2B25"
  rubric-soft: "#F0DCD8"
  field-ok: "#2C6444"
  field-warn: "#8A5A12"
  rule: "#C4C8C0"
  rule-strong: "#969D94"
typography:
  monument:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "5.5rem"
    fontWeight: 640
    lineHeight: 0.86
    letterSpacing: "-0.04em"
    fontVariation: "wdth 92"
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 620
    lineHeight: 1.1
    letterSpacing: "-0.018em"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 620
    lineHeight: 1.22
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  reading:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.68
  label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  "3xl": "64px"
  "4xl": "96px"
components:
  button-primary:
    backgroundColor: "{colors.buckram-pine}"
    textColor: "{colors.bone-paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.bone-paper}"
    textColor: "{colors.iron-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.bone-paper}"
    textColor: "{colors.rubric-red}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
    height: "44px"
  nav-tab:
    backgroundColor: "{colors.buckram-pine}"
    textColor: "{colors.bone-paper}"
    typography: "{typography.label}"
    padding: "0 8px"
    height: "60px"
  input:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.iron-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
    height: "44px"
  panel:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.iron-ink}"
    rounded: "{rounded.none}"
    padding: "16px"
  entry-row:
    backgroundColor: "{colors.bone-paper}"
    textColor: "{colors.iron-ink}"
    typography: "{typography.title}"
    padding: "16px 0 16px 8px"
  colophon:
    backgroundColor: "{colors.buckram-pine}"
    textColor: "{colors.bone-paper}"
    typography: "{typography.label}"
    padding: "48px 0 12px"
---

# Design System: Wendessen

## Overview

**Creative North Star: "The Village Chronicle, Open at Today's Leaf"**

Wendessen keeps one register, and the website is that register. The page is a
sheet of the book: a fixed left margin carries today's date at monumental scale
and the register's tallies; the leaf carries numbered, dated entries; each entry
is stamped with its state. The shell is the book's binding — pine buckram with a
foil rule — and the body is iron ink on cool bone paper with one rubric red that
only ever means state.

The system is deliberately flat, ruled and quiet. It refuses the village-portal
default it replaced: illustrated hero, gradient bands, white cards with soft
shadows, a carousel of club cards, seven top-level sections that each restarted
with another hero. Nothing floats here; nothing casts a shadow; nothing is
rounded. Density is high and honest, because the register's job is to show what
is on and what changed, not to sell the village.

Two things carry the identity with all content removed: the **ruled margin**
(day number, month in rubric caps, dotted tally rows) and the **stamp** (10 px
uppercase, double rule, a cancelled row struck through and stamped askew at
−1.6°). Typography does the rest: Archivo's variable width for headings and
figures, tabular numerals everywhere a number can be compared, Literata only for
long reading.

**Key Characteristics:**
- Pine buckram shell (`#1B2F27`) with a foil hairline (`#C2A24B`), bone paper body.
- One-pixel rules, zero radius, zero shadow; depth comes from tonal paper steps.
- A 168 px register margin on desktop that becomes a date strip on phones.
- One rubric red (`#9E2B25`) reserved for state, attention and the current day.
- Tabular numerals on a fixed integer ramp, from 11 px tally to 88 px day number.
- States are printed marks: open, new, decided, draft, pinned, cancelled.

## Colors

A committed shell around a restrained body: the only saturated field is pine, and
the only red is a state.

### Primary
- **Buckram Pine** (`#1B2F27`): the spine header, the admin rail, the colophon,
  primary buttons, the lightbox ground. It is the book's binding and appears as
  large fields, never as a scattered accent.
- **Pine Deep** (`#142420`): menus, admin rail, pressed states, the mobile menu.
- **Pine Raised** (`#243B31`): hover inside pine surfaces.
- **Foil** (`#C2A24B`): one-pixel rules on the spine, the wordmark's second line,
  pending counts, colophon column titles. Foil is foil stamping, not a highlight.

### Secondary
- **Ledger Ruling Blue** (`#23476B`): links, selection, focus ring, the 6 px
  category markers in the calendar, structure inside prose. It belongs to the
  ruled line, not to the content.

### Tertiary
- **Rubric Red** (`#9E2B25`): the chronicle's rubric. Used for the kicker, the
  current day, cancelled entries and destructive actions. Never decoration.

### Neutral
- **Bone Paper** (`#E9EBE6`): page ground. Cool, not cream.
- **Paper Raised** (`#F1F2EE`): panels, hover rows, inputs.
- **Paper Sunken** (`#DFE2DC`): table heads, out-of-month cells, disabled.
- **Iron Ink** (`#161A17`): body and headings, 15.9:1 on paper.
- **Ink Secondary** (`#39423B`): ledes and metadata, 8.6:1.
- **Ink Muted** (`#5D665F`): hints and captions, 5.4:1.
- **Ink Faint** (`#59615A`): micro labels only, still ≥4.5:1.
- **Rule** (`#C4C8C0`) and **Rule Strong** (`#969D94`): hairlines and input borders.

### Named Rules
**The One Red Rule.** Rubric red marks state or attention, nothing else. If a
screen needs emphasis and no state exists, use weight, size or a rule.

**The Paper Rule.** No colour is invented outside these tokens; a new hue means
the direction has drifted.

## Typography

**Display Font:** Archivo (variable, width 62–125, weight 100–900; fallback
Helvetica Neue, Arial)
**Body Font:** Archivo for interface; Literata for long reading (fallback Georgia)
**Label Font:** Archivo, uppercase, 0.08–0.16em tracking

**Character:** A German engineered grotesque against a screen-reading serif. The
grotesque carries numbers and structure; the serif is allowed only where someone
reads for minutes. Both are self-hosted woff2, preloaded, OFL-licensed.

### Hierarchy
- **Monument** (640, 88 px / 0.86, width 92): today's day number in the margin;
  collapses to 32–56 px below 900 px.
- **Display** (620, 56 px / 1.1, −0.018em): page `h1`, balanced wrapping.
- **Title** (620, 22 px / 1.22): entry titles, section heads at 24 px.
- **Body** (400, 17 px / 1.55): interface body; 65–75ch measure in prose.
- **Reading** (400, 19 px / 1.68, Literata): articles, club histories, legal text.
- **Label** (600, 13 px, 0.08em, uppercase): buttons, tabs, table heads at 10 px,
  tallies at 11 px.

### Named Rules
**The Tabular Rule.** Any figure that can be compared is tabular — dates, times,
register numbers, counts, priorities. Archivo carries `tnum`.

**The Two-Voice Rule.** Literata never appears in a control, a label, a table or
a heading above 24 px.

## Layout

A 1200 px page (`clamp(16px, 4vw, 40px)` inline padding) holds a two-column
sheet: a **168 px margin** with a 1 px right rule and a fluid leaf. Below 900 px
the margin narrows to 104 px; below 640 px it becomes a horizontal date strip and
the leaf takes the full width. The margin is sticky on desktop and carries the
day number, the month, the weekday, and dotted tally rows.

Entries are a three-column row (`84px | 1fr | auto`) with 16 px vertical rhythm;
on phones the date column narrows to 56 px and the state moves under the body.
Sections are separated by 48–96 px; more space above a heading than below it.
Spacing is a 4 px scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. The admin uses a
232 px pine rail plus a fluid work area, collapsing to a horizontal rail below
900 px.

## Elevation & Depth

**There are no shadows.** The system is flat and derives depth from tonal paper
steps (`paper-sunken` under `paper` under `paper-raised`), from one-pixel rules,
and from the pine shell sitting above the paper. Overlays (mobile menu, event
dialog, lightbox) are flat fields with a 1 px border and a scrim; the dialog's
`::backdrop` is pine at 62% opacity. A shadow anywhere is a defect; the Tailwind
theme maps every shadow step to `none` so legacy markup cannot reintroduce one.

## Shapes

Zero radius everywhere: buttons, inputs, panels, stamps, plates, dialogs, chips.
The form language is the rectangle and the rule. The only non-rectangular marks
are the Wappen, the circular icon of a loading state and the −1.6° rotation of a
cancelled stamp. Borders are always 1 px; a thicker edge is not used as an accent
on a card, row or alert. Image plates are square-cornered and separated by 1 px
gaps; captions sit on a scrim.

## Components

### Buttons
- **Shape:** square (0 px), 44 px minimum height, 1 px ink border.
- **Primary:** pine ground, bone text, uppercase 13 px/0.08em, 10×16 px padding.
- **Secondary:** paper ground, ink text, same geometry; hover inverts to ink.
- **Danger:** paper ground with rubric border and text; hover fills rubric.
- **Hover / Focus:** 120 ms linear background; focus-visible is a two-ring ledger
  outline with a 2 px paper gap; disabled is a sunken ground with faint text.
- **Link:** `.arrow-link` in ledger blue with an arrow that shifts 3 px on hover.

### Chips / Stamps
- **Style:** 10 px uppercase, 1 px border plus inset second rule, no radius.
- **Variants:** neutral, new (ledger), decided (pine), draft (dashed), pinned
  (foil fill), cancelled (rubric, double rule, −1.6° rotation, struck title).
- **Use:** state only. Never a tag cloud; never colour alone.

### Cards / Containers
- **Corner Style:** none.
- **Background:** paper raised on paper; panels in the admin; no nesting.
- **Shadow Strategy:** none — see Elevation.
- **Border:** 1 px rule; the top edge of a dossier tab may be 3 px pine, never a
  side edge.
- **Internal Padding:** 16–24 px; 32 px for page-level panels.

### Inputs / Fields
- **Style:** 44 px, paper-raised ground, 1 px rule-strong border, 16 px text.
- **Focus:** border turns ledger with a 1 px inset ring; no glow.
- **Error / Disabled:** rubric border plus an error line under the field; disabled
  fields use the sunken ground. Every control has a visible label above it.

### Navigation
- **Spine:** 60 px pine bar, 34 px Wappen, expanded-caps wordmark with a foil
  subline, five uppercase tabs with `<details>` dropdown panels, a search field
  and a bordered "Redaktion" button.
- **Mobile:** a `<details>` panel under 1180 px that covers the viewport, with the
  full register and the search; body scroll is locked while open.
- **Current state:** a 2 px foil underline and `aria-current`; never a pill.

### Register entry
- **Shape:** ruled row, no container; hover is a raised paper background and an
  underlined title.
- **Columns:** date block (day 28 px, month in rubric caps, weekday, clock),
  body (title 22 px, facts, two-line clamp), state column (`Nr. 042` or a stamp).
- **Cancelled:** struck title, muted date, stamp retained in place.

### Tables and ledgers
- **Head:** 10 px uppercase on an ink rule; **rows:** 1 px rule, hover tint;
  numbers tabular and right-aligned where they are quantities.
- **Directory:** name and affiliations, all contact channels inline (no modal),
  priority as a small label; three columns collapse to one on phones.

## Do's and Don'ts

- **Do** let the margin carry live data: the date, the counts, the next entry.
- **Do** keep a cancelled entry in place, struck and stamped.
- **Do** use one-pixel rules to separate; use paper tones to group.
- **Do** set every comparable number in tabular figures.
- **Do** write German, plain and short; controls name their action.
- **Do** show loading, empty, error and success in the register's own language.
- **Don't** use radius, shadow, gradient, glass, icon tiles or emoji.
- **Don't** introduce a hue outside the tokens.
- **Don't** signal state with colour alone.
- **Don't** put a thick coloured bar on the side of a card, row or notice.
- **Don't** turn a list into cards, or a card into a card.
- **Don't** use Literata in controls, labels, tables or large headings.
- **Don't** animate an entrance; motion is state feedback only.
