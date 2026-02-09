# Data Model: 003-add-seo

**Feature**: 003-add-seo  
**Date**: 2025-02-07

## Entities

### 1. Page (metadata)

Represents the SEO metadata for a public, indexable page.

| Field         | Type   | Description |
|---------------|--------|--------------|
| path          | string | Route path (e.g. `/[locale]`, `/[locale]/property`, `/[locale]/policies`) |
| title         | string | Unique page title (≤ ~60 chars); reflects family hotel, Surrey, Vancouver BC where relevant |
| description   | string | Meta description (≤ ~160 chars); suitable for search snippets |
| canonicalUrl  | string | Absolute canonical URL for this page (optional; default from base URL + path) |
| ogImage       | string | Absolute URL to image for Open Graph (optional; default from site config) |

**Source**: Derived at runtime from config (`lib/seo.ts`) and/or per-route `generateMetadata`. No database; config or code.

**Validation**: Title and description length limits enforced in config or constants; required for every public page (FR-001, FR-002). Defaults applied when a page does not define custom metadata (edge case).

**Relationships**: Each page belongs to one locale when under `[locale]`; same logical page can have multiple locale variants (different title/description per language).

---

### 2. Business (Lodging) — for JSON-LD and consistency

The family hotel as a single lodging business; used in structured data and to keep metadata wording consistent (FR-008).

| Field           | Type   | Description |
|-----------------|--------|-------------|
| name            | string | Business name (e.g. family hotel name) |
| description     | string | Short description (comfort, fully equipped, family hotel, Surrey, Vancouver BC) |
| url             | string | Absolute site URL |
| address         | object | addressCountry (CA), addressRegion (BC), addressLocality (Surrey), streetAddress (optional) |
| telephone       | string | Optional contact number |
| image           | string | Optional absolute URL to primary image |
| priceRange      | string | Optional (e.g. "$$") |
| amenityFeature  | array  | Optional list of amenities (e.g. comfort, fully equipped) |
| availableLanguage | array | Optional (e.g. ["en", "fr", "zh-Hans", "zh-Hant"]) |
| checkinTime     | string | Optional (e.g. "15:00") |
| checkoutTime    | string | Optional (e.g. "11:00") |

**Source**: Single config object in `lib/seo.ts` or `content/site.json`; same data can drive both JSON-LD and default metadata. For multi-locale, description (and optionally name) can be localized.

**Validation**: Required for JSON-LD: `@type: LodgingBusiness`, `name`, `description`, `address`, `url`. Optional fields per schema.org LodgingBusiness. No implementation-specific types; structure matches schema.org so validators accept it.

**Relationships**: One business per site; referenced by every page’s JSON-LD (or injected once in layout).

---

### 3. Sitemap (list of indexable URLs)

A list of public page URLs and optional change hints for crawlers.

| Concept        | Type   | Description |
|----------------|--------|--------------|
| entries        | array  | One entry per indexable URL |
| entry.url      | string | Absolute URL |
| entry.lastModified | string (ISO 8601) | Optional |
| entry.changeFrequency | string | Optional: "always" \| "hourly" \| "daily" \| "weekly" \| "monthly" \| "yearly" |

**Source**: Generated in `app/sitemap.ts` from known routes and locales (from `lib/i18n.ts`). No stored list; computed from app structure and locale list.

**Validation**: All URLs must be absolute; only public pages (home, property, policies for each locale). No auth-only or internal paths.

**Relationships**: Sitemap references the same set of Page paths; robots.txt references the sitemap URL.

---

### 4. Crawl directives (robots)

Rules for crawlers: which paths are allowed or disallowed, and where the sitemap is.

| Concept   | Type   | Description |
|-----------|--------|-------------|
| allow     | string | e.g. "/" for full site |
| disallow  | string | Optional; e.g. "/api/" or "/private/" if any |
| sitemap   | string | Absolute URL to sitemap (e.g. https://example.com/sitemap.xml) |

**Source**: Returned by `app/robots.ts`; base URL from env (e.g. `NEXT_PUBLIC_SITE_URL` or `VERCEL_URL`).

**Validation**: Must conform to Robots Exclusion Standard; sitemap URL must be absolute.

---

## Relationships

- **Page** ↔ **Business**: Default title/description can be derived from Business name and description; JSON-LD is the Business entity.
- **Sitemap** ↔ **Page**: Sitemap entries are the set of public Page URLs (all locales × routes).
- **Robots** ↔ **Sitemap**: Robots file points to the single sitemap URL.

---

## Out of scope (this feature)

- Backend API for SEO
- Admin UI to edit metadata
- Dynamic sitemap from database (all routes are static/known)
- Multiple distinct businesses (single family hotel only)
