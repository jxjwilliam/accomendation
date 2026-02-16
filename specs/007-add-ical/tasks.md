# Tasks: iCal Feed + Booking Options

**Input**: Design documents from `/specs/007-add-ical/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project structure and channel config files

- [x] T001 Verify content/channels/airbnb.json, content/channels/vrbo.json, content/channels/booking.json exist and match data-model schema in specs/007-add-ical/data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Create lib/channels.ts with getChannelConfig(ota), getBookingOptions(), and OTA URL builders (Airbnb: /rooms/{roomId}, VRBO: /en-ca/cottage-rental/p{propertyId}?dateless=true) per specs/007-add-ical/research.md

**Checkpoint**: Channel config loadable—US1 and US3 can proceed

---

## Phase 3: User Story 1 – Subscribe to Listing Calendar (Priority: P1) 🎯 MVP

**Goal**: Guests can subscribe to an iCal feed and see availability in their calendar app.

**Independent Test**: `curl http://localhost:3000/api/ical/3-2` returns valid iCal; paste URL into Google Calendar and verify unavailable dates appear.

- [x] T003 [P] [US1] Create app/api/ical/[config]/route.ts to fetch upstream ical from channel config (normalize "3-2" → "3/2"), proxy/return RFC 5545 format with Content-Type text/calendar; handle 404 for unknown config per specs/007-add-ical/contracts/api-ical-feed.md

- [x] T004 [US1] Add iCal subscription link or "Add to calendar" control near the booking/availability section (in components/booking-calendar-card.tsx or components/wonderful-stay-surrey-dialog.tsx), linking to /api/ical/3-2 for default config; ensure aria-label for accessibility

**Checkpoint**: User Story 1 complete—iCal feed works and is reachable from UI

---

## Phase 4: User Story 2 – Find iCal Link Easily (Priority: P2)

**Goal**: iCal subscription option is clearly visible near the booking section.

**Independent Test**: Open listing page, scroll to availability; iCal subscribe/copy link is visible and usable.

- [x] T005 [US2] Ensure iCal subscribe option is prominently visible in Book Your Stay or availability section in components/home-sections-vanhomestay.tsx or components/booking-calendar-card.tsx; add copyable URL and optional "Add to Google Calendar" deep link per content/ui.*.json labels if needed

**Checkpoint**: User Story 2 complete—iCal link is easy to find

---

## Phase 5: User Story 3 – Choose Booking Option and Navigate to OTA (Priority: P2)

**Goal**: Guests see room options (whole property, 2BR, 1BR) and can click to open the correct Airbnb/VRBO listing.

**Independent Test**: Click "Whole property (3BR/2BA)" → Airbnb page for room 774790483742448888; click VRBO option → correct VRBO property.

- [x] T006 [P] [US3] Create components/booking-options.tsx: grid of config cards (3/2, 2/1, 1/1) with OTA buttons; for 1/1 with multiple options show sub-options or labels; use hero.roomConfigs from UiStrings; build links via lib/channels.ts per specs/007-add-ical/data-model.md

- [x] T007 [US3] Replace single Airbnb CTA in Book Your Stay section of components/home-sections-vanhomestay.tsx with BookingOptions component; remove hardcoded AIRBNB_BOOKING_URL; pass channels and uiStrings

- [x] T008 [US3] Add any missing UI strings for booking options (e.g. "Book on Airbnb", "Book on VRBO") to content/ui.en.json and other locales if not already in footer/booking-channels

**Checkpoint**: User Story 3 complete—booking options and OTA links work

---

## Phase 6: User Story 4 – Sync with Existing Availability (Priority: P3)

**Goal**: iCal feed and website calendar use the same availability source.

**Independent Test**: Compare dates in /api/ical/3-2 with website calendar; they match.

- [x] T009 [US4] Update lib/constants.ts or app/api/sync-calendar/route.ts to read default ical URL from content/channels/airbnb.json (3/2) when available, keeping fallback to AIRBNB_ICAL_URL for backward compatibility

- [x] T010 [US4] Add error handling and fallback in app/api/ical/[config]/route.ts: when upstream iCal fetch fails, return 500 with message or optionally last cached state; document behavior in specs/007-add-ical/contracts/api-ical-feed.md if needed

**Checkpoint**: User Story 4 complete—calendar and iCal stay in sync

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and validation

- [x] T011 [P] Run quickstart verification from specs/007-add-ical/quickstart.md: `curl http://localhost:3000/api/ical/3-2`, `npm run dev`, navigate to #book-your-stay

- [x] T012 [P] Update docs/airbnb-calendar-integration.md with multi-config iCal and channel config (content/channels/*.json) usage

---

## Dependencies & Execution Order

### Phase Dependencies

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | None | Phase 2 |
| Phase 2: Foundational | Phase 1 | Phase 3–6 |
| Phase 3: US1 | Phase 2 | Phase 4 (optional) |
| Phase 4: US2 | Phase 2, 3 | — |
| Phase 5: US3 | Phase 2 | — |
| Phase 6: US4 | Phase 2, 3 | — |
| Phase 7: Polish | Phase 3–6 | — |

### User Story Dependencies

- **US1 (P1)**: After Phase 2—no other stories
- **US2 (P2)**: After Phase 2; overlaps with US1 (iCal link in UI)
- **US3 (P2)**: After Phase 2—independent of US1/US2
- **US4 (P3)**: After Phase 2, 3—extends iCal and sync behavior

### Within Each User Story

- T003 before T004 (API before UI link)
- T006 before T007 (component before integration)
- T009 before T010 (config before error handling)

### Parallel Opportunities

- T003, T006 can run in parallel after Phase 2 (different files)
- T011, T012 can run in parallel (different files)
- US3 (T006–T008) and US1 (T003–T004) can be developed in parallel after Phase 2

---

## Parallel Example: User Story 1 + User Story 3

```bash
# After Phase 2, two developers can work in parallel:
# Developer A (US1):
Task T003: Create app/api/ical/[config]/route.ts
Task T004: Add iCal subscription link in booking-calendar-card or dialog

# Developer B (US3):
Task T006: Create components/booking-options.tsx
Task T007: Replace CTA in home-sections-vanhomestay.tsx
Task T008: Add UI strings
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T001 → T002 (Setup + Foundational)
2. T003 → T004 (iCal API + UI link)
3. **STOP and VALIDATE**: `curl /api/ical/3-2`, add to Google Calendar
4. Deploy/demo if ready

### Incremental Delivery

1. **Foundation**: T001–T002
2. **MVP**: T003–T004 (US1) → validate → deploy
3. **Discoverability**: T005 (US2) → validate
4. **Booking options**: T006–T008 (US3) → validate → deploy
5. **Sync**: T009–T010 (US4) → validate
6. **Polish**: T011–T012

### Parallel Team Strategy

- Phase 1–2: Together
- After Phase 2: Dev A = US1 (T003–T004, T005), Dev B = US3 (T006–T008)
- Then: US4 (T009–T010) and Polish (T011–T012)

---

## Notes

- [P] tasks use different files with no blocking dependencies
- [Story] label maps to spec.md user stories
- No test tasks—spec does not require TDD
- Commit after each task or logical group
- Channel JSON files already exist from planning phase
