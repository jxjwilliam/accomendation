# Quickstart: iCal + Booking Options (007-add-ical)

## Prerequisites

- Node.js 18+
- `npm install` from repo root

## Implementation Order

1. **Create channel JSON files** (`content/channels/airbnb.json`, `vrbo.json`, `booking.json`)
2. **Add `lib/channels.ts`** to load and expose channel config
3. **Add `/api/ical/[config]`** route to generate iCal from config's ical URL
4. **Create `BookingOptions` component** that renders config cards with OTA links
5. **Extend Book Your Stay** in `home-sections-vanhomestay.tsx` to use `BookingOptions`
6. **Update sync-calendar** to accept config param or aggregate multiple configs (if calendar shows combined availability)

## Key Files to Modify

| File | Change |
|------|--------|
| `content/channels/airbnb.json` | New: config → ical + room |
| `content/channels/vrbo.json` | New: bedrooms → ical + propertyId |
| `lib/channels.ts` | New: `getChannelConfig(ota)`, `getBookingOptions()` |
| `app/api/ical/[config]/route.ts` | New: fetch ical, convert to output format |
| `components/booking-options.tsx` | New: options grid with links |
| `components/home-sections-vanhomestay.tsx` | Replace single CTA with `BookingOptions` |

## Verification

```bash
# Serve iCal for 3/2 config
curl -s http://localhost:3000/api/ical/3-2 | head -20

# Check Book Your Stay section in browser
npm run dev
# Navigate to #book-your-stay, verify options and links
```
