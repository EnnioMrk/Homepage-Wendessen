# Design rules for the register (read before touching a page)

This file is the working contract for anyone building screens in this app. The
full visual record is `DESIGN.md`; this is the operational short form.

## The world in one line

The site is the village chronicle open at today's leaf: numbered entries in a
ruled margin, iron ink on cool bone paper, a pine buckram spine, one rubric red
for state. It is an **Operate** surface — navigation, controls and tables are
standard web controls; the world supplies type, palette, density and one
signature move: **the register margin plus the stamp**.

## Never

- No border radius anywhere (`border-radius: 0`).
- No box shadows, no gradients, no glass, no floating cards.
- No Tailwind utility classes in new markup. Use the classes below, or a CSS
  module in your own folder.
- No emoji as icons. No coloured icon tiles.
- No invented numbers, testimonials, prices, dates or people.
- No colour-only state: pair every state with a word and a mark.
- No hover-only information.
- Do not edit the global design system (`app/design/*.css`), the shell
  (`app/layout.tsx`, `app/page.tsx`, `app/components/register/*`) or `lib/*`
  unless your packet says you own them.

## Shell and composition

The root layout already renders the spine header and the colophon. A page body
is a `<Leaf>`:

```tsx
import { Leaf, Margin, PageHead, SectionHead, Empty, Notice } from '@/app/components/register/Layout';

<Leaf
  margin={
    <Margin
      date={new Date()}
      tallies={[{ label: 'Termine', value: 5, href: '/was-steht-an' }]}
      note={<>Kurzer Hinweis zur Spalte.</>}
    />
  }
>
  <PageHead kicker="Register · Termine" title="Was steht an" lede="…" />
  …
</Leaf>
```

- `PageHead` renders the kicker, h1 and lede. One `h1` per page.
- `SectionHead` renders a ruled section title with an optional "Alle …" link.
- `Empty` is the ruled empty state. `Notice` is the inline status strip
  (`tone`: `info | warn | error | ok`).
- The margin collapses on phones to a date strip automatically. Never duplicate
  the same fact in margin and body.
- Page content sits on the bone ground. Full-bleed blocks are allowed only for
  the map and the calendar grid, and must keep their 1px border.

## Dates

Use `app/lib/register-format.ts`: `dayOf`, `monthShort`, `weekday`, `clock`,
`timeRange`, `dateLong`, `dateShort`, `yearOf`, `isoDay`. Berlin time zone.
German month and weekday names, never English.

## The entry row

`<Entry>` from `app/components/register/Entry` is the unit of every list of
dated things:

- `date`, optional `endDate`, `title`, `href`, `meta` (place, organiser),
  `description`, `state` (`open | cancelled | new | decided | draft`), `stamp`
  (a word that overrides the default stamp), `showClock`, `timeText`.
- Cancelled entries keep their place in the list, lose their colour, get a
  struck title and an askew `Abgesagt` stamp. Never delete a cancelled row.
- For non-dated lists use `.dir` (directory rows), `.club-index` (clubs), or a
  `.data` table. Do not turn every list into cards.

## Controls

```html
<button class="btn">Sekundär</button>
<button class="btn btn--primary">Bestätigen</button>
<button class="btn btn--quiet btn--sm">Klein</button>
<a class="btn btn--danger" href="…">Löschen</a>
<a class="arrow-link" href="…">Weiterlesen</a>
<div class="field"><label for="x">Titel</label><input class="input" id="x" /></div>
<select class="select">…</select>
<textarea class="textarea"></textarea>
<label class="check"><input type="checkbox" /> Text</label>
<div class="notice notice--error"><strong>Fehler</strong><span>…</span></div>
<div class="rail"><a href="?jahr=2025">2025</a><a aria-current="true">2026</a></div>
<div class="tabs"><button aria-selected="true">Monat</button><button>Agenda</button></div>
<table class="data">…</table>
<div class="empty"><h3>Keine Einträge</h3><p>…</p></div>
```

All controls are at least 44 px tall, keyboard focus shows the ledger ring, and
every input has a visible `<label>`.

## Type

- UI, headings, all numbers: Archivo (already set on `body`). Use
  `font-variant-numeric: tabular-nums` for any column of figures — the class
  `.num` does it.
- Long-form reading (article body, club history, legal text): `.prose` or
  `.legal`, which switch to Literata.
- Sizes come from tokens: `--tally` 11, `--small` 13, `--label` 15, `--body` 17,
  `--body-lg` 19, `--lead` 22, `--h3` 24, `--h2` 34, `--h1` 56, `--monument` 88.
- Uppercase micro-labels use letter-spacing between 0.1em and 0.16em.

## Palette (tokens only)

`--paper`, `--paper-raised`, `--paper-sunken`, `--ink`, `--ink-secondary`,
`--ink-muted`, `--pine`, `--pine-deep`, `--pine-ink`, `--foil`, `--ledger`,
`--rubric`, `--ok`, `--amber`, `--rule`, `--rule-strong`.
Rubric red is for state, attention and cancelled only. Ledger blue is for links
and selection. Never introduce a new hue.

## States that must exist on every data screen

Loading (skeleton or "Laden…" in the ruled style), empty, error with a retry,
success confirmation, and the over-long case (long titles, long emails,
zero-padded numbers). Localise all of it in German.

## Accessibility floor

One `h1` per page. Landmarks via `header`/`nav`/`main`/`footer` (shell
provides main). `aria-current` on navigation and rails. Focus-visible must stay
visible. Images need real `alt` text (decorative → empty alt). Tables get
`<th scope>`. Dialogs trap focus and close on Escape. Nothing important may
depend on hover. Reduced motion is already handled globally.
