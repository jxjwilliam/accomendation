# Contracts: 001-family-hotel-ota-app

This feature has **no HTTP API**. The app is a static-first Next.js site; contact is link-only (mailto/external URL) and content is file-based.

## Content contract

- **content-schema.json**: JSON Schema for property and booking-channel content files.
  - Used to validate `content/property.*.json` and `content/booking-channels.*.json` (or equivalent).
  - Ensures required fields (name, location, description, amenities, photos, at least one booking channel) and allowed booking types (airbnb, booking.com, vrbo, contact).

Implementations may use this schema for build-time validation or TypeScript types generated from it.
