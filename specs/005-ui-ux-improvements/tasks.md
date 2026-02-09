# Tasks: UI/UX Improvements

**Input**: Design documents from `specs/005-ui-ux-improvements/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested in spec; no test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Next.js App Router: `app/`, `components/`, `lib/`, `content/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment and branch

- [x] T001 Verify feature branch `005-ui-ux-improvements` and run `npm install` at repository root
- [x] T002 [P] Confirm design docs present: plan.md, spec.md, research.md, data-model.md, quickstart.md in specs/005-ui-ux-improvements/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: UI strings and content loader so all locale-dependent UI can switch language correctly. Must complete before US1 implementation that wires UI copy.

**⚠️ CRITICAL**: User story work that depends on i18n (nav, gallery, hero labels) cannot start until this phase is complete.

- [x] T003 [P] Add UI strings content files with keys for nav (property, gallery, policies), gallery (title, subtitle, viewAllPhotos, backToHome, viewGrid, viewMasonry, viewList), hero (ctaLabel) in content/ui.en.json, content/ui.fr.json, content/ui.zh-Hans.json, content/ui.zh-Hant.json
- [x] T004 Add UiStrings type and getUiStrings(locale) loader with fallback to en in lib/types.ts and lib/content.ts

**Checkpoint**: UI strings and getter ready; components can be wired in Phase 3

---

## Phase 3: User Story 1 – Consistent, Readable Visual Experience (Priority: P1) – MVP

**Goal**: Coherent visual system: centered layout, visible logo, theme dropdown with swatch and primary-colored labels, improved gallery cards, and home sections (Why choose us, Amenities, Property details, House Rules). All UI copy locale-aware.

**Independent Test**: Navigate home, property, gallery, policies; confirm centered content, full logo, theme dropdown shows swatch + colored label per theme, gallery cards have clear card styling, home shows the four new sections; switch locale and confirm all UI text updates.

### Implementation for User Story 1

- [x] T005 [US1] Center main content: in app/[locale]/layout.tsx wrap main children in a div with container mx-auto max-w-5xl px-4 md:px-6 (or apply to main); ensure gallery page can use max-w-6xl on its inner wrapper in app/[locale]/gallery/page.tsx
- [x] T006 [P] [US1] Fix header logo clipping in components/header.tsx: use object-contain, max-h-8 w-auto, remove overflow-hidden so logo is fully visible
- [x] T007 [P] [US1] Add theme swatch and primary-colored label per option in components/theme-switcher.tsx using data-theme or inline theme primary color
- [x] T008 [US1] Wire Header nav labels (Property, Gallery, Policies) from getUiStrings in components/header.tsx
- [x] T009 [US1] Wire Gallery section and Hero CTA labels from getUiStrings in components/gallery/index.tsx and components/hero.tsx
- [x] T010 [US1] Wire GalleryPageClient strings (title, subtitle, viewAllPhotos, backToHome, view mode labels) from getUiStrings in components/gallery-page-client.tsx
- [x] T011 [P] [US1] Improve gallery card styling (rounded-xl, shadow-md, border) and optional caption/overlay in components/gallery-page-client.tsx
- [x] T012 [US1] Extend property content: add optional whyChooseUs, propertyDetails, houseRules to Property type in lib/types.ts and to content/property.en.json (and fr, zh-Hans, zh-Hant) with sample content
- [x] T013 [US1] Add Why choose us, Amenities, Property details, House Rules sections to app/[locale]/page.tsx using property data and new keys; keep existing Hero, booking, gallery, location, description

**Checkpoint**: User Story 1 deliverable is complete and independently testable

---

## Phase 4: User Story 2 – Clear Feedback and State (Priority: P2)

**Goal**: Visible loading or progress feedback for delayed actions; error and missing-content states show clear, non-technical messages and a suggested next action.

**Independent Test**: Trigger navigation or content load; confirm loading/feedback appears when appropriate. Simulate or trigger an error (e.g. missing content); confirm user sees a friendly message and retry or back option.

### Implementation for User Story 2

- [x] T014 [US2] Audit and add loading or progress feedback for main navigation and content load (e.g. in app or key components) so users see response within ~1s when applicable
- [x] T015 [US2] Ensure error and missing-content states show clear non-technical messages and at least one next action (retry, go back, or alternative) in components that render property or dynamic content

**Checkpoint**: User Story 2 feedback and error handling verified

---

## Phase 5: User Story 3 – Usable on All Devices and Input Methods (Priority: P3)

**Goal**: Adequate touch targets (e.g. 44×44), reflow so key actions are reachable, and keyboard focus order with visible focus indicators.

**Independent Test**: Use site at 375px width; tap nav, theme, language, gallery toggles, and primary CTAs—confirm no mis-taps. Navigate discover → booking/contact with keyboard only; confirm visible focus at each step.

### Implementation for User Story 3

- [x] T016 [US3] Verify and fix touch targets (min 44×44 logical px) for header nav links, theme/language buttons, gallery view toggles, and primary CTAs in components/header.tsx, components/theme-switcher.tsx, components/gallery-page-client.tsx, components/booking-links.tsx
- [x] T017 [US3] Verify keyboard focus order and visible focus indicators for header, main content, footer so primary flow (discover → booking/contact) is completable without mouse

**Checkpoint**: User Story 3 accessibility and responsiveness verified

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and docs

- [x] T018 [P] Run quickstart.md verification (layout center, logo, theme dropdown, i18n switch, gallery cards, home sections) and note any doc updates in specs/005-ui-ux-improvements/quickstart.md
- [x] T019 Run `npm run build` and `npm run lint` at repository root; fix any regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1; **blocks** US1 tasks that wire UI strings (T008–T010)
- **Phase 3 (US1)**: Depends on Phase 2; T005–T007 and T011 can start after Phase 2; T008–T010 depend on T003–T004; T012 then T013 for home sections
- **Phase 4 (US2)**: Depends on Phase 3 (optional; can run after Phase 3)
- **Phase 5 (US3)**: Depends on Phase 3 (optional; can run after Phase 3)
- **Phase 6 (Polish)**: Depends on Phases 3–5 complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2; no dependency on US2/US3
- **US2 (P2)**: After US1 (or in parallel with US3)
- **US3 (P3)**: After US1 (or in parallel with US2)

### Within Phase 3 (US1)

- T005, T006, T007, T011 can run in parallel after Phase 2
- T008, T009, T010 require T003–T004
- T012 (content extension) before T013 (home page sections)

### Parallel Opportunities

- T002, T003 can run in parallel in Phase 1–2
- T005, T006, T007, T011 in Phase 3 (different files)
- T014, T015 in Phase 4 (different concerns)
- T016, T017 in Phase 5 (different concerns)
- T018, T019 in Phase 6 (T018 [P])

---

## Parallel Example: User Story 1

```text
# After Phase 2, run in parallel:
T005: Center main in app/[locale]/layout.tsx and app/[locale]/gallery/page.tsx
T006: Fix logo in components/header.tsx
T007: Theme swatch + primary label in components/theme-switcher.tsx
T011: Gallery card styling in components/gallery-page-client.tsx

# Then (after T003–T004):
T008: Header nav from getUiStrings in components/header.tsx
T009: Gallery + Hero strings in components/gallery/index.tsx, components/hero.tsx
T010: GalleryPageClient strings in components/gallery-page-client.tsx

# Then:
T012: Property content extension in lib/types.ts and content/property.*.json
T013: Home sections in app/[locale]/page.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational (T003–T004)  
3. Complete Phase 3: User Story 1 (T005–T013)  
4. **STOP and VALIDATE**: Independent test for US1 (centered layout, logo, theme dropdown, i18n, gallery cards, home sections)  
5. Deploy or demo

### Incremental Delivery

1. Setup + Foundational → UI strings ready  
2. Add US1 → Validate layout, logo, theme, i18n, gallery, home sections  
3. Add US2 → Validate loading and error feedback  
4. Add US3 → Validate touch targets and keyboard focus  
5. Polish → Quickstart verification and lint/build  

### Parallel Team Strategy

- After Phase 2: Developer A (layout, logo, theme, gallery cards); Developer B (UI strings wiring, property extension, home sections)  
- Then US2 and US3 can be split or done in sequence  

---

## Notes

- [P] = parallel-safe (different files or no shared state)
- [USn] maps task to spec user story for traceability
- No test tasks; spec does not require TDD or new tests
- Commit after each task or logical group
- Reference quickstart.md for implementation order and verification list
