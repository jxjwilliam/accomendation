# Implementation Plan: Family Hotel Web Presence for OTA Cooperation

**Branch**: `001-family-hotel-ota-app` | **Date**: 2025-02-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-family-hotel-ota-app/spec.md`

## Summary

Build a simple, static-first marketing website for a family hotel in Surrey, Vancouver BC, Canada. The site presents property identity, description, amenities, photos, and policies; offers a visible language selector (English, French, Chinese Simplified, Chinese Traditional); and provides link-only paths to book (Airbnb, Booking.com, VRBO) or contact (mailto/external URL). Content is maintained by editing files or code and redeploying—no admin area or login. Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui. Target: WCAG 2.1 Level AA, key content load &lt;3s.

## Technical Context

**Language/Version**: TypeScript 5.x (latest stable)  
**Primary Dependencies**: Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui, next-intl (or similar for i18n)  
**Storage**: N/A (file-based content: JSON/MDX or config in repo; no database)  
**Testing**: Vitest or Jest for unit tests; Playwright or Cypress for critical path E2E; axe-core or similar for accessibility  
**Target Platform**: Web (modern browsers); deploy to Vercel or static host  
**Project Type**: web (single Next.js app; no separate backend)  
**Performance Goals**: Key pages render and display essential content within 3 seconds (SC-002)  
**Constraints**: No server-side form handling or storage; no admin UI or auth; content editable via repo + deploy  
**Scale/Scope**: Single property, ~4 locales, small number of pages (home, property, policies, booking/contact links)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is a template with placeholder principles. No project-specific gates are defined. Applied checks:

- **Spec alignment**: Implementation stays within spec scope (no admin, no contact form storage, link-only contact, file-based content).
- **Simplicity**: Single Next.js app; no backend services or database; complexity justified by i18n (4 locales) and WCAG 2.1 AA.

*No violations. Proceed.*

## Project Structure

### Documentation (this feature)

```text
specs/001-family-hotel-ota-app/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (content schema)
└── tasks.md             # From /speckit.tasks (not created by plan)
```

### Source Code (repository root)

```text
app/
├── [locale]/            # Dynamic segment for i18n (en, fr, zh-Hans, zh-Hant)
│   ├── page.tsx         # Home
│   ├── property/
│   │   └── page.tsx     # Property info, amenities, photos
│   ├── policies/
│   │   └── page.tsx     # Policies (or linked)
│   └── layout.tsx       # Locale layout + language selector in header
├── layout.tsx           # Root layout
└── globals.css          # Tailwind

components/
├── ui/                  # shadcn components
├── header.tsx           # Site header + language selector
├── footer.tsx
├── property-card.tsx
└── booking-links.tsx    # OTA + contact links

lib/
├── i18n.ts              # Locale config, messages loaders
└── content.ts           # Load property/booking content from files

content/                 # File-based content (editable by owner/maintainer)
├── property.json        # Or property.en.json, property.fr.json, etc.
├── booking-channels.json
└── (optional) policies.*.mdx

public/
├── images/              # Property photos
└── ...

tests/
├── e2e/                 # Critical path + a11y
└── unit/
```

**Structure Decision**: Single Next.js 15 App Router app. Locale under `app/[locale]/` for clean i18n routing. Content in `content/` and `lib/content.ts` so updates are file-edit + redeploy. No `backend/` or API routes for form handling; contact is link-only.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*None.*
