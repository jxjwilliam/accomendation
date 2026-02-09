# Research: Animation and Scroll Effects (004-animation-scroll-effects)

**Branch**: `004-animation-scroll-effects`  
**Date**: 2025-02-08  
**Reference**: [Vancouver Home-stay](https://vanhomestay-cx93bwlb.manus.space/), `vancouver-homestay-web.zip` (client animation patterns only; no backend/DB/Express in scope)

## Scope and Constraints (from user)

- **Frontend-only**: No backend implementation, no database, no Express.js. Focus on UI/UX.
- **Reference UI**: Align with or replicate the look and feel of https://vanhomestay-cx93bwlb.manus.space/ using existing `public/images` or reference layout.
- **Goal**: Stunning, modern, attractive, impressive animation and scroll effects.

---

## 1. Animation and scroll-trigger libraries

**Decision**: Use **GSAP (with ScrollTrigger)** for scroll-triggered section animations and **Motion** (Framer Motion) for component-level entrance, hero, and micro-interactions.

**Rationale**:
- Current project already depends on `gsap` and `motion` (see `package.json`); no new runtime dependencies required.
- Reference zip uses **GSAP + ScrollTrigger** for scroll-triggered behavior (`ScrollAnimationWrapper`, `useScrollAnimation` with `data-scroll-animate` / `data-scroll`, trigger at `top 80–85%`).
- Reference uses **Framer Motion** (`motion.div`) for hero carousel, section headings (`whileInView`, `viewport={{ once: true }}`), and card hovers.
- GSAP ScrollTrigger gives precise scroll-linked control and stagger; Motion gives a simple React-friendly API for viewport and layout animations. Using both is consistent with the reference and the spec’s “framer-motion, gsap etc” direction.

**Alternatives considered**:
- **Motion only**: Possible, but scroll-trigger tuning and stagger are more verbose; reference already uses GSAP for scroll.
- **GSAP only**: Possible, but more boilerplate for React components and `whileInView`-style behavior; reference already uses Framer Motion for hero and highlights.
- **CSS-only (scroll-driven animations)**: Limited browser support and less control than GSAP/Motion for stagger and easing; not chosen for primary implementation.

---

## 2. Scroll-trigger patterns (from reference zip)

**Decision**: Adopt the reference’s scroll-trigger patterns and adapt them to the Next.js/React 19 app.

**Patterns extracted from reference**:
- **ScrollAnimationWrapper** (GSAP + ScrollTrigger):
  - Targets elements with `[data-scroll-animate]` (or configurable selector).
  - Animation types: `fade-up`, `fade-down`, `fade-left`, `fade-right`, `scale`, `rotate`.
  - Config: `duration`, `delay`, `stagger`; trigger `start: 'top 85%'`, `end: 'top 55%'` (element enters from bottom of viewport).
  - Cleanup: `ScrollTrigger.getAll().forEach(t => t.kill())` on unmount.
- **useScrollAnimation** hook:
  - Same idea with `[data-scroll]`, returns `containerRef` to attach to a wrapper.
  - Options: `duration`, `delay`, `stagger`, `ease` (e.g. `power3.out`).
- **Motion for section headings**: `initial={{ opacity: 0, y: 20 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true }}`, `transition={{ duration: 0.6 }}`.

**Rationale**: These patterns are proven in the reference, keep scroll responsive (no scrub blocking), and support stagger for lists/cards. Implementing equivalent behavior in the rental app (Next.js, server/client components) will deliver the “scroll and entrance” requirements (FR-001, FR-003, FR-004).

**Implementation note**: In Next.js 15, scroll components must run on the client; use `'use client'` for any component that uses GSAP ScrollTrigger or Motion `whileInView`. Register `ScrollTrigger` once (e.g. in a layout effect or a small animation setup module).

---

## 3. Hero and above-the-fold experience

**Decision**: Add a hero section inspired by the reference (full-viewport image/carousel, headline, CTA, optional nav arrows and indicators), using **Motion** for crossfade and overlay text animation. Use `public/images` or reference-style imagery.

**Rationale**: Reference hero uses a full-height carousel with `motion.div` opacity per slide, overlay text with `initial/animate/transition`, and arrows/indicators. Replicating this pattern (with project images) satisfies “engaging first impression” (User Story 1) and “stunning, modern” goal. No backend required; image sources are static or from existing `public/images`.

**Alternatives considered**:
- Single static hero image: Simpler but less “impressive”; user asked for striking effects.
- Third-party carousel only: Reference combines carousel with Motion; we keep the same stack for consistency.

---

## 4. Staggered section and list animations

**Decision**: Use **staggered** entrance for multi-item sections (e.g. amenities, gallery cards, “why choose us” tiles). Stagger via GSAP (e.g. `delay: delay + index * stagger` in ScrollTrigger) or Motion’s `staggerChildren` / `delayChildren`.

**Rationale**: Spec and reference both use stagger (e.g. `stagger: 0.15` in HighlightsWithAnimation). Stagger improves perceived quality and supports FR-004 (scroll-linked/staggered reveals).

---

## 5. Micro-interactions (buttons, links, cards)

**Decision**: Apply quick hover/focus feedback (scale, opacity, underline, or shadow) to primary CTAs and cards using **Motion** or CSS transitions. Animations must be short (&lt; ~300ms) and non-blocking.

**Rationale**: FR-005 and User Story 3 require clear hover/focus feedback. Reference uses `card-hover`, `transition-all duration-300`, and Motion for section blocks. We will apply the same idea to buttons and cards in the rental app.

---

## 6. Reduced motion and accessibility

**Decision**: Respect `prefers-reduced-motion: reduce` by disabling or greatly simplifying non-essential animations (scroll-triggered and micro-interactions). Keep content and layout unchanged.

**Rationale**: FR-002 and spec edge cases require honoring user motion preference. Approach: detect `prefers-reduced-motion` (media query or JS) and either skip registering ScrollTrigger/Motion animations for decorative effects or use instant transitions (opacity 0→1, no transform). Core content remains readable and focusable.

**Implementation**: Use a small hook or context that reads `window.matchMedia('(prefers-reduced-motion: reduce)')` and passes a “reduce motion” flag to animation wrappers; alternatively use CSS `@media (prefers-reduced-motion: reduce)` to override or disable animation where possible.

---

## 7. Performance and layout stability

**Decision**: (1) Avoid layout shift: animate opacity/transform only where possible; reserve space for images and sections. (2) Limit ScrollTrigger/Motion to viewport-near content; do not run heavy animations on far-off-screen nodes. (3) Prefer `viewport={{ once: true }}` or equivalent so elements animate in once and do not re-run on scroll back.

**Rationale**: FR-006 (progressive enhancement) and FR-007 (no layout shift, no obscuring CTAs). Reference uses `once` and transform/opacity; same discipline applied here keeps performance and CLS acceptable.

---

## 8. Reference UI structure (content only; no backend)

**Decision**: Use the reference site’s **content and section order** as a visual/layout guide for the rental app, while keeping data from existing app (e.g. `content/`, `getProperty`, `getBookingChannels`). No copying of backend, auth, or database code.

**Reference sections (from scrape)**:
- Hero (carousel, title, subtitle, “Book Now”)
- “Why Choose Us” (e.g. Spacious Bedrooms, Modern Kitchen, Prime Location, Premium Amenities)
- Amenities (grid of icons/labels)
- Property Details (rooms, house rules)
- Book Your Stay (dates, guests, CTA)
- Get in Touch / Contact (address, phone, email)

**Rationale**: User asked to “replace current ui” and “copy the ui from reference” for a “stunning and modern” result. Mapping current app sections (welcome, gallery, booking, location, description, amenities) to this structure—and applying the animation patterns above—achieves that without introducing backend/DB/Express.

---

## Summary table

| Topic              | Decision                                               | Source        |
|--------------------|--------------------------------------------------------|---------------|
| Scroll-trigger lib | GSAP + ScrollTrigger                                   | Reference zip |
| Component motion   | Motion (Framer Motion)                                  | Reference zip |
| Scroll pattern     | data-scroll-animate / wrapper + trigger ~85%            | Reference zip |
| Hero               | Full-viewport carousel + Motion overlay                | Reference zip |
| Stagger            | Staggered section/list entrances                        | Spec + ref    |
| Micro-interactions | Short hover/focus on CTAs and cards                     | Spec + ref    |
| Reduced motion     | Honor prefers-reduced-motion; simplify or disable      | Spec FR-002   |
| Performance        | Transform/opacity, once, viewport-near only           | Spec FR-006/7 |
| UI structure       | Align section order and look with reference; no backend | User input    |

All NEEDS CLARIFICATION from the plan’s Technical Context are resolved by the above and by the existing repo (Next.js 15, React 19, Tailwind, existing `gsap` and `motion` deps).
