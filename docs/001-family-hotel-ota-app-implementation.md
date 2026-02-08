# Implementation Summary: 001-family-hotel-ota-app

**Branch**: `001-family-hotel-ota-app`  
**Feature**: Family Hotel Web Presence for OTA Cooperation (Surrey, Vancouver BC, Canada)

## Overview

Static-first marketing site for a family hotel. Presents property identity, description, amenities, photos, and policies; offers a visible language selector (English, French, 简体, 繁體); and provides link-only paths to book (Airbnb, Booking.com, VRBO) or contact (mailto/external URL). Content is file-based (edit JSON + redeploy); no admin area or login. Includes a Google Map for the property address, SVG logo and favicon, and image assets under `public/images/`.

## Stack

- **Next.js 15** (App Router), **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**
- **i18n**: Custom locale config (`lib/i18n.ts`) + middleware; locales: `en`, `fr`, `zh-Hans`, `zh-Hant`
- **Content**: JSON in `content/` per locale (`property.[locale].json`, `booking-channels.[locale].json`); loaded via `lib/content.ts`
- **Environment**: App-root `.env` (e.g. `NEXT_PUBLIC_GOOGLE_API_KEY` for Google Maps Embed)

## Delivered

- **Setup**: Next.js app structure, Tailwind v4, shadcn (DropdownMenu, Button), locale config
- **Foundational**: Types (`lib/types.ts`), content loaders, `app/[locale]` routing, root + locale layouts, header with language selector, sample content for all 4 locales
- **US1 (MVP)**: Home page with property name, location (with full address), type, booking/contact links; responsive layout
- **US2**: Property page (description, amenities, photos via `next/image`, policies); dedicated policies page
- **US3**: Per-locale metadata, hero with purpose + CTA, location block on home
- **Polish**: SSG for all locale routes, semantic HTML/aria, four-locale content files
- **Branding**: SVG logo (`public/logo.svg`) in header, favicon (`app/icon.svg`)
- **Assets**: Property images in `public/images/` (e.g. `image_001.jpg` … `image_078.jpg`); `public/placeholder.svg` and `lib/constants.ts` (`PLACEHOLDER_IMAGE`) for placeholder use
- **Google Map**: Embedded map on home and property pages using `NEXT_PUBLIC_GOOGLE_API_KEY`; address **16727 108 Avenue, Surrey BC V4N 1N5** via `location.addressLine` in property content

## Key paths

- `app/[locale]/page.tsx` — Home (location, map, booking links)
- `app/[locale]/property/page.tsx` — Property detail + map
- `app/[locale]/policies/page.tsx` — Policies
- `app/icon.svg` — Favicon
- `components/header.tsx` — Header with logo, nav (Property, Policies), language selector
- `components/booking-links.tsx` — OTA + contact links
- `components/property-detail.tsx` — Property description, amenities, photos
- `components/google-map.tsx` — Google Maps embed (uses `.env` API key, address from content)
- `lib/content.ts` — `getProperty(locale)`, `getBookingChannels(locale)`
- `lib/constants.ts` — `PLACEHOLDER_IMAGE` for fallback images
- `content/*.json` — Property and booking-channel content per locale; `location.addressLine` for map/full address
- `public/logo.svg` — Site logo
- `public/placeholder.svg` — Placeholder image when needed
- `public/images/` — Property photos (e.g. `image_001.jpg`)

## Environment

- **`.env`** (app root): `NEXT_PUBLIC_GOOGLE_API_KEY` for Google Maps Embed API. Optional; if missing, map shows “Map unavailable (missing API key)”.

## Tasks

All 25 tasks (T001–T025) completed. See `specs/001-family-hotel-ota-app/tasks.md`.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000` (redirects to `/en`). Use header to switch language and open Property / Policies. Map shows **16727 108 Avenue, Surrey BC V4N 1N5** when `addressLine` is set in property content.
