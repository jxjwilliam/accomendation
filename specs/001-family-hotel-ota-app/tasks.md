# Tasks: Family Hotel Web Presence for OTA Cooperation

**Input**: Design documents from `specs/001-family-hotel-ota-app/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec; no test tasks included. Add E2E or a11y tests in Polish phase if desired.

**Organization**: Tasks grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Next.js 15 App Router: `app/`, `components/`, `lib/`, `content/`, `public/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Next.js 15 app with App Router, TypeScript, and project structure (app/, components/, lib/, content/, public/images/) per specs/001-family-hotel-ota-app/plan.md
- [x] T002 Add Tailwind CSS v4 and configure PostCSS in project root
- [x] T003 [P] Install and initialize shadcn/ui; add required components (e.g. DropdownMenu or Select for language selector) under components/ui/
- [x] T004 [P] Install next-intl (or chosen i18n solution) and configure supported locales (en, fr, zh-Hans, zh-Hant) per research.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: i18n routing, content loading, root layout, and header with language selector. Must be complete before any user story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Define TypeScript types for Property, Location, Policies, and BookingChannel in lib/types.ts matching specs/001-family-hotel-ota-app/data-model.md and contracts/content-schema.json
- [x] T006 [P] Implement lib/content.ts to load property and booking-channels JSON by locale from content/ (e.g. getProperty(locale), getBookingChannels(locale))
- [x] T007 Configure i18n routing: middleware for locale detection and app/[locale] dynamic segment; generateStaticParams for locales en, fr, zh-Hans, zh-Hant in app/[locale]/layout.tsx or page
- [x] T008 Create app/layout.tsx (root layout) and app/globals.css with Tailwind directives
- [x] T009 Create components/header.tsx with visible language selector (EN, FR, 简体, 繁体) linking to /[locale]/... per FR-008
- [x] T010 Create app/[locale]/layout.tsx that renders Header and children; ensure locale is passed to content loaders
- [x] T011 Add minimal sample content files content/property.en.json and content/booking-channels.en.json (per data-model) so dev server and build succeed

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 — Guest discovers the hotel and finds how to book (Priority: P1) 🎯 MVP

**Goal**: Visitor sees hotel name, location (Surrey, Vancouver BC, Canada), and at least one clear path to book or inquire (OTA or contact links); works on mobile and desktop.

**Independent Test**: Open site → see identity and location → click a booking/contact link; verify on mobile viewport.

### Implementation for User Story 1

- [x] T012 [P] [US1] Create components/booking-links.tsx to render OTA and contact links from booking channels content (type, label, url, openInNewTab)
- [x] T013 [US1] Create app/[locale]/page.tsx (home) that loads property and booking channels, displays property name, location, typeOfAccommodation, and BookingLinks component
- [x] T014 [US1] Ensure home page and header are responsive (Tailwind breakpoints) so key content and booking/contact actions are visible and usable on mobile and desktop per FR-004

**Checkpoint**: User Story 1 complete — guest can discover hotel and reach booking/contact

---

## Phase 4: User Story 2 — Owner presents the business professionally (Priority: P2)

**Goal**: Site displays description, amenities, photos, and policies in one place so the business is presented credibly.

**Independent Test**: View property section/page → see description, amenities list, photos, and policies (or link).

### Implementation for User Story 2

- [x] T015 [P] [US2] Create component(s) for property detail: description, amenities list, and photo gallery (e.g. components/property-detail.tsx or property-card.tsx) using data from lib/content.ts
- [x] T016 [US2] Create app/[locale]/property/page.tsx that loads property content and renders full property info (description, amenities, photos) and optional policies block or link per data-model.md
- [x] T017 [US2] Add policies display (checkInOut, cancellation) or external link (externalUrl) on property page or app/[locale]/policies/page.tsx per FR-002

**Checkpoint**: User Story 2 complete — property is presented with description, amenities, photos, policies

---

## Phase 5: User Story 3 — Guest finds the property from search or direct visit (Priority: P3)

**Goal**: Purpose (family hotel in Surrey, BC) is obvious within one screen; primary CTA and location are easy to find.

**Independent Test**: Open site → purpose clear in one screen; follow primary CTA to book; find location (Surrey, Vancouver BC, Canada) easily.

### Implementation for User Story 3

- [x] T018 [US3] Add metadata (title, description) per locale in app/[locale]/layout.tsx or layout metadata for SEO and findability
- [x] T019 [US3] Ensure home page hero or first screen clearly states purpose (family hotel in Surrey, BC) and includes primary call-to-action (e.g. Book or Contact) per SC-001
- [x] T020 [US3] Add a clear location block or component (Surrey, Vancouver BC, Canada) on home and/or property page so address/area is easy to find per acceptance scenario 3

**Checkpoint**: User Story 3 complete — findability and short path to action

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: WCAG 2.1 AA, performance (SC-002), and quickstart validation

- [x] T021 [P] Use next/image for all property photos in property-detail (or equivalent) with priority and sizes for LCP and SC-002
- [x] T022 Ensure generateStaticParams exports all locales so all pages are statically generated; verify key pages load within 3 seconds per SC-002
- [x] T023 Accessibility pass: semantic HTML, aria labels where needed, keyboard navigation, focus order, and language selector semantics toward WCAG 2.1 Level AA in components/header.tsx and key pages (FR-006, SC-004)
- [x] T024 Add remaining locale content files (content/property.fr.json, .zh-Hans.json, .zh-Hant.json and booking-channels per locale) with placeholder or real copy so FR-007 is satisfied
- [x] T025 Run through quickstart.md: install, add content, dev, build, deploy steps; fix any gaps in docs or code

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — blocks all user stories
- **User Stories (Phase 3–5)**: Depend on Foundational
  - US1 can start after Phase 2 (MVP)
  - US2 can start after Phase 2 (uses same content/layout)
  - US3 can start after Phase 2; small overlap with US1/US2 (metadata, hero, location)
- **Polish (Phase 6)**: After all desired user stories are done

### User Story Dependencies

- **US1 (P1)**: No dependency on US2/US3 — implement first for MVP
- **US2 (P2)**: No hard dependency on US1; shares layout and content loader
- **US3 (P3)**: Enhances US1/US2 pages (metadata, hero, location); can be done after or in parallel with US2

### Within Each User Story

- Components that only read content can be [P]; page that composes them comes after
- Responsive/a11y tasks follow component creation

### Parallel Opportunities

- Phase 1: T003 and T004 [P]
- Phase 2: T006 [P] with T005; T009 can follow T008
- Phase 3: T012 [P]; T013 depends on T012
- Phase 4: T015 [P]; T016–T017 use T015
- Phase 6: T021 [P]; T024 [P] (content files)

---

## Parallel Example: User Story 1

```bash
# After Phase 2 complete:
# First: booking links component (parallel-safe)
Task T012: Create components/booking-links.tsx

# Then: home page that uses it
Task T013: Create app/[locale]/page.tsx
Task T014: Responsive pass on home and header
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: User Story 1  
4. **STOP and VALIDATE**: Open site, see identity + location + booking/contact link, try on mobile  
5. Deploy or demo

### Incremental Delivery

1. Setup + Foundational → run dev and see layout + selector + sample content  
2. Add US1 → home with identity, location, booking links → validate (MVP)  
3. Add US2 → property page with description, amenities, photos, policies  
4. Add US3 → metadata, hero copy, location block  
5. Polish → images, a11y, all locales, quickstart

### Parallel Team Strategy

- After Phase 2: Developer A — US1 (home + booking links); Developer B — US2 (property page + components); Developer C — US3 (metadata, hero, location) and/or Phase 6 (a11y, images).

---

## Notes

- [P] = different files, no dependencies
- [USn] maps task to user story for traceability
- Each user story is independently testable per spec
- No admin or contact form — content is file-based; contact is link-only
- Commit after each task or logical group; stop at checkpoints to validate
