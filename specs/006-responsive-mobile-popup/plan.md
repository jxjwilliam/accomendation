# Implementation Plan: Responsive Design and Mobile-Compatible UI

**Branch**: `006-responsive-mobile-popup` | **Date**: 2025-02-14 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `spec.md` + user additions (barcode, FAQ merge, i18n, icons, scroll animation)

## Summary

Implement responsive design with full mobile support: (1) replace modal dialogs for property details, policies, and FAQ with full-screen panel overlays on mobile; (2) ensure touch targets and layout scale across 320px–1920px. Additional user requirements: add QR code linking to site URL, merge FAQ into House Rules section, improve i18n (Chinese default, title translation), add Lucide icons for Get in Touch (address, phone, email), and enhance scroll-triggered animations via GSAP.

## Additional Requirements (User Input)

| # | Requirement | Scope |
|---|-------------|-------|
| 1 | Responsive design to fully support mobile device | Core spec |
| 2 | Add small barcode (QR code) feature linking to https://manna-family-hotel.vercel.app/ | New |
| 3 | Change FAQ layout: remove from footer bottom, merge with House Rules section | New |
| 4 | Default lang is Chinese; improve i18n (e.g., title translation) | New |
| 5 | Add Lucide icons for address, phone, email in Get in Touch section | New |
| 6 | Add scrolling trigger action or GSAP animation to improve UI | New (extend existing GSAP) |

## Technical Context

**Language/Version**: TypeScript 5.6, React 19, Next.js 15  
**Primary Dependencies**: next-intl, GSAP (ScrollTrigger), Motion (Framer Motion), lucide-react, Radix UI, Tailwind CSS v4  
**Storage**: N/A (static content, content/ JSON)  
**Testing**: Next.js build, manual/dev testing  
**Target Platform**: Web (Vercel), mobile-first responsive  
**Project Type**: Web (Next.js App Router)  
**Performance Goals**: No layout shift (CLS); overlay animations &lt;300ms; scroll triggers viewport-near only  
**Constraints**: Honor `prefers-reduced-motion`; 44×44px touch targets on touch devices  
**Scale/Scope**: Single accommodation site; ~10 sections; 4 locales (en, fr, zh-Hans, zh-Hant); zh-Hans default  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution (`.specify/memory/constitution.md`) is template-style. No explicit violations; this feature aligns with existing Next.js/React patterns and prior specs (002, 003, 004, 005).

## Project Structure

### Documentation (this feature)

```text
specs/006-responsive-mobile-popup/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (component interfaces)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
app/
├── [locale]/
│   ├── layout.tsx       # Metadata, i18n title
│   └── page.tsx         # Home page, passes content to sections
components/
├── ui/
│   ├── dialog.tsx       # Extend for full-screen mobile variant
│   └── ...
├── footer-client.tsx    # Remove FAQ modal; keep Policies
├── home-sections-vanhomestay.tsx  # House Rules + FAQ merge, Get in Touch icons, scroll triggers
├── wonderful-stay-surrey-dialog.tsx  # Full-screen on mobile
└── qr-code-badge.tsx    # New: small QR code linking to site URL
lib/
├── i18n.ts              # defaultLocale zh-Hans
├── seo.ts               # Title/description per locale
└── content.ts           # Footer content (exclude FAQ from modalLinks)
```

**Structure Decision**: Next.js 15 App Router with `app/[locale]/`, `components/`, `lib/`. No new directories; feature touches existing components and adds one new component (`qr-code-badge`).

## Complexity Tracking

| Item | Justification |
|------|---------------|
| Full-screen Dialog variant | Required by spec FR-003; Radix Dialog supports className overrides for mobile. |
| QR code dependency | `qrcode.react` lightweight; SVG renderer, no backend. |
| GSAP ScrollTrigger | Already in project (004); extend patterns for additional sections. |
