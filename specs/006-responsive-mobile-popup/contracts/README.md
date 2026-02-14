# Contracts: 006-responsive-mobile-popup

**Branch**: 006-responsive-mobile-popup  
**Date**: 2025-02-14

This feature is frontend-only. No REST/GraphQL APIs. Contracts below define component interfaces and content shapes.

---

## 1. DialogContent (Mobile Full-Screen)

**File**: `components/ui/dialog.tsx`

**Requirement**: On viewport width ≤768px, `DialogContent` MUST render full-screen (inset-0, h-screen, max-w-none). On larger viewports, retain centered modal behavior.

**Props**: Unchanged from Radix `Dialog.Content`. Behavior change via `className` and Tailwind responsive utilities.

**Pseudo-contract**:
```
DialogContent: when viewport <= 768px → full-screen overlay
             when viewport > 768px  → centered modal (current behavior)
```

---

## 2. QrCodeBadge

**File**: `components/qr-code-badge.tsx` (new)

**Props**:
```ts
interface QrCodeBadgeProps {
  value: string;           // URL to encode (required)
  size?: number;           // Default 100
  title?: string;          // Accessibility, default "Scan to visit site"
  className?: string;
}
```

**Behavior**: Renders QR code (SVG) linking to `value`. Wrapped in anchor `<a href={value}>` or standalone per placement. `title` for screen readers.

---

## 3. HomeSectionsVanhomestay (Extended)

**File**: `components/home-sections-vanhomestay.tsx`

**New Props**:
```ts
faqContent?: { title: string; items: { q: string; a: string }[] };
```

**Behavior**: House Rules section renders `houseRulesItems` (or legacy rules), then FAQ subsection if `faqContent` present. FAQ uses same bullet style or `<dl>` structure.

---

## 4. FooterContent (Modified)

**File**: `lib/content.ts` – `getFooterContent`

**Change**: `modalLinks` array MUST NOT include `{ modalId: "faq" }`. Retain only `{ modalId: "policies" }`.

**Output shape**: Unchanged; `faqContent` can remain in return value for consumption by House Rules (page passes it to HomeSectionsVanhomestay). Alternatively, add `getFaqContent(locale)` and have page call both.

---

## 5. Get in Touch Section (Icons)

**File**: `components/home-sections-vanhomestay.tsx`

**Contract**: Each contact row (Address, Phone, Email) MUST include a Lucide icon (`MapPin`, `Phone`, `Mail`) with `aria-hidden`, placed before the label. Links retain `min-h-11 min-w-11` or equivalent for 44×44 touch target.

---

## 6. Metadata / i18n Titles

**File**: `lib/seo.ts`, `app/[locale]/layout.tsx`

**Contract**: `getDefaultTitle(locale)` returns locale-appropriate title. For `zh-Hans`, use "吗哪家庭旅馆 | 素里 温哥华 BC". Root `/` or missing locale MUST redirect to default locale (`zh-Hans`) and show corresponding title.
