# Data Model: UI/UX Improvements (005)

**Branch**: `005-ui-ux-improvements`  
**Phase**: 1 – Design

## Overview

This feature does not introduce new backend entities or APIs. It extends existing content structures and, optionally, adds a UI-strings content artifact for locale-aware copy.

## Existing Entities (unchanged)

- **Property** (`content/property.[locale].json`): `name`, `location`, `typeOfAccommodation`, `description`, `amenities[]`, `photos[]`, `policies`. Used by home, property, and policies pages.
- **BookingChannels** (`content/booking-channels.[locale].json`): `channels[]` (OTA links). Used by home and property.
- **Locale**: `en | fr | zh-Hans | zh-Hant` (from `lib/i18n.ts`).

## Extensions for This Feature

### 1. Property content (optional extensions)

Used to support home-page sections “Why choose us,” “Property details,” and “House Rules.”

| Field            | Type     | Purpose |
|------------------|----------|---------|
| `whyChooseUs`    | `string[]` | Bullet points or short list for “Why choose us” (optional). |
| `propertyDetails`| `object` or `string[]` | Structured details (e.g. bedrooms, bathrooms) or short list (optional). |
| `houseRules`      | `string` or `string[]` | Summary of house rules; or link text + reuse policies (optional). |

- **Validation**: If present, `whyChooseUs` is a non-empty array of strings; `propertyDetails` is either an object with known keys or an array of strings; `houseRules` is a string or array of strings.
- **State**: No state transitions; static content per locale.

### 2. UI strings (new optional artifact)

Centralized UI copy per locale so that nav, gallery, hero, and other labels respond to language switch.

| Artifact | Location | Purpose |
|----------|----------|---------|
| UI strings | `content/ui.en.json` (and `.fr`, `.zh-Hans`, `.zh-Hant`) | Keys for: nav (property, gallery, policies), gallery (title, subtitle, viewAllPhotos, backToHome, viewMode labels), hero (ctaLabel), and any other shared UI text. |

- **Shape**: Single object keyed by semantic name (e.g. `nav.property`, `gallery.title`, `hero.ctaLabel`). Values are strings.
- **Validation**: All keys required for each locale; missing locale falls back to `en`.
- **No new entities**: This is a content artifact, not a domain entity; no relationships beyond locale.

## Key Entities (spec alignment)

- **Visual system**: Implemented via Tailwind classes and existing `globals.css` (typography, spacing, theme variables). No data model.
- **User state**: Loading/error/success represented in React state and existing components; no persistent model.
- **Viewport / device context**: Handled by CSS and responsive classes; no data model.

## Summary

- No new databases or APIs.
- Optional extension of `property.*.json` for home sections.
- Optional new `content/ui.[locale].json` for UI copy.
- All existing validation and types in `lib/types.ts` remain; extend only when new property or UI keys are added.
