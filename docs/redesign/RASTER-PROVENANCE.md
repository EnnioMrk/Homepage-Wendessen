# Raster provenance

Every raster the application ships, with its origin. No image in this redesign
was generated, composited or retouched; the world is carried by type, rules and
the village's own photographs.

## Shipped from the repository (`public/`)

| Asset | Origin | Notes |
|---|---|---|
| `images/wappen.png` | Existing repository asset | The village coat of arms; identity mark in the spine and colophon |
| `images/wendessen-luftaufnahme.jpg` | Existing repository asset | Aerial photograph of the village, used on home and history |
| `images/850-jahre-geschichte.jpg` | Existing repository asset | Photograph of the 850-year memorial stone |
| `images/hospiz.jpg`, `images/hospiz-bau.webp` | Existing repository assets | Hospice and its construction |
| `images/baugebiet-leiziger-allee-mai-2024.jpg`, `images/bebauungsplan-pb-4-leipziger-allee.webp`, `images/bebauungsvorschlag-leiziger-allee.jpg` | Existing repository assets | Building-area documentation, published by the project |
| `images/feuerwehrhaus-wendessen-eingangsansicht.jpg`, `images/lageplan-feuerwehrgeraetehaus.jpg` | Existing repository assets | Fire station planning documents |
| `images/Vereinsleben/*` | Existing repository assets | Club photographs supplied by the clubs |
| `images/Ortsrat/*` | Existing repository assets | Portraits of the Ortsrat members (one placeholder for a member without a photo) |
| `favicon.svg`, `favicon.ico`, `favicon-96x96.png`, `apple-touch-icon.png`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png` | Existing repository assets | PWA identity |
| `svgs/whatsapp-qrcode.svg` | Existing repository asset | QR code for the village WhatsApp channel |

## Added by this run

| Asset | Origin | Licence |
|---|---|---|
| `fonts/archivo-latin.woff2`, `fonts/archivo-latin-ext.woff2` | Archivo variable font, fetched from Google Fonts and self-hosted | SIL Open Font License 1.1 |
| `fonts/literata-latin.woff2`, `fonts/literata-latin-ext.woff2` | Literata variable font, fetched from Google Fonts and self-hosted | SIL Open Font License 1.1 |

No stock photography was downloaded. No image was generated with a model. No
photograph was cropped into a design asset; the interface crops with CSS only.

## Images served from object storage

Photographs in the gallery, the shared gallery and the portraits are uploaded
by residents and editors into the three MinIO buckets (`admin-gallery`,
`impressions`, `portraits`). They are content, not design assets: the code
requests signed URLs at runtime and never copies them into the repository.

## Retired

`images/banner.jpg` and `images/banner.png` (the illustrated village banner of
the previous design) are no longer referenced by any route. They are kept in the
repository as source material; deleting them is a content decision, not a code
change.
