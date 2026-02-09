# Research: UI/UX Improvements (005)

**Branch**: `005-ui-ux-improvements`  
**Phase**: 0 – Outline & Research

## 1. Main content horizontal center alignment

**Decision**: Use a single layout pattern for all main content: wrapper with `container mx-auto max-w-5xl` (or `max-w-6xl` for gallery) and horizontal padding `px-4 md:px-6`. Apply in `[locale]/layout.tsx` to `<main>` or ensure each page uses the same class set so content is centered and not left-aligned.

**Rationale**: Tailwind’s `container` by default does not center; adding `mx-auto` centers the block. Max-width keeps line length readable (FR-006, SC-006) and matches spec “consistent visual system.”

**Alternatives considered**: Page-level only centering (rejected to avoid drift); custom CSS (rejected in favor of Tailwind utilities).

---

## 2. Header logo clipped (right side hidden)

**Decision**: Ensure the logo is not clipped: (a) give the logo link/slot a minimum width or flex that allows the image to show fully, (b) use `object-contain` and explicit dimensions or `max-h-8 w-auto` so aspect ratio is preserved and overflow is visible, (c) remove any `overflow-hidden` or fixed width on the logo container that would crop the image.

**Rationale**: Common cause is a fixed width or flex-shrink on the logo container; SVG or image then gets clipped. `object-contain` + flexible or sufficient width avoids clipping.

**Alternatives considered**: Replace logo asset (only if asset is wrong; first fix layout).

---

## 3. Theme dropdown: theme icon/swatch + label in theme primary color

**Decision**: For each theme in the dropdown: (a) show a small “swatch” (e.g. 16–20px circle or square) filled with that theme’s primary color (via inline style or a class that sets `background: var(--primary)` when that theme is active or via a data-attribute wrapper), (b) show the theme label text in that theme’s primary color (e.g. by applying the theme’s CSS variables to the menu item when hovered/selected, or by rendering a small preview div with `data-theme="id"` and using `color: var(--primary)` for the label). Use existing `lib/themes.ts` and `globals.css` theme variables; no new APIs.

**Rationale**: Users can identify themes at a glance; primary-colored text reinforces the theme choice and matches common theme-picker UIs.

**Alternatives considered**: Icon only (rejected; label in primary color is requested); server-rendered theme preview (rejected; client-side is sufficient).

---

## 4. All language context when switching language

**Decision**: Introduce a single source of UI strings per locale. Options: (A) Add `content/ui.en.json` (and fr, zh-Hans, zh-Hant) with keys for nav, gallery, hero, footer, etc., and a loader in `lib/content.ts` (e.g. `getUiStrings(locale)`); (B) Use next-intl (already in package.json) and message files. Choose (A) to keep content in the same file-based pattern as property and booking-channels and avoid migrating existing flows. Ensure every user-facing string (Header nav, Gallery headings, Hero CTA, “Back to home”, view mode labels, etc.) is read from that source so switching locale updates the whole UI.

**Rationale**: Consistency with existing `content/*.json` and `getProperty`/`getBookingChannels`; no new runtime dependency for messages; clear ownership of “UI copy” vs “property content.”

**Alternatives considered**: next-intl message files (kept for future if app grows); hardcoding per component (rejected for maintainability).

---

## 5. Gallery card box improvement (reference: cloudflare-images)

**Decision**: Improve gallery page cards (grid/masonry/list) with: (a) consistent rounded corners (e.g. `rounded-lg` or `rounded-xl`), (b) subtle shadow (`shadow-sm` / `shadow-md`) and border for definition, (c) optional caption or overlay on hover (e.g. photo index or alt) so cards feel like “cards” rather than plain images. Match the spirit of the [cloudflare-images](https://images-hub-pim.vercel.app/cloudflare-images) reference: clear card container, image inside, clean spacing. No change to image URLs or data source; styling only.

**Rationale**: Reference site uses card-style containers with rounded corners and separation; same approach meets “better gallery card box” and FR-001 (consistent visual system).

**Alternatives considered**: New gallery library (rejected; improve existing components); modal lightbox only (deferred; focus on card styling first).

---

## 6. Layout horizontal center

**Decision**: Same as (1). Single implementation: centered main content wrapper used across all locale pages.

---

## 7. Home page: Why choose us, Amenities, Property details, House Rules

**Decision**: Add four sections to the home page, aligned with the [Vancouver Home-stay](https://vanhomestay-cx93bwlb.manus.space/) structure:

- **Why choose us**: Short bullet or paragraph list (e.g. location, family-friendly, amenities summary). Source: new content keys in `property.*.json` (e.g. `whyChooseUs: string[]`) or a short paragraph in existing `description`/new field.
- **Amenities**: Already in `property.amenities`; on home, show as a dedicated section with a clear heading (same as current list but in its own “Amenities” block for hierarchy).
- **Property details**: Brief structured details (e.g. bedrooms, bathrooms, type). Source: extend `property.*.json` with optional `propertyDetails` (object or list) or derive from existing fields.
- **House Rules**: Policies summary or link. Source: `property.policies` (check-in/out, cancellation) or new `houseRules` text; link to `/policies` where appropriate.

Content strategy: Prefer extending existing `content/property.[locale].json` with optional keys (`whyChooseUs`, `propertyDetails`, `houseRules`) so one content model serves both property and home. If reference site uses different wording, mirror structure only; keep family hotel branding.

**Rationale**: Matches reference layout and improves scanability and trust (spec User Story 1); reusing property content keeps i18n and maintenance simple.

**Alternatives considered**: Separate “home-only” content files (rejected to avoid duplication); hardcoded English (rejected; all content locale-aware).
