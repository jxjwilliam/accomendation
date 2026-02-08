# Research: 002-ui-new-features

**Feature**: 002-ui-new-features  
**Date**: 2025-02-07

## 1. Framer Motion vs GSAP — when to use which

**Decision**: Use **Framer Motion (motion/react)** for component-level entrance/exit and layout animations (e.g. Booking Calendar Card entrance y 20px, 0.4s; micro-interactions). Use **GSAP** (with ScrollTrigger if needed) for scroll-linked or timeline-heavy image gallery effects (e.g. scroll-driven reveals similar to reference site). Both can coexist; avoid animating the same DOM property with both on the same element.

**Rationale**: Framer Motion fits React/Next.js and declarative component animations; GSAP ScrollTrigger is well-suited for scroll-driven gallery effects. Plan explicitly requested Framer Motion for calendar card entrance and GSAP for scroll-trigger actions.

**Alternatives considered**: Framer Motion only (possible but ScrollTrigger-style scroll linking is more verbose); GSAP only (heavier for simple entrance animations). Split as above keeps each tool in its strength.

---

## 2. shadcn/ui Calendar and date-range picker

**Decision**: Use **shadcn/ui Calendar** component (and **Popover** if needed for picker UX). Implement **date-range** selection (from–to). Use **react-day-picker** under the hood (shadcn Calendar is built on it); support disabling specific dates (unavailable/reserved) and show custom **tooltip** “Reserved” on hover for those dates per UI/UX Pro Max micro-interactions.

**Rationale**: Plan requires shadcn Calendar and Button; Tailwind v4 OKLCH. shadcn Calendar supports `disabled` dates and custom day content; tooltip can be added via shadcn Tooltip or a small custom hover overlay.

**Alternatives considered**: Headless date picker only (more work); third-party booking widget (out of scope; we own the card UI).

---

## 3. Glassmorphism preset (Booking Calendar Card)

**Decision**: Apply **glassmorphism** to the Booking Calendar Card: frosted background (e.g. `backdrop-blur-md bg-white/70` or OKLCH equivalent), subtle white/light border, rounded corners. Use Tailwind v4 with OKLCH where possible (e.g. `oklch(...)` in theme or arbitrary values). Ensure contrast for text (UI/UX Pro Max: light mode text dark enough, borders visible).

**Rationale**: Plan specifies “Glassmorphism preset from the skill (frosted background, subtle white border)”. Skill recommends `bg-white/80` or higher for glass in light mode and visible borders.

**Alternatives considered**: Pure CSS blur only; different opacity—chose values that meet accessibility and match “frosted” + “subtle border”.

---

## 4. Image presentation: marquee, carousel, scroll-trigger

**Decision**: Use **all images** in `public/images/` (image_001.jpg … image_078.jpg). Provide at least two presentation modes: (1) **Marquee** — horizontal scrolling strip (CSS or GSAP), optionally infinite loop; (2) **Carousel** — one or a few visible at a time with prev/next or dots. Optional: **scroll-trigger** section (GSAP ScrollTrigger or Framer Motion `whileInView`) for reveal/parallax-style effects inspired by reference (images-hub-pim.vercel.app). Prefer **next/image** with `sizes` and lazy loading; use `loading="lazy"` and avoid layout shift.

**Rationale**: Plan asks for “suitable ways to present them, such as marquee, carousel, scrolltrigger actions”. Delivering marquee + carousel covers core ask; scroll-trigger can be one section or variant.

**Alternatives considered**: Single static grid only (rejected; plan asks for marquee/carousel/scroll); external gallery lib (optional; native + GSAP/Motion is sufficient).

---

## 5. Aceternity UI and extra component libraries

**Decision**: Use **shadcn/ui** as primary (Calendar, Button, Tooltip, etc.). Add **Aceternity UI–style** components only if a specific block (e.g. marquee, card) is copied or adapted from Aceternity; prefer implementing marquee/card with Tailwind + Framer Motion/GSAP to avoid extra dependency unless we explicitly adopt a block. No new “aceternity-ui” package by default; copy-paste patterns if used.

**Rationale**: Plan says “add shadcn-ui lib such as aceternity-ui components etc if need”. So aceternity is optional; shadcn is required. Keep bundle and consistency with existing shadcn stack.

**Alternatives considered**: Install aceternity as package (if it exists); add many third-party UI libs—rejected to keep stack minimal and design tokens consistent.

---

## 6. Booking calendar: reservation logic and data

**Decision**: **No backend booking engine** in this scope. Calendar is for **date discovery and CTA**: user selects a date range, sees “Reserved” on unavailable dates (from optional file-based list), and is directed to OTA or contact (existing booking links). Unavailable dates loaded from optional **content/unavailable-dates.json** (array of date strings or ranges). Currency **CAD** and **mobile-optimized** layout as specified; no payment or reservation API.

**Rationale**: Plan says “calendar for customer booking & reservation” in the context of a family hotel site that already uses OTA links; UI/UX Pro Max and plan focus on the card and UX, not backend. File-based reserved dates keep the app static-first and editable by owner.

**Alternatives considered**: Backend API for availability (out of scope); real-time sync with OTA (out of scope).

---

## 7. Animation and accessibility (prefers-reduced-motion)

**Decision**: Respect **prefers-reduced-motion: reduce** (and Tailwind `motion-safe:` / Framer Motion `useReducedMotion`): disable or shorten non-essential motion (entrance animations, marquee, scroll-trigger effects). Keep interactions (e.g. calendar open/close, tooltip) usable and ensure focus states and touch targets (44px min) per UI/UX Pro Max.

**Rationale**: WCAG and UI/UX Pro Max both require reduced-motion support and accessible focus/touch.

**Alternatives considered**: Ignore reduced-motion (rejected); remove all motion (rejected; plan asks for Framer/GSAP; we can degrade gracefully).
