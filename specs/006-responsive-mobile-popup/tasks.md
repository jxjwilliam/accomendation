# Tasks: Responsive Design and Mobile-Compatible UI

**Input**: Design documents from `specs/006-responsive-mobile-popup/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec; manual verification per quickstart.md

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Next.js App Router: `app/`, `components/`, `lib/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependencies

- [x] T001 Install qrcode.react dependency via `npm install qrcode.react` in project root
- [x] T002 [P] Verify `defaultLocale` is `zh-Hans` in `lib/i18n.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core changes that block user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Extend `DialogContent` in `components/ui/dialog.tsx` with responsive className: on viewport ≤768px use `fixed inset-0 h-screen w-full max-w-none rounded-none`; on `md:` and up retain centered modal (`md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg`)
- [x] T004 Modify `getFooterContent` in `lib/content.ts` to exclude FAQ from `modalLinks` array (retain only `modalId: "policies"`); keep `faqContent` in return value for House Rules consumption
- [x] T005 Add `prefers-reduced-motion` handling for Dialog overlay transitions: use `useReducedMotion` from `lib/use-reduced-motion.ts` or CSS `@media (prefers-reduced-motion)` to disable/simplify animations in `components/ui/dialog.tsx` per FR-007

**Checkpoint**: Dialog is full-screen on mobile; footer content excludes FAQ from modals; reduced motion honored

---

## Phase 3: User Story 1 - View and interact on mobile (Priority: P1) 🎯 MVP

**Goal**: User on smartphone can view content, open property details and Policies in full-screen overlays, access FAQ in House Rules, tap booking links without popup blockers

**Independent Test**: Open site at 375px width; tap "About {property}" and Policies; verify full-screen overlays; confirm FAQ in House Rules section; no horizontal scroll

### Implementation for User Story 1

- [x] T006 [US1] Remove FAQ modal and FAQ button from `components/footer-client.tsx`; retain only Policies modal
- [x] T007 [US1] Update `app/[locale]/page.tsx` to fetch `getFooterContent` (or `getFaqContent`); pass `faqContent` to `HomeSectionsVanhomestay`
- [x] T008 [US1] Add `faqContent` prop to `HomeSectionsVanhomestay` in `components/home-sections-vanhomestay.tsx`; render FAQ subsection after House Rules items (use `<dl>` or bullet style)
- [x] T009 [US1] Audit touch targets (buttons, links, form controls) across `components/`; ensure minimum 44×44 CSS pixels on touch devices; fix in `components/hero.tsx`, `components/booking-links.tsx`, `components/footer-client.tsx`, `components/wonderful-stay-surrey-dialog.tsx`, `components/home-sections-vanhomestay.tsx`

**Checkpoint**: US1 complete—mobile overlays full-screen, FAQ in House Rules, touch targets compliant

---

## Phase 4: User Story 2 - Responsive layout across breakpoints (Priority: P2)

**Goal**: Layout adapts smoothly from 320px to 1920px; no horizontal overflow; grid reflow at tablet breakpoints

**Independent Test**: Resize viewport 320px→1920px; verify no horizontal scroll, readable text, grid reflow at 768px and 1024px

### Implementation for User Story 2

- [x] T010 [P] [US2] Audit viewport overflow in `components/` and `app/`; fix any horizontal scroll at 320px–375px and 1920px in `components/home-sections-vanhomestay.tsx`, `components/hero.tsx`, `components/header.tsx`
- [x] T011 [US2] Ensure grid layouts in `components/home-sections-vanhomestay.tsx` reflow correctly at tablet (768px–1024px): property sections, contact info, Book Your Stay, Get in Touch
- [x] T012 [US2] Verify and fix middleware locale detection in `middleware.ts` so root `/` redirects to default locale `zh-Hans`
- [x] T013 [US2] Audit and improve title translation in `lib/seo.ts`; ensure `getDefaultTitle(locale)` returns correct per-locale titles; add `PAGE_OVERRIDES` for gallery if needed

**Checkpoint**: US2 complete—responsive layout and i18n titles working

---

## Phase 5: User Story 3 - Overlays replace popups (Priority: P3)

**Goal**: All in-scope overlays (property details, Policies) use in-page full-screen panel on mobile; no `window.open`; focus trap and return

**Independent Test**: Open property details and Policies on mobile; verify full-screen; tap close; confirm focus returns to trigger; no popup blockers

### Implementation for User Story 3

- [x] T014 [US3] Verify `WonderfulStaySurreyDialog` in `components/wonderful-stay-surrey-dialog.tsx` uses shared `Dialog` (inherits full-screen on mobile from T003)
- [x] T015 [US3] Verify Radix Dialog focus trap and focus return in `components/ui/dialog.tsx`; add explicit `aria-describedby` or close button if needed for accessibility
- [x] T016 [US3] Confirm external booking links (Airbnb, etc.) in `components/home-sections-vanhomestay.tsx` and `components/hero.tsx` use `target="_blank" rel="noopener noreferrer"` (no `window.open`)

**Checkpoint**: US3 complete—overlays accessible; no popup-blocked flows

---

## Phase 6: Extended Scope (User Input)

**Purpose**: QR code, Get in Touch icons, scroll animation (from plan user additions)

- [x] T017 [P] Create `QrCodeBadge` component in `components/qr-code-badge.tsx` with `QRCodeSVG` from qrcode.react; props: `value` (URL), `size` (default 100), `title` (accessibility)
- [x] T018 Add `QrCodeBadge` to header or footer in `components/header.tsx` or `components/footer-client.tsx`; use `getBaseUrl()` from `lib/seo.ts` for `value` (fallback to https://manna-family-hotel.vercel.app/)
- [x] T019 Add Lucide icons `MapPin`, `Phone`, `Mail` to Address, Phone, Email rows in Get in Touch section in `components/home-sections-vanhomestay.tsx`; ensure `aria-hidden` on icons; maintain min 44×44 touch target on links
- [x] T020 Extend GSAP ScrollTrigger in `components/home-sections-vanhomestay.tsx`; ensure House Rules, Book Your Stay, Get in Touch sections have `data-scroll-section` and animate on scroll (fade-up, `start: "top 85%"`); honor `useReducedMotion` to disable when `prefers-reduced-motion: reduce`

**Checkpoint**: QR code, icons, scroll animation implemented

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T021 Run full responsive audit: test at 320px, 375px, 768px, 1024px, 1920px; verify no overflow, touch targets, overlay behavior
- [x] T022 [P] Run `npm run build` to ensure no errors
- [x] T023 Execute quickstart.md verification checklist and document any deviations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies—start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1—blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 2; can run parallel to Phase 3
- **Phase 5 (US3)**: Depends on Phase 2, 3 (verification of overlay behavior)
- **Phase 6 (Extended)**: Depends on Phase 2; T017/T018 can run early; T019/T020 touch US2/US1 areas
- **Phase 7 (Polish)**: Depends on Phases 3–6 complete

### User Story Dependencies

- **US1**: Requires T003, T004, T005 (foundational)
- **US2**: Requires T003 (dialog); can overlap with US1 for layout tasks
- **US3**: Requires US1 overlay work; verification tasks

### Parallel Opportunities

- T001 and T002 can run in parallel
- T010 (US2) can run in parallel with US1 implementation
- T017 (QrCodeBadge) can run in parallel with other Phase 6 items
- T022 (build) can run after implementation

---

## Parallel Example: Phase 2 Complete → Phase 3 & 4

```bash
# After Phase 2, two developers can work in parallel:
Developer A (US1): T006 → T007 → T008 → T009
Developer B (US2): T010 → T011 → T012 → T013
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test at 375px; verify overlays, FAQ in House Rules, touch targets
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Dialog and content flow ready
2. Add US1 → Test mobile overlay + FAQ merge → Deploy (MVP)
3. Add US2 → Test responsive layout + i18n → Deploy
4. Add US3 → Verify overlay accessibility → Deploy
5. Add Phase 6 (QR, icons, scroll) → Deploy

---

## Summary

| Metric | Count |
|--------|-------|
| Total tasks | 23 |
| Phase 1 (Setup) | 2 |
| Phase 2 (Foundational) | 3 |
| Phase 3 (US1) | 4 |
| Phase 4 (US2) | 4 |
| Phase 5 (US3) | 3 |
| Phase 6 (Extended) | 4 |
| Phase 7 (Polish) | 3 |
| Parallelizable [P] | 6 |

**Suggested MVP scope**: Phases 1 + 2 + 3 (9 tasks)
