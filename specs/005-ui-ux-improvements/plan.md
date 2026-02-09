# Implementation Plan: UI/UX Improvements

**Branch**: `005-ui-ux-improvements` | **Date**: 2025-02-08 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification + user implementation requests (layout, logo, theme dropdown, i18n, gallery cards, home sections).

## Summary

Improve UI/UX across the family hotel site: center main content horizontally on all pages, fix header logo display, enhance theme switcher with per-theme preview and primary-colored labels, ensure all UI strings respect the active locale, improve gallery page card presentation (reference: cloudflare-images style), and add home-page sections (Why choose us, Amenities, Property details, House Rules) aligned with the [Vancouver Home-stay reference](https://vanhomestay-cx93bwlb.manus.space/).

## Technical Context

**Language/Version**: TypeScript 5.6, React 19  
**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui, Motion (Framer Motion), GSAP  
**Storage**: N/A (file-based content in `content/*.json` per locale)  
**Testing**: ESLint (next lint), manual / browser testing  
**Target Platform**: Web (Vercel-compatible)  
**Project Type**: Web (Next.js single app)  
**Performance Goals**: No regression; layout and i18n are low-cost.  
**Constraints**: WCAG 2.1 AA, reduced-motion support (existing).  
**Scale/Scope**: 4 locales (en, fr, zh-Hans, zh-Hant), ~4 main pages, header/footer shared.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Constitution file (`.specify/memory/constitution.md`) contains template placeholders only; no project-specific gates defined. Proceed with plan.

## Project Structure

### Documentation (this feature)

```text
specs/005-ui-ux-improvements/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/          # Phase 1 (README only; no new APIs)
└── tasks.md             # Phase 2 output (/speckit.tasks – not created by plan)
```

### Source Code (repository root)

```text
app/
├── [locale]/
│   ├── layout.tsx       # Main wrapper; main section alignment
│   ├── page.tsx         # Home: add Why choose us, Amenities, Property details, House Rules
│   ├── gallery/
│   │   └── page.tsx     # Gallery page layout (center)
│   ├── property/
│   │   └── page.tsx     # Property page layout (center)
│   └── policies/
│       └── page.tsx     # Policies page layout (center)
├── globals.css          # Theme CSS variables (existing)
components/
├── header.tsx           # Logo fix; nav labels from i18n
├── theme-switcher.tsx   # Theme icon/swatch + primary-colored label per item
├── gallery/
│   ├── index.tsx        # Home gallery section (i18n)
│   └── (existing carousel)
├── gallery-page-client.tsx  # Gallery card box styling (card design)
├── hero.tsx             # i18n CTA label
├── footer.tsx           # Already uses locale
└── ui/                  # shadcn components
content/
├── property.[locale].json    # Existing; extend if needed for new sections
├── booking-channels.[locale].json
└── (optional) ui.[locale].json  # Centralized UI strings (Phase 1 decision)
lib/
├── i18n.ts              # Existing locales
├── content.ts           # getProperty, getBookingChannels; optional getUiStrings
├── themes.ts            # Theme IDs, labels; optional theme primary for dropdown
└── types.ts
public/
└── logo.svg             # Ensure aspect ratio / size for header
```

**Structure Decision**: Next.js App Router single app; `app/[locale]/*` for pages, `components/` for shared UI, `content/` for locale JSON, `lib/` for data and i18n helpers.

## Implementation Scope (User Requests)

1. **All pages – main section horizontal center**  
   Main content area must be horizontally centered (e.g. `mx-auto` with constrained `max-w-*`). Currently content is left-aligned inside container.

2. **Bug: left logo not fully displayed**  
   Header left-side logo is clipped on the right. Fix by ensuring the logo container or image allows full display (e.g. `object-contain`, no `overflow-hidden` on logo, or adjusted width/height).

3. **Theme dropdown – theme icon/style per item**  
   Each theme option in the dropdown should show a small theme swatch/icon and the label text in that theme’s primary color for quick visual identification.

4. **Language context when switching language**  
   All UI copy (nav: Property, Gallery, Policies; Gallery page: “Gallery”, “Property photos from your stay”, “View all photos”, “Back to home”; Hero CTA; any other hardcoded English) must come from locale so switching language updates the entire UI.

5. **Gallery – better gallery card box**  
   Improve the gallery (full gallery page) card design: clearer cards with consistent styling (e.g. rounded corners, shadow, optional caption/overlay). Reference: [cloudflare-images demo](https://images-hub-pim.vercel.app/cloudflare-images) for card treatment.

6. **Layout – horizontal center alignment**  
   Same as (1): ensure layout uses a single approach for horizontal centering of main content across all pages.

7. **Home page – new sections**  
   Add sections to match Vancouver Home-stay reference: **Why choose us**, **Amenities**, **Property details**, **House Rules**. Content sourced from existing `property.*.json` where possible, plus any new keys or content files as needed.

## Complexity Tracking

No constitution violations. No entries required.
