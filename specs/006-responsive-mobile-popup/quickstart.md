# Quickstart: 006-responsive-mobile-popup

**Branch**: `006-responsive-mobile-popup`  
**Date**: 2025-02-14

## Prerequisites

- Node.js 18+
- npm or pnpm

## Setup

```bash
cd /path/to/manna
git checkout 006-responsive-mobile-popup
npm install
npm install qrcode.react   # New dependency for QR code
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000/zh-Hans](http://localhost:3000/zh-Hans) (default locale).

## Verification Checklist

1. **Responsive layout**: Resize viewport 320px → 1920px; no horizontal scroll.
2. **Mobile overlay**: At ≤768px, open "About {property}" / Policies; overlay is full-screen.
3. **Touch targets**: Buttons and links ≥44×44px on mobile.
4. **QR code**: Small QR visible (header/footer); scans to site URL.
5. **FAQ merge**: FAQ appears in House Rules section; not in footer modals.
6. **Get in Touch icons**: MapPin, Phone, Mail icons visible.
7. **Scroll animation**: Sections animate on scroll (fade-up); respect reduced motion.
8. **i18n**: Default locale zh-Hans; titles translated per locale.

## Key Files

| File | Purpose |
|------|---------|
| `components/ui/dialog.tsx` | Full-screen className on mobile |
| `components/qr-code-badge.tsx` | QR code component |
| `components/home-sections-vanhomestay.tsx` | FAQ merge, icons, scroll |
| `components/footer-client.tsx` | Remove FAQ modal |
| `lib/content.ts` | Exclude FAQ from modalLinks |
| `lib/seo.ts` | Title per locale |

## Environment

- `NEXT_PUBLIC_SITE_URL`: Optional; used for QR `value` (default: Vercel URL or localhost).
- No backend or DB required.
