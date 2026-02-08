# Data Model: 002-ui-new-features

**Feature**: 002-ui-new-features  
**Date**: 2025-02-07

## Entities

### 1. Footer content

Used to render the site footer on every main page.

| Field           | Type     | Description |
|----------------|----------|-------------|
| businessName   | string   | Display name of the family hotel |
| addressLine    | string   | Full address (e.g. 16727 108 Avenue, Surrey BC V4N 1N5) |
| links          | array    | List of footer links (see FooterLink) |

**FooterLink**:

| Field   | Type   | Description |
|---------|--------|-------------|
| label   | string | Link text (localized) |
| href    | string | URL path or absolute URL |
| external| boolean| Optional; open in new tab |

**Source**: Can be derived from existing `content/property.*.json` (name, location.addressLine) plus a small footer-specific structure, or a dedicated `content/footer.*.json` per locale. No new DB; file-based.

**Validation**: `businessName` and at least one link required for footer to show meaningfully.

---

### 2. Gallery / highlights (images)

Represents the set of images shown in the gallery section (marquee, carousel, scroll-trigger).

| Concept    | Type   | Description |
|-----------|--------|-------------|
| image list| string[]| Paths to images (e.g. `/images/image_001.jpg` … `/images/image_078.jpg`) |
| alt text  | string | Per-image or generic “Property photo N” for accessibility |

**Source**: Either (1) from existing `property.photos` in `content/property.*.json`, or (2) generated from `public/images/` (e.g. `lib/constants.ts` or a small module that lists image_001…image_078). Plan requires **all** images in `public/images/` to be used.

**State**: No server state; static list. Optional: order or “featured” subset in content file.

---

### 3. Booking calendar — date range and unavailable dates

Used by the Booking Calendar Card (date-range picker, “Reserved” tooltip).

| Concept         | Type    | Description |
|-----------------|---------|-------------|
| selected range  | { from: Date \| undefined, to: Date \| undefined } | Client-only; user selection |
| unavailable dates | Date[] or string[] (ISO) | Dates that show “Reserved” and are disabled |

**Unavailable dates source**: Optional file `content/unavailable-dates.json` (or per-locale) with structure:

```json
{
  "unavailable": ["2025-02-10", "2025-02-11", "2025-02-15"]
}
```

Or ranges:

```json
{
  "unavailableRanges": [
    { "from": "2025-02-10", "to": "2025-02-12" }
  ]
}
```

**Validation**: Dates as ISO 8601 date strings (YYYY-MM-DD). No server round-trip; client loads once (e.g. at build or from static JSON).

**State transitions**: User selects start date → then end date (or single date). If a date is in `unavailable`, it is disabled and shows “Reserved” on hover. No persistence of user selection required; CTA can pass selected range as query params to OTA or contact page if desired later.

---

### 4. UI / design tokens (reference only)

Not a stored entity; applied in code and Tailwind/OKLCH:

- **Glassmorphism (Booking Calendar Card)**: Frosted background, subtle border (see research.md).
- **Currency**: CAD for any price or payment copy.
- **Locale**: Vancouver/Surrey BC; mobile-first layout.

---

## Relationships

- **Footer** ↔ **Property content**: Footer may reuse business name and address from property content.
- **Gallery** ↔ **public/images**: Gallery consumes all images under `public/images/` (and optionally property.photos for ordering).
- **Booking calendar** ↔ **Unavailable dates**: Calendar component reads unavailable list to disable days and show tooltip.

---

## Out of scope (this feature)

- User accounts or login
- Persisted booking or payment
- Real-time OTA availability sync
- Backend API for availability
