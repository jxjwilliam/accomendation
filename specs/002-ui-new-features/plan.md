# Implementation Plan: Implement UI and Add New Features

**Branch**: `002-ui-new-features` | **Date**: 2025-02-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/002-ui-new-features/spec.md` plus plan directives: animations (Framer Motion, GSAP), calendar for booking/reservation, image presentation (marquee, carousel, scroll-trigger), UI/UX Pro Max principles, Booking Calendar Card (glassmorphism, date-range, Reserved tooltip, CAD, mobile).

## Summary

Enhance the family hotel site with consistent UI (footer, typography, spacing), a photo gallery using all images in `public/images/` (marquee, carousel, and/or scroll-trigger animations), and a booking/reservation calendar. Apply UI/UX Pro Max principles (accessibility, touch targets, glassmorphism where specified). Use Framer Motion and GSAP for animations; shadcn/ui for Calendar and Button; optional Aceternity UI–style components. Booking Calendar Card: glassmorphism preset (frosted background, subtle border), shadcn Calendar + Button, Tailwind v4 OKLCH, date-range picker, “Reserved” tooltip on unavailable dates, Framer Motion entrance (y 20px, 0.4s), CAD currency, mobile-optimized. Vancouver/Surrey BC context.

## Technical Context

**Language/Version**: TypeScript 5.x (latest stable)  
**Primary Dependencies**: Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui, Framer Motion (motion/react), GSAP (gsap), next-intl  
**Storage**: N/A for new UI; optional file-based unavailable dates (e.g. `content/unavailable-dates.json`) for calendar  
**Testing**: Vitest or Jest; Playwright or Cypress for critical flows; respect prefers-reduced-motion  
**Target Platform**: Web (modern browsers); mobile-first for calendar and gallery  
**Project Type**: web (single Next.js app; extends existing 001 app)  
**Performance Goals**: Animations use transform/opacity; images lazy-loaded; key content visible &lt;3s  
**Constraints**: WCAG 2.1 AA; prefers-reduced-motion respected; no backend for booking (calendar is exploratory/contact CTA); CAD currency, Vancouver context  
**Scale/Scope**: Footer on all main pages; gallery using 78 images; one Booking Calendar Card (date-range + reserved tooltip); optional aceternity-style components as needed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Project constitution is template-only. Applied checks:

- **Spec alignment**: Delivers consistent UI, footer, highlights/gallery per spec; adds calendar and animation per plan directives.
- **Simplicity**: Additions are UI and client-side only; calendar does not require new backend unless later specified.

*No violations. Proceed.*

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-new-features/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (if any)
└── tasks.md             # From /speckit.tasks
```

### Source Code (repository root; extends existing app)

```text
app/
├── [locale]/
│   ├── page.tsx         # Home: hero, gallery section, booking card, map, footer
│   ├── property/
│   │   └── page.tsx     # Property: detail, gallery, map, footer
│   ├── policies/
│   │   └── page.tsx     # Policies + footer
│   └── layout.tsx       # Header already present
├── layout.tsx
└── globals.css

components/
├── ui/                  # shadcn (add Calendar, Tooltip if not present)
├── header.tsx           # Existing
├── footer.tsx          # NEW: site footer (name, address, links)
├── booking-calendar-card.tsx   # NEW: glassmorphism card, date-range, Reserved tooltip, CAD, motion
├── gallery/             # NEW: image presentation
│   ├── image-marquee.tsx
│   ├── image-carousel.tsx
│   └── scroll-trigger-gallery.tsx  # Optional scroll-driven (GSAP ScrollTrigger or similar)
├── property-detail.tsx  # Existing
├── booking-links.tsx    # Existing
└── google-map.tsx       # Existing

lib/
├── i18n.ts
├── content.ts
├── types.ts
├── constants.ts
└── unavailable-dates.ts   # Optional: load reserved dates for calendar

content/
├── property.*.json
├── booking-channels.*.json
└── unavailable-dates.json  # Optional: list of reserved dates (ISO or date strings)

public/
└── images/              # image_001.jpg … image_078.jpg (all used in gallery)
```

**Structure Decision**: Single Next.js app. New components under `components/` (footer, booking-calendar-card, gallery variants). Calendar and gallery are client components (Framer Motion, GSAP, interactivity). Reserved dates can be file-based for static build.

## Complexity Tracking

*None.*
