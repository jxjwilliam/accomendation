# Tasks: 002-ui-new-features

**Input**: Design documents from `specs/002-ui-new-features/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in spec; no test tasks included.

**Organization**: Tasks grouped by user story (US1, US2, US3) plus plan-driven Booking Calendar and Polish. Each story is independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3 for spec user stories
- Include exact file paths in descriptions

## Path Conventions

- Next.js App Router: `app/`, `components/`, `lib/` at repository root
- Locale routes: `app/[locale]/page.tsx`, `app/[locale]/property/page.tsx`, `app/[locale]/policies/page.tsx`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add animation and UI dependencies; gallery image list; shadcn components required by calendar and gallery.

- [x] T001 Add motion (framer-motion) and gsap to package.json and install
- [x] T002 [P] Add shadcn Calendar component to components/ui/ (npx shadcn@latest add calendar)
- [x] T003 [P] Add shadcn Tooltip and Popover to components/ui/ if not present (npx shadcn@latest add tooltip popover)
- [x] T004 [P] Add gallery image list (all 78 images from public/images/) in lib/constants.ts or lib/gallery-images.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Design tokens and shared data/loaders so user stories and calendar can rely on them. Layout ready for footer.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [x] T005 Add design tokens (typography, spacing, OKLCH where needed) to app/globals.css per plan and UI/UX Pro Max
- [x] T006 [P] Create lib/unavailable-dates.ts to load optional content/unavailable-dates.json and export getUnavailableDates (or no-op if file missing)
- [x] T007 Ensure app/[locale]/layout.tsx structure allows footer insertion (e.g. wrap main + footer in a fragment or container)

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 — Consistent, polished UI (Priority: P1) 🎯 MVP

**Goal**: Visitor sees consistent header, typography, spacing, and colors across home, property, and policies; no broken layouts on mobile or desktop.

**Independent Test**: Open home, property, and policies; confirm same header/nav/visual style; no overlapping or cut-off content at 320px–1920px.

### Implementation for User Story 1

- [x] T008 [US1] Audit and align components/header.tsx for consistent logo, nav links, and language selector across all pages
- [x] T009 [US1] Apply consistent typography and spacing in app/[locale]/page.tsx, app/[locale]/property/page.tsx, and app/[locale]/policies/page.tsx using design tokens from globals.css
- [x] T010 [US1] Verify responsive behavior at 320px, 768px, 1024px, 1920px; fix horizontal overflow or overlapping key content in app/[locale] pages

**Checkpoint**: User Story 1 complete — consistent UI across main pages

---

## Phase 4: User Story 2 — Site footer (Priority: P2)

**Goal**: Footer on every main page with business name, location/address, and links to property, policies, or booking/contact; localized.

**Independent Test**: Scroll to footer on home, property, and policies; confirm footer shows name, address, and at least one actionable link; switch language and confirm footer text updates.

### Implementation for User Story 2

- [x] T011 [P] [US2] Add Footer-related types (e.g. FooterLink) and optional getFooterContent in lib/types.ts and lib/content.ts (derive from property or content/footer.*.json)
- [x] T012 [US2] Create components/footer.tsx with business name, address, and links; use localized labels and support all locales
- [x] T013 [US2] Add Footer to app/[locale]/layout.tsx so it appears on home, property, and policies
- [x] T014 [US2] Add footer content: either derive from existing content/property.*.json (name, addressLine) plus link config, or add content/footer.*.json for all locales

**Checkpoint**: User Story 2 complete — footer visible on all main pages with correct content and links

---

## Phase 5: User Story 3 — Gallery / highlights (Priority: P3)

**Goal**: Dedicated gallery section on home and/or property page using all images in public/images/; marquee and/or carousel; accessible (alt text, keyboard nav); responsive without horizontal overflow.

**Independent Test**: Open home and property pages; confirm gallery section shows multiple images; verify alt text and keyboard navigation; check small viewport (e.g. 375px) for usability.

### Implementation for User Story 3

- [x] T015 [P] [US3] Create components/gallery/image-marquee.tsx using image list from lib (all 78 images), next/image, lazy load; optional Framer Motion or GSAP; respect prefers-reduced-motion
- [x] T016 [P] [US3] Create components/gallery/image-carousel.tsx with prev/next or dots, next/image, and accessible labels/roles
- [x] T017 [US3] Create components/gallery/index.tsx (or wrapper) that composes marquee and/or carousel; export from components/gallery/
- [x] T018 [US3] Optional: Create components/gallery/scroll-trigger-gallery.tsx with GSAP ScrollTrigger or Framer Motion whileInView for scroll-driven reveal
- [x] T019 [US3] Add gallery section to app/[locale]/page.tsx and app/[locale]/property/page.tsx with descriptive alt text and keyboard-navigable controls

**Checkpoint**: User Story 3 complete — gallery visible and accessible on intended pages

---

## Phase 6: Booking Calendar Card (plan-driven)

**Goal**: Glassmorphism booking card with date-range picker, “Reserved” tooltip on unavailable dates, Framer Motion entrance, CAD, mobile-optimized. No backend; calendar for discovery and CTA to OTA/contact.

**Independent Test**: Open home page; find Booking Calendar Card; select date range; hover an unavailable (reserved) date and see “Reserved” tooltip; verify card has frosted background and entrance animation; check mobile layout and CAD in copy.

### Implementation for Booking Calendar Card

- [x] T020 Create components/booking-calendar-card.tsx with glassmorphism (frosted background, subtle border), shadcn Calendar and Button, and date-range selection (from–to)
- [x] T021 Add unavailable-dates support and “Reserved” tooltip on hover for disabled dates in components/booking-calendar-card.tsx using lib/unavailable-dates.ts and shadcn Tooltip
- [x] T022 Add Framer Motion entrance animation (y offset 20px, duration 0.4s) and prefers-reduced-motion check in components/booking-calendar-card.tsx
- [x] T023 Add Booking Calendar Card to app/[locale]/page.tsx; ensure CAD currency in any price/copy and mobile-optimized layout (Tailwind v4 OKLCH where applicable)

**Checkpoint**: Booking Calendar Card complete and integrated on home page

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, reduced-motion, and documentation.

- [x] T024 [P] Verify WCAG 2.1 AA: focus states, alt text, 44px touch targets, color contrast across new components (footer, gallery, booking-calendar-card)
- [x] T025 [P] Run quickstart.md validation and document any deviations or completion notes in docs/
- [x] T026 Final pass: ensure prefers-reduced-motion is respected in components/gallery/* and components/booking-calendar-card.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 — blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2 (and T007 for footer placement in layout).
- **Phase 5 (US3)**: Depends on Phase 2 and T004 (gallery image list).
- **Phase 6 (Booking Calendar)**: Depends on Phase 2, T002, T003, T006.
- **Phase 7 (Polish)**: Depends on Phases 3–6.

### User Story Dependencies

- **US1 (P1)**: After Phase 2 only — no dependency on US2/US3.
- **US2 (P2)**: After Phase 2 only — independent of US1/US3.
- **US3 (P3)**: After Phase 2 only — independent of US1/US2.
- **Booking Calendar**: After Phase 2; can be done in parallel with US1–US3 once Setup + Foundational are done.

### Parallel Opportunities

- Phase 1: T002, T003, T004 can run in parallel after T001.
- Phase 2: T006 can run in parallel with T005; T007 after layout decision.
- Phase 4: T011 can run in parallel with other tasks.
- Phase 5: T015, T016 can run in parallel; T018 optional in parallel with T017.
- Phase 7: T024, T025 can run in parallel.

---

## Parallel Example: User Story 3

```text
# After Phase 2, launch in parallel:
T015: components/gallery/image-marquee.tsx
T016: components/gallery/image-carousel.tsx

# Then:
T017: components/gallery/index.tsx (or wrapper)
T018: components/gallery/scroll-trigger-gallery.tsx (optional)
T019: Add gallery to app/[locale]/page.tsx and app/[locale]/property/page.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: User Story 1  
4. **STOP and VALIDATE**: Test consistent UI across home, property, policies  
5. Deploy/demo if ready  

### Incremental Delivery

1. Setup + Foundational → foundation ready  
2. Add US1 → test independently → MVP (consistent UI)  
3. Add US2 → test footer on all pages  
4. Add US3 → test gallery on home/property  
5. Add Booking Calendar Card → test on home  
6. Polish → accessibility and docs  

### Task Count Summary

| Phase        | Task IDs   | Count |
|-------------|------------|-------|
| Phase 1     | T001–T004  | 4     |
| Phase 2     | T005–T007  | 3     |
| Phase 3 US1 | T008–T010  | 3     |
| Phase 4 US2 | T011–T014  | 4     |
| Phase 5 US3 | T015–T019  | 5     |
| Phase 6     | T020–T023  | 4     |
| Phase 7     | T024–T026  | 3     |
| **Total**   |            | **26**|

---

## Notes

- [P] = parallelizable; [USn] = maps to spec user story for traceability.
- Each user story is independently completable and testable per Independent Test above.
- No test tasks included (spec does not request TDD or explicit test tasks).
- Commit after each task or logical group; stop at any checkpoint to validate.
