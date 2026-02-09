# Implementation Plan: Animation and Scroll Effects

**Branch**: `004-animation-scroll-effects` | **Date**: 2025-02-08 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/004-animation-scroll-effects/spec.md`  
**Reference**: [Vancouver Home-stay](https://vanhomestay-cx93bwlb.manus.space/); patterns from `vancouver-homestay-web.zip` (client only; no backend/DB/Express).

## Summary

Add scroll-triggered and entrance animations plus micro-interactions to the rental app so the UI feels modern, polished, and impressive. Use **GSAP + ScrollTrigger** for scroll-linked section reveals and stagger, and **Motion** (Framer Motion) for hero, viewport-based entrances, and hover/focus feedback. Align page structure and look with the reference site while keeping data from existing content and **no backend/database/Express**. Respect `prefers-reduced-motion` and avoid layout shift or scroll blocking.

## Technical Context

**Language/Version**: TypeScript 5.6+, React 19  
**Primary Dependencies**: Next.js 15 (App Router), GSAP 3.14+ (with ScrollTrigger), Motion 12+ (Framer Motion), Tailwind CSS v4, existing shadcn/ui and app components  
**Storage**: N/A (frontend-only; content from existing JSON and static assets under `content/`, `public/images`)  
**Testing**: Manual and visual checks for scroll behavior, reduced motion, and interaction feedback; optional Jest/React Testing Library for animation wrappers  
**Target Platform**: Modern browsers (Next.js SSR + client hydration); desktop and mobile  
**Project Type**: Web (single Next.js app; no separate backend for this feature)  
**Performance Goals**: Smooth scroll (no jank), ~60fps for animations where possible; animations scoped to viewport-near content  
**Constraints**: No backend implementation, no database, no Express.js; use only `public/images` or reference-style layout; honor `prefers-reduced-motion`  
**Scale/Scope**: One primary marketing/home page plus property and gallery sections; finite set of animated sections and components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The repository constitution (`.specify/memory/constitution.md`) is a placeholder with no ratified principles. No constitution gates are defined; no violations to justify. Proceed with feature plan as specified.

## Project Structure

### Documentation (this feature)

```text
specs/004-animation-scroll-effects/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (frontend-only; no API contracts)
└── tasks.md             # Phase 2 (/speckit.tasks – not created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx         # Home: wire hero, sections, scroll wrappers
│   ├── policies/
│   └── property/
├── globals.css
└── layout.tsx

components/
├── scroll-animation-wrapper.tsx   # GSAP ScrollTrigger wrapper (client)
├── use-scroll-animation.ts        # Optional hook for [data-scroll] (client)
├── hero.tsx                       # Hero carousel + overlay (client)
├── booking-calendar-card.tsx
├── booking-links.tsx
├── footer.tsx
├── gallery/
├── google-map.tsx
├── header.tsx
├── property-detail.tsx
└── ui/                            # shadcn; add hover/focus where needed

lib/
├── content.ts
├── gallery-images.ts
├── i18n.ts
├── seo.ts
├── types.ts
└── utils.ts

public/
└── images/                        # Use for hero and gallery; no new backend
```

**Structure Decision**: Single Next.js app. New and modified artifacts are client components under `components/` (scroll wrapper, hero, optional hook) and updates to `app/[locale]/page.tsx` to compose sections with animation wrappers. No new backend, API, or database layers.

## Complexity Tracking

No constitution violations. Table left empty.
