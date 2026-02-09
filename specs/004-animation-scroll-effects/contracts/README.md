# Contracts: 004-animation-scroll-effects

**Branch**: `004-animation-scroll-effects`  
**Scope**: Frontend-only (UI/UX animations and scroll effects).

## No API or backend contracts

This feature does **not** introduce:

- New REST or GraphQL endpoints
- Server-side APIs
- Database schemas or migrations
- External service contracts

All behavior is implemented in the Next.js client (and optional client components). Data continues to come from existing sources:

- `getProperty(locale)` and `getBookingChannels(locale)` (from `lib/content.ts`)
- Static assets under `public/images` and content under `content/`

## Optional: component props and animation config

Animation behavior is defined by:

- **Component props** for `ScrollAnimationWrapper` (or equivalent): e.g. `animationType`, `duration`, `delay`, `stagger`, `className`. See [research.md](../research.md) and reference `ScrollAnimationWrapper.tsx`.
- **Data attributes** on DOM elements: e.g. `data-scroll-animate="fade-up"` or `data-scroll="fade-up"` for GSAP ScrollTrigger targets.

These are documented in the implementation (components and plan) rather than as separate schema files. No OpenAPI or JSON Schema is required for this feature.
