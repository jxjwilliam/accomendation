# Research: iCal Feed + Booking Options (007-add-ical)

## 1. iCalendar Format for Unavailable Dates

**Decision**: Use RFC 5545 iCalendar format with VEVENT blocks. Each unavailable date range becomes one VEVENT with DTSTART (VALUE=DATE) and DTEND (VALUE=DATE). DTEND is exclusive per spec; our existing parser already handles this.

**Rationale**: Matches Airbnb/VRBO iCal output. Calendar apps (Google, Apple, Outlook) parse it reliably. Existing `app/api/sync-calendar/route.ts` already parses this format.

**Alternatives considered**: JSON feed—rejected; calendar apps expect iCal. Custom format—rejected; no ecosystem support.

---

## 2. Channel Config JSON Structure

**Decision**: Separate JSON files per OTA (`content/channels/airbnb.json`, `vrbo.json`, `booking.json`). Keys are room config strings (e.g., "3/2", "2/1", "1/1" for Airbnb; "3", "2", "1" for VRBO). Value is object or array: `{ ical, room? }` or `{ ical, propertyId? }`. When multiple listings share the same config (e.g., three 1/1 rooms), use an array of options with optional `label`.

**Rationale**: Airbnb uses bedroom/bathroom (3/2); VRBO uses bedroom count only (3). Different OTAs have different ID types (room vs propertyId). Array allows multiple 1/1 options with labels (e.g., "In-suite bathroom").

**Alternatives considered**: Single merged file—rejected; OTA schemas differ. Database—rejected; spec assumes static config.

---

## 3. OTA Booking URL Patterns

**Decision**:
- **Airbnb**: `https://www.airbnb.ca/rooms/{roomId}` (optionally with `?source_impression_id=...` for attribution)
- **VRBO**: `https://www.vrbo.com/en-ca/cottage-rental/p{propertyId}?dateless=true` or `https://www.vrbo.com/.../p{propertyId}`
- **Booking.com**: TBD (TODO in spec)

**Rationale**: User provided exact formats. Airbnb room ID from `room` field; VRBO from `propertyId`. Dateless=true on VRBO opens calendar view.

---

## 4. Book Your Stay UI Extension

**Decision**: Replace single Airbnb CTA with a grid/card layout. Each card: config label (e.g., "Whole property – 3BR/2BA"), optional description, and OTA-specific buttons (Airbnb, VRBO) linking to the correct listing. When multiple 1/1 options exist, show sub-options or a grouped dropdown.

**Rationale**: Matches FR-007; users choose by config then by OTA. Reuse `hero.roomConfigs` locale strings (3BR/2BA, 2BR/1BA, 1BR/1BA).

**Alternatives considered**: Tabs per OTA—rejected; users think in terms of room size first. Single link per config—acceptable; can default to primary OTA (Airbnb) with others as secondary.
