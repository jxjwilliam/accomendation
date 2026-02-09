# Quickstart: Animation and Scroll Effects

**Branch**: `004-animation-scroll-effects`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md)

## Goal

Add scroll-triggered and entrance animations plus micro-interactions so the rental app feels modern and polished. Use the [reference site](https://vanhomestay-cx93bwlb.manus.space/) and patterns from `vancouver-homestay-web.zip` (client only). No backend, database, or Express.

## Prerequisites

- Node 18+
- Existing deps: `gsap`, `motion` (Framer Motion), Next.js 15, React 19, Tailwind v4 (see `package.json`)
- No new packages required for core approach; add only if you introduce new animation needs

## Implementation order (high level)

1. **Scroll wrapper (client)**  
   Add `components/scroll-animation-wrapper.tsx`: GSAP + ScrollTrigger, register plugin once, target `[data-scroll-animate]` (or similar). Support types: fade-up, fade-down, fade-left, fade-right, scale, rotate. Accept `duration`, `delay`, `stagger`. Clean up ScrollTrigger on unmount. Use `'use client'`.

2. **Reduce-motion**  
   Add a small client hook or context that reads `prefers-reduced-motion: reduce` and passes a flag into animation wrappers. When true, skip or greatly simplify scroll/entrance and micro-interactions.

3. **Hero (client)**  
   Add `components/hero.tsx`: full-viewport image carousel (or single hero image) using `public/images` or reference-style assets. Use Motion for slide crossfade and overlay text animation. Optional nav arrows and indicators. Use `'use client'`.

4. **Home page layout**  
   In `app/[locale]/page.tsx`, compose: Hero (if desired), then existing welcome/gallery/booking/location/amenities sections. Wrap section roots (or inner blocks) with `ScrollAnimationWrapper` and set `data-scroll-animate` on children where needed. Keep server component for data fetching; wrap only animated parts in client components.

5. **Stagger**  
   For sections with multiple items (amenities, gallery cards), use stagger via GSAP (`delay + index * stagger`) or Motion `staggerChildren` so items animate in sequence when the section enters view.

6. **Micro-interactions**  
   Add hover/focus styles or Motion variants to primary buttons and cards (e.g. `BookingLinks`, gallery items). Keep duration short (&lt; ~300ms); ensure focus visible for accessibility.

7. **Polish**  
   Ensure no layout shift (reserve space for images/sections). Use `viewport={{ once: true }}` or equivalent so animations run once. Test with `prefers-reduced-motion: reduce` enabled.

## Key files (existing)

- `app/[locale]/page.tsx` – home page composition
- `lib/content.ts` – `getProperty`, `getBookingChannels`
- `content/` – JSON content
- `public/images/` – images for hero/gallery

## Key files (new or updated)

- `components/scroll-animation-wrapper.tsx` – new, client
- `components/hero.tsx` – new, client (optional hook `components/use-scroll-animation.ts` if you want ref-based API)
- `app/[locale]/page.tsx` – wire hero and scroll wrappers
- Optional: shared hook or context for `prefers-reduced-motion`

## Run and test

```bash
npm install   # if needed
npm run dev
```

- Scroll the home page: sections should animate into view; scroll should stay smooth.
- Toggle “Reduce motion” in OS/browser: animations should be minimal or instant.
- Check hover/focus on primary buttons and cards.
- Use Lighthouse or DevTools to confirm no large layout shifts or long tasks blocking scroll.

## Reference patterns (from zip)

- **ScrollAnimationWrapper**: `client/src/components/ScrollAnimationWrapper.tsx` (GSAP + ScrollTrigger, `[data-scroll-animate]`).
- **useScrollAnimation**: `client/src/hooks/useScrollAnimation.ts` (same idea, returns ref).
- **HighlightsWithAnimation**: `client/src/components/HighlightsWithAnimation.tsx` (Motion `whileInView`, ScrollAnimationWrapper with stagger).
- **Hero**: `client/src/components/Hero.tsx` (Motion carousel, overlay text).

Adapt these to Next.js 15 (client components, no React-i18next; use project i18n and content).
