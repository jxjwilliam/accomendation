# Quickstart: Family Hotel OTA Web App

**Feature**: 001-family-hotel-ota-app

## Prerequisites

- Node.js 20+ (LTS)
- npm or pnpm or yarn

## 1. Install dependencies

From repository root (after Next.js app is scaffolded):

```bash
npm install
# or: pnpm install / yarn install
```

## 2. Add content files

Create or edit file-based content so the app can load property and booking channels:

- **Property**: e.g. `content/property.en.json` (and `.fr.json`, `.zh-Hans.json`, `.zh-Hant.json`) or a single `content/property.json` keyed by locale. See [data-model.md](../data-model.md) and [contracts/content-schema.json](./contracts/content-schema.json).
- **Booking channels**: e.g. `content/booking-channels.en.json` (and other locales) with at least one channel (Airbnb, Booking.com, VRBO, or contact link).
- **Images**: Place photos under `public/images/` and reference them in property content (e.g. `images/photo1.jpg`).

Example minimal `content/property.en.json`:

```json
{
  "property": {
    "name": "Example Family Hotel",
    "location": { "city": "Surrey", "region": "Vancouver BC", "country": "Canada" },
    "typeOfAccommodation": "Family hotel",
    "description": "A welcoming family hotel in Surrey, BC.",
    "amenities": ["Wi-Fi", "Parking", "Kitchen"],
    "photos": ["/images/photo1.jpg"]
  }
}
```

Example `content/booking-channels.en.json`:

```json
{
  "channels": [
    { "type": "airbnb", "label": "Book on Airbnb", "url": "https://airbnb.com/...", "openInNewTab": true },
    { "type": "contact", "label": "Contact us", "url": "mailto:hello@example.com" }
  ]
}
```

## 3. Run development server

```bash
npm run dev
# or: pnpm dev / yarn dev
```

Open [http://localhost:3000](http://localhost:3000). Use the language selector (header) to switch between English, French, Chinese Simplified, and Chinese Traditional.

## 4. Build for production

```bash
npm run build
npm run start
# or: pnpm build && pnpm start
```

Static pages are generated for each locale (SSG).

## 5. Deploy

- **Vercel**: Connect the repo; build command `npm run build` (or equivalent); output uses Next.js default.
- **Static export**: If the app is configured for `output: 'export'`, run `npm run build` and deploy the `out/` directory to any static host.

## 6. Updating content (owner/maintainer)

No admin UI. To change property text, photos, or OTA links:

1. Edit the relevant JSON (or MDX) files under `content/`.
2. Commit and push, or trigger a redeploy so the host rebuilds the site.

Images: add or replace files in `public/images/` and update paths in property content.

## References

- [spec.md](../spec.md) — feature requirements and clarifications
- [plan.md](../plan.md) — technical context and project structure
- [data-model.md](../data-model.md) — content entity shapes
- [contracts/](./contracts/) — content JSON schema
