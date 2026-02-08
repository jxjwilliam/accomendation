# Data Model: Family Hotel OTA Web App

**Feature**: 001-family-hotel-ota-app  
**Date**: 2025-02-07

Content is file-based (no database). The following describes the shape of content entities used by the app, with validation rules derived from the spec.

---

## 1. Property

Represents the family hotel (single property per spec).

| Field | Type | Required | Validation / Notes |
|-------|------|----------|--------------------|
| name | string | Yes | Hotel name; displayed as identity (FR-001) |
| location | object | Yes | See Location below |
| typeOfAccommodation | string | Yes | e.g. "Family hotel"; (FR-001) |
| description | string | Yes | Property description (FR-002) |
| amenities | string[] | Yes | List of amenities (FR-002) |
| photos | string[] | Yes | Paths under public/ or URLs; at least one (FR-002) |
| policies | object | Optional | See Policies below; or link to external (FR-002) |

**Location** (nested):

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| city | string | Yes | e.g. "Surrey" |
| region | string | Yes | e.g. "Vancouver BC" or "British Columbia" |
| country | string | Yes | e.g. "Canada" |
| addressLine | string | Optional | Full address if desired |

**Policies** (nested, optional):

| Field | Type | Notes |
|-------|------|--------|
| checkInOut | string | Text or HTML snippet |
| cancellation | string | Text or HTML snippet |
| externalUrl | string | If policies live elsewhere |

**State / lifecycle**: Content is static; no state transitions. Updates by editing files and redeploying (FR-005).

**i18n**: All user-facing fields (name, description, amenities, policies text) exist per locale. Structure: either one file per locale (e.g. `property.en.json`) or one file with nested keys by locale.

---

## 2. Booking channel

External booking or contact path; multiple channels per spec (Airbnb, Booking.com, VRBO, contact).

| Field | Type | Required | Validation / Notes |
|-------|------|----------|--------------------|
| type | string | Yes | One of: "airbnb" \| "booking.com" \| "vrbo" \| "contact" |
| label | string | Yes | Display label (e.g. "Book on Airbnb"); i18n per locale |
| url | string | Yes | Absolute URL (listing or mailto: or tel:) |
| openInNewTab | boolean | Optional | Default true for external links |

**Identity**: No unique ID required; order in array can define display order.

**Validation**: `url` must be valid and use `https:`, `mailto:`, or `tel:` for contact type. Broken links are an edge case (spec: site should still offer alternative path).

**i18n**: `label` is locale-specific (one file per locale or keyed by locale).

---

## 3. Owner / maintainer (metadata only)

No stored entity. The person who updates content is the "owner/maintainer"; they edit files in the repo and redeploy. No login or admin entity in the data model.

---

## 4. Content file layout (implementation)

- **property**: `content/property.[locale].json` or `content/property.json` with `{ "en": { ... }, "fr": { ... }, "zh-Hans": { ... }, "zh-Hant": { ... } }`.
- **booking channels**: `content/booking-channels.[locale].json` or same structure in a single file keyed by locale.
- **Images**: Paths in `photos` are relative to `public/` (e.g. `images/photo1.jpg`) or absolute URLs.

---

## 5. Validation rules (from spec)

- At least one booking channel must be present (FR-003).
- At least one photo (FR-002).
- Location must include Surrey, Vancouver BC, Canada (FR-001).
- All user-facing text must be available in en, fr, zh-Hans, zh-Hant (FR-007).
