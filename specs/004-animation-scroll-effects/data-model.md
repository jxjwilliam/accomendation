# Data Model: Animation and Scroll Effects

**Branch**: `004-animation-scroll-effects`  
**Date**: 2025-02-08  
**Scope**: Frontend-only; no backend, database, or API entities.

## Purpose

This feature does not introduce new persistence or API contracts. The “data model” here describes **conceptual entities** used by the UI and animation layer: how sections and elements are identified for scroll/entrance behavior and how motion preference is represented at runtime.

## Entities

### Page section (logical)

- **Description**: A contiguous block of content on the home/property page that can be wrapped for scroll-triggered or viewport entrance (e.g. welcome, hero, gallery, booking, location, amenities, contact).
- **Attributes**: Section identity (e.g. `welcome`, `gallery`, `booking`); optional `data-scroll-animate` or `data-scroll` value for animation type.
- **Relationships**: Rendered as one or more DOM subtrees; wrapped by `ScrollAnimationWrapper` or similar client component.
- **Source of truth**: Layout and composition in `app/[locale]/page.tsx` and components; content from existing `getProperty(locale)`, `getBookingChannels(locale)`, and static/JSON content.

### Interactive element (logical)

- **Description**: Buttons, links, or cards that receive hover/focus micro-interactions (e.g. primary CTAs, booking links, amenity cards).
- **Attributes**: No new persistent fields; optional ARIA and class names for styling and accessibility.
- **Relationships**: Part of existing components (e.g. `BookingLinks`, `BookingCalendarCard`, gallery cards); enhanced with Motion or CSS transitions.
- **Validation**: No server-side validation; behavior is purely presentational.

### User motion preference (runtime only)

- **Description**: Whether the user has requested reduced motion (e.g. `prefers-reduced-motion: reduce`). Used to enable/disable or simplify animations.
- **Attributes**: Boolean or tri-state (e.g. `reduceMotion: boolean`) derived from `window.matchMedia('(prefers-reduced-motion: reduce)')` or equivalent.
- **Relationships**: Read by client-only animation wrappers; not stored or sent to any backend.
- **Persistence**: None; evaluated in the browser per session.

### Animation configuration (client-only)

- **Description**: Optional parameters for scroll/entrance behavior: animation type (`fade-up`, `fade-down`, etc.), duration, delay, stagger. Can be constants or derived from props.
- **Attributes**: `animationType`, `duration`, `delay`, `stagger` (see reference `ScrollAnimationWrapper` / `useScrollAnimation`).
- **Relationships**: Passed into scroll wrapper components; not persisted or synced.
- **Validation**: TypeScript types and component props; no API or schema validation.

## State transitions

- **Reduce-motion**: Page load → read media query → set `reduceMotion` (or equivalent) in state/context → animation wrappers skip or simplify motion when `reduceMotion` is true. No other state machine.

## Out of scope

- No new database tables, API endpoints, or server-side storage.
- No user accounts or server-side preferences; motion preference is browser/OS-driven only.
