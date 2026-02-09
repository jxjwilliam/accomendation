# Quickstart: UI/UX Improvements (005)

**Branch**: `005-ui-ux-improvements`  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Research**: [research.md](./research.md)

## Prerequisites

- Node 18+, npm (or equivalent)
- Repo at branch `005-ui-ux-improvements`
- Existing content: `content/property.[locale].json`, `content/booking-channels.[locale].json`

## Implementation order

1. **Layout and centering**  
   In `app/[locale]/layout.tsx`, wrap `children` in a main wrapper that applies `container mx-auto max-w-5xl px-4 md:px-6` (or apply the same class set to each page’s root so main content is horizontally centered). Ensure gallery page can use `max-w-6xl` if desired.

2. **Logo fix**  
   In `components/header.tsx`, ensure the logo container or `<img>` does not clip: e.g. `object-contain`, `max-h-8 w-auto`, and no `overflow-hidden` on the logo link. Adjust width/height if the SVG aspect ratio is wide.

3. **Theme dropdown**  
   In `components/theme-switcher.tsx`, for each theme: add a small swatch (circle/square) using that theme’s primary color and render the theme label in that primary color (e.g. wrap item in a div with `data-theme={id}` and use `var(--primary)` for the label, or use inline style from a theme→primary map). See [research.md](./research.md) §3.

4. **UI strings / i18n**  
   Add `content/ui.en.json` (and fr, zh-Hans, zh-Hant) with keys for nav (Property, Gallery, Policies), gallery (Gallery, Property photos…, View all photos →, Back to home, Grid/Masonry/List view), hero (Book Now). Add `getUiStrings(locale)` in `lib/content.ts`. Update Header, Gallery, GalleryPageClient, Hero to use these strings so switching locale updates all UI copy.

5. **Gallery cards**  
   In `components/gallery-page-client.tsx`, refine card styling: rounded corners (`rounded-lg`/`rounded-xl`), shadow (`shadow-sm`/`shadow-md`), consistent border. Optionally add a caption or overlay on hover. Keep grid/masonry/list behavior; improve visual “card” treatment. Reference: [cloudflare-images](https://images-hub-pim.vercel.app/cloudflare-images).

6. **Home sections**  
   In `app/[locale]/page.tsx`, add sections: **Why choose us**, **Amenities** (dedicated block from `property.amenities`), **Property details**, **House Rules**. Source content from `property` (extend `property.*.json` with optional `whyChooseUs`, `propertyDetails`, `houseRules` if needed). Match structure to [Vancouver Home-stay](https://vanhomestay-cx93bwlb.manus.space/); keep existing Hero, booking, gallery, location, and description.

## Verification

- All main pages: content is centered; no left-only alignment.
- Header: logo fully visible (no right-side clip).
- Theme dropdown: each option shows swatch + label in theme primary color.
- Switch locale: nav, gallery, hero, and other UI strings change to the selected language.
- Gallery page: cards have clear card styling (rounded, shadow, optional caption).
- Home: Why choose us, Amenities, Property details, House Rules sections present and readable; content locale-aware.

## Commands

```bash
npm install
npm run build
npm run dev   # Manual check of layout, header, theme, i18n, gallery, home
```

## References

- [Vancouver Home-stay (sections reference)](https://vanhomestay-cx93bwlb.manus.space/)
- [Cloudflare Images (gallery card reference)](https://images-hub-pim.vercel.app/cloudflare-images)
- [data-model.md](./data-model.md) for optional content extensions
- [contracts/README.md](./contracts/README.md) for content/UI strings shape
