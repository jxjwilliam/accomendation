# Tasks: Animation and Scroll Effects

**Branch**: `004-animation-scroll-effects`  
**Input**: Design documents from `/specs/004-animation-scroll-effects/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested in the feature specification; no test tasks included.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on other tasks in the same phase)
- **[Story]**: User story (US1, US2, US3)
- File paths are relative to the repository root.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify environment and dependencies for animation work.

- [x] T001 Verify gsap and motion (Framer Motion) are listed in package.json and run `npm install` if needed (package.json)
- [x] T002 [P] Confirm app layout and locale layout allow client components for animation (app/layout.tsx, app/[locale]/layout.tsx)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core animation infrastructure that all user stories depend on. No user story work can begin until this phase is complete.

- [x] T003 Create a client-side hook that reads `prefers-reduced-motion: reduce` and returns a boolean, in lib/use-reduced-motion.ts
- [x] T004 Create ScrollAnimationWrapper client component using GSAP and ScrollTrigger: register ScrollTrigger once, target elements with `[data-scroll-animate]`, support types fade-up, fade-down, fade-left, fade-right, scale, rotate, with duration/delay/stagger props and trigger around top 85%; skip or use instant animation when reduce-motion is preferred; cleanup ScrollTrigger on unmount, in components/scroll-animation-wrapper.tsx

**Checkpoint**: Foundation ready — scroll wrapper and reduce-motion support are in place; user story implementation can begin.

---

## Phase 3: User Story 1 - Engaging First Impression (Priority: P1) — MVP

**Goal**: Visitors see a hero and scroll-triggered section entrances; motion feels smooth and intentional; reduced-motion preference is respected.

**Independent Test**: Load the homepage, scroll down; confirm hero and main sections (welcome, gallery, booking, location, amenities) animate into view smoothly. Enable “Reduce motion” in OS/browser and confirm motion is minimized or disabled.

- [x] T005 [P] [US1] Create Hero client component with full-viewport image carousel or single hero image using Motion for crossfade and overlay text, optional nav arrows and slide indicators, using public/images or reference-style assets, in components/hero.tsx
- [x] T006 [US1] Add Hero to the home page above existing content and ensure imagery uses public/images; keep data fetching in the server component, in app/[locale]/page.tsx
- [x] T007 [US1] Wrap welcome, gallery, booking, location, and amenities sections with ScrollAnimationWrapper and add data-scroll-animate attributes to section roots or inner blocks so each section animates on scroll into view, in app/[locale]/page.tsx
- [x] T008 [US1] Verify hero and ScrollAnimationWrapper both respect reduce-motion (no or instant animation when preferred) in components/hero.tsx and components/scroll-animation-wrapper.tsx

**Checkpoint**: User Story 1 is complete; hero and section entrances work and respect reduced motion.

---

## Phase 4: User Story 2 - Scroll-Linked Feedback and Continuity (Priority: P2)

**Goal**: Scrolling feels responsive with staggered reveals for multi-item sections; at least one scroll-linked effect (e.g. stagger) is present and in sync with scroll.

**Independent Test**: Scroll through the home page; confirm amenities and gallery items (or other multi-item sections) animate in with a staggered sequence when the section enters view. Confirm scroll is not blocked or laggy.

- [x] T009 [P] [US2] Add stagger support to ScrollAnimationWrapper so child elements with [data-scroll-animate] use delay + index * stagger, in components/scroll-animation-wrapper.tsx
- [x] T010 [US2] Apply staggered entrance to the amenities list and gallery cards on the home page by using ScrollAnimationWrapper with stagger and data-scroll-animate on list/card items, in app/[locale]/page.tsx and components/gallery/index.tsx (or gallery subcomponents)
- [x] T011 [US2] Optionally add one additional scroll-linked effect (e.g. scroll progress indicator or subtle hero parallax) and ensure it respects reduce-motion, in components/ or app/[locale]/page.tsx

**Checkpoint**: User Story 2 is complete; staggered section entrances (and optional effect) work without scroll jank.

---

## Phase 5: User Story 3 - Interactive and Micro-Interaction Polish (Priority: P3)

**Goal**: Primary buttons, links, and cards have clear hover/focus feedback; animations are short and non-blocking; reduced motion simplifies or removes micro-interactions.

**Independent Test**: Hover and focus primary CTAs and gallery/booking cards; confirm visible feedback (e.g. scale, opacity, underline). Toggle reduce-motion and confirm feedback is instant or minimal. Confirm no perceptible delay on click.

- [x] T012 [P] [US3] Add hover and focus styles or Motion variants to primary CTA buttons and BookingLinks (scale, opacity, or underline; duration under ~300ms), in components/booking-links.tsx and components/ui/button.tsx
- [x] T013 [US3] Add hover and focus feedback to gallery cards or property cards, in components/gallery/index.tsx or components/gallery/image-carousel.tsx and components/property-detail.tsx
- [x] T014 [US3] Ensure micro-interactions respect reduce-motion (instant or no animation when preferred) and do not block interaction, in components/booking-links.tsx and components/gallery/

**Checkpoint**: User Story 3 is complete; CTAs and cards have clear, quick hover/focus feedback and respect reduced motion.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Performance, stability, and validation across all stories.

- [x] T015 [P] Use viewport once (or equivalent) for scroll/entrance animations so they do not re-run when scrolling back, in components/scroll-animation-wrapper.tsx
- [x] T016 [P] Reserve space for hero and images (e.g. aspect ratio or min-height) to prevent layout shift; verify animations do not obscure CTAs or critical content, in components/hero.tsx and app/[locale]/page.tsx
- [x] T017 Run quickstart validation: manually verify scroll smoothness, reduce-motion behavior, hover/focus feedback, and absence of obvious jank per specs/004-animation-scroll-effects/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 — blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2 — MVP.
- **Phase 4 (US2)**: Depends on Phase 2; benefits from US1 layout but can be tested independently once wrapper has stagger.
- **Phase 5 (US3)**: Depends on Phase 2; independent of US1/US2.
- **Phase 6 (Polish)**: Depends on completion of all user stories you intend to ship.

### User Story Dependencies

- **US1 (P1)**: After Phase 2; no dependency on US2/US3.
- **US2 (P2)**: After Phase 2; extends ScrollAnimationWrapper (stagger); independently testable.
- **US3 (P3)**: After Phase 2; no dependency on US1/US2.

### Within Each User Story

- T005 (Hero) can run in parallel with T006/T007 prep; T006 and T007 both touch app/[locale]/page.tsx — do T006 then T007 or combine.
- US2: T009 (stagger in wrapper) before T010 (apply to page); T011 is optional.
- US3: T012 and T013 can be done in parallel (different components); T014 is verification across those components.

### Parallel Opportunities

- Phase 1: T002 [P] with T001.
- Phase 3: T005 [P] [US1] (Hero) in parallel with any prep for T006/T007.
- Phase 4: T009 [P] [US2] (stagger in wrapper) can start as soon as Phase 2 is done.
- Phase 5: T012 [P] [US3] and T013 [US3] (different files).
- Phase 6: T015 [P], T016 [P] (different files).

---

## Parallel Example: User Story 1

```text
# After Phase 2:
T005 [P] [US1] Create Hero in components/hero.tsx
# Then:
T006 [US1] Add Hero to app/[locale]/page.tsx
T007 [US1] Wrap sections with ScrollAnimationWrapper in app/[locale]/page.tsx
T008 [US1] Verify reduce-motion in hero and wrapper
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: User Story 1  
4. **STOP and VALIDATE**: Scroll home page, toggle reduce-motion, confirm hero and section entrances  
5. Deploy or demo

### Incremental Delivery

1. Setup + Foundational → scroll wrapper and reduce-motion ready  
2. Add US1 → validate hero and section entrances → MVP  
3. Add US2 → validate stagger and scroll sync  
4. Add US3 → validate hover/focus on CTAs and cards  
5. Polish → viewport once, no layout shift, quickstart validation  

### Parallel Team Strategy

- After Phase 2: Developer A — US1 (Hero + page wiring); Developer B — US2 (stagger); Developer C — US3 (micro-interactions).  
- Each story is independently testable.

---

## Notes

- [P] = different files or no dependency on other tasks in the same phase.
- [USn] maps the task to the user story for traceability.
- No backend, database, or Express; all work is in app/, components/, and lib/.
- Commit after each task or logical group; stop at any checkpoint to validate that story.
