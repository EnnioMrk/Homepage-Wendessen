# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Wendessen residents.** A village in Lower Saxony; the site's own chronicle gives 1,100 residents in 2026 (75 in 1663, 750 in 2005). They open the site on a phone, often outdoors or in a hall, to answer one question: what is happening, and who do I ask. Many are older; some use large text.
- **Club officers (Vereine).** Volunteers who publish dates, training times and contact people for their club, sometimes once a season, sometimes from a phone at an event.
- **Ortsrat and village administration.** They publish meeting dates, reports and decisions, and must be able to correct or cancel them fast.
- **Visitors and people considering moving here.** They want to understand the village, its clubs, its building areas and its history.
- **Editors and moderators.** A small volunteer team with roles and per-area permissions. They work in short sessions, often on a laptop in the evening.

## Product Purpose

Wendessen.de is the village's own record and notice board: dates, news, clubs, people, photos, building areas and history in one place. Success means a resident finds the right date, person or answer without asking in a WhatsApp group, and a club officer can publish without help.

## Positioning

The site is not a regional portal or a club's own page: it is the village's shared register. It holds the Ortsrat's notices, every club's dates, the residents' contact directory, the village photo archive and the historical record together, under one editorial team, with per-club publishing rights. A neighbouring village cannot copy this without its own institutions.

## Operating Context

- German language, German date and address conventions, Europe/Berlin time.
- Low traffic, bursty: a meeting notice or a cancelled event brings a spike.
- Content is edited by volunteers in short sessions; some of it arrives as a photo of a printed notice.
- Events can be cancelled at short notice and must read as cancelled everywhere.
- Photos arrive from residents (uploads, phone cameras) and must be moderated before they appear.
- The site is a PWA; residents can install it and receive push notifications for admin tasks.
- Existing data lives in PostgreSQL, photos in S3-compatible object storage (MinIO), mail over SMTP.

## Capabilities and Constraints

Confirmed by the running product and its data:

- Public: home, events with calendar and agenda plus cancellation, news list and article, photo gallery with resident submissions and a follow-up "extend collection" flow, portraits of villagers, contact directory with search and filter, contact form, clubs (14, with several bespoke pages), Ortsrat, village map, weather, history, archive, living and building pages, legal pages, 404, PWA install, WhatsApp channel link, push subscription.
- Admin: session login with forced password change, dashboard, events CRUD with cancellation, news CRUD with pinning and ordering, gallery upload, portrait moderation, contacts CRUD, organisations, users with roles and a 40-key permission catalogue, settings, audit log, shared-gallery moderation and reports, archive, village content layouts.
- Integrations: PostgreSQL, MinIO (three buckets), SMTP, web push (VAPID), OpenStreetMap tiles and Overpass, an external weather station scrape.
- Constraints: existing data must be preserved; external URLs already published must keep working; the site must run on the current deployment target; no invented metrics, testimonials or prices.
- Open: the current data model stores consent flags that the submit endpoint drops; rating and rate limiting do not exist. The redesign must not claim they do.

## Brand Commitments

- Name: Wendessen (wendessen.de). German only.
- The village coat of arms (Wappen) is an existing asset and stays the identity mark.
- Voice: plain, friendly, local, unhurried. No marketing superlatives.
- Real content only: real clubs, real people, real dates.

## Evidence on Hand

- Live PostgreSQL data: 60 events, 5 news articles, 38 contacts, 25 gallery images, 11 shared-gallery submissions, 14 organisations, 14 admin users, 5 roles, 40 permissions, 4 archive entries, 11 site settings, 1 portrait.
- Real imagery in `public/images/` (Wappen, village photos, club photos, Ortsrat portraits).
- Club facts and schedules in `lib/constants/` (clubs, members, training times).
- Absent and must not be fabricated: visitor numbers, testimonials, press mentions, prices, awards.

## Product Principles

1. **The notice board, not the brochure.** The first screen answers "what is on, and what changed" before it describes the village.
2. **One village, one register.** Every date, club and person resolves to a canonical entry; no duplicate silos per club.
3. **Cancelled is a state, not a deletion.** A cancelled date stays visible and unmistakable.
4. **Publish from a phone in under two minutes.** The admin flow is a tool for volunteers, not a CMS demo.
5. **Readable at arm's length.** Large type, high contrast, plain German, no hover-only information.

## Accessibility & Inclusion

Target WCAG 2.2 AA. Large default type, strong contrast, visible focus, full keyboard operation, reduced-motion support, no colour-only status, German screen-reader labels. Older residents and phone use in daylight are the design case.
