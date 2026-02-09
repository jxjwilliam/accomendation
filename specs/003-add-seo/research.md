# Research: 003-add-seo

**Feature**: 003-add-seo  
**Date**: 2025-02-07

## 1. Next.js 15 metadata and SEO (title, description, server-rendered)

**Decision**: Use the **Next.js App Router Metadata API**: static `metadata` export or async `generateMetadata` in `layout.tsx` / `page.tsx`. All metadata is emitted in the initial HTML (server-rendered), satisfying FR-007 (crawlers that do not run client-side code can index the site). For the family hotel, provide unique titles and meta descriptions per public page (home, property, policies); use `generateMetadata` in `[locale]` layout and per-route where needed so locale-specific text is correct (FR-009).

**Rationale**: Next.js 15 documents metadata in the root and segment layouts/pages; this is the standard way to get title/description into the document head without client-side execution. Existing app already uses `metadata` in root layout and `generateMetadata` in `[locale]/layout.tsx`; we extend to per-page overrides and ensure defaults for any page without custom metadata.

**Alternatives considered**: Client-side React Helmet or similar (rejected: FR-007 requires metadata in initial response for crawlers); third-party SEO plugin (unnecessary; built-in API is sufficient).

---

## 2. Title and description length limits

**Decision**: **Titles**: aim for 50–60 characters (Google typically displays ~50–60); ensure hotel name and “Surrey” or “Vancouver BC” appear within that. **Descriptions**: aim for 150–160 characters for the main snippet; key phrases: family hotel, accommodation, comfort, fully equipped, Surrey, Vancouver BC. Validate or truncate in config/constants so metadata never exceeds ~60 (title) and ~160 (description) to avoid misleading truncation in SERPs.

**Rationale**: Major search engines use these approximate limits for snippet display; spec FR-002 and edge case (“very long titles or descriptions”) require constraints so key information is not cut off misleadingly.

**Alternatives considered**: No length limit (rejected: spec asks for “typical length limits”); longer titles/descriptions (rejected: risk of truncation in SERPs).

---

## 3. Sitemap and robots.txt

**Decision**: Use **Next.js file conventions**: (1) **`app/sitemap.ts`** — default export returns `MetadataRoute.Sitemap` (array of `{ url, lastModified?, changeFrequency? }`). Build the list from known public routes: base URL + each locale (e.g. `/[locale]`, `/[locale]/property`, `/[locale]/policies`). Use `generateStaticParams` / locale list so all indexable pages are included. (2) **`app/robots.ts`** — default export returns `MetadataRoute.Robots`: allow `/`, disallow any non-public path (if any), and set `sitemap` to the absolute sitemap URL (e.g. `https://<site>/sitemap.xml`). Base URL must come from env (e.g. `NEXT_PUBLIC_SITE_URL` or `VERCEL_URL`) for production.

**Rationale**: Next.js 15 supports `sitemap.ts` and `robots.ts` as special route handlers that output sitemap.xml and robots.txt; no extra dependencies. Single sitemap is sufficient for a small site (handful of pages × locales); `generateSitemaps` is only needed for very large URL sets.

**Alternatives considered**: Static `public/sitemap.xml` (rejected: would need manual updates when routes change); third-party sitemap package (rejected: built-in is enough).

---

## 4. Open Graph and Twitter Card metadata

**Decision**: Use Next.js **`metadata.openGraph`** and **`metadata.twitter`** in the same `metadata` / `generateMetadata` that provide `title` and `description`. For key pages (home, property): set `openGraph.title`, `openGraph.description`, `openGraph.url` (canonical), `openGraph.siteName`, `openGraph.locale` (and `alternate` locales if multi-locale). Add **`openGraph.images`** with at least one image (e.g. primary property or logo) — URL must be absolute. Optionally set `twitter.card` to `summary_large_image` and reuse title/description/image so shared links render well on Twitter/X and in messaging apps that consume OG.

**Rationale**: FR-005 requires Open Graph (or equivalent) so shared links display correct title, description, and image; Next.js Metadata API supports both OG and Twitter in one place. Absolute image URL is required by OG spec.

**Alternatives considered**: Separate OG/Twitter components (rejected: duplicate of metadata); dynamic `opengraph-image.tsx` (optional enhancement; static metadata is sufficient for MVP).

---

## 5. Structured data (JSON-LD) for local lodging business

**Decision**: Emit **schema.org LodgingBusiness** (subtype of LocalBusiness) as **JSON-LD** in a `<script type="application/ld+json">` in the document. Include: `@context`, `@type: "LodgingBusiness"`, `name`, `description` (comfort, fully equipped, family hotel in Surrey, Vancouver BC), `address` (addressCountry, addressRegion, addressLocality), `url`, and optionally `telephone`, `image`, `priceRange`, `amenityFeature`, `availableLanguage`. Serve this in the initial HTML (e.g. from root or locale layout, or a shared component that injects the script). Use a single config object (e.g. in `lib/` or `content/`) so the same data drives both metadata and JSON-LD (FR-008 consistency). For multi-locale, either one JSON-LD per locale (with `inLanguage`) or one default (e.g. English) and alternate URLs via `metadata.alternates`; prefer per-locale JSON-LD when description is translated.

**Rationale**: FR-006 and User Story 3 require structured data so validators and search engines understand the business as lodging in Surrey, Vancouver BC. LodgingBusiness is the correct schema.org type for a family hotel; LocalBusiness alone is acceptable but LodgingBusiness is more specific. JSON-LD is recommended by Google and can be validated with schema.org/Google validators.

**Alternatives considered**: Microdata or RDFa (rejected: JSON-LD is easier to maintain and preferred by search engines); Organization only (rejected: LodgingBusiness better matches “accommodation”).

---

## 6. Multi-locale SEO (next-intl and alternate URLs)

**Decision**: For each public page, expose **language alternates** via Next.js **`metadata.alternates.languages`**: map each supported locale (en, fr, zh-Hans, zh-Hant) to the same path with that locale (e.g. `en: '/en', fr: '/fr', 'zh-Hans': '/zh-Hans', 'zh-Hant': '/zh-Hant'` for home). Use **canonical** URL per page (e.g. default locale or current locale) via `metadata.alternates.canonical` to avoid duplicate-content issues. Ensure `generateMetadata` (and any JSON-LD) use the current locale so title, description, and structured data match the page language (FR-009).

**Rationale**: Spec FR-009 requires language-appropriate metadata per locale; search engines use hreflang/alternates to show the right version to users. next-intl already drives `[locale]`; we only need to wire alternates and canonical into metadata.

**Alternatives considered**: No alternates (rejected: multi-locale site should declare language variants); single canonical for all (acceptable if we pick one canonical per path).

---

## 7. Where to store SEO content and defaults

**Decision**: **Centralize** site-wide defaults (site name, default title/description, base URL, OG image path) in **config or content** (e.g. `lib/seo.ts` and/or `content/site.json`) so they can be updated with the rest of the app and stay consistent (FR-008). Per-page overrides (e.g. property page title “Property | Family Hotel …”) can live in the same file (e.g. keyed by path) or in each `page.tsx` via `generateMetadata`. No new database; file-based or code constants. Edge case “page has no custom metadata” is handled by applying site-wide default title and description in root or locale layout.

**Rationale**: Spec assumes “metadata and structured data can be driven by configuration or content in files/code”; single source of truth avoids drift between metadata, JSON-LD, and UI copy.

**Alternatives considered**: Hardcoding in every layout (rejected: harder to keep consistent); CMS (out of scope; spec says no SEO admin).

---

## 8. Validation and testing

**Decision**: **Manual/automated checks**: (1) View page source and confirm `<title>`, `<meta name="description">`, `<meta property="og:...">`, and `<script type="application/ld+json">` are present and correct. (2) Use **Google Rich Results Test** or **schema.org Validator** for JSON-LD. (3) Use **Facebook Sharing Debugger** or similar for OG preview. (4) Fetch `/sitemap.xml` and `/robots.txt` and assert they list expected URLs and allow rules. No new testing framework required; can add a simple script or Playwright test that fetches routes and checks for required meta tags and JSON-LD. E2E optional; manual validation is sufficient for SC-001–SC-005.

**Rationale**: Success criteria are about indexability, valid metadata, valid structured data, and share previews; these are verifiable with validators and curl/browser.

**Alternatives considered**: Full E2E suite for SEO (optional later); no validation (rejected: spec requires measurable outcomes).
