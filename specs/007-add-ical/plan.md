# Implementation Plan: iCal Feed + Booking Options

**Branch**: `007-add-ical` | **Date**: 2026-02-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-add-ical/spec.md` + extension: add booking details to extend Book Your Stay section

## Summary

Implement iCal feed publishing so guests can subscribe to listing availability in calendar apps, and extend the Book Your Stay section with per-option booking links (whole property, 2BR, 1BR). Store channel configuration (Airbnb, VRBO, Booking.com) in JSON files keyed by bedroom/bathroom config, mapping to iCal URLs and OTA listing identifiers.

## Technical Context

**Language/Version**: TypeScript 5.6  
**Primary Dependencies**: Next.js 15, React 19, Tailwind CSS v4, Shadcn UI  
**Storage**: JSON files in `content/channels/` (airbnb.json, vrbo.json, booking.json)  
**Testing**: `npm run lint`, manual browser verification  
**Target Platform**: Web (Vercel)  
**Project Type**: web (Next.js App Router)  
**Performance Goals**: iCal feed response <3s, page load within Core Web Vitals  
**Constraints**: Static export compatible; no serverless DB  
**Scale/Scope**: Single property, multiple room configs, 3 OTA channels

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution file (`.specify/memory/constitution.md`) contains placeholder content. No explicit gates defined. Proceeding with standard practices: maintain existing structure, avoid unnecessary complexity.

## Project Structure

### Documentation (this feature)

```text
specs/007-add-ical/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── checklists/
```

### Source Code (repository root)

```text
app/
├── [locale]/
│   └── page.tsx
├── api/
│   ├── sync-calendar/route.ts    # Existing; extend for multi-source
│   └── ical/[config]/route.ts    # New: iCal feed per room config
components/
├── home-sections-vanhomestay.tsx  # Extend Book Your Stay section
├── booking-options.tsx            # New: option cards with OTA links
└── booking-calendar-card.tsx
content/
├── channels/
│   ├── airbnb.json               # Config: roomConfig -> { ical, room }
│   ├── vrbo.json                 # Config: bedrooms -> { ical, propertyId }
│   └── booking.json              # TODO placeholder
├── unavailable-dates.json
└── ui.*.json
lib/
├── constants.ts
├── content.ts
├── unavailable-dates.ts
├── channels.ts                    # New: load channel config
└── types.ts
```

**Structure Decision**: Extend existing Next.js App Router layout. Channel config as static JSON under `content/channels/`. New API route for iCal feed generation. Book Your Stay section receives booking options component.

## Complexity Tracking

*None—extending existing patterns.*
