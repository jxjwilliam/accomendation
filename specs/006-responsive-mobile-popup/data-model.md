# Data Model: 006-responsive-mobile-popup

**Branch**: 006-responsive-mobile-popup  
**Date**: 2025-02-14

## Entities (from Spec + User Additions)

### Overlay

Conceptual overlay for property details, policies (FAQ merged into House Rules, no longer an overlay).

| Attribute | Type | Notes |
|-----------|------|-------|
| open | boolean | Controlled state |
| onOpenChange | (open: boolean) => void | Handler |
| mobileBreakpoint | number | 768 (css pixels) |
| pattern | "full-screen" \| "centered" | full-screen when viewport ≤768px |

**State**: open → closed (tap close control). Focus trap and return per FR-009.

### Viewport Breakpoint

| Attribute | Value | Usage |
|-----------|-------|-------|
| mobileMax | 768 | Overlay uses full-screen below this |
| touchTargetMin | 44 | Min width/height (CSS px) for touch elements |

### FooterContent (Modified)

| Field | Change |
|-------|--------|
| modalLinks | Exclude `modalId: "faq"`; retain Policies only |
| faqContent | No longer used by footer; passed to House Rules section |

### HouseRulesSection (Extended)

| Field | Type | Notes |
|-------|------|-------|
| houseRulesItems | existing | From property |
| faqContent | { title: string; items: { q, a }[] } | Merged FAQ; rendered inline after rules |

### QrCodeBadge Props

| Prop | Type | Notes |
|------|------|-------|
| value | string | URL, e.g. https://manna-family-hotel.vercel.app/ |
| size | number | Default 100 (px) |
| title | string | Accessibility: "Scan to visit …" |

### GetInTouch Contact Row

| Field | Type | Notes |
|-------|------|-------|
| type | "address" \| "phone" \| "email" | Determines Lucide icon |
| icon | MapPin \| Phone \| Mail | lucide-react |
| label | string | "Address", "Phone", "Email" (localized) |
| value | string | Display + href (tel:, mailto:, or plain) |

## Validation Rules

- Touch targets: Interactive elements ≥44×44px on viewport ≤768px when `(pointer: coarse)`.
- Overlay: `DialogContent` uses full viewport on mobile (inset-0, h-screen).
- QR code: `value` must be valid URL for scanning.

## State Transitions

- **Overlay**: closed → (trigger tap) → open → (close tap) → closed. Focus returns to trigger.
- **Footer modalLinks**: Policies only; FAQ removed from array.
