# Public Surface Inventory — Wendessen.de (Next.js App Router)

Scope: every route under `app/` except `app/admin/**` and `app/api/admin/**`. Read-only survey, 2026-11-13.
Legend: DB = PostgreSQL via `lib/sql` + `lib/database/*`; API = route handler; const = static TS constant.

## 1. Route table

| Route | Purpose | Data source | Controls | States | Notes |
|---|---|---|---|---|---|
| `/` | Home: banner, 4 news cards, hero claim, 3 upcoming events, 3 "Das ist Wendessen" cards, Vereine carousel | `getRecentNews(4)` (news, pinned≤3 + latest); `getUpcomingEvents(3)`; `wendessen_layouts WHERE is_active` (raw SQL); `ASSOCIATIONS` const; `public/images/banner.jpg` (DOM-injected) | News card links; event card links (`/was-steht-an?event=`); FeatureCard CTAs (DB hrefs); Swiper autoplay/nav/pagination | News DB error → silent empty grid; events error → red "Veranstaltungen konnten nicht geladen werden"; layout error → hardcoded fallback cards; no loading/empty copy for news | `HomeBanner` injects `<img>` into `document.body` with `order:-1` above sticky header (hydration/DOM risk); fallback CTAs point to dead routes `/karte`, `/lesefutter`, `/hospiz` |
| `/neuigkeiten/[id]` | News article detail | raw SQL `news WHERE article_id`; Slate JSON body via `ArticleRenderer`; `generateMetadata` | Back link `/`; click image → fullscreen zoom lightbox (wheel 0.5–8×, drag, ESC, backdrop) | `notFound()` if no row; content empty/`null` → "Dieser Artikel hat noch keinen Inhalt."; JSON parse error → "Fehler beim Laden des Artikels." | No share, no related, no breadcrumbs, no comments |
| `/was-steht-an` | Events calendar + list | SSR `getEvents()` (all); `CalendarClientNoSSR` (dynamic, `ssr:false`); refresh `GET /api/events`; `ASSOCIATIONS`, `lib/utils/event-utils` | Calendar views agenda(default)/month/week/day, nav prev/next/today; search (title/description/location/organizer); Vereins filter; category filter; manual refresh button; event click → detail modal; deep link `?event=<id>` (500 ms delay + overlay) | SSR error → Next error page; `isAutoSelecting` overlay "Veranstaltung wird geladen..."; empty "Keine Termine gefunden"; cancelled events grey + strikethrough + 🚫 + modal red banner + `cancelledAt`; modal close X/backdrop | Refresh calls `/api/events` without `?fresh=1` → serves cached `getEvents()`; no ICS/share/add-to-calendar; `EventModal` (create) not reachable publicly |
| `/impressionen` | Public photo gallery by submission group | `getApprovedSharedGalleryGroups()`; MinIO image URLs | CTA "Foto einreichen"; per-group "Ergänzen" (AddPhotosModal); author "+N mehr" popup; image click → lightbox: download, "Melden" (reason textarea → POST `/api/shared-gallery/report`), close | DB error → treated as empty ("Noch keine Fotos"); report success panel (2 s) / error `alert()`; add-photos error banner; submit triggers `window.location.reload()` | No pagination/lazy route segments; group title used as image alt fallback |
| `/impressionen/einreichen` | New photo collection (multi-step explainer + one long form) | none (client); POST `/api/shared-gallery/submit` per photo | Title (max 255), optional collection date, optional date-range checkbox + end date (min=start), multi-file picker (`image/*`, ≤10 MB each, client validation), per-photo description, name (required), email (optional), mandatory consent → `/datenschutz`, optional social-media consent → `/datenschutz#social-risks`, submit/cancel | Error banner (dismissible, per validation rule), loading spinner "Wird eingereicht...", success screen with "Weitere Fotos einreichen" / "Zur Galerie" | Client generates `sub_<ts>_<rand>` group id; sends base64 data URL; `socialConsent`/`dateTakenRangeEnd` are sent but **not persisted** by API; sequential uploads, no per-file progress/retry |
| `/impressionen/einreichen/erweitern` | Add photos to an existing collection | `GET /api/shared-gallery/my-groups` (no email param) | Group select, date/range inputs, multi-file picker, per-photo description, submit, back arrow, cancel | Loading spinner, error banner, "Keine Einreichungen gefunden" + CTA, success screen | **Returns every group incl. pending + submitter names** (no auth/email scoping); submitter name inherited from selected group |
| `/dorfleben/wir-wendesser` | "Wir Wendesser" portraits | intro static; `GET /api/portraits/approved`; POST `/api/portraits` via modal | Portrait card → detail modal; "Portrait einreichen" modal: image ≤5 MB, name, story (≥50 chars), email optional, consent → `/datenschutz`, submit/cancel | Loading spinner "Lade Portraits..."; empty "Die ersten Portraits befinden sich in Vorbereitung."; submit `alert()` success/error; button disabled until valid | `alert()`-based feedback; legal note "kein Rechtsanspruch auf Veröffentlichung" |
| `/dorfleben/ortsrat/mitglieder` | Ortsrat member cards | `ORTSRAT_MEMBERS` const (7) | Card → `/kontakt/[slug]` when `contactSlug` (6 of 7) | static; Julian Stache has no slug (no link) | Party gradient badges from `PARTY_GRADIENTS` |
| `/dorfleben/ortsrat/bericht` | Mayor's 2026 report (long prose) | static + `/images/Ortsrat/andreas-rink.jpg` | Link "Zurück zu Dorfleben" (`/dorfleben` → 404); link `/kontakt/andreas-rink` | static | Text says "Ortsbürgermeister bis 2026"; content/metadata mismatch with current mayor |
| `/dorfleben/vereine/feuerwehr` | Fire brigade chooser | static images | 2 full-bleed tiles → `einsatzabteilung`, `jugendfeuerwehr` | static | Pure split-screen router page |
| `/dorfleben/vereine/feuerwehr/einsatzabteilung` | Volunteer fire brigade detail | static; `OrganizationContacts("freiwillige-feuerwehr-wendessen")`; `/images/Vereinsleben/freiwillige-feuerwehr.jpg` | mailto/tel contact cards only | contact block hidden if no org/contacts (returns null) | Dienst "immer mittwochs 18:30", Treffpunkt Kirchring/Schustergasse |
| `/dorfleben/vereine/feuerwehr-portal` | Stub portal | none | 2 unbound radio buttons (no submit/handler) | static | Unlinked from nav; `style.css` is comment-only; no metadata |
| `/dorfleben/vereine/jugendfeuerwehr` | Youth fire brigade | static; `OrganizationContacts("jugendfeuerwehr-wendessen")` | External link `http://www.jf-wendessen.jimdo.com`; contact cards | contact block hidden if empty | Ages 10–16, "über 25 Jahre"; external site is http (not https) |
| `/dorfleben/vereine/idw` | IDW umbrella association | static; `OrganizationContacts("idw")` | contact cards | contact block hidden if empty | Bürger membership since 2025; Kinderfest/Laternenumzug |
| `/dorfleben/vereine/spritzenhaus` | Initiative Wendesser Spritzenhaus | static; `OrganizationContacts("initiative-wendesser-spritzenhaus-ev")` | contact cards | contact block hidden if empty | 1998 rescue, reopened summer 2000, 75 members, 12 €/18 € fees |
| `/dorfleben/vereine/kirchbauverein` | Kirchbauverein St. Georg | static; `OrganizationContacts("kirchbauverein-wendessen")` | External site `https://www.kirchbauverein-wendessen.de`; external PDF Beitragsformular; mailto; IBAN; contact cards | contact block hidden if empty | Founded Jan 2002, 96 members; fees 40 € couples / 24 € single / 12 € students |
| `/dorfleben/vereine/kleingaertner` | Kleingärtnerverein | static; `OrganizationContacts("kleingartnerverein-wendessen")` | contact cards | contact block hidden if empty | 58 gardens ≈500 m², water+power, garden newspaper, accident insurance |
| `/dorfleben/vereine/schuetzenverein` | Schützenverein detail incl. training schedule | static; `OrganizationContacts("schutzenverein-wendessen-ev")` | contact cards | contact block hidden if empty | Facilities: 2× KK/SpoPi 50/25 m electronic, 2× Luftgewehr infrared; Schießabende Mi 18–21; Jugend So 10–13 (Laser 6–12 from 10:00, Luftgewehr 12–18 from ~11:00); Ostereier-/Königs-/Pokal-/Schweineschießen; Volkskönigspaar free membership. Unrouted `new_page.tsx` sits in folder |
| `/dorfleben/vereine/sv-wendessen` | SV Wendessen (sports club) | static; `OrganizationContacts("sv-wendessen")` | contact cards | contact block hidden if empty | Oberliga; Fußball, Gymnastik, Kinderturnen, Tischtennis, Tennis, Tanzsport; Weinrich-Arena, Vereinswirt, sponsor "Pool 99"; training times explicitly not published (phone/mail/SMS) |
| `/dorfleben/vereine/seniorenkreis` | Evang. Seniorenkreis | static; `OrganizationContacts("seniorenkreis-wendessen")` | contact cards | contact block hidden if empty | "Alte Schule", 1st Tuesday monthly, min. age 60, free |
| `/dorfleben/vereine/frauenhilfe` | Evang. Frauenhilfe | static; `OrganizationContacts("frauenhilfe-wendessen")` | contact cards | contact block hidden if empty | 23 members, 20 €/yr, Hans-Meves-Hof Dorfstr. 19, 3rd Wednesday 15:00, sponsor child in India |
| `/dorfleben/vereine/hospiz` | Hospizverein Wolfenbüttel (association) | static; `OrganizationContacts("hospizverein-wolfenbuettel-ev")` | PDF `/pdfs/hospizverein-beitrittserklaerung.pdf` (new tab); IBAN; contact cards | contact block hidden if empty | Fees 40 € single / 60 € couples |
| `/dorfleben/institutionen/kirche` | Kirchengemeinde Ahlum-Atzum-Wendessen | static; hardcoded contacts | External `http://www.ahlum-atzum-wendessen-evangelisch.de`; tel/mail links; contact cards | static | Propst Dieter Schultz-Seitz; Kirchenbüro Christine Spilleke, hours Mo/Di/Do 10–12, fax; does not use DB contacts |
| `/dorfleben/institutionen/hospiz` | "Hospiz im Gutspark" history | static; timeline component; `OrganizationContacts("hospiz-institution-wendessen")`; `/images/hospiz.jpg` (ZoomableImage) | Image zoom modal; contact cards | contact block hidden if empty | Timeline 1660 → 2020 Erbbaurecht 90 yrs → opening 16.06.2024 |
| `/dorfleben/karte` | Interactive village map | OpenLayers + CARTO raster tiles + Overpass API (house numbers; parking/playground/amenity/tourism/shop POIs) | Pan/zoom (extent-constrained, minZoom 12.5, max 19), zoom label readout | Fetch failure → only `console.error`, empty overlays (no user-facing error/loading) | External calls on every visit (overpass-api.de, basemaps.cartocdn.com); no legend, popups, category toggles, or geolocation; unlabeled POIs logged to console table |
| `/dorfleben/wetter` | Weather station dashboard | client `GET /api/weather` every 5 min; server scrapes `wetterstation.ws` text report, charset fallback, `parseWeatherReport` | Refresh only via 5-min interval (no manual button) | Loading spinner "Wetterdaten werden geladen..."; error screen "Fehler beim Laden der Wetterdaten"; data view (temp avg/min/max, humidity, wind/gusts, pressure+trend, solar/UV, precipitation today/month/year, forecast) | Forecast HTML-escaped server-side then rendered as text → literal `&amp;` etc.; no timestamp/age indicator beyond `lastUpdate`; no retry |
| `/dorfleben/archiv` | Dorfarchiv: archived news + documents + 2023 report | `getArchiveItems()`; `getArchivedNews()` (`news OFFSET 4`); synthetic 2023 card | Search (Fuse.js fuzzy, threshold 0.3); type filter (alle/Nachrichten/Webseite/Dokumente); category filter; sort (newest/oldest/alphabetical); reset filters | Both empty → "Noch keine Archiveinträge"; no results → "Keine Ergebnisse gefunden" + reset; `getArchivedNews` throws → unhandled server error | No metadata export; hardcoded 2023 entry marked type "Webseite"; no pagination |
| `/dorfleben/archiv/[id]` | Archive document detail | `getArchiveItemById(id)` | Back links to `/dorfleben/archiv`; ArticleRenderer (Slate) or plain text | Missing item → inline "Eintrag nicht gefunden" card (HTTP 200, not `notFound()`); no metadata | "Archiviert am" footer; no print/share |
| `/dorfleben/archiv/ortsrat-bericht/2023` | Archived 2023 mayor's report | static + `/images/Ortsrat/andreas-rink.jpg` | Back to archive; `/kontakt/andreas-rink` | static | Linked only from synthetic archive card |
| `/geschichte` | Village history long-read | static; `ZoomableImage` (`/images/850-jahre-geschichte.jpg`, `/images/wappen.png`) | Image zoom modals | static | Name evolution 1170 Winedissen → 1350 Wendessen; timeline; no anchors/TOC |
| `/wohnen-bauen/neubaugebiet` | Leipziger Allee development | static; ZoomableImages (`bebauungsvorschlag-*`, `baugebiet-*-mai-2024`, `bebauungsplan-pb-4-*`) | Image zoom modals; tel/mail to investor (MGM, Stephan Malonnek) | static | Facts: 29,000 m², ~30 houses + ~35 flats, "Zuckerring", Regio-Bahn 2028/29, P+R/B+R; nav sublinks `/uebersicht`, `/fortschritt` are dead |
| `/wohnen-bauen/feuerwehrgeraetehaus` | New fire station project | static; ZoomableImages (`feuerwehrhaus-*-eingangsansicht`, `lageplan-*`) | Image zoom modals | static | Status/cost/planning cards; nav sublinks `/planung`, `/fortschritt` dead |
| `/kontakt/verzeichnis` | Contact directory | `getContacts()` (contacts + affiliations + importance) | Full-text search (name/email/phone/org/role), organisation dropdown, sort key (Vorname/Name/Organisation/Rolle), asc/desc toggle, `/` keyboard focus shortcut, card → modal (all affiliations, mails, phones, addresses) | Empty result state + "Filter zurücksetzen"; no loading state (SSR) | Default sort "Rolle" is a hidden `importance` ranking; footer link `/kontakt/christina-balder`; no pagination/vCard export |
| `/kontakt/formular` | Contact form to Ortsrat | POST `/api/contact` → nodemailer/SMTP | Required: Vorname, Nachname, E-Mail, Betreff (select, 10 values), Nachricht, Datenschutz checkbox; optional Telefon, Adresse; submit | Loading label "Wird gesendet..."; inline red error text from API; success `SuccessPopup` (dismiss) | **No captcha, honeypot or rate limit**; tel/mail/address hardcoded in page; "Antwortzeit 2–3 Werktage" |
| `/kontakt/[slug]` | Individual Ortsrat contact page (6 slugs: christina-balder, reiner-asche, marc-both, femmke-brandl, klaus-martin-jungkurth, andreas-rink) | `getMemberBySlug` const; `generateStaticParams`; `generateMetadata` | mailto, tel links | `notFound()` if slug unknown or `contactInfo` missing | Publishes private mobile numbers and personal emails; age computed as `2025 - birthYear` (hardcoded year) |
| `/kontakt/redaktionsteam` | Editorial team | `REDAKTIONSTEAM_KERNTEAM` (3) + `REDAKTIONSTEAM_BEREICHSVERANTWORTLICHE` const | none | static; `N.N.` rendered as dashed placeholder card | No metadata export |
| `/kontakt/whatsapp` | WhatsApp channel promo | static; `/svgs/whatsapp-qrcode.svg` | External channel link `https://whatsapp.com/channel/0029VaFPwF496H4KMB87my1z`; links to `/kontakt/formular`, `/kontakt/verzeichnis` | static | QR + benefits; no deeplink fallback for desktop |
| `/kontakt/impressum` | Imprint (short, separate text) | static | tel/mail/web links; link to `/kontakt/datenschutz` | static | "Stand: August 2025"; hardcoded Christina Balder data |
| `/kontakt/datenschutz` | Privacy (short, separate text) | static | External `https://www.datenschutz.de`; tel/mail | static | Older text, contradicts `/impressum` version |
| `/impressum` | Combined imprint + privacy + disclaimer + image rights (long) | static | mailto `datenschutz@wendessen.de`, `info@wendessen.de`; external `https://www.lfd.niedersachsen.de` | static | Contains placeholders `[Vollständige Adresse]`, `[PLZ Ort]`, `[Telefonnummer]`; states "Server-Logs deaktiviert" (contradicted elsewhere) |
| `/datenschutz` | Duplicate of `/impressum` (same `LegalContent` copy) | static | same as above | static | Two full copies of the same 600-line legal component (`/impressum`, `/datenschutz`) plus `/kontakt/*` variants → 4 divergent legal pages |
| `not-found` (any unmatched) | 404 "Seite im Aufbau" | static | "Zur Startseite" `/`; `BackButton` (`history.back()`); tiles → `/dorfleben`, `/wir-wendesser`, `/kontakt` | static | **All three tile targets 404** (no such routes); metadata title "Seite nicht gefunden" |

### Linked but non-existent routes (all render 404)
`/dorfleben`, `/neuigkeiten`, `/kontakt`, `/wohnen-bauen`, `/dorfleben/vereine`, `/dorfleben/ortsrat`, `/dorfleben/institutionen`, `/wohnen-bauen/neubaugebiet/uebersicht`, `/wohnen-bauen/neubaugebiet/fortschritt`, `/wohnen-bauen/feuerwehrgeraetehaus/planung`, `/wohnen-bauen/feuerwehrgeraetehaus/fortschritt`, `/karte`, `/lesefutter`, `/hospiz`, `/wir-wendesser` (`/wir-wendesser` typo variant also referenced by 404 tile).

## 2. Navigation

| Surface | Contents | Behaviour | Notes |
|---|---|---|---|
| Root layout (`app/layout.tsx`) | `<html lang="de">`, Inter via `next/font/google`, `AdminAuthProvider` in Suspense (`Laden...` fallback), sticky header (z-70), `main`, `Footer` | Server component; header always visible | No skip link, no breadcrumbs, no active-route highlighting |
| Header left | Wappen `/images/wappen.png` → `/` (48/40 px, priority) | Link | Image is also SW notification icon |
| Desktop menubar (`menubar.tsx`) | HOME; DORFLEBEN (3-level Radix menu); WOHNEN & BAUEN; WAS STEHT AN?; GESCHICHTE; IMPRESSIONEN; KONTAKT; ADMIN (only if `useAdminAuth().isAuthenticated`) | Radix Menubar, hover/click submenus, max-h 70vh scroll; `hidden lg:flex` | Items come from `lib/constants/navigation.ts` (`MAIN_NAV`); ADMIN entry only for logged-in admins; WOHNEN subitems ignored (renders only top-level hrefs) |
| Mobile header | "Willkommen in Wendessen" text | static | Replaces menubar below `lg` |
| Mobile navbar (`mobile-navbar.tsx`) | Drawer 288 px right; HOME; DORFLEBEN full tree (unlimited depth); WOHNEN & BAUEN (depth 1); WAS STEHT AN?; GESCHICHTE; IMPRESSIONEN; KONTAKT (depth 1); ADMIN DASHBOARD if authenticated | Toggle button (List/X), backdrop click closes, body scroll lock, closes on any link | No focus trap / `aria-expanded` / ESC handling |
| Footer | `copyright_text` (default "© 2025 Ennio Marke/Ortsrat Wendessen"), optional WhatsApp channel button (`whatsapp_channel_url` + `whatsapp_channel_enabled === 'true'`), links Impressum `/kontakt/impressum`, Datenschutz `/kontakt/datenschutz`, Kontakt `/kontakt/christina-balder`, `InstallPWA` | Async server component reading `site_settings`; external link opens new tab | No public push-notification toggle (admin-only); no social links despite `facebook_url`/`instagram_url` settings; no newsletter |
| PWA install (`InstallPWA.tsx`) | "App installieren" button; iOS instructions popover | `beforeinstallprompt` capture; iOS UA detection + Share/Add-to-Home-Screen instructions; hidden when standalone; **registers `/sw.js` on every page** | Also the only SW registration for public visitors |

## 3. Shared public components

| Component | Used by | Function |
|---|---|---|
| `layout/PageHeader.tsx` | ~20 public pages | Coloured hero with icon, optional background image, pattern overlay |
| `layout/BackgroundElements.tsx` | home, archiv, archiv/[id] | Decorative background |
| `FeatureCard.tsx` | home cards, Vereine carousel | Image/text hero card, CTA `<a>` (plain anchor, full reload) |
| `VereineCarousel.tsx` | `FullWidthServicesSection` | Swiper (autoplay 3 s, pause on hover, loop, 3× duplicated slides, custom arrows + bullets) |
| `news/NewsCard.tsx` | home | Category colour bar/dot, date, pin icon, "Artikel lesen" |
| `news/ArticleRenderer.tsx` | news detail, archive detail | Slate JSON → HTML; image sizes small/medium/large/full, float/alignment, zoom lightbox |
| `GalleryGrid.tsx` | `/impressionen` | Group headers, "Ergänzen", author popup, staggered grid, lightbox |
| `ImageLightbox.tsx` | gallery | Download (`<a download>`), report modal (POST), metadata (submitted/taken/location), close |
| `AddPhotosModal.tsx` | gallery groups | Append photos (multi-file, EXIF date/GPS via `exifr`, per-photo description, name/email) |
| `ZoomableImage.tsx` | geschichte, hospiz, wohnen-bauen | Click-to-zoom modal (0.5–8×, wheel, drag, ESC) |
| `ui/Modal.tsx` | many | Portal modal, backdrop, scroll lock, maxWidth/rounded variants |
| `ui/SuccessPopup.tsx` | contact form | Success dialog with close |
| `ui/LoadingSpinner.tsx` | calendar, forms, weather | Spinner with text |
| `ui/CroppedImage.tsx` | event cards, calendar | Renders image with `imageCropData` per view id (`home-card`, `card`, `popup`) |
| `ui/BackButton.tsx` | 404 | `history.back()` |
| `ContactCard.tsx` + `OrganizationContacts.tsx` | all Vereine/Institutionen pages | Server-side org contacts (DB, importance order), mailto/tel |
| `OrtsratMemberCard.tsx` | ortsrat/mitglieder | Photo card, party badge, links to contact page |
| `ContactPersonCard.tsx` | `/kontakt/[slug]` | Personal hero, photo, age, address/mail/mobile cards |
| `HomeBanner.tsx` | home | Injects banner `<img>` into `document.body` (order -1) |
| Unused/dead | — | `ContactCardFetcher`, `ContentImage`, `OptimizedImage`, `ErrorNotification`, `PromptDialog`, `PlaygroundsSection`, `LazySharedGalleryImage`/`SharedGalleryImageContext` (admin-only), `EnhancedRichTextEditor`/`RichTextEditor` (admin), `EventModal`, `NewsModal`, `PushNotificationToggle`, `NotificationBell`, `NotificationTester`, `PermissionsModal`, `ImageCropper` (admin) |

## 4. Metadata / SEO / PWA

| Item | State |
|---|---|
| Root metadata | `title` "Wendessen.de - Unser Dorf im Netz", description, icons (favicon-96x96.png, favicon.svg, favicon.ico, apple-touch-icon.png), `manifest: /site.webmanifest`, `appleWebApp.title` |
| Per-page metadata | present on 34 of 41 public pages; **missing** on `/`, `/was-steht-an`, `/dorfleben/wetter`, `/dorfleben/archiv`, `/dorfleben/archiv/[id]`, `/dorfleben/vereine/feuerwehr-portal`, `/kontakt/redaktionsteam` |
| Dynamic metadata | `/neuigkeiten/[id]` and `/kontakt/[slug]` via `generateMetadata` |
| JSON-LD / schema.org | none anywhere |
| OpenGraph / Twitter cards / canonical / alternates / `metadataBase` | none |
| `sitemap.xml` / `robots.txt` | **none** (`app/sitemap.ts`, `app/robots.ts`, `public/robots.txt`, `public/sitemap.xml` all absent) although `next.config.ts` defines cache headers for them |
| Manifest | `/site.webmanifest` and `/manifest.json` (identical): name/short_name "Wendessen", maskable 192/512 icons, theme/background `#ffffff`, standalone, start_url `/`, scope `/` |
| Service worker | `public/sw.js`: install/activate/skipWaiting/clients.claim, network-only fetch handler, `push` + `notificationclick` (default URL `/admin/dashboard`, actions Öffnen/Schließen, `requireInteraction`), `notificationclose`; registered by `InstallPWA` on all pages |
| Security/cache headers (`next.config.ts`) | `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`; immutable 1-year caching for `/images`, `/svgs`, `/pdfs`, `_next/static`, `_next/image`, fonts, root files; no-cache for `/manifest.json`, `/sw.js` (+ CSP `default-src 'self'; script-src 'self'` on sw.js) |
| Images remote | Only MinIO host from env (`images.remotePatterns`), `minimumCacheTTL` 1 year |
| Fonts | `next/font/google` Inter (self-hosted at build; no runtime Google request) |
| Cookies/consent | Only `admin-session` cookie; no consent banner, no analytics, no tag manager, no third-party scripts injected |

## 5. Integrations & third-party endpoints (runtime)

| Integration | Used by | Direction |
|---|---|---|
| PostgreSQL (`lib/sql`, `lib/database/*`) | nearly all public pages | server |
| MinIO / S3 (`lib/utils/blob-utils*`, buckets `impressions`, `portraits`) | gallery, portraits, admin | server (images served from MinIO host) |
| SMTP / nodemailer | `/api/contact` | server, env `SMTP_*`, `CONTACT_TO_EMAIL` |
| Web Push / VAPID (`lib/push-notifications`) | new gallery/portrait submissions notify admins | server → browser push services (Google/Mozilla/Apple) |
| `https://overpass-api.de/api/interpreter` | map (2 POST queries per load) | browser |
| `https://{a-d}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/...` | map tiles | browser |
| `https://www.wetterstation.ws/.../ws_report.txt` | weather (server scrape, no-store) | server |
| `https://whatsapp.com/channel/0029VaFPwF496H4KMB87my1z` | whatsapp page + footer button | browser |
| `http://www.jf-wendessen.jimdo.com` | Jugendfeuerwehr | browser (http) |
| `https://www.kirchbauverein-wendessen.de` + its PDF | Kirchbauverein | browser |
| `http://www.ahlum-atzum-wendessen-evangelisch.de` | Kirche | browser |
| `https://www.lfd.niedersachsen.de`, `https://www.datenschutz.de` | legal pages | browser |
| Client libs | Swiper, react-big-calendar + moment (de), OpenLayers, `exifr`, `fuse.js`, Slate, Radix Menubar, Phosphor icons | browser bundles |
| Analytics / tracking | none | — |

## 6. Public API endpoints (non-admin)

| Endpoint | Method | Auth | Notes |
|---|---|---|---|
| `/api/events` | GET | public | All events; `?fresh=1` bypasses cache; returns `cancelledBy`, `vereinId` |
| `/api/events/[id]` | GET | public | Single event |
| `/api/events/[id]/cancel` | POST/DELETE | admin/permission | Cancellation + un-cancel |
| `/api/weather` | GET | public | Server scrape + parse, 5-min cache, HTML-escaped forecast |
| `/api/settings` | GET | public | Returns **all** `site_settings` rows (footer, contact, social, SEO keys) |
| `/api/portraits/approved` | GET | public | Approved portraits minus email |
| `/api/portraits` | POST | public | Multipart upload, WebP conversion, min description length, 5 MB cap, push notify |
| `/api/contact` | POST | public | FormData or JSON → SMTP; no rate limiting |
| `/api/shared-gallery/submit` | POST | public | JSON base64 image, WebP convert, MinIO, push notify; socialConsent ignored |
| `/api/shared-gallery/report` | POST | public | Free-text report, no auth, no rate limit |
| `/api/shared-gallery/my-groups` | GET | **none** | Without `email` returns all groups incl. pending and submitter names |
| `/api/archive`, `/api/archive/[id]` | GET | public (writes permission-gated) | Archive items |

## 7. Assets from `/public` used by public pages

- Icons/PWA: `favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`, `site.webmanifest`, `manifest.json`, `sw.js`
- Branding/hero: `images/wappen.png`, `images/banner.jpg` (+ unused `banner.png`), `images/wendessen-luftaufnahme.jpg`
- Home cards: `images/Features/hospiz.jpeg` (fallback), unused `images/Features/spielplatz.jpg`
- Ortsrat: `images/Ortsrat/{christina-balder.jpg,reiner-asche.jpg,marc-both.jpg,femmke-brandl.jpeg,klaus-martin-jungkurth.jpg,andreas-rink.jpg,julian-stache.png,renate-hubner.jpg (unused)}`
- Vereine: `images/Vereinsleben/{freiwillige-feuerwehr.jpg,jugendfeuerwehr.jpeg,frauenhilfe.jpg,kirche.webp,kirchbauverein.webp,kleingarten.jpeg,schuetzenverein.jpg,seniorenkreis.jpg,spritzenhaus.webp,sv-wendessen.jpg}`
- Projects/history: `images/850-jahre-geschichte.jpg`, `images/hospiz.jpg`, `images/feuerwehrhaus-wendessen-eingangsansicht.jpg`, `images/lageplan-feuerwehrgeraetehaus.jpg`, `images/bebauungsvorschlag-leiziger-allee.jpg`, `images/baugebiet-leiziger-allee-wendessen-mai-2024.jpg`, `images/bebauungsplan-pb-4-leipziger-allee.webp`, unused `images/hospiz-bau.webp`
- Docs/other: `svgs/whatsapp-qrcode.svg`, `pdfs/hospizverein-beitrittserklaerung.pdf`
- Unused Next.js starter assets: `next.svg`, `file.svg`, `globe.svg`, `window.svg`
