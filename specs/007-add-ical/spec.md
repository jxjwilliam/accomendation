# Feature Specification: iCal Feed Publishing

**Feature Branch**: `007-add-ical`  
**Created**: 2026-02-15  
**Status**: Draft  
**Input**: User description: "add iCal" + extension: add booking details to extend 'Book Your Stay' section

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Subscribe to Listing Calendar (Priority: P1)

A prospective guest wants to see the listing's availability in their own calendar app (Google Calendar, Apple Calendar, Outlook) so they can plan their trip without repeatedly checking the website.

**Why this priority**: Core value of iCal—guests can subscribe once and see real-time availability in familiar tools.

**Independent Test**: Can be fully tested by opening the iCal link in a calendar app and verifying unavailable dates appear correctly; delivers immediate value without other features.

**Acceptance Scenarios**:

1. **Given** a guest is viewing the listing page, **When** they locate the iCal subscription option, **Then** they can copy or click a link to add the calendar to their app.
2. **Given** a guest has subscribed to the iCal feed, **When** availability changes (e.g., a new booking on Airbnb), **Then** their calendar reflects the updated unavailable dates on next refresh.
3. **Given** a guest opens the iCal URL directly, **When** the feed is requested, **Then** they receive a valid iCal format response showing unavailable date ranges.

---

### User Story 2 - Find iCal Link Easily (Priority: P2)

A guest or property manager needs to quickly find the iCal feed URL so they can share it or add it to their calendar.

**Why this priority**: Without discoverability, the feature has limited value.

**Independent Test**: Can be tested by verifying the iCal option is visible near the booking/availability section and the URL is accessible.

**Acceptance Scenarios**:

1. **Given** a user is on the listing page, **When** they view the availability or booking section, **Then** they see an option to subscribe or get the iCal link.
2. **Given** a user has the iCal link, **When** they share it with someone else, **Then** that person can subscribe using the same URL without additional setup.

---

### User Story 3 - Choose Booking Option and Navigate to OTA (Priority: P2)

A guest wants to book on Airbnb and can choose different accommodation options: whole property (3 bedrooms), 2 bedrooms, or 1 bedroom. Clicking an option opens the corresponding Airbnb (or VRBO, Booking.com) listing page.

**Why this priority**: Enables guests to match their group size to the right listing; core to conversion.

**Independent Test**: Can be tested by clicking each option and verifying the correct OTA page opens with the right listing ID.

**Acceptance Scenarios**:

1. **Given** a user views the Book Your Stay section, **When** they see the options (whole property, 2 bedrooms, 1 bedroom), **Then** each option is clickable and links to the correct OTA listing.
2. **Given** Airbnb options use room IDs, **When** a user clicks "Whole property (3BR/2BA)", **Then** they navigate to `https://www.airbnb.ca/rooms/{roomId}` for the 3/2 listing.
3. **Given** VRBO options use propertyIds, **When** a user clicks a VRBO option, **Then** they navigate to the correct VRBO property URL.

---

### User Story 4 - Sync with Existing Availability (Priority: P3)

The iCal feed must show the same unavailable dates that the website booking calendar displays so guests see consistent information everywhere.

**Why this priority**: Consistency prevents confusion and builds trust.

**Independent Test**: Can be tested by comparing dates in the feed with the website calendar and confirming they match.

**Acceptance Scenarios**:

1. **Given** the website calendar shows certain dates as reserved, **When** the iCal feed is fetched, **Then** those same dates appear as busy/unavailable in the feed.
2. **Given** the primary availability source (e.g., Airbnb sync) is unavailable, **When** the system falls back to static data, **Then** the iCal feed still returns valid, consistent unavailable dates.

---

### Edge Cases

- What happens when the underlying availability data is temporarily unavailable? The feed should return the last known state or a fallback; it must not return invalid or empty data without indication.
- How does the system handle high request volume for the iCal feed? The feed should remain responsive under normal web traffic.
- What if a calendar app requests the feed very frequently (e.g., every few minutes)? The system should allow standard refresh behavior without blocking or degrading performance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a public iCal feed URL that returns calendar data in standard iCalendar (.ics) format.
- **FR-002**: System MUST include all unavailable date ranges in the iCal feed, derived from the same source used by the booking calendar (Airbnb sync with fallback).
- **FR-003**: Users MUST be able to subscribe to the feed in major calendar applications (Google Calendar, Apple Calendar, Microsoft Outlook) without additional configuration.
- **FR-004**: System MUST return a valid iCal response with correct content type and structure so calendar apps can parse it.
- **FR-005**: System MUST make the iCal subscription option discoverable from the listing page, near the availability or booking section.
- **FR-006**: System MUST ensure the iCal feed stays in sync with the website's displayed availability within the normal refresh cycle.
- **FR-007**: System MUST display booking options in the Book Your Stay section: whole property (3BR/2BA), 2 bedrooms (2BR/1BA), and 1 bedroom (1BR/1BA) with links to the correct OTA listing pages.
- **FR-008**: System MUST store channel configuration (Airbnb, VRBO, Booking.com) as JSON with bedroom/bathroom config keys mapping to iCal URLs and OTA listing identifiers (room or propertyId).

### Key Entities

- **iCal Feed**: A subscribeable calendar resource that represents the listing’s availability. Key attributes: URL, unavailable date ranges, last-updated timestamp, listing identifier.
- **Unavailable Date Range**: A continuous span of dates when the listing is not available. Represents blocked or reserved periods.
- **Listing**: The accommodation property; the iCal feed is associated with one listing and reflects its availability.
- **Channel Config**: Per-OTA configuration mapping room config (e.g., 3/2, 2/1, 1/1) to iCal URL and OTA listing ID (room for Airbnb, propertyId for VRBO).

## Assumptions

- The property offers multiple configurations (whole level, 2BR, 1BR) each with its own OTA listing; the site has separate iCal feeds and booking URLs per config.
- Availability data comes from the existing sync (Airbnb iCal import with static fallback); the new feed will consume this same data.
- No authentication is required to access the iCal feed; it is intended for public subscription.
- Standard calendar app refresh intervals (e.g., daily or every few hours) are acceptable; real-time push is out of scope.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Guests can add the listing calendar to Google Calendar or Apple Calendar in under 1 minute.
- **SC-002**: The iCal feed returns a valid response in under 3 seconds under normal load.
- **SC-003**: Dates shown in the iCal feed match the website booking calendar for 100% of displayed dates.
- **SC-004**: At least 80% of users who attempt to subscribe succeed without support (based on feedback or analytics if available).
