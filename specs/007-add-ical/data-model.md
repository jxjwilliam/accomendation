# Data Model: iCal + Booking Options (007-add-ical)

## Entities

### Channel Config (Airbnb)

**File**: `content/channels/airbnb.json`

| Field      | Type              | Description |
|-----------|-------------------|-------------|
| `[config]`| object \| array   | Key: "3/2", "2/1", "1/1". Value: single option or array of options |
| `.ical`   | string            | iCal feed URL |
| `.room`   | string            | Airbnb room ID for booking URL |
| `.label`? | string            | Optional disambiguator (e.g., "In-suite bathroom") |

**Validation**: Each config key must have at least one entry; `ical` and `room` required for each option.

---

### Channel Config (VRBO)

**File**: `content/channels/vrbo.json`

| Field        | Type   | Description |
|-------------|--------|-------------|
| `[bedrooms]`| object | Key: "3", "2", "1". Value: `{ ical, propertyId }` |
| `.ical`     | string | iCal feed URL |
| `.propertyId` | string | VRBO property ID |

**Validation**: `ical` and `propertyId` required.

---

### Channel Config (Booking.com)

**File**: `content/channels/booking.json`

Placeholder for future. Same pattern: config key → `{ ical, listingId }` or equivalent.

---

### Booking Option (Runtime)

**Type**: Used by Book Your Stay UI

| Field         | Type   | Description |
|--------------|--------|-------------|
| `configKey`  | string | "3/2", "2/1", "1/1" or "3", "2", "1" |
| `label`      | string | Display label from locale |
| `links`      | Link[]| Per-OTA booking URLs |
| `icalUrl`?   | string | Optional: subscribe link for this config |

---

### Link (OTA)

| Field | Type   |
|-------|--------|
| `ota` | "airbnb" \| "vrbo" \| "booking.com" |
| `url` | string |
| `label`| string |

---

## State Transitions

None. Config is static; loaded at build/runtime from JSON.

---

## Relationships

```
Channel Config (airbnb.json)
  └── config "3/2" → { ical, room }
  └── config "2/1" → { ical, room }
  └── config "1/1" → [ { ical, room }, { ical, room, label }, ... ]

Booking Option (UI)
  └── aggregates links from multiple channel configs for same configKey
```
