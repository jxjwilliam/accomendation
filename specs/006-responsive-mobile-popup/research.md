# Research: Responsive Design and Mobile-Compatible UI (006-responsive-mobile-popup)

**Branch**: 006-responsive-mobile-popup  
**Date**: 2025-02-14  
**Reference**: Spec [spec.md](./spec.md), [Manna Family Hotel](https://manna-family-hotel.vercel.app/), prior specs 004 (animation), 003 (SEO)

## 1. QR Code / Barcode Library

**Decision**: Use **qrcode.react** with `QRCodeSVG` for a small QR code linking to `https://manna-family-hotel.vercel.app/`.

**Rationale**:
- React-native component; lightweight SVG output (no canvas, no image hosting).
- `value` prop accepts URL string; `size` allows small badge (e.g., 80–120px).
- Supports `title` for accessibility. No backend required.
- [qrcode.react](https://github.com/zpao/qrcode.react) is well-maintained, TypeScript-friendly.

**Alternatives considered**:
- **next-qrcode**: More options but heavier; not needed for static URL.
- **Server-side image**: Adds route and caching; SVG is simpler for client render.
- **Manual SVG generation**: Avoid reimplementing QR encoding.

**Implementation**: `npm install qrcode.react`. Create `QrCodeBadge` component with `value={siteUrl}`, `size={100}`, `title="Scan to visit Manna Family Hotel"`. Place in header or footer per design preference.

---

## 2. Full-Screen Dialog on Mobile (Overlay Pattern)

**Decision**: Extend Radix UI `Dialog` with responsive `className`: on viewport ≤768px, apply `fixed inset-0 h-screen w-full max-w-none rounded-none` to `DialogContent` to achieve full-screen panel. Radix already provides focus trap and focus return; no extra logic required.

**Rationale**:
- Spec FR-003: overlays on mobile MUST use full-screen panel.
- Radix Dialog (`@radix-ui/react-dialog`) supports `asChild` and arbitrary `className`; Tailwind can override `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` with `inset-0` on mobile via `md:` breakpoint.
- Existing `dialog.tsx` uses `max-w-lg`; add `md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg` and `inset-0 md:inset-auto` for mobile full-screen.

**Alternatives considered**:
- **Separate Sheet component**: More code; Dialog can achieve same with CSS.
- **Headless UI Dialog**: Project uses Radix; stay consistent.
- **Drawer from bottom**: Spec chose full-screen panel; tap-to-close only.

---

## 3. FAQ Merge with House Rules (Layout Change)

**Decision**: Remove FAQ from footer modal links. Add FAQ as an inline subsection within the House Rules section (`home-sections-vanhomestay.tsx`). Structure: House Rules items first, then a "FAQ" or "常見問題" subsection with `{q}` / `{a}` pairs. Pass `faqContent` from page/layout to `HomeSectionsVanhomestay`; `getFooterContent` excludes FAQ from `modalLinks`.

**Rationale**:
- User requirement: "remove FAQ from bottom, merge with House Rules".
- Content is static (`content/footer.*.json` or `lib/content.ts` faqByLocale); no API change.
- Reduces footer modal count; improves discoverability of FAQ near policies.

**Data flow**: `app/[locale]/page.tsx` fetches `getFooterContent` (or a shared `getFaqContent`) and passes `faqContent` to `HomeSectionsVanhomestay`. `FooterClient` receives `modalLinks` without FAQ; `policiesContent` stays for Policies modal.

---

## 4. i18n and Title Translation (Chinese Default)

**Decision**: (1) Keep `defaultLocale: "zh-Hans"` in `lib/i18n.ts`. (2) Ensure `generateMetadata` and `getDefaultTitle` use locale-aware titles; `lib/seo.ts` already has `DEFAULT_TITLES` per locale. (3) Add `defaultLocale` or `locale` to `next-intl` config so redirects/default routes use `zh-Hans`. (4) Audit page-specific titles (gallery, etc.) for translation.

**Rationale**:
- User: "default lang is Chinese, improve i18n, title translation".
- `lib/i18n.ts` already defines `defaultLocale: "zh-Hans"`.
- `lib/seo.ts` has `zh-Hans` title: "吗哪家庭旅馆 | 素里 温哥华 BC". Verify middleware/locale detection routes to `zh-Hans` when no locale in path; add `PAGE_OVERRIDES` in `seo.ts` for gallery if needed.
- next-intl middleware: ensure `localeDetection` / `defaultLocale` is set in provider config.

**Alternatives considered**:
- Root redirect to `/zh-Hans`: Standard for next-intl; verify middleware does this.
- Separate title keys per page: Use `getDefaultTitle(locale, pathSegment)` with `PAGE_OVERRIDES` for gallery and other pages.

---

## 5. Lucide Icons for Get in Touch (Address, Phone, Email)

**Decision**: Use `MapPin`, `Phone`, `Mail` from `lucide-react` in the Get in Touch section. Place icon before each label; maintain 44×44px touch target for links (wrap `<a>` in flex container with `min-h-11 min-w-11` or equivalent).

**Rationale**:
- Project already uses `lucide-react` (footer, home sections).
- Icons improve scanability and match "stunning" UI goal.
- Accessibility: `aria-hidden` on decorative icons; link text remains primary.

**Implementation**: In `home-sections-vanhomestay.tsx` Get in Touch block, add icon per row: Address (`MapPin`), Phone (`Phone`), Email (`Mail`). Style with `h-5 w-5` or similar; ensure sufficient contrast.

---

## 6. Scroll Trigger and GSAP Animation

**Decision**: Extend existing GSAP ScrollTrigger usage (see `home-sections-vanhomestay.tsx` and spec 004). Apply `data-scroll-section` to additional sections if not already present; ensure House Rules, Get in Touch, Book Your Stay animate on scroll (fade-up, `start: "top 85%"`). Honor `useReducedMotion` hook; disable or simplify when `prefers-reduced-motion: reduce`.

**Rationale**:
- User: "add scrolling trigger action, or GSAP animation if possible".
- Project already has `gsap` and `ScrollTrigger` registered; `home-sections-vanhomestay` uses `[data-scroll-section]` with fade-up.
- Spec 004 research: `start: "top 85%"`, `toggleActions: "play none none none"`, `viewport={{ once: true }}` equivalent.
- No new dependency; refine or add `data-scroll-section` to sections that lack it.

**Alternatives considered**:
- **Motion only**: Possible, but GSAP already in use; keep consistency.
- **CSS scroll-driven animations**: Limited support; GSAP is proven.

---

## Summary Table

| Topic | Decision | Source |
|-------|----------|--------|
| QR code library | qrcode.react, QRCodeSVG | Research, Context7 |
| Full-screen modal | Radix Dialog + responsive className | Spec FR-003 |
| FAQ layout | Merge into House Rules; remove from footer | User input |
| i18n default | zh-Hans; verify middleware and titles | lib/i18n, lib/seo |
| Get in Touch icons | MapPin, Phone, Mail (lucide-react) | User input |
| Scroll animation | GSAP ScrollTrigger, existing pattern | Spec 004, home-sections |
