# Quickstart: 003-add-seo

**Branch**: `003-add-seo`  
**Prerequisites**: Plan and research completed; data-model and contracts in place.

## What this feature adds

- **Metadata**: Unique title and meta description for every public page (home, property, policies), with locale support; default when a page has no custom metadata. Title ≤ 60 chars, description ≤ 160 chars. Wording: family hotel, Surrey, Vancouver BC, accommodation, comfort, fully equipped (FR-001, FR-002, FR-008).
- **Sitemap**: `app/sitemap.ts` returning all indexable URLs (each locale × home, property, policies). Base URL from env (e.g. `NEXT_PUBLIC_SITE_URL`).
- **Robots**: `app/robots.ts` allowing `/` and pointing to absolute sitemap URL (FR-003, FR-004).
- **Open Graph & Twitter**: `metadata.openGraph` and `metadata.twitter` for key pages (title, description, image, url, locale/alternates) so shared links show correct previews (FR-005).
- **JSON-LD**: schema.org LodgingBusiness in `<script type="application/ld+json">` with name, description, address (Surrey, Vancouver BC, Canada), url, optional telephone/image/amenities; server-rendered (FR-006, FR-007). Per-locale when descriptions are translated (FR-009).
- **Alternates & canonical**: `metadata.alternates.languages` for each locale and `metadata.alternates.canonical` to support multi-locale SEO.

## Implementation order (suggested)

1. **Config**: Add `lib/seo.ts` (and optionally `content/site.json`) with site base URL, default title/description, business object for JSON-LD. Enforce title/description length. Set `NEXT_PUBLIC_SITE_URL` (or equivalent) in env for production.
2. **Root and locale layout**: Ensure root `app/layout.tsx` has sensible defaults; extend `app/[locale]/layout.tsx` `generateMetadata` to use defaults, set `openGraph`, `twitter`, `alternates` (languages + canonical). Inject LodgingBusiness JSON-LD (component or inline script).
3. **Per-page metadata**: Add or extend `generateMetadata` in `app/[locale]/page.tsx`, `app/[locale]/property/page.tsx`, `app/[locale]/policies/page.tsx` for page-specific title/description where needed; reuse OG image from config.
4. **Sitemap**: Add `app/sitemap.ts`; build list from `locales` × routes `''`, `property`, `policies`; return absolute URLs with optional `lastModified`/`changeFrequency`.
5. **Robots**: Add `app/robots.ts`; allow `/`, set `sitemap` to `baseUrl + '/sitemap.xml'`.
6. **Validation**: View source on key pages; run Google Rich Results Test and Facebook Sharing Debugger; fetch `/sitemap.xml` and `/robots.txt` and confirm URLs and rules.

## Key files (after implementation)

| Item | Path |
|------|------|
| Plan | `specs/003-add-seo/plan.md` |
| Research | `specs/003-add-seo/research.md` |
| Data model | `specs/003-add-seo/data-model.md` |
| SEO config schema | `specs/003-add-seo/contracts/seo-config-schema.json` |
| JSON-LD schema | `specs/003-add-seo/contracts/json-ld-lodging-schema.json` |
| SEO config | `lib/seo.ts` (and optional `content/site.json`) |
| Sitemap | `app/sitemap.ts` |
| Robots | `app/robots.ts` |
| JSON-LD | Component or inline in `app/[locale]/layout.tsx` (or root layout) |

## Environment

Set **`NEXT_PUBLIC_SITE_URL`** in production (e.g. `https://your-site.com`) so sitemap, robots.txt, and Open Graph use correct absolute URLs. Copy from `.env.example`; see repository root.

## Running the app

Same as existing project:

```bash
npm run dev
```

Then:

- Open home, property, policies (each locale) and view page source: check `<title>`, `<meta name="description">`, `<meta property="og:...">`, `<script type="application/ld+json">`.
- Open `http://localhost:3000/sitemap.xml` and `http://localhost:3000/robots.txt` (use production base URL in config for correct absolute URLs in production).

## Tasks

Generate concrete tasks with:

```bash
# From repo root; ensure branch 003-add-seo
.specify/scripts/bash/update-agent-context.sh cursor-agent   # if not yet run
# Then run /speckit.tasks to produce specs/003-add-seo/tasks.md
```

Implement tasks in order; mark complete in `tasks.md` as you go.
