# Airbnb & Multi-Channel Calendar Integration

## Overview

The booking calendar and iCal feeds use channel configuration from `content/channels/` to show availability across multiple room configs and OTAs (Airbnb, VRBO).

## Channel Config (content/channels/)

### Structure

- **airbnb.json**: Config keys `3/2`, `2/1`, `1/1` → `{ ical, room }` or array for multiple listings
- **vrbo.json**: Config keys `3`, `2`, `1` → `{ ical, propertyId }`
- **booking.json**: TODO placeholder for Booking.com

### Example (airbnb.json)

```json
{
  "3/2": { "ical": "https://...", "room": "774790483742448888" },
  "2/1": { "ical": "https://...", "room": "774835716209664374" },
  "1/1": [
    { "ical": "https://...", "room": "1153941473363493917" },
    { "ical": "https://...", "room": "1524302301585503645" },
    { "ical": "https://...", "room": "1153927871054590487", "label": "In-suite bathroom" }
  ]
}
```

## API Routes

### GET /api/sync-calendar

- Fetches iCal from channel config (`3/2`) or fallback constant
- Parses VEVENT blocks, returns JSON: `{ unavailableRanges, lastSync }`
- Used by booking calendar component via `lib/unavailable-dates.ts`

### GET /api/ical/[config]

- Proxies iCal feed for room config (e.g. `3-2`, `2-1`, `1-1`)
- Returns RFC 5545 with `Content-Type: text/calendar`
- Subscribe in Google Calendar, Apple Calendar, Outlook

## Data Flow

1. **Booking calendar**: `getUnavailableDates()` → `/api/sync-calendar` → channel config 3/2 ical → parse → display
2. **iCal subscribe**: User opens `/api/ical/3-2` or clicks "Subscribe to calendar" → proxied from channel config
3. **Book Your Stay**: `getBookingOptions()` loads channel configs, renders cards with OTA links and iCal subscribe per config

## Updating Channel Config

1. Edit `content/channels/airbnb.json` or `vrbo.json`
2. Add or update `ical`, `room` (Airbnb), or `propertyId` (VRBO)
3. Changes apply on next request (no restart needed)

## Testing

```bash
# iCal feed for 3/2 config
curl -s http://localhost:3000/api/ical/3-2 | head -20

# Sync calendar (unavailable dates)
curl http://localhost:3000/api/sync-calendar

# Dev server
npm run dev
# Navigate to #book-your-stay
```
