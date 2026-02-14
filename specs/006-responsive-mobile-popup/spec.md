# Feature Specification: Responsive Design and Mobile-Compatible UI

**Feature Branch**: `006-responsive-mobile-popup`  
**Created**: 2025-02-14  
**Status**: Draft  
**Input**: User description: "responsive design + replace popupwindow for compatible with modile device"

## Clarifications

### Session 2025-02-14

- Q: Which overlay pattern on mobile—bottom sheet, full-screen panel, or adaptive? → A: Full-screen panel only
- Q: Is swipe-to-dismiss mandatory or optional for overlays? → A: Tap-to-close only; swipe is optional
- Q: Scope—which overlays are in scope (lightbox, date picker, dropdowns)? → A: Only property details, policies, FAQ; lightbox, date picker popover, and theme/language dropdowns remain unchanged
- Q: Loading/error states when overlay content is fetched? → A: Assume static content; no loading or error states required
- Q: Must overlays trap focus and return focus to trigger on close for accessibility? → A: Yes, required for overlays

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and interact with content on mobile devices (Priority: P1)

A user visiting the accommodation site on a smartphone can view all content, navigate sections, open property details, policies, FAQ, and booking information without popup blockers or layout issues. Touch targets are large enough, text is readable without zooming, and overlays adapt to small screens.

**Why this priority**: Core value—users on mobile (a significant share of accommodation site traffic) must be able to complete primary tasks without frustration.

**Independent Test**: Open the site on a 375px-width device; verify all sections render, tap the booking/property CTA, open Policies and FAQ. Confirm no blocked popups and no horizontal scroll.

**Acceptance Scenarios**:

1. **Given** a user on a mobile viewport (≤768px), **When** they tap a trigger that previously opened a popup or modal, **Then** content appears in a full-screen panel overlay rather than a centered modal that may be cut off or require zoom.
2. **Given** a user on any device, **When** they open overlays (property details, policies, FAQ), **Then** content scrolls within the overlay when it exceeds viewport height.
3. **Given** a user on a mobile device, **When** they tap external booking links (e.g., Airbnb), **Then** links open in a new tab or in-app without being blocked by popup blockers.

---

### User Story 2 - Responsive layout across breakpoints (Priority: P2)

A user resizing their browser or using different devices (phone, tablet, desktop) sees a layout that adapts smoothly. Content does not overflow, images scale appropriately, and navigation remains usable at all widths.

**Why this priority**: Supports accessibility and multi-device usage without requiring separate mobile/desktop versions.

**Independent Test**: Resize viewport from 320px to 1920px; verify no horizontal scroll, readable text, and sensible breakpoint transitions.

**Acceptance Scenarios**:

1. **Given** any viewport width, **When** the page loads, **Then** content fits within the viewport with appropriate padding and no horizontal overflow.
2. **Given** a tablet viewport (768px–1024px), **When** the user views the homepage, **Then** grid layouts (e.g., property sections, contact info) reflow to 1–2 columns as appropriate.
3. **Given** a small mobile viewport (320px–375px), **When** the user interacts with forms or calendars, **Then** inputs and controls remain usable with adequate touch target size (minimum 44×44 CSS pixels).

---

### User Story 3 - Overlays replace popup windows for mobile compatibility (Priority: P3)

Where the application previously relied on popup windows (browser `window.open`) or modal dialogs that behave poorly on mobile, those patterns are replaced with in-page overlays (sheets, drawers, or full-width modals) that work reliably on touch devices and are not blocked by popup blockers.

**Why this priority**: Ensures compliance with mobile constraints; popup blockers and small modals are common failure points on mobile.

**Independent Test**: Identify all triggers that open secondary content; verify each uses an in-page overlay that works on mobile, and no `window.open` or equivalent popup pattern remains for core flows.

**Acceptance Scenarios**:

1. **Given** property detail, Policies, or FAQ triggers, **When** opened on mobile, **Then** content appears in a full-screen panel overlay (uses full viewport height), not a small centered modal.
2. **Given** any overlay, **When** the user taps a close control, **Then** the overlay dismisses predictably. (Swipe-to-dismiss is optional.)
3. **Given** the site has no flows that require `window.open`, **When** a user completes primary tasks, **Then** no popup blocker interferes with the experience.

---

### Edge Cases

- What happens when the user rotates the device while an overlay is open? Overlay should reflow or maintain usability (e.g., full height on portrait, appropriate width on landscape).
- How does the system handle very long content (e.g., lengthy FAQ) in overlays? Content scrolls within the overlay; overlay itself stays fixed and dismissible.
- What happens when the user has reduced motion preferences? Overlay transitions should respect `prefers-reduced-motion` (e.g., instant open/close instead of slide animation).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST adapt layout, typography, and spacing to viewport size so that content is readable and usable on viewports from 320px to 1920px width.
- **FR-002**: System MUST use in-page overlays instead of `window.open` or popup windows for property details, policies, and FAQ. (Gallery lightbox, date picker popover, and theme/language dropdowns are out of scope.)
- **FR-003**: Overlays opened on mobile viewports (≤768px) MUST use a full-screen panel (occupies full viewport height) rather than a small centered modal that may be cut off.
- **FR-004**: Touch targets for interactive elements (buttons, links, form controls) MUST meet a minimum size of 44×44 CSS pixels on touch-capable devices.
- **FR-005**: Overlays MUST allow scrolling when content exceeds viewport height; the overlay container remains fixed and dismissible.
- **FR-006**: External booking links (Airbnb, Booking.com, VRBO) MUST open in a new tab when tapped; behavior MUST NOT rely on `window.open` in a way that triggers popup blockers.
- **FR-007**: System MUST respect user `prefers-reduced-motion` for overlay open/close transitions.
- **FR-009**: Overlays MUST trap focus within the overlay while open and return focus to the trigger element when closed (keyboard and screen reader accessibility).
- **FR-008**: No core user flow MUST depend on browser popup windows (`window.open`) that can be blocked on mobile.

### Key Entities

- **Overlay**: A secondary content panel that appears over the main page. On mobile (≤768px), overlays use a full-screen panel pattern; on desktop, a centered modal. Has open/close state, scrollable content area, dismiss control, focus trap (focus remains within overlay until closed), and focus return to trigger on close.
- **Viewport Breakpoint**: A width threshold (e.g., 768px) used to decide whether to render mobile or desktop overlay patterns.

## Extended Scope (from `/speckit.plan` user input)

The following items are incorporated into the implementation plan (see `plan.md`) alongside the core spec:

- **QR code**: Small barcode/QR code linking to https://manna-family-hotel.vercel.app/
- **FAQ layout**: Remove FAQ from footer; merge into House Rules section
- **i18n**: Default locale Chinese (zh-Hans); improve title translation
- **Get in Touch icons**: Lucide icons (MapPin, Phone, Mail) for address, phone, email
- **Scroll animation**: Extend GSAP ScrollTrigger for additional sections

## Out of Scope

- Gallery lightbox, date picker popover, and theme/language dropdowns: no changes required for this feature.
- Loading and error states for overlay content: content is static/page-rendered; no spinner or error handling required.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users on mobile viewports (≤768px) can complete property discovery, policy review, FAQ consultation, and booking link access without encountering a blocked popup or unusable overlay.
- **SC-002**: At least 95% of tested viewport sizes (320px–1920px) render without horizontal overflow or content cut-off.
- **SC-003**: All interactive elements meet the 44×44 CSS pixel minimum touch target on touch devices.
- **SC-004**: Overlay open/close interactions work reliably on mobile (no failure due to popup blocking or viewport constraints).
- **SC-005**: Layout and overlay behavior pass a responsive design audit on at least three breakpoints (mobile, tablet, desktop).
